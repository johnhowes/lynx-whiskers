/* jshint node: true */
/* jshint esversion: 6 */
"use strict";

let util = require('util');

function getWhisker(node, key) {
  for (let whisker of node.whiskers) {
    if (whisker.key === key) {
      return whisker;
    }
  }
}

function getTagWhisker(node) {
  for (let whisker of node.whiskers) {
    if (whisker.key.indexOf("#") === 0 || whisker.key.indexOf("^") === 0) {
      return whisker;
    }
  }
}

let hasSpec = (node) => !!node['~spec'];

function isArraySection(node) {
  var arrayWhisker = getWhisker(node, "array");
  return !!arrayWhisker;
}

function tag(node, content) {
  let output = [];
  let tag = getTagWhisker(node);
  
  if (!tag) return content;
  
  let tagName = tag.key.substr(1);
  output.push(" {{" + tag.key + "}} ");
  output.push(content);
  output.push(" {{/" + tagName + "}} ");
  
  return output.join('');
}

function tagValue(node, content) {
  let output = [];
  output.push(tag(node, content));
  
  for (let template of node.templates) {
    output.push(generate(template));
  }
  
  return output.join('');
}

function getTemplateType(node) {
  if (getTagWhisker(node)) {
    return node.inlineSpec ? 'spec' : 'value';
  }
}

function* alternateValueTemplates(node) {
  for (let template of node.templates) {
    if (!template.inlineSpec) {
      yield template;
    }
  }
}

function* specTemplates(node) {
  for (let template of node.templates) {
    if (template.inlineSpec) {
      yield template;
    }
  }
}

function createNodeTemplate(node, value, isObject) {
  let output = [];
  const templateType = getTemplateType(node);
  
  var isArrayDataSource = isArraySection(node);
  
  function createValueTemplate() {
    let output = [];
    
    if (templateType === 'value') {
      if (isArrayDataSource) {
        if (isObject) value = "{" + value + "}";
        value = value + "{{#unless @last}},{{/unless}}";
      }
      output.push(tag(node, value));
    } else if (isObject && !hasSpec(node)) {
      output.push("{" + value + "}");
    } else {
      output.push(value);
    }
    
    for (let template of alternateValueTemplates(node)) {
      if (isObject && template.value === null) {
        output.push(tag(template, '"value": null'));
      } else {
        output.push(generate(template));
      }
    }
    
    return output.join('');
  }
  
  if (hasSpec(node)) {
    output.push('{');
    if (isObject) output.push(createValueTemplate());
    else output.push('"value": ' + createValueTemplate() + '');
    output.push(',');
    output.push('"spec": ' + JSON.stringify(node['~spec']));
    output.push('}');
    if (isArrayDataSource) output.push("{{#unless @last}},{{/unless}}");
  } else {
    output.push(createValueTemplate());
  }
  
  return output.join('');
}

function generateTextNodeTemplate(node) {
  const isLiteral = !!getWhisker(node, "literal");
  var value = isLiteral ? node.value : JSON.stringify(node.value);
  return createNodeTemplate(node, value);
}

function generateArrayNodeTemplate(node) {
  var items = [];
  for (let p in node.value) {
    let child = node.value[p];
    let childOutput = generate(child);
    items.push(childOutput);
  }
  
  return createNodeTemplate(node, "[" + items.join(",") + "]");
}

function generateObjectNodeTemplate(node) {
  var properties = [];
  for (let p in node.value) {
    let child = node.value[p];
    let childOutput = generate(child);
    properties.push('"' + child.name + '": ' + childOutput);
  }
  
  
  
  return createNodeTemplate(node, properties.join(","), true);
}

// function generateObjectValueTemplate(template) {
//   let properties = [];
//   
//   if (template.value === null) {
//     properties.push('"value": null');
//   } else {
//     for (let p in template.value) {
//       let child = template.value[p];
//       let childOutput = generate(child);
//       properties.push('"' + child.name + '": ' + childOutput);
//     }
//   }
//   
//   return tag(template, properties.join(","));
// }
// 
// function generateObjectValue(node) {
//   const templateType = getTemplateType(node);
//   let output = [], properties = [];
//   
//   var isArray = isArraySection(node);
//   
//   if (!isArray) output.push('{');
//   
//   for (let p in node.value) {
//     let child = node.value[p];
//     let childOutput = generate(child);
//     properties.push('"' + child.name + '": ' + childOutput);
//   }
//   
//   var propertiesContent = properties.join(',');
//   
//   if (templateType === 'value') {
//     if (isArray) propertiesContent = "{" + properties.join(',') + "}{{#unless @last}},{{/unless}}";
//     output.push(tag(node, propertiesContent));
//   } else {
//     output.push(propertiesContent);
//   }
//   
//   for (let template of alternateValueTemplates(node)) {
//     output.push(generateObjectValueTemplate(template));
//   }
//   
//   if (hasSpec(node)) {
//     if (properties.length > 0) output.push(',');
//     output.push('"spec": ' + JSON.stringify(node['~spec']));
//   }
//   
//   if (!isArray) output.push('}');
//   
//   return output.join('');
// }

function generate(node) {
  let output = [];
  
  const templateType = getTemplateType(node);
  
  let value;
  
  if (!util.isObject(node.value)) {
    value = generateTextNodeTemplate(node);
  } else if (!util.isArray(node.value)) {
    value = generateObjectNodeTemplate(node);
  } else {
    value = generateArrayNodeTemplate(node);
  }
  
  if (templateType === 'spec') {
    output.push(tag(node, value));
  } else {
    output.push(value);
  }
  
  for (let template of specTemplates(node)) {
    output.push(generate(template));
  }
  
  return output.join('');
}

module.exports = exports = generate;
