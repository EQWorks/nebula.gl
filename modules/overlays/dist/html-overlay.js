"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var styles = {
  mainContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none'
  }
};

var HtmlOverlay =
/*#__PURE__*/
function (_Component) {
  _inherits(HtmlOverlay, _Component);

  function HtmlOverlay() {
    _classCallCheck(this, HtmlOverlay);

    return _possibleConstructorReturn(this, _getPrototypeOf(HtmlOverlay).apply(this, arguments));
  }

  _createClass(HtmlOverlay, [{
    key: "getItems",
    // Override this to provide your items
    value: function getItems() {
      var children = this.props.children;

      if (children) {
        return Array.isArray(children) ? children : [children];
      }

      return [];
    }
  }, {
    key: "getCoords",
    value: function getCoords(coordinates) {
      var pos = this.props.viewport.project(coordinates);
      if (!pos) return [-1, -1];
      return pos;
    }
  }, {
    key: "inView",
    value: function inView(_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          x = _ref2[0],
          y = _ref2[1];

      var _this$props$viewport = this.props.viewport,
          width = _this$props$viewport.width,
          height = _this$props$viewport.height;
      return !(x < 0 || y < 0 || x > width || y > height);
    }
  }, {
    key: "scaleWithZoom",
    value: function scaleWithZoom(n) {
      var zoom = this.props.viewport.zoom;
      return n / Math.pow(2, 20 - zoom);
    }
  }, {
    key: "breakpointWithZoom",
    value: function breakpointWithZoom(threshold, a, b) {
      var zoom = this.props.viewport.zoom;
      return zoom > threshold ? a : b;
    }
  }, {
    key: "getViewport",
    value: function getViewport() {
      return this.props.viewport;
    }
  }, {
    key: "getZoom",
    value: function getZoom() {
      return this.props.viewport.zoom;
    }
  }, {
    key: "render",
    value: function render() {
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
  }]);

  return HtmlOverlay;
}(_react.Component);

exports.default = HtmlOverlay;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9odG1sLW92ZXJsYXkuanMiXSwibmFtZXMiOlsic3R5bGVzIiwibWFpbkNvbnRhaW5lciIsIndpZHRoIiwiaGVpZ2h0IiwicG9zaXRpb24iLCJwb2ludGVyRXZlbnRzIiwiSHRtbE92ZXJsYXkiLCJjaGlsZHJlbiIsInByb3BzIiwiQXJyYXkiLCJpc0FycmF5IiwiY29vcmRpbmF0ZXMiLCJwb3MiLCJ2aWV3cG9ydCIsInByb2plY3QiLCJ4IiwieSIsIm4iLCJ6b29tIiwiTWF0aCIsInBvdyIsInRocmVzaG9sZCIsImEiLCJiIiwiekluZGV4Iiwic3R5bGUiLCJPYmplY3QiLCJhc3NpZ24iLCJyZW5kZXJJdGVtcyIsImdldEl0ZW1zIiwiZmlsdGVyIiwiQm9vbGVhbiIsImZvckVhY2giLCJpdGVtIiwiZ2V0Q29vcmRzIiwiaW5WaWV3IiwicHVzaCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxNQUFNLEdBQUc7QUFDYkMsRUFBQUEsYUFBYSxFQUFFO0FBQ2JDLElBQUFBLEtBQUssRUFBRSxNQURNO0FBRWJDLElBQUFBLE1BQU0sRUFBRSxNQUZLO0FBR2JDLElBQUFBLFFBQVEsRUFBRSxVQUhHO0FBSWJDLElBQUFBLGFBQWEsRUFBRTtBQUpGO0FBREYsQ0FBZjs7SUFTcUJDLFc7Ozs7Ozs7Ozs7Ozs7QUFJbkI7K0JBQ3FCO0FBQUEsVUFDWEMsUUFEVyxHQUNFLEtBQUtDLEtBRFAsQ0FDWEQsUUFEVzs7QUFFbkIsVUFBSUEsUUFBSixFQUFjO0FBQ1osZUFBT0UsS0FBSyxDQUFDQyxPQUFOLENBQWNILFFBQWQsSUFBMEJBLFFBQTFCLEdBQXFDLENBQUNBLFFBQUQsQ0FBNUM7QUFDRDs7QUFDRCxhQUFPLEVBQVA7QUFDRDs7OzhCQUVTSSxXLEVBQXlDO0FBQ2pELFVBQU1DLEdBQUcsR0FBRyxLQUFLSixLQUFMLENBQVdLLFFBQVgsQ0FBb0JDLE9BQXBCLENBQTRCSCxXQUE1QixDQUFaO0FBQ0EsVUFBSSxDQUFDQyxHQUFMLEVBQVUsT0FBTyxDQUFDLENBQUMsQ0FBRixFQUFLLENBQUMsQ0FBTixDQUFQO0FBQ1YsYUFBT0EsR0FBUDtBQUNEOzs7aUNBRWlDO0FBQUE7QUFBQSxVQUExQkcsQ0FBMEI7QUFBQSxVQUF2QkMsQ0FBdUI7O0FBQUEsaUNBQ04sS0FBS1IsS0FBTCxDQUFXSyxRQURMO0FBQUEsVUFDeEJYLEtBRHdCLHdCQUN4QkEsS0FEd0I7QUFBQSxVQUNqQkMsTUFEaUIsd0JBQ2pCQSxNQURpQjtBQUVoQyxhQUFPLEVBQUVZLENBQUMsR0FBRyxDQUFKLElBQVNDLENBQUMsR0FBRyxDQUFiLElBQWtCRCxDQUFDLEdBQUdiLEtBQXRCLElBQStCYyxDQUFDLEdBQUdiLE1BQXJDLENBQVA7QUFDRDs7O2tDQUVhYyxDLEVBQVc7QUFBQSxVQUNmQyxJQURlLEdBQ04sS0FBS1YsS0FBTCxDQUFXSyxRQURMLENBQ2ZLLElBRGU7QUFFdkIsYUFBT0QsQ0FBQyxHQUFHRSxJQUFJLENBQUNDLEdBQUwsQ0FBUyxDQUFULEVBQVksS0FBS0YsSUFBakIsQ0FBWDtBQUNEOzs7dUNBRWtCRyxTLEVBQW1CQyxDLEVBQVFDLEMsRUFBYTtBQUFBLFVBQ2pETCxJQURpRCxHQUN4QyxLQUFLVixLQUFMLENBQVdLLFFBRDZCLENBQ2pESyxJQURpRDtBQUV6RCxhQUFPQSxJQUFJLEdBQUdHLFNBQVAsR0FBbUJDLENBQW5CLEdBQXVCQyxDQUE5QjtBQUNEOzs7a0NBRWE7QUFDWixhQUFPLEtBQUtmLEtBQUwsQ0FBV0ssUUFBbEI7QUFDRDs7OzhCQUVTO0FBQ1IsYUFBTyxLQUFLTCxLQUFMLENBQVdLLFFBQVgsQ0FBb0JLLElBQTNCO0FBQ0Q7Ozs2QkFFUTtBQUFBOztBQUFBLCtCQUNnQixLQUFLVixLQURyQixDQUNDZ0IsTUFERDtBQUFBLFVBQ0NBLE1BREQsbUNBQ1UsQ0FEVjtBQUVQLFVBQU1DLEtBQUssR0FBR0MsTUFBTSxDQUFDQyxNQUFQLENBQWU7QUFBRUgsUUFBQUEsTUFBTSxFQUFOQTtBQUFGLE9BQWYsRUFBaUN4QixNQUFNLENBQUNDLGFBQXhDLENBQWQ7QUFFQSxVQUFNMkIsV0FBVyxHQUFHLEVBQXBCO0FBQ0EsV0FBS0MsUUFBTCxHQUNHQyxNQURILENBQ1VDLE9BRFYsRUFFR0MsT0FGSCxDQUVXLFVBQUFDLElBQUksRUFBSTtBQUFBLDhCQUNBLEtBQUksQ0FBQ0MsU0FBTCxDQUFlRCxJQUFJLENBQUN6QixLQUFMLENBQVdHLFdBQTFCLENBREE7QUFBQTtBQUFBLFlBQ1JJLENBRFE7QUFBQSxZQUNMQyxDQURLOztBQUVmLFlBQUksS0FBSSxDQUFDbUIsTUFBTCxDQUFZLENBQUNwQixDQUFELEVBQUlDLENBQUosQ0FBWixDQUFKLEVBQXlCO0FBQ3ZCWSxVQUFBQSxXQUFXLENBQUNRLElBQVosQ0FBaUIseUJBQWFILElBQWIsRUFBbUI7QUFBRWxCLFlBQUFBLENBQUMsRUFBREEsQ0FBRjtBQUFLQyxZQUFBQSxDQUFDLEVBQURBO0FBQUwsV0FBbkIsQ0FBakI7QUFDRDtBQUNGLE9BUEg7QUFTQSxhQUFPO0FBQUssUUFBQSxLQUFLLEVBQUVTO0FBQVosU0FBb0JHLFdBQXBCLENBQVA7QUFDRDs7OztFQXpENkNTLGdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIGNsb25lRWxlbWVudCB9IGZyb20gJ3JlYWN0JztcblxuY29uc3Qgc3R5bGVzID0ge1xuICBtYWluQ29udGFpbmVyOiB7XG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHRtbE92ZXJsYXk8UHJvcHM+IGV4dGVuZHMgQ29tcG9uZW50PFxuICBQcm9wcyAmIHsgY2hpbGRyZW46IGFueSwgdmlld3BvcnQ6IE9iamVjdCwgekluZGV4PzogbnVtYmVyIH0sXG4gICpcbj4ge1xuICAvLyBPdmVycmlkZSB0aGlzIHRvIHByb3ZpZGUgeW91ciBpdGVtc1xuICBnZXRJdGVtcygpOiBBcnJheTwqPiB7XG4gICAgY29uc3QgeyBjaGlsZHJlbiB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KGNoaWxkcmVuKSA/IGNoaWxkcmVuIDogW2NoaWxkcmVuXTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZ2V0Q29vcmRzKGNvb3JkaW5hdGVzOiBudW1iZXJbXSk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgIGNvbnN0IHBvcyA9IHRoaXMucHJvcHMudmlld3BvcnQucHJvamVjdChjb29yZGluYXRlcyk7XG4gICAgaWYgKCFwb3MpIHJldHVybiBbLTEsIC0xXTtcbiAgICByZXR1cm4gcG9zO1xuICB9XG5cbiAgaW5WaWV3KFt4LCB5XTogbnVtYmVyW10pOiBib29sZWFuIHtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMucHJvcHMudmlld3BvcnQ7XG4gICAgcmV0dXJuICEoeCA8IDAgfHwgeSA8IDAgfHwgeCA+IHdpZHRoIHx8IHkgPiBoZWlnaHQpO1xuICB9XG5cbiAgc2NhbGVXaXRoWm9vbShuOiBudW1iZXIpIHtcbiAgICBjb25zdCB7IHpvb20gfSA9IHRoaXMucHJvcHMudmlld3BvcnQ7XG4gICAgcmV0dXJuIG4gLyBNYXRoLnBvdygyLCAyMCAtIHpvb20pO1xuICB9XG5cbiAgYnJlYWtwb2ludFdpdGhab29tKHRocmVzaG9sZDogbnVtYmVyLCBhOiBhbnksIGI6IGFueSk6IGFueSB7XG4gICAgY29uc3QgeyB6b29tIH0gPSB0aGlzLnByb3BzLnZpZXdwb3J0O1xuICAgIHJldHVybiB6b29tID4gdGhyZXNob2xkID8gYSA6IGI7XG4gIH1cblxuICBnZXRWaWV3cG9ydCgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy52aWV3cG9ydDtcbiAgfVxuXG4gIGdldFpvb20oKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMudmlld3BvcnQuem9vbTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IHpJbmRleCA9IDEgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgc3R5bGUgPSBPYmplY3QuYXNzaWduKCh7IHpJbmRleCB9OiBhbnkpLCBzdHlsZXMubWFpbkNvbnRhaW5lcik7XG5cbiAgICBjb25zdCByZW5kZXJJdGVtcyA9IFtdO1xuICAgIHRoaXMuZ2V0SXRlbXMoKVxuICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IFt4LCB5XSA9IHRoaXMuZ2V0Q29vcmRzKGl0ZW0ucHJvcHMuY29vcmRpbmF0ZXMpO1xuICAgICAgICBpZiAodGhpcy5pblZpZXcoW3gsIHldKSkge1xuICAgICAgICAgIHJlbmRlckl0ZW1zLnB1c2goY2xvbmVFbGVtZW50KGl0ZW0sIHsgeCwgeSB9KSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfT57cmVuZGVySXRlbXN9PC9kaXY+O1xuICB9XG59XG4iXX0=