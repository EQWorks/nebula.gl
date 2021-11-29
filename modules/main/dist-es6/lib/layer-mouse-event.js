"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LayerMouseEvent {
  // original item that this event is related to
  // internal nebula info about the object
  // the mouse [lng,lat] raycasted onto the ground
  // browser event
  // reference to nebula
  constructor(nativeEvent, _ref) {
    var data = _ref.data,
        groundPoint = _ref.groundPoint,
        nebula = _ref.nebula,
        metadata = _ref.metadata;

    _defineProperty(this, "canceled", void 0);

    _defineProperty(this, "data", void 0);

    _defineProperty(this, "metadata", void 0);

    _defineProperty(this, "groundPoint", void 0);

    _defineProperty(this, "nativeEvent", void 0);

    _defineProperty(this, "nebula", void 0);

    this.nativeEvent = nativeEvent;
    this.data = data;
    this.groundPoint = groundPoint;
    this.nebula = nebula;
    this.metadata = metadata;
  }

  stopPropagation() {
    this.nativeEvent.stopPropagation();
    this.canceled = true;
  }

}

exports.default = LayerMouseEvent;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbGF5ZXItbW91c2UtZXZlbnQuanMiXSwibmFtZXMiOlsiTGF5ZXJNb3VzZUV2ZW50IiwiY29uc3RydWN0b3IiLCJuYXRpdmVFdmVudCIsImRhdGEiLCJncm91bmRQb2ludCIsIm5lYnVsYSIsIm1ldGFkYXRhIiwic3RvcFByb3BhZ2F0aW9uIiwiY2FuY2VsZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUdlLE1BQU1BLGVBQU4sQ0FBc0I7QUFFbkM7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUdBQyxFQUFBQSxXQUFXLENBQUNDLFdBQUQsUUFBMkU7QUFBQSxRQUEvQ0MsSUFBK0MsUUFBL0NBLElBQStDO0FBQUEsUUFBekNDLFdBQXlDLFFBQXpDQSxXQUF5QztBQUFBLFFBQTVCQyxNQUE0QixRQUE1QkEsTUFBNEI7QUFBQSxRQUFwQkMsUUFBb0IsUUFBcEJBLFFBQW9COztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUNwRixTQUFLSixXQUFMLEdBQW1CQSxXQUFuQjtBQUVBLFNBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLFNBQUtDLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0EsU0FBS0MsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDRDs7QUFFREMsRUFBQUEsZUFBZSxHQUFHO0FBQ2hCLFNBQUtMLFdBQUwsQ0FBaUJLLGVBQWpCO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUNEOztBQXpCa0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IHR5cGUgeyBQb3NpdGlvbiB9IGZyb20gJ2dlb2pzb24tdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllck1vdXNlRXZlbnQge1xuICBjYW5jZWxlZDogYm9vbGVhbjtcbiAgLy8gb3JpZ2luYWwgaXRlbSB0aGF0IHRoaXMgZXZlbnQgaXMgcmVsYXRlZCB0b1xuICBkYXRhOiBPYmplY3Q7XG4gIC8vIGludGVybmFsIG5lYnVsYSBpbmZvIGFib3V0IHRoZSBvYmplY3RcbiAgbWV0YWRhdGE6IE9iamVjdDtcbiAgLy8gdGhlIG1vdXNlIFtsbmcsbGF0XSByYXljYXN0ZWQgb250byB0aGUgZ3JvdW5kXG4gIGdyb3VuZFBvaW50OiBQb3NpdGlvbjtcbiAgLy8gYnJvd3NlciBldmVudFxuICBuYXRpdmVFdmVudDogTW91c2VFdmVudDtcbiAgLy8gcmVmZXJlbmNlIHRvIG5lYnVsYVxuICBuZWJ1bGE6IE9iamVjdDtcblxuICBjb25zdHJ1Y3RvcihuYXRpdmVFdmVudDogTW91c2VFdmVudCwgeyBkYXRhLCBncm91bmRQb2ludCwgbmVidWxhLCBtZXRhZGF0YSB9OiBPYmplY3QpIHtcbiAgICB0aGlzLm5hdGl2ZUV2ZW50ID0gbmF0aXZlRXZlbnQ7XG5cbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuZ3JvdW5kUG9pbnQgPSBncm91bmRQb2ludDtcbiAgICB0aGlzLm5lYnVsYSA9IG5lYnVsYTtcbiAgICB0aGlzLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gIH1cblxuICBzdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgdGhpcy5uYXRpdmVFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB0aGlzLmNhbmNlbGVkID0gdHJ1ZTtcbiAgfVxufVxuIl19