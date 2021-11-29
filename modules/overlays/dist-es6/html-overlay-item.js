"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var styles = {
  item: {
    position: 'absolute',
    userSelect: 'none'
  }
};

class HtmlOverlayItem extends _react.Component {
  render() {
    var _this$props = this.props,
        x = _this$props.x,
        y = _this$props.y,
        children = _this$props.children,
        style = _this$props.style,
        props = _objectWithoutProperties(_this$props, ["x", "y", "children", "style"]);

    return _react.default.createElement("div", _extends({
      style: _objectSpread({}, styles.item, style, {
        left: x,
        top: y
      })
    }, props), children);
  }

}

exports.default = HtmlOverlayItem;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9odG1sLW92ZXJsYXktaXRlbS5qcyJdLCJuYW1lcyI6WyJzdHlsZXMiLCJpdGVtIiwicG9zaXRpb24iLCJ1c2VyU2VsZWN0IiwiSHRtbE92ZXJsYXlJdGVtIiwiQ29tcG9uZW50IiwicmVuZGVyIiwicHJvcHMiLCJ4IiwieSIsImNoaWxkcmVuIiwic3R5bGUiLCJsZWZ0IiwidG9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsTUFBTSxHQUFHO0FBQ2JDLEVBQUFBLElBQUksRUFBRTtBQUNKQyxJQUFBQSxRQUFRLEVBQUUsVUFETjtBQUVKQyxJQUFBQSxVQUFVLEVBQUU7QUFGUjtBQURPLENBQWY7O0FBa0JlLE1BQU1DLGVBQU4sU0FBOEJDLGdCQUE5QixDQUErQztBQUM1REMsRUFBQUEsTUFBTSxHQUFHO0FBQUEsc0JBQ3FDLEtBQUtDLEtBRDFDO0FBQUEsUUFDQ0MsQ0FERCxlQUNDQSxDQUREO0FBQUEsUUFDSUMsQ0FESixlQUNJQSxDQURKO0FBQUEsUUFDT0MsUUFEUCxlQUNPQSxRQURQO0FBQUEsUUFDaUJDLEtBRGpCLGVBQ2lCQSxLQURqQjtBQUFBLFFBQzJCSixLQUQzQjs7QUFHUCxXQUNFO0FBQUssTUFBQSxLQUFLLG9CQUFPUCxNQUFNLENBQUNDLElBQWQsRUFBdUJVLEtBQXZCO0FBQThCQyxRQUFBQSxJQUFJLEVBQUVKLENBQXBDO0FBQXVDSyxRQUFBQSxHQUFHLEVBQUVKO0FBQTVDO0FBQVYsT0FBK0RGLEtBQS9ELEdBQ0dHLFFBREgsQ0FERjtBQUtEOztBQVQyRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBzdHlsZXMgPSB7XG4gIGl0ZW06IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB1c2VyU2VsZWN0OiAnbm9uZSdcbiAgfVxufTtcblxudHlwZSBQcm9wcyA9IHtcbiAgLy8gSW5qZWN0ZWQgYnkgSHRtbE92ZXJsYXlcbiAgeD86IG51bWJlcixcbiAgeT86IG51bWJlcixcblxuICAvLyBVc2VyIHByb3ZpZGVkXG4gIGNvb3JkaW5hdGVzOiBudW1iZXJbXSxcbiAgY2hpbGRyZW46IGFueSxcbiAgc3R5bGU/OiBPYmplY3Rcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh0bWxPdmVybGF5SXRlbSBleHRlbmRzIENvbXBvbmVudDxQcm9wcz4ge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB4LCB5LCBjaGlsZHJlbiwgc3R5bGUsIC4uLnByb3BzIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3sgLi4uc3R5bGVzLml0ZW0sIC4uLnN0eWxlLCBsZWZ0OiB4LCB0b3A6IHkgfX0gey4uLnByb3BzfT5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIl19