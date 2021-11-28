"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElevationHandler = void 0;

var _modeHandler = require("./mode-handler.js");

var _modifyHandler = require("./modify-handler.js");

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

function defaultCalculateElevationChange(_ref) {
  var pointerDownScreenCoords = _ref.pointerDownScreenCoords,
      screenCoords = _ref.screenCoords;
  return 10 * (pointerDownScreenCoords[1] - screenCoords[1]);
}

var ElevationHandler =
/*#__PURE__*/
function (_ModifyHandler) {
  _inherits(ElevationHandler, _ModifyHandler);

  function ElevationHandler() {
    _classCallCheck(this, ElevationHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(ElevationHandler).apply(this, arguments));
  }

  _createClass(ElevationHandler, [{
    key: "makeElevatedEvent",
    value: function makeElevatedEvent(event, position) {
      if (!event.pointerDownScreenCoords) {
        return event;
      }

      var _ref2 = this._modeConfig || {},
          _ref2$minElevation = _ref2.minElevation,
          minElevation = _ref2$minElevation === void 0 ? 0 : _ref2$minElevation,
          _ref2$maxElevation = _ref2.maxElevation,
          maxElevation = _ref2$maxElevation === void 0 ? 20000 : _ref2$maxElevation,
          _ref2$calculateElevat = _ref2.calculateElevationChange,
          calculateElevationChange = _ref2$calculateElevat === void 0 ? defaultCalculateElevationChange : _ref2$calculateElevat; // $FlowFixMe - really, I know it has something at index 2


      var elevation = position.length === 3 ? position[2] : 0; // calculateElevationChange is configurable becase (at this time) modes are not aware of the viewport

      elevation += calculateElevationChange({
        pointerDownScreenCoords: event.pointerDownScreenCoords,
        screenCoords: event.screenCoords
      });
      elevation = Math.min(elevation, maxElevation);
      elevation = Math.max(elevation, minElevation);
      return Object.assign({}, event, {
        groundCoords: [position[0], position[1], elevation]
      });
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      var editHandle = (0, _modeHandler.getPickedEditHandle)(event.pointerDownPicks);
      var position = editHandle ? editHandle.position : event.groundCoords;
      return _get(_getPrototypeOf(ElevationHandler.prototype), "handlePointerMove", this).call(this, this.makeElevatedEvent(event, position));
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event) {
      var editHandle = (0, _modeHandler.getPickedEditHandle)(event.picks);
      var position = editHandle ? editHandle.position : event.groundCoords;
      return _get(_getPrototypeOf(ElevationHandler.prototype), "handleStopDragging", this).call(this, this.makeElevatedEvent(event, position));
    }
  }, {
    key: "getCursor",
    value: function getCursor(params) {
      var cursor = _get(_getPrototypeOf(ElevationHandler.prototype), "getCursor", this).call(this, params);

      if (cursor === 'cell') {
        cursor = 'ns-resize';
      }

      return cursor;
    }
  }], [{
    key: "calculateElevationChangeWithViewport",
    value: function calculateElevationChangeWithViewport(viewport, _ref3) {
      var pointerDownScreenCoords = _ref3.pointerDownScreenCoords,
          screenCoords = _ref3.screenCoords;
      // Source: https://gis.stackexchange.com/a/127949/111804
      var metersPerPixel = 156543.03392 * Math.cos(viewport.latitude * Math.PI / 180) / Math.pow(2, viewport.zoom);
      return metersPerPixel * (pointerDownScreenCoords[1] - screenCoords[1]) / 2;
    }
  }]);

  return ElevationHandler;
}(_modifyHandler.ModifyHandler);

