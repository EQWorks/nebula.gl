"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawRectangleUsingThreePointsHandler = void 0;

var _utils = require("../utils");

var _threeClickPolygonHandler = require("./three-click-polygon-handler.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DrawRectangleUsingThreePointsHandler =
/*#__PURE__*/
function (_ThreeClickPolygonHan) {
  _inherits(DrawRectangleUsingThreePointsHandler, _ThreeClickPolygonHan);

  function DrawRectangleUsingThreePointsHandler() {
    _classCallCheck(this, DrawRectangleUsingThreePointsHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawRectangleUsingThreePointsHandler).apply(this, arguments));
  }

  _createClass(DrawRectangleUsingThreePointsHandler, [{
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      var result = {
        editAction: null,
        cancelMapPan: false
      };
      var clickSequence = this.getClickSequence();

      if (clickSequence.length === 0) {
        // nothing to do yet
        return result;
      }

      var groundCoords = event.groundCoords;

      if (clickSequence.length === 1) {
        this._setTentativeFeature({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [clickSequence[0], groundCoords]
          }
        });
      } else if (clickSequence.length === 2) {
        var lineString = {
          type: 'LineString',
          coordinates: clickSequence
        };

        var _clickSequence = _slicedToArray(clickSequence, 2),
            p1 = _clickSequence[0],
            p2 = _clickSequence[1];

        var _generatePointsParall = (0, _utils.generatePointsParallelToLinePoints)(p1, p2, groundCoords),
            _generatePointsParall2 = _slicedToArray(_generatePointsParall, 2),
            p3 = _generatePointsParall2[0],
            p4 = _generatePointsParall2[1];

        this._setTentativeFeature({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [_toConsumableArray(lineString.coordinates).concat([p3, p4, p1])]
          }
        });
      }

      return result;
    }
  }]);

  return DrawRectangleUsingThreePointsHandler;
}(_threeClickPolygonHandler.ThreeClickPolygonHandler);

