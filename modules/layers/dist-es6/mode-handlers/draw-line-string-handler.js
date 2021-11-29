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

// TODO edit-modes: delete handlers once EditMode fully implemented
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctbGluZS1zdHJpbmctaGFuZGxlci5qcyJdLCJuYW1lcyI6WyJEcmF3TGluZVN0cmluZ0hhbmRsZXIiLCJldmVudCIsImVkaXRBY3Rpb24iLCJzZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwiZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsInNlbGVjdGVkR2VvbWV0cnkiLCJnZXRTZWxlY3RlZEdlb21ldHJ5IiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsImxlbmd0aCIsInR5cGUiLCJjb25zb2xlIiwid2FybiIsInJlc2V0Q2xpY2tTZXF1ZW5jZSIsImxpbmVTdHJpbmciLCJwb3NpdGlvbkluZGV4ZXMiLCJjb29yZGluYXRlcyIsIm1vZGVDb25maWciLCJnZXRNb2RlQ29uZmlnIiwiZHJhd0F0RnJvbnQiLCJmZWF0dXJlSW5kZXgiLCJ1cGRhdGVkRGF0YSIsImdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwiYWRkUG9zaXRpb24iLCJncm91bmRDb29yZHMiLCJnZXRPYmplY3QiLCJlZGl0VHlwZSIsImZlYXR1cmVJbmRleGVzIiwiZWRpdENvbnRleHQiLCJwb3NpdGlvbiIsImdlb21ldHJ5IiwiZ2V0QWRkRmVhdHVyZUFjdGlvbiIsInJlc3VsdCIsImNhbmNlbE1hcFBhbiIsInN0YXJ0UG9zaXRpb24iLCJfc2V0VGVudGF0aXZlRmVhdHVyZSIsInByb3BlcnRpZXMiLCJNb2RlSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUtBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtJQUNhQSxxQjs7Ozs7Ozs7Ozs7OztnQ0FDQ0MsSyxFQUFnQztBQUMxQyw2RkFBa0JBLEtBQWxCOztBQUVBLFVBQUlDLFVBQXVCLEdBQUcsSUFBOUI7QUFDQSxVQUFNQyxzQkFBc0IsR0FBRyxLQUFLQyx5QkFBTCxFQUEv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LFlBQU1RLFVBQVUsR0FBRyxLQUFLQyxhQUFMLEVBQW5COztBQUNBLFlBQUlELFVBQVUsSUFBSUEsVUFBVSxDQUFDRSxXQUE3QixFQUEwQztBQUN4Q2UsVUFBQUEsYUFBYSxHQUFHL0IsZ0JBQWdCLENBQUNhLFdBQWpCLENBQTZCLENBQTdCLENBQWhCO0FBQ0Q7QUFDRixPQVJELE1BUU8sSUFBSVQsYUFBYSxDQUFDRSxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQ3JDeUIsUUFBQUEsYUFBYSxHQUFHM0IsYUFBYSxDQUFDLENBQUQsQ0FBN0I7QUFDRDs7QUFFRCxVQUFJMkIsYUFBSixFQUFtQjtBQUNqQixhQUFLQyxvQkFBTCxDQUEwQjtBQUN4QnpCLFVBQUFBLElBQUksRUFBRSxTQURrQjtBQUV4QjBCLFVBQUFBLFVBQVUsRUFBRSxFQUZZO0FBR3hCTixVQUFBQSxRQUFRLEVBQUU7QUFDUnBCLFlBQUFBLElBQUksRUFBRSxZQURFO0FBRVJNLFlBQUFBLFdBQVcsRUFBRSxDQUFDa0IsYUFBRCxFQUFnQlYsWUFBaEI7QUFGTDtBQUhjLFNBQTFCO0FBUUQ7O0FBRUQsYUFBT1EsTUFBUDtBQUNEOzs7O0VBbEd3Q0ssd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSB7IFBvc2l0aW9uLCBMaW5lU3RyaW5nIH0gZnJvbSAna2VwbGVyLW91dGRhdGVkLW5lYnVsYS5nbC1lZGl0LW1vZGVzJztcbmltcG9ydCB0eXBlIHsgQ2xpY2tFdmVudCwgUG9pbnRlck1vdmVFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgRWRpdEFjdGlvbiB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IE1vZGVIYW5kbGVyIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgRHJhd0xpbmVTdHJpbmdIYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBoYW5kbGVDbGljayhldmVudDogQ2xpY2tFdmVudCk6ID9FZGl0QWN0aW9uIHtcbiAgICBzdXBlci5oYW5kbGVDbGljayhldmVudCk7XG5cbiAgICBsZXQgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24gPSBudWxsO1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKTtcbiAgICBjb25zdCBzZWxlY3RlZEdlb21ldHJ5ID0gdGhpcy5nZXRTZWxlY3RlZEdlb21ldHJ5KCk7XG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmIChcbiAgICAgIHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoID4gMSB8fFxuICAgICAgKHNlbGVjdGVkR2VvbWV0cnkgJiYgc2VsZWN0ZWRHZW9tZXRyeS50eXBlICE9PSAnTGluZVN0cmluZycpXG4gICAgKSB7XG4gICAgICBjb25zb2xlLndhcm4oYGRyYXdMaW5lU3RyaW5nIG1vZGUgb25seSBzdXBwb3J0ZWQgZm9yIHNpbmdsZSBMaW5lU3RyaW5nIHNlbGVjdGlvbmApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICB0aGlzLnJlc2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHNlbGVjdGVkR2VvbWV0cnkgJiYgc2VsZWN0ZWRHZW9tZXRyeS50eXBlID09PSAnTGluZVN0cmluZycpIHtcbiAgICAgIC8vIEV4dGVuZCB0aGUgTGluZVN0cmluZ1xuICAgICAgY29uc3QgbGluZVN0cmluZzogTGluZVN0cmluZyA9IHNlbGVjdGVkR2VvbWV0cnk7XG5cbiAgICAgIGxldCBwb3NpdGlvbkluZGV4ZXMgPSBbbGluZVN0cmluZy5jb29yZGluYXRlcy5sZW5ndGhdO1xuXG4gICAgICBjb25zdCBtb2RlQ29uZmlnID0gdGhpcy5nZXRNb2RlQ29uZmlnKCk7XG4gICAgICBpZiAobW9kZUNvbmZpZyAmJiBtb2RlQ29uZmlnLmRyYXdBdEZyb250KSB7XG4gICAgICAgIHBvc2l0aW9uSW5kZXhlcyA9IFswXTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZlYXR1cmVJbmRleCA9IHNlbGVjdGVkRmVhdHVyZUluZGV4ZXNbMF07XG4gICAgICBjb25zdCB1cGRhdGVkRGF0YSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKVxuICAgICAgICAuYWRkUG9zaXRpb24oZmVhdHVyZUluZGV4LCBwb3NpdGlvbkluZGV4ZXMsIGV2ZW50Lmdyb3VuZENvb3JkcylcbiAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICBlZGl0QWN0aW9uID0ge1xuICAgICAgICB1cGRhdGVkRGF0YSxcbiAgICAgICAgZWRpdFR5cGU6ICdhZGRQb3NpdGlvbicsXG4gICAgICAgIGZlYXR1cmVJbmRleGVzOiBbZmVhdHVyZUluZGV4XSxcbiAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICBwb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgcG9zaXRpb246IGV2ZW50Lmdyb3VuZENvb3Jkc1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB0aGlzLnJlc2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgIH0gZWxzZSBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDIgJiYgdGVudGF0aXZlRmVhdHVyZSkge1xuICAgICAgLy8gQWRkIGEgbmV3IExpbmVTdHJpbmdcbiAgICAgIGNvbnN0IGdlb21ldHJ5OiBhbnkgPSB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5O1xuICAgICAgZWRpdEFjdGlvbiA9IHRoaXMuZ2V0QWRkRmVhdHVyZUFjdGlvbihnZW9tZXRyeSk7XG5cbiAgICAgIHRoaXMucmVzZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogP0VkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBjb25zdCByZXN1bHQgPSB7IGVkaXRBY3Rpb246IG51bGwsIGNhbmNlbE1hcFBhbjogZmFsc2UgfTtcblxuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcbiAgICBjb25zdCBncm91bmRDb29yZHMgPSBldmVudC5ncm91bmRDb29yZHM7XG5cbiAgICBsZXQgc3RhcnRQb3NpdGlvbjogP1Bvc2l0aW9uID0gbnVsbDtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleGVzID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKCk7XG4gICAgY29uc3Qgc2VsZWN0ZWRHZW9tZXRyeSA9IHRoaXMuZ2V0U2VsZWN0ZWRHZW9tZXRyeSgpO1xuXG4gICAgaWYgKFxuICAgICAgc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5sZW5ndGggPiAxIHx8XG4gICAgICAoc2VsZWN0ZWRHZW9tZXRyeSAmJiBzZWxlY3RlZEdlb21ldHJ5LnR5cGUgIT09ICdMaW5lU3RyaW5nJylcbiAgICApIHtcbiAgICAgIC8vIHVuc3VwcG9ydGVkXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGlmIChzZWxlY3RlZEdlb21ldHJ5ICYmIHNlbGVjdGVkR2VvbWV0cnkudHlwZSA9PT0gJ0xpbmVTdHJpbmcnKSB7XG4gICAgICAvLyBEcmF3IGFuIGV4dGVuc2lvbiBsaW5lIHN0YXJ0aW5nIGZyb20gb25lIGVuZCBvZiB0aGUgc2VsZWN0ZWQgTGluZVN0cmluZ1xuICAgICAgc3RhcnRQb3NpdGlvbiA9IHNlbGVjdGVkR2VvbWV0cnkuY29vcmRpbmF0ZXNbc2VsZWN0ZWRHZW9tZXRyeS5jb29yZGluYXRlcy5sZW5ndGggLSAxXTtcblxuICAgICAgY29uc3QgbW9kZUNvbmZpZyA9IHRoaXMuZ2V0TW9kZUNvbmZpZygpO1xuICAgICAgaWYgKG1vZGVDb25maWcgJiYgbW9kZUNvbmZpZy5kcmF3QXRGcm9udCkge1xuICAgICAgICBzdGFydFBvc2l0aW9uID0gc2VsZWN0ZWRHZW9tZXRyeS5jb29yZGluYXRlc1swXTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAxKSB7XG4gICAgICBzdGFydFBvc2l0aW9uID0gY2xpY2tTZXF1ZW5jZVswXTtcbiAgICB9XG5cbiAgICBpZiAoc3RhcnRQb3NpdGlvbikge1xuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbc3RhcnRQb3NpdGlvbiwgZ3JvdW5kQ29vcmRzXVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=