/* jshint node: true */
/* jshint esversion: 6 */
"use strict";

const util = require("util");
const handlers = [];
const namePattern = /([^~]*)?([~]+[^~]*)/g;
const whiskerPattern = /^~([^=]*)=?(.*)/;
const baseHints = [ "text", "container", "form", "submit", "link", "content" ];
const YAML = require("yamljs");
const path = require("path");
const fs = require("fs");
const url = require("url");
const nodesAndTemplates = require("./util").nodesAndTemplates;

let addHandler = (fn) => handlers.push(fn);
let hasBaseHint = (node) => node.spec.hints.some((h) => baseHints.indexOf(h) !== -1);
let hasHint = (node, hint) => node.spec && node.spec.hints && node.spec.hints.some((h) => h === hint);
let hasNoBaseHint = (node) => !hasBaseHint(node);
let isDataProperty = (node) => !node.spec;

function hasWhisker(key) {
  return function (node) {
    for (let whisker of node.whiskers) {
      if (whisker.key === key) return true;
    }
  };
}

function* filter(iterable, predicate) {
  for (let r of iterable) {
    if (predicate(r)) yield r;
  }
}

function* iterate() {
  /*jshint validthis:true */
  yield this;
  
  if (this.value && util.isObject(this.value)) {
    for (let p in this.value) {
      for (let node of this.value[p]) {
        yield node;
      }
    }
  }
}

function parseWhisker(whisker) {
  let result = {};
  let m = whiskerPattern.exec(whisker);
  result.key = m[1] || null;
  result.value = m[2];
  
  return result;
}

function parse(name, value) {
  let match, whiskers = [], propertyName;
  name = name || null;
  
  if (name) {
    if (name.indexOf("~") === -1) propertyName = name;
    else {
      match = namePattern.exec(name);
      while (match) {
        if (match[1]) propertyName = match[1];
        if (match[2]) whiskers.push(parseWhisker(match[2]));
        match = namePattern.exec(name);
      }
    }
  }
  
  let childOutput, 
    outputValue = util.isArray(value) ? [] : {};
    
  if (util.isArray(value)) outputValue = [];
  else if (value && util.isObject(value)) outputValue = {};
  else outputValue = value;
  
  let node = {
    name: propertyName,
    value: outputValue,
    whiskers: whiskers,
    templates: []
  };
  
  node[Symbol.iterator] = iterate;
  
  if (util.isObject(value)) {
    let addTemplates = false;
    for (let p in value) {
      let child = parse(p, value[p]);
      
      if (!child.name) {
        // property name is nothing but whiskers...
        if (!addTemplates) {
          node = child;
          node.name = propertyName;
          addTemplates = true;
        } else {
          child.isTemplate = true;
          node.templates.push(child);
        }
      } else {
        child.parent = node;
        
        if (util.isArray(outputValue)) {
          outputValue.push(child);
        } else {
          outputValue[child.name] = child;
        }
      }
    }
  }
  
  return node;
}

function handleHintShorthand(result, hint) {
  for (let node of result) {
    for (let whisker of node.whiskers) {
      if (whisker.key === hint) {
        if (node.spec.hints.indexOf(hint) === -1) {
          node.spec.hints.push(hint);
        }
      }
    }
  }
}

function parseWhiskers(source, options) {
  let doc = parse(null, source);
  doc.options = options || {};
  
  for (let handler of handlers) {
    handler(doc);
  }
  
  return doc;
}

module.exports = exports = parseWhiskers;

exports.resolvePartial = (name, options) => {
  if (!options) {
    console.log(name);
    return;
  }
  
  var directory = options.location;
  
  while (directory && directory !== ".") {
    var partialLocation = path.join(process.cwd(), directory, "~partials", "~" + name + ".whiskers");
    
    try {
      fs.accessSync(partialLocation);
      return {
        name: name,
        data: fs.readFileSync(partialLocation),
        location: path.relative(process.cwd(), partialLocation)
      };
    } catch(e) { }
    
    directory = path.dirname(directory);
  }
  
  throw new Error("Failed to resolve partial " + name);
};

addHandler(function handleRealm(doc) {
  if (doc.value && doc.value.realm) {
    doc.realm = doc.value.realm.value;
    delete doc.value.realm;
  }
  
  if (doc.options.rootRealm) {
    if (doc.realm) {
      if (doc.realm.indexOf("/") === 0) doc.realm = "." + doc.realm;
      doc.realm = url.resolve(doc.options.rootRealm, doc.realm);
      return;
    } else if (doc.options.location) {
      let parsedLocation = path.parse(doc.options.location);
      let realm;
      
      if (parsedLocation.name === "index") {
        realm = path.join("./", parsedLocation.dir, "/");
      } else {
        realm = path.join("./", parsedLocation.dir, parsedLocation.name, "/");
      }

      doc.realm = url.resolve(doc.options.rootRealm, realm);
    }
  }
});

addHandler(function handleContext(doc) {
  if (doc.value && doc.value.context) {
    doc.context = doc.value.context.value;
    delete doc.value.context;
  }
});

addHandler(function addImplicitNullInverse(doc) {
  for (let node of doc) {
    let sections = 0, inverses = 0, inline = 0;
    let section;
    for (let whisker of node.whiskers) {
      if (whisker.key.startsWith("#")) {
        section = whisker.key;
        sections += 1;
      }
      if (whisker.key === "inline") inline += 1;
      if (whisker.key.startsWith("^")) inverses += 1;
    }
    
    for (let template of node.templates) {
      for (let whisker of template.whiskers) {
        if (whisker.key.startsWith("#")) {
          section = whisker.key;
          sections += 1;
        }
        if (whisker.key === "inline") inline += 1;
        if (whisker.key.startsWith("^")) inverses += 1;
      }
    }
    
    if (sections === 1 && inverses === 0 && inline === 0) {
      let nullInverseTemplate = parse("~" + section.replace("#", "^"), null);
      node.templates.push(nullInverseTemplate);
    }
  }
});

addHandler(function addSpecIfNoneSpecified(doc) {
  for (let node of nodesAndTemplates(doc)) {
    node.spec = node.spec || {};
    if (node.name) node.spec.name = node.name;
    node.spec.hints = node.spec.hints || [];
  }
});

addHandler(function handleHintWhisker(doc) {
  for (let node of nodesAndTemplates(doc)) {
    for (let whisker of node.whiskers) {
      if (whisker.key === "hint") {
        node.spec.hints.push(whisker.value);
      }
    }
  }
});

addHandler(function handleHintsWhisker(doc) {  
  function addHintToNode(node) {
    return (h) => node.spec.hints.push(h);
  }
  for (let node of nodesAndTemplates(doc)) {
    for (let whisker of node.whiskers) {
      if (whisker.key === "hints") {
        whisker.value.split(",").forEach(addHintToNode(node));
      }
    }
  }
});

addHandler(function handleLynxHints(doc) {
  handleHintShorthand(doc, "header");
  handleHintShorthand(doc, "label");
  handleHintShorthand(doc, "line");
  handleHintShorthand(doc, "marker");
  handleHintShorthand(doc, "card");
  handleHintShorthand(doc, "complement");
  handleHintShorthand(doc, "image");
  handleHintShorthand(doc, "section");
  handleHintShorthand(doc, "link");
  handleHintShorthand(doc, "submit");
  handleHintShorthand(doc, "content");
  handleHintShorthand(doc, "form");
  handleHintShorthand(doc, "container");
  handleHintShorthand(doc, "text");
});

addHandler(function handleLinkInference(doc) {
  for (let node of filter(nodesAndTemplates(doc), hasNoBaseHint)) {
    if (node.value && util.isObject(node.value) && "href" in node.value) {
      node.spec.hints.push("link");
    }
  }
});

addHandler(function handleSubmitInference(doc) {
  for (let node of filter(nodesAndTemplates(doc), hasNoBaseHint)) {
    if (node.value && util.isObject(node.value) && "action" in node.value) {
      node.spec.hints.push("submit");
    }
  }
});

addHandler(function handleSubmitInference(doc) {
  for (let node of filter(nodesAndTemplates(doc), hasNoBaseHint)) {
    if (node.value && util.isObject(node.value) && ("src" in node.value || "data" in node.value)) {
      node.spec.hints.push("content");
    }
  }
});

