"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtrudeMode = void 0;

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _utils = require("../utils.js");

var _geojsonEditMode = require("./geojson-edit-mode.js");

var _modifyMode = require("./modify-mode.js");

var _immutableFeatureCollection = require("./immutable-feature-collection.js");

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

var ExtrudeMode =
/*#__PURE__*/
function (_ModifyMode) {
  _inherits(ExtrudeMode, _ModifyMode);

  function ExtrudeMode() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ExtrudeMode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ExtrudeMode)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "isPointAdded", false);

    return _this;
  }

  _createClass(ExtrudeMode, [{
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      var editAction = null;
      var editHandle = (0, _geojsonEditMode.getPickedEditHandle)(event.pointerDownPicks);

      if (event.isDragging && editHandle) {
        var size = this.coordinatesSize(editHandle.positionIndexes, editHandle.featureIndex, props.data);
        var positionIndexes = this.isPointAdded ? this.nextPositionIndexes(editHandle.positionIndexes, size) : editHandle.positionIndexes; // p1 and p1 are end points for edge

        var p1 = this.getPointForPositionIndexes(this.prevPositionIndexes(positionIndexes, size), editHandle.featureIndex, props.data);
        var p2 = this.getPointForPositionIndexes(positionIndexes, editHandle.featureIndex, props.data);

        if (p1 && p2) {
          // p3 and p4 are end points for moving (extruding) edge
          var _generatePointsParall = (0, _utils.generatePointsParallelToLinePoints)(p1, p2, event.mapCoords),
              _generatePointsParall2 = _slicedToArray(_generatePointsParall, 2),
              p3 = _generatePointsParall2[0],
              p4 = _generatePointsParall2[1];

          var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).replacePosition(editHandle.featureIndex, this.prevPositionIndexes(positionIndexes, size), p4).replacePosition(editHandle.featureIndex, positionIndexes, p3).getObject();
          editAction = {
            updatedData: updatedData,
            editType: 'extruding',
            editContext: {
              featureIndexes: [editHandle.featureIndex],
              positionIndexes: this.nextPositionIndexes(editHandle.positionIndexes, size),
              position: p3
            }
          };
          props.onEdit(editAction);
        }
      }

      var cursor = this.getCursor(event);
      props.onUpdateCursor(cursor); // Cancel map panning if pointer went down on an edit handle

      var cancelMapPan = Boolean(editHandle);

      if (cancelMapPan) {
        event.sourceEvent.stopPropagation();
      }
    }
  }, {
    key: "handleStartDraggingAdapter",
    value: function handleStartDraggingAdapter(event, props) {
      var editAction = null;
      var selectedFeatureIndexes = props.selectedIndexes;
      var editHandle = (0, _geojsonEditMode.getPickedEditHandle)(event.picks);

      if (selectedFeatureIndexes.length && editHandle && editHandle.type === 'intermediate') {
        var size = this.coordinatesSize(editHandle.positionIndexes, editHandle.featureIndex, props.data); // p1 and p1 are end points for edge

        var p1 = this.getPointForPositionIndexes(this.prevPositionIndexes(editHandle.positionIndexes, size), editHandle.featureIndex, props.data);
        var p2 = this.getPointForPositionIndexes(editHandle.positionIndexes, editHandle.featureIndex, props.data);

        if (p1 && p2) {
          var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data);

          if (!this.isOrthogonal(editHandle.positionIndexes, editHandle.featureIndex, size, props.data)) {
            updatedData = updatedData.addPosition(editHandle.featureIndex, editHandle.positionIndexes, p2);
          }

          if (!this.isOrthogonal(this.prevPositionIndexes(editHandle.positionIndexes, size), editHandle.featureIndex, size, props.data)) {
            updatedData = updatedData.addPosition(editHandle.featureIndex, editHandle.positionIndexes, p1);
            this.isPointAdded = true;
          }

          editAction = {
            updatedData: updatedData.getObject(),
            editType: 'startExtruding',
            editContext: {
              featureIndexes: [editHandle.featureIndex],
              positionIndexes: editHandle.positionIndexes,
              position: p1
            }
          };
        }
      }

      return editAction;
    }
  }, {
    key: "handleStopDraggingAdapter",
    value: function handleStopDraggingAdapter(event, props) {
      var editAction = null;
      var selectedFeatureIndexes = props.selectedIndexes;
      var editHandle = (0, _geojsonEditMode.getPickedEditHandle)(event.picks);

      if (selectedFeatureIndexes.length && editHandle) {
        var size = this.coordinatesSize(editHandle.positionIndexes, editHandle.featureIndex, props.data);
        var positionIndexes = this.isPointAdded ? this.nextPositionIndexes(editHandle.positionIndexes, size) : editHandle.positionIndexes; // p1 and p1 are end points for edge

        var p1 = this.getPointForPositionIndexes(this.prevPositionIndexes(positionIndexes, size), editHandle.featureIndex, props.data);
        var p2 = this.getPointForPositionIndexes(positionIndexes, editHandle.featureIndex, props.data);

        if (p1 && p2) {
          // p3 and p4 are end points for new moved (extruded) edge
          var _generatePointsParall3 = (0, _utils.generatePointsParallelToLinePoints)(p1, p2, event.mapCoords),
              _generatePointsParall4 = _slicedToArray(_generatePointsParall3, 2),
              p3 = _generatePointsParall4[0],
              p4 = _generatePointsParall4[1];

          var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).replacePosition(editHandle.featureIndex, this.prevPositionIndexes(positionIndexes, size), p4).replacePosition(editHandle.featureIndex, positionIndexes, p3).getObject();
          editAction = {
            updatedData: updatedData,
            editType: 'extruded',
            editContext: {
              featureIndexes: [editHandle.featureIndex],
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
    value: function coordinatesSize(positionIndexes, featureIndex, _ref) {
      var features = _ref.features;
      var size = 0;
      var feature = features[featureIndex];
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
    value: function isOrthogonal(positionIndexes, featureIndex, size, features) {
      if (positionIndexes[positionIndexes.length - 1] === size - 1) {
        positionIndexes[positionIndexes.length - 1] = 0;
      }

      var prevPoint = this.getPointForPositionIndexes(this.prevPositionIndexes(positionIndexes, size), featureIndex, features);
      var nextPoint = this.getPointForPositionIndexes(this.nextPositionIndexes(positionIndexes, size), featureIndex, features);
      var currentPoint = this.getPointForPositionIndexes(positionIndexes, featureIndex, features);
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
    value: function getPointForPositionIndexes(positionIndexes, featureIndex, _ref2) {
      var features = _ref2.features;
      var p1;
      var feature = features[featureIndex];
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

  return ExtrudeMode;
}(_modifyMode.ModifyMode);

exports.ExtrudeMode = ExtrudeMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZXh0cnVkZS1tb2RlLmpzIl0sIm5hbWVzIjpbIkV4dHJ1ZGVNb2RlIiwiZXZlbnQiLCJwcm9wcyIsImVkaXRBY3Rpb24iLCJlZGl0SGFuZGxlIiwicG9pbnRlckRvd25QaWNrcyIsImlzRHJhZ2dpbmciLCJzaXplIiwiY29vcmRpbmF0ZXNTaXplIiwicG9zaXRpb25JbmRleGVzIiwiZmVhdHVyZUluZGV4IiwiZGF0YSIsImlzUG9pbnRBZGRlZCIsIm5leHRQb3NpdGlvbkluZGV4ZXMiLCJwMSIsImdldFBvaW50Rm9yUG9zaXRpb25JbmRleGVzIiwicHJldlBvc2l0aW9uSW5kZXhlcyIsInAyIiwibWFwQ29vcmRzIiwicDMiLCJwNCIsInVwZGF0ZWREYXRhIiwiSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJyZXBsYWNlUG9zaXRpb24iLCJnZXRPYmplY3QiLCJlZGl0VHlwZSIsImVkaXRDb250ZXh0IiwiZmVhdHVyZUluZGV4ZXMiLCJwb3NpdGlvbiIsIm9uRWRpdCIsImN1cnNvciIsImdldEN1cnNvciIsIm9uVXBkYXRlQ3Vyc29yIiwiY2FuY2VsTWFwUGFuIiwiQm9vbGVhbiIsInNvdXJjZUV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwic2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsInNlbGVjdGVkSW5kZXhlcyIsInBpY2tzIiwibGVuZ3RoIiwidHlwZSIsImlzT3J0aG9nb25hbCIsImFkZFBvc2l0aW9uIiwiZmVhdHVyZXMiLCJmZWF0dXJlIiwiY29vcmRpbmF0ZXMiLCJnZW9tZXRyeSIsImEiLCJiIiwiYW5nbGUiLCJNYXRoIiwiZmxvb3IiLCJwcmV2UG9pbnQiLCJuZXh0UG9pbnQiLCJjdXJyZW50UG9pbnQiLCJwcmV2QW5nbGUiLCJnZXRCZWFyaW5nIiwibmV4dEFuZ2xlIiwiaW5jbHVkZXMiLCJhYnMiLCJuZXh0IiwicHJldiIsImMiLCJNb2RpZnlNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7O0FB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R0FBR2dDLFdBQVcsQ0FBQ0UsQ0FBRCxDQUFYLENBQWVDLENBQWYsRUFBa0JjLENBQWxCLENBQUw7QUFDRDtBQUNGLE9BTEQsTUFLTztBQUFBLCtDQUNVdEQsZUFEVjtBQUFBLFlBQ0V3QyxHQURGO0FBQUEsWUFDS2MsRUFETDs7QUFFTCxZQUFJakIsV0FBVyxDQUFDTixNQUFaLElBQXNCTSxXQUFXLENBQUNHLEdBQUQsQ0FBWCxDQUFlVCxNQUF6QyxFQUFpRDtBQUMvQzFCLFVBQUFBLEVBQUUsR0FBR2dDLFdBQVcsQ0FBQ0csR0FBRCxDQUFYLENBQWVjLEVBQWYsQ0FBTDtBQUNEO0FBQ0Y7O0FBQ0QsYUFBT2pELEVBQVA7QUFDRDs7OztFQTVSOEJrRCxzQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBiZWFyaW5nIGZyb20gJ0B0dXJmL2JlYXJpbmcnO1xuaW1wb3J0IHsgZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyB9IGZyb20gJy4uL3V0aWxzLmpzJztcbmltcG9ydCB0eXBlIHsgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHtcbiAgTW9kZVByb3BzLFxuICBQb2ludGVyTW92ZUV2ZW50LFxuICBTdGFydERyYWdnaW5nRXZlbnQsXG4gIFN0b3BEcmFnZ2luZ0V2ZW50XG59IGZyb20gJy4uL3R5cGVzLmpzJztcbmltcG9ydCB7IGdldFBpY2tlZEVkaXRIYW5kbGUsIHR5cGUgR2VvSnNvbkVkaXRBY3Rpb24gfSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlLmpzJztcbmltcG9ydCB7IE1vZGlmeU1vZGUgfSBmcm9tICcuL21vZGlmeS1tb2RlLmpzJztcbmltcG9ydCB7IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi9pbW11dGFibGUtZmVhdHVyZS1jb2xsZWN0aW9uLmpzJztcblxuZXhwb3J0IGNsYXNzIEV4dHJ1ZGVNb2RlIGV4dGVuZHMgTW9kaWZ5TW9kZSB7XG4gIGlzUG9pbnRBZGRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICBsZXQgZWRpdEFjdGlvbjogP0dlb0pzb25FZGl0QWN0aW9uID0gbnVsbDtcblxuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBvaW50ZXJEb3duUGlja3MpO1xuXG4gICAgaWYgKGV2ZW50LmlzRHJhZ2dpbmcgJiYgZWRpdEhhbmRsZSkge1xuICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuY29vcmRpbmF0ZXNTaXplKFxuICAgICAgICBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsXG4gICAgICAgIHByb3BzLmRhdGFcbiAgICAgICk7XG4gICAgICBjb25zdCBwb3NpdGlvbkluZGV4ZXMgPSB0aGlzLmlzUG9pbnRBZGRlZFxuICAgICAgICA/IHRoaXMubmV4dFBvc2l0aW9uSW5kZXhlcyhlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcywgc2l6ZSlcbiAgICAgICAgOiBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcztcbiAgICAgIC8vIHAxIGFuZCBwMSBhcmUgZW5kIHBvaW50cyBmb3IgZWRnZVxuICAgICAgY29uc3QgcDEgPSB0aGlzLmdldFBvaW50Rm9yUG9zaXRpb25JbmRleGVzKFxuICAgICAgICB0aGlzLnByZXZQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzLCBzaXplKSxcbiAgICAgICAgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsXG4gICAgICAgIHByb3BzLmRhdGFcbiAgICAgICk7XG4gICAgICBjb25zdCBwMiA9IHRoaXMuZ2V0UG9pbnRGb3JQb3NpdGlvbkluZGV4ZXMoXG4gICAgICAgIHBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsXG4gICAgICAgIHByb3BzLmRhdGFcbiAgICAgICk7XG4gICAgICBpZiAocDEgJiYgcDIpIHtcbiAgICAgICAgLy8gcDMgYW5kIHA0IGFyZSBlbmQgcG9pbnRzIGZvciBtb3ZpbmcgKGV4dHJ1ZGluZykgZWRnZVxuICAgICAgICBjb25zdCBbcDMsIHA0XSA9IGdlbmVyYXRlUG9pbnRzUGFyYWxsZWxUb0xpbmVQb2ludHMocDEsIHAyLCBldmVudC5tYXBDb29yZHMpO1xuXG4gICAgICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKHByb3BzLmRhdGEpXG4gICAgICAgICAgLnJlcGxhY2VQb3NpdGlvbihcbiAgICAgICAgICAgIGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LFxuICAgICAgICAgICAgdGhpcy5wcmV2UG9zaXRpb25JbmRleGVzKHBvc2l0aW9uSW5kZXhlcywgc2l6ZSksXG4gICAgICAgICAgICBwNFxuICAgICAgICAgIClcbiAgICAgICAgICAucmVwbGFjZVBvc2l0aW9uKGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LCBwb3NpdGlvbkluZGV4ZXMsIHAzKVxuICAgICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgICBlZGl0QWN0aW9uID0ge1xuICAgICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICAgIGVkaXRUeXBlOiAnZXh0cnVkaW5nJyxcbiAgICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtlZGl0SGFuZGxlLmZlYXR1cmVJbmRleF0sXG4gICAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IHRoaXMubmV4dFBvc2l0aW9uSW5kZXhlcyhlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcywgc2l6ZSksXG4gICAgICAgICAgICBwb3NpdGlvbjogcDNcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcHJvcHMub25FZGl0KGVkaXRBY3Rpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGN1cnNvciA9IHRoaXMuZ2V0Q3Vyc29yKGV2ZW50KTtcbiAgICBwcm9wcy5vblVwZGF0ZUN1cnNvcihjdXJzb3IpO1xuXG4gICAgLy8gQ2FuY2VsIG1hcCBwYW5uaW5nIGlmIHBvaW50ZXIgd2VudCBkb3duIG9uIGFuIGVkaXQgaGFuZGxlXG4gICAgY29uc3QgY2FuY2VsTWFwUGFuID0gQm9vbGVhbihlZGl0SGFuZGxlKTtcbiAgICBpZiAoY2FuY2VsTWFwUGFuKSB7XG4gICAgICBldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nQWRhcHRlcihcbiAgICBldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50LFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICk6ID9HZW9Kc29uRWRpdEFjdGlvbiB7XG4gICAgbGV0IGVkaXRBY3Rpb246ID9HZW9Kc29uRWRpdEFjdGlvbiA9IG51bGw7XG5cbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleGVzID0gcHJvcHMuc2VsZWN0ZWRJbmRleGVzO1xuXG4gICAgY29uc3QgZWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucGlja3MpO1xuICAgIGlmIChzZWxlY3RlZEZlYXR1cmVJbmRleGVzLmxlbmd0aCAmJiBlZGl0SGFuZGxlICYmIGVkaXRIYW5kbGUudHlwZSA9PT0gJ2ludGVybWVkaWF0ZScpIHtcbiAgICAgIGNvbnN0IHNpemUgPSB0aGlzLmNvb3JkaW5hdGVzU2l6ZShcbiAgICAgICAgZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgIGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LFxuICAgICAgICBwcm9wcy5kYXRhXG4gICAgICApO1xuICAgICAgLy8gcDEgYW5kIHAxIGFyZSBlbmQgcG9pbnRzIGZvciBlZGdlXG4gICAgICBjb25zdCBwMSA9IHRoaXMuZ2V0UG9pbnRGb3JQb3NpdGlvbkluZGV4ZXMoXG4gICAgICAgIHRoaXMucHJldlBvc2l0aW9uSW5kZXhlcyhlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcywgc2l6ZSksXG4gICAgICAgIGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LFxuICAgICAgICBwcm9wcy5kYXRhXG4gICAgICApO1xuICAgICAgY29uc3QgcDIgPSB0aGlzLmdldFBvaW50Rm9yUG9zaXRpb25JbmRleGVzKFxuICAgICAgICBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsXG4gICAgICAgIHByb3BzLmRhdGFcbiAgICAgICk7XG5cbiAgICAgIGlmIChwMSAmJiBwMikge1xuICAgICAgICBsZXQgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhdGhpcy5pc09ydGhvZ29uYWwoZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsIGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LCBzaXplLCBwcm9wcy5kYXRhKVxuICAgICAgICApIHtcbiAgICAgICAgICB1cGRhdGVkRGF0YSA9IHVwZGF0ZWREYXRhLmFkZFBvc2l0aW9uKFxuICAgICAgICAgICAgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsXG4gICAgICAgICAgICBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICAgIHAyXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgIXRoaXMuaXNPcnRob2dvbmFsKFxuICAgICAgICAgICAgdGhpcy5wcmV2UG9zaXRpb25JbmRleGVzKGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLCBzaXplKSxcbiAgICAgICAgICAgIGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LFxuICAgICAgICAgICAgc2l6ZSxcbiAgICAgICAgICAgIHByb3BzLmRhdGFcbiAgICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICAgIHVwZGF0ZWREYXRhID0gdXBkYXRlZERhdGEuYWRkUG9zaXRpb24oXG4gICAgICAgICAgICBlZGl0SGFuZGxlLmZlYXR1cmVJbmRleCxcbiAgICAgICAgICAgIGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgICAgcDFcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuaXNQb2ludEFkZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgICAgdXBkYXRlZERhdGE6IHVwZGF0ZWREYXRhLmdldE9iamVjdCgpLFxuICAgICAgICAgIGVkaXRUeXBlOiAnc3RhcnRFeHRydWRpbmcnLFxuICAgICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgICBmZWF0dXJlSW5kZXhlczogW2VkaXRIYW5kbGUuZmVhdHVyZUluZGV4XSxcbiAgICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgICBwb3NpdGlvbjogcDFcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmdBZGFwdGVyKFxuICAgIGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiA/R2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIGxldCBlZGl0QWN0aW9uOiA/R2VvSnNvbkVkaXRBY3Rpb24gPSBudWxsO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyA9IHByb3BzLnNlbGVjdGVkSW5kZXhlcztcbiAgICBjb25zdCBlZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5waWNrcyk7XG4gICAgaWYgKHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoICYmIGVkaXRIYW5kbGUpIHtcbiAgICAgIGNvbnN0IHNpemUgPSB0aGlzLmNvb3JkaW5hdGVzU2l6ZShcbiAgICAgICAgZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgIGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LFxuICAgICAgICBwcm9wcy5kYXRhXG4gICAgICApO1xuICAgICAgY29uc3QgcG9zaXRpb25JbmRleGVzID0gdGhpcy5pc1BvaW50QWRkZWRcbiAgICAgICAgPyB0aGlzLm5leHRQb3NpdGlvbkluZGV4ZXMoZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsIHNpemUpXG4gICAgICAgIDogZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXM7XG4gICAgICAvLyBwMSBhbmQgcDEgYXJlIGVuZCBwb2ludHMgZm9yIGVkZ2VcbiAgICAgIGNvbnN0IHAxID0gdGhpcy5nZXRQb2ludEZvclBvc2l0aW9uSW5kZXhlcyhcbiAgICAgICAgdGhpcy5wcmV2UG9zaXRpb25JbmRleGVzKHBvc2l0aW9uSW5kZXhlcywgc2l6ZSksXG4gICAgICAgIGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LFxuICAgICAgICBwcm9wcy5kYXRhXG4gICAgICApO1xuICAgICAgY29uc3QgcDIgPSB0aGlzLmdldFBvaW50Rm9yUG9zaXRpb25JbmRleGVzKFxuICAgICAgICBwb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgIGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LFxuICAgICAgICBwcm9wcy5kYXRhXG4gICAgICApO1xuXG4gICAgICBpZiAocDEgJiYgcDIpIHtcbiAgICAgICAgLy8gcDMgYW5kIHA0IGFyZSBlbmQgcG9pbnRzIGZvciBuZXcgbW92ZWQgKGV4dHJ1ZGVkKSBlZGdlXG4gICAgICAgIGNvbnN0IFtwMywgcDRdID0gZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyhwMSwgcDIsIGV2ZW50Lm1hcENvb3Jkcyk7XG5cbiAgICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSlcbiAgICAgICAgICAucmVwbGFjZVBvc2l0aW9uKFxuICAgICAgICAgICAgZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsXG4gICAgICAgICAgICB0aGlzLnByZXZQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzLCBzaXplKSxcbiAgICAgICAgICAgIHA0XG4gICAgICAgICAgKVxuICAgICAgICAgIC5yZXBsYWNlUG9zaXRpb24oZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsIHBvc2l0aW9uSW5kZXhlcywgcDMpXG4gICAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgICAgZWRpdFR5cGU6ICdleHRydWRlZCcsXG4gICAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICAgIGZlYXR1cmVJbmRleGVzOiBbZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXhdLFxuICAgICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwM1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5pc1BvaW50QWRkZWQgPSBmYWxzZTtcblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgY29vcmRpbmF0ZXNTaXplKFxuICAgIHBvc2l0aW9uSW5kZXhlczogbnVtYmVyW10sXG4gICAgZmVhdHVyZUluZGV4OiBudW1iZXIsXG4gICAgeyBmZWF0dXJlcyB9OiBGZWF0dXJlQ29sbGVjdGlvblxuICApIHtcbiAgICBsZXQgc2l6ZSA9IDA7XG4gICAgY29uc3QgZmVhdHVyZSA9IGZlYXR1cmVzW2ZlYXR1cmVJbmRleF07XG4gICAgY29uc3QgY29vcmRpbmF0ZXM6IGFueSA9IGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgLy8gZm9yIE11bHRpIHBvbHlnb25zLCBsZW5ndGggd2lsbCBiZSAzXG4gICAgaWYgKHBvc2l0aW9uSW5kZXhlcy5sZW5ndGggPT09IDMpIHtcbiAgICAgIGNvbnN0IFthLCBiXSA9IHBvc2l0aW9uSW5kZXhlcztcbiAgICAgIGlmIChjb29yZGluYXRlcy5sZW5ndGggJiYgY29vcmRpbmF0ZXNbYV0ubGVuZ3RoKSB7XG4gICAgICAgIHNpemUgPSBjb29yZGluYXRlc1thXVtiXS5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IFtiXSA9IHBvc2l0aW9uSW5kZXhlcztcbiAgICAgIGlmIChjb29yZGluYXRlcy5sZW5ndGggJiYgY29vcmRpbmF0ZXNbYl0ubGVuZ3RoKSB7XG4gICAgICAgIHNpemUgPSBjb29yZGluYXRlc1tiXS5sZW5ndGg7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzaXplO1xuICB9XG5cbiAgZ2V0QmVhcmluZyhwMTogYW55LCBwMjogYW55KSB7XG4gICAgY29uc3QgYW5nbGUgPSBiZWFyaW5nKHAxLCBwMik7XG4gICAgaWYgKGFuZ2xlIDwgMCkge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoMzYwICsgYW5nbGUpO1xuICAgIH1cbiAgICByZXR1cm4gTWF0aC5mbG9vcihhbmdsZSk7XG4gIH1cblxuICBpc09ydGhvZ29uYWwoXG4gICAgcG9zaXRpb25JbmRleGVzOiBudW1iZXJbXSxcbiAgICBmZWF0dXJlSW5kZXg6IG51bWJlcixcbiAgICBzaXplOiBudW1iZXIsXG4gICAgZmVhdHVyZXM6IEZlYXR1cmVDb2xsZWN0aW9uXG4gICkge1xuICAgIGlmIChwb3NpdGlvbkluZGV4ZXNbcG9zaXRpb25JbmRleGVzLmxlbmd0aCAtIDFdID09PSBzaXplIC0gMSkge1xuICAgICAgcG9zaXRpb25JbmRleGVzW3Bvc2l0aW9uSW5kZXhlcy5sZW5ndGggLSAxXSA9IDA7XG4gICAgfVxuICAgIGNvbnN0IHByZXZQb2ludCA9IHRoaXMuZ2V0UG9pbnRGb3JQb3NpdGlvbkluZGV4ZXMoXG4gICAgICB0aGlzLnByZXZQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzLCBzaXplKSxcbiAgICAgIGZlYXR1cmVJbmRleCxcbiAgICAgIGZlYXR1cmVzXG4gICAgKTtcbiAgICBjb25zdCBuZXh0UG9pbnQgPSB0aGlzLmdldFBvaW50Rm9yUG9zaXRpb25JbmRleGVzKFxuICAgICAgdGhpcy5uZXh0UG9zaXRpb25JbmRleGVzKHBvc2l0aW9uSW5kZXhlcywgc2l6ZSksXG4gICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICBmZWF0dXJlc1xuICAgICk7XG4gICAgY29uc3QgY3VycmVudFBvaW50ID0gdGhpcy5nZXRQb2ludEZvclBvc2l0aW9uSW5kZXhlcyhwb3NpdGlvbkluZGV4ZXMsIGZlYXR1cmVJbmRleCwgZmVhdHVyZXMpO1xuICAgIGNvbnN0IHByZXZBbmdsZSA9IHRoaXMuZ2V0QmVhcmluZyhjdXJyZW50UG9pbnQsIHByZXZQb2ludCk7XG4gICAgY29uc3QgbmV4dEFuZ2xlID0gdGhpcy5nZXRCZWFyaW5nKGN1cnJlbnRQb2ludCwgbmV4dFBvaW50KTtcbiAgICByZXR1cm4gWzg5LCA5MCwgOTEsIDI2OSwgMjcwLCAyNzFdLmluY2x1ZGVzKE1hdGguYWJzKHByZXZBbmdsZSAtIG5leHRBbmdsZSkpO1xuICB9XG5cbiAgbmV4dFBvc2l0aW9uSW5kZXhlcyhwb3NpdGlvbkluZGV4ZXM6IG51bWJlcltdLCBzaXplOiBudW1iZXIpOiBudW1iZXJbXSB7XG4gICAgY29uc3QgbmV4dCA9IFsuLi5wb3NpdGlvbkluZGV4ZXNdO1xuICAgIGlmIChuZXh0Lmxlbmd0aCkge1xuICAgICAgbmV4dFtuZXh0Lmxlbmd0aCAtIDFdID0gbmV4dFtuZXh0Lmxlbmd0aCAtIDFdID09PSBzaXplIC0gMSA/IDAgOiBuZXh0W25leHQubGVuZ3RoIC0gMV0gKyAxO1xuICAgIH1cbiAgICByZXR1cm4gbmV4dDtcbiAgfVxuXG4gIHByZXZQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzOiBudW1iZXJbXSwgc2l6ZTogbnVtYmVyKTogbnVtYmVyW10ge1xuICAgIGNvbnN0IHByZXYgPSBbLi4ucG9zaXRpb25JbmRleGVzXTtcbiAgICBpZiAocHJldi5sZW5ndGgpIHtcbiAgICAgIHByZXZbcHJldi5sZW5ndGggLSAxXSA9IHByZXZbcHJldi5sZW5ndGggLSAxXSA9PT0gMCA/IHNpemUgLSAyIDogcHJldltwcmV2Lmxlbmd0aCAtIDFdIC0gMTtcbiAgICB9XG4gICAgcmV0dXJuIHByZXY7XG4gIH1cblxuICBnZXRQb2ludEZvclBvc2l0aW9uSW5kZXhlcyhcbiAgICBwb3NpdGlvbkluZGV4ZXM6IG51bWJlcltdLFxuICAgIGZlYXR1cmVJbmRleDogbnVtYmVyLFxuICAgIHsgZmVhdHVyZXMgfTogRmVhdHVyZUNvbGxlY3Rpb25cbiAgKSB7XG4gICAgbGV0IHAxO1xuICAgIGNvbnN0IGZlYXR1cmUgPSBmZWF0dXJlc1tmZWF0dXJlSW5kZXhdO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzOiBhbnkgPSBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICAgIC8vIGZvciBNdWx0aSBwb2x5Z29ucywgbGVuZ3RoIHdpbGwgYmUgM1xuICAgIGlmIChwb3NpdGlvbkluZGV4ZXMubGVuZ3RoID09PSAzKSB7XG4gICAgICBjb25zdCBbYSwgYiwgY10gPSBwb3NpdGlvbkluZGV4ZXM7XG4gICAgICBpZiAoY29vcmRpbmF0ZXMubGVuZ3RoICYmIGNvb3JkaW5hdGVzW2FdLmxlbmd0aCkge1xuICAgICAgICBwMSA9IGNvb3JkaW5hdGVzW2FdW2JdW2NdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBbYiwgY10gPSBwb3NpdGlvbkluZGV4ZXM7XG4gICAgICBpZiAoY29vcmRpbmF0ZXMubGVuZ3RoICYmIGNvb3JkaW5hdGVzW2JdLmxlbmd0aCkge1xuICAgICAgICBwMSA9IGNvb3JkaW5hdGVzW2JdW2NdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcDE7XG4gIH1cbn1cbiJdfQ==