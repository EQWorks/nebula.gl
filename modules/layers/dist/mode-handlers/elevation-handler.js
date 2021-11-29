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
} // TODO edit-modes: delete handlers once EditMode fully implemented


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2VsZXZhdGlvbi1oYW5kbGVyLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRDYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UiLCJwb2ludGVyRG93blNjcmVlbkNvb3JkcyIsInNjcmVlbkNvb3JkcyIsIkVsZXZhdGlvbkhhbmRsZXIiLCJldmVudCIsInBvc2l0aW9uIiwiX21vZGVDb25maWciLCJtaW5FbGV2YXRpb24iLCJtYXhFbGV2YXRpb24iLCJjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UiLCJlbGV2YXRpb24iLCJsZW5ndGgiLCJNYXRoIiwibWluIiwibWF4IiwiT2JqZWN0IiwiYXNzaWduIiwiZ3JvdW5kQ29vcmRzIiwiZWRpdEhhbmRsZSIsInBvaW50ZXJEb3duUGlja3MiLCJtYWtlRWxldmF0ZWRFdmVudCIsInBpY2tzIiwicGFyYW1zIiwiY3Vyc29yIiwidmlld3BvcnQiLCJtZXRlcnNQZXJQaXhlbCIsImNvcyIsImxhdGl0dWRlIiwiUEkiLCJwb3ciLCJ6b29tIiwiTW9kaWZ5SGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUtBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxTQUFTQSwrQkFBVCxPQU1HO0FBQUEsTUFMREMsdUJBS0MsUUFMREEsdUJBS0M7QUFBQSxNQUpEQyxZQUlDLFFBSkRBLFlBSUM7QUFDRCxTQUFPLE1BQU1ELHVCQUF1QixDQUFDLENBQUQsQ0FBdkIsR0FBNkJDLFlBQVksQ0FBQyxDQUFELENBQS9DLENBQVA7QUFDRCxDLENBRUQ7OztJQUNhQyxnQjs7Ozs7Ozs7Ozs7OztzQ0FDT0MsSyxFQUE2Q0MsUSxFQUE0QjtBQUN6RixVQUFJLENBQUNELEtBQUssQ0FBQ0gsdUJBQVgsRUFBb0M7QUFDbEMsZUFBT0csS0FBUDtBQUNEOztBQUh3RixrQkFVdkYsS0FBS0UsV0FBTCxJQUFvQixFQVZtRTtBQUFBLHFDQU12RkMsWUFOdUY7QUFBQSxVQU12RkEsWUFOdUYsbUNBTXhFLENBTndFO0FBQUEscUNBT3ZGQyxZQVB1RjtBQUFBLFVBT3ZGQSxZQVB1RixtQ0FPeEUsS0FQd0U7QUFBQSx3Q0FRdkZDLHdCQVJ1RjtBQUFBLFVBUXZGQSx3QkFSdUYsc0NBUTVEVCwrQkFSNEQsMEJBWXpGOzs7QUFDQSxVQUFJVSxTQUFTLEdBQUdMLFFBQVEsQ0FBQ00sTUFBVCxLQUFvQixDQUFwQixHQUF3Qk4sUUFBUSxDQUFDLENBQUQsQ0FBaEMsR0FBc0MsQ0FBdEQsQ0FieUYsQ0FlekY7O0FBQ0FLLE1BQUFBLFNBQVMsSUFBSUQsd0JBQXdCLENBQUM7QUFDcENSLFFBQUFBLHVCQUF1QixFQUFFRyxLQUFLLENBQUNILHVCQURLO0FBRXBDQyxRQUFBQSxZQUFZLEVBQUVFLEtBQUssQ0FBQ0Y7QUFGZ0IsT0FBRCxDQUFyQztBQUlBUSxNQUFBQSxTQUFTLEdBQUdFLElBQUksQ0FBQ0MsR0FBTCxDQUFTSCxTQUFULEVBQW9CRixZQUFwQixDQUFaO0FBQ0FFLE1BQUFBLFNBQVMsR0FBR0UsSUFBSSxDQUFDRSxHQUFMLENBQVNKLFNBQVQsRUFBb0JILFlBQXBCLENBQVo7QUFFQSxhQUFPUSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCWixLQUFsQixFQUF5QjtBQUM5QmEsUUFBQUEsWUFBWSxFQUFFLENBQUNaLFFBQVEsQ0FBQyxDQUFELENBQVQsRUFBY0EsUUFBUSxDQUFDLENBQUQsQ0FBdEIsRUFBMkJLLFNBQTNCO0FBRGdCLE9BQXpCLENBQVA7QUFHRDs7O3NDQUVpQk4sSyxFQUE2RTtBQUM3RixVQUFNYyxVQUFVLEdBQUcsc0NBQW9CZCxLQUFLLENBQUNlLGdCQUExQixDQUFuQjtBQUNBLFVBQU1kLFFBQVEsR0FBR2EsVUFBVSxHQUFHQSxVQUFVLENBQUNiLFFBQWQsR0FBeUJELEtBQUssQ0FBQ2EsWUFBMUQ7QUFDQSxxR0FBK0IsS0FBS0csaUJBQUwsQ0FBdUJoQixLQUF2QixFQUE4QkMsUUFBOUIsQ0FBL0I7QUFDRDs7O3VDQUVrQkQsSyxFQUF1QztBQUN4RCxVQUFNYyxVQUFVLEdBQUcsc0NBQW9CZCxLQUFLLENBQUNpQixLQUExQixDQUFuQjtBQUNBLFVBQU1oQixRQUFRLEdBQUdhLFVBQVUsR0FBR0EsVUFBVSxDQUFDYixRQUFkLEdBQXlCRCxLQUFLLENBQUNhLFlBQTFEO0FBQ0Esc0dBQWdDLEtBQUtHLGlCQUFMLENBQXVCaEIsS0FBdkIsRUFBOEJDLFFBQTlCLENBQWhDO0FBQ0Q7Ozs4QkFFU2lCLE0sRUFBeUM7QUFDakQsVUFBSUMsTUFBTSxtRkFBbUJELE1BQW5CLENBQVY7O0FBQ0EsVUFBSUMsTUFBTSxLQUFLLE1BQWYsRUFBdUI7QUFDckJBLFFBQUFBLE1BQU0sR0FBRyxXQUFUO0FBQ0Q7O0FBQ0QsYUFBT0EsTUFBUDtBQUNEOzs7eURBR0NDLFEsU0FRUTtBQUFBLFVBTk52Qix1QkFNTSxTQU5OQSx1QkFNTTtBQUFBLFVBTE5DLFlBS00sU0FMTkEsWUFLTTtBQUNSO0FBQ0EsVUFBTXVCLGNBQWMsR0FDakIsZUFBZWIsSUFBSSxDQUFDYyxHQUFMLENBQVVGLFFBQVEsQ0FBQ0csUUFBVCxHQUFvQmYsSUFBSSxDQUFDZ0IsRUFBMUIsR0FBZ0MsR0FBekMsQ0FBaEIsR0FBaUVoQixJQUFJLENBQUNpQixHQUFMLENBQVMsQ0FBVCxFQUFZTCxRQUFRLENBQUNNLElBQXJCLENBRG5FO0FBR0EsYUFBUUwsY0FBYyxJQUFJeEIsdUJBQXVCLENBQUMsQ0FBRCxDQUF2QixHQUE2QkMsWUFBWSxDQUFDLENBQUQsQ0FBN0MsQ0FBZixHQUFvRSxDQUEzRTtBQUNEOzs7O0VBaEVtQzZCLDRCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUgeyBQb3NpdGlvbiB9IGZyb20gJ2tlcGxlci1vdXRkYXRlZC1uZWJ1bGEuZ2wtZWRpdC1tb2Rlcyc7XG5pbXBvcnQgdHlwZSB7IFBvaW50ZXJNb3ZlRXZlbnQsIFN0b3BEcmFnZ2luZ0V2ZW50IH0gZnJvbSAnLi4vZXZlbnQtdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBFZGl0QWN0aW9uIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXIuanMnO1xuaW1wb3J0IHsgZ2V0UGlja2VkRWRpdEhhbmRsZSB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcbmltcG9ydCB7IE1vZGlmeUhhbmRsZXIgfSBmcm9tICcuL21vZGlmeS1oYW5kbGVyLmpzJztcblxuZnVuY3Rpb24gZGVmYXVsdENhbGN1bGF0ZUVsZXZhdGlvbkNoYW5nZSh7XG4gIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICBzY3JlZW5Db29yZHNcbn06IHtcbiAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IFBvc2l0aW9uLFxuICBzY3JlZW5Db29yZHM6IFBvc2l0aW9uXG59KSB7XG4gIHJldHVybiAxMCAqIChwb2ludGVyRG93blNjcmVlbkNvb3Jkc1sxXSAtIHNjcmVlbkNvb3Jkc1sxXSk7XG59XG5cbi8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIGhhbmRsZXJzIG9uY2UgRWRpdE1vZGUgZnVsbHkgaW1wbGVtZW50ZWRcbmV4cG9ydCBjbGFzcyBFbGV2YXRpb25IYW5kbGVyIGV4dGVuZHMgTW9kaWZ5SGFuZGxlciB7XG4gIG1ha2VFbGV2YXRlZEV2ZW50KGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50IHwgU3RvcERyYWdnaW5nRXZlbnQsIHBvc2l0aW9uOiBQb3NpdGlvbik6IE9iamVjdCB7XG4gICAgaWYgKCFldmVudC5wb2ludGVyRG93blNjcmVlbkNvb3Jkcykge1xuICAgICAgcmV0dXJuIGV2ZW50O1xuICAgIH1cblxuICAgIGNvbnN0IHtcbiAgICAgIG1pbkVsZXZhdGlvbiA9IDAsXG4gICAgICBtYXhFbGV2YXRpb24gPSAyMDAwMCxcbiAgICAgIGNhbGN1bGF0ZUVsZXZhdGlvbkNoYW5nZSA9IGRlZmF1bHRDYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2VcbiAgICB9ID1cbiAgICAgIHRoaXMuX21vZGVDb25maWcgfHwge307XG5cbiAgICAvLyAkRmxvd0ZpeE1lIC0gcmVhbGx5LCBJIGtub3cgaXQgaGFzIHNvbWV0aGluZyBhdCBpbmRleCAyXG4gICAgbGV0IGVsZXZhdGlvbiA9IHBvc2l0aW9uLmxlbmd0aCA9PT0gMyA/IHBvc2l0aW9uWzJdIDogMDtcblxuICAgIC8vIGNhbGN1bGF0ZUVsZXZhdGlvbkNoYW5nZSBpcyBjb25maWd1cmFibGUgYmVjYXNlIChhdCB0aGlzIHRpbWUpIG1vZGVzIGFyZSBub3QgYXdhcmUgb2YgdGhlIHZpZXdwb3J0XG4gICAgZWxldmF0aW9uICs9IGNhbGN1bGF0ZUVsZXZhdGlvbkNoYW5nZSh7XG4gICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkczogZXZlbnQucG9pbnRlckRvd25TY3JlZW5Db29yZHMsXG4gICAgICBzY3JlZW5Db29yZHM6IGV2ZW50LnNjcmVlbkNvb3Jkc1xuICAgIH0pO1xuICAgIGVsZXZhdGlvbiA9IE1hdGgubWluKGVsZXZhdGlvbiwgbWF4RWxldmF0aW9uKTtcbiAgICBlbGV2YXRpb24gPSBNYXRoLm1heChlbGV2YXRpb24sIG1pbkVsZXZhdGlvbik7XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZXZlbnQsIHtcbiAgICAgIGdyb3VuZENvb3JkczogW3Bvc2l0aW9uWzBdLCBwb3NpdGlvblsxXSwgZWxldmF0aW9uXVxuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpOiB7IGVkaXRBY3Rpb246ID9FZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgZWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucG9pbnRlckRvd25QaWNrcyk7XG4gICAgY29uc3QgcG9zaXRpb24gPSBlZGl0SGFuZGxlID8gZWRpdEhhbmRsZS5wb3NpdGlvbiA6IGV2ZW50Lmdyb3VuZENvb3JkcztcbiAgICByZXR1cm4gc3VwZXIuaGFuZGxlUG9pbnRlck1vdmUodGhpcy5tYWtlRWxldmF0ZWRFdmVudChldmVudCwgcG9zaXRpb24pKTtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQpOiA/RWRpdEFjdGlvbiB7XG4gICAgY29uc3QgZWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucGlja3MpO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gZWRpdEhhbmRsZSA/IGVkaXRIYW5kbGUucG9zaXRpb24gOiBldmVudC5ncm91bmRDb29yZHM7XG4gICAgcmV0dXJuIHN1cGVyLmhhbmRsZVN0b3BEcmFnZ2luZyh0aGlzLm1ha2VFbGV2YXRlZEV2ZW50KGV2ZW50LCBwb3NpdGlvbikpO1xuICB9XG5cbiAgZ2V0Q3Vyc29yKHBhcmFtczogeyBpc0RyYWdnaW5nOiBib29sZWFuIH0pOiBzdHJpbmcge1xuICAgIGxldCBjdXJzb3IgPSBzdXBlci5nZXRDdXJzb3IocGFyYW1zKTtcbiAgICBpZiAoY3Vyc29yID09PSAnY2VsbCcpIHtcbiAgICAgIGN1cnNvciA9ICducy1yZXNpemUnO1xuICAgIH1cbiAgICByZXR1cm4gY3Vyc29yO1xuICB9XG5cbiAgc3RhdGljIGNhbGN1bGF0ZUVsZXZhdGlvbkNoYW5nZVdpdGhWaWV3cG9ydChcbiAgICB2aWV3cG9ydDogYW55LFxuICAgIHtcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgc2NyZWVuQ29vcmRzXG4gICAgfToge1xuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IFBvc2l0aW9uLFxuICAgICAgc2NyZWVuQ29vcmRzOiBQb3NpdGlvblxuICAgIH1cbiAgKTogbnVtYmVyIHtcbiAgICAvLyBTb3VyY2U6IGh0dHBzOi8vZ2lzLnN0YWNrZXhjaGFuZ2UuY29tL2EvMTI3OTQ5LzExMTgwNFxuICAgIGNvbnN0IG1ldGVyc1BlclBpeGVsID1cbiAgICAgICgxNTY1NDMuMDMzOTIgKiBNYXRoLmNvcygodmlld3BvcnQubGF0aXR1ZGUgKiBNYXRoLlBJKSAvIDE4MCkpIC8gTWF0aC5wb3coMiwgdmlld3BvcnQuem9vbSk7XG5cbiAgICByZXR1cm4gKG1ldGVyc1BlclBpeGVsICogKHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzWzFdIC0gc2NyZWVuQ29vcmRzWzFdKSkgLyAyO1xuICB9XG59XG4iXX0=