addHandler(function handleContainerInference(doc) {
  for (let node of filter(nodesAndTemplates(doc), hasNoBaseHint)) {
    if (node.value && util.isObject(node.value)) {
      node.spec.hints.push("container");
    }
  }
});

addHandler(function handleTextInference(doc) {
  for (let node of filter(nodesAndTemplates(doc), hasNoBaseHint)) {
    if (!util.isObject(node.value)) {
      node.spec.hints.push("text");
    }
  }
});

let flag = (v) => v === "" || v === "true" ? true : v;

function handleSpecProperty(doc, propertyName) {
  for (let node of nodesAndTemplates(doc)) {
    for (let whisker of node.whiskers) {
      if (whisker.key === propertyName) {
        node.spec[propertyName] = flag(whisker.value);
        break;
      }
    }
  }
}

addHandler(function handleInput(doc) {
  for (let node of nodesAndTemplates(doc)) {
    for (let whisker of node.whiskers) {
      if (whisker.key === "input") {
        node.spec.input = flag(whisker.value);
        break;
      }
    }
  }
});

addHandler(function handleVisibility(doc) {
  for (let node of nodesAndTemplates(doc)) {
    for (let whisker of node.whiskers) {
      if (whisker.key === "visibility") {
        node.spec.visibility = whisker.value;
        break;
      } else if (["hidden", "concealed", "visible"].indexOf(whisker.key) !== -1) {
        node.spec.visibility = whisker.key;
        break;
      }
    }
  }
});

addHandler(function handleEmphasis(doc) {
  for (let node of nodesAndTemplates(doc)) {
    for (let whisker of node.whiskers) {
      if (whisker.key === "emphasis") {
        node.spec.emphasis = +whisker.value;
        break;
      }
      
      if (whisker.key === "em") {
        node.spec.emphasis = 1;
        break;
      }
      
      if (whisker.key === "strong") {
        node.spec.emphasis = 2;
        break;
      }
    }
  }
});

addHandler(function handleLabeledBy(doc) {
  for (let node of nodesAndTemplates(doc)) {
    for (let whisker of node.whiskers) {
      if (whisker.key === "labeledBy") {
        node.spec.labeledBy = whisker.value;
      }
    }
  }
});

addHandler(function handleLabeledBy(doc) {
  for (let node of nodesAndTemplates(doc)) {
    for (let whisker of node.whiskers) {
      if (whisker.key === "options") {
        node.spec.options = whisker.value;
      }
    }
  }
});

addHandler(function handleLabeledBy(doc) {
  for (let node of nodesAndTemplates(doc)) {
    for (let whisker of node.whiskers) {
      if (whisker.key === "option") {
        node.spec.option = flag(whisker.value);
      }
    }
  }
});

addHandler(function handleLabeledBy(doc) {
  for (let node of nodesAndTemplates(doc)) {
    for (let whisker of node.whiskers) {
      if (whisker.key === "follow") {
        node.spec.follow = +whisker.value;
      }
    }
  }
});

addHandler(function handleInline(doc) {
  for (let node of nodesAndTemplates(doc)) {
    for (let whisker of node.whiskers) {
      if (whisker.key === "inline") {
        node.inlineSpec = true;
      }
    }
  }
});

addHandler(function handleData(doc) {
  for (let node of nodesAndTemplates(doc)) {
    let dataWhisker;
    
    for (let whisker of node.whiskers) {
      if (whisker.key === "data") {
        dataWhisker = whisker;
        break;
      }
    }
    
    if (dataWhisker && dataWhisker.value === "false") {
      continue;
    } else if (dataWhisker) {
      delete node.spec;
    }
    
    let isLinkData = node.name === "href" || node.name === "type";
    if (isLinkData && hasHint(node.parent, "link")) {
      delete node.spec;
    }
    
    let isSubmitData = node.name === "action" || node.name === "method" || node.name === "enctype";
    if (isSubmitData && hasHint(node.parent, "submit")) {
      delete node.spec;
    }
    
    let isContentData = node.name === "src" || node.name === "data" || node.name === "type";
    if (isContentData && hasHint(node.parent, "content")) {
      delete node.spec;
    }
    
    let isImageData = node.name === "height" || node.name === "width";
    
    if (isImageData && hasHint(node.parent, "image")) {
      delete node.spec;
    }
    
    let isMarkerData = node.name === "for";
    if (isMarkerData && hasHint(node.parent, "marker")) {
      delete node.spec;
      node.value = resolveRealmURI(doc, node.value);
    }
    
    let isScopeData = node.name === "scope";
    if (isScopeData) {
      delete node.spec;
      node.value = resolveRealmURI(doc, node.value);
    }
  }
});

