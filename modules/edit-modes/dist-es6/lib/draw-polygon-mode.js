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
    value: function getEditHandlesAdapter(picks, mapCoords) {
      var handles = _get(_getPrototypeOf(DrawPolygonMode.prototype), "getEditHandlesAdapter", this).call(this, picks, mapCoords);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1wb2x5Z29uLW1vZGUuanMiXSwibmFtZXMiOlsiRHJhd1BvbHlnb25Nb2RlIiwicGlja3MiLCJtYXBDb29yZHMiLCJoYW5kbGVzIiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJjb25jYXQiLCJnZW9tZXRyeSIsInR5cGUiLCJzbGljZSIsImV2ZW50IiwicHJvcHMiLCJlZGl0QWN0aW9uIiwiY2xpY2tlZEVkaXRIYW5kbGUiLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsInNwbGljZSIsImxlbmd0aCIsInBvbHlnb24iLCJmZWF0dXJlSW5kZXgiLCJwb3NpdGlvbkluZGV4ZXMiLCJjb29yZGluYXRlcyIsInBvbHlnb25Ub0FkZCIsInJlc2V0Q2xpY2tTZXF1ZW5jZSIsIl9zZXRUZW50YXRpdmVGZWF0dXJlIiwiZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24iLCJmYWtlUG9pbnRlck1vdmVFdmVudCIsInNjcmVlbkNvb3JkcyIsImlzRHJhZ2dpbmciLCJwb2ludGVyRG93blBpY2tzIiwicG9pbnRlckRvd25TY3JlZW5Db29yZHMiLCJwb2ludGVyRG93bk1hcENvb3JkcyIsInNvdXJjZUV2ZW50IiwiaGFuZGxlUG9pbnRlck1vdmVBZGFwdGVyIiwicmVzdWx0IiwiY2FuY2VsTWFwUGFuIiwiQmFzZUdlb0pzb25FZGl0TW9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUtBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQU1hQSxlOzs7Ozs7Ozs7Ozs7OzBDQUNXQyxLLEVBQXVCQyxTLEVBQW9DO0FBQy9FLFVBQUlDLE9BQU8sOEZBQStCRixLQUEvQixFQUFzQ0MsU0FBdEMsQ0FBWDs7QUFFQSxVQUFNRSxnQkFBZ0IsR0FBRyxLQUFLQyxtQkFBTCxFQUF6Qjs7QUFDQSxVQUFJRCxnQkFBSixFQUFzQjtBQUNwQkQsUUFBQUEsT0FBTyxHQUFHQSxPQUFP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QVJjLE9BQTdCO0FBV0EsV0FBS0Msd0JBQUwsQ0FBOEJQLG9CQUE5QixFQUFvRGYsS0FBcEQ7QUFFQSxhQUFPQyxVQUFQO0FBQ0Q7OzttREFJQ0QsSyxFQUMyRDtBQUFBLFVBRnpEVCxTQUV5RCxRQUZ6REEsU0FFeUQ7QUFDM0QsVUFBTVksYUFBYSxHQUFHLEtBQUtDLGdCQUFMLEVBQXRCO0FBQ0EsVUFBTW1CLE1BQU0sR0FBRztBQUFFdEIsUUFBQUEsVUFBVSxFQUFFLElBQWQ7QUFBb0J1QixRQUFBQSxZQUFZLEVBQUU7QUFBbEMsT0FBZjs7QUFFQSxVQUFJckIsYUFBYSxDQUFDRyxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQzlCO0FBQ0EsZUFBT2lCLE1BQVA7QUFDRDs7QUFFRCxVQUFJcEIsYUFBYSxDQUFDRyxNQUFkLEdBQXVCLENBQTNCLEVBQThCO0FBQzVCO0FBQ0EsYUFBS08sb0JBQUwsQ0FBMEI7QUFDeEJoQixVQUFBQSxJQUFJLEVBQUUsU0FEa0I7QUFFeEJELFVBQUFBLFFBQVEsRUFBRTtBQUNSQyxZQUFBQSxJQUFJLEVBQUUsWUFERTtBQUVSYSxZQUFBQSxXQUFXLHFCQUFNUCxhQUFOLFVBQXFCWixTQUFyQjtBQUZIO0FBRmMsU0FBMUI7QUFPRCxPQVRELE1BU087QUFDTDtBQUNBLGFBQUtzQixvQkFBTCxDQUEwQjtBQUN4QmhCLFVBQUFBLElBQUksRUFBRSxTQURrQjtBQUV4QkQsVUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFlBQUFBLElBQUksRUFBRSxTQURFO0FBRVJhLFlBQUFBLFdBQVcsRUFBRSxvQkFBS1AsYUFBTCxVQUFvQlosU0FBcEIsRUFBK0JZLGFBQWEsQ0FBQyxDQUFELENBQTVDO0FBRkw7QUFGYyxTQUExQjtBQU9EOztBQUVELGFBQU9vQixNQUFQO0FBQ0Q7Ozt1Q0FFa0I7QUFDakIsYUFBTyxNQUFQO0FBQ0Q7Ozs7RUFqSGtDRSxvQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB0eXBlIHsgQ2xpY2tFdmVudCwgUG9pbnRlck1vdmVFdmVudCwgTW9kZVByb3BzIH0gZnJvbSAnLi4vdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBQb2x5Z29uLCBQb3NpdGlvbiwgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgR2VvSnNvbkVkaXRBY3Rpb24sIEVkaXRIYW5kbGUgfSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlLmpzJztcbmltcG9ydCB7XG4gIEJhc2VHZW9Kc29uRWRpdE1vZGUsXG4gIGdldFBpY2tlZEVkaXRIYW5kbGUsXG4gIGdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnlcbn0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZS5qcyc7XG5cbmV4cG9ydCBjbGFzcyBEcmF3UG9seWdvbk1vZGUgZXh0ZW5kcyBCYXNlR2VvSnNvbkVkaXRNb2RlIHtcbiAgZ2V0RWRpdEhhbmRsZXNBZGFwdGVyKHBpY2tzPzogQXJyYXk8T2JqZWN0PiwgbWFwQ29vcmRzPzogUG9zaXRpb24pOiBFZGl0SGFuZGxlW10ge1xuICAgIGxldCBoYW5kbGVzID0gc3VwZXIuZ2V0RWRpdEhhbmRsZXNBZGFwdGVyKHBpY2tzLCBtYXBDb29yZHMpO1xuXG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuICAgIGlmICh0ZW50YXRpdmVGZWF0dXJlKSB7XG4gICAgICBoYW5kbGVzID0gaGFuZGxlcy5jb25jYXQoZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeSh0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LCAtMSkpO1xuICAgICAgLy8gU2xpY2Ugb2ZmIHRoZSBoYW5kbGVzIHRoYXQgYXJlIGFyZSBuZXh0IHRvIHRoZSBwb2ludGVyXG4gICAgICBpZiAodGVudGF0aXZlRmVhdHVyZSAmJiB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGxhc3QgZXhpc3RpbmcgaGFuZGxlXG4gICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLnNsaWNlKDAsIC0xKTtcbiAgICAgIH0gZWxzZSBpZiAodGVudGF0aXZlRmVhdHVyZSAmJiB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGxhc3QgZXhpc3RpbmcgaGFuZGxlXG4gICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaGFuZGxlcztcbiAgfVxuXG4gIGhhbmRsZUNsaWNrQWRhcHRlcihldmVudDogQ2xpY2tFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiA/R2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIHN1cGVyLmhhbmRsZUNsaWNrQWRhcHRlcihldmVudCwgcHJvcHMpO1xuXG4gICAgY29uc3QgeyBwaWNrcyB9ID0gZXZlbnQ7XG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuXG4gICAgbGV0IGVkaXRBY3Rpb246ID9HZW9Kc29uRWRpdEFjdGlvbiA9IG51bGw7XG4gICAgY29uc3QgY2xpY2tlZEVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKHBpY2tzKTtcblxuICAgIGlmIChjbGlja2VkRWRpdEhhbmRsZSkge1xuICAgICAgLy8gVXNlciBjbGlja2VkIGFuIGVkaXQgaGFuZGxlLlxuICAgICAgLy8gUmVtb3ZlIGl0IGZyb20gdGhlIGNsaWNrIHNlcXVlbmNlLCBzbyBpdCBpc24ndCBhZGRlZCBhcyBhIG5ldyBwb2ludC5cbiAgICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcbiAgICAgIGNsaWNrU2VxdWVuY2Uuc3BsaWNlKGNsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMSwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRlbnRhdGl2ZUZlYXR1cmUgJiYgdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgIGNvbnN0IHBvbHlnb246IFBvbHlnb24gPSB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5O1xuXG4gICAgICBpZiAoXG4gICAgICAgIGNsaWNrZWRFZGl0SGFuZGxlICYmXG4gICAgICAgIGNsaWNrZWRFZGl0SGFuZGxlLmZlYXR1cmVJbmRleCA9PT0gLTEgJiZcbiAgICAgICAgKGNsaWNrZWRFZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlc1sxXSA9PT0gMCB8fFxuICAgICAgICAgIGNsaWNrZWRFZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlc1sxXSA9PT0gcG9seWdvbi5jb29yZGluYXRlc1swXS5sZW5ndGggLSAzKVxuICAgICAgKSB7XG4gICAgICAgIC8vIFRoZXkgY2xpY2tlZCB0aGUgZmlyc3Qgb3IgbGFzdCBwb2ludCAob3IgZG91YmxlLWNsaWNrZWQpLCBzbyBjb21wbGV0ZSB0aGUgcG9seWdvblxuXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgaG92ZXJlZCBwb3NpdGlvblxuICAgICAgICBjb25zdCBwb2x5Z29uVG9BZGQ6IFBvbHlnb24gPSB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbWy4uLnBvbHlnb24uY29vcmRpbmF0ZXNbMF0uc2xpY2UoMCwgLTIpLCBwb2x5Z29uLmNvb3JkaW5hdGVzWzBdWzBdXV1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJlc2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuICAgICAgICBlZGl0QWN0aW9uID0gdGhpcy5nZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbihwb2x5Z29uVG9BZGQsIHByb3BzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUcmlnZ2VyIHBvaW50ZXIgbW92ZSByaWdodCBhd2F5IGluIG9yZGVyIGZvciBpdCB0byB1cGRhdGUgZWRpdCBoYW5kbGVzICh0byBzdXBwb3J0IGRvdWJsZS1jbGljaylcbiAgICBjb25zdCBmYWtlUG9pbnRlck1vdmVFdmVudCA9IHtcbiAgICAgIHNjcmVlbkNvb3JkczogWy0xLCAtMV0sXG4gICAgICBtYXBDb29yZHM6IGV2ZW50Lm1hcENvb3JkcyxcbiAgICAgIHBpY2tzOiBbXSxcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgcG9pbnRlckRvd25QaWNrczogbnVsbCxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHM6IG51bGwsXG4gICAgICBzb3VyY2VFdmVudDogbnVsbFxuICAgIH07XG5cbiAgICB0aGlzLmhhbmRsZVBvaW50ZXJNb3ZlQWRhcHRlcihmYWtlUG9pbnRlck1vdmVFdmVudCwgcHJvcHMpO1xuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZUFkYXB0ZXIoXG4gICAgeyBtYXBDb29yZHMgfTogUG9pbnRlck1vdmVFdmVudCxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiB7IGVkaXRBY3Rpb246ID9HZW9Kc29uRWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcbiAgICBjb25zdCByZXN1bHQgPSB7IGVkaXRBY3Rpb246IG51bGwsIGNhbmNlbE1hcFBhbjogZmFsc2UgfTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbm90aGluZyB0byBkbyB5ZXRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoIDwgMykge1xuICAgICAgLy8gRHJhdyBhIExpbmVTdHJpbmcgY29ubmVjdGluZyBhbGwgdGhlIGNsaWNrZWQgcG9pbnRzIHdpdGggdGhlIGhvdmVyZWQgcG9pbnRcbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbLi4uY2xpY2tTZXF1ZW5jZSwgbWFwQ29vcmRzXVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRHJhdyBhIFBvbHlnb24gY29ubmVjdGluZyBhbGwgdGhlIGNsaWNrZWQgcG9pbnRzIHdpdGggdGhlIGhvdmVyZWQgcG9pbnRcbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbWy4uLmNsaWNrU2VxdWVuY2UsIG1hcENvb3JkcywgY2xpY2tTZXF1ZW5jZVswXV1dXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBnZXRDdXJzb3JBZGFwdGVyKCkge1xuICAgIHJldHVybiAnY2VsbCc7XG4gIH1cbn1cbiJdfQ==