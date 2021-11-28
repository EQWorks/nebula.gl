"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("uuid/v1"));

var _constants = require("../constants");

var _baseMode = _interopRequireDefault(require("./base-mode"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DrawLineStringMode =
/*#__PURE__*/
function (_BaseMode) {
  _inherits(DrawLineStringMode, _BaseMode);

  function DrawLineStringMode() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, DrawLineStringMode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DrawLineStringMode)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleClick", function (event, props) {
      var data = props.data,
          selectedIndexes = props.selectedIndexes;

      var selectedFeature = _this.getSelectedFeature(props);

      var tentativeFeature = _this.getTentativeFeature(); // add position to a selectedFeature


      if (selectedFeature) {
        var selectedFeatureIndex = selectedIndexes[0];
        var positionIndexes = [selectedFeature.geometry.coordinates.length];
        var updatedData = data.addPosition(selectedFeatureIndex, positionIndexes, event.mapCoords).getObject();
        props.onEdit({
          editType: _constants.EDIT_TYPE.ADD_POSITION,
          updatedData: updatedData,
          editContext: {
            positionIndexes: positionIndexes,
            position: event.mapCoords
          }
        }); // commit tentativeFeature to featureCollection
      } else if (tentativeFeature) {
        _this.setTentativeFeature(null);

        var feature = {
          type: 'Feature',
          properties: {
            id: tentativeFeature.properties.id,
            // todo deprecate renderType
            renderType: _constants.RENDER_TYPE.LINE_STRING
          },
          geometry: {
            type: _constants.GEOJSON_TYPE.LINE_STRING,
            coordinates: [tentativeFeature.geometry.coordinates[0], event.mapCoords]
          }
        };

        var _updatedData = data.addFeature(feature).getObject();

        props.onEdit({
          editType: _constants.EDIT_TYPE.ADD_FEATURE,
          updatedData: _updatedData,
          editContext: null
        });
      } else {
        tentativeFeature = {
          type: 'Feature',
          properties: {
            // TODO deprecate id & renderType
            id: (0, _v.default)(),
            renderType: _constants.RENDER_TYPE.LINE_STRING,
            guideType: _constants.GUIDE_TYPE.TENTATIVE
          },
          geometry: {
            type: _constants.GEOJSON_TYPE.POINT,
            coordinates: [event.mapCoords]
          }
        };

        _this.setTentativeFeature(tentativeFeature);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getGuides", function (props) {
      var selectedFeature = _this.getSelectedFeature(props);

      var tentativeFeature = _this.getTentativeFeature();

      var feature = selectedFeature || tentativeFeature;
      var coordinates = (0, _utils.getFeatureCoordinates)(feature);

      if (!coordinates) {
        return null;
      }

      var event = props.lastPointerMoveEvent; // existing editHandles + cursorEditHandle

      var editHandles = _this.getEditHandlesFromFeature(feature) || [];
      var cursorEditHandle = {
        type: 'Feature',
        properties: {
          guideType: _constants.GUIDE_TYPE.CURSOR_EDIT_HANDLE,
          // TODO remove renderType
          renderType: _constants.RENDER_TYPE.LINE_STRING,
          positionIndexes: [editHandles.length]
        },
        geometry: {
          type: _constants.GEOJSON_TYPE.POINT,
          coordinates: [event.mapCoords]
        }
      };
      editHandles.push(cursorEditHandle); // tentativeFeature

      tentativeFeature = {
        type: 'Feature',
        properties: {
          // TODO deprecate id and renderType
          id: (0, _v.default)(),
          guideType: _constants.GUIDE_TYPE.TENTATIVE,
          renderType: _constants.RENDER_TYPE.LINE_STRING
        },
        geometry: {
          type: _constants.GEOJSON_TYPE.LINE_STRING,
          coordinates: [coordinates[coordinates.length - 1], event.mapCoords]
        }
      };
      return {
        tentativeFeature: tentativeFeature,
        editHandles: editHandles
      };
    });

    return _this;
  }

  return DrawLineStringMode;
}(_baseMode.default);

exports.default = DrawLineStringMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lZGl0LW1vZGVzL2RyYXctbGluZS1zdHJpbmctbW9kZS5qcyJdLCJuYW1lcyI6WyJEcmF3TGluZVN0cmluZ01vZGUiLCJldmVudCIsInByb3BzIiwiZGF0YSIsInNlbGVjdGVkSW5kZXhlcyIsInNlbGVjdGVkRmVhdHVyZSIsImdldFNlbGVjdGVkRmVhdHVyZSIsInRlbnRhdGl2ZUZlYXR1cmUiLCJnZXRUZW50YXRpdmVGZWF0dXJlIiwic2VsZWN0ZWRGZWF0dXJlSW5kZXgiLCJwb3NpdGlvbkluZGV4ZXMiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwibGVuZ3RoIiwidXBkYXRlZERhdGEiLCJhZGRQb3NpdGlvbiIsIm1hcENvb3JkcyIsImdldE9iamVjdCIsIm9uRWRpdCIsImVkaXRUeXBlIiwiRURJVF9UWVBFIiwiQUREX1BPU0lUSU9OIiwiZWRpdENvbnRleHQiLCJwb3NpdGlvbiIsInNldFRlbnRhdGl2ZUZlYXR1cmUiLCJmZWF0dXJlIiwidHlwZSIsInByb3BlcnRpZXMiLCJpZCIsInJlbmRlclR5cGUiLCJSRU5ERVJfVFlQRSIsIkxJTkVfU1RSSU5HIiwiR0VPSlNPTl9UWVBFIiwiYWRkRmVhdHVyZSIsIkFERF9GRUFUVVJFIiwiZ3VpZGVUeXBlIiwiR1VJREVfVFlQRSIsIlRFTlRBVElWRSIsIlBPSU5UIiwibGFzdFBvaW50ZXJNb3ZlRXZlbnQiLCJlZGl0SGFuZGxlcyIsImdldEVkaXRIYW5kbGVzRnJvbUZlYXR1cmUiLCJjdXJzb3JFZGl0SGFuZGxlIiwiQ1VSU09SX0VESVRfSEFORExFIiwicHVzaCIsIkJhc2VNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBS0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRXFCQSxrQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBGQUNMLFVBQUNDLEtBQUQsRUFBb0JDLEtBQXBCLEVBQTREO0FBQUEsVUFDaEVDLElBRGdFLEdBQ3RDRCxLQURzQyxDQUNoRUMsSUFEZ0U7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QVJPLE9BQW5CO0FBY0EsYUFBTztBQUNMVCxRQUFBQSxnQkFBZ0IsRUFBaEJBLGdCQURLO0FBRUxpQyxRQUFBQSxXQUFXLEVBQVhBO0FBRkssT0FBUDtBQUlELEs7Ozs7OztFQXJINkNLLGlCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHV1aWQgZnJvbSAndXVpZC92MSc7XG5cbmltcG9ydCB0eXBlIHsgQ2xpY2tFdmVudCwgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHR5cGUgeyBNb2RlUHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7IEVESVRfVFlQRSwgR0VPSlNPTl9UWVBFLCBHVUlERV9UWVBFLCBSRU5ERVJfVFlQRSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgQmFzZU1vZGUgZnJvbSAnLi9iYXNlLW1vZGUnO1xuaW1wb3J0IHsgZ2V0RmVhdHVyZUNvb3JkaW5hdGVzIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyYXdMaW5lU3RyaW5nTW9kZSBleHRlbmRzIEJhc2VNb2RlIHtcbiAgaGFuZGxlQ2xpY2sgPSAoZXZlbnQ6IENsaWNrRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSA9PiB7XG4gICAgY29uc3QgeyBkYXRhLCBzZWxlY3RlZEluZGV4ZXMgfSA9IHByb3BzO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmUocHJvcHMpO1xuICAgIGxldCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVGZWF0dXJlKCk7XG5cbiAgICAvLyBhZGQgcG9zaXRpb24gdG8gYSBzZWxlY3RlZEZlYXR1cmVcbiAgICBpZiAoc2VsZWN0ZWRGZWF0dXJlKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleCA9IHNlbGVjdGVkSW5kZXhlc1swXTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uSW5kZXhlcyA9IFtzZWxlY3RlZEZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXMubGVuZ3RoXTtcblxuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSBkYXRhXG4gICAgICAgIC5hZGRQb3NpdGlvbihzZWxlY3RlZEZlYXR1cmVJbmRleCwgcG9zaXRpb25JbmRleGVzLCBldmVudC5tYXBDb29yZHMpXG4gICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgcHJvcHMub25FZGl0KHtcbiAgICAgICAgZWRpdFR5cGU6IEVESVRfVFlQRS5BRERfUE9TSVRJT04sXG4gICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgIHBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICBwb3NpdGlvbjogZXZlbnQubWFwQ29vcmRzXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBjb21taXQgdGVudGF0aXZlRmVhdHVyZSB0byBmZWF0dXJlQ29sbGVjdGlvblxuICAgIH0gZWxzZSBpZiAodGVudGF0aXZlRmVhdHVyZSkge1xuICAgICAgdGhpcy5zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuXG4gICAgICBjb25zdCBmZWF0dXJlID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBpZDogdGVudGF0aXZlRmVhdHVyZS5wcm9wZXJ0aWVzLmlkLFxuICAgICAgICAgIC8vIHRvZG8gZGVwcmVjYXRlIHJlbmRlclR5cGVcbiAgICAgICAgICByZW5kZXJUeXBlOiBSRU5ERVJfVFlQRS5MSU5FX1NUUklOR1xuICAgICAgICB9LFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6IEdFT0pTT05fVFlQRS5MSU5FX1NUUklORyxcbiAgICAgICAgICBjb29yZGluYXRlczogW3RlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0sIGV2ZW50Lm1hcENvb3Jkc11cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSBkYXRhLmFkZEZlYXR1cmUoZmVhdHVyZSkuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIHByb3BzLm9uRWRpdCh7XG4gICAgICAgIGVkaXRUeXBlOiBFRElUX1RZUEUuQUREX0ZFQVRVUkUsXG4gICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICBlZGl0Q29udGV4dDogbnVsbFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRlbnRhdGl2ZUZlYXR1cmUgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIC8vIFRPRE8gZGVwcmVjYXRlIGlkICYgcmVuZGVyVHlwZVxuICAgICAgICAgIGlkOiB1dWlkKCksXG4gICAgICAgICAgcmVuZGVyVHlwZTogUkVOREVSX1RZUEUuTElORV9TVFJJTkcsXG4gICAgICAgICAgZ3VpZGVUeXBlOiBHVUlERV9UWVBFLlRFTlRBVElWRVxuICAgICAgICB9LFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6IEdFT0pTT05fVFlQRS5QT0lOVCxcbiAgICAgICAgICBjb29yZGluYXRlczogW2V2ZW50Lm1hcENvb3Jkc11cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdGhpcy5zZXRUZW50YXRpdmVGZWF0dXJlKHRlbnRhdGl2ZUZlYXR1cmUpO1xuICAgIH1cbiAgfTtcblxuICBnZXRHdWlkZXMgPSAocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pID0+IHtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmUgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZShwcm9wcyk7XG4gICAgbGV0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcblxuICAgIGNvbnN0IGZlYXR1cmUgPSBzZWxlY3RlZEZlYXR1cmUgfHwgdGVudGF0aXZlRmVhdHVyZTtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IGdldEZlYXR1cmVDb29yZGluYXRlcyhmZWF0dXJlKTtcblxuICAgIGlmICghY29vcmRpbmF0ZXMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50ID0gcHJvcHMubGFzdFBvaW50ZXJNb3ZlRXZlbnQ7XG5cbiAgICAvLyBleGlzdGluZyBlZGl0SGFuZGxlcyArIGN1cnNvckVkaXRIYW5kbGVcbiAgICBjb25zdCBlZGl0SGFuZGxlcyA9IHRoaXMuZ2V0RWRpdEhhbmRsZXNGcm9tRmVhdHVyZShmZWF0dXJlKSB8fCBbXTtcbiAgICBjb25zdCBjdXJzb3JFZGl0SGFuZGxlID0ge1xuICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBndWlkZVR5cGU6IEdVSURFX1RZUEUuQ1VSU09SX0VESVRfSEFORExFLFxuICAgICAgICAvLyBUT0RPIHJlbW92ZSByZW5kZXJUeXBlXG4gICAgICAgIHJlbmRlclR5cGU6IFJFTkRFUl9UWVBFLkxJTkVfU1RSSU5HLFxuICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IFtlZGl0SGFuZGxlcy5sZW5ndGhdXG4gICAgICB9LFxuICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgdHlwZTogR0VPSlNPTl9UWVBFLlBPSU5ULFxuICAgICAgICBjb29yZGluYXRlczogW2V2ZW50Lm1hcENvb3Jkc11cbiAgICAgIH1cbiAgICB9O1xuICAgIGVkaXRIYW5kbGVzLnB1c2goY3Vyc29yRWRpdEhhbmRsZSk7XG5cbiAgICAvLyB0ZW50YXRpdmVGZWF0dXJlXG4gICAgdGVudGF0aXZlRmVhdHVyZSA9IHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gVE9ETyBkZXByZWNhdGUgaWQgYW5kIHJlbmRlclR5cGVcbiAgICAgICAgaWQ6IHV1aWQoKSxcbiAgICAgICAgZ3VpZGVUeXBlOiBHVUlERV9UWVBFLlRFTlRBVElWRSxcbiAgICAgICAgcmVuZGVyVHlwZTogUkVOREVSX1RZUEUuTElORV9TVFJJTkdcbiAgICAgIH0sXG4gICAgICBnZW9tZXRyeToge1xuICAgICAgICB0eXBlOiBHRU9KU09OX1RZUEUuTElORV9TVFJJTkcsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0sIGV2ZW50Lm1hcENvb3Jkc11cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRlbnRhdGl2ZUZlYXR1cmUsXG4gICAgICBlZGl0SGFuZGxlc1xuICAgIH07XG4gIH07XG59XG4iXX0=