function resolveRealmURI(doc, absoluteOrRelativeURI) {
  var parsed = url.parse(absoluteOrRelativeURI);
  if (parsed.host) return absoluteOrRelativeURI;
  
  if (absoluteOrRelativeURI.indexOf("/") === 0) {
    return url.resolve(doc.options.rootRealm, "." + absoluteOrRelativeURI);
  }
  
  return url.resolve(doc.realm, absoluteOrRelativeURI);
}

function hasChildren(node) {
  return node.value && util.isObject(node.value);
}

function buildChildrenSpec(node) {
  if (!util.isObject(node.value)) return null;
  
  let isTemplate = util.isArray(node.value);
  
  let childrenSpec;
  
  if (!isTemplate) {
    for (let p in node.value) {
      let childNode = node.value[p];
      if (isDataProperty(childNode)) continue;
      
      childrenSpec = childrenSpec || [];
      
      if (!childNode.inlineSpec)
        childrenSpec.push(buildSpec(childNode));
      else
        childrenSpec.push({ name: childNode.name});
    }
  } else {
    for (let p in node.value) {
      let childNode = node.value[p];
      
      childrenSpec = childrenSpec || {};
      if (!childNode.inlineSpec) {
        childrenSpec = buildSpec(childNode);
        delete childrenSpec.name;
        break;
      }
    }
  }
  
  if (childrenSpec && Object.keys(childrenSpec).length === 0) return null;
  return childrenSpec;
}

addHandler(function includePartials(doc) {
  for (let node of doc) {
    for (let whisker of node.whiskers) {
      if (whisker.key === "include") {
        let partialTemplate = parseWhiskers.resolvePartial(whisker.value, doc.options);
        if (!partialTemplate) continue; // throw new Error("Failed to locate partial " + whisker.value);
        
        let partialContents = partialTemplate.data.toString();

        // Replace ~~ parameters
        for (let p in node.value) {
          if (node.value[p].value) {
            partialContents = partialContents.replace("~~" + p, node.value[p].value);
          }
        }
        
        // Replace zone parameters
        let partialDocument = parseWhiskers(YAML.parse(partialContents), {
          location: partialTemplate.location,
          isPartial: true
        });
        for (let zone of filter(partialDocument, hasWhisker("zone"))) {
          let content = node.value[zone.name];
          if (content) {
            for (let p in content) {
              zone[p] = content[p];
            }
          }
        }
        
        // Replace node with partial
        for (let p in partialDocument) {
          if (p === "name" || p === "options") continue;
          node[p] = partialDocument[p];
        }
        
        node.spec.name = node.name;
      }
    }
  }
});

function buildSpec(node) {
  let spec = JSON.parse(JSON.stringify(node.spec));
  
  // There's no need to have a name for an item in a data-bound array.
  if (hasWhisker("array")(node)) {
    delete spec.name;
  }
  
  if (hasChildren(node)) {
    let childrenSpec = buildChildrenSpec(node);
    if (childrenSpec) spec.children = childrenSpec;
  }
  
  return spec;
}

addHandler(function buildSpecs(doc) {
  if (doc.options.isPartial) return;
  
  doc['~spec'] = buildSpec(doc);
  
  for (let nodeWithInlineSpec of filter(nodesAndTemplates(doc), (node) => node !== doc && node.inlineSpec)) {
    nodeWithInlineSpec['~spec'] = buildSpec(nodeWithInlineSpec);
  }
});