exports.DrawRectangleUsingThreePointsHandler = DrawRectangleUsingThreePointsHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctcmVjdGFuZ2xlLXVzaW5nLXRocmVlLXBvaW50cy1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIkRyYXdSZWN0YW5nbGVVc2luZ1RocmVlUG9pbnRzSGFuZGxlciIsImV2ZW50IiwicmVzdWx0IiwiZWRpdEFjdGlvbiIsImNhbmNlbE1hcFBhbiIsImNsaWNrU2VxdWVuY2UiLCJnZXRDbGlja1NlcXVlbmNlIiwibGVuZ3RoIiwiZ3JvdW5kQ29vcmRzIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJ0eXBlIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsImxpbmVTdHJpbmciLCJwMSIsInAyIiwicDMiLCJwNCIsIlRocmVlQ2xpY2tQb2x5Z29uSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsb0M7Ozs7Ozs7Ozs7Ozs7c0NBQ09DLEssRUFBNkU7QUFDN0YsVUFBTUMsTUFBTSxHQUFHO0FBQUVDLFFBQUFBLFVBQVUsRUFBRSxJQUFkO0FBQW9CQyxRQUFBQSxZQUFZLEVBQUU7QUFBbEMsT0FBZjtBQUNBLFVBQU1DLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0Qjs7QUFFQSxVQUFJRCxhQUFhLENBQUNFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUI7QUFDQSxlQUFPTCxNQUFQO0FBQ0Q7O0FBRUQsVUFBTU0sWUFBWSxHQUFHUCxLQUFLLENBQUNPLFlBQTNCOztBQUVBLFVBQUlILGFBQWEsQ0FBQ0UsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUM5QixhQUFLRSxvQkFBTCxDQUEwQjtBQUN4QkMsVUFBQUEsSUFBSSxFQUFFLFNBRGtCO0FBRXhCQyxVQUFBQSxRQUFRLEVBQUU7QUFDUkQsWUFBQUEsSUFBSSxFQUFFLFlBREU7QUFFUkUsWUFBQUEsV0FBVyxFQUFFLENBQUNQLGFBQWEsQ0FBQyxDQUFELENBQWQsRUFBbUJHLFlBQW5CO0FBRkw7QUFGYyxTQUExQjtBQU9ELE9BUkQsTUFRTyxJQUFJSCxhQUFhLENBQUNFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDckMsWUFBTU0sVUFBc0IsR0FBRztBQUM3QkgsVUFBQUEsSUFBSSxFQUFFLFlBRHVCO0FBRTdCRSxVQUFBQSxXQUFXLEVBQUVQO0FBRmdCLFNBQS9COztBQURxQyw0Q0FLcEJBLGFBTG9CO0FBQUEsWUFLOUJTLEVBTDhCO0FBQUEsWUFLMUJDLEVBTDBCOztBQUFBLG9DQU1wQiwrQ0FBbUNELEVBQW5DLEVBQXVDQyxFQUF2QyxFQUEyQ1AsWUFBM0MsQ0FOb0I7QUFBQTtBQUFBLFlBTTlCUSxFQU44QjtBQUFBLFlBTTFCQyxFQU4wQjs7QUFRckMsYUFBS1Isb0JBQUwsQ0FBMEI7QUFDeEJDLFVBQUFBLElBQUksRUFBRSxTQURrQjtBQUV4QkMsVUFBQUEsUUFBUSxFQUFFO0FBQ1JELFlBQUFBLElBQUksRUFBRSxTQURFO0FBRVJFLFlBQUFBLFdBQVcsRUFBRSxvQkFLTkMsVUFBVSxDQUFDRCxXQUxMLFVBTVRJLEVBTlMsRUFPVEMsRUFQUyxFQVFUSCxFQVJTO0FBRkw7QUFGYyxTQUExQjtBQWlCRDs7QUFFRCxhQUFPWixNQUFQO0FBQ0Q7Ozs7RUFoRHVEZ0Isa0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSB7IExpbmVTdHJpbmcgfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB0eXBlIHsgUG9pbnRlck1vdmVFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgRWRpdEFjdGlvbiB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IFRocmVlQ2xpY2tQb2x5Z29uSGFuZGxlciB9IGZyb20gJy4vdGhyZWUtY2xpY2stcG9seWdvbi1oYW5kbGVyLmpzJztcblxuZXhwb3J0IGNsYXNzIERyYXdSZWN0YW5nbGVVc2luZ1RocmVlUG9pbnRzSGFuZGxlciBleHRlbmRzIFRocmVlQ2xpY2tQb2x5Z29uSGFuZGxlciB7XG4gIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KTogeyBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbm90aGluZyB0byBkbyB5ZXRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3QgZ3JvdW5kQ29vcmRzID0gZXZlbnQuZ3JvdW5kQ29vcmRzO1xuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJyxcbiAgICAgICAgICBjb29yZGluYXRlczogW2NsaWNrU2VxdWVuY2VbMF0sIGdyb3VuZENvb3Jkc11cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMikge1xuICAgICAgY29uc3QgbGluZVN0cmluZzogTGluZVN0cmluZyA9IHtcbiAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICBjb29yZGluYXRlczogY2xpY2tTZXF1ZW5jZVxuICAgICAgfTtcbiAgICAgIGNvbnN0IFtwMSwgcDJdID0gY2xpY2tTZXF1ZW5jZTtcbiAgICAgIGNvbnN0IFtwMywgcDRdID0gZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyhwMSwgcDIsIGdyb3VuZENvb3Jkcyk7XG5cbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIC8vIERyYXcgYSBwb2x5Z29uIGNvbnRhaW5pbmcgYWxsIHRoZSBwb2ludHMgb2YgdGhlIExpbmVTdHJpbmcsXG4gICAgICAgICAgICAgIC8vIHRoZW4gdGhlIHBvaW50cyBvcnRob2dvbmFsIHRvIHRoZSBsaW5lU3RyaW5nLFxuICAgICAgICAgICAgICAvLyB0aGVuIGJhY2sgdG8gdGhlIHN0YXJ0aW5nIHBvc2l0aW9uXG4gICAgICAgICAgICAgIC4uLmxpbmVTdHJpbmcuY29vcmRpbmF0ZXMsXG4gICAgICAgICAgICAgIHAzLFxuICAgICAgICAgICAgICBwNCxcbiAgICAgICAgICAgICAgcDFcbiAgICAgICAgICAgIF1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==