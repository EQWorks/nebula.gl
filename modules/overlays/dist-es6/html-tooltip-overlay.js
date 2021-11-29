"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _window = _interopRequireDefault(require("global/window"));

var _htmlOverlay = _interopRequireDefault(require("./html-overlay"));

var _htmlOverlayItem = _interopRequireDefault(require("./html-overlay-item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var styles = {
  tooltip: {
    transform: 'translate(-50%,-100%)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '4px 8px',
    borderRadius: 8,
    color: 'white'
  }
};
var SHOW_TOOLTIP_TIMEOUT = 250;

var HtmlTooltipOverlay =
/*#__PURE__*/
function (_HtmlOverlay) {
  _inherits(HtmlTooltipOverlay, _HtmlOverlay);

  function HtmlTooltipOverlay(props) {
    var _this;

    _classCallCheck(this, HtmlTooltipOverlay);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HtmlTooltipOverlay).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "timeoutID", null);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", void 0);

    _this.state = {
      visible: false,
      pickingInfo: null
    };
    return _this;
  }

  _createClass(HtmlTooltipOverlay, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      this.context.nebula.queryObjectEvents.on('pick', function (_ref) {
        var event = _ref.event,
            pickingInfo = _ref.pickingInfo;

        if (_this2.timeoutID !== null) {
          _window.default.clearTimeout(_this2.timeoutID);
        }

        _this2.timeoutID = null;

        if (pickingInfo && _this2._getTooltip(pickingInfo)) {
          _this2.timeoutID = _window.default.setTimeout(function () {
            _this2.setState({
              visible: true,
              pickingInfo: pickingInfo
            });
          }, SHOW_TOOLTIP_TIMEOUT);
        } else {
          _this2.setState({
            visible: false
          });
        }
      });
    }
  }, {
    key: "_getTooltip",
    value: function _getTooltip(pickingInfo) {
      return pickingInfo.object.style.tooltip;
    }
  }, {
    key: "_makeOverlay",
    value: function _makeOverlay() {
      var pickingInfo = this.state.pickingInfo;

      if (pickingInfo) {
        return _react.default.createElement(_htmlOverlayItem.default, {
          key: 0,
          coordinates: pickingInfo.lngLat,
          style: styles.tooltip
        }, this._getTooltip(pickingInfo));
      }

      return null;
    }
  }, {
    key: "getItems",
    value: function getItems() {
      if (this.state.visible) {
        return [this._makeOverlay()];
      }

      return [];
    }
  }]);

  return HtmlTooltipOverlay;
}(_htmlOverlay.default);

exports.default = HtmlTooltipOverlay;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9odG1sLXRvb2x0aXAtb3ZlcmxheS5qcyJdLCJuYW1lcyI6WyJzdHlsZXMiLCJ0b29sdGlwIiwidHJhbnNmb3JtIiwiYmFja2dyb3VuZENvbG9yIiwicGFkZGluZyIsImJvcmRlclJhZGl1cyIsImNvbG9yIiwiU0hPV19UT09MVElQX1RJTUVPVVQiLCJIdG1sVG9vbHRpcE92ZXJsYXkiLCJwcm9wcyIsInN0YXRlIiwidmlzaWJsZSIsInBpY2tpbmdJbmZvIiwiY29udGV4dCIsIm5lYnVsYSIsInF1ZXJ5T2JqZWN0RXZlbnRzIiwib24iLCJldmVudCIsInRpbWVvdXRJRCIsIndpbmRvdyIsImNsZWFyVGltZW91dCIsIl9nZXRUb29sdGlwIiwic2V0VGltZW91dCIsInNldFN0YXRlIiwib2JqZWN0Iiwic3R5bGUiLCJsbmdMYXQiLCJfbWFrZU92ZXJsYXkiLCJIdG1sT3ZlcmxheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFTQSxJQUFNQSxNQUFNLEdBQUc7QUFDYkMsRUFBQUEsT0FBTyxFQUFFO0FBQ1BDLElBQUFBLFNBQVMsRUFBRSx1QkFESjtBQUVQQyxJQUFBQSxlQUFlLEVBQUUsb0JBRlY7QUFHUEMsSUFBQUEsT0FBTyxFQUFFLFNBSEY7QUFJUEMsSUFBQUEsWUFBWSxFQUFFLENBSlA7QUFLUEMsSUFBQUEsS0FBSyxFQUFFO0FBTEE7QUFESSxDQUFmO0FBVUEsSUFBTUMsb0JBQW9CLEdBQUcsR0FBN0I7O0lBRXFCQyxrQjs7Ozs7QUFDbkIsOEJBQVlDLEtBQVosRUFBd0I7QUFBQTs7QUFBQTs7QUFDdEIsNEZBQU1BLEtBQU47O0FBRHNCLHdGQXNCQSxJQXRCQTs7QUFBQTs7QUFFdEIsVUFBS0MsS0FBTCxHQUFhO0FBQUVDLE1BQUFBLE9BQU8sRUFBRSxLQUFYO0FBQWtCQyxNQUFBQSxXQUFXLEVBQUU7QUFBL0IsS0FBYjtBQUZzQjtBQUd2Qjs7Ozt5Q0FFb0I7QUFBQTs7QUFDbkIsV0FBS0MsT0FBTCxDQUFhQyxNQUFiLENBQW9CQyxpQkFBcEIsQ0FBc0NDLEVBQXRDLENBQXlDLE1BQXpDLEVBQWlELGdCQUE0QjtBQUFBLFlBQXpCQyxLQUF5QixRQUF6QkEsS0FBeUI7QUFBQSxZQUFsQkwsV0FBa0IsUUFBbEJBLFdBQWtCOztBQUMzRSxZQUFJLE1BQUksQ0FBQ00sU0FBTCxLQUFtQixJQUF2QixFQUE2QjtBQUMzQkMsMEJBQU9DLFlBQVAsQ0FBb0IsTUFBSSxDQUFDRixTQUF6QjtBQUNEOztBQUNELFFBQUEsTUFBSSxDQUFDQSxTQUFMLEdBQWlCLElBQWpCOztBQUVBLFlBQUlOLFdBQVcsSUFBSSxNQUFJLENBQUNTLFdBQUwsQ0FBaUJULFdBQWpCLENBQW5CLEVBQWtEO0FBQ2hELFVBQUEsTUFBSSxDQUFDTSxTQUFMLEdBQWlCQyxnQkFBT0csVUFBUCxDQUFrQixZQUFNO0FBQ3ZDLFlBQUEsTUFBSSxDQUFDQyxRQUFMLENBQWM7QUFBRVosY0FBQUEsT0FBTyxFQUFFLElBQVg7QUFBaUJDLGNBQUFBLFdBQVcsRUFBWEE7QUFBakIsYUFBZDtBQUNELFdBRmdCLEVBRWRMLG9CQUZjLENBQWpCO0FBR0QsU0FKRCxNQUlPO0FBQ0wsVUFBQSxNQUFJLENBQUNnQixRQUFMLENBQWM7QUFBRVosWUFBQUEsT0FBTyxFQUFFO0FBQVgsV0FBZDtBQUNEO0FBQ0YsT0FiRDtBQWNEOzs7Z0NBS1dDLFcsRUFBNkI7QUFDdkMsYUFBT0EsV0FBVyxDQUFDWSxNQUFaLENBQW1CQyxLQUFuQixDQUF5QnhCLE9BQWhDO0FBQ0Q7OzttQ0FFYztBQUFBLFVBQ0xXLFdBREssR0FDVyxLQUFLRixLQURoQixDQUNMRSxXQURLOztBQUdiLFVBQUlBLFdBQUosRUFBaUI7QUFDZixlQUNFLDZCQUFDLHdCQUFEO0FBQWlCLFVBQUEsR0FBRyxFQUFFLENBQXRCO0FBQXlCLFVBQUEsV0FBVyxFQUFFQSxXQUFXLENBQUNjLE1BQWxEO0FBQTBELFVBQUEsS0FBSyxFQUFFMUIsTUFBTSxDQUFDQztBQUF4RSxXQUNHLEtBQUtvQixXQUFMLENBQWlCVCxXQUFqQixDQURILENBREY7QUFLRDs7QUFFRCxhQUFPLElBQVA7QUFDRDs7OytCQUUwQjtBQUN6QixVQUFJLEtBQUtGLEtBQUwsQ0FBV0MsT0FBZixFQUF3QjtBQUN0QixlQUFPLENBQUMsS0FBS2dCLFlBQUwsRUFBRCxDQUFQO0FBQ0Q7O0FBRUQsYUFBTyxFQUFQO0FBQ0Q7Ozs7RUFsRDZDQyxvQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcblxuaW1wb3J0IEh0bWxPdmVybGF5IGZyb20gJy4vaHRtbC1vdmVybGF5JztcbmltcG9ydCBIdG1sT3ZlcmxheUl0ZW0gZnJvbSAnLi9odG1sLW92ZXJsYXktaXRlbSc7XG5cbnR5cGUgUHJvcHMgPSB7fTtcblxudHlwZSBTdGF0ZSA9IHtcbiAgdmlzaWJsZTogYm9vbGVhbixcbiAgcGlja2luZ0luZm86ID9PYmplY3Rcbn07XG5cbmNvbnN0IHN0eWxlcyA9IHtcbiAgdG9vbHRpcDoge1xuICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgtNTAlLC0xMDAlKScsXG4gICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjMpJyxcbiAgICBwYWRkaW5nOiAnNHB4IDhweCcsXG4gICAgYm9yZGVyUmFkaXVzOiA4LFxuICAgIGNvbG9yOiAnd2hpdGUnXG4gIH1cbn07XG5cbmNvbnN0IFNIT1dfVE9PTFRJUF9USU1FT1VUID0gMjUwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdG1sVG9vbHRpcE92ZXJsYXkgZXh0ZW5kcyBIdG1sT3ZlcmxheTxQcm9wcz4ge1xuICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7IHZpc2libGU6IGZhbHNlLCBwaWNraW5nSW5mbzogbnVsbCB9O1xuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHRoaXMuY29udGV4dC5uZWJ1bGEucXVlcnlPYmplY3RFdmVudHMub24oJ3BpY2snLCAoeyBldmVudCwgcGlja2luZ0luZm8gfSkgPT4ge1xuICAgICAgaWYgKHRoaXMudGltZW91dElEICE9PSBudWxsKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SUQpO1xuICAgICAgfVxuICAgICAgdGhpcy50aW1lb3V0SUQgPSBudWxsO1xuXG4gICAgICBpZiAocGlja2luZ0luZm8gJiYgdGhpcy5fZ2V0VG9vbHRpcChwaWNraW5nSW5mbykpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0SUQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGU6IHRydWUsIHBpY2tpbmdJbmZvIH0pO1xuICAgICAgICB9LCBTSE9XX1RPT0xUSVBfVElNRU9VVCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZTogZmFsc2UgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB0aW1lb3V0SUQ6ID9UaW1lb3V0SUQgPSBudWxsO1xuICBzdGF0ZTogU3RhdGU7XG5cbiAgX2dldFRvb2x0aXAocGlja2luZ0luZm86IE9iamVjdCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHBpY2tpbmdJbmZvLm9iamVjdC5zdHlsZS50b29sdGlwO1xuICB9XG5cbiAgX21ha2VPdmVybGF5KCkge1xuICAgIGNvbnN0IHsgcGlja2luZ0luZm8gfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAocGlja2luZ0luZm8pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxIdG1sT3ZlcmxheUl0ZW0ga2V5PXswfSBjb29yZGluYXRlcz17cGlja2luZ0luZm8ubG5nTGF0fSBzdHlsZT17c3R5bGVzLnRvb2x0aXB9PlxuICAgICAgICAgIHt0aGlzLl9nZXRUb29sdGlwKHBpY2tpbmdJbmZvKX1cbiAgICAgICAgPC9IdG1sT3ZlcmxheUl0ZW0+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0SXRlbXMoKTogQXJyYXk8P09iamVjdD4ge1xuICAgIGlmICh0aGlzLnN0YXRlLnZpc2libGUpIHtcbiAgICAgIHJldHVybiBbdGhpcy5fbWFrZU92ZXJsYXkoKV07XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG4iXX0=