exports.ElevationHandler = ElevationHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2VsZXZhdGlvbi1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRDYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UiLCJwb2ludGVyRG93blNjcmVlbkNvb3JkcyIsInNjcmVlbkNvb3JkcyIsIkVsZXZhdGlvbkhhbmRsZXIiLCJldmVudCIsInBvc2l0aW9uIiwiX21vZGVDb25maWciLCJtaW5FbGV2YXRpb24iLCJtYXhFbGV2YXRpb24iLCJjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UiLCJlbGV2YXRpb24iLCJsZW5ndGgiLCJNYXRoIiwibWluIiwibWF4IiwiT2JqZWN0IiwiYXNzaWduIiwiZ3JvdW5kQ29vcmRzIiwiZWRpdEhhbmRsZSIsInBvaW50ZXJEb3duUGlja3MiLCJtYWtlRWxldmF0ZWRFdmVudCIsInBpY2tzIiwicGFyYW1zIiwiY3Vyc29yIiwidmlld3BvcnQiLCJtZXRlcnNQZXJQaXhlbCIsImNvcyIsImxhdGl0dWRlIiwiUEkiLCJwb3ciLCJ6b29tIiwiTW9kaWZ5SGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUtBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxTQUFTQSwrQkFBVCxPQU1HO0FBQUEsTUFMREMsdUJBS0MsUUFMREEsdUJBS0M7QUFBQSxNQUpEQyxZQUlDLFFBSkRBLFlBSUM7QUFDRCxTQUFPLE1BQU1ELHVCQUF1QixDQUFDLENBQUQsQ0FBdkIsR0FBNkJDLFlBQVksQ0FBQyxDQUFELENBQS9DLENBQVA7QUFDRDs7SUFFWUMsZ0I7Ozs7Ozs7Ozs7Ozs7c0NBQ09DLEssRUFBNkNDLFEsRUFBNEI7QUFDekYsVUFBSSxDQUFDRCxLQUFLLENBQUNILHVCQUFYLEVBQW9DO0FBQ2xDLGVBQU9HLEtBQVA7QUFDRDs7QUFId0Ysa0JBVXZGLEtBQUtFLFdBQUwsSUFBb0IsRUFWbUU7QUFBQSxxQ0FNdkZDLFlBTnVGO0FBQUEsVUFNdkZBLFlBTnVGLG1DQU14RSxDQU53RTtBQUFBLHFDQU92RkMsWUFQdUY7QUFBQSxVQU92RkEsWUFQdUYsbUNBT3hFLEtBUHdFO0FBQUEsd0NBUXZGQyx3QkFSdUY7QUFBQSxVQVF2RkEsd0JBUnVGLHNDQVE1RFQsK0JBUjRELDBCQVl6Rjs7O0FBQ0EsVUFBSVUsU0FBUyxHQUFHTCxRQUFRLENBQUNNLE1BQVQsS0FBb0IsQ0FBcEIsR0FBd0JOLFFBQVEsQ0FBQyxDQUFELENBQWhDLEdBQXNDLENBQXRELENBYnlGLENBZXpGOztBQUNBSyxNQUFBQSxTQUFTLElBQUlELHdCQUF3QixDQUFDO0FBQ3BDUixRQUFBQSx1QkFBdUIsRUFBRUcsS0FBSyxDQUFDSCx1QkFESztBQUVwQ0MsUUFBQUEsWUFBWSxFQUFFRSxLQUFLLENBQUNGO0FBRmdCLE9BQUQsQ0FBckM7QUFJQVEsTUFBQUEsU0FBUyxHQUFHRSxJQUFJLENBQUNDLEdBQUwsQ0FBU0gsU0FBVCxFQUFvQkYsWUFBcEIsQ0FBWjtBQUNBRSxNQUFBQSxTQUFTLEdBQUdFLElBQUksQ0FBQ0UsR0FBTCxDQUFTSixTQUFULEVBQW9CSCxZQUFwQixDQUFaO0FBRUEsYUFBT1EsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQlosS0FBbEIsRUFBeUI7QUFDOUJhLFFBQUFBLFlBQVksRUFBRSxDQUFDWixRQUFRLENBQUMsQ0FBRCxDQUFULEVBQWNBLFFBQVEsQ0FBQyxDQUFELENBQXRCLEVBQTJCSyxTQUEzQjtBQURnQixPQUF6QixDQUFQO0FBR0Q7OztzQ0FFaUJOLEssRUFBNkU7QUFDN0YsVUFBTWMsVUFBVSxHQUFHLHNDQUFvQmQsS0FBSyxDQUFDZSxnQkFBMUIsQ0FBbkI7QUFDQSxVQUFNZCxRQUFRLEdBQUdhLFVBQVUsR0FBR0EsVUFBVSxDQUFDYixRQUFkLEdBQXlCRCxLQUFLLENBQUNhLFlBQTFEO0FBQ0EscUdBQStCLEtBQUtHLGlCQUFMLENBQXVCaEIsS0FBdkIsRUFBOEJDLFFBQTlCLENBQS9CO0FBQ0Q7Ozt1Q0FFa0JELEssRUFBdUM7QUFDeEQsVUFBTWMsVUFBVSxHQUFHLHNDQUFvQmQsS0FBSyxDQUFDaUIsS0FBMUIsQ0FBbkI7QUFDQSxVQUFNaEIsUUFBUSxHQUFHYSxVQUFVLEdBQUdBLFVBQVUsQ0FBQ2IsUUFBZCxHQUF5QkQsS0FBSyxDQUFDYSxZQUExRDtBQUNBLHNHQUFnQyxLQUFLRyxpQkFBTCxDQUF1QmhCLEtBQXZCLEVBQThCQyxRQUE5QixDQUFoQztBQUNEOzs7OEJBRVNpQixNLEVBQXlDO0FBQ2pELFVBQUlDLE1BQU0sbUZBQW1CRCxNQUFuQixDQUFWOztBQUNBLFVBQUlDLE1BQU0sS0FBSyxNQUFmLEVBQXVCO0FBQ3JCQSxRQUFBQSxNQUFNLEdBQUcsV0FBVDtBQUNEOztBQUNELGFBQU9BLE1BQVA7QUFDRDs7O3lEQUdDQyxRLFNBUVE7QUFBQSxVQU5OdkIsdUJBTU0sU0FOTkEsdUJBTU07QUFBQSxVQUxOQyxZQUtNLFNBTE5BLFlBS007QUFDUjtBQUNBLFVBQU11QixjQUFjLEdBQ2pCLGVBQWViLElBQUksQ0FBQ2MsR0FBTCxDQUFVRixRQUFRLENBQUNHLFFBQVQsR0FBb0JmLElBQUksQ0FBQ2dCLEVBQTFCLEdBQWdDLEdBQXpDLENBQWhCLEdBQWlFaEIsSUFBSSxDQUFDaUIsR0FBTCxDQUFTLENBQVQsRUFBWUwsUUFBUSxDQUFDTSxJQUFyQixDQURuRTtBQUdBLGFBQVFMLGNBQWMsSUFBSXhCLHVCQUF1QixDQUFDLENBQUQsQ0FBdkIsR0FBNkJDLFlBQVksQ0FBQyxDQUFELENBQTdDLENBQWYsR0FBb0UsQ0FBM0U7QUFDRDs7OztFQWhFbUM2Qiw0QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB0eXBlIHsgUG9zaXRpb24gfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHR5cGUgeyBQb2ludGVyTW92ZUV2ZW50LCBTdG9wRHJhZ2dpbmdFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgRWRpdEFjdGlvbiB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IGdldFBpY2tlZEVkaXRIYW5kbGUgfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBNb2RpZnlIYW5kbGVyIH0gZnJvbSAnLi9tb2RpZnktaGFuZGxlci5qcyc7XG5cbmZ1bmN0aW9uIGRlZmF1bHRDYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2Uoe1xuICBwb2ludGVyRG93blNjcmVlbkNvb3JkcyxcbiAgc2NyZWVuQ29vcmRzXG59OiB7XG4gIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBQb3NpdGlvbixcbiAgc2NyZWVuQ29vcmRzOiBQb3NpdGlvblxufSkge1xuICByZXR1cm4gMTAgKiAocG9pbnRlckRvd25TY3JlZW5Db29yZHNbMV0gLSBzY3JlZW5Db29yZHNbMV0pO1xufVxuXG5leHBvcnQgY2xhc3MgRWxldmF0aW9uSGFuZGxlciBleHRlbmRzIE1vZGlmeUhhbmRsZXIge1xuICBtYWtlRWxldmF0ZWRFdmVudChldmVudDogUG9pbnRlck1vdmVFdmVudCB8IFN0b3BEcmFnZ2luZ0V2ZW50LCBwb3NpdGlvbjogUG9zaXRpb24pOiBPYmplY3Qge1xuICAgIGlmICghZXZlbnQucG9pbnRlckRvd25TY3JlZW5Db29yZHMpIHtcbiAgICAgIHJldHVybiBldmVudDtcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBtaW5FbGV2YXRpb24gPSAwLFxuICAgICAgbWF4RWxldmF0aW9uID0gMjAwMDAsXG4gICAgICBjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UgPSBkZWZhdWx0Q2FsY3VsYXRlRWxldmF0aW9uQ2hhbmdlXG4gICAgfSA9XG4gICAgICB0aGlzLl9tb2RlQ29uZmlnIHx8IHt9O1xuXG4gICAgLy8gJEZsb3dGaXhNZSAtIHJlYWxseSwgSSBrbm93IGl0IGhhcyBzb21ldGhpbmcgYXQgaW5kZXggMlxuICAgIGxldCBlbGV2YXRpb24gPSBwb3NpdGlvbi5sZW5ndGggPT09IDMgPyBwb3NpdGlvblsyXSA6IDA7XG5cbiAgICAvLyBjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UgaXMgY29uZmlndXJhYmxlIGJlY2FzZSAoYXQgdGhpcyB0aW1lKSBtb2RlcyBhcmUgbm90IGF3YXJlIG9mIHRoZSB2aWV3cG9ydFxuICAgIGVsZXZhdGlvbiArPSBjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2Uoe1xuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IGV2ZW50LnBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgc2NyZWVuQ29vcmRzOiBldmVudC5zY3JlZW5Db29yZHNcbiAgICB9KTtcbiAgICBlbGV2YXRpb24gPSBNYXRoLm1pbihlbGV2YXRpb24sIG1heEVsZXZhdGlvbik7XG4gICAgZWxldmF0aW9uID0gTWF0aC5tYXgoZWxldmF0aW9uLCBtaW5FbGV2YXRpb24pO1xuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LCB7XG4gICAgICBncm91bmRDb29yZHM6IFtwb3NpdGlvblswXSwgcG9zaXRpb25bMV0sIGVsZXZhdGlvbl1cbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KTogeyBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBvaW50ZXJEb3duUGlja3MpO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gZWRpdEhhbmRsZSA/IGVkaXRIYW5kbGUucG9zaXRpb24gOiBldmVudC5ncm91bmRDb29yZHM7XG4gICAgcmV0dXJuIHN1cGVyLmhhbmRsZVBvaW50ZXJNb3ZlKHRoaXMubWFrZUVsZXZhdGVkRXZlbnQoZXZlbnQsIHBvc2l0aW9uKSk7XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBpY2tzKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGVkaXRIYW5kbGUgPyBlZGl0SGFuZGxlLnBvc2l0aW9uIDogZXZlbnQuZ3JvdW5kQ29vcmRzO1xuICAgIHJldHVybiBzdXBlci5oYW5kbGVTdG9wRHJhZ2dpbmcodGhpcy5tYWtlRWxldmF0ZWRFdmVudChldmVudCwgcG9zaXRpb24pKTtcbiAgfVxuXG4gIGdldEN1cnNvcihwYXJhbXM6IHsgaXNEcmFnZ2luZzogYm9vbGVhbiB9KTogc3RyaW5nIHtcbiAgICBsZXQgY3Vyc29yID0gc3VwZXIuZ2V0Q3Vyc29yKHBhcmFtcyk7XG4gICAgaWYgKGN1cnNvciA9PT0gJ2NlbGwnKSB7XG4gICAgICBjdXJzb3IgPSAnbnMtcmVzaXplJztcbiAgICB9XG4gICAgcmV0dXJuIGN1cnNvcjtcbiAgfVxuXG4gIHN0YXRpYyBjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2VXaXRoVmlld3BvcnQoXG4gICAgdmlld3BvcnQ6IGFueSxcbiAgICB7XG4gICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkcyxcbiAgICAgIHNjcmVlbkNvb3Jkc1xuICAgIH06IHtcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBQb3NpdGlvbixcbiAgICAgIHNjcmVlbkNvb3JkczogUG9zaXRpb25cbiAgICB9XG4gICk6IG51bWJlciB7XG4gICAgLy8gU291cmNlOiBodHRwczovL2dpcy5zdGFja2V4Y2hhbmdlLmNvbS9hLzEyNzk0OS8xMTE4MDRcbiAgICBjb25zdCBtZXRlcnNQZXJQaXhlbCA9XG4gICAgICAoMTU2NTQzLjAzMzkyICogTWF0aC5jb3MoKHZpZXdwb3J0LmxhdGl0dWRlICogTWF0aC5QSSkgLyAxODApKSAvIE1hdGgucG93KDIsIHZpZXdwb3J0Lnpvb20pO1xuXG4gICAgcmV0dXJuIChtZXRlcnNQZXJQaXhlbCAqIChwb2ludGVyRG93blNjcmVlbkNvb3Jkc1sxXSAtIHNjcmVlbkNvb3Jkc1sxXSkpIC8gMjtcbiAgfVxufVxuIl19