"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawLineStringHandler = void 0;

var _modeHandler = require("./mode-handler.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var DrawLineStringHandler =
/*#__PURE__*/
function (_ModeHandler) {
  _inherits(DrawLineStringHandler, _ModeHandler);

  function DrawLineStringHandler() {
    _classCallCheck(this, DrawLineStringHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawLineStringHandler).apply(this, arguments));
  }

  _createClass(DrawLineStringHandler, [{
    key: "handleClick",
    value: function handleClick(event) {
      _get(_getPrototypeOf(DrawLineStringHandler.prototype), "handleClick", this).call(this, event);

      var editAction = null;
      var selectedFeatureIndexes = this.getSelectedFeatureIndexes();
      var selectedGeometry = this.getSelectedGeometry();
      var tentativeFeature = this.getTentativeFeature();
      var clickSequence = this.getClickSequence();

      if (selectedFeatureIndexes.length > 1 || selectedGeometry && selectedGeometry.type !== 'LineString') {
        console.warn("drawLineString mode only supported for single LineString selection"); // eslint-disable-line

        this.resetClickSequence();
        return null;
      }

      if (selectedGeometry && selectedGeometry.type === 'LineString') {
        // Extend the LineString
        var lineString = selectedGeometry;
        var positionIndexes = [lineString.coordinates.length];
        var modeConfig = this.getModeConfig();

        if (modeConfig && modeConfig.drawAtFront) {
          positionIndexes = [0];
        }

        var featureIndex = selectedFeatureIndexes[0];
        var updatedData = this.getImmutableFeatureCollection().addPosition(featureIndex, positionIndexes, event.groundCoords).getObject();
        editAction = {
          updatedData: updatedData,
          editType: 'addPosition',
          featureIndexes: [featureIndex],
          editContext: {
            positionIndexes: positionIndexes,
            position: event.groundCoords
          }
        };
        this.resetClickSequence();
      } else if (clickSequence.length === 2 && tentativeFeature) {
        // Add a new LineString
        var geometry = tentativeFeature.geometry;
        editAction = this.getAddFeatureAction(geometry);
        this.resetClickSequence();
      }

      return editAction;
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      var result = {
        editAction: null,
        cancelMapPan: false
      };
      var clickSequence = this.getClickSequence();
      var groundCoords = event.groundCoords;
      var startPosition = null;
      var selectedFeatureIndexes = this.getSelectedFeatureIndexes();
      var selectedGeometry = this.getSelectedGeometry();

      if (selectedFeatureIndexes.length > 1 || selectedGeometry && selectedGeometry.type !== 'LineString') {
        // unsupported
        return result;
      }

      if (selectedGeometry && selectedGeometry.type === 'LineString') {
        // Draw an extension line starting from one end of the selected LineString
        startPosition = selectedGeometry.coordinates[selectedGeometry.coordinates.length - 1];
        var modeConfig = this.getModeConfig();

        if (modeConfig && modeConfig.drawAtFront) {
          startPosition = selectedGeometry.coordinates[0];
        }
      } else if (clickSequence.length === 1) {
        startPosition = clickSequence[0];
      }

      if (startPosition) {
        this._setTentativeFeature({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [startPosition, groundCoords]
          }
        });
      }

      return result;
    }
  }]);

  return DrawLineStringHandler;
}(_modeHandler.ModeHandler);

exports.DrawLineStringHandler = DrawLineStringHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctbGluZS1zdHJpbmctaGFuZGxlci5qcyJdLCJuYW1lcyI6WyJEcmF3TGluZVN0cmluZ0hhbmRsZXIiLCJldmVudCIsImVkaXRBY3Rpb24iLCJzZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwiZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsInNlbGVjdGVkR2VvbWV0cnkiLCJnZXRTZWxlY3RlZEdlb21ldHJ5IiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsImxlbmd0aCIsInR5cGUiLCJjb25zb2xlIiwid2FybiIsInJlc2V0Q2xpY2tTZXF1ZW5jZSIsImxpbmVTdHJpbmciLCJwb3NpdGlvbkluZGV4ZXMiLCJjb29yZGluYXRlcyIsIm1vZGVDb25maWciLCJnZXRNb2RlQ29uZmlnIiwiZHJhd0F0RnJvbnQiLCJmZWF0dXJlSW5kZXgiLCJ1cGRhdGVkRGF0YSIsImdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwiYWRkUG9zaXRpb24iLCJncm91bmRDb29yZHMiLCJnZXRPYmplY3QiLCJlZGl0VHlwZSIsImZlYXR1cmVJbmRleGVzIiwiZWRpdENvbnRleHQiLCJwb3NpdGlvbiIsImdlb21ldHJ5IiwiZ2V0QWRkRmVhdHVyZUFjdGlvbiIsInJlc3VsdCIsImNhbmNlbE1hcFBhbiIsInN0YXJ0UG9zaXRpb24iLCJfc2V0VGVudGF0aXZlRmVhdHVyZSIsInByb3BlcnRpZXMiLCJNb2RlSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUtBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEscUI7Ozs7Ozs7Ozs7Ozs7Z0NBQ0NDLEssRUFBZ0M7QUFDMUMsNkZBQWtCQSxLQUFsQjs7QUFFQSxVQUFJQyxVQUF1QixHQUFHLElBQTlCO0FBQ0EsVUFBTUMsc0JBQXNCLEdBQUcsS0FBS0MseUJBQUwsRUFBL0I7QUFD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USxVQUFVLEdBQUcsS0FBS0MsYUFBTCxFQUFuQjs7QUFDQSxZQUFJRCxVQUFVLElBQUlBLFVBQVUsQ0FBQ0UsV0FBN0IsRUFBMEM7QUFDeENlLFVBQUFBLGFBQWEsR0FBRy9CLGdCQUFnQixDQUFDYSxXQUFqQixDQUE2QixDQUE3QixDQUFoQjtBQUNEO0FBQ0YsT0FSRCxNQVFPLElBQUlULGFBQWEsQ0FBQ0UsTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUNyQ3lCLFFBQUFBLGFBQWEsR0FBRzNCLGFBQWEsQ0FBQyxDQUFELENBQTdCO0FBQ0Q7O0FBRUQsVUFBSTJCLGFBQUosRUFBbUI7QUFDakIsYUFBS0Msb0JBQUwsQ0FBMEI7QUFDeEJ6QixVQUFBQSxJQUFJLEVBQUUsU0FEa0I7QUFFeEIwQixVQUFBQSxVQUFVLEVBQUUsRUFGWTtBQUd4Qk4sVUFBQUEsUUFBUSxFQUFFO0FBQ1JwQixZQUFBQSxJQUFJLEVBQUUsWUFERTtBQUVSTSxZQUFBQSxXQUFXLEVBQUUsQ0FBQ2tCLGFBQUQsRUFBZ0JWLFlBQWhCO0FBRkw7QUFIYyxTQUExQjtBQVFEOztBQUVELGFBQU9RLE1BQVA7QUFDRDs7OztFQWxHd0NLLHdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUgeyBQb3NpdGlvbiwgTGluZVN0cmluZyB9IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgdHlwZSB7IENsaWNrRXZlbnQsIFBvaW50ZXJNb3ZlRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRBY3Rpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBNb2RlSGFuZGxlciB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcblxuZXhwb3J0IGNsYXNzIERyYXdMaW5lU3RyaW5nSGFuZGxlciBleHRlbmRzIE1vZGVIYW5kbGVyIHtcbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgc3VwZXIuaGFuZGxlQ2xpY2soZXZlbnQpO1xuXG4gICAgbGV0IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uID0gbnVsbDtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleGVzID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKCk7XG4gICAgY29uc3Qgc2VsZWN0ZWRHZW9tZXRyeSA9IHRoaXMuZ2V0U2VsZWN0ZWRHZW9tZXRyeSgpO1xuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICBpZiAoXG4gICAgICBzZWxlY3RlZEZlYXR1cmVJbmRleGVzLmxlbmd0aCA+IDEgfHxcbiAgICAgIChzZWxlY3RlZEdlb21ldHJ5ICYmIHNlbGVjdGVkR2VvbWV0cnkudHlwZSAhPT0gJ0xpbmVTdHJpbmcnKVxuICAgICkge1xuICAgICAgY29uc29sZS53YXJuKGBkcmF3TGluZVN0cmluZyBtb2RlIG9ubHkgc3VwcG9ydGVkIGZvciBzaW5nbGUgTGluZVN0cmluZyBzZWxlY3Rpb25gKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChzZWxlY3RlZEdlb21ldHJ5ICYmIHNlbGVjdGVkR2VvbWV0cnkudHlwZSA9PT0gJ0xpbmVTdHJpbmcnKSB7XG4gICAgICAvLyBFeHRlbmQgdGhlIExpbmVTdHJpbmdcbiAgICAgIGNvbnN0IGxpbmVTdHJpbmc6IExpbmVTdHJpbmcgPSBzZWxlY3RlZEdlb21ldHJ5O1xuXG4gICAgICBsZXQgcG9zaXRpb25JbmRleGVzID0gW2xpbmVTdHJpbmcuY29vcmRpbmF0ZXMubGVuZ3RoXTtcblxuICAgICAgY29uc3QgbW9kZUNvbmZpZyA9IHRoaXMuZ2V0TW9kZUNvbmZpZygpO1xuICAgICAgaWYgKG1vZGVDb25maWcgJiYgbW9kZUNvbmZpZy5kcmF3QXRGcm9udCkge1xuICAgICAgICBwb3NpdGlvbkluZGV4ZXMgPSBbMF07XG4gICAgICB9XG4gICAgICBjb25zdCBmZWF0dXJlSW5kZXggPSBzZWxlY3RlZEZlYXR1cmVJbmRleGVzWzBdO1xuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKClcbiAgICAgICAgLmFkZFBvc2l0aW9uKGZlYXR1cmVJbmRleCwgcG9zaXRpb25JbmRleGVzLCBldmVudC5ncm91bmRDb29yZHMpXG4gICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgZWRpdEFjdGlvbiA9IHtcbiAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgIGVkaXRUeXBlOiAnYWRkUG9zaXRpb24nLFxuICAgICAgICBmZWF0dXJlSW5kZXhlczogW2ZlYXR1cmVJbmRleF0sXG4gICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgcG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgIHBvc2l0aW9uOiBldmVudC5ncm91bmRDb29yZHNcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcbiAgICB9IGVsc2UgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAyICYmIHRlbnRhdGl2ZUZlYXR1cmUpIHtcbiAgICAgIC8vIEFkZCBhIG5ldyBMaW5lU3RyaW5nXG4gICAgICBjb25zdCBnZW9tZXRyeTogYW55ID0gdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeTtcbiAgICAgIGVkaXRBY3Rpb24gPSB0aGlzLmdldEFkZEZlYXR1cmVBY3Rpb24oZ2VvbWV0cnkpO1xuXG4gICAgICB0aGlzLnJlc2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpOiB7IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgcmVzdWx0ID0geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG5cbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgY29uc3QgZ3JvdW5kQ29vcmRzID0gZXZlbnQuZ3JvdW5kQ29vcmRzO1xuXG4gICAgbGV0IHN0YXJ0UG9zaXRpb246ID9Qb3NpdGlvbiA9IG51bGw7XG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpO1xuICAgIGNvbnN0IHNlbGVjdGVkR2VvbWV0cnkgPSB0aGlzLmdldFNlbGVjdGVkR2VvbWV0cnkoKTtcblxuICAgIGlmIChcbiAgICAgIHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoID4gMSB8fFxuICAgICAgKHNlbGVjdGVkR2VvbWV0cnkgJiYgc2VsZWN0ZWRHZW9tZXRyeS50eXBlICE9PSAnTGluZVN0cmluZycpXG4gICAgKSB7XG4gICAgICAvLyB1bnN1cHBvcnRlZFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBpZiAoc2VsZWN0ZWRHZW9tZXRyeSAmJiBzZWxlY3RlZEdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgLy8gRHJhdyBhbiBleHRlbnNpb24gbGluZSBzdGFydGluZyBmcm9tIG9uZSBlbmQgb2YgdGhlIHNlbGVjdGVkIExpbmVTdHJpbmdcbiAgICAgIHN0YXJ0UG9zaXRpb24gPSBzZWxlY3RlZEdlb21ldHJ5LmNvb3JkaW5hdGVzW3NlbGVjdGVkR2VvbWV0cnkuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG5cbiAgICAgIGNvbnN0IG1vZGVDb25maWcgPSB0aGlzLmdldE1vZGVDb25maWcoKTtcbiAgICAgIGlmIChtb2RlQ29uZmlnICYmIG1vZGVDb25maWcuZHJhd0F0RnJvbnQpIHtcbiAgICAgICAgc3RhcnRQb3NpdGlvbiA9IHNlbGVjdGVkR2VvbWV0cnkuY29vcmRpbmF0ZXNbMF07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgc3RhcnRQb3NpdGlvbiA9IGNsaWNrU2VxdWVuY2VbMF07XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0UG9zaXRpb24pIHtcbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJyxcbiAgICAgICAgICBjb29yZGluYXRlczogW3N0YXJ0UG9zaXRpb24sIGdyb3VuZENvb3Jkc11cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19