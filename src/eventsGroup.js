"use strict";

var createHooks = function (groups, data) {
  var hooks = {};
  Object.keys(groups)
  .forEach(function (current) {
    hooks[current] = new groupHook(groups[current], data);
  });
  return hooks;
};

var groupHook = function (eventGroup, data) {
  this.members = [];
  this.group = eventGroup;
  this.groupLength = eventGroup.length;
  this.data = data;
};
groupHook.prototype.hook = function (element) {
  this.members.push(element);
  if (this.groupLength === this.members.length) {
    this.group.apply(this.data, this.members);
  }
};

module.exports = createHooks;