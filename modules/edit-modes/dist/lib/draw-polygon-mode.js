"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawPolygonMode = void 0;

var _geojsonEditMode = require("./geojson-edit-mode.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DrawPolygonMode =
/*#__PURE__*/
function (_BaseGeoJsonEditMode) {
  _inherits(DrawPolygonMode, _BaseGeoJsonEditMode);

  function DrawPolygonMode() {
    _classCallCheck(this, DrawPolygonMode);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawPolygonMode).apply(this, arguments));
  }

  _createClass(DrawPolygonMode, [{
    key: "getEditHandlesAdapter",
    value: function getEditHandlesAdapter(picks, mapCoords, props) {
      var handles = _get(_getPrototypeOf(DrawPolygonMode.prototype), "getEditHandlesAdapter", this).call(this, picks, mapCoords, props);

      var tentativeFeature = this.getTentativeFeature();

      if (tentativeFeature) {
        handles = handles.concat((0, _geojsonEditMode.getEditHandlesForGeometry)(tentativeFeature.geometry, -1)); // Slice off the handles that are are next to the pointer

        if (tentativeFeature && tentativeFeature.geometry.type === 'LineString') {
          // Remove the last existing handle
          handles = handles.slice(0, -1);
        } else if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
          // Remove the last existing handle
          handles = handles.slice(0, -1);
        }
      }

      return handles;
    }
  }, {
    key: "handleClickAdapter",
    value: function handleClickAdapter(event, props) {
      _get(_getPrototypeOf(DrawPolygonMode.prototype), "handleClickAdapter", this).call(this, event, props);

      var picks = event.picks;
      var tentativeFeature = this.getTentativeFeature();
      var editAction = null;
      var clickedEditHandle = (0, _geojsonEditMode.getPickedEditHandle)(picks);

      if (clickedEditHandle) {
        // User clicked an edit handle.
        // Remove it from the click sequence, so it isn't added as a new point.
        var clickSequence = this.getClickSequence();
        clickSequence.splice(clickSequence.length - 1, 1);
      }

      if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        var polygon = tentativeFeature.geometry;

        if (clickedEditHandle && clickedEditHandle.featureIndex === -1 && (clickedEditHandle.positionIndexes[1] === 0 || clickedEditHandle.positionIndexes[1] === polygon.coordinates[0].length - 3)) {
          // They clicked the first or last point (or double-clicked), so complete the polygon
          // Remove the hovered position
          var polygonToAdd = {
            type: 'Polygon',
            coordinates: [_toConsumableArray(polygon.coordinates[0].slice(0, -2)).concat([polygon.coordinates[0][0]])]
          };
          this.resetClickSequence();

          this._setTentativeFeature(null);

          editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd, props);
        }
      } // Trigger pointer move right away in order for it to update edit handles (to support double-click)


      var fakePointerMoveEvent = {
        screenCoords: [-1, -1],
        mapCoords: event.mapCoords,
        picks: [],
        isDragging: false,
        pointerDownPicks: null,
        pointerDownScreenCoords: null,
        pointerDownMapCoords: null,
        sourceEvent: null
      };
      this.handlePointerMoveAdapter(fakePointerMoveEvent, props);
      return editAction;
    }
  }, {
    key: "handlePointerMoveAdapter",
    value: function handlePointerMoveAdapter(_ref, props) {
      var mapCoords = _ref.mapCoords;
      var clickSequence = this.getClickSequence();
      var result = {
        editAction: null,
        cancelMapPan: false
      };

      if (clickSequence.length === 0) {
        // nothing to do yet
        return result;
      }

      if (clickSequence.length < 3) {
        // Draw a LineString connecting all the clicked points with the hovered point
        this._setTentativeFeature({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: _toConsumableArray(clickSequence).concat([mapCoords])
          }
        });
      } else {
        // Draw a Polygon connecting all the clicked points with the hovered point
        this._setTentativeFeature({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [_toConsumableArray(clickSequence).concat([mapCoords, clickSequence[0]])]
          }
        });
      }

      return result;
    }
  }, {
    key: "getCursorAdapter",
    value: function getCursorAdapter() {
      return 'cell';
    }
  }]);

  return DrawPolygonMode;
}(_geojsonEditMode.BaseGeoJsonEditMode);

