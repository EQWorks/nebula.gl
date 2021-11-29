"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = require("@luma.gl/core");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Arrow2DGeometry =
/*#__PURE__*/
function (_Geometry) {
  _inherits(Arrow2DGeometry, _Geometry);

  function Arrow2DGeometry() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Arrow2DGeometry);

    return _possibleConstructorReturn(this, _getPrototypeOf(Arrow2DGeometry).call(this, Object.assign({}, opts, {
      attributes: getArrowAttributes(opts)
    })));
  }

  return Arrow2DGeometry;
}(_core.Geometry);

exports.default = Arrow2DGeometry;

function getArrowAttributes(_ref) {
  var _ref$length = _ref.length,
      length = _ref$length === void 0 ? 1 : _ref$length,
      _ref$headSize = _ref.headSize,
      headSize = _ref$headSize === void 0 ? 0.2 : _ref$headSize,
      _ref$tailWidth = _ref.tailWidth,
      tailWidth = _ref$tailWidth === void 0 ? 0.05 : _ref$tailWidth,
      _ref$tailStart = _ref.tailStart,
      tailStart = _ref$tailStart === void 0 ? 0.05 : _ref$tailStart;
  var texCoords = [// HEAD
  0.5, 1.0, 0, 0.5 - headSize / 2, 1.0 - headSize, 0, 0.5 + headSize / 2, 1.0 - headSize, 0, 0.5 - tailWidth / 2, tailStart, 0, 0.5 + tailWidth / 2, 1.0 - headSize, 0, 0.5 + tailWidth / 2, tailStart, 0, 0.5 - tailWidth / 2, tailStart, 0, 0.5 - tailWidth / 2, 1.0 - headSize, 0, 0.5 + tailWidth / 2, 1.0 - headSize, 0];
  var normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]; // Center and scale

  var positions = new Array(texCoords.length);

  for (var i = 0; i < texCoords.length / 3; i++) {
    var i3 = i * 3;
    positions[i3 + 0] = (texCoords[i3 + 0] - 0.5) * length;
    positions[i3 + 1] = (texCoords[i3 + 1] - 0.5) * length;
    positions[i3 + 2] = 0;
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    texCoords: new Float32Array(texCoords)
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcGF0aC1tYXJrZXItbGF5ZXIvYXJyb3ctMmQtZ2VvbWV0cnkuanMiXSwibmFtZXMiOlsiQXJyb3cyREdlb21ldHJ5Iiwib3B0cyIsIk9iamVjdCIsImFzc2lnbiIsImF0dHJpYnV0ZXMiLCJnZXRBcnJvd0F0dHJpYnV0ZXMiLCJHZW9tZXRyeSIsImxlbmd0aCIsImhlYWRTaXplIiwidGFpbFdpZHRoIiwidGFpbFN0YXJ0IiwidGV4Q29vcmRzIiwibm9ybWFscyIsInBvc2l0aW9ucyIsIkFycmF5IiwiaSIsImkzIiwiRmxvYXQzMkFycmF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFcUJBLGU7Ozs7O0FBQ25CLDZCQUF1QjtBQUFBLFFBQVhDLElBQVcsdUVBQUosRUFBSTs7QUFBQTs7QUFBQSx3RkFFbkJDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JGLElBQWxCLEVBQXdCO0FBQ3RCRyxNQUFBQSxVQUFVLEVBQUVDLGtCQUFrQixDQUFDSixJQUFEO0FBRFIsS0FBeEIsQ0FGbUI7QUFNdEI7OztFQVAwQ0ssYzs7OztBQVU3QyxTQUFTRCxrQkFBVCxPQUFnRztBQUFBLHlCQUFsRUUsTUFBa0U7QUFBQSxNQUFsRUEsTUFBa0UsNEJBQXpELENBQXlEO0FBQUEsMkJBQXREQyxRQUFzRDtBQUFBLE1BQXREQSxRQUFzRCw4QkFBM0MsR0FBMkM7QUFBQSw0QkFBdENDLFNBQXNDO0FBQUEsTUFBdENBLFNBQXNDLCtCQUExQixJQUEwQjtBQUFBLDRCQUFwQkMsU0FBb0I7QUFBQSxNQUFwQkEsU0FBb0IsK0JBQVIsSUFBUTtBQUM5RixNQUFNQyxTQUFTLEdBQUcsQ0FDaEI7QUFDQSxLQUZnQixFQUdoQixHQUhnQixFQUloQixDQUpnQixFQUtoQixNQUFNSCxRQUFRLEdBQUcsQ0FMRCxFQU1oQixNQUFNQSxRQU5VLEVBT2hCLENBUGdCLEVBUWhCLE1BQU1BLFFBQVEsR0FBRyxDQVJELEVBU2hCLE1BQU1BLFFBVFUsRUFVaEIsQ0FWZ0IsRUFZaEIsTUFBTUMsU0FBUyxHQUFHLENBWkYsRUFhaEJDLFNBYmdCLEVBY2hCLENBZGdCLEVBZWhCLE1BQU1ELFNBQVMsR0FBRyxDQWZGLEVBZ0JoQixNQUFNRCxRQWhCVSxFQWlCaEIsQ0FqQmdCLEVBa0JoQixNQUFNQyxTQUFTLEdBQUcsQ0FsQkYsRUFtQmhCQyxTQW5CZ0IsRUFvQmhCLENBcEJnQixFQXNCaEIsTUFBTUQsU0FBUyxHQUFHLENBdEJGLEVBdUJoQkMsU0F2QmdCLEVBd0JoQixDQXhCZ0IsRUF5QmhCLE1BQU1ELFNBQVMsR0FBRyxDQXpCRixFQTBCaEIsTUFBTUQsUUExQlUsRUEyQmhCLENBM0JnQixFQTRCaEIsTUFBTUMsU0FBUyxHQUFHLENBNUJGLEVBNkJoQixNQUFNRCxRQTdCVSxFQThCaEIsQ0E5QmdCLENBQWxCO0FBaUNBLE1BQU1JLE9BQU8sR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDLENBQWxDLEVBQXFDLENBQXJDLEVBQXdDLENBQXhDLEVBQTJDLENBQTNDLEVBQThDLENBQTlDLEVBQWlELENBQWpELEVBQW9ELENBQXBELEVBQXVELENBQXZELEVBQTBELENBQTFELEVBQTZELENBQTdELEVBQWdFLENBQWhFLEVBQW1FLENBQW5FLEVBQXNFLENBQXRFLEVBQXlFLENBQXpFLEVBQTRFLENBQTVFLEVBQStFLENBQS9FLENBQWhCLENBbEM4RixDQW9DOUY7O0FBQ0EsTUFBTUMsU0FBUyxHQUFHLElBQUlDLEtBQUosQ0FBVUgsU0FBUyxDQUFDSixNQUFwQixDQUFsQjs7QUFDQSxPQUFLLElBQUlRLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdKLFNBQVMsQ0FBQ0osTUFBVixHQUFtQixDQUF2QyxFQUEwQ1EsQ0FBQyxFQUEzQyxFQUErQztBQUM3QyxRQUFNQyxFQUFFLEdBQUdELENBQUMsR0FBRyxDQUFmO0FBQ0FGLElBQUFBLFNBQVMsQ0FBQ0csRUFBRSxHQUFHLENBQU4sQ0FBVCxHQUFvQixDQUFDTCxTQUFTLENBQUNLLEVBQUUsR0FBRyxDQUFOLENBQVQsR0FBb0IsR0FBckIsSUFBNEJULE1BQWhEO0FBQ0FNLElBQUFBLFNBQVMsQ0FBQ0csRUFBRSxHQUFHLENBQU4sQ0FBVCxHQUFvQixDQUFDTCxTQUFTLENBQUNLLEVBQUUsR0FBRyxDQUFOLENBQVQsR0FBb0IsR0FBckIsSUFBNEJULE1BQWhEO0FBQ0FNLElBQUFBLFNBQVMsQ0FBQ0csRUFBRSxHQUFHLENBQU4sQ0FBVCxHQUFvQixDQUFwQjtBQUNEOztBQUNELFNBQU87QUFDTEgsSUFBQUEsU0FBUyxFQUFFLElBQUlJLFlBQUosQ0FBaUJKLFNBQWpCLENBRE47QUFFTEQsSUFBQUEsT0FBTyxFQUFFLElBQUlLLFlBQUosQ0FBaUJMLE9BQWpCLENBRko7QUFHTEQsSUFBQUEsU0FBUyxFQUFFLElBQUlNLFlBQUosQ0FBaUJOLFNBQWpCO0FBSE4sR0FBUDtBQUtEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR2VvbWV0cnkgfSBmcm9tICdAbHVtYS5nbC9jb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXJyb3cyREdlb21ldHJ5IGV4dGVuZHMgR2VvbWV0cnkge1xuICBjb25zdHJ1Y3RvcihvcHRzID0ge30pIHtcbiAgICBzdXBlcihcbiAgICAgIE9iamVjdC5hc3NpZ24oe30sIG9wdHMsIHtcbiAgICAgICAgYXR0cmlidXRlczogZ2V0QXJyb3dBdHRyaWJ1dGVzKG9wdHMpXG4gICAgICB9KVxuICAgICk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0QXJyb3dBdHRyaWJ1dGVzKHsgbGVuZ3RoID0gMSwgaGVhZFNpemUgPSAwLjIsIHRhaWxXaWR0aCA9IDAuMDUsIHRhaWxTdGFydCA9IDAuMDUgfSkge1xuICBjb25zdCB0ZXhDb29yZHMgPSBbXG4gICAgLy8gSEVBRFxuICAgIDAuNSxcbiAgICAxLjAsXG4gICAgMCxcbiAgICAwLjUgLSBoZWFkU2l6ZSAvIDIsXG4gICAgMS4wIC0gaGVhZFNpemUsXG4gICAgMCxcbiAgICAwLjUgKyBoZWFkU2l6ZSAvIDIsXG4gICAgMS4wIC0gaGVhZFNpemUsXG4gICAgMCxcblxuICAgIDAuNSAtIHRhaWxXaWR0aCAvIDIsXG4gICAgdGFpbFN0YXJ0LFxuICAgIDAsXG4gICAgMC41ICsgdGFpbFdpZHRoIC8gMixcbiAgICAxLjAgLSBoZWFkU2l6ZSxcbiAgICAwLFxuICAgIDAuNSArIHRhaWxXaWR0aCAvIDIsXG4gICAgdGFpbFN0YXJ0LFxuICAgIDAsXG5cbiAgICAwLjUgLSB0YWlsV2lkdGggLyAyLFxuICAgIHRhaWxTdGFydCxcbiAgICAwLFxuICAgIDAuNSAtIHRhaWxXaWR0aCAvIDIsXG4gICAgMS4wIC0gaGVhZFNpemUsXG4gICAgMCxcbiAgICAwLjUgKyB0YWlsV2lkdGggLyAyLFxuICAgIDEuMCAtIGhlYWRTaXplLFxuICAgIDBcbiAgXTtcblxuICBjb25zdCBub3JtYWxzID0gWzAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDAsIDFdO1xuXG4gIC8vIENlbnRlciBhbmQgc2NhbGVcbiAgY29uc3QgcG9zaXRpb25zID0gbmV3IEFycmF5KHRleENvb3Jkcy5sZW5ndGgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHRleENvb3Jkcy5sZW5ndGggLyAzOyBpKyspIHtcbiAgICBjb25zdCBpMyA9IGkgKiAzO1xuICAgIHBvc2l0aW9uc1tpMyArIDBdID0gKHRleENvb3Jkc1tpMyArIDBdIC0gMC41KSAqIGxlbmd0aDtcbiAgICBwb3NpdGlvbnNbaTMgKyAxXSA9ICh0ZXhDb29yZHNbaTMgKyAxXSAtIDAuNSkgKiBsZW5ndGg7XG4gICAgcG9zaXRpb25zW2kzICsgMl0gPSAwO1xuICB9XG4gIHJldHVybiB7XG4gICAgcG9zaXRpb25zOiBuZXcgRmxvYXQzMkFycmF5KHBvc2l0aW9ucyksXG4gICAgbm9ybWFsczogbmV3IEZsb2F0MzJBcnJheShub3JtYWxzKSxcbiAgICB0ZXhDb29yZHM6IG5ldyBGbG9hdDMyQXJyYXkodGV4Q29vcmRzKVxuICB9O1xufVxuIl19