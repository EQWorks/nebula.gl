"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawRectangleMode = void 0;

var _bboxPolygon = _interopRequireDefault(require("@turf/bbox-polygon"));

var _twoClickPolygonMode = require("./two-click-polygon-mode.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DrawRectangleMode =
/*#__PURE__*/
function (_TwoClickPolygonMode) {
  _inherits(DrawRectangleMode, _TwoClickPolygonMode);

  function DrawRectangleMode() {
    _classCallCheck(this, DrawRectangleMode);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawRectangleMode).apply(this, arguments));
  }

  _createClass(DrawRectangleMode, [{
    key: "handlePointerMoveAdapter",
    value: function handlePointerMoveAdapter(event) {
      var result = {
        editAction: null,
        cancelMapPan: false
      };
      var clickSequence = this.getClickSequence();

      if (clickSequence.length === 0) {
        // nothing to do yet
        return result;
      }

      var corner1 = clickSequence[0];
      var corner2 = event.mapCoords;

      this._setTentativeFeature((0, _bboxPolygon.default)([corner1[0], corner1[1], corner2[0], corner2[1]]));

      return result;
    }
  }]);

  return DrawRectangleMode;
}(_twoClickPolygonMode.TwoClickPolygonMode);

exports.DrawRectangleMode = DrawRectangleMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1yZWN0YW5nbGUtbW9kZS5qcyJdLCJuYW1lcyI6WyJEcmF3UmVjdGFuZ2xlTW9kZSIsImV2ZW50IiwicmVzdWx0IiwiZWRpdEFjdGlvbiIsImNhbmNlbE1hcFBhbiIsImNsaWNrU2VxdWVuY2UiLCJnZXRDbGlja1NlcXVlbmNlIiwibGVuZ3RoIiwiY29ybmVyMSIsImNvcm5lcjIiLCJtYXBDb29yZHMiLCJfc2V0VGVudGF0aXZlRmVhdHVyZSIsIlR3b0NsaWNrUG9seWdvbk1vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxpQjs7Ozs7Ozs7Ozs7Ozs2Q0FFVEMsSyxFQUMyRDtBQUMzRCxVQUFNQyxNQUFNLEdBQUc7QUFBRUMsUUFBQUEsVUFBVSxFQUFFLElBQWQ7QUFBb0JDLFFBQUFBLFlBQVksRUFBRTtBQUFsQyxPQUFmO0FBQ0EsVUFBTUMsYUFBYSxHQUFHLEtBQUtDLGdCQUFMLEVBQXRCOztBQUVBLFVBQUlELGFBQWEsQ0FBQ0UsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUM5QjtBQUNBLGVBQU9MLE1BQVA7QUFDRDs7QUFFRCxVQUFNTSxPQUFPLEdBQUdILGFBQWEsQ0FBQyxDQUFELENBQTdCO0FBQ0EsVUFBTUksT0FBTyxHQUFHUixLQUFLLENBQUNTLFNBQXRCOztBQUNBLFdBQUtDLG9CQUFMLENBQTBCLDBCQUFZLENBQUNILE9BQU8sQ0FBQyxDQUFELENBQVIsRUFBYUEsT0FBTyxDQUFDLENBQUQsQ0FBcEIsRUFBeUJDLE9BQU8sQ0FBQyxDQUFELENBQWhDLEVBQXFDQSxPQUFPLENBQUMsQ0FBRCxDQUE1QyxDQUFaLENBQTFCOztBQUVBLGFBQU9QLE1BQVA7QUFDRDs7OztFQWpCb0NVLHdDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IGJib3hQb2x5Z29uIGZyb20gJ0B0dXJmL2Jib3gtcG9seWdvbic7XG5pbXBvcnQgdHlwZSB7IFBvaW50ZXJNb3ZlRXZlbnQgfSBmcm9tICcuLi90eXBlcy5qcyc7XG5pbXBvcnQgeyB0eXBlIEdlb0pzb25FZGl0QWN0aW9uIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZS5qcyc7XG5pbXBvcnQgeyBUd29DbGlja1BvbHlnb25Nb2RlIH0gZnJvbSAnLi90d28tY2xpY2stcG9seWdvbi1tb2RlLmpzJztcblxuZXhwb3J0IGNsYXNzIERyYXdSZWN0YW5nbGVNb2RlIGV4dGVuZHMgVHdvQ2xpY2tQb2x5Z29uTW9kZSB7XG4gIGhhbmRsZVBvaW50ZXJNb3ZlQWRhcHRlcihcbiAgICBldmVudDogUG9pbnRlck1vdmVFdmVudFxuICApOiB7IGVkaXRBY3Rpb246ID9HZW9Kc29uRWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbm90aGluZyB0byBkbyB5ZXRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3QgY29ybmVyMSA9IGNsaWNrU2VxdWVuY2VbMF07XG4gICAgY29uc3QgY29ybmVyMiA9IGV2ZW50Lm1hcENvb3JkcztcbiAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKGJib3hQb2x5Z29uKFtjb3JuZXIxWzBdLCBjb3JuZXIxWzFdLCBjb3JuZXIyWzBdLCBjb3JuZXIyWzFdXSkpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19