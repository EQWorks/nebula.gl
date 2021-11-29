"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var styles = {
  mainContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none'
  }
};

class HtmlOverlay extends _react.Component {
  // Override this to provide your items
  getItems() {
    var children = this.props.children;

    if (children) {
      return Array.isArray(children) ? children : [children];
    }

    return [];
  }

  getCoords(coordinates) {
    var pos = this.props.viewport.project(coordinates);
    if (!pos) return [-1, -1];
    return pos;
  }

  inView(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        x = _ref2[0],
        y = _ref2[1];

    var _this$props$viewport = this.props.viewport,
        width = _this$props$viewport.width,
        height = _this$props$viewport.height;
    return !(x < 0 || y < 0 || x > width || y > height);
  }

  scaleWithZoom(n) {
    var zoom = this.props.viewport.zoom;
    return n / Math.pow(2, 20 - zoom);
  }

  breakpointWithZoom(threshold, a, b) {
    var zoom = this.props.viewport.zoom;
    return zoom > threshold ? a : b;
  }

  getViewport() {
    return this.props.viewport;
  }

  getZoom() {
    return this.props.viewport.zoom;
  }

  render() {
    var _this = this;

    var _this$props$zIndex = this.props.zIndex,
        zIndex = _this$props$zIndex === void 0 ? 1 : _this$props$zIndex;
    var style = Object.assign({
      zIndex: zIndex
    }, styles.mainContainer);
    var renderItems = [];
    this.getItems().filter(Boolean).forEach(function (item) {
      var _this$getCoords = _this.getCoords(item.props.coordinates),
          _this$getCoords2 = _slicedToArray(_this$getCoords, 2),
          x = _this$getCoords2[0],
          y = _this$getCoords2[1];

      if (_this.inView([x, y])) {
        renderItems.push((0, _react.cloneElement)(item, {
          x: x,
          y: y
        }));
      }
    });
    return _react.default.createElement("div", {
      style: style
    }, renderItems);
  }

}

exports.default = HtmlOverlay;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9odG1sLW92ZXJsYXkuanMiXSwibmFtZXMiOlsic3R5bGVzIiwibWFpbkNvbnRhaW5lciIsIndpZHRoIiwiaGVpZ2h0IiwicG9zaXRpb24iLCJwb2ludGVyRXZlbnRzIiwiSHRtbE92ZXJsYXkiLCJDb21wb25lbnQiLCJnZXRJdGVtcyIsImNoaWxkcmVuIiwicHJvcHMiLCJBcnJheSIsImlzQXJyYXkiLCJnZXRDb29yZHMiLCJjb29yZGluYXRlcyIsInBvcyIsInZpZXdwb3J0IiwicHJvamVjdCIsImluVmlldyIsIngiLCJ5Iiwic2NhbGVXaXRoWm9vbSIsIm4iLCJ6b29tIiwiTWF0aCIsInBvdyIsImJyZWFrcG9pbnRXaXRoWm9vbSIsInRocmVzaG9sZCIsImEiLCJiIiwiZ2V0Vmlld3BvcnQiLCJnZXRab29tIiwicmVuZGVyIiwiekluZGV4Iiwic3R5bGUiLCJPYmplY3QiLCJhc3NpZ24iLCJyZW5kZXJJdGVtcyIsImZpbHRlciIsIkJvb2xlYW4iLCJmb3JFYWNoIiwiaXRlbSIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsTUFBTSxHQUFHO0FBQ2JDLEVBQUFBLGFBQWEsRUFBRTtBQUNiQyxJQUFBQSxLQUFLLEVBQUUsTUFETTtBQUViQyxJQUFBQSxNQUFNLEVBQUUsTUFGSztBQUdiQyxJQUFBQSxRQUFRLEVBQUUsVUFIRztBQUliQyxJQUFBQSxhQUFhLEVBQUU7QUFKRjtBQURGLENBQWY7O0FBU2UsTUFBTUMsV0FBTixTQUFpQ0MsZ0JBQWpDLENBR2I7QUFDQTtBQUNBQyxFQUFBQSxRQUFRLEdBQWE7QUFBQSxRQUNYQyxRQURXLEdBQ0UsS0FBS0MsS0FEUCxDQUNYRCxRQURXOztBQUVuQixRQUFJQSxRQUFKLEVBQWM7QUFDWixhQUFPRSxLQUFLLENBQUNDLE9BQU4sQ0FBY0gsUUFBZCxJQUEwQkEsUUFBMUIsR0FBcUMsQ0FBQ0EsUUFBRCxDQUE1QztBQUNEOztBQUNELFdBQU8sRUFBUDtBQUNEOztBQUVESSxFQUFBQSxTQUFTLENBQUNDLFdBQUQsRUFBMEM7QUFDakQsUUFBTUMsR0FBRyxHQUFHLEtBQUtMLEtBQUwsQ0FBV00sUUFBWCxDQUFvQkMsT0FBcEIsQ0FBNEJILFdBQTVCLENBQVo7QUFDQSxRQUFJLENBQUNDLEdBQUwsRUFBVSxPQUFPLENBQUMsQ0FBQyxDQUFGLEVBQUssQ0FBQyxDQUFOLENBQVA7QUFDVixXQUFPQSxHQUFQO0FBQ0Q7O0FBRURHLEVBQUFBLE1BQU0sT0FBNEI7QUFBQTtBQUFBLFFBQTFCQyxDQUEwQjtBQUFBLFFBQXZCQyxDQUF1Qjs7QUFBQSwrQkFDTixLQUFLVixLQUFMLENBQVdNLFFBREw7QUFBQSxRQUN4QmQsS0FEd0Isd0JBQ3hCQSxLQUR3QjtBQUFBLFFBQ2pCQyxNQURpQix3QkFDakJBLE1BRGlCO0FBRWhDLFdBQU8sRUFBRWdCLENBQUMsR0FBRyxDQUFKLElBQVNDLENBQUMsR0FBRyxDQUFiLElBQWtCRCxDQUFDLEdBQUdqQixLQUF0QixJQUErQmtCLENBQUMsR0FBR2pCLE1BQXJDLENBQVA7QUFDRDs7QUFFRGtCLEVBQUFBLGFBQWEsQ0FBQ0MsQ0FBRCxFQUFZO0FBQUEsUUFDZkMsSUFEZSxHQUNOLEtBQUtiLEtBQUwsQ0FBV00sUUFETCxDQUNmTyxJQURlO0FBRXZCLFdBQU9ELENBQUMsR0FBR0UsSUFBSSxDQUFDQyxHQUFMLENBQVMsQ0FBVCxFQUFZLEtBQUtGLElBQWpCLENBQVg7QUFDRDs7QUFFREcsRUFBQUEsa0JBQWtCLENBQUNDLFNBQUQsRUFBb0JDLENBQXBCLEVBQTRCQyxDQUE1QixFQUF5QztBQUFBLFFBQ2pETixJQURpRCxHQUN4QyxLQUFLYixLQUFMLENBQVdNLFFBRDZCLENBQ2pETyxJQURpRDtBQUV6RCxXQUFPQSxJQUFJLEdBQUdJLFNBQVAsR0FBbUJDLENBQW5CLEdBQXVCQyxDQUE5QjtBQUNEOztBQUVEQyxFQUFBQSxXQUFXLEdBQUc7QUFDWixXQUFPLEtBQUtwQixLQUFMLENBQVdNLFFBQWxCO0FBQ0Q7O0FBRURlLEVBQUFBLE9BQU8sR0FBRztBQUNSLFdBQU8sS0FBS3JCLEtBQUwsQ0FBV00sUUFBWCxDQUFvQk8sSUFBM0I7QUFDRDs7QUFFRFMsRUFBQUEsTUFBTSxHQUFHO0FBQUE7O0FBQUEsNkJBQ2dCLEtBQUt0QixLQURyQixDQUNDdUIsTUFERDtBQUFBLFFBQ0NBLE1BREQsbUNBQ1UsQ0FEVjtBQUVQLFFBQU1DLEtBQUssR0FBR0MsTUFBTSxDQUFDQyxNQUFQLENBQWU7QUFBRUgsTUFBQUEsTUFBTSxFQUFOQTtBQUFGLEtBQWYsRUFBaUNqQyxNQUFNLENBQUNDLGFBQXhDLENBQWQ7QUFFQSxRQUFNb0MsV0FBVyxHQUFHLEVBQXBCO0FBQ0EsU0FBSzdCLFFBQUwsR0FDRzhCLE1BREgsQ0FDVUMsT0FEVixFQUVHQyxPQUZILENBRVcsVUFBQUMsSUFBSSxFQUFJO0FBQUEsNEJBQ0EsS0FBSSxDQUFDNUIsU0FBTCxDQUFlNEIsSUFBSSxDQUFDL0IsS0FBTCxDQUFXSSxXQUExQixDQURBO0FBQUE7QUFBQSxVQUNSSyxDQURRO0FBQUEsVUFDTEMsQ0FESzs7QUFFZixVQUFJLEtBQUksQ0FBQ0YsTUFBTCxDQUFZLENBQUNDLENBQUQsRUFBSUMsQ0FBSixDQUFaLENBQUosRUFBeUI7QUFDdkJpQixRQUFBQSxXQUFXLENBQUNLLElBQVosQ0FBaUIseUJBQWFELElBQWIsRUFBbUI7QUFBRXRCLFVBQUFBLENBQUMsRUFBREEsQ0FBRjtBQUFLQyxVQUFBQSxDQUFDLEVBQURBO0FBQUwsU0FBbkIsQ0FBakI7QUFDRDtBQUNGLEtBUEg7QUFTQSxXQUFPO0FBQUssTUFBQSxLQUFLLEVBQUVjO0FBQVosT0FBb0JHLFdBQXBCLENBQVA7QUFDRDs7QUF0REQiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgY2xvbmVFbGVtZW50IH0gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBzdHlsZXMgPSB7XG4gIG1haW5Db250YWluZXI6IHtcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdG1sT3ZlcmxheTxQcm9wcz4gZXh0ZW5kcyBDb21wb25lbnQ8XG4gIFByb3BzICYgeyBjaGlsZHJlbjogYW55LCB2aWV3cG9ydDogT2JqZWN0LCB6SW5kZXg/OiBudW1iZXIgfSxcbiAgKlxuPiB7XG4gIC8vIE92ZXJyaWRlIHRoaXMgdG8gcHJvdmlkZSB5b3VyIGl0ZW1zXG4gIGdldEl0ZW1zKCk6IEFycmF5PCo+IHtcbiAgICBjb25zdCB7IGNoaWxkcmVuIH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pID8gY2hpbGRyZW4gOiBbY2hpbGRyZW5dO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXRDb29yZHMoY29vcmRpbmF0ZXM6IG51bWJlcltdKTogW251bWJlciwgbnVtYmVyXSB7XG4gICAgY29uc3QgcG9zID0gdGhpcy5wcm9wcy52aWV3cG9ydC5wcm9qZWN0KGNvb3JkaW5hdGVzKTtcbiAgICBpZiAoIXBvcykgcmV0dXJuIFstMSwgLTFdO1xuICAgIHJldHVybiBwb3M7XG4gIH1cblxuICBpblZpZXcoW3gsIHldOiBudW1iZXJbXSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5wcm9wcy52aWV3cG9ydDtcbiAgICByZXR1cm4gISh4IDwgMCB8fCB5IDwgMCB8fCB4ID4gd2lkdGggfHwgeSA+IGhlaWdodCk7XG4gIH1cblxuICBzY2FsZVdpdGhab29tKG46IG51bWJlcikge1xuICAgIGNvbnN0IHsgem9vbSB9ID0gdGhpcy5wcm9wcy52aWV3cG9ydDtcbiAgICByZXR1cm4gbiAvIE1hdGgucG93KDIsIDIwIC0gem9vbSk7XG4gIH1cblxuICBicmVha3BvaW50V2l0aFpvb20odGhyZXNob2xkOiBudW1iZXIsIGE6IGFueSwgYjogYW55KTogYW55IHtcbiAgICBjb25zdCB7IHpvb20gfSA9IHRoaXMucHJvcHMudmlld3BvcnQ7XG4gICAgcmV0dXJuIHpvb20gPiB0aHJlc2hvbGQgPyBhIDogYjtcbiAgfVxuXG4gIGdldFZpZXdwb3J0KCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnZpZXdwb3J0O1xuICB9XG5cbiAgZ2V0Wm9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy52aWV3cG9ydC56b29tO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgekluZGV4ID0gMSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBzdHlsZSA9IE9iamVjdC5hc3NpZ24oKHsgekluZGV4IH06IGFueSksIHN0eWxlcy5tYWluQ29udGFpbmVyKTtcblxuICAgIGNvbnN0IHJlbmRlckl0ZW1zID0gW107XG4gICAgdGhpcy5nZXRJdGVtcygpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgICAuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgY29uc3QgW3gsIHldID0gdGhpcy5nZXRDb29yZHMoaXRlbS5wcm9wcy5jb29yZGluYXRlcyk7XG4gICAgICAgIGlmICh0aGlzLmluVmlldyhbeCwgeV0pKSB7XG4gICAgICAgICAgcmVuZGVySXRlbXMucHVzaChjbG9uZUVsZW1lbnQoaXRlbSwgeyB4LCB5IH0pKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9PntyZW5kZXJJdGVtc308L2Rpdj47XG4gIH1cbn1cbiJdfQ==