"use strict";

var eventElements = [];

var setEvents = function () {};
setEvents.prototype.hook = function (element, propertyName) {
  eventElements.push({
    name: propertyName.substr("5"),
    element: element
  });
};

var fireEventGroup = function (eventGroups, data) {
  Object.keys(eventGroups)
    .forEach(function (currentGroupName) {
      var currentElements = eventElements
        .filter(function (item) {
          return item.name === currentGroupName;})
        .map(function (item) {return item.element;});
          
      eventGroups[currentGroupName]
      .apply(data, currentElements);
    });
  eventElements = [];
};

module.exports = {
  createObject: {events: new setEvents()},
  fireEventGroup: fireEventGroup
};