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

function* valueTemplates(node) {
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

function generateTextValue(node) {
  let output = [];
  const templateType = getTemplateType(node);
  
  function getValue(node) {
    const literal = !!getWhisker(node, "literal");
    let output = [];
    let value;
    if (literal) {
      value = node.value;
    } else {
      value = JSON.stringify(node.value);
    }
    
    if (templateType === 'value') {
      output.push(tag(node, value));
    } else {
      output.push(value);
    }
    
    for (let template of valueTemplates(node)) {
      output.push(generate(template));
    }
    
    return output.join('');
  }
  
  if (hasSpec(node)) {
    output.push('{');
    output.push('"value": ' + getValue(node) + '');
    output.push(',');
    output.push('"spec": ' + JSON.stringify(node['~spec']));
    output.push('}');
  } else {
    output.push(getValue(node));
  }
  
  return output.join('');
}

function generateArrayValue(node) {
  let output = [], items = [];
  
  if (node['~spec']) {
    output.push('{');
    output.push('"value":');
  }
  
  output.push('[');
  
  for (let p in node.value) {
    let child = node.value[p];
    items.push(generate(child));
  }
  
  output.push(items.join(','));
  output.push(']');
  
  if (node['~spec']) {
    output.push(',');
    output.push('"spec": ' + JSON.stringify(node['~spec']));
    output.push('}');
  }
  
  return output.join('');
}

function generateObjectValueTemplate(template) {
  let properties = [];
  
  if (template.value === null) {
    properties.push('"value": null');
  } else {
    for (let p in template.value) {
      let child = template.value[p];
      let childOutput = generate(child);
      properties.push('"' + child.name + '": ' + childOutput);
    }
  }
  
  return tag(template, properties.join(","));
}

function generateObjectValue(node) {
  const templateType = getTemplateType(node);
  let output = [], properties = [];
  output.push('{');
  
  for (let p in node.value) {
    let child = node.value[p];
    let childOutput = generate(child);
    properties.push('"' + child.name + '": ' + childOutput);
  }
  
  if (templateType === 'value') {
    output.push(tag(node, properties.join(',')));  
  } else {
    output.push(properties.join(','));
  }
  
  for (let template of valueTemplates(node)) {
    output.push(generateObjectValueTemplate(template));
  }
  
  if (hasSpec(node)) {
    if (properties.length > 0) output.push(',');
    output.push('"spec": ' + JSON.stringify(node['~spec']));
  }
  
  output.push('}');
  
  return output.join('');
}

function generate(node) {
  let output = [];
  
  const templateType = getTemplateType(node);
  
  let value;
  
  if (!util.isObject(node.value)) {
    value = generateTextValue(node);
  } else if (!util.isArray(node.value)) {
    value = generateObjectValue(node);
  } else {
    value = generateArrayValue(node);
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
