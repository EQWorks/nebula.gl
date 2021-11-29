"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElevationHandler = void 0;

var _modeHandler = require("./mode-handler.js");

var _modifyHandler = require("./modify-handler.js");

function defaultCalculateElevationChange(_ref) {
  var pointerDownScreenCoords = _ref.pointerDownScreenCoords,
      screenCoords = _ref.screenCoords;
  return 10 * (pointerDownScreenCoords[1] - screenCoords[1]);
} // TODO edit-modes: delete handlers once EditMode fully implemented


class ElevationHandler extends _modifyHandler.ModifyHandler {
  makeElevatedEvent(event, position) {
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

  handlePointerMove(event) {
    var editHandle = (0, _modeHandler.getPickedEditHandle)(event.pointerDownPicks);
    var position = editHandle ? editHandle.position : event.groundCoords;
    return super.handlePointerMove(this.makeElevatedEvent(event, position));
  }

  handleStopDragging(event) {
    var editHandle = (0, _modeHandler.getPickedEditHandle)(event.picks);
    var position = editHandle ? editHandle.position : event.groundCoords;
    return super.handleStopDragging(this.makeElevatedEvent(event, position));
  }

  getCursor(params) {
    var cursor = super.getCursor(params);

    if (cursor === 'cell') {
      cursor = 'ns-resize';
    }

    return cursor;
  }

  static calculateElevationChangeWithViewport(viewport, _ref3) {
    var pointerDownScreenCoords = _ref3.pointerDownScreenCoords,
        screenCoords = _ref3.screenCoords;
    // Source: https://gis.stackexchange.com/a/127949/111804
    var metersPerPixel = 156543.03392 * Math.cos(viewport.latitude * Math.PI / 180) / Math.pow(2, viewport.zoom);
    return metersPerPixel * (pointerDownScreenCoords[1] - screenCoords[1]) / 2;
  }

}

exports.ElevationHandler = ElevationHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2VsZXZhdGlvbi1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRDYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UiLCJwb2ludGVyRG93blNjcmVlbkNvb3JkcyIsInNjcmVlbkNvb3JkcyIsIkVsZXZhdGlvbkhhbmRsZXIiLCJNb2RpZnlIYW5kbGVyIiwibWFrZUVsZXZhdGVkRXZlbnQiLCJldmVudCIsInBvc2l0aW9uIiwiX21vZGVDb25maWciLCJtaW5FbGV2YXRpb24iLCJtYXhFbGV2YXRpb24iLCJjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UiLCJlbGV2YXRpb24iLCJsZW5ndGgiLCJNYXRoIiwibWluIiwibWF4IiwiT2JqZWN0IiwiYXNzaWduIiwiZ3JvdW5kQ29vcmRzIiwiaGFuZGxlUG9pbnRlck1vdmUiLCJlZGl0SGFuZGxlIiwicG9pbnRlckRvd25QaWNrcyIsImhhbmRsZVN0b3BEcmFnZ2luZyIsInBpY2tzIiwiZ2V0Q3Vyc29yIiwicGFyYW1zIiwiY3Vyc29yIiwiY2FsY3VsYXRlRWxldmF0aW9uQ2hhbmdlV2l0aFZpZXdwb3J0Iiwidmlld3BvcnQiLCJtZXRlcnNQZXJQaXhlbCIsImNvcyIsImxhdGl0dWRlIiwiUEkiLCJwb3ciLCJ6b29tIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBS0E7O0FBQ0E7O0FBRUEsU0FBU0EsK0JBQVQsT0FNRztBQUFBLE1BTERDLHVCQUtDLFFBTERBLHVCQUtDO0FBQUEsTUFKREMsWUFJQyxRQUpEQSxZQUlDO0FBQ0QsU0FBTyxNQUFNRCx1QkFBdUIsQ0FBQyxDQUFELENBQXZCLEdBQTZCQyxZQUFZLENBQUMsQ0FBRCxDQUEvQyxDQUFQO0FBQ0QsQyxDQUVEOzs7QUFDTyxNQUFNQyxnQkFBTixTQUErQkMsNEJBQS9CLENBQTZDO0FBQ2xEQyxFQUFBQSxpQkFBaUIsQ0FBQ0MsS0FBRCxFQUE4Q0MsUUFBOUMsRUFBMEU7QUFDekYsUUFBSSxDQUFDRCxLQUFLLENBQUNMLHVCQUFYLEVBQW9DO0FBQ2xDLGFBQU9LLEtBQVA7QUFDRDs7QUFId0YsZ0JBVXZGLEtBQUtFLFdBQUwsSUFBb0IsRUFWbUU7QUFBQSxtQ0FNdkZDLFlBTnVGO0FBQUEsUUFNdkZBLFlBTnVGLG1DQU14RSxDQU53RTtBQUFBLG1DQU92RkMsWUFQdUY7QUFBQSxRQU92RkEsWUFQdUYsbUNBT3hFLEtBUHdFO0FBQUEsc0NBUXZGQyx3QkFSdUY7QUFBQSxRQVF2RkEsd0JBUnVGLHNDQVE1RFgsK0JBUjRELDBCQVl6Rjs7O0FBQ0EsUUFBSVksU0FBUyxHQUFHTCxRQUFRLENBQUNNLE1BQVQsS0FBb0IsQ0FBcEIsR0FBd0JOLFFBQVEsQ0FBQyxDQUFELENBQWhDLEdBQXNDLENBQXRELENBYnlGLENBZXpGOztBQUNBSyxJQUFBQSxTQUFTLElBQUlELHdCQUF3QixDQUFDO0FBQ3BDVixNQUFBQSx1QkFBdUIsRUFBRUssS0FBSyxDQUFDTCx1QkFESztBQUVwQ0MsTUFBQUEsWUFBWSxFQUFFSSxLQUFLLENBQUNKO0FBRmdCLEtBQUQsQ0FBckM7QUFJQVUsSUFBQUEsU0FBUyxHQUFHRSxJQUFJLENBQUNDLEdBQUwsQ0FBU0gsU0FBVCxFQUFvQkYsWUFBcEIsQ0FBWjtBQUNBRSxJQUFBQSxTQUFTLEdBQUdFLElBQUksQ0FBQ0UsR0FBTCxDQUFTSixTQUFULEVBQW9CSCxZQUFwQixDQUFaO0FBRUEsV0FBT1EsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQlosS0FBbEIsRUFBeUI7QUFDOUJhLE1BQUFBLFlBQVksRUFBRSxDQUFDWixRQUFRLENBQUMsQ0FBRCxDQUFULEVBQWNBLFFBQVEsQ0FBQyxDQUFELENBQXRCLEVBQTJCSyxTQUEzQjtBQURnQixLQUF6QixDQUFQO0FBR0Q7O0FBRURRLEVBQUFBLGlCQUFpQixDQUFDZCxLQUFELEVBQThFO0FBQzdGLFFBQU1lLFVBQVUsR0FBRyxzQ0FBb0JmLEtBQUssQ0FBQ2dCLGdCQUExQixDQUFuQjtBQUNBLFFBQU1mLFFBQVEsR0FBR2MsVUFBVSxHQUFHQSxVQUFVLENBQUNkLFFBQWQsR0FBeUJELEtBQUssQ0FBQ2EsWUFBMUQ7QUFDQSxXQUFPLE1BQU1DLGlCQUFOLENBQXdCLEtBQUtmLGlCQUFMLENBQXVCQyxLQUF2QixFQUE4QkMsUUFBOUIsQ0FBeEIsQ0FBUDtBQUNEOztBQUVEZ0IsRUFBQUEsa0JBQWtCLENBQUNqQixLQUFELEVBQXdDO0FBQ3hELFFBQU1lLFVBQVUsR0FBRyxzQ0FBb0JmLEtBQUssQ0FBQ2tCLEtBQTFCLENBQW5CO0FBQ0EsUUFBTWpCLFFBQVEsR0FBR2MsVUFBVSxHQUFHQSxVQUFVLENBQUNkLFFBQWQsR0FBeUJELEtBQUssQ0FBQ2EsWUFBMUQ7QUFDQSxXQUFPLE1BQU1JLGtCQUFOLENBQXlCLEtBQUtsQixpQkFBTCxDQUF1QkMsS0FBdkIsRUFBOEJDLFFBQTlCLENBQXpCLENBQVA7QUFDRDs7QUFFRGtCLEVBQUFBLFNBQVMsQ0FBQ0MsTUFBRCxFQUEwQztBQUNqRCxRQUFJQyxNQUFNLEdBQUcsTUFBTUYsU0FBTixDQUFnQkMsTUFBaEIsQ0FBYjs7QUFDQSxRQUFJQyxNQUFNLEtBQUssTUFBZixFQUF1QjtBQUNyQkEsTUFBQUEsTUFBTSxHQUFHLFdBQVQ7QUFDRDs7QUFDRCxXQUFPQSxNQUFQO0FBQ0Q7O0FBRUQsU0FBT0Msb0NBQVAsQ0FDRUMsUUFERixTQVNVO0FBQUEsUUFOTjVCLHVCQU1NLFNBTk5BLHVCQU1NO0FBQUEsUUFMTkMsWUFLTSxTQUxOQSxZQUtNO0FBQ1I7QUFDQSxRQUFNNEIsY0FBYyxHQUNqQixlQUFlaEIsSUFBSSxDQUFDaUIsR0FBTCxDQUFVRixRQUFRLENBQUNHLFFBQVQsR0FBb0JsQixJQUFJLENBQUNtQixFQUExQixHQUFnQyxHQUF6QyxDQUFoQixHQUFpRW5CLElBQUksQ0FBQ29CLEdBQUwsQ0FBUyxDQUFULEVBQVlMLFFBQVEsQ0FBQ00sSUFBckIsQ0FEbkU7QUFHQSxXQUFRTCxjQUFjLElBQUk3Qix1QkFBdUIsQ0FBQyxDQUFELENBQXZCLEdBQTZCQyxZQUFZLENBQUMsQ0FBRCxDQUE3QyxDQUFmLEdBQW9FLENBQTNFO0FBQ0Q7O0FBaEVpRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB0eXBlIHsgUG9zaXRpb24gfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtbmVidWxhLmdsLWVkaXQtbW9kZXMnO1xuaW1wb3J0IHR5cGUgeyBQb2ludGVyTW92ZUV2ZW50LCBTdG9wRHJhZ2dpbmdFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzLmpzJztcbmltcG9ydCB0eXBlIHsgRWRpdEFjdGlvbiB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IGdldFBpY2tlZEVkaXRIYW5kbGUgfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBNb2RpZnlIYW5kbGVyIH0gZnJvbSAnLi9tb2RpZnktaGFuZGxlci5qcyc7XG5cbmZ1bmN0aW9uIGRlZmF1bHRDYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2Uoe1xuICBwb2ludGVyRG93blNjcmVlbkNvb3JkcyxcbiAgc2NyZWVuQ29vcmRzXG59OiB7XG4gIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBQb3NpdGlvbixcbiAgc2NyZWVuQ29vcmRzOiBQb3NpdGlvblxufSkge1xuICByZXR1cm4gMTAgKiAocG9pbnRlckRvd25TY3JlZW5Db29yZHNbMV0gLSBzY3JlZW5Db29yZHNbMV0pO1xufVxuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgRWxldmF0aW9uSGFuZGxlciBleHRlbmRzIE1vZGlmeUhhbmRsZXIge1xuICBtYWtlRWxldmF0ZWRFdmVudChldmVudDogUG9pbnRlck1vdmVFdmVudCB8IFN0b3BEcmFnZ2luZ0V2ZW50LCBwb3NpdGlvbjogUG9zaXRpb24pOiBPYmplY3Qge1xuICAgIGlmICghZXZlbnQucG9pbnRlckRvd25TY3JlZW5Db29yZHMpIHtcbiAgICAgIHJldHVybiBldmVudDtcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBtaW5FbGV2YXRpb24gPSAwLFxuICAgICAgbWF4RWxldmF0aW9uID0gMjAwMDAsXG4gICAgICBjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UgPSBkZWZhdWx0Q2FsY3VsYXRlRWxldmF0aW9uQ2hhbmdlXG4gICAgfSA9XG4gICAgICB0aGlzLl9tb2RlQ29uZmlnIHx8IHt9O1xuXG4gICAgLy8gJEZsb3dGaXhNZSAtIHJlYWxseSwgSSBrbm93IGl0IGhhcyBzb21ldGhpbmcgYXQgaW5kZXggMlxuICAgIGxldCBlbGV2YXRpb24gPSBwb3NpdGlvbi5sZW5ndGggPT09IDMgPyBwb3NpdGlvblsyXSA6IDA7XG5cbiAgICAvLyBjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UgaXMgY29uZmlndXJhYmxlIGJlY2FzZSAoYXQgdGhpcyB0aW1lKSBtb2RlcyBhcmUgbm90IGF3YXJlIG9mIHRoZSB2aWV3cG9ydFxuICAgIGVsZXZhdGlvbiArPSBjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2Uoe1xuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IGV2ZW50LnBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgc2NyZWVuQ29vcmRzOiBldmVudC5zY3JlZW5Db29yZHNcbiAgICB9KTtcbiAgICBlbGV2YXRpb24gPSBNYXRoLm1pbihlbGV2YXRpb24sIG1heEVsZXZhdGlvbik7XG4gICAgZWxldmF0aW9uID0gTWF0aC5tYXgoZWxldmF0aW9uLCBtaW5FbGV2YXRpb24pO1xuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LCB7XG4gICAgICBncm91bmRDb29yZHM6IFtwb3NpdGlvblswXSwgcG9zaXRpb25bMV0sIGVsZXZhdGlvbl1cbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KTogeyBlZGl0QWN0aW9uOiA/RWRpdEFjdGlvbiwgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBvaW50ZXJEb3duUGlja3MpO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gZWRpdEhhbmRsZSA/IGVkaXRIYW5kbGUucG9zaXRpb24gOiBldmVudC5ncm91bmRDb29yZHM7XG4gICAgcmV0dXJuIHN1cGVyLmhhbmRsZVBvaW50ZXJNb3ZlKHRoaXMubWFrZUVsZXZhdGVkRXZlbnQoZXZlbnQsIHBvc2l0aW9uKSk7XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50KTogP0VkaXRBY3Rpb24ge1xuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBpY2tzKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGVkaXRIYW5kbGUgPyBlZGl0SGFuZGxlLnBvc2l0aW9uIDogZXZlbnQuZ3JvdW5kQ29vcmRzO1xuICAgIHJldHVybiBzdXBlci5oYW5kbGVTdG9wRHJhZ2dpbmcodGhpcy5tYWtlRWxldmF0ZWRFdmVudChldmVudCwgcG9zaXRpb24pKTtcbiAgfVxuXG4gIGdldEN1cnNvcihwYXJhbXM6IHsgaXNEcmFnZ2luZzogYm9vbGVhbiB9KTogc3RyaW5nIHtcbiAgICBsZXQgY3Vyc29yID0gc3VwZXIuZ2V0Q3Vyc29yKHBhcmFtcyk7XG4gICAgaWYgKGN1cnNvciA9PT0gJ2NlbGwnKSB7XG4gICAgICBjdXJzb3IgPSAnbnMtcmVzaXplJztcbiAgICB9XG4gICAgcmV0dXJuIGN1cnNvcjtcbiAgfVxuXG4gIHN0YXRpYyBjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2VXaXRoVmlld3BvcnQoXG4gICAgdmlld3BvcnQ6IGFueSxcbiAgICB7XG4gICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkcyxcbiAgICAgIHNjcmVlbkNvb3Jkc1xuICAgIH06IHtcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBQb3NpdGlvbixcbiAgICAgIHNjcmVlbkNvb3JkczogUG9zaXRpb25cbiAgICB9XG4gICk6IG51bWJlciB7XG4gICAgLy8gU291cmNlOiBodHRwczovL2dpcy5zdGFja2V4Y2hhbmdlLmNvbS9hLzEyNzk0OS8xMTE4MDRcbiAgICBjb25zdCBtZXRlcnNQZXJQaXhlbCA9XG4gICAgICAoMTU2NTQzLjAzMzkyICogTWF0aC5jb3MoKHZpZXdwb3J0LmxhdGl0dWRlICogTWF0aC5QSSkgLyAxODApKSAvIE1hdGgucG93KDIsIHZpZXdwb3J0Lnpvb20pO1xuXG4gICAgcmV0dXJuIChtZXRlcnNQZXJQaXhlbCAqIChwb2ludGVyRG93blNjcmVlbkNvb3Jkc1sxXSAtIHNjcmVlbkNvb3Jkc1sxXSkpIC8gMjtcbiAgfVxufVxuIl19