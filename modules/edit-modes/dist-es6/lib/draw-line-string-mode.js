"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawLineStringMode = void 0;

var _geojsonEditMode = require("./geojson-edit-mode.js");

var _immutableFeatureCollection = require("./immutable-feature-collection.js");

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

var DrawLineStringMode =
/*#__PURE__*/
function (_BaseGeoJsonEditMode) {
  _inherits(DrawLineStringMode, _BaseGeoJsonEditMode);

  function DrawLineStringMode() {
    _classCallCheck(this, DrawLineStringMode);

    return _possibleConstructorReturn(this, _getPrototypeOf(DrawLineStringMode).apply(this, arguments));
  }

  _createClass(DrawLineStringMode, [{
    key: "handleClickAdapter",
    value: function handleClickAdapter(event, props) {
      _get(_getPrototypeOf(DrawLineStringMode.prototype), "handleClickAdapter", this).call(this, event, props);

      var editAction = null;
      var selectedFeatureIndexes = props.selectedIndexes;
      var selectedGeometry = this.getSelectedGeometry(props);
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
        var modeConfig = props.modeConfig;

        if (modeConfig && modeConfig.drawAtFront) {
          positionIndexes = [0];
        }

        var featureIndex = selectedFeatureIndexes[0];
        var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).addPosition(featureIndex, positionIndexes, event.mapCoords).getObject();
        editAction = {
          updatedData: updatedData,
          editType: 'addPosition',
          editContext: {
            featureIndexes: [featureIndex],
            positionIndexes: positionIndexes,
            position: event.mapCoords
          }
        };
        this.resetClickSequence();
      } else if (clickSequence.length === 2 && tentativeFeature) {
        // Add a new LineString
        var geometry = tentativeFeature.geometry;
        editAction = this.getAddFeatureAction(geometry, props.data);
        this.resetClickSequence();
      }

      return editAction;
    }
  }, {
    key: "handlePointerMoveAdapter",
    value: function handlePointerMoveAdapter(event, props) {
      var result = {
        editAction: null,
        cancelMapPan: false
      };
      var clickSequence = this.getClickSequence();
      var mapCoords = event.mapCoords;
      var startPosition = null;
      var selectedFeatureIndexes = props.selectedIndexes;
      var selectedGeometry = this.getSelectedGeometry(props);

      if (selectedFeatureIndexes.length > 1 || selectedGeometry && selectedGeometry.type !== 'LineString') {
        // unsupported
        return result;
      }

      if (selectedGeometry && selectedGeometry.type === 'LineString') {
        // Draw an extension line starting from one end of the selected LineString
        startPosition = selectedGeometry.coordinates[selectedGeometry.coordinates.length - 1];
        var modeConfig = props.modeConfig;

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
            coordinates: [startPosition, mapCoords]
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

  return DrawLineStringMode;
}(_geojsonEditMode.BaseGeoJsonEditMode);

exports.DrawLineStringMode = DrawLineStringMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1saW5lLXN0cmluZy1tb2RlLmpzIl0sIm5hbWVzIjpbIkRyYXdMaW5lU3RyaW5nTW9kZSIsImV2ZW50IiwicHJvcHMiLCJlZGl0QWN0aW9uIiwic2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsInNlbGVjdGVkSW5kZXhlcyIsInNlbGVjdGVkR2VvbWV0cnkiLCJnZXRTZWxlY3RlZEdlb21ldHJ5IiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsImxlbmd0aCIsInR5cGUiLCJjb25zb2xlIiwid2FybiIsInJlc2V0Q2xpY2tTZXF1ZW5jZSIsImxpbmVTdHJpbmciLCJwb3NpdGlvbkluZGV4ZXMiLCJjb29yZGluYXRlcyIsIm1vZGVDb25maWciLCJkcmF3QXRGcm9udCIsImZlYXR1cmVJbmRleCIsInVwZGF0ZWREYXRhIiwiSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJkYXRhIiwiYWRkUG9zaXRpb24iLCJtYXBDb29yZHMiLCJnZXRPYmplY3QiLCJlZGl0VHlwZSIsImVkaXRDb250ZXh0IiwiZmVhdHVyZUluZGV4ZXMiLCJwb3NpdGlvbiIsImdlb21ldHJ5IiwiZ2V0QWRkRmVhdHVyZUFjdGlvbiIsInJlc3VsdCIsImNhbmNlbE1hcFBhbiIsInN0YXJ0UG9zaXRpb24iLCJfc2V0VGVudGF0aXZlRmVhdHVyZSIsInByb3BlcnRpZXMiLCJCYXNlR2VvSnNvbkVkaXRNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBSUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxrQjs7Ozs7Ozs7Ozs7Ozt1Q0FDUUMsSyxFQUFtQkMsSyxFQUF5RDtBQUM3RixpR0FBeUJELEtBQXpCLEVBQWdDQyxLQUFoQzs7QUFFQSxVQUFJQyxVQUE4QixHQUFHLElBQXJDO0FBQ0EsVUFBTUMsc0JBQXNCLEdBQUdGLEtBQUssQ0FBQ0csZUFBckM7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QUcvQixnQkFBZ0IsQ0FBQ2EsV0FBakIsQ0FBNkJiLGdCQUFnQixDQUFDYSxXQUFqQixDQUE2QlAsTUFBN0IsR0FBc0MsQ0FBbkUsQ0FBaEI7QUFFQSxZQUFNUSxVQUFVLEdBQUdsQixLQUFLLENBQUNrQixVQUF6Qjs7QUFDQSxZQUFJQSxVQUFVLElBQUlBLFVBQVUsQ0FBQ0MsV0FBN0IsRUFBMEM7QUFDeENnQixVQUFBQSxhQUFhLEdBQUcvQixnQkFBZ0IsQ0FBQ2EsV0FBakIsQ0FBNkIsQ0FBN0IsQ0FBaEI7QUFDRDtBQUNGLE9BUkQsTUFRTyxJQUFJVCxhQUFhLENBQUNFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDckN5QixRQUFBQSxhQUFhLEdBQUczQixhQUFhLENBQUMsQ0FBRCxDQUE3QjtBQUNEOztBQUVELFVBQUkyQixhQUFKLEVBQW1CO0FBQ2pCLGFBQUtDLG9CQUFMLENBQTBCO0FBQ3hCekIsVUFBQUEsSUFBSSxFQUFFLFNBRGtCO0FBRXhCMEIsVUFBQUEsVUFBVSxFQUFFLEVBRlk7QUFHeEJOLFVBQUFBLFFBQVEsRUFBRTtBQUNScEIsWUFBQUEsSUFBSSxFQUFFLFlBREU7QUFFUk0sWUFBQUEsV0FBVyxFQUFFLENBQUNrQixhQUFELEVBQWdCVixTQUFoQjtBQUZMO0FBSGMsU0FBMUI7QUFRRDs7QUFFRCxhQUFPUSxNQUFQO0FBQ0Q7Ozt1Q0FFa0I7QUFDakIsYUFBTyxNQUFQO0FBQ0Q7Ozs7RUF6R3FDSyxvQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB0eXBlIHsgUG9zaXRpb24sIExpbmVTdHJpbmcsIEZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcy5qcyc7XG5pbXBvcnQgdHlwZSB7IENsaWNrRXZlbnQsIFBvaW50ZXJNb3ZlRXZlbnQsIE1vZGVQcm9wcyB9IGZyb20gJy4uL3R5cGVzLmpzJztcbmltcG9ydCB7IEJhc2VHZW9Kc29uRWRpdE1vZGUsIHR5cGUgR2VvSnNvbkVkaXRBY3Rpb24gfSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlLmpzJztcbmltcG9ydCB7IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi9pbW11dGFibGUtZmVhdHVyZS1jb2xsZWN0aW9uLmpzJztcblxuZXhwb3J0IGNsYXNzIERyYXdMaW5lU3RyaW5nTW9kZSBleHRlbmRzIEJhc2VHZW9Kc29uRWRpdE1vZGUge1xuICBoYW5kbGVDbGlja0FkYXB0ZXIoZXZlbnQ6IENsaWNrRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogP0dlb0pzb25FZGl0QWN0aW9uIHtcbiAgICBzdXBlci5oYW5kbGVDbGlja0FkYXB0ZXIoZXZlbnQsIHByb3BzKTtcblxuICAgIGxldCBlZGl0QWN0aW9uOiA/R2VvSnNvbkVkaXRBY3Rpb24gPSBudWxsO1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMgPSBwcm9wcy5zZWxlY3RlZEluZGV4ZXM7XG4gICAgY29uc3Qgc2VsZWN0ZWRHZW9tZXRyeSA9IHRoaXMuZ2V0U2VsZWN0ZWRHZW9tZXRyeShwcm9wcyk7XG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmIChcbiAgICAgIHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoID4gMSB8fFxuICAgICAgKHNlbGVjdGVkR2VvbWV0cnkgJiYgc2VsZWN0ZWRHZW9tZXRyeS50eXBlICE9PSAnTGluZVN0cmluZycpXG4gICAgKSB7XG4gICAgICBjb25zb2xlLndhcm4oYGRyYXdMaW5lU3RyaW5nIG1vZGUgb25seSBzdXBwb3J0ZWQgZm9yIHNpbmdsZSBMaW5lU3RyaW5nIHNlbGVjdGlvbmApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICB0aGlzLnJlc2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHNlbGVjdGVkR2VvbWV0cnkgJiYgc2VsZWN0ZWRHZW9tZXRyeS50eXBlID09PSAnTGluZVN0cmluZycpIHtcbiAgICAgIC8vIEV4dGVuZCB0aGUgTGluZVN0cmluZ1xuICAgICAgY29uc3QgbGluZVN0cmluZzogTGluZVN0cmluZyA9IHNlbGVjdGVkR2VvbWV0cnk7XG5cbiAgICAgIGxldCBwb3NpdGlvbkluZGV4ZXMgPSBbbGluZVN0cmluZy5jb29yZGluYXRlcy5sZW5ndGhdO1xuXG4gICAgICBjb25zdCBtb2RlQ29uZmlnID0gcHJvcHMubW9kZUNvbmZpZztcbiAgICAgIGlmIChtb2RlQ29uZmlnICYmIG1vZGVDb25maWcuZHJhd0F0RnJvbnQpIHtcbiAgICAgICAgcG9zaXRpb25JbmRleGVzID0gWzBdO1xuICAgICAgfVxuICAgICAgY29uc3QgZmVhdHVyZUluZGV4ID0gc2VsZWN0ZWRGZWF0dXJlSW5kZXhlc1swXTtcbiAgICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKHByb3BzLmRhdGEpXG4gICAgICAgIC5hZGRQb3NpdGlvbihmZWF0dXJlSW5kZXgsIHBvc2l0aW9uSW5kZXhlcywgZXZlbnQubWFwQ29vcmRzKVxuICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICBlZGl0VHlwZTogJ2FkZFBvc2l0aW9uJyxcbiAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICBmZWF0dXJlSW5kZXhlczogW2ZlYXR1cmVJbmRleF0sXG4gICAgICAgICAgcG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgIHBvc2l0aW9uOiBldmVudC5tYXBDb29yZHNcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcbiAgICB9IGVsc2UgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAyICYmIHRlbnRhdGl2ZUZlYXR1cmUpIHtcbiAgICAgIC8vIEFkZCBhIG5ldyBMaW5lU3RyaW5nXG4gICAgICBjb25zdCBnZW9tZXRyeTogYW55ID0gdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeTtcbiAgICAgIGVkaXRBY3Rpb24gPSB0aGlzLmdldEFkZEZlYXR1cmVBY3Rpb24oZ2VvbWV0cnksIHByb3BzLmRhdGEpO1xuXG4gICAgICB0aGlzLnJlc2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmVBZGFwdGVyKFxuICAgIGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50LFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICk6IHsgZWRpdEFjdGlvbjogP0dlb0pzb25FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgcmVzdWx0ID0geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG5cbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgY29uc3QgbWFwQ29vcmRzID0gZXZlbnQubWFwQ29vcmRzO1xuXG4gICAgbGV0IHN0YXJ0UG9zaXRpb246ID9Qb3NpdGlvbiA9IG51bGw7XG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyA9IHByb3BzLnNlbGVjdGVkSW5kZXhlcztcbiAgICBjb25zdCBzZWxlY3RlZEdlb21ldHJ5ID0gdGhpcy5nZXRTZWxlY3RlZEdlb21ldHJ5KHByb3BzKTtcblxuICAgIGlmIChcbiAgICAgIHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoID4gMSB8fFxuICAgICAgKHNlbGVjdGVkR2VvbWV0cnkgJiYgc2VsZWN0ZWRHZW9tZXRyeS50eXBlICE9PSAnTGluZVN0cmluZycpXG4gICAgKSB7XG4gICAgICAvLyB1bnN1cHBvcnRlZFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBpZiAoc2VsZWN0ZWRHZW9tZXRyeSAmJiBzZWxlY3RlZEdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgLy8gRHJhdyBhbiBleHRlbnNpb24gbGluZSBzdGFydGluZyBmcm9tIG9uZSBlbmQgb2YgdGhlIHNlbGVjdGVkIExpbmVTdHJpbmdcbiAgICAgIHN0YXJ0UG9zaXRpb24gPSBzZWxlY3RlZEdlb21ldHJ5LmNvb3JkaW5hdGVzW3NlbGVjdGVkR2VvbWV0cnkuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG5cbiAgICAgIGNvbnN0IG1vZGVDb25maWcgPSBwcm9wcy5tb2RlQ29uZmlnO1xuICAgICAgaWYgKG1vZGVDb25maWcgJiYgbW9kZUNvbmZpZy5kcmF3QXRGcm9udCkge1xuICAgICAgICBzdGFydFBvc2l0aW9uID0gc2VsZWN0ZWRHZW9tZXRyeS5jb29yZGluYXRlc1swXTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAxKSB7XG4gICAgICBzdGFydFBvc2l0aW9uID0gY2xpY2tTZXF1ZW5jZVswXTtcbiAgICB9XG5cbiAgICBpZiAoc3RhcnRQb3NpdGlvbikge1xuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbc3RhcnRQb3NpdGlvbiwgbWFwQ29vcmRzXVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0Q3Vyc29yQWRhcHRlcigpIHtcbiAgICByZXR1cm4gJ2NlbGwnO1xuICB9XG59XG4iXX0=