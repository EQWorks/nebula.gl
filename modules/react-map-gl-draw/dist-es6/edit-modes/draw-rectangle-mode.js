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

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DrawRectangleMode extends _baseMode.default {
  constructor() {
    var _this;

    super(...arguments);
    _this = this;

    _defineProperty(this, "handleClick", function (event, props) {
      var data = props.data;

      var tentativeFeature = _this.getTentativeFeature(); // close rectangle and commit


      if (tentativeFeature) {
        // clear guides
        _this.setTentativeFeature(null);

        var coordinates = (0, _utils.updateRectanglePosition)(tentativeFeature, 2, event.mapCoords);

        if (!coordinates) {
          return;
        } // close rectangle


        coordinates = _toConsumableArray(coordinates).concat([coordinates[0]]);
        tentativeFeature = {
          type: 'Feature',
          properties: {
            // TODO deprecate id
            id: tentativeFeature.properties.id,
            renderType: _constants.RENDER_TYPE.RECTANGLE
          },
          geometry: {
            type: _constants.GEOJSON_TYPE.POLYGON,
            coordinates: [coordinates]
          }
        };
        var updatedData = data.addFeature(tentativeFeature).getObject(); // commit rectangle

        props.onEdit({
          editType: _constants.EDIT_TYPE.ADD_FEATURE,
          updatedData: updatedData,
          editContext: null
        });
      } else {
        // create a tentativeFeature
        tentativeFeature = {
          type: 'Feature',
          properties: {
            // TODO deprecate id
            id: (0, _v.default)(),
            renderType: _constants.RENDER_TYPE.RECTANGLE,
            guideType: _constants.GUIDE_TYPE.TENTATIVE
          },
          geometry: {
            type: 'LineString',
            coordinates: [event.mapCoords, event.mapCoords, event.mapCoords, event.mapCoords]
          }
        };

        _this.setTentativeFeature(tentativeFeature);
      }
    });

    _defineProperty(this, "getEditHandlesFromFeature", function (feature, featureIndex) {
      var coordinates = (0, _utils.getFeatureCoordinates)(feature);
      return coordinates && coordinates.map(function (coord, i) {
        return {
          type: 'Feature',
          properties: {
            // TODO remove renderType
            renderType: _constants.RENDER_TYPE.RECTANGLE,
            guideType: _constants.GUIDE_TYPE.CURSOR_EDIT_HANDLE,
            featureIndex: featureIndex,
            positionIndexes: [i]
          },
          geometry: {
            type: _constants.GEOJSON_TYPE.POINT,
            coordinates: [coord]
          }
        };
      });
    });

    _defineProperty(this, "getGuides", function (props) {
      var tentativeFeature = _this.getTentativeFeature();

      var coordinates = (0, _utils.getFeatureCoordinates)(tentativeFeature);

      if (!coordinates) {
        return null;
      }

      var event = props.lastPointerMoveEvent; // update tentative feature

      var newCoordinates = (0, _utils.updateRectanglePosition)(tentativeFeature, 2, event.mapCoords);
      tentativeFeature = {
        type: 'Feature',
        properties: {
          // TODO deprecate id and renderType
          id: (0, _v.default)(),
          guideType: _constants.GUIDE_TYPE.TENTATIVE,
          renderType: _constants.RENDER_TYPE.RECTANGLE
        },
        geometry: {
          type: _constants.GEOJSON_TYPE.LINE_STRING,
          coordinates: newCoordinates
        }
      };

      var editHandles = _this.getEditHandlesFromFeature(tentativeFeature);

      return {
        tentativeFeature: tentativeFeature,
        editHandles: editHandles
      };
    });
  }

}

exports.default = DrawRectangleMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lZGl0LW1vZGVzL2RyYXctcmVjdGFuZ2xlLW1vZGUuanMiXSwibmFtZXMiOlsiRHJhd1JlY3RhbmdsZU1vZGUiLCJCYXNlTW9kZSIsImV2ZW50IiwicHJvcHMiLCJkYXRhIiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJzZXRUZW50YXRpdmVGZWF0dXJlIiwiY29vcmRpbmF0ZXMiLCJtYXBDb29yZHMiLCJ0eXBlIiwicHJvcGVydGllcyIsImlkIiwicmVuZGVyVHlwZSIsIlJFTkRFUl9UWVBFIiwiUkVDVEFOR0xFIiwiZ2VvbWV0cnkiLCJHRU9KU09OX1RZUEUiLCJQT0xZR09OIiwidXBkYXRlZERhdGEiLCJhZGRGZWF0dXJlIiwiZ2V0T2JqZWN0Iiwib25FZGl0IiwiZWRpdFR5cGUiLCJFRElUX1RZUEUiLCJBRERfRkVBVFVSRSIsImVkaXRDb250ZXh0IiwiZ3VpZGVUeXBlIiwiR1VJREVfVFlQRSIsIlRFTlRBVElWRSIsImZlYXR1cmUiLCJmZWF0dXJlSW5kZXgiLCJtYXAiLCJjb29yZCIsImkiLCJDVVJTT1JfRURJVF9IQU5ETEUiLCJwb3NpdGlvbkluZGV4ZXMiLCJQT0lOVCIsImxhc3RQb2ludGVyTW92ZUV2ZW50IiwibmV3Q29vcmRpbmF0ZXMiLCJMSU5FX1NUUklORyIsImVkaXRIYW5kbGVzIiwiZ2V0RWRpdEhhbmRsZXNGcm9tRmVhdHVyZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUdBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7OztBQUVlLE1BQU1BLGlCQUFOLFNBQWdDQyxpQkFBaEMsQ0FBeUM7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUEseUNBQ3hDLFVBQUNDLEtBQUQsRUFBb0JDLEtBQXBCLEVBQTREO0FBQUEsVUFDaEVDLElBRGdFLEdBQ3ZERCxLQUR1RCxDQUNoRUMsSUFEZ0U7O0FBR3hFLFVBQUlDLGdCQUFnQixHQUFHLEtBQUksQ0FBQ0MsbUJBQUwsRUFBdkIsQ0FId0Us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dkI7O0FBQ0EsVUFBTUUsV0FBVyxHQUFHLGtDQUFzQkgsZ0JBQXRCLENBQXBCOztBQUVBLFVBQUksQ0FBQ0csV0FBTCxFQUFrQjtBQUNoQixlQUFPLElBQVA7QUFDRDs7QUFFRCxVQUFNTixLQUFLLEdBQUdDLEtBQUssQ0FBQ21DLG9CQUFwQixDQVJtRCxDQVNuRDs7QUFDQSxVQUFNQyxjQUFjLEdBQUcsb0NBQXdCbEMsZ0JBQXhCLEVBQTBDLENBQTFDLEVBQTZDSCxLQUFLLENBQUNPLFNBQW5ELENBQXZCO0FBRUFKLE1BQUFBLGdCQUFnQixHQUFHO0FBQ2pCSyxRQUFBQSxJQUFJLEVBQUUsU0FEVztBQUVqQkMsUUFBQUEsVUFBVSxFQUFFO0FBQ1Y7QUFDQUMsVUFBQUEsRUFBRSxFQUFFLGlCQUZNO0FBR1ZlLFVBQUFBLFNBQVMsRUFBRUMsc0JBQVdDLFNBSFo7QUFJVmhCLFVBQUFBLFVBQVUsRUFBRUMsdUJBQVlDO0FBSmQsU0FGSztBQVFqQkMsUUFBQUEsUUFBUSxFQUFFO0FBQ1JOLFVBQUFBLElBQUksRUFBRU8sd0JBQWF1QixXQURYO0FBRVJoQyxVQUFBQSxXQUFXLEVBQUUrQjtBQUZMO0FBUk8sT0FBbkI7O0FBY0EsVUFBTUUsV0FBVyxHQUFHLEtBQUksQ0FBQ0MseUJBQUwsQ0FBK0JyQyxnQkFBL0IsQ0FBcEI7O0FBRUEsYUFBTztBQUNMQSxRQUFBQSxnQkFBZ0IsRUFBaEJBLGdCQURLO0FBRUxvQyxRQUFBQSxXQUFXLEVBQVhBO0FBRkssT0FBUDtBQUlELEtBbkhxRDtBQUFBOztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUgeyBGZWF0dXJlLCBDbGlja0V2ZW50LCBGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1uZWJ1bGEuZ2wtZWRpdC1tb2Rlcyc7XG5pbXBvcnQgdXVpZCBmcm9tICd1dWlkL3YxJztcbmltcG9ydCB0eXBlIHsgTW9kZVByb3BzIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQgeyBFRElUX1RZUEUsIEdFT0pTT05fVFlQRSwgR1VJREVfVFlQRSwgUkVOREVSX1RZUEUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IEJhc2VNb2RlIGZyb20gJy4vYmFzZS1tb2RlJztcbmltcG9ydCB7IGdldEZlYXR1cmVDb29yZGluYXRlcywgdXBkYXRlUmVjdGFuZ2xlUG9zaXRpb24gfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJhd1JlY3RhbmdsZU1vZGUgZXh0ZW5kcyBCYXNlTW9kZSB7XG4gIGhhbmRsZUNsaWNrID0gKGV2ZW50OiBDbGlja0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikgPT4ge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gcHJvcHM7XG5cbiAgICBsZXQgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuXG4gICAgLy8gY2xvc2UgcmVjdGFuZ2xlIGFuZCBjb21taXRcbiAgICBpZiAodGVudGF0aXZlRmVhdHVyZSkge1xuICAgICAgLy8gY2xlYXIgZ3VpZGVzXG4gICAgICB0aGlzLnNldFRlbnRhdGl2ZUZlYXR1cmUobnVsbCk7XG5cbiAgICAgIGxldCBjb29yZGluYXRlcyA9IHVwZGF0ZVJlY3RhbmdsZVBvc2l0aW9uKHRlbnRhdGl2ZUZlYXR1cmUsIDIsIGV2ZW50Lm1hcENvb3Jkcyk7XG4gICAgICBpZiAoIWNvb3JkaW5hdGVzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gY2xvc2UgcmVjdGFuZ2xlXG4gICAgICBjb29yZGluYXRlcyA9IFsuLi5jb29yZGluYXRlcywgY29vcmRpbmF0ZXNbMF1dO1xuXG4gICAgICB0ZW50YXRpdmVGZWF0dXJlID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAvLyBUT0RPIGRlcHJlY2F0ZSBpZFxuICAgICAgICAgIGlkOiB0ZW50YXRpdmVGZWF0dXJlLnByb3BlcnRpZXMuaWQsXG4gICAgICAgICAgcmVuZGVyVHlwZTogUkVOREVSX1RZUEUuUkVDVEFOR0xFXG4gICAgICAgIH0sXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogR0VPSlNPTl9UWVBFLlBPTFlHT04sXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtjb29yZGluYXRlc11cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSBkYXRhLmFkZEZlYXR1cmUodGVudGF0aXZlRmVhdHVyZSkuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIC8vIGNvbW1pdCByZWN0YW5nbGVcbiAgICAgIHByb3BzLm9uRWRpdCh7XG4gICAgICAgIGVkaXRUeXBlOiBFRElUX1RZUEUuQUREX0ZFQVRVUkUsXG4gICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICBlZGl0Q29udGV4dDogbnVsbFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNyZWF0ZSBhIHRlbnRhdGl2ZUZlYXR1cmVcbiAgICAgIHRlbnRhdGl2ZUZlYXR1cmUgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIC8vIFRPRE8gZGVwcmVjYXRlIGlkXG4gICAgICAgICAgaWQ6IHV1aWQoKSxcbiAgICAgICAgICByZW5kZXJUeXBlOiBSRU5ERVJfVFlQRS5SRUNUQU5HTEUsXG4gICAgICAgICAgZ3VpZGVUeXBlOiBHVUlERV9UWVBFLlRFTlRBVElWRVxuICAgICAgICB9LFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJyxcbiAgICAgICAgICBjb29yZGluYXRlczogW2V2ZW50Lm1hcENvb3JkcywgZXZlbnQubWFwQ29vcmRzLCBldmVudC5tYXBDb29yZHMsIGV2ZW50Lm1hcENvb3Jkc11cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdGhpcy5zZXRUZW50YXRpdmVGZWF0dXJlKHRlbnRhdGl2ZUZlYXR1cmUpO1xuICAgIH1cbiAgfTtcblxuICBnZXRFZGl0SGFuZGxlc0Zyb21GZWF0dXJlID0gKGZlYXR1cmU6IEZlYXR1cmUsIGZlYXR1cmVJbmRleDogP251bWJlcikgPT4ge1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gZ2V0RmVhdHVyZUNvb3JkaW5hdGVzKGZlYXR1cmUpO1xuICAgIHJldHVybiAoXG4gICAgICBjb29yZGluYXRlcyAmJlxuICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yZCwgaSkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAvLyBUT0RPIHJlbW92ZSByZW5kZXJUeXBlXG4gICAgICAgICAgICByZW5kZXJUeXBlOiBSRU5ERVJfVFlQRS5SRUNUQU5HTEUsXG4gICAgICAgICAgICBndWlkZVR5cGU6IEdVSURFX1RZUEUuQ1VSU09SX0VESVRfSEFORExFLFxuICAgICAgICAgICAgZmVhdHVyZUluZGV4LFxuICAgICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBbaV1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgICB0eXBlOiBHRU9KU09OX1RZUEUuUE9JTlQsXG4gICAgICAgICAgICBjb29yZGluYXRlczogW2Nvb3JkXVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfTtcblxuICBnZXRHdWlkZXMgPSAocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pID0+IHtcbiAgICBsZXQgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gZ2V0RmVhdHVyZUNvb3JkaW5hdGVzKHRlbnRhdGl2ZUZlYXR1cmUpO1xuXG4gICAgaWYgKCFjb29yZGluYXRlcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZXZlbnQgPSBwcm9wcy5sYXN0UG9pbnRlck1vdmVFdmVudDtcbiAgICAvLyB1cGRhdGUgdGVudGF0aXZlIGZlYXR1cmVcbiAgICBjb25zdCBuZXdDb29yZGluYXRlcyA9IHVwZGF0ZVJlY3RhbmdsZVBvc2l0aW9uKHRlbnRhdGl2ZUZlYXR1cmUsIDIsIGV2ZW50Lm1hcENvb3Jkcyk7XG5cbiAgICB0ZW50YXRpdmVGZWF0dXJlID0ge1xuICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBUT0RPIGRlcHJlY2F0ZSBpZCBhbmQgcmVuZGVyVHlwZVxuICAgICAgICBpZDogdXVpZCgpLFxuICAgICAgICBndWlkZVR5cGU6IEdVSURFX1RZUEUuVEVOVEFUSVZFLFxuICAgICAgICByZW5kZXJUeXBlOiBSRU5ERVJfVFlQRS5SRUNUQU5HTEVcbiAgICAgIH0sXG4gICAgICBnZW9tZXRyeToge1xuICAgICAgICB0eXBlOiBHRU9KU09OX1RZUEUuTElORV9TVFJJTkcsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBuZXdDb29yZGluYXRlc1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBlZGl0SGFuZGxlcyA9IHRoaXMuZ2V0RWRpdEhhbmRsZXNGcm9tRmVhdHVyZSh0ZW50YXRpdmVGZWF0dXJlKTtcblxuICAgIHJldHVybiB7XG4gICAgICB0ZW50YXRpdmVGZWF0dXJlLFxuICAgICAgZWRpdEhhbmRsZXNcbiAgICB9O1xuICB9O1xufVxuIl19