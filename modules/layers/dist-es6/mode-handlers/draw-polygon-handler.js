"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawPolygonHandler = void 0;

var _modeHandler = require("./mode-handler.js");

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

// TODO edit-modes: delete handlers once EditMode fully implemented
var DrawPolygonHandler =
/*#__PURE__*/
function (_ModeHandler) {
  _inherits(DrawPolygonHandler, _ModeHandler);

  function DrawPolygonHandler() {
    _classCallCheck(this, DrawPolygonHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawPolygonHandler).apply(this, arguments));
  }

  _createClass(DrawPolygonHandler, [{
    key: "getEditHandles",
    value: function getEditHandles(picks, groundCoords) {
      var handles = _get(_getPrototypeOf(DrawPolygonHandler.prototype), "getEditHandles", this).call(this, picks, groundCoords);

      if (this._tentativeFeature) {
        handles = handles.concat((0, _modeHandler.getEditHandlesForGeometry)(this._tentativeFeature.geometry, -1)); // Slice off the handles that are are next to the pointer

        if (this._tentativeFeature && this._tentativeFeature.geometry.type === 'LineString') {
          // Remove the last existing handle
          handles = handles.slice(0, -1);
        } else if (this._tentativeFeature && this._tentativeFeature.geometry.type === 'Polygon') {
          // Remove the last existing handle
          handles = handles.slice(0, -1);
        }
      }

      return handles;
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      _get(_getPrototypeOf(DrawPolygonHandler.prototype), "handleClick", this).call(this, event);

      var picks = event.picks;
      var tentativeFeature = this.getTentativeFeature();
      var editAction = null;
      var clickedEditHandle = (0, _modeHandler.getPickedEditHandle)(picks);

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

          editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd);
        }
      } // Trigger pointer move right away in order for it to update edit handles (to support double-click)


      var fakePointerMoveEvent = {
        screenCoords: [-1, -1],
        groundCoords: event.groundCoords,
        picks: [],
        isDragging: false,
        pointerDownPicks: null,
        pointerDownScreenCoords: null,
        pointerDownGroundCoords: null,
        sourceEvent: null
      };
      this.handlePointerMove(fakePointerMoveEvent);
      return editAction;
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(_ref) {
      var groundCoords = _ref.groundCoords;
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
            coordinates: _toConsumableArray(clickSequence).concat([groundCoords])
          }
        });
      } else {
        // Draw a Polygon connecting all the clicked points with the hovered point
        this._setTentativeFeature({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [_toConsumableArray(clickSequence).concat([groundCoords, clickSequence[0]])]
          }
        });
      }

      return result;
    }
  }]);

  return DrawPolygonHandler;
}(_modeHandler.ModeHandler);

exports.DrawPolygonHandler = DrawPolygonHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctcG9seWdvbi1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIkRyYXdQb2x5Z29uSGFuZGxlciIsInBpY2tzIiwiZ3JvdW5kQ29vcmRzIiwiaGFuZGxlcyIsIl90ZW50YXRpdmVGZWF0dXJlIiwiY29uY2F0IiwiZ2VvbWV0cnkiLCJ0eXBlIiwic2xpY2UiLCJldmVudCIsInRlbnRhdGl2ZUZlYXR1cmUiLCJnZXRUZW50YXRpdmVGZWF0dXJlIiwiZWRpdEFjdGlvbiIsImNsaWNrZWRFZGl0SGFuZGxlIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJzcGxpY2UiLCJsZW5ndGgiLCJwb2x5Z29uIiwiZmVhdHVyZUluZGV4IiwicG9zaXRpb25JbmRleGVzIiwiY29vcmRpbmF0ZXMiLCJwb2x5Z29uVG9BZGQiLCJyZXNldENsaWNrU2VxdWVuY2UiLCJfc2V0VGVudGF0aXZlRmVhdHVyZSIsImdldEFkZEZlYXR1cmVPckJvb2xlYW5Qb2x5Z29uQWN0aW9uIiwiZmFrZVBvaW50ZXJNb3ZlRXZlbnQiLCJzY3JlZW5Db29yZHMiLCJpc0RyYWdnaW5nIiwicG9pbnRlckRvd25QaWNrcyIsInBvaW50ZXJEb3duU2NyZWVuQ29vcmRzIiwicG9pbnRlckRvd25Hcm91bmRDb29yZHMiLCJzb3VyY2VFdmVudCIsImhhbmRsZVBvaW50ZXJNb3ZlIiwicmVzdWx0IiwiY2FuY2VsTWFwUGFuIiwiTW9kZUhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFLQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtJQUNhQSxrQjs7Ozs7Ozs7Ozs7OzttQ0FDSUMsSyxFQUF1QkMsWSxFQUF1QztBQUMzRSxVQUFJQyxPQUFPLDBGQUF3QkYsS0FBeEIsRUFBK0JDLFlBQS9CLENBQVg7O0FBRUEsVUFBSSxLQUFLRSxpQkFBVCxFQUE0QjtBQUMxQkQsUUFBQUEsT0FBTyxHQUFHQSxPQUFPLENBQUNFLE1BQVIs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QUFMLENBQXVCUCxvQkFBdkI7QUFFQSxhQUFPZCxVQUFQO0FBQ0Q7Ozs0Q0FJd0U7QUFBQSxVQUR2RVYsWUFDdUUsUUFEdkVBLFlBQ3VFO0FBQ3ZFLFVBQU1ZLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0QjtBQUNBLFVBQU1tQixNQUFNLEdBQUc7QUFBRXRCLFFBQUFBLFVBQVUsRUFBRSxJQUFkO0FBQW9CdUIsUUFBQUEsWUFBWSxFQUFFO0FBQWxDLE9BQWY7O0FBRUEsVUFBSXJCLGFBQWEsQ0FBQ0csTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUM5QjtBQUNBLGVBQU9pQixNQUFQO0FBQ0Q7O0FBRUQsVUFBSXBCLGFBQWEsQ0FBQ0csTUFBZCxHQUF1QixDQUEzQixFQUE4QjtBQUM1QjtBQUNBLGFBQUtPLG9CQUFMLENBQTBCO0FBQ3hCakIsVUFBQUEsSUFBSSxFQUFFLFNBRGtCO0FBRXhCRCxVQUFBQSxRQUFRLEVBQUU7QUFDUkMsWUFBQUEsSUFBSSxFQUFFLFlBREU7QUFFUmMsWUFBQUEsV0FBVyxxQkFBTVAsYUFBTixVQUFxQlosWUFBckI7QUFGSDtBQUZjLFNBQTFCO0FBT0QsT0FURCxNQVNPO0FBQ0w7QUFDQSxhQUFLc0Isb0JBQUwsQ0FBMEI7QUFDeEJqQixVQUFBQSxJQUFJLEVBQUUsU0FEa0I7QUFFeEJELFVBQUFBLFFBQVEsRUFBRTtBQUNSQyxZQUFBQSxJQUFJLEVBQUUsU0FERTtBQUVSYyxZQUFBQSxXQUFXLEVBQUUsb0JBQUtQLGFBQUwsVUFBb0JaLFlBQXBCLEVBQWtDWSxhQUFhLENBQUMsQ0FBRCxDQUEvQztBQUZMO0FBRmMsU0FBMUI7QUFPRDs7QUFFRCxhQUFPb0IsTUFBUDtBQUNEOzs7O0VBMUdxQ0Usd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSB7IFBvbHlnb24sIFBvc2l0aW9uIH0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcbmltcG9ydCB0eXBlIHsgQ2xpY2tFdmVudCwgUG9pbnRlck1vdmVFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgRWRpdEFjdGlvbiwgRWRpdEhhbmRsZSB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IE1vZGVIYW5kbGVyLCBnZXRQaWNrZWRFZGl0SGFuZGxlLCBnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5IH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgRHJhd1BvbHlnb25IYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBnZXRFZGl0SGFuZGxlcyhwaWNrcz86IEFycmF5PE9iamVjdD4sIGdyb3VuZENvb3Jkcz86IFBvc2l0aW9uKTogRWRpdEhhbmRsZVtdIHtcbiAgICBsZXQgaGFuZGxlcyA9IHN1cGVyLmdldEVkaXRIYW5kbGVzKHBpY2tzLCBncm91bmRDb29yZHMpO1xuXG4gICAgaWYgKHRoaXMuX3RlbnRhdGl2ZUZlYXR1cmUpIHtcbiAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLmNvbmNhdChnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5KHRoaXMuX3RlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnksIC0xKSk7XG4gICAgICAvLyBTbGljZSBvZmYgdGhlIGhhbmRsZXMgdGhhdCBhcmUgYXJlIG5leHQgdG8gdGhlIHBvaW50ZXJcbiAgICAgIGlmICh0aGlzLl90ZW50YXRpdmVGZWF0dXJlICYmIHRoaXMuX3RlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmVTdHJpbmcnKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbGFzdCBleGlzdGluZyBoYW5kbGVcbiAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuc2xpY2UoMCwgLTEpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl90ZW50YXRpdmVGZWF0dXJlICYmIHRoaXMuX3RlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbGFzdCBleGlzdGluZyBoYW5kbGVcbiAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuc2xpY2UoMCwgLTEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBoYW5kbGVzO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgc3VwZXIuaGFuZGxlQ2xpY2soZXZlbnQpO1xuXG4gICAgY29uc3QgeyBwaWNrcyB9ID0gZXZlbnQ7XG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuXG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcbiAgICBjb25zdCBjbGlja2VkRWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUocGlja3MpO1xuXG4gICAgaWYgKGNsaWNrZWRFZGl0SGFuZGxlKSB7XG4gICAgICAvLyBVc2VyIGNsaWNrZWQgYW4gZWRpdCBoYW5kbGUuXG4gICAgICAvLyBSZW1vdmUgaXQgZnJvbSB0aGUgY2xpY2sgc2VxdWVuY2UsIHNvIGl0IGlzbid0IGFkZGVkIGFzIGEgbmV3IHBvaW50LlxuICAgICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgICAgY2xpY2tTZXF1ZW5jZS5zcGxpY2UoY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGVudGF0aXZlRmVhdHVyZSAmJiB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgY29uc3QgcG9seWdvbjogUG9seWdvbiA9IHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUgJiZcbiAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUuZmVhdHVyZUluZGV4ID09PSAtMSAmJlxuICAgICAgICAoY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzWzFdID09PSAwIHx8XG4gICAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzWzFdID09PSBwb2x5Z29uLmNvb3JkaW5hdGVzWzBdLmxlbmd0aCAtIDMpXG4gICAgICApIHtcbiAgICAgICAgLy8gVGhleSBjbGlja2VkIHRoZSBmaXJzdCBvciBsYXN0IHBvaW50IChvciBkb3VibGUtY2xpY2tlZCksIHNvIGNvbXBsZXRlIHRoZSBwb2x5Z29uXG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBob3ZlcmVkIHBvc2l0aW9uXG4gICAgICAgIGNvbnN0IHBvbHlnb25Ub0FkZDogUG9seWdvbiA9IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtbLi4ucG9seWdvbi5jb29yZGluYXRlc1swXS5zbGljZSgwLCAtMiksIHBvbHlnb24uY29vcmRpbmF0ZXNbMF1bMF1dXVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucmVzZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUobnVsbCk7XG4gICAgICAgIGVkaXRBY3Rpb24gPSB0aGlzLmdldEFkZEZlYXR1cmVPckJvb2xlYW5Qb2x5Z29uQWN0aW9uKHBvbHlnb25Ub0FkZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVHJpZ2dlciBwb2ludGVyIG1vdmUgcmlnaHQgYXdheSBpbiBvcmRlciBmb3IgaXQgdG8gdXBkYXRlIGVkaXQgaGFuZGxlcyAodG8gc3VwcG9ydCBkb3VibGUtY2xpY2spXG4gICAgY29uc3QgZmFrZVBvaW50ZXJNb3ZlRXZlbnQgPSB7XG4gICAgICBzY3JlZW5Db29yZHM6IFstMSwgLTFdLFxuICAgICAgZ3JvdW5kQ29vcmRzOiBldmVudC5ncm91bmRDb29yZHMsXG4gICAgICBwaWNrczogW10sXG4gICAgICBpc0RyYWdnaW5nOiBmYWxzZSxcbiAgICAgIHBvaW50ZXJEb3duUGlja3M6IG51bGwsXG4gICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkczogbnVsbCxcbiAgICAgIHBvaW50ZXJEb3duR3JvdW5kQ29vcmRzOiBudWxsLFxuICAgICAgc291cmNlRXZlbnQ6IG51bGxcbiAgICB9O1xuICAgIHRoaXMuaGFuZGxlUG9pbnRlck1vdmUoZmFrZVBvaW50ZXJNb3ZlRXZlbnQpO1xuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZSh7XG4gICAgZ3JvdW5kQ29vcmRzXG4gIH06IFBvaW50ZXJNb3ZlRXZlbnQpOiB7IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBub3RoaW5nIHRvIGRvIHlldFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPCAzKSB7XG4gICAgICAvLyBEcmF3IGEgTGluZVN0cmluZyBjb25uZWN0aW5nIGFsbCB0aGUgY2xpY2tlZCBwb2ludHMgd2l0aCB0aGUgaG92ZXJlZCBwb2ludFxuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFsuLi5jbGlja1NlcXVlbmNlLCBncm91bmRDb29yZHNdXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEcmF3IGEgUG9seWdvbiBjb25uZWN0aW5nIGFsbCB0aGUgY2xpY2tlZCBwb2ludHMgd2l0aCB0aGUgaG92ZXJlZCBwb2ludFxuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtbLi4uY2xpY2tTZXF1ZW5jZSwgZ3JvdW5kQ29vcmRzLCBjbGlja1NlcXVlbmNlWzBdXV1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19