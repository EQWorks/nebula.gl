"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtrudeHandler = void 0;

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _utils = require("../utils");

var _modeHandler = require("./mode-handler.js");

var _modifyHandler = require("./modify-handler");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ExtrudeHandler =
/*#__PURE__*/
function (_ModifyHandler) {
  _inherits(ExtrudeHandler, _ModifyHandler);

  function ExtrudeHandler() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ExtrudeHandler);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ExtrudeHandler)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "isPointAdded", false);

    return _this;
  }

  _createClass(ExtrudeHandler, [{
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      this._lastPointerMovePicks = event.picks;
      var editAction = null;
      var editHandle = (0, _modeHandler.getPickedEditHandle)(event.pointerDownPicks);

      if (event.isDragging && editHandle) {
        var size = this.coordinatesSize(editHandle.positionIndexes, editHandle.featureIndex);
        var positionIndexes = this.isPointAdded ? this.nextPositionIndexes(editHandle.positionIndexes, size) : editHandle.positionIndexes; // p1 and p1 are end points for edge

        var p1 = this.getPointForPositionIndexes(this.prevPositionIndexes(positionIndexes, size), editHandle.featureIndex);
        var p2 = this.getPointForPositionIndexes(positionIndexes, editHandle.featureIndex);

        if (p1 && p2) {
          // p3 and p4 are end points for moving (extruding) edge
          var _generatePointsParall = (0, _utils.generatePointsParallelToLinePoints)(p1, p2, event.groundCoords),
              _generatePointsParall2 = _slicedToArray(_generatePointsParall, 2),
              p3 = _generatePointsParall2[0],
              p4 = _generatePointsParall2[1];

          var updatedData = this.getImmutableFeatureCollection().replacePosition(editHandle.featureIndex, this.prevPositionIndexes(positionIndexes, size), p4).replacePosition(editHandle.featureIndex, positionIndexes, p3).getObject();
          editAction = {
            updatedData: updatedData,
            editType: 'extruding',
            featureIndexes: [editHandle.featureIndex],
            editContext: {
              positionIndexes: this.nextPositionIndexes(editHandle.positionIndexes, size),
              position: p3
            }
          };
        }
      } // Cancel map panning if pointer went down on an edit handle


      var cancelMapPan = Boolean(editHandle);
      return {
        editAction: editAction,
        cancelMapPan: cancelMapPan
      };
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event) {
      var editAction = null;
      var selectedFeatureIndexes = this.getSelectedFeatureIndexes();
      var editHandle = (0, _modeHandler.getPickedEditHandle)(event.picks);

      if (selectedFeatureIndexes.length && editHandle && editHandle.type === 'intermediate') {
        var size = this.coordinatesSize(editHandle.positionIndexes, editHandle.featureIndex); // p1 and p1 are end points for edge

        var p1 = this.getPointForPositionIndexes(this.prevPositionIndexes(editHandle.positionIndexes, size), editHandle.featureIndex);
        var p2 = this.getPointForPositionIndexes(editHandle.positionIndexes, editHandle.featureIndex);

        if (p1 && p2) {
          var updatedData = this.getImmutableFeatureCollection();

          if (!this.isOrthogonal(editHandle.positionIndexes, editHandle.featureIndex, size)) {
            updatedData = updatedData.addPosition(editHandle.featureIndex, editHandle.positionIndexes, p2);
          }

          if (!this.isOrthogonal(this.prevPositionIndexes(editHandle.positionIndexes, size), editHandle.featureIndex, size)) {
            updatedData = updatedData.addPosition(editHandle.featureIndex, editHandle.positionIndexes, p1);
            this.isPointAdded = true;
          }

          editAction = {
            updatedData: updatedData.getObject(),
            editType: 'startExtruding',
            featureIndexes: [editHandle.featureIndex],
            editContext: {
              positionIndexes: editHandle.positionIndexes,
              position: p1
            }
          };
        }
      }

      return editAction;
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event) {
      var editAction = null;
      var selectedFeatureIndexes = this.getSelectedFeatureIndexes();
      var editHandle = (0, _modeHandler.getPickedEditHandle)(event.picks);

      if (selectedFeatureIndexes.length && editHandle) {
        var size = this.coordinatesSize(editHandle.positionIndexes, editHandle.featureIndex);
        var positionIndexes = this.isPointAdded ? this.nextPositionIndexes(editHandle.positionIndexes, size) : editHandle.positionIndexes; // p1 and p1 are end points for edge

        var p1 = this.getPointForPositionIndexes(this.prevPositionIndexes(positionIndexes, size), editHandle.featureIndex);
        var p2 = this.getPointForPositionIndexes(positionIndexes, editHandle.featureIndex);

        if (p1 && p2) {
          // p3 and p4 are end points for new moved (extruded) edge
          var _generatePointsParall3 = (0, _utils.generatePointsParallelToLinePoints)(p1, p2, event.groundCoords),
              _generatePointsParall4 = _slicedToArray(_generatePointsParall3, 2),
              p3 = _generatePointsParall4[0],
              p4 = _generatePointsParall4[1];

          var updatedData = this.getImmutableFeatureCollection().replacePosition(editHandle.featureIndex, this.prevPositionIndexes(positionIndexes, size), p4).replacePosition(editHandle.featureIndex, positionIndexes, p3).getObject();
          editAction = {
            updatedData: updatedData,
            editType: 'extruded',
            featureIndexes: [editHandle.featureIndex],
            editContext: {
              positionIndexes: editHandle.positionIndexes,
              position: p3
            }
          };
        }
      }

      this.isPointAdded = false;
      return editAction;
    }
  }, {
    key: "coordinatesSize",
    value: function coordinatesSize(positionIndexes, featureIndex) {
      var size = 0;
      var feature = this.getImmutableFeatureCollection().getObject().features[featureIndex];
      var coordinates = feature.geometry.coordinates; // for Multi polygons, length will be 3

      if (positionIndexes.length === 3) {
        var _positionIndexes = _slicedToArray(positionIndexes, 2),
            a = _positionIndexes[0],
            b = _positionIndexes[1];

        if (coordinates.length && coordinates[a].length) {
          size = coordinates[a][b].length;
        }
      } else {
        var _positionIndexes2 = _slicedToArray(positionIndexes, 1),
            _b = _positionIndexes2[0];

        if (coordinates.length && coordinates[_b].length) {
          size = coordinates[_b].length;
        }
      }

      return size;
    }
  }, {
    key: "getBearing",
    value: function getBearing(p1, p2) {
      var angle = (0, _bearing.default)(p1, p2);

      if (angle < 0) {
        return Math.floor(360 + angle);
      }

      return Math.floor(angle);
    }
  }, {
    key: "isOrthogonal",
    value: function isOrthogonal(positionIndexes, featureIndex, size) {
      if (positionIndexes[positionIndexes.length - 1] === size - 1) {
        positionIndexes[positionIndexes.length - 1] = 0;
      }

      var prevPoint = this.getPointForPositionIndexes(this.prevPositionIndexes(positionIndexes, size), featureIndex);
      var nextPoint = this.getPointForPositionIndexes(this.nextPositionIndexes(positionIndexes, size), featureIndex);
      var currentPoint = this.getPointForPositionIndexes(positionIndexes, featureIndex);
      var prevAngle = this.getBearing(currentPoint, prevPoint);
      var nextAngle = this.getBearing(currentPoint, nextPoint);
      return [89, 90, 91, 269, 270, 271].includes(Math.abs(prevAngle - nextAngle));
    }
  }, {
    key: "nextPositionIndexes",
    value: function nextPositionIndexes(positionIndexes, size) {
      var next = _toConsumableArray(positionIndexes);

      if (next.length) {
        next[next.length - 1] = next[next.length - 1] === size - 1 ? 0 : next[next.length - 1] + 1;
      }

      return next;
    }
  }, {
    key: "prevPositionIndexes",
    value: function prevPositionIndexes(positionIndexes, size) {
      var prev = _toConsumableArray(positionIndexes);

      if (prev.length) {
        prev[prev.length - 1] = prev[prev.length - 1] === 0 ? size - 2 : prev[prev.length - 1] - 1;
      }

      return prev;
    }
  }, {
    key: "getPointForPositionIndexes",
    value: function getPointForPositionIndexes(positionIndexes, featureIndex) {
      var p1;
      var feature = this.getImmutableFeatureCollection().getObject().features[featureIndex];
      var coordinates = feature.geometry.coordinates; // for Multi polygons, length will be 3

      if (positionIndexes.length === 3) {
        var _positionIndexes3 = _slicedToArray(positionIndexes, 3),
            a = _positionIndexes3[0],
            b = _positionIndexes3[1],
            c = _positionIndexes3[2];

        if (coordinates.length && coordinates[a].length) {
          p1 = coordinates[a][b][c];
        }
      } else {
        var _positionIndexes4 = _slicedToArray(positionIndexes, 2),
            _b2 = _positionIndexes4[0],
            _c = _positionIndexes4[1];

        if (coordinates.length && coordinates[_b2].length) {
          p1 = coordinates[_b2][_c];
        }
      }

      return p1;
    }
  }]);

  return ExtrudeHandler;
}(_modifyHandler.ModifyHandler);

exports.ExtrudeHandler = ExtrudeHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2V4dHJ1ZGUtaGFuZGxlci5qcyJdLCJuYW1lcyI6WyJFeHRydWRlSGFuZGxlciIsImV2ZW50IiwiX2xhc3RQb2ludGVyTW92ZVBpY2tzIiwicGlja3MiLCJlZGl0QWN0aW9uIiwiZWRpdEhhbmRsZSIsInBvaW50ZXJEb3duUGlja3MiLCJpc0RyYWdnaW5nIiwic2l6ZSIsImNvb3JkaW5hdGVzU2l6ZSIsInBvc2l0aW9uSW5kZXhlcyIsImZlYXR1cmVJbmRleCIsImlzUG9pbnRBZGRlZCIsIm5leHRQb3NpdGlvbkluZGV4ZXMiLCJwMSIsImdldFBvaW50Rm9yUG9zaXRpb25JbmRleGVzIiwicHJldlBvc2l0aW9uSW5kZXhlcyIsInAyIiwiZ3JvdW5kQ29vcmRzIiwicDMiLCJwNCIsInVwZGF0ZWREYXRhIiwiZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJyZXBsYWNlUG9zaXRpb24iLCJnZXRPYmplY3QiLCJlZGl0VHlwZSIsImZlYXR1cmVJbmRleGVzIiwiZWRpdENvbnRleHQiLCJwb3NpdGlvbiIsImNhbmNlbE1hcFBhbiIsIkJvb2xlYW4iLCJzZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwiZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImxlbmd0aCIsInR5cGUiLCJpc09ydGhvZ29uYWwiLCJhZGRQb3NpdGlvbiIsImZlYXR1cmUiLCJmZWF0dXJlcyIsImNvb3JkaW5hdGVzIiwiZ2VvbWV0cnkiLCJhIiwiYiIsImFuZ2xlIiwiTWF0aCIsImZsb29yIiwicHJldlBvaW50IiwibmV4dFBvaW50IiwiY3VycmVudFBvaW50IiwicHJldkFuZ2xlIiwiZ2V0QmVhcmluZyIsIm5leHRBbmdsZSIsImluY2x1ZGVzIiwiYWJzIiwibmV4dCIsInByZXYiLCJjIiwiTW9kaWZ5SGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUdBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLGM7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyRkFDYSxLOzs7Ozs7O3NDQUNOQyxLLEVBQTZFO0FBQzdGLFdBQUtDLHFCQUFMLEdBQTZCRCxLQUFLLENBQUNFLEtBQW5DO0FBRUEsVUFBSUMsVUFBdUIsR0FBRyxJQUE5QjtBQUVBLFVBQU1DLFVBQVUsR0FBRyxzQ0FBb0JKLEtBQUssQ0FBQ0ssZ0JBQTFCLENBQW5COztBQUVBLFVBQUlMLEtBQUssQ0FBQ00sVUFBTixJQUFvQkYsVUFBeEIsRUFBb0M7QUFDbEMsWUFBTUcsSUFBSSxHQUFHLEtBQUtDLGVBQUwsQ0FBcUJKLFVBQVUsQ0FBQ0ssZUFBaEMsRUFBaURMLFVBQVUsQ0FBQ00sWUFBNUQsQ0FBYjtBQUNBLFlBQU1ELGVBQWUsR0FBRyxLQUFLRSxZQUFMLEdBQ3BCLEtBQUtDLG1CQUFMLENBQXlCUixVQUFVLENBQUNLLGVBQXBDLEVBQXFERixJQUFyRCxDQURvQixHQUVwQkgsVUFBVSxDQUFDSyxlQUZmLENBRmtDLENBS2xDOztBQUNBLFlBQU1JLEVBQUUsR0FBRyxLQUFLQywwQkFBTCxDQUNULEtBQUtDLG1CQUFMLENBQXlCTixlQUF6QixFQUEwQ0YsSUFBMUMsQ0FEUyxFQUVUSCxVQUFVLENBQUNNLFlBRkYsQ0FBWDtBQUlBLFlBQU1NLEVBQUUsR0FBRyxLQUFLRiwwQkFBTCxDQUFnQ0wsZUFBaEMsRUFBaURMLFVBQVUsQ0FBQ00sWUFBNUQsQ0FBWDs7QUFDQSxZQUFJRyxFQUFFLElBQUlHLEVBQVYsRUFBYztBQUNaO0FBRFksc0NBRUssK0NBQW1DSCxFQUFuQyxFQUF1Q0csRUFBdkMsRUFBMkNoQixLQUFLLENBQUNpQixZQUFqRCxDQUZMO0FBQUE7QUFBQSxjQUVMQyxFQUZLO0FBQUEsY0FFREMsRUFGQzs7QUFJWixjQUFNQyxXQUFXLEdBQUcsS0FBS0MsNkJBQUwsR0FDakJDLGVBRGlCLENBRWhCbEIsVUFBVSxDQUFDTSxZQUZLLEVBR2hCLEtBQUtLLG1CQUFMLENBQXlCTixlQUF6QixFQUEwQ0YsSUFBMUMsQ0FIZ0IsRUFJaEJZLEVBSmdCLEVBTWpCRyxlQU5pQixDQU1EbEIsVUFBVSxDQUFDTSxZQU5WLEVBTXdCRCxlQU54QixFQU15Q1MsRUFOekMsRUFPakJLLFNBUGlCLEVBQXBCO0FBU0FwQixVQUFBQSxVQUFVLEdBQUc7QUFDWGlCLFlBQUFBLFdBQVcsRUFBWEEsV0FEVztBQUVYSSxZQUFBQSxRQUFRLEVBQUUsV0FGQztBQUdYQyxZQUFBQSxjQUFjLEVBQUUsQ0FBQ3JCLFVBQVUsQ0FBQ00sWUFBWixDQUhMO0FBSVhnQixZQUFBQSxXQUFXLEVBQUU7QUFDWGpCLGNBQUFBLGVBQWUsRUFBRSxLQUFLRyxtQkFBTCxDQUF5QlIsVUFBVSxDQUFDSyxlQUFwQyxFQUFxREYsSUFBckQsQ0FETjtBQUVYb0IsY0FBQUEsUUFBUSxFQUFFVDtBQUZDO0FBSkYsV0FBYjtBQVNEO0FBQ0YsT0F6QzRGLENBMkM3Rjs7O0FBQ0EsVUFBTVUsWUFBWSxHQUFHQyxPQUFPLENBQUN6QixVQUFELENBQTVCO0FBRUEsYUFBTztBQUFFRCxRQUFBQSxVQUFVLEVBQVZBLFVBQUY7QUFBY3lCLFFBQUFBLFlBQVksRUFBWkE7QUFBZCxPQUFQO0FBQ0Q7Ozt3Q0FFbUI1QixLLEVBQXdDO0FBQzFELFVBQUlHLFVBQXVCLEdBQUcsSUFBOUI7QUFFQSxVQUFNMkIsc0JBQXNCLEdBQUcsS0FBS0MseUJBQUwsRUFBL0I7QUFFQSxVQUFNM0IsVUFBVSxHQUFHLHNDQUFvQkosS0FBSyxDQUFDRSxLQUExQixDQUFuQjs7QUFDQSxVQUFJNEIsc0JBQXNCLENBQUNFLE1BQXZCLElBQWlDNUIsVUFBakMsSUFBK0NBLFVBQVUsQ0FBQzZCLElBQVgsS0FBb0IsY0FBdkUsRUFBdUY7QUFDckYsWUFBTTFCLElBQUksR0FBRyxLQUFLQyxlQUFMLENBQXFCSixVQUFVLENBQUNLLGVBQWhDLEVBQWlETCxVQUFVLENBQUNNLFlBQTVELENBQWIsQ0FEcUYsQ0FFckY7O0FBQ0EsWUFBTUcsRUFBRSxHQUFHLEtBQUtDLDBCQUFMLENBQ1QsS0FBS0MsbUJBQUwsQ0FBeUJYLFVBQVUsQ0FBQ0ssZUFBcEMsRUFBcURGLElBQXJELENBRFMsRUFFVEgsVUFBVSxDQUFDTSxZQUZGLENBQVg7QUFJQSxZQUFNTSxFQUFFLEdBQUcsS0FBS0YsMEJBQUwsQ0FDVFYsVUFBVSxDQUFDSyxlQURGLEVBRVRMLFVBQVUsQ0FBQ00sWUFGRixDQUFYOztBQUtBLFlBQUlHLEVBQUUsSUFBSUcsRUFBVixFQUFjO0FBQ1osY0FBSUksV0FBVyxHQUFHLEtBQUtDLDZCQUFMLEVBQWxCOztBQUNBLGNBQUksQ0FBQyxLQUFLYSxZQUFMLENBQWtCOUIsVUFBVSxDQUFDSyxlQUE3QixFQUE4Q0wsVUFBVSxDQUFDTSxZQUF6RCxFQUF1RUgsSUFBdkUsQ0FBTCxFQUFtRjtBQUNqRmEsWUFBQUEsV0FBVyxHQUFHQSxXQUFXLENBQUNlLFdBQVosQ0FDWi9CLFVBQVUsQ0FBQ00sWUFEQyxFQUVaTixVQUFVLENBQUNLLGVBRkMsRUFHWk8sRUFIWSxDQUFkO0FBS0Q7O0FBQ0QsY0FDRSxDQUFDLEtBQUtrQixZQUFMLENBQ0MsS0FBS25CLG1CQUFMLENBQXlCWCxVQUFVLENBQUNLLGVBQXBDLEVBQXFERixJQUFyRCxDQURELEVBRUNILFVBQVUsQ0FBQ00sWUFGWixFQUdDSCxJQUhELENBREgsRUFNRTtBQUNBYSxZQUFBQSxXQUFXLEdBQUdBLFdBQVcsQ0FBQ2UsV0FBWixDQUNaL0IsVUFBVSxDQUFDTSxZQURDLEVBRVpOLFVBQVUsQ0FBQ0ssZUFGQyxFQUdaSSxFQUhZLENBQWQ7QUFLQSxpQkFBS0YsWUFBTCxHQUFvQixJQUFwQjtBQUNEOztBQUVEUixVQUFBQSxVQUFVLEdBQUc7QUFDWGlCLFlBQUFBLFdBQVcsRUFBRUEsV0FBVyxDQUFDRyxTQUFaLEVBREY7QUFFWEMsWUFBQUEsUUFBUSxFQUFFLGdCQUZDO0FBR1hDLFlBQUFBLGNBQWMsRUFBRSxDQUFDckIsVUFBVSxDQUFDTSxZQUFaLENBSEw7QUFJWGdCLFlBQUFBLFdBQVcsRUFBRTtBQUNYakIsY0FBQUEsZUFBZSxFQUFFTCxVQUFVLENBQUNLLGVBRGpCO0FBRVhrQixjQUFBQSxRQUFRLEVBQUVkO0FBRkM7QUFKRixXQUFiO0FBU0Q7QUFDRjs7QUFFRCxhQUFPVixVQUFQO0FBQ0Q7Ozt1Q0FFa0JILEssRUFBdUM7QUFDeEQsVUFBSUcsVUFBdUIsR0FBRyxJQUE5QjtBQUVBLFVBQU0yQixzQkFBc0IsR0FBRyxLQUFLQyx5QkFBTCxFQUEvQjtBQUNBLFVBQU0zQixVQUFVLEdBQUcsc0NBQW9CSixLQUFLLENBQUNFLEtBQTFCLENBQW5COztBQUNBLFVBQUk0QixzQkFBc0IsQ0FBQ0UsTUFBdkIsSUFBaUM1QixVQUFyQyxFQUFpRDtBQUMvQyxZQUFNRyxJQUFJLEdBQUcsS0FBS0MsZUFBTCxDQUFxQkosVUFBVSxDQUFDSyxlQUFoQyxFQUFpREwsVUFBVSxDQUFDTSxZQUE1RCxDQUFiO0FBQ0EsWUFBTUQsZUFBZSxHQUFHLEtBQUtFLFlBQUwsR0FDcEIsS0FBS0MsbUJBQUwsQ0FBeUJSLFVBQVUsQ0FBQ0ssZUFBcEMsRUFBcURGLElBQXJELENBRG9CLEdBRXBCSCxVQUFVLENBQUNLLGVBRmYsQ0FGK0MsQ0FLL0M7O0FBQ0EsWUFBTUksRUFBRSxHQUFHLEtBQUtDLDBCQUFMLENBQ1QsS0FBS0MsbUJBQUwsQ0FBeUJOLGVBQXpCLEVBQTBDRixJQUExQyxDQURTLEVBRVRILFVBQVUsQ0FBQ00sWUFGRixDQUFYO0FBSUEsWUFBTU0sRUFBRSxHQUFHLEtBQUtGLDBCQUFMLENBQWdDTCxlQUFoQyxFQUFpREwsVUFBVSxDQUFDTSxZQUE1RCxDQUFYOztBQUVBLFlBQUlHLEVBQUUsSUFBSUcsRUFBVixFQUFjO0FBQ1o7QUFEWSx1Q0FFSywrQ0FBbUNILEVBQW5DLEVBQXVDRyxFQUF2QyxFQUEyQ2hCLEtBQUssQ0FBQ2lCLFlBQWpELENBRkw7QUFBQTtBQUFBLGNBRUxDLEVBRks7QUFBQSxjQUVEQyxFQUZDOztBQUlaLGNBQU1DLFdBQVcsR0FBRyxLQUFLQyw2QkFBTCxHQUNqQkMsZUFEaUIsQ0FFaEJsQixVQUFVLENBQUNNLFlBRkssRUFHaEIsS0FBS0ssbUJBQUwsQ0FBeUJOLGVBQXpCLEVBQTBDRixJQUExQyxDQUhnQixFQUloQlksRUFKZ0IsRUFNakJHLGVBTmlCLENBTURsQixVQUFVLENBQUNNLFlBTlYsRUFNd0JELGVBTnhCLEVBTXlDUyxFQU56QyxFQU9qQkssU0FQaUIsRUFBcEI7QUFTQXBCLFVBQUFBLFVBQVUsR0FBRztBQUNYaUIsWUFBQUEsV0FBVyxFQUFYQSxXQURXO0FBRVhJLFlBQUFBLFFBQVEsRUFBRSxVQUZDO0FBR1hDLFlBQUFBLGNBQWMsRUFBRSxDQUFDckIsVUFBVSxDQUFDTSxZQUFaLENBSEw7QUFJWGdCLFlBQUFBLFdBQVcsRUFBRTtBQUNYakIsY0FBQUEsZUFBZSxFQUFFTCxVQUFVLENBQUNLLGVBRGpCO0FBRVhrQixjQUFBQSxRQUFRLEVBQUVUO0FBRkM7QUFKRixXQUFiO0FBU0Q7QUFDRjs7QUFDRCxXQUFLUCxZQUFMLEdBQW9CLEtBQXBCO0FBRUEsYUFBT1IsVUFBUDtBQUNEOzs7b0NBRWVNLGUsRUFBMkJDLFksRUFBc0I7QUFDL0QsVUFBSUgsSUFBSSxHQUFHLENBQVg7QUFDQSxVQUFNNkIsT0FBTyxHQUFHLEtBQUtmLDZCQUFMLEdBQXFDRSxTQUFyQyxHQUFpRGMsUUFBakQsQ0FBMEQzQixZQUExRCxDQUFoQjtBQUNBLFVBQU00QixXQUFnQixHQUFHRixPQUFPLENBQUNHLFFBQVIsQ0FBaUJELFdBQTFDLENBSCtELENBSS9EOztBQUNBLFVBQUk3QixlQUFlLENBQUN1QixNQUFoQixLQUEyQixDQUEvQixFQUFrQztBQUFBLDhDQUNqQnZCLGVBRGlCO0FBQUEsWUFDekIrQixDQUR5QjtBQUFBLFlBQ3RCQyxDQURzQjs7QUFFaEMsWUFBSUgsV0FBVyxDQUFDTixNQUFaLElBQXNCTSxXQUFXLENBQUNFLENBQUQsQ0FBWCxDQUFlUixNQUF6QyxFQUFpRDtBQUMvQ3pCLFVBQUFBLElBQUksR0FBRytCLFdBQVcsQ0FBQ0UsQ0FBRCxDQUFYLENBQWVDLENBQWYsRUFBa0JULE1BQXpCO0FBQ0Q7QUFDRixPQUxELE1BS087QUFBQSwrQ0FDT3ZCLGVBRFA7QUFBQSxZQUNFZ0MsRUFERjs7QUFFTCxZQUFJSCxXQUFXLENBQUNOLE1BQVosSUFBc0JNLFdBQVcsQ0FBQ0csRUFBRCxDQUFYLENBQWVULE1BQXpDLEVBQWlEO0FBQy9DekIsVUFBQUEsSUFBSSxHQUFHK0IsV0FBVyxDQUFDRyxFQUFELENBQVgsQ0FBZVQsTUFBdEI7QUFDRDtBQUNGOztBQUNELGFBQU96QixJQUFQO0FBQ0Q7OzsrQkFFVU0sRSxFQUFTRyxFLEVBQVM7QUFDM0IsVUFBTTBCLEtBQUssR0FBRyxzQkFBUTdCLEVBQVIsRUFBWUcsRUFBWixDQUFkOztBQUNBLFVBQUkwQixLQUFLLEdBQUcsQ0FBWixFQUFlO0FBQ2IsZUFBT0MsSUFBSSxDQUFDQyxLQUFMLENBQVcsTUFBTUYsS0FBakIsQ0FBUDtBQUNEOztBQUNELGFBQU9DLElBQUksQ0FBQ0MsS0FBTCxDQUFXRixLQUFYLENBQVA7QUFDRDs7O2lDQUVZakMsZSxFQUEyQkMsWSxFQUFzQkgsSSxFQUFjO0FBQzFFLFVBQUlFLGVBQWUsQ0FBQ0EsZUFBZSxDQUFDdUIsTUFBaEIsR0FBeUIsQ0FBMUIsQ0FBZixLQUFnRHpCLElBQUksR0FBRyxDQUEzRCxFQUE4RDtBQUM1REUsUUFBQUEsZUFBZSxDQUFDQSxlQUFlLENBQUN1QixNQUFoQixHQUF5QixDQUExQixDQUFmLEdBQThDLENBQTlDO0FBQ0Q7O0FBQ0QsVUFBTWEsU0FBUyxHQUFHLEtBQUsvQiwwQkFBTCxDQUNoQixLQUFLQyxtQkFBTCxDQUF5Qk4sZUFBekIsRUFBMENGLElBQTFDLENBRGdCLEVBRWhCRyxZQUZnQixDQUFsQjtBQUlBLFVBQU1vQyxTQUFTLEdBQUcsS0FBS2hDLDBCQUFMLENBQ2hCLEtBQUtGLG1CQUFMLENBQXlCSCxlQUF6QixFQUEwQ0YsSUFBMUMsQ0FEZ0IsRUFFaEJHLFlBRmdCLENBQWxCO0FBSUEsVUFBTXFDLFlBQVksR0FBRyxLQUFLakMsMEJBQUwsQ0FBZ0NMLGVBQWhDLEVBQWlEQyxZQUFqRCxDQUFyQjtBQUNBLFVBQU1zQyxTQUFTLEdBQUcsS0FBS0MsVUFBTCxDQUFnQkYsWUFBaEIsRUFBOEJGLFNBQTlCLENBQWxCO0FBQ0EsVUFBTUssU0FBUyxHQUFHLEtBQUtELFVBQUwsQ0FBZ0JGLFlBQWhCLEVBQThCRCxTQUE5QixDQUFsQjtBQUNBLGFBQU8sQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxHQUFiLEVBQWtCLEdBQWxCLEVBQXVCLEdBQXZCLEVBQTRCSyxRQUE1QixDQUFxQ1IsSUFBSSxDQUFDUyxHQUFMLENBQVNKLFNBQVMsR0FBR0UsU0FBckIsQ0FBckMsQ0FBUDtBQUNEOzs7d0NBRW1CekMsZSxFQUEyQkYsSSxFQUF3QjtBQUNyRSxVQUFNOEMsSUFBSSxzQkFBTzVDLGVBQVAsQ0FBVjs7QUFDQSxVQUFJNEMsSUFBSSxDQUFDckIsTUFBVCxFQUFpQjtBQUNmcUIsUUFBQUEsSUFBSSxDQUFDQSxJQUFJLENBQUNyQixNQUFMLEdBQWMsQ0FBZixDQUFKLEdBQXdCcUIsSUFBSSxDQUFDQSxJQUFJLENBQUNyQixNQUFMLEdBQWMsQ0FBZixDQUFKLEtBQTBCekIsSUFBSSxHQUFHLENBQWpDLEdBQXFDLENBQXJDLEdBQXlDOEMsSUFBSSxDQUFDQSxJQUFJLENBQUNyQixNQUFMLEdBQWMsQ0FBZixDQUFKLEdBQXdCLENBQXpGO0FBQ0Q7O0FBQ0QsYUFBT3FCLElBQVA7QUFDRDs7O3dDQUVtQjVDLGUsRUFBMkJGLEksRUFBd0I7QUFDckUsVUFBTStDLElBQUksc0JBQU83QyxlQUFQLENBQVY7O0FBQ0EsVUFBSTZDLElBQUksQ0FBQ3RCLE1BQVQsRUFBaUI7QUFDZnNCLFFBQUFBLElBQUksQ0FBQ0EsSUFBSSxDQUFDdEIsTUFBTCxHQUFjLENBQWYsQ0FBSixHQUF3QnNCLElBQUksQ0FBQ0EsSUFBSSxDQUFDdEIsTUFBTCxHQUFjLENBQWYsQ0FBSixLQUEwQixDQUExQixHQUE4QnpCLElBQUksR0FBRyxDQUFyQyxHQUF5QytDLElBQUksQ0FBQ0EsSUFBSSxDQUFDdEIsTUFBTCxHQUFjLENBQWYsQ0FBSixHQUF3QixDQUF6RjtBQUNEOztBQUNELGFBQU9zQixJQUFQO0FBQ0Q7OzsrQ0FFMEI3QyxlLEVBQTJCQyxZLEVBQXNCO0FBQzFFLFVBQUlHLEVBQUo7QUFDQSxVQUFNdUIsT0FBTyxHQUFHLEtBQUtmLDZCQUFMLEdBQXFDRSxTQUFyQyxHQUFpRGMsUUFBakQsQ0FBMEQzQixZQUExRCxDQUFoQjtBQUNBLFVBQU00QixXQUFnQixHQUFHRixPQUFPLENBQUNHLFFBQVIsQ0FBaUJELFdBQTFDLENBSDBFLENBSTFFOztBQUNBLFVBQUk3QixlQUFlLENBQUN1QixNQUFoQixLQUEyQixDQUEvQixFQUFrQztBQUFBLCtDQUNkdkIsZUFEYztBQUFBLFlBQ3pCK0IsQ0FEeUI7QUFBQSxZQUN0QkMsQ0FEc0I7QUFBQSxZQUNuQmMsQ0FEbUI7O0FBRWhDLFlBQUlqQixXQUFXLENBQUNOLE1BQVosSUFBc0JNLFdBQVcsQ0FBQ0UsQ0FBRCxDQUFYLENBQWVSLE1BQXpDLEVBQWlEO0FBQy9DbkIsVUFBQUEsRUFBRSxHQUFHeUIsV0FBVyxDQUFDRSxDQUFELENBQVgsQ0FBZUMsQ0FBZixFQUFrQmMsQ0FBbEIsQ0FBTDtBQUNEO0FBQ0YsT0FMRCxNQUtPO0FBQUEsK0NBQ1U5QyxlQURWO0FBQUEsWUFDRWdDLEdBREY7QUFBQSxZQUNLYyxFQURMOztBQUVMLFlBQUlqQixXQUFXLENBQUNOLE1BQVosSUFBc0JNLFdBQVcsQ0FBQ0csR0FBRCxDQUFYLENBQWVULE1BQXpDLEVBQWlEO0FBQy9DbkIsVUFBQUEsRUFBRSxHQUFHeUIsV0FBVyxDQUFDRyxHQUFELENBQVgsQ0FBZWMsRUFBZixDQUFMO0FBQ0Q7QUFDRjs7QUFDRCxhQUFPMUMsRUFBUDtBQUNEOzs7O0VBeE9pQzJDLDRCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IGJlYXJpbmcgZnJvbSAnQHR1cmYvYmVhcmluZyc7XG5pbXBvcnQgeyBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBQb2ludGVyTW92ZUV2ZW50LCBTdGFydERyYWdnaW5nRXZlbnQsIFN0b3BEcmFnZ2luZ0V2ZW50IH0gZnJvbSAnLi4vZXZlbnQtdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBFZGl0QWN0aW9uIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgZ2V0UGlja2VkRWRpdEhhbmRsZSB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IE1vZGlmeUhhbmRsZXIgfSBmcm9tICcuL21vZGlmeS1oYW5kbGVyJztcblxuZXhwb3J0IGNsYXNzIEV4dHJ1ZGVIYW5kbGVyIGV4dGVuZHMgTW9kaWZ5SGFuZGxlciB7XG4gIGlzUG9pbnRBZGRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICB0aGlzLl9sYXN0UG9pbnRlck1vdmVQaWNrcyA9IGV2ZW50LnBpY2tzO1xuXG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBvaW50ZXJEb3duUGlja3MpO1xuXG4gICAgaWYgKGV2ZW50LmlzRHJhZ2dpbmcgJiYgZWRpdEhhbmRsZSkge1xuICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuY29vcmRpbmF0ZXNTaXplKGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLCBlZGl0SGFuZGxlLmZlYXR1cmVJbmRleCk7XG4gICAgICBjb25zdCBwb3NpdGlvbkluZGV4ZXMgPSB0aGlzLmlzUG9pbnRBZGRlZFxuICAgICAgICA/IHRoaXMubmV4dFBvc2l0aW9uSW5kZXhlcyhlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcywgc2l6ZSlcbiAgICAgICAgOiBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcztcbiAgICAgIC8vIHAxIGFuZCBwMSBhcmUgZW5kIHBvaW50cyBmb3IgZWRnZVxuICAgICAgY29uc3QgcDEgPSB0aGlzLmdldFBvaW50Rm9yUG9zaXRpb25JbmRleGVzKFxuICAgICAgICB0aGlzLnByZXZQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzLCBzaXplKSxcbiAgICAgICAgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXhcbiAgICAgICk7XG4gICAgICBjb25zdCBwMiA9IHRoaXMuZ2V0UG9pbnRGb3JQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzLCBlZGl0SGFuZGxlLmZlYXR1cmVJbmRleCk7XG4gICAgICBpZiAocDEgJiYgcDIpIHtcbiAgICAgICAgLy8gcDMgYW5kIHA0IGFyZSBlbmQgcG9pbnRzIGZvciBtb3ZpbmcgKGV4dHJ1ZGluZykgZWRnZVxuICAgICAgICBjb25zdCBbcDMsIHA0XSA9IGdlbmVyYXRlUG9pbnRzUGFyYWxsZWxUb0xpbmVQb2ludHMocDEsIHAyLCBldmVudC5ncm91bmRDb29yZHMpO1xuXG4gICAgICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpXG4gICAgICAgICAgLnJlcGxhY2VQb3NpdGlvbihcbiAgICAgICAgICAgIGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LFxuICAgICAgICAgICAgdGhpcy5wcmV2UG9zaXRpb25JbmRleGVzKHBvc2l0aW9uSW5kZXhlcywgc2l6ZSksXG4gICAgICAgICAgICBwNFxuICAgICAgICAgIClcbiAgICAgICAgICAucmVwbGFjZVBvc2l0aW9uKGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LCBwb3NpdGlvbkluZGV4ZXMsIHAzKVxuICAgICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgICBlZGl0QWN0aW9uID0ge1xuICAgICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICAgIGVkaXRUeXBlOiAnZXh0cnVkaW5nJyxcbiAgICAgICAgICBmZWF0dXJlSW5kZXhlczogW2VkaXRIYW5kbGUuZmVhdHVyZUluZGV4XSxcbiAgICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgICAgcG9zaXRpb25JbmRleGVzOiB0aGlzLm5leHRQb3NpdGlvbkluZGV4ZXMoZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsIHNpemUpLFxuICAgICAgICAgICAgcG9zaXRpb246IHAzXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENhbmNlbCBtYXAgcGFubmluZyBpZiBwb2ludGVyIHdlbnQgZG93biBvbiBhbiBlZGl0IGhhbmRsZVxuICAgIGNvbnN0IGNhbmNlbE1hcFBhbiA9IEJvb2xlYW4oZWRpdEhhbmRsZSk7XG5cbiAgICByZXR1cm4geyBlZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW4gfTtcbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCk6ID9FZGl0QWN0aW9uIHtcbiAgICBsZXQgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24gPSBudWxsO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpO1xuXG4gICAgY29uc3QgZWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucGlja3MpO1xuICAgIGlmIChzZWxlY3RlZEZlYXR1cmVJbmRleGVzLmxlbmd0aCAmJiBlZGl0SGFuZGxlICYmIGVkaXRIYW5kbGUudHlwZSA9PT0gJ2ludGVybWVkaWF0ZScpIHtcbiAgICAgIGNvbnN0IHNpemUgPSB0aGlzLmNvb3JkaW5hdGVzU2l6ZShlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcywgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgpO1xuICAgICAgLy8gcDEgYW5kIHAxIGFyZSBlbmQgcG9pbnRzIGZvciBlZGdlXG4gICAgICBjb25zdCBwMSA9IHRoaXMuZ2V0UG9pbnRGb3JQb3NpdGlvbkluZGV4ZXMoXG4gICAgICAgIHRoaXMucHJldlBvc2l0aW9uSW5kZXhlcyhlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcywgc2l6ZSksXG4gICAgICAgIGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4XG4gICAgICApO1xuICAgICAgY29uc3QgcDIgPSB0aGlzLmdldFBvaW50Rm9yUG9zaXRpb25JbmRleGVzKFxuICAgICAgICBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXhcbiAgICAgICk7XG5cbiAgICAgIGlmIChwMSAmJiBwMikge1xuICAgICAgICBsZXQgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKCk7XG4gICAgICAgIGlmICghdGhpcy5pc09ydGhvZ29uYWwoZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsIGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LCBzaXplKSkge1xuICAgICAgICAgIHVwZGF0ZWREYXRhID0gdXBkYXRlZERhdGEuYWRkUG9zaXRpb24oXG4gICAgICAgICAgICBlZGl0SGFuZGxlLmZlYXR1cmVJbmRleCxcbiAgICAgICAgICAgIGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgICAgcDJcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhdGhpcy5pc09ydGhvZ29uYWwoXG4gICAgICAgICAgICB0aGlzLnByZXZQb3NpdGlvbkluZGV4ZXMoZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsIHNpemUpLFxuICAgICAgICAgICAgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsXG4gICAgICAgICAgICBzaXplXG4gICAgICAgICAgKVxuICAgICAgICApIHtcbiAgICAgICAgICB1cGRhdGVkRGF0YSA9IHVwZGF0ZWREYXRhLmFkZFBvc2l0aW9uKFxuICAgICAgICAgICAgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsXG4gICAgICAgICAgICBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICAgIHAxXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLmlzUG9pbnRBZGRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBlZGl0QWN0aW9uID0ge1xuICAgICAgICAgIHVwZGF0ZWREYXRhOiB1cGRhdGVkRGF0YS5nZXRPYmplY3QoKSxcbiAgICAgICAgICBlZGl0VHlwZTogJ3N0YXJ0RXh0cnVkaW5nJyxcbiAgICAgICAgICBmZWF0dXJlSW5kZXhlczogW2VkaXRIYW5kbGUuZmVhdHVyZUluZGV4XSxcbiAgICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwMVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKTtcbiAgICBjb25zdCBlZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5waWNrcyk7XG4gICAgaWYgKHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoICYmIGVkaXRIYW5kbGUpIHtcbiAgICAgIGNvbnN0IHNpemUgPSB0aGlzLmNvb3JkaW5hdGVzU2l6ZShlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcywgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgpO1xuICAgICAgY29uc3QgcG9zaXRpb25JbmRleGVzID0gdGhpcy5pc1BvaW50QWRkZWRcbiAgICAgICAgPyB0aGlzLm5leHRQb3NpdGlvbkluZGV4ZXMoZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsIHNpemUpXG4gICAgICAgIDogZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXM7XG4gICAgICAvLyBwMSBhbmQgcDEgYXJlIGVuZCBwb2ludHMgZm9yIGVkZ2VcbiAgICAgIGNvbnN0IHAxID0gdGhpcy5nZXRQb2ludEZvclBvc2l0aW9uSW5kZXhlcyhcbiAgICAgICAgdGhpcy5wcmV2UG9zaXRpb25JbmRleGVzKHBvc2l0aW9uSW5kZXhlcywgc2l6ZSksXG4gICAgICAgIGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4XG4gICAgICApO1xuICAgICAgY29uc3QgcDIgPSB0aGlzLmdldFBvaW50Rm9yUG9zaXRpb25JbmRleGVzKHBvc2l0aW9uSW5kZXhlcywgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgpO1xuXG4gICAgICBpZiAocDEgJiYgcDIpIHtcbiAgICAgICAgLy8gcDMgYW5kIHA0IGFyZSBlbmQgcG9pbnRzIGZvciBuZXcgbW92ZWQgKGV4dHJ1ZGVkKSBlZGdlXG4gICAgICAgIGNvbnN0IFtwMywgcDRdID0gZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyhwMSwgcDIsIGV2ZW50Lmdyb3VuZENvb3Jkcyk7XG5cbiAgICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKClcbiAgICAgICAgICAucmVwbGFjZVBvc2l0aW9uKFxuICAgICAgICAgICAgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsXG4gICAgICAgICAgICB0aGlzLnByZXZQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzLCBzaXplKSxcbiAgICAgICAgICAgIHA0XG4gICAgICAgICAgKVxuICAgICAgICAgIC5yZXBsYWNlUG9zaXRpb24oZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsIHBvc2l0aW9uSW5kZXhlcywgcDMpXG4gICAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgICAgZWRpdFR5cGU6ICdleHRydWRlZCcsXG4gICAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtlZGl0SGFuZGxlLmZlYXR1cmVJbmRleF0sXG4gICAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgICBwb3NpdGlvbjogcDNcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuaXNQb2ludEFkZGVkID0gZmFsc2U7XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGNvb3JkaW5hdGVzU2l6ZShwb3NpdGlvbkluZGV4ZXM6IG51bWJlcltdLCBmZWF0dXJlSW5kZXg6IG51bWJlcikge1xuICAgIGxldCBzaXplID0gMDtcbiAgICBjb25zdCBmZWF0dXJlID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpLmdldE9iamVjdCgpLmZlYXR1cmVzW2ZlYXR1cmVJbmRleF07XG4gICAgY29uc3QgY29vcmRpbmF0ZXM6IGFueSA9IGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgLy8gZm9yIE11bHRpIHBvbHlnb25zLCBsZW5ndGggd2lsbCBiZSAzXG4gICAgaWYgKHBvc2l0aW9uSW5kZXhlcy5sZW5ndGggPT09IDMpIHtcbiAgICAgIGNvbnN0IFthLCBiXSA9IHBvc2l0aW9uSW5kZXhlcztcbiAgICAgIGlmIChjb29yZGluYXRlcy5sZW5ndGggJiYgY29vcmRpbmF0ZXNbYV0ubGVuZ3RoKSB7XG4gICAgICAgIHNpemUgPSBjb29yZGluYXRlc1thXVtiXS5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IFtiXSA9IHBvc2l0aW9uSW5kZXhlcztcbiAgICAgIGlmIChjb29yZGluYXRlcy5sZW5ndGggJiYgY29vcmRpbmF0ZXNbYl0ubGVuZ3RoKSB7XG4gICAgICAgIHNpemUgPSBjb29yZGluYXRlc1tiXS5sZW5ndGg7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzaXplO1xuICB9XG5cbiAgZ2V0QmVhcmluZyhwMTogYW55LCBwMjogYW55KSB7XG4gICAgY29uc3QgYW5nbGUgPSBiZWFyaW5nKHAxLCBwMik7XG4gICAgaWYgKGFuZ2xlIDwgMCkge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoMzYwICsgYW5nbGUpO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5mbG9vcihhbmdsZSk7XG4gIH1cblxuICBpc09ydGhvZ29uYWwocG9zaXRpb25JbmRleGVzOiBudW1iZXJbXSwgZmVhdHVyZUluZGV4OiBudW1iZXIsIHNpemU6IG51bWJlcikge1xuICAgIGlmIChwb3NpdGlvbkluZGV4ZXNbcG9zaXRpb25JbmRleGVzLmxlbmd0aCAtIDFdID09PSBzaXplIC0gMSkge1xuICAgICAgcG9zaXRpb25JbmRleGVzW3Bvc2l0aW9uSW5kZXhlcy5sZW5ndGggLSAxXSA9IDA7XG4gICAgfVxuICAgIGNvbnN0IHByZXZQb2ludCA9IHRoaXMuZ2V0UG9pbnRGb3JQb3NpdGlvbkluZGV4ZXMoXG4gICAgICB0aGlzLnByZXZQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzLCBzaXplKSxcbiAgICAgIGZlYXR1cmVJbmRleFxuICAgICk7XG4gICAgY29uc3QgbmV4dFBvaW50ID0gdGhpcy5nZXRQb2ludEZvclBvc2l0aW9uSW5kZXhlcyhcbiAgICAgIHRoaXMubmV4dFBvc2l0aW9uSW5kZXhlcyhwb3NpdGlvbkluZGV4ZXMsIHNpemUpLFxuICAgICAgZmVhdHVyZUluZGV4XG4gICAgKTtcbiAgICBjb25zdCBjdXJyZW50UG9pbnQgPSB0aGlzLmdldFBvaW50Rm9yUG9zaXRpb25JbmRleGVzKHBvc2l0aW9uSW5kZXhlcywgZmVhdHVyZUluZGV4KTtcbiAgICBjb25zdCBwcmV2QW5nbGUgPSB0aGlzLmdldEJlYXJpbmcoY3VycmVudFBvaW50LCBwcmV2UG9pbnQpO1xuICAgIGNvbnN0IG5leHRBbmdsZSA9IHRoaXMuZ2V0QmVhcmluZyhjdXJyZW50UG9pbnQsIG5leHRQb2ludCk7XG4gICAgcmV0dXJuIFs4OSwgOTAsIDkxLCAyNjksIDI3MCwgMjcxXS5pbmNsdWRlcyhNYXRoLmFicyhwcmV2QW5nbGUgLSBuZXh0QW5nbGUpKTtcbiAgfVxuXG4gIG5leHRQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzOiBudW1iZXJbXSwgc2l6ZTogbnVtYmVyKTogbnVtYmVyW10ge1xuICAgIGNvbnN0IG5leHQgPSBbLi4ucG9zaXRpb25JbmRleGVzXTtcbiAgICBpZiAobmV4dC5sZW5ndGgpIHtcbiAgICAgIG5leHRbbmV4dC5sZW5ndGggLSAxXSA9IG5leHRbbmV4dC5sZW5ndGggLSAxXSA9PT0gc2l6ZSAtIDEgPyAwIDogbmV4dFtuZXh0Lmxlbmd0aCAtIDFdICsgMTtcbiAgICB9XG4gICAgcmV0dXJuIG5leHQ7XG4gIH1cblxuICBwcmV2UG9zaXRpb25JbmRleGVzKHBvc2l0aW9uSW5kZXhlczogbnVtYmVyW10sIHNpemU6IG51bWJlcik6IG51bWJlcltdIHtcbiAgICBjb25zdCBwcmV2ID0gWy4uLnBvc2l0aW9uSW5kZXhlc107XG4gICAgaWYgKHByZXYubGVuZ3RoKSB7XG4gICAgICBwcmV2W3ByZXYubGVuZ3RoIC0gMV0gPSBwcmV2W3ByZXYubGVuZ3RoIC0gMV0gPT09IDAgPyBzaXplIC0gMiA6IHByZXZbcHJldi5sZW5ndGggLSAxXSAtIDE7XG4gICAgfVxuICAgIHJldHVybiBwcmV2O1xuICB9XG5cbiAgZ2V0UG9pbnRGb3JQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzOiBudW1iZXJbXSwgZmVhdHVyZUluZGV4OiBudW1iZXIpIHtcbiAgICBsZXQgcDE7XG4gICAgY29uc3QgZmVhdHVyZSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKS5nZXRPYmplY3QoKS5mZWF0dXJlc1tmZWF0dXJlSW5kZXhdO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzOiBhbnkgPSBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICAgIC8vIGZvciBNdWx0aSBwb2x5Z29ucywgbGVuZ3RoIHdpbGwgYmUgM1xuICAgIGlmIChwb3NpdGlvbkluZGV4ZXMubGVuZ3RoID09PSAzKSB7XG4gICAgICBjb25zdCBbYSwgYiwgY10gPSBwb3NpdGlvbkluZGV4ZXM7XG4gICAgICBpZiAoY29vcmRpbmF0ZXMubGVuZ3RoICYmIGNvb3JkaW5hdGVzW2FdLmxlbmd0aCkge1xuICAgICAgICBwMSA9IGNvb3JkaW5hdGVzW2FdW2JdW2NdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBbYiwgY10gPSBwb3NpdGlvbkluZGV4ZXM7XG4gICAgICBpZiAoY29vcmRpbmF0ZXMubGVuZ3RoICYmIGNvb3JkaW5hdGVzW2JdLmxlbmd0aCkge1xuICAgICAgICBwMSA9IGNvb3JkaW5hdGVzW2JdW2NdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcDE7XG4gIH1cbn1cbiJdfQ==