exports.DrawPolygonMode = DrawPolygonMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1wb2x5Z29uLW1vZGUuanMiXSwibmFtZXMiOlsiRHJhd1BvbHlnb25Nb2RlIiwicGlja3MiLCJtYXBDb29yZHMiLCJwcm9wcyIsImhhbmRsZXMiLCJ0ZW50YXRpdmVGZWF0dXJlIiwiZ2V0VGVudGF0aXZlRmVhdHVyZSIsImNvbmNhdCIsImdlb21ldHJ5IiwidHlwZSIsInNsaWNlIiwiZXZlbnQiLCJlZGl0QWN0aW9uIiwiY2xpY2tlZEVkaXRIYW5kbGUiLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsInNwbGljZSIsImxlbmd0aCIsInBvbHlnb24iLCJmZWF0dXJlSW5kZXgiLCJwb3NpdGlvbkluZGV4ZXMiLCJjb29yZGluYXRlcyIsInBvbHlnb25Ub0FkZCIsInJlc2V0Q2xpY2tTZXF1ZW5jZSIsIl9zZXRUZW50YXRpdmVGZWF0dXJlIiwiZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24iLCJmYWtlUG9pbnRlck1vdmVFdmVudCIsInNjcmVlbkNvb3JkcyIsImlzRHJhZ2dpbmciLCJwb2ludGVyRG93blBpY2tzIiwicG9pbnRlckRvd25TY3JlZW5Db29yZHMiLCJwb2ludGVyRG93bk1hcENvb3JkcyIsInNvdXJjZUV2ZW50IiwiaGFuZGxlUG9pbnRlck1vdmVBZGFwdGVyIiwicmVzdWx0IiwiY2FuY2VsTWFwUGFuIiwiQmFzZUdlb0pzb25FZGl0TW9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUtBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQU1hQSxlOzs7Ozs7Ozs7Ozs7OzBDQUVUQyxLLEVBQ0FDLFMsRUFDQUMsSyxFQUNjO0FBQ2QsVUFBSUMsT0FBTyw4RkFBK0JILEtBQS9CLEVBQXNDQyxTQUF0QyxFQUFpREMsS0FBakQsQ0FBWDs7QUFFQSxVQUFNRSxnQkFBZ0IsR0FBRyxLQUFLQyxtQkFBTCxFQUF6Qjs7QUFDQSxVQUFJRCxnQkFBSixFQUFzQjtBQUNwQkQsUUFB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IFBvaW50ZXJNb3ZlRXZlbnQsIE1vZGVQcm9wcyB9IGZyb20gJy4uL3R5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgUG9seWdvbiwgUG9zaXRpb24sIEZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEdlb0pzb25FZGl0QWN0aW9uLCBFZGl0SGFuZGxlIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZS5qcyc7XG5pbXBvcnQge1xuICBCYXNlR2VvSnNvbkVkaXRNb2RlLFxuICBnZXRQaWNrZWRFZGl0SGFuZGxlLFxuICBnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5XG59IGZyb20gJy4vZ2VvanNvbi1lZGl0LW1vZGUuanMnO1xuXG5leHBvcnQgY2xhc3MgRHJhd1BvbHlnb25Nb2RlIGV4dGVuZHMgQmFzZUdlb0pzb25FZGl0TW9kZSB7XG4gIGdldEVkaXRIYW5kbGVzQWRhcHRlcihcbiAgICBwaWNrczogP0FycmF5PE9iamVjdD4sXG4gICAgbWFwQ29vcmRzOiA/UG9zaXRpb24sXG4gICAgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj5cbiAgKTogRWRpdEhhbmRsZVtdIHtcbiAgICBsZXQgaGFuZGxlcyA9IHN1cGVyLmdldEVkaXRIYW5kbGVzQWRhcHRlcihwaWNrcywgbWFwQ29vcmRzLCBwcm9wcyk7XG5cbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgaWYgKHRlbnRhdGl2ZUZlYXR1cmUpIHtcbiAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLmNvbmNhdChnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5KHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnksIC0xKSk7XG4gICAgICAvLyBTbGljZSBvZmYgdGhlIGhhbmRsZXMgdGhhdCBhcmUgYXJlIG5leHQgdG8gdGhlIHBvaW50ZXJcbiAgICAgIGlmICh0ZW50YXRpdmVGZWF0dXJlICYmIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmVTdHJpbmcnKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbGFzdCBleGlzdGluZyBoYW5kbGVcbiAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuc2xpY2UoMCwgLTEpO1xuICAgICAgfSBlbHNlIGlmICh0ZW50YXRpdmVGZWF0dXJlICYmIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbGFzdCBleGlzdGluZyBoYW5kbGVcbiAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuc2xpY2UoMCwgLTEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBoYW5kbGVzO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2tBZGFwdGVyKGV2ZW50OiBDbGlja0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6ID9HZW9Kc29uRWRpdEFjdGlvbiB7XG4gICAgc3VwZXIuaGFuZGxlQ2xpY2tBZGFwdGVyKGV2ZW50LCBwcm9wcyk7XG5cbiAgICBjb25zdCB7IHBpY2tzIH0gPSBldmVudDtcbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVGZWF0dXJlKCk7XG5cbiAgICBsZXQgZWRpdEFjdGlvbjogP0dlb0pzb25FZGl0QWN0aW9uID0gbnVsbDtcbiAgICBjb25zdCBjbGlja2VkRWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUocGlja3MpO1xuXG4gICAgaWYgKGNsaWNrZWRFZGl0SGFuZGxlKSB7XG4gICAgICAvLyBVc2VyIGNsaWNrZWQgYW4gZWRpdCBoYW5kbGUuXG4gICAgICAvLyBSZW1vdmUgaXQgZnJvbSB0aGUgY2xpY2sgc2VxdWVuY2UsIHNvIGl0IGlzbid0IGFkZGVkIGFzIGEgbmV3IHBvaW50LlxuICAgICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgICAgY2xpY2tTZXF1ZW5jZS5zcGxpY2UoY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGVudGF0aXZlRmVhdHVyZSAmJiB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgY29uc3QgcG9seWdvbjogUG9seWdvbiA9IHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUgJiZcbiAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUuZmVhdHVyZUluZGV4ID09PSAtMSAmJlxuICAgICAgICAoY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzWzFdID09PSAwIHx8XG4gICAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzWzFdID09PSBwb2x5Z29uLmNvb3JkaW5hdGVzWzBdLmxlbmd0aCAtIDMpXG4gICAgICApIHtcbiAgICAgICAgLy8gVGhleSBjbGlja2VkIHRoZSBmaXJzdCBvciBsYXN0IHBvaW50IChvciBkb3VibGUtY2xpY2tlZCksIHNvIGNvbXBsZXRlIHRoZSBwb2x5Z29uXG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBob3ZlcmVkIHBvc2l0aW9uXG4gICAgICAgIGNvbnN0IHBvbHlnb25Ub0FkZDogUG9seWdvbiA9IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtbLi4ucG9seWdvbi5jb29yZGluYXRlc1swXS5zbGljZSgwLCAtMiksIHBvbHlnb24uY29vcmRpbmF0ZXNbMF1bMF1dXVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucmVzZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUobnVsbCk7XG4gICAgICAgIGVkaXRBY3Rpb24gPSB0aGlzLmdldEFkZEZlYXR1cmVPckJvb2xlYW5Qb2x5Z29uQWN0aW9uKHBvbHlnb25Ub0FkZCwgcHJvcHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRyaWdnZXIgcG9pbnRlciBtb3ZlIHJpZ2h0IGF3YXkgaW4gb3JkZXIgZm9yIGl0IHRvIHVwZGF0ZSBlZGl0IGhhbmRsZXMgKHRvIHN1cHBvcnQgZG91YmxlLWNsaWNrKVxuICAgIGNvbnN0IGZha2VQb2ludGVyTW92ZUV2ZW50ID0ge1xuICAgICAgc2NyZWVuQ29vcmRzOiBbLTEsIC0xXSxcbiAgICAgIG1hcENvb3JkczogZXZlbnQubWFwQ29vcmRzLFxuICAgICAgcGlja3M6IFtdLFxuICAgICAgaXNEcmFnZ2luZzogZmFsc2UsXG4gICAgICBwb2ludGVyRG93blBpY2tzOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IG51bGwsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3JkczogbnVsbCxcbiAgICAgIHNvdXJjZUV2ZW50OiBudWxsXG4gICAgfTtcblxuICAgIHRoaXMuaGFuZGxlUG9pbnRlck1vdmVBZGFwdGVyKGZha2VQb2ludGVyTW92ZUV2ZW50LCBwcm9wcyk7XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlQWRhcHRlcihcbiAgICB7IG1hcENvb3JkcyB9OiBQb2ludGVyTW92ZUV2ZW50LFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICk6IHsgZWRpdEFjdGlvbjogP0dlb0pzb25FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBub3RoaW5nIHRvIGRvIHlldFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPCAzKSB7XG4gICAgICAvLyBEcmF3IGEgTGluZVN0cmluZyBjb25uZWN0aW5nIGFsbCB0aGUgY2xpY2tlZCBwb2ludHMgd2l0aCB0aGUgaG92ZXJlZCBwb2ludFxuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFsuLi5jbGlja1NlcXVlbmNlLCBtYXBDb29yZHNdXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEcmF3IGEgUG9seWdvbiBjb25uZWN0aW5nIGFsbCB0aGUgY2xpY2tlZCBwb2ludHMgd2l0aCB0aGUgaG92ZXJlZCBwb2ludFxuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtbLi4uY2xpY2tTZXF1ZW5jZSwgbWFwQ29vcmRzLCBjbGlja1NlcXVlbmNlWzBdXV1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdldEN1cnNvckFkYXB0ZXIoKSB7XG4gICAgcmV0dXJuICdjZWxsJztcbiAgfVxufVxuIl19