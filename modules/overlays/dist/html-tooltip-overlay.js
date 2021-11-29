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

class HtmlTooltipOverlay extends _htmlOverlay.default {
  constructor(props) {
    super(props);

    _defineProperty(this, "timeoutID", null);

    _defineProperty(this, "state", void 0);

    this.state = {
      visible: false,
      pickingInfo: null
    };
  }

  componentWillMount() {
    var _this = this;

    this.context.nebula.queryObjectEvents.on('pick', function (_ref) {
      var event = _ref.event,
          pickingInfo = _ref.pickingInfo;

      if (_this.timeoutID !== null) {
        _window.default.clearTimeout(_this.timeoutID);
      }

      _this.timeoutID = null;

      if (pickingInfo && _this._getTooltip(pickingInfo)) {
        _this.timeoutID = _window.default.setTimeout(function () {
          _this.setState({
            visible: true,
            pickingInfo: pickingInfo
          });
        }, SHOW_TOOLTIP_TIMEOUT);
      } else {
        _this.setState({
          visible: false
        });
      }
    });
  }

  _getTooltip(pickingInfo) {
    return pickingInfo.object.style.tooltip;
  }

  _makeOverlay() {
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

  getItems() {
    if (this.state.visible) {
      return [this._makeOverlay()];
    }

    return [];
  }

}

exports.default = HtmlTooltipOverlay;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9odG1sLXRvb2x0aXAtb3ZlcmxheS5qcyJdLCJuYW1lcyI6WyJzdHlsZXMiLCJ0b29sdGlwIiwidHJhbnNmb3JtIiwiYmFja2dyb3VuZENvbG9yIiwicGFkZGluZyIsImJvcmRlclJhZGl1cyIsImNvbG9yIiwiU0hPV19UT09MVElQX1RJTUVPVVQiLCJIdG1sVG9vbHRpcE92ZXJsYXkiLCJIdG1sT3ZlcmxheSIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJzdGF0ZSIsInZpc2libGUiLCJwaWNraW5nSW5mbyIsImNvbXBvbmVudFdpbGxNb3VudCIsImNvbnRleHQiLCJuZWJ1bGEiLCJxdWVyeU9iamVjdEV2ZW50cyIsIm9uIiwiZXZlbnQiLCJ0aW1lb3V0SUQiLCJ3aW5kb3ciLCJjbGVhclRpbWVvdXQiLCJfZ2V0VG9vbHRpcCIsInNldFRpbWVvdXQiLCJzZXRTdGF0ZSIsIm9iamVjdCIsInN0eWxlIiwiX21ha2VPdmVybGF5IiwibG5nTGF0IiwiZ2V0SXRlbXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7O0FBU0EsSUFBTUEsTUFBTSxHQUFHO0FBQ2JDLEVBQUFBLE9BQU8sRUFBRTtBQUNQQyxJQUFBQSxTQUFTLEVBQUUsdUJBREo7QUFFUEMsSUFBQUEsZUFBZSxFQUFFLG9CQUZWO0FBR1BDLElBQUFBLE9BQU8sRUFBRSxTQUhGO0FBSVBDLElBQUFBLFlBQVksRUFBRSxDQUpQO0FBS1BDLElBQUFBLEtBQUssRUFBRTtBQUxBO0FBREksQ0FBZjtBQVVBLElBQU1DLG9CQUFvQixHQUFHLEdBQTdCOztBQUVlLE1BQU1DLGtCQUFOLFNBQWlDQyxvQkFBakMsQ0FBb0Q7QUFDakVDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFhO0FBQ3RCLFVBQU1BLEtBQU47O0FBRHNCLHVDQXNCQSxJQXRCQTs7QUFBQTs7QUFFdEIsU0FBS0MsS0FBTCxHQUFhO0FBQUVDLE1BQUFBLE9BQU8sRUFBRSxLQUFYO0FBQWtCQyxNQUFBQSxXQUFXLEVBQUU7QUFBL0IsS0FBYjtBQUNEOztBQUVEQyxFQUFBQSxrQkFBa0IsR0FBRztBQUFBOztBQUNuQixTQUFLQyxPQUFMLENBQWFDLE1BQWIsQ0FBb0JDLGlCQUFwQixDQUFzQ0MsRUFBdEMsQ0FBeUMsTUFBekMsRUFBaUQsZ0JBQTRCO0FBQUEsVUFBekJDLEtBQXlCLFFBQXpCQSxLQUF5QjtBQUFBLFVBQWxCTixXQUFrQixRQUFsQkEsV0FBa0I7O0FBQzNFLFVBQUksS0FBSSxDQUFDTyxTQUFMLEtBQW1CLElBQXZCLEVBQTZCO0FBQzNCQyx3QkFBT0MsWUFBUCxDQUFvQixLQUFJLENBQUNGLFNBQXpCO0FBQ0Q7O0FBQ0QsTUFBQSxLQUFJLENBQUNBLFNBQUwsR0FBaUIsSUFBakI7O0FBRUEsVUFBSVAsV0FBVyxJQUFJLEtBQUksQ0FBQ1UsV0FBTCxDQUFpQlYsV0FBakIsQ0FBbkIsRUFBa0Q7QUFDaEQsUUFBQSxLQUFJLENBQUNPLFNBQUwsR0FBaUJDLGdCQUFPRyxVQUFQLENBQWtCLFlBQU07QUFDdkMsVUFBQSxLQUFJLENBQUNDLFFBQUwsQ0FBYztBQUFFYixZQUFBQSxPQUFPLEVBQUUsSUFBWDtBQUFpQkMsWUFBQUEsV0FBVyxFQUFYQTtBQUFqQixXQUFkO0FBQ0QsU0FGZ0IsRUFFZFAsb0JBRmMsQ0FBakI7QUFHRCxPQUpELE1BSU87QUFDTCxRQUFBLEtBQUksQ0FBQ21CLFFBQUwsQ0FBYztBQUFFYixVQUFBQSxPQUFPLEVBQUU7QUFBWCxTQUFkO0FBQ0Q7QUFDRixLQWJEO0FBY0Q7O0FBS0RXLEVBQUFBLFdBQVcsQ0FBQ1YsV0FBRCxFQUE4QjtBQUN2QyxXQUFPQSxXQUFXLENBQUNhLE1BQVosQ0FBbUJDLEtBQW5CLENBQXlCM0IsT0FBaEM7QUFDRDs7QUFFRDRCLEVBQUFBLFlBQVksR0FBRztBQUFBLFFBQ0xmLFdBREssR0FDVyxLQUFLRixLQURoQixDQUNMRSxXQURLOztBQUdiLFFBQUlBLFdBQUosRUFBaUI7QUFDZixhQUNFLDZCQUFDLHdCQUFEO0FBQWlCLFFBQUEsR0FBRyxFQUFFLENBQXRCO0FBQXlCLFFBQUEsV0FBVyxFQUFFQSxXQUFXLENBQUNnQixNQUFsRDtBQUEwRCxRQUFBLEtBQUssRUFBRTlCLE1BQU0sQ0FBQ0M7QUFBeEUsU0FDRyxLQUFLdUIsV0FBTCxDQUFpQlYsV0FBakIsQ0FESCxDQURGO0FBS0Q7O0FBRUQsV0FBTyxJQUFQO0FBQ0Q7O0FBRURpQixFQUFBQSxRQUFRLEdBQW1CO0FBQ3pCLFFBQUksS0FBS25CLEtBQUwsQ0FBV0MsT0FBZixFQUF3QjtBQUN0QixhQUFPLENBQUMsS0FBS2dCLFlBQUwsRUFBRCxDQUFQO0FBQ0Q7O0FBRUQsV0FBTyxFQUFQO0FBQ0Q7O0FBbERnRSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcblxuaW1wb3J0IEh0bWxPdmVybGF5IGZyb20gJy4vaHRtbC1vdmVybGF5JztcbmltcG9ydCBIdG1sT3ZlcmxheUl0ZW0gZnJvbSAnLi9odG1sLW92ZXJsYXktaXRlbSc7XG5cbnR5cGUgUHJvcHMgPSB7fTtcblxudHlwZSBTdGF0ZSA9IHtcbiAgdmlzaWJsZTogYm9vbGVhbixcbiAgcGlja2luZ0luZm86ID9PYmplY3Rcbn07XG5cbmNvbnN0IHN0eWxlcyA9IHtcbiAgdG9vbHRpcDoge1xuICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgtNTAlLC0xMDAlKScsXG4gICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjMpJyxcbiAgICBwYWRkaW5nOiAnNHB4IDhweCcsXG4gICAgYm9yZGVyUmFkaXVzOiA4LFxuICAgIGNvbG9yOiAnd2hpdGUnXG4gIH1cbn07XG5cbmNvbnN0IFNIT1dfVE9PTFRJUF9USU1FT1VUID0gMjUwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdG1sVG9vbHRpcE92ZXJsYXkgZXh0ZW5kcyBIdG1sT3ZlcmxheTxQcm9wcz4ge1xuICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7IHZpc2libGU6IGZhbHNlLCBwaWNraW5nSW5mbzogbnVsbCB9O1xuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIHRoaXMuY29udGV4dC5uZWJ1bGEucXVlcnlPYmplY3RFdmVudHMub24oJ3BpY2snLCAoeyBldmVudCwgcGlja2luZ0luZm8gfSkgPT4ge1xuICAgICAgaWYgKHRoaXMudGltZW91dElEICE9PSBudWxsKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SUQpO1xuICAgICAgfVxuICAgICAgdGhpcy50aW1lb3V0SUQgPSBudWxsO1xuXG4gICAgICBpZiAocGlja2luZ0luZm8gJiYgdGhpcy5fZ2V0VG9vbHRpcChwaWNraW5nSW5mbykpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0SUQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGU6IHRydWUsIHBpY2tpbmdJbmZvIH0pO1xuICAgICAgICB9LCBTSE9XX1RPT0xUSVBfVElNRU9VVCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZTogZmFsc2UgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB0aW1lb3V0SUQ6ID9UaW1lb3V0SUQgPSBudWxsO1xuICBzdGF0ZTogU3RhdGU7XG5cbiAgX2dldFRvb2x0aXAocGlja2luZ0luZm86IE9iamVjdCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHBpY2tpbmdJbmZvLm9iamVjdC5zdHlsZS50b29sdGlwO1xuICB9XG5cbiAgX21ha2VPdmVybGF5KCkge1xuICAgIGNvbnN0IHsgcGlja2luZ0luZm8gfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAocGlja2luZ0luZm8pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxIdG1sT3ZlcmxheUl0ZW0ga2V5PXswfSBjb29yZGluYXRlcz17cGlja2luZ0luZm8ubG5nTGF0fSBzdHlsZT17c3R5bGVzLnRvb2x0aXB9PlxuICAgICAgICAgIHt0aGlzLl9nZXRUb29sdGlwKHBpY2tpbmdJbmZvKX1cbiAgICAgICAgPC9IdG1sT3ZlcmxheUl0ZW0+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0SXRlbXMoKTogQXJyYXk8P09iamVjdD4ge1xuICAgIGlmICh0aGlzLnN0YXRlLnZpc2libGUpIHtcbiAgICAgIHJldHVybiBbdGhpcy5fbWFrZU92ZXJsYXkoKV07XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG4iXX0=