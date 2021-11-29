"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("uuid/v1"));

var _constants = require("../constants");

var _utils = require("./utils");

var _baseMode = _interopRequireDefault(require("./base-mode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DrawPolygonMode extends _baseMode.default {
  constructor() {
    var _this;

    super(...arguments);
    _this = this;

    _defineProperty(this, "handleClick", function (event, props) {
      var picked = event.picks && event.picks[0];
      var data = props.data; // update tentative feature

      var tentativeFeature = _this.getTentativeFeature(); // add position to tentativeFeature
      // if click the first editHandle, commit tentativeFeature to featureCollection


      if (tentativeFeature) {
        var pickedObject = picked && picked.object; // clicked an editHandle of a tentative feature

        if (pickedObject && pickedObject.index === 0) {
          _this.setTentativeFeature(null); // append point to the tail, close the polygon


          var coordinates = (0, _utils.getFeatureCoordinates)(tentativeFeature);

          if (!coordinates) {
            return;
          }

          coordinates.push(coordinates[0]);
          tentativeFeature = {
            type: 'Feature',
            properties: {
              // TODO deprecate id
              id: tentativeFeature.properties.id,
              renderType: _constants.RENDER_TYPE.POLYGON
            },
            geometry: {
              type: _constants.GEOJSON_TYPE.POLYGON,
              coordinates: [coordinates]
            }
          };
          var updatedData = data.addFeature(tentativeFeature).getObject();
          props.onEdit({
            editType: _constants.EDIT_TYPE.ADD_FEATURE,
            updatedData: updatedData,
            editContext: null
          });
        } else {
          // update tentativeFeature
          tentativeFeature = _objectSpread({}, tentativeFeature, {
            geometry: {
              type: _constants.GEOJSON_TYPE.LINE_STRING,
              coordinates: _toConsumableArray(tentativeFeature.geometry.coordinates).concat([event.mapCoords])
            }
          });

          _this.setTentativeFeature(tentativeFeature);
        }
      } else {
        // create a tentativeFeature
        tentativeFeature = {
          type: 'Feature',
          properties: {
            // TODO deprecate id
            id: (0, _v.default)(),
            renderType: _constants.RENDER_TYPE.POLYGON,
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

    _defineProperty(this, "getGuides", function (props) {
      var tentativeFeature = _this.getTentativeFeature();

      var coordinates = (0, _utils.getFeatureCoordinates)(tentativeFeature);

      if (!coordinates) {
        return null;
      }

      var event = props.lastPointerMoveEvent; // existing editHandles + cursorEditHandle

      var editHandles = _this.getEditHandlesFromFeature(tentativeFeature) || [];
      var cursorEditHandle = {
        type: 'Feature',
        properties: {
          guideType: _constants.GUIDE_TYPE.CURSOR_EDIT_HANDLE,
          // TODO remove renderType
          renderType: _constants.RENDER_TYPE.POLYGON,
          positionIndexes: [editHandles.length]
        },
        geometry: {
          type: _constants.GEOJSON_TYPE.POINT,
          coordinates: [event.mapCoords]
        }
      };
      editHandles.push(cursorEditHandle); // tentativeFeature

      tentativeFeature = _objectSpread({}, tentativeFeature, {
        geometry: {
          type: _constants.GEOJSON_TYPE.LINE_STRING,
          coordinates: _toConsumableArray(coordinates).concat([event.mapCoords])
        }
      });
      return {
        tentativeFeature: tentativeFeature,
        editHandles: editHandles
      };
    });
  }

}

exports.default = DrawPolygonMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lZGl0LW1vZGVzL2RyYXctcG9seWdvbi1tb2RlLmpzIl0sIm5hbWVzIjpbIkRyYXdQb2x5Z29uTW9kZSIsIkJhc2VNb2RlIiwiZXZlbnQiLCJwcm9wcyIsInBpY2tlZCIsInBpY2tzIiwiZGF0YSIsInRlbnRhdGl2ZUZlYXR1cmUiLCJnZXRUZW50YXRpdmVGZWF0dXJlIiwicGlja2VkT2JqZWN0Iiwib2JqZWN0IiwiaW5kZXgiLCJzZXRUZW50YXRpdmVGZWF0dXJlIiwiY29vcmRpbmF0ZXMiLCJwdXNoIiwidHlwZSIsInByb3BlcnRpZXMiLCJpZCIsInJlbmRlclR5cGUiLCJSRU5ERVJfVFlQRSIsIlBPTFlHT04iLCJnZW9tZXRyeSIsIkdFT0pTT05fVFlQRSIsInVwZGF0ZWREYXRhIiwiYWRkRmVhdHVyZSIsImdldE9iamVjdCIsIm9uRWRpdCIsImVkaXRUeXBlIiwiRURJVF9UWVBFIiwiQUREX0ZFQVRVUkUiLCJlZGl0Q29udGV4dCIsIkxJTkVfU1RSSU5HIiwibWFwQ29vcmRzIiwiZ3VpZGVUeXBlIiwiR1VJREVfVFlQRSIsIlRFTlRBVElWRSIsIlBPSU5UIiwibGFzdFBvaW50ZXJNb3ZlRXZlbnQiLCJlZGl0SGFuZGxlcyIsImdldEVkaXRIYW5kbGVzRnJvbUZlYXR1cmUiLCJjdXJzb3JFZGl0SGFuZGxlIiwiQ1VSU09SX0VESVRfSEFORExFIiwicG9zaXRpb25JbmRleGVzIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBR0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSxlQUFOLFNBQThCQyxpQkFBOUIsQ0FBdUM7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUEseUNBQ3RDLFVBQUNDLEtBQUQsRUFBb0JDLEtBQXBCLEVBQTREO0FBQ3hFLFVBQU1DLE1BQU0sR0FBR0YsS0FBSyxDQUFDRyxLQUFOLElBQWVILEtBQUssQ0FBQ0csS0FBTixDQUFZLENBQVosQ0FBOUI7QUFEd0UsVUFFaEVD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VUFBTUMsV0FBVyxHQUFHLEtBQUksQ0FBQ0MseUJBQUwsQ0FBK0JoQyxnQkFBL0IsS0FBb0QsRUFBeEU7QUFDQSxVQUFNaUMsZ0JBQWdCLEdBQUc7QUFDdkJ6QixRQUFBQSxJQUFJLEVBQUUsU0FEaUI7QUFFdkJDLFFBQUFBLFVBQVUsRUFBRTtBQUNWaUIsVUFBQUEsU0FBUyxFQUFFQyxzQkFBV08sa0JBRFo7QUFFVjtBQUNBdkIsVUFBQUEsVUFBVSxFQUFFQyx1QkFBWUMsT0FIZDtBQUlWc0IsVUFBQUEsZUFBZSxFQUFFLENBQUNKLFdBQVcsQ0FBQ0ssTUFBYjtBQUpQLFNBRlc7QUFRdkJ0QixRQUFBQSxRQUFRLEVBQUU7QUFDUk4sVUFBQUEsSUFBSSxFQUFFTyx3QkFBYWMsS0FEWDtBQUVSdkIsVUFBQUEsV0FBVyxFQUFFLENBQUNYLEtBQUssQ0FBQzhCLFNBQVA7QUFGTDtBQVJhLE9BQXpCO0FBYUFNLE1BQUFBLFdBQVcsQ0FBQ3hCLElBQVosQ0FBaUIwQixnQkFBakIsRUF6Qm1ELENBMkJuRDs7QUFDQWpDLE1BQUFBLGdCQUFnQixxQkFDWEEsZ0JBRFc7QUFFZGMsUUFBQUEsUUFBUSxFQUFFO0FBQ1JOLFVBQUFBLElBQUksRUFBRU8sd0JBQWFTLFdBRFg7QUFFUmxCLFVBQUFBLFdBQVcscUJBQU1BLFdBQU4sVUFBbUJYLEtBQUssQ0FBQzhCLFNBQXpCO0FBRkg7QUFGSSxRQUFoQjtBQVFBLGFBQU87QUFDTHpCLFFBQUFBLGdCQUFnQixFQUFoQkEsZ0JBREs7QUFFTCtCLFFBQUFBLFdBQVcsRUFBWEE7QUFGSyxPQUFQO0FBSUQsS0FuSG1EO0FBQUE7O0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IHR5cGUgeyBDbGlja0V2ZW50LCBGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1uZWJ1bGEuZ2wtZWRpdC1tb2Rlcyc7XG5pbXBvcnQgdXVpZCBmcm9tICd1dWlkL3YxJztcblxuaW1wb3J0IHR5cGUgeyBNb2RlUHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBFRElUX1RZUEUsIEdFT0pTT05fVFlQRSwgR1VJREVfVFlQRSwgUkVOREVSX1RZUEUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgZ2V0RmVhdHVyZUNvb3JkaW5hdGVzIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgQmFzZU1vZGUgZnJvbSAnLi9iYXNlLW1vZGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcmF3UG9seWdvbk1vZGUgZXh0ZW5kcyBCYXNlTW9kZSB7XG4gIGhhbmRsZUNsaWNrID0gKGV2ZW50OiBDbGlja0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikgPT4ge1xuICAgIGNvbnN0IHBpY2tlZCA9IGV2ZW50LnBpY2tzICYmIGV2ZW50LnBpY2tzWzBdO1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gcHJvcHM7XG5cbiAgICAvLyB1cGRhdGUgdGVudGF0aXZlIGZlYXR1cmVcbiAgICBsZXQgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuXG4gICAgLy8gYWRkIHBvc2l0aW9uIHRvIHRlbnRhdGl2ZUZlYXR1cmVcbiAgICAvLyBpZiBjbGljayB0aGUgZmlyc3QgZWRpdEhhbmRsZSwgY29tbWl0IHRlbnRhdGl2ZUZlYXR1cmUgdG8gZmVhdHVyZUNvbGxlY3Rpb25cbiAgICBpZiAodGVudGF0aXZlRmVhdHVyZSkge1xuICAgICAgY29uc3QgcGlja2VkT2JqZWN0ID0gcGlja2VkICYmIHBpY2tlZC5vYmplY3Q7XG4gICAgICAvLyBjbGlja2VkIGFuIGVkaXRIYW5kbGUgb2YgYSB0ZW50YXRpdmUgZmVhdHVyZVxuICAgICAgaWYgKHBpY2tlZE9iamVjdCAmJiBwaWNrZWRPYmplY3QuaW5kZXggPT09IDApIHtcbiAgICAgICAgdGhpcy5zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuXG4gICAgICAgIC8vIGFwcGVuZCBwb2ludCB0byB0aGUgdGFpbCwgY2xvc2UgdGhlIHBvbHlnb25cbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSBnZXRGZWF0dXJlQ29vcmRpbmF0ZXModGVudGF0aXZlRmVhdHVyZSk7XG4gICAgICAgIGlmICghY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb29yZGluYXRlcy5wdXNoKGNvb3JkaW5hdGVzWzBdKTtcblxuICAgICAgICB0ZW50YXRpdmVGZWF0dXJlID0ge1xuICAgICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAvLyBUT0RPIGRlcHJlY2F0ZSBpZFxuICAgICAgICAgICAgaWQ6IHRlbnRhdGl2ZUZlYXR1cmUucHJvcGVydGllcy5pZCxcbiAgICAgICAgICAgIHJlbmRlclR5cGU6IFJFTkRFUl9UWVBFLlBPTFlHT05cbiAgICAgICAgICB9LFxuICAgICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgICB0eXBlOiBHRU9KU09OX1RZUEUuUE9MWUdPTixcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBbY29vcmRpbmF0ZXNdXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gZGF0YS5hZGRGZWF0dXJlKHRlbnRhdGl2ZUZlYXR1cmUpLmdldE9iamVjdCgpO1xuXG4gICAgICAgIHByb3BzLm9uRWRpdCh7XG4gICAgICAgICAgZWRpdFR5cGU6IEVESVRfVFlQRS5BRERfRkVBVFVSRSxcbiAgICAgICAgICB1cGRhdGVkRGF0YSxcbiAgICAgICAgICBlZGl0Q29udGV4dDogbnVsbFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHVwZGF0ZSB0ZW50YXRpdmVGZWF0dXJlXG4gICAgICAgIHRlbnRhdGl2ZUZlYXR1cmUgPSB7XG4gICAgICAgICAgLi4udGVudGF0aXZlRmVhdHVyZSxcbiAgICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgICAgdHlwZTogR0VPSlNPTl9UWVBFLkxJTkVfU1RSSU5HLFxuICAgICAgICAgICAgY29vcmRpbmF0ZXM6IFsuLi50ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzLCBldmVudC5tYXBDb29yZHNdXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldFRlbnRhdGl2ZUZlYXR1cmUodGVudGF0aXZlRmVhdHVyZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNyZWF0ZSBhIHRlbnRhdGl2ZUZlYXR1cmVcbiAgICAgIHRlbnRhdGl2ZUZlYXR1cmUgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIC8vIFRPRE8gZGVwcmVjYXRlIGlkXG4gICAgICAgICAgaWQ6IHV1aWQoKSxcbiAgICAgICAgICByZW5kZXJUeXBlOiBSRU5ERVJfVFlQRS5QT0xZR09OLFxuICAgICAgICAgIGd1aWRlVHlwZTogR1VJREVfVFlQRS5URU5UQVRJVkVcbiAgICAgICAgfSxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiBHRU9KU09OX1RZUEUuUE9JTlQsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtldmVudC5tYXBDb29yZHNdXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHRoaXMuc2V0VGVudGF0aXZlRmVhdHVyZSh0ZW50YXRpdmVGZWF0dXJlKTtcbiAgICB9XG4gIH07XG5cbiAgZ2V0R3VpZGVzID0gKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSA9PiB7XG4gICAgbGV0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IGdldEZlYXR1cmVDb29yZGluYXRlcyh0ZW50YXRpdmVGZWF0dXJlKTtcblxuICAgIGlmICghY29vcmRpbmF0ZXMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50ID0gcHJvcHMubGFzdFBvaW50ZXJNb3ZlRXZlbnQ7XG5cbiAgICAvLyBleGlzdGluZyBlZGl0SGFuZGxlcyArIGN1cnNvckVkaXRIYW5kbGVcbiAgICBjb25zdCBlZGl0SGFuZGxlcyA9IHRoaXMuZ2V0RWRpdEhhbmRsZXNGcm9tRmVhdHVyZSh0ZW50YXRpdmVGZWF0dXJlKSB8fCBbXTtcbiAgICBjb25zdCBjdXJzb3JFZGl0SGFuZGxlID0ge1xuICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBndWlkZVR5cGU6IEdVSURFX1RZUEUuQ1VSU09SX0VESVRfSEFORExFLFxuICAgICAgICAvLyBUT0RPIHJlbW92ZSByZW5kZXJUeXBlXG4gICAgICAgIHJlbmRlclR5cGU6IFJFTkRFUl9UWVBFLlBPTFlHT04sXG4gICAgICAgIHBvc2l0aW9uSW5kZXhlczogW2VkaXRIYW5kbGVzLmxlbmd0aF1cbiAgICAgIH0sXG4gICAgICBnZW9tZXRyeToge1xuICAgICAgICB0eXBlOiBHRU9KU09OX1RZUEUuUE9JTlQsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbZXZlbnQubWFwQ29vcmRzXVxuICAgICAgfVxuICAgIH07XG4gICAgZWRpdEhhbmRsZXMucHVzaChjdXJzb3JFZGl0SGFuZGxlKTtcblxuICAgIC8vIHRlbnRhdGl2ZUZlYXR1cmVcbiAgICB0ZW50YXRpdmVGZWF0dXJlID0ge1xuICAgICAgLi4udGVudGF0aXZlRmVhdHVyZSxcbiAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgIHR5cGU6IEdFT0pTT05fVFlQRS5MSU5FX1NUUklORyxcbiAgICAgICAgY29vcmRpbmF0ZXM6IFsuLi5jb29yZGluYXRlcywgZXZlbnQubWFwQ29vcmRzXVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgdGVudGF0aXZlRmVhdHVyZSxcbiAgICAgIGVkaXRIYW5kbGVzXG4gICAgfTtcbiAgfTtcbn1cbiJdfQ==