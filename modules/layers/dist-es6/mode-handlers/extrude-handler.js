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

// TODO edit-modes: delete handlers once EditMode fully implemented
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2V4dHJ1ZGUtaGFuZGxlci5qcyJdLCJuYW1lcyI6WyJFeHRydWRlSGFuZGxlciIsImV2ZW50IiwiX2xhc3RQb2ludGVyTW92ZVBpY2tzIiwicGlja3MiLCJlZGl0QWN0aW9uIiwiZWRpdEhhbmRsZSIsInBvaW50ZXJEb3duUGlja3MiLCJpc0RyYWdnaW5nIiwic2l6ZSIsImNvb3JkaW5hdGVzU2l6ZSIsInBvc2l0aW9uSW5kZXhlcyIsImZlYXR1cmVJbmRleCIsImlzUG9pbnRBZGRlZCIsIm5leHRQb3NpdGlvbkluZGV4ZXMiLCJwMSIsImdldFBvaW50Rm9yUG9zaXRpb25JbmRleGVzIiwicHJldlBvc2l0aW9uSW5kZXhlcyIsInAyIiwiZ3JvdW5kQ29vcmRzIiwicDMiLCJwNCIsInVwZGF0ZWREYXRhIiwiZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJyZXBsYWNlUG9zaXRpb24iLCJnZXRPYmplY3QiLCJlZGl0VHlwZSIsImZlYXR1cmVJbmRleGVzIiwiZWRpdENvbnRleHQiLCJwb3NpdGlvbiIsImNhbmNlbE1hcFBhbiIsIkJvb2xlYW4iLCJzZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwiZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImxlbmd0aCIsInR5cGUiLCJpc09ydGhvZ29uYWwiLCJhZGRQb3NpdGlvbiIsImZlYXR1cmUiLCJmZWF0dXJlcyIsImNvb3JkaW5hdGVzIiwiZ2VvbWV0cnkiLCJhIiwiYiIsImFuZ2xlIiwiTWF0aCIsImZsb29yIiwicHJldlBvaW50IiwibmV4dFBvaW50IiwiY3VycmVudFBvaW50IiwicHJldkFuZ2xlIiwiZ2V0QmVhcmluZyIsIm5leHRBbmdsZSIsImluY2x1ZGVzIiwiYWJzIiwibmV4dCIsInByZXYiLCJjIiwiTW9kaWZ5SGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUdBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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YUFBT3NCLElBQVA7QUFDRDs7OytDQUUwQjdDLGUsRUFBMkJDLFksRUFBc0I7QUFDMUUsVUFBSUcsRUFBSjtBQUNBLFVBQU11QixPQUFPLEdBQUcsS0FBS2YsNkJBQUwsR0FBcUNFLFNBQXJDLEdBQWlEYyxRQUFqRCxDQUEwRDNCLFlBQTFELENBQWhCO0FBQ0EsVUFBTTRCLFdBQWdCLEdBQUdGLE9BQU8sQ0FBQ0csUUFBUixDQUFpQkQsV0FBMUMsQ0FIMEUsQ0FJMUU7O0FBQ0EsVUFBSTdCLGVBQWUsQ0FBQ3VCLE1BQWhCLEtBQTJCLENBQS9CLEVBQWtDO0FBQUEsK0NBQ2R2QixlQURjO0FBQUEsWUFDekIrQixDQUR5QjtBQUFBLFlBQ3RCQyxDQURzQjtBQUFBLFlBQ25CYyxDQURtQjs7QUFFaEMsWUFBSWpCLFdBQVcsQ0FBQ04sTUFBWixJQUFzQk0sV0FBVyxDQUFDRSxDQUFELENBQVgsQ0FBZVIsTUFBekMsRUFBaUQ7QUFDL0NuQixVQUFBQSxFQUFFLEdBQUd5QixXQUFXLENBQUNFLENBQUQsQ0FBWCxDQUFlQyxDQUFmLEVBQWtCYyxDQUFsQixDQUFMO0FBQ0Q7QUFDRixPQUxELE1BS087QUFBQSwrQ0FDVTlDLGVBRFY7QUFBQSxZQUNFZ0MsR0FERjtBQUFBLFlBQ0tjLEVBREw7O0FBRUwsWUFBSWpCLFdBQVcsQ0FBQ04sTUFBWixJQUFzQk0sV0FBVyxDQUFDRyxHQUFELENBQVgsQ0FBZVQsTUFBekMsRUFBaUQ7QUFDL0NuQixVQUFBQSxFQUFFLEdBQUd5QixXQUFXLENBQUNHLEdBQUQsQ0FBWCxDQUFlYyxFQUFmLENBQUw7QUFDRDtBQUNGOztBQUNELGFBQU8xQyxFQUFQO0FBQ0Q7Ozs7RUF4T2lDMkMsNEIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgYmVhcmluZyBmcm9tICdAdHVyZi9iZWFyaW5nJztcbmltcG9ydCB7IGdlbmVyYXRlUG9pbnRzUGFyYWxsZWxUb0xpbmVQb2ludHMgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgdHlwZSB7IFBvaW50ZXJNb3ZlRXZlbnQsIFN0YXJ0RHJhZ2dpbmdFdmVudCwgU3RvcERyYWdnaW5nRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRBY3Rpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBnZXRQaWNrZWRFZGl0SGFuZGxlIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgTW9kaWZ5SGFuZGxlciB9IGZyb20gJy4vbW9kaWZ5LWhhbmRsZXInO1xuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgRXh0cnVkZUhhbmRsZXIgZXh0ZW5kcyBNb2RpZnlIYW5kbGVyIHtcbiAgaXNQb2ludEFkZGVkOiBib29sZWFuID0gZmFsc2U7XG4gIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KTogeyBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIHRoaXMuX2xhc3RQb2ludGVyTW92ZVBpY2tzID0gZXZlbnQucGlja3M7XG5cbiAgICBsZXQgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24gPSBudWxsO1xuXG4gICAgY29uc3QgZWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucG9pbnRlckRvd25QaWNrcyk7XG5cbiAgICBpZiAoZXZlbnQuaXNEcmFnZ2luZyAmJiBlZGl0SGFuZGxlKSB7XG4gICAgICBjb25zdCBzaXplID0gdGhpcy5jb29yZGluYXRlc1NpemUoZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsIGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4KTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uSW5kZXhlcyA9IHRoaXMuaXNQb2ludEFkZGVkXG4gICAgICAgID8gdGhpcy5uZXh0UG9zaXRpb25JbmRleGVzKGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLCBzaXplKVxuICAgICAgICA6IGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzO1xuICAgICAgLy8gcDEgYW5kIHAxIGFyZSBlbmQgcG9pbnRzIGZvciBlZGdlXG4gICAgICBjb25zdCBwMSA9IHRoaXMuZ2V0UG9pbnRGb3JQb3NpdGlvbkluZGV4ZXMoXG4gICAgICAgIHRoaXMucHJldlBvc2l0aW9uSW5kZXhlcyhwb3NpdGlvbkluZGV4ZXMsIHNpemUpLFxuICAgICAgICBlZGl0SGFuZGxlLmZlYXR1cmVJbmRleFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHAyID0gdGhpcy5nZXRQb2ludEZvclBvc2l0aW9uSW5kZXhlcyhwb3NpdGlvbkluZGV4ZXMsIGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4KTtcbiAgICAgIGlmIChwMSAmJiBwMikge1xuICAgICAgICAvLyBwMyBhbmQgcDQgYXJlIGVuZCBwb2ludHMgZm9yIG1vdmluZyAoZXh0cnVkaW5nKSBlZGdlXG4gICAgICAgIGNvbnN0IFtwMywgcDRdID0gZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyhwMSwgcDIsIGV2ZW50Lmdyb3VuZENvb3Jkcyk7XG5cbiAgICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKClcbiAgICAgICAgICAucmVwbGFjZVBvc2l0aW9uKFxuICAgICAgICAgICAgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsXG4gICAgICAgICAgICB0aGlzLnByZXZQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzLCBzaXplKSxcbiAgICAgICAgICAgIHA0XG4gICAgICAgICAgKVxuICAgICAgICAgIC5yZXBsYWNlUG9zaXRpb24oZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsIHBvc2l0aW9uSW5kZXhlcywgcDMpXG4gICAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgICAgZWRpdFR5cGU6ICdleHRydWRpbmcnLFxuICAgICAgICAgIGZlYXR1cmVJbmRleGVzOiBbZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXhdLFxuICAgICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IHRoaXMubmV4dFBvc2l0aW9uSW5kZXhlcyhlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcywgc2l6ZSksXG4gICAgICAgICAgICBwb3NpdGlvbjogcDNcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2FuY2VsIG1hcCBwYW5uaW5nIGlmIHBvaW50ZXIgd2VudCBkb3duIG9uIGFuIGVkaXQgaGFuZGxlXG4gICAgY29uc3QgY2FuY2VsTWFwUGFuID0gQm9vbGVhbihlZGl0SGFuZGxlKTtcblxuICAgIHJldHVybiB7IGVkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbiB9O1xuICB9XG5cbiAgaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIGxldCBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiA9IG51bGw7XG5cbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleGVzID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKCk7XG5cbiAgICBjb25zdCBlZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5waWNrcyk7XG4gICAgaWYgKHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoICYmIGVkaXRIYW5kbGUgJiYgZWRpdEhhbmRsZS50eXBlID09PSAnaW50ZXJtZWRpYXRlJykge1xuICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuY29vcmRpbmF0ZXNTaXplKGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLCBlZGl0SGFuZGxlLmZlYXR1cmVJbmRleCk7XG4gICAgICAvLyBwMSBhbmQgcDEgYXJlIGVuZCBwb2ludHMgZm9yIGVkZ2VcbiAgICAgIGNvbnN0IHAxID0gdGhpcy5nZXRQb2ludEZvclBvc2l0aW9uSW5kZXhlcyhcbiAgICAgICAgdGhpcy5wcmV2UG9zaXRpb25JbmRleGVzKGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLCBzaXplKSxcbiAgICAgICAgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXhcbiAgICAgICk7XG4gICAgICBjb25zdCBwMiA9IHRoaXMuZ2V0UG9pbnRGb3JQb3NpdGlvbkluZGV4ZXMoXG4gICAgICAgIGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICBlZGl0SGFuZGxlLmZlYXR1cmVJbmRleFxuICAgICAgKTtcblxuICAgICAgaWYgKHAxICYmIHAyKSB7XG4gICAgICAgIGxldCB1cGRhdGVkRGF0YSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzT3J0aG9nb25hbChlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcywgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsIHNpemUpKSB7XG4gICAgICAgICAgdXBkYXRlZERhdGEgPSB1cGRhdGVkRGF0YS5hZGRQb3NpdGlvbihcbiAgICAgICAgICAgIGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LFxuICAgICAgICAgICAgZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgICBwMlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICF0aGlzLmlzT3J0aG9nb25hbChcbiAgICAgICAgICAgIHRoaXMucHJldlBvc2l0aW9uSW5kZXhlcyhlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcywgc2l6ZSksXG4gICAgICAgICAgICBlZGl0SGFuZGxlLmZlYXR1cmVJbmRleCxcbiAgICAgICAgICAgIHNpemVcbiAgICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICAgIHVwZGF0ZWREYXRhID0gdXBkYXRlZERhdGEuYWRkUG9zaXRpb24oXG4gICAgICAgICAgICBlZGl0SGFuZGxlLmZlYXR1cmVJbmRleCxcbiAgICAgICAgICAgIGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgICAgcDFcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuaXNQb2ludEFkZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgICAgdXBkYXRlZERhdGE6IHVwZGF0ZWREYXRhLmdldE9iamVjdCgpLFxuICAgICAgICAgIGVkaXRUeXBlOiAnc3RhcnRFeHRydWRpbmcnLFxuICAgICAgICAgIGZlYXR1cmVJbmRleGVzOiBbZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXhdLFxuICAgICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgICAgcG9zaXRpb246IHAxXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgaGFuZGxlU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCk6ID9FZGl0QWN0aW9uIHtcbiAgICBsZXQgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24gPSBudWxsO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpO1xuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBpY2tzKTtcbiAgICBpZiAoc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5sZW5ndGggJiYgZWRpdEhhbmRsZSkge1xuICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuY29vcmRpbmF0ZXNTaXplKGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLCBlZGl0SGFuZGxlLmZlYXR1cmVJbmRleCk7XG4gICAgICBjb25zdCBwb3NpdGlvbkluZGV4ZXMgPSB0aGlzLmlzUG9pbnRBZGRlZFxuICAgICAgICA/IHRoaXMubmV4dFBvc2l0aW9uSW5kZXhlcyhlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcywgc2l6ZSlcbiAgICAgICAgOiBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcztcbiAgICAgIC8vIHAxIGFuZCBwMSBhcmUgZW5kIHBvaW50cyBmb3IgZWRnZVxuICAgICAgY29uc3QgcDEgPSB0aGlzLmdldFBvaW50Rm9yUG9zaXRpb25JbmRleGVzKFxuICAgICAgICB0aGlzLnByZXZQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzLCBzaXplKSxcbiAgICAgICAgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXhcbiAgICAgICk7XG4gICAgICBjb25zdCBwMiA9IHRoaXMuZ2V0UG9pbnRGb3JQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzLCBlZGl0SGFuZGxlLmZlYXR1cmVJbmRleCk7XG5cbiAgICAgIGlmIChwMSAmJiBwMikge1xuICAgICAgICAvLyBwMyBhbmQgcDQgYXJlIGVuZCBwb2ludHMgZm9yIG5ldyBtb3ZlZCAoZXh0cnVkZWQpIGVkZ2VcbiAgICAgICAgY29uc3QgW3AzLCBwNF0gPSBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzKHAxLCBwMiwgZXZlbnQuZ3JvdW5kQ29vcmRzKTtcblxuICAgICAgICBjb25zdCB1cGRhdGVkRGF0YSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKVxuICAgICAgICAgIC5yZXBsYWNlUG9zaXRpb24oXG4gICAgICAgICAgICBlZGl0SGFuZGxlLmZlYXR1cmVJbmRleCxcbiAgICAgICAgICAgIHRoaXMucHJldlBvc2l0aW9uSW5kZXhlcyhwb3NpdGlvbkluZGV4ZXMsIHNpemUpLFxuICAgICAgICAgICAgcDRcbiAgICAgICAgICApXG4gICAgICAgICAgLnJlcGxhY2VQb3NpdGlvbihlZGl0SGFuZGxlLmZlYXR1cmVJbmRleCwgcG9zaXRpb25JbmRleGVzLCBwMylcbiAgICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgICAgZWRpdEFjdGlvbiA9IHtcbiAgICAgICAgICB1cGRhdGVkRGF0YSxcbiAgICAgICAgICBlZGl0VHlwZTogJ2V4dHJ1ZGVkJyxcbiAgICAgICAgICBmZWF0dXJlSW5kZXhlczogW2VkaXRIYW5kbGUuZmVhdHVyZUluZGV4XSxcbiAgICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwM1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5pc1BvaW50QWRkZWQgPSBmYWxzZTtcblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgY29vcmRpbmF0ZXNTaXplKHBvc2l0aW9uSW5kZXhlczogbnVtYmVyW10sIGZlYXR1cmVJbmRleDogbnVtYmVyKSB7XG4gICAgbGV0IHNpemUgPSAwO1xuICAgIGNvbnN0IGZlYXR1cmUgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKCkuZ2V0T2JqZWN0KCkuZmVhdHVyZXNbZmVhdHVyZUluZGV4XTtcbiAgICBjb25zdCBjb29yZGluYXRlczogYW55ID0gZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICAvLyBmb3IgTXVsdGkgcG9seWdvbnMsIGxlbmd0aCB3aWxsIGJlIDNcbiAgICBpZiAocG9zaXRpb25JbmRleGVzLmxlbmd0aCA9PT0gMykge1xuICAgICAgY29uc3QgW2EsIGJdID0gcG9zaXRpb25JbmRleGVzO1xuICAgICAgaWYgKGNvb3JkaW5hdGVzLmxlbmd0aCAmJiBjb29yZGluYXRlc1thXS5sZW5ndGgpIHtcbiAgICAgICAgc2l6ZSA9IGNvb3JkaW5hdGVzW2FdW2JdLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgW2JdID0gcG9zaXRpb25JbmRleGVzO1xuICAgICAgaWYgKGNvb3JkaW5hdGVzLmxlbmd0aCAmJiBjb29yZGluYXRlc1tiXS5sZW5ndGgpIHtcbiAgICAgICAgc2l6ZSA9IGNvb3JkaW5hdGVzW2JdLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNpemU7XG4gIH1cblxuICBnZXRCZWFyaW5nKHAxOiBhbnksIHAyOiBhbnkpIHtcbiAgICBjb25zdCBhbmdsZSA9IGJlYXJpbmcocDEsIHAyKTtcbiAgICBpZiAoYW5nbGUgPCAwKSB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcigzNjAgKyBhbmdsZSk7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLmZsb29yKGFuZ2xlKTtcbiAgfVxuXG4gIGlzT3J0aG9nb25hbChwb3NpdGlvbkluZGV4ZXM6IG51bWJlcltdLCBmZWF0dXJlSW5kZXg6IG51bWJlciwgc2l6ZTogbnVtYmVyKSB7XG4gICAgaWYgKHBvc2l0aW9uSW5kZXhlc1twb3NpdGlvbkluZGV4ZXMubGVuZ3RoIC0gMV0gPT09IHNpemUgLSAxKSB7XG4gICAgICBwb3NpdGlvbkluZGV4ZXNbcG9zaXRpb25JbmRleGVzLmxlbmd0aCAtIDFdID0gMDtcbiAgICB9XG4gICAgY29uc3QgcHJldlBvaW50ID0gdGhpcy5nZXRQb2ludEZvclBvc2l0aW9uSW5kZXhlcyhcbiAgICAgIHRoaXMucHJldlBvc2l0aW9uSW5kZXhlcyhwb3NpdGlvbkluZGV4ZXMsIHNpemUpLFxuICAgICAgZmVhdHVyZUluZGV4XG4gICAgKTtcbiAgICBjb25zdCBuZXh0UG9pbnQgPSB0aGlzLmdldFBvaW50Rm9yUG9zaXRpb25JbmRleGVzKFxuICAgICAgdGhpcy5uZXh0UG9zaXRpb25JbmRleGVzKHBvc2l0aW9uSW5kZXhlcywgc2l6ZSksXG4gICAgICBmZWF0dXJlSW5kZXhcbiAgICApO1xuICAgIGNvbnN0IGN1cnJlbnRQb2ludCA9IHRoaXMuZ2V0UG9pbnRGb3JQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzLCBmZWF0dXJlSW5kZXgpO1xuICAgIGNvbnN0IHByZXZBbmdsZSA9IHRoaXMuZ2V0QmVhcmluZyhjdXJyZW50UG9pbnQsIHByZXZQb2ludCk7XG4gICAgY29uc3QgbmV4dEFuZ2xlID0gdGhpcy5nZXRCZWFyaW5nKGN1cnJlbnRQb2ludCwgbmV4dFBvaW50KTtcbiAgICByZXR1cm4gWzg5LCA5MCwgOTEsIDI2OSwgMjcwLCAyNzFdLmluY2x1ZGVzKE1hdGguYWJzKHByZXZBbmdsZSAtIG5leHRBbmdsZSkpO1xuICB9XG5cbiAgbmV4dFBvc2l0aW9uSW5kZXhlcyhwb3NpdGlvbkluZGV4ZXM6IG51bWJlcltdLCBzaXplOiBudW1iZXIpOiBudW1iZXJbXSB7XG4gICAgY29uc3QgbmV4dCA9IFsuLi5wb3NpdGlvbkluZGV4ZXNdO1xuICAgIGlmIChuZXh0Lmxlbmd0aCkge1xuICAgICAgbmV4dFtuZXh0Lmxlbmd0aCAtIDFdID0gbmV4dFtuZXh0Lmxlbmd0aCAtIDFdID09PSBzaXplIC0gMSA/IDAgOiBuZXh0W25leHQubGVuZ3RoIC0gMV0gKyAxO1xuICAgIH1cbiAgICByZXR1cm4gbmV4dDtcbiAgfVxuXG4gIHByZXZQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzOiBudW1iZXJbXSwgc2l6ZTogbnVtYmVyKTogbnVtYmVyW10ge1xuICAgIGNvbnN0IHByZXYgPSBbLi4ucG9zaXRpb25JbmRleGVzXTtcbiAgICBpZiAocHJldi5sZW5ndGgpIHtcbiAgICAgIHByZXZbcHJldi5sZW5ndGggLSAxXSA9IHByZXZbcHJldi5sZW5ndGggLSAxXSA9PT0gMCA/IHNpemUgLSAyIDogcHJldltwcmV2Lmxlbmd0aCAtIDFdIC0gMTtcbiAgICB9XG4gICAgcmV0dXJuIHByZXY7XG4gIH1cblxuICBnZXRQb2ludEZvclBvc2l0aW9uSW5kZXhlcyhwb3NpdGlvbkluZGV4ZXM6IG51bWJlcltdLCBmZWF0dXJlSW5kZXg6IG51bWJlcikge1xuICAgIGxldCBwMTtcbiAgICBjb25zdCBmZWF0dXJlID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpLmdldE9iamVjdCgpLmZlYXR1cmVzW2ZlYXR1cmVJbmRleF07XG4gICAgY29uc3QgY29vcmRpbmF0ZXM6IGFueSA9IGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgLy8gZm9yIE11bHRpIHBvbHlnb25zLCBsZW5ndGggd2lsbCBiZSAzXG4gICAgaWYgKHBvc2l0aW9uSW5kZXhlcy5sZW5ndGggPT09IDMpIHtcbiAgICAgIGNvbnN0IFthLCBiLCBjXSA9IHBvc2l0aW9uSW5kZXhlcztcbiAgICAgIGlmIChjb29yZGluYXRlcy5sZW5ndGggJiYgY29vcmRpbmF0ZXNbYV0ubGVuZ3RoKSB7XG4gICAgICAgIHAxID0gY29vcmRpbmF0ZXNbYV1bYl1bY107XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IFtiLCBjXSA9IHBvc2l0aW9uSW5kZXhlcztcbiAgICAgIGlmIChjb29yZGluYXRlcy5sZW5ndGggJiYgY29vcmRpbmF0ZXNbYl0ubGVuZ3RoKSB7XG4gICAgICAgIHAxID0gY29vcmRpbmF0ZXNbYl1bY107XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwMTtcbiAgfVxufVxuIl19