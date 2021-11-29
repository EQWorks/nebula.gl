"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("uuid/v1"));

var _constants = require("../constants");

var _baseMode = _interopRequireDefault(require("./base-mode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DrawPointMode extends _baseMode.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "handleClick", function (event, props) {
      var feature = {
        type: 'Feature',
        properties: {
          id: (0, _v.default)(),
          renderType: _constants.RENDER_TYPE.POINT
        },
        geometry: {
          type: _constants.GEOJSON_TYPE.POINT,
          coordinates: [event.mapCoords]
        }
      };
      var updatedData = props.data.addFeature(feature).getObject();
      props.onEdit({
        editType: _constants.EDIT_TYPE.ADD_FEATURE,
        updatedData: updatedData,
        editContext: null
      });
    });
  }

}

exports.default = DrawPointMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lZGl0LW1vZGVzL2RyYXctcG9pbnQtbW9kZS5qcyJdLCJuYW1lcyI6WyJEcmF3UG9pbnRNb2RlIiwiQmFzZU1vZGUiLCJldmVudCIsInByb3BzIiwiZmVhdHVyZSIsInR5cGUiLCJwcm9wZXJ0aWVzIiwiaWQiLCJyZW5kZXJUeXBlIiwiUkVOREVSX1RZUEUiLCJQT0lOVCIsImdlb21ldHJ5IiwiR0VPSlNPTl9UWVBFIiwiY29vcmRpbmF0ZXMiLCJtYXBDb29yZHMiLCJ1cGRhdGVkRGF0YSIsImRhdGEiLCJhZGRGZWF0dXJlIiwiZ2V0T2JqZWN0Iiwib25FZGl0IiwiZWRpdFR5cGUiLCJFRElUX1RZUEUiLCJBRERfRkVBVFVSRSIsImVkaXRDb250ZXh0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBS0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLGFBQU4sU0FBNEJDLGlCQUE1QixDQUFxQztBQUFBO0FBQUE7O0FBQUEseUNBQ3BDLFVBQUNDLEtBQUQsRUFBb0JDLEtBQXBCLEVBQTREO0FBQ3hFLFVBQU1DLE9BQU8sR0FBRztBQUNkQyxRQUFBQSxJQUFJLEVBQUUsU0FEUTtBQUVkQyxRQUFBQSxVQUFVLEVBQUU7QUFDVkMsVUFBQUEsRUFBRSxFQUFFLGlCQURNO0FBRVZDLFVBQUFBLFVBQVUsRUFBRUMsdUJBQVlDO0FBRmQsU0FGRTtBQU1kQyxRQUFBQSxRQUFRLEVBQUU7QUFDUk4sVUFBQUEsSUFBSSxFQUFFTyx3QkFBYUYsS0FEWDtBQUVSRyxVQUFBQSxXQUFXLEVBQUUsQ0FBQ1gsS0FBSyxDQUFDWSxTQUFQO0FBRkw7QUFOSSxPQUFoQjtBQVlBLFVBQU1DLFdBQVcsR0FBR1osS0FBSyxDQUFDYSxJQUFOLENBQVdDLFVBQVgsQ0FBc0JiLE9BQXRCLEVBQStCYyxTQUEvQixFQUFwQjtBQUVBZixNQUFBQSxLQUFLLENBQUNnQixNQUFOLENBQWE7QUFDWEMsUUFBQUEsUUFBUSxFQUFFQyxxQkFBVUMsV0FEVDtBQUVYUCxRQUFBQSxXQUFXLEVBQVhBLFdBRlc7QUFHWFEsUUFBQUEsV0FBVyxFQUFFO0FBSEYsT0FBYjtBQUtELEtBckJpRDtBQUFBOztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHV1aWQgZnJvbSAndXVpZC92MSc7XG5cbmltcG9ydCB0eXBlIHsgQ2xpY2tFdmVudCwgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtbmVidWxhLmdsLWVkaXQtbW9kZXMnO1xuaW1wb3J0IHR5cGUgeyBNb2RlUHJvcHMgfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7IEVESVRfVFlQRSwgR0VPSlNPTl9UWVBFLCBSRU5ERVJfVFlQRSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgQmFzZU1vZGUgZnJvbSAnLi9iYXNlLW1vZGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcmF3UG9pbnRNb2RlIGV4dGVuZHMgQmFzZU1vZGUge1xuICBoYW5kbGVDbGljayA9IChldmVudDogQ2xpY2tFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pID0+IHtcbiAgICBjb25zdCBmZWF0dXJlID0ge1xuICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBpZDogdXVpZCgpLFxuICAgICAgICByZW5kZXJUeXBlOiBSRU5ERVJfVFlQRS5QT0lOVFxuICAgICAgfSxcbiAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgIHR5cGU6IEdFT0pTT05fVFlQRS5QT0lOVCxcbiAgICAgICAgY29vcmRpbmF0ZXM6IFtldmVudC5tYXBDb29yZHNdXG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gcHJvcHMuZGF0YS5hZGRGZWF0dXJlKGZlYXR1cmUpLmdldE9iamVjdCgpO1xuXG4gICAgcHJvcHMub25FZGl0KHtcbiAgICAgIGVkaXRUeXBlOiBFRElUX1RZUEUuQUREX0ZFQVRVUkUsXG4gICAgICB1cGRhdGVkRGF0YSxcbiAgICAgIGVkaXRDb250ZXh0OiBudWxsXG4gICAgfSk7XG4gIH07XG59XG4iXX0=