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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctcG9seWdvbi1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbIkRyYXdQb2x5Z29uSGFuZGxlciIsInBpY2tzIiwiZ3JvdW5kQ29vcmRzIiwiaGFuZGxlcyIsIl90ZW50YXRpdmVGZWF0dXJlIiwiY29uY2F0IiwiZ2VvbWV0cnkiLCJ0eXBlIiwic2xpY2UiLCJldmVudCIsInRlbnRhdGl2ZUZlYXR1cmUiLCJnZXRUZW50YXRpdmVGZWF0dXJlIiwiZWRpdEFjdGlvbiIsImNsaWNrZWRFZGl0SGFuZGxlIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJzcGxpY2UiLCJsZW5ndGgiLCJwb2x5Z29uIiwiZmVhdHVyZUluZGV4IiwicG9zaXRpb25JbmRleGVzIiwiY29vcmRpbmF0ZXMiLCJwb2x5Z29uVG9BZGQiLCJyZXNldENsaWNrU2VxdWVuY2UiLCJfc2V0VGVudGF0aXZlRmVhdHVyZSIsImdldEFkZEZlYXR1cmVPckJvb2xlYW5Qb2x5Z29uQWN0aW9uIiwiZmFrZVBvaW50ZXJNb3ZlRXZlbnQiLCJzY3JlZW5Db29yZHMiLCJpc0RyYWdnaW5nIiwicG9pbnRlckRvd25QaWNrcyIsInBvaW50ZXJEb3duU2NyZWVuQ29vcmRzIiwicG9pbnRlckRvd25Hcm91bmRDb29yZHMiLCJzb3VyY2VFdmVudCIsImhhbmRsZVBvaW50ZXJNb3ZlIiwicmVzdWx0IiwiY2FuY2VsTWFwUGFuIiwiTW9kZUhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFLQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsa0I7Ozs7Ozs7Ozs7Ozs7bUNBQ0lDLEssRUFBdUJDLFksRUFBdUM7QUFDM0UsVUFBSUMsT0FBTywwRkFBd0JGLEtBQXhCLEVBQStCQyxZQUEvQixDQUFYOztBQUVBLFVBQUksS0FBS0UsaUJBQVQsRUFBNEI7QUFDMUJELFFBQUFBLE9BQU8sR0FBR0EsT0FBTyxDQUFDRSxNQUFSLENBQWUs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QUF1QlAsb0JBQXZCO0FBRUEsYUFBT2QsVUFBUDtBQUNEOzs7NENBSXdFO0FBQUEsVUFEdkVWLFlBQ3VFLFFBRHZFQSxZQUN1RTtBQUN2RSxVQUFNWSxhQUFhLEdBQUcsS0FBS0MsZ0JBQUwsRUFBdEI7QUFDQSxVQUFNbUIsTUFBTSxHQUFHO0FBQUV0QixRQUFBQSxVQUFVLEVBQUUsSUFBZDtBQUFvQnVCLFFBQUFBLFlBQVksRUFBRTtBQUFsQyxPQUFmOztBQUVBLFVBQUlyQixhQUFhLENBQUNHLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUI7QUFDQSxlQUFPaUIsTUFBUDtBQUNEOztBQUVELFVBQUlwQixhQUFhLENBQUNHLE1BQWQsR0FBdUIsQ0FBM0IsRUFBOEI7QUFDNUI7QUFDQSxhQUFLTyxvQkFBTCxDQUEwQjtBQUN4QmpCLFVBQUFBLElBQUksRUFBRSxTQURrQjtBQUV4QkQsVUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFlBQUFBLElBQUksRUFBRSxZQURFO0FBRVJjLFlBQUFBLFdBQVcscUJBQU1QLGFBQU4sVUFBcUJaLFlBQXJCO0FBRkg7QUFGYyxTQUExQjtBQU9ELE9BVEQsTUFTTztBQUNMO0FBQ0EsYUFBS3NCLG9CQUFMLENBQTBCO0FBQ3hCakIsVUFBQUEsSUFBSSxFQUFFLFNBRGtCO0FBRXhCRCxVQUFBQSxRQUFRLEVBQUU7QUFDUkMsWUFBQUEsSUFBSSxFQUFFLFNBREU7QUFFUmMsWUFBQUEsV0FBVyxFQUFFLG9CQUFLUCxhQUFMLFVBQW9CWixZQUFwQixFQUFrQ1ksYUFBYSxDQUFDLENBQUQsQ0FBL0M7QUFGTDtBQUZjLFNBQTFCO0FBT0Q7O0FBRUQsYUFBT29CLE1BQVA7QUFDRDs7OztFQTFHcUNFLHdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUgeyBQb2x5Z29uLCBQb3NpdGlvbiB9IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgdHlwZSB7IENsaWNrRXZlbnQsIFBvaW50ZXJNb3ZlRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRBY3Rpb24sIEVkaXRIYW5kbGUgfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBNb2RlSGFuZGxlciwgZ2V0UGlja2VkRWRpdEhhbmRsZSwgZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeSB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcblxuZXhwb3J0IGNsYXNzIERyYXdQb2x5Z29uSGFuZGxlciBleHRlbmRzIE1vZGVIYW5kbGVyIHtcbiAgZ2V0RWRpdEhhbmRsZXMocGlja3M/OiBBcnJheTxPYmplY3Q+LCBncm91bmRDb29yZHM/OiBQb3NpdGlvbik6IEVkaXRIYW5kbGVbXSB7XG4gICAgbGV0IGhhbmRsZXMgPSBzdXBlci5nZXRFZGl0SGFuZGxlcyhwaWNrcywgZ3JvdW5kQ29vcmRzKTtcblxuICAgIGlmICh0aGlzLl90ZW50YXRpdmVGZWF0dXJlKSB7XG4gICAgICBoYW5kbGVzID0gaGFuZGxlcy5jb25jYXQoZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeSh0aGlzLl90ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LCAtMSkpO1xuICAgICAgLy8gU2xpY2Ugb2ZmIHRoZSBoYW5kbGVzIHRoYXQgYXJlIGFyZSBuZXh0IHRvIHRoZSBwb2ludGVyXG4gICAgICBpZiAodGhpcy5fdGVudGF0aXZlRmVhdHVyZSAmJiB0aGlzLl90ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGxhc3QgZXhpc3RpbmcgaGFuZGxlXG4gICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLnNsaWNlKDAsIC0xKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fdGVudGF0aXZlRmVhdHVyZSAmJiB0aGlzLl90ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGxhc3QgZXhpc3RpbmcgaGFuZGxlXG4gICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaGFuZGxlcztcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIHN1cGVyLmhhbmRsZUNsaWNrKGV2ZW50KTtcblxuICAgIGNvbnN0IHsgcGlja3MgfSA9IGV2ZW50O1xuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcblxuICAgIGxldCBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiA9IG51bGw7XG4gICAgY29uc3QgY2xpY2tlZEVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKHBpY2tzKTtcblxuICAgIGlmIChjbGlja2VkRWRpdEhhbmRsZSkge1xuICAgICAgLy8gVXNlciBjbGlja2VkIGFuIGVkaXQgaGFuZGxlLlxuICAgICAgLy8gUmVtb3ZlIGl0IGZyb20gdGhlIGNsaWNrIHNlcXVlbmNlLCBzbyBpdCBpc24ndCBhZGRlZCBhcyBhIG5ldyBwb2ludC5cbiAgICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcbiAgICAgIGNsaWNrU2VxdWVuY2Uuc3BsaWNlKGNsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMSwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRlbnRhdGl2ZUZlYXR1cmUgJiYgdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgIGNvbnN0IHBvbHlnb246IFBvbHlnb24gPSB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5O1xuXG4gICAgICBpZiAoXG4gICAgICAgIGNsaWNrZWRFZGl0SGFuZGxlICYmXG4gICAgICAgIGNsaWNrZWRFZGl0SGFuZGxlLmZlYXR1cmVJbmRleCA9PT0gLTEgJiZcbiAgICAgICAgKGNsaWNrZWRFZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlc1sxXSA9PT0gMCB8fFxuICAgICAgICAgIGNsaWNrZWRFZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlc1sxXSA9PT0gcG9seWdvbi5jb29yZGluYXRlc1swXS5sZW5ndGggLSAzKVxuICAgICAgKSB7XG4gICAgICAgIC8vIFRoZXkgY2xpY2tlZCB0aGUgZmlyc3Qgb3IgbGFzdCBwb2ludCAob3IgZG91YmxlLWNsaWNrZWQpLCBzbyBjb21wbGV0ZSB0aGUgcG9seWdvblxuXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgaG92ZXJlZCBwb3NpdGlvblxuICAgICAgICBjb25zdCBwb2x5Z29uVG9BZGQ6IFBvbHlnb24gPSB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbWy4uLnBvbHlnb24uY29vcmRpbmF0ZXNbMF0uc2xpY2UoMCwgLTIpLCBwb2x5Z29uLmNvb3JkaW5hdGVzWzBdWzBdXV1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJlc2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuICAgICAgICBlZGl0QWN0aW9uID0gdGhpcy5nZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbihwb2x5Z29uVG9BZGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRyaWdnZXIgcG9pbnRlciBtb3ZlIHJpZ2h0IGF3YXkgaW4gb3JkZXIgZm9yIGl0IHRvIHVwZGF0ZSBlZGl0IGhhbmRsZXMgKHRvIHN1cHBvcnQgZG91YmxlLWNsaWNrKVxuICAgIGNvbnN0IGZha2VQb2ludGVyTW92ZUV2ZW50ID0ge1xuICAgICAgc2NyZWVuQ29vcmRzOiBbLTEsIC0xXSxcbiAgICAgIGdyb3VuZENvb3JkczogZXZlbnQuZ3JvdW5kQ29vcmRzLFxuICAgICAgcGlja3M6IFtdLFxuICAgICAgaXNEcmFnZ2luZzogZmFsc2UsXG4gICAgICBwb2ludGVyRG93blBpY2tzOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IG51bGwsXG4gICAgICBwb2ludGVyRG93bkdyb3VuZENvb3JkczogbnVsbCxcbiAgICAgIHNvdXJjZUV2ZW50OiBudWxsXG4gICAgfTtcbiAgICB0aGlzLmhhbmRsZVBvaW50ZXJNb3ZlKGZha2VQb2ludGVyTW92ZUV2ZW50KTtcblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoe1xuICAgIGdyb3VuZENvb3Jkc1xuICB9OiBQb2ludGVyTW92ZUV2ZW50KTogeyBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcbiAgICBjb25zdCByZXN1bHQgPSB7IGVkaXRBY3Rpb246IG51bGwsIGNhbmNlbE1hcFBhbjogZmFsc2UgfTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbm90aGluZyB0byBkbyB5ZXRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoIDwgMykge1xuICAgICAgLy8gRHJhdyBhIExpbmVTdHJpbmcgY29ubmVjdGluZyBhbGwgdGhlIGNsaWNrZWQgcG9pbnRzIHdpdGggdGhlIGhvdmVyZWQgcG9pbnRcbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbLi4uY2xpY2tTZXF1ZW5jZSwgZ3JvdW5kQ29vcmRzXVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRHJhdyBhIFBvbHlnb24gY29ubmVjdGluZyBhbGwgdGhlIGNsaWNrZWQgcG9pbnRzIHdpdGggdGhlIGhvdmVyZWQgcG9pbnRcbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbWy4uLmNsaWNrU2VxdWVuY2UsIGdyb3VuZENvb3JkcywgY2xpY2tTZXF1ZW5jZVswXV1dXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==