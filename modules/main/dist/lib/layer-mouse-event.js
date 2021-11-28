"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LayerMouseEvent =
/*#__PURE__*/
function () {
  // original item that this event is related to
  // internal nebula info about the object
  // the mouse [lng,lat] raycasted onto the ground
  // browser event
  // reference to nebula
  function LayerMouseEvent(nativeEvent, _ref) {
    var data = _ref.data,
        groundPoint = _ref.groundPoint,
        nebula = _ref.nebula,
        metadata = _ref.metadata;

    _classCallCheck(this, LayerMouseEvent);

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

  _createClass(LayerMouseEvent, [{
    key: "stopPropagation",
    value: function stopPropagation() {
      this.nativeEvent.stopPropagation();
      this.canceled = true;
    }
  }]);

  return LayerMouseEvent;
}();

exports.default = LayerMouseEvent;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbGF5ZXItbW91c2UtZXZlbnQuanMiXSwibmFtZXMiOlsiTGF5ZXJNb3VzZUV2ZW50IiwibmF0aXZlRXZlbnQiLCJkYXRhIiwiZ3JvdW5kUG9pbnQiLCJuZWJ1bGEiLCJtZXRhZGF0YSIsInN0b3BQcm9wYWdhdGlvbiIsImNhbmNlbGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7SUFHcUJBLGU7OztBQUVuQjtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBR0EsMkJBQVlDLFdBQVosUUFBc0Y7QUFBQSxRQUEvQ0MsSUFBK0MsUUFBL0NBLElBQStDO0FBQUEsUUFBekNDLFdBQXlDLFFBQXpDQSxXQUF5QztBQUFBLFFBQTVCQyxNQUE0QixRQUE1QkEsTUFBNEI7QUFBQSxRQUFwQkMsUUFBb0IsUUFBcEJBLFFBQW9COztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUNwRixTQUFLSixXQUFMLEdBQW1CQSxXQUFuQjtBQUVBLFNBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLFNBQUtDLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0EsU0FBS0MsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDRDs7OztzQ0FFaUI7QUFDaEIsV0FBS0osV0FBTCxDQUFpQkssZUFBakI7QUFDQSxXQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IHR5cGUgeyBQb3NpdGlvbiB9IGZyb20gJ2dlb2pzb24tdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllck1vdXNlRXZlbnQge1xuICBjYW5jZWxlZDogYm9vbGVhbjtcbiAgLy8gb3JpZ2luYWwgaXRlbSB0aGF0IHRoaXMgZXZlbnQgaXMgcmVsYXRlZCB0b1xuICBkYXRhOiBPYmplY3Q7XG4gIC8vIGludGVybmFsIG5lYnVsYSBpbmZvIGFib3V0IHRoZSBvYmplY3RcbiAgbWV0YWRhdGE6IE9iamVjdDtcbiAgLy8gdGhlIG1vdXNlIFtsbmcsbGF0XSByYXljYXN0ZWQgb250byB0aGUgZ3JvdW5kXG4gIGdyb3VuZFBvaW50OiBQb3NpdGlvbjtcbiAgLy8gYnJvd3NlciBldmVudFxuICBuYXRpdmVFdmVudDogTW91c2VFdmVudDtcbiAgLy8gcmVmZXJlbmNlIHRvIG5lYnVsYVxuICBuZWJ1bGE6IE9iamVjdDtcblxuICBjb25zdHJ1Y3RvcihuYXRpdmVFdmVudDogTW91c2VFdmVudCwgeyBkYXRhLCBncm91bmRQb2ludCwgbmVidWxhLCBtZXRhZGF0YSB9OiBPYmplY3QpIHtcbiAgICB0aGlzLm5hdGl2ZUV2ZW50ID0gbmF0aXZlRXZlbnQ7XG5cbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuZ3JvdW5kUG9pbnQgPSBncm91bmRQb2ludDtcbiAgICB0aGlzLm5lYnVsYSA9IG5lYnVsYTtcbiAgICB0aGlzLm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gIH1cblxuICBzdG9wUHJvcGFnYXRpb24oKSB7XG4gICAgdGhpcy5uYXRpdmVFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB0aGlzLmNhbmNlbGVkID0gdHJ1ZTtcbiAgfVxufVxuIl19