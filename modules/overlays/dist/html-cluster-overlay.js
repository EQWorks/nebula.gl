"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helpers = require("@turf/helpers");

var _supercluster = _interopRequireDefault(require("supercluster"));

var _htmlOverlay = _interopRequireDefault(require("./html-overlay"));

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

var HtmlClusterOverlay =
/*#__PURE__*/
function (_HtmlOverlay) {
  _inherits(HtmlClusterOverlay, _HtmlOverlay);

  function HtmlClusterOverlay() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, HtmlClusterOverlay);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(HtmlClusterOverlay)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_superCluster", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_lastObjects", null);

    return _this;
  }

  _createClass(HtmlClusterOverlay, [{
    key: "getItems",
    value: function getItems() {
      var _this2 = this;

      // supercluster().load() is expensive and we want to run it only
      // when necessary and not for every frame.
      // TODO: Warn if this is running many times / sec
      var newObjects = this.getAllObjects();

      if (newObjects !== this._lastObjects) {
        this._superCluster = new _supercluster.default(this.getClusterOptions());

        this._superCluster.load(newObjects.map(function (object) {
          return (0, _helpers.point)(_this2.getObjectCoordinates(object), {
            object: object
          });
        }));

        this._lastObjects = newObjects; // console.log('new Supercluster() run');
      }

      var clusters = this._superCluster.getClusters([-180, -90, 180, 90], Math.round(this.getZoom()));

      return clusters.map(function (_ref) {
        var coordinates = _ref.geometry.coordinates,
            _ref$properties = _ref.properties,
            cluster = _ref$properties.cluster,
            pointCount = _ref$properties.point_count,
            clusterId = _ref$properties.cluster_id,
            object = _ref$properties.object;
        return cluster ? _this2.renderCluster(coordinates, clusterId, pointCount) : _this2.renderObject(coordinates, object);
      });
    }
  }, {
    key: "getClusterObjects",
    value: function getClusterObjects(clusterId) {
      return this._superCluster.getLeaves(clusterId, Infinity).map(function (object) {
        return object.properties.object;
      });
    } // Override to provide items that need clustering.
    // If the items have not changed please provide the same array to avoid
    // regeneration of the cluster which causes performance issues.

  }, {
    key: "getAllObjects",
    value: function getAllObjects() {
      return [];
    } // override to provide coordinates for each object of getAllObjects()

  }, {
    key: "getObjectCoordinates",
    value: function getObjectCoordinates(obj) {
      return [0, 0];
    } // Get options object used when instantiating supercluster

  }, {
    key: "getClusterOptions",
    value: function getClusterOptions() {
      return {
        maxZoom: 20
      };
    } // override to return an HtmlOverlayItem

  }, {
    key: "renderObject",
    value: function renderObject(coordinates, obj) {
      return null;
    } // override to return an HtmlOverlayItem
    // use getClusterObjects() to get cluster contents

  }, {
    key: "renderCluster",
    value: function renderCluster(coordinates, clusterId, pointCount) {
      return null;
    }
  }]);

  return HtmlClusterOverlay;
}(_htmlOverlay.default);

exports.default = HtmlClusterOverlay;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9odG1sLWNsdXN0ZXItb3ZlcmxheS5qcyJdLCJuYW1lcyI6WyJIdG1sQ2x1c3Rlck92ZXJsYXkiLCJuZXdPYmplY3RzIiwiZ2V0QWxsT2JqZWN0cyIsIl9sYXN0T2JqZWN0cyIsIl9zdXBlckNsdXN0ZXIiLCJTdXBlcmNsdXN0ZXIiLCJnZXRDbHVzdGVyT3B0aW9ucyIsImxvYWQiLCJtYXAiLCJvYmplY3QiLCJnZXRPYmplY3RDb29yZGluYXRlcyIsImNsdXN0ZXJzIiwiZ2V0Q2x1c3RlcnMiLCJNYXRoIiwicm91bmQiLCJnZXRab29tIiwiY29vcmRpbmF0ZXMiLCJnZW9tZXRyeSIsInByb3BlcnRpZXMiLCJjbHVzdGVyIiwicG9pbnRDb3VudCIsInBvaW50X2NvdW50IiwiY2x1c3RlcklkIiwiY2x1c3Rlcl9pZCIsInJlbmRlckNsdXN0ZXIiLCJyZW5kZXJPYmplY3QiLCJnZXRMZWF2ZXMiLCJJbmZpbml0eSIsIm9iaiIsIm1heFpvb20iLCJIdG1sT3ZlcmxheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFcUJBLGtCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyRkFFVSxJOzs7Ozs7OytCQUVSO0FBQUE7O0FBQ25CO0FBQ0E7QUFFQTtBQUVBLFVBQU1DLFVBQVUsR0FBRyxLQUFLQyxhQUFMLEVBQW5COztBQUNBLFVBQUlELFVBQVUsS0FBSyxLQUFLRSxZQUF4QixFQUFzQztBQUNwQyxhQUFLQyxhQUFMLEdBQXFCLElBQUlDLHFCQUFKLENBQWlCLEtBQUtDLGlCQUFMLEVBQWpCLENBQXJCOztBQUNBLGFBQUtGLGFBQUwsQ0FBbUJHLElBQW5CLENBQ0VOLFVBQVUsQ0FBQ08sR0FBWCxDQUFlLFVBQUFDLE1BQU07QUFBQSxpQkFBSSxvQkFBTSxNQUFJLENBQUNDLG9CQUFMLENBQTBCRCxNQUExQixDQUFOLEVBQXlDO0FBQUVBLFlBQUFBLE1BQU0sRUFBTkE7QUFBRixXQUF6QyxDQUFKO0FBQUEsU0FBckIsQ0FERjs7QUFHQSxhQUFLTixZQUFMLEdBQW9CRixVQUFwQixDQUxvQyxDQU1wQztBQUNEOztBQUVELFVBQU1VLFFBQVEsR0FBRyxLQUFLUCxhQUFMLENBQW1CUSxXQUFuQixDQUNmLENBQUMsQ0FBQyxHQUFGLEVBQU8sQ0FBQyxFQUFSLEVBQVksR0FBWixFQUFpQixFQUFqQixDQURlLEVBRWZDLElBQUksQ0FBQ0MsS0FBTCxDQUFXLEtBQUtDLE9BQUwsRUFBWCxDQUZlLENBQWpCOztBQUtBLGFBQU9KLFFBQVEsQ0FBQ0gsR0FBVCxDQUNMO0FBQUEsWUFDY1EsV0FEZCxRQUNFQyxRQURGLENBQ2NELFdBRGQ7QUFBQSxtQ0FFRUUsVUFGRjtBQUFBLFlBRWdCQyxPQUZoQixtQkFFZ0JBLE9BRmhCO0FBQUEsWUFFc0NDLFVBRnRDLG1CQUV5QkMsV0FGekI7QUFBQSxZQUU4REMsU0FGOUQsbUJBRWtEQyxVQUZsRDtBQUFBLFlBRXlFZCxNQUZ6RSxtQkFFeUVBLE1BRnpFO0FBQUEsZUFJRVUsT0FBTyxHQUNILE1BQUksQ0FBQ0ssYUFBTCxDQUFtQlIsV0FBbkIsRUFBZ0NNLFNBQWhDLEVBQTJDRixVQUEzQyxDQURHLEdBRUgsTUFBSSxDQUFDSyxZQUFMLENBQWtCVCxXQUFsQixFQUErQlAsTUFBL0IsQ0FOTjtBQUFBLE9BREssQ0FBUDtBQVNEOzs7c0NBRWlCYSxTLEVBQThCO0FBQzlDLGFBQU8sS0FBS2xCLGFBQUwsQ0FDSnNCLFNBREksQ0FDTUosU0FETixFQUNpQkssUUFEakIsRUFFSm5CLEdBRkksQ0FFQSxVQUFBQyxNQUFNO0FBQUEsZUFBSUEsTUFBTSxDQUFDUyxVQUFQLENBQWtCVCxNQUF0QjtBQUFBLE9BRk4sQ0FBUDtBQUdELEssQ0FFRDtBQUNBO0FBQ0E7Ozs7b0NBQzJCO0FBQ3pCLGFBQU8sRUFBUDtBQUNELEssQ0FFRDs7Ozt5Q0FDcUJtQixHLEVBQWdDO0FBQ25ELGFBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFQO0FBQ0QsSyxDQUVEOzs7O3dDQUM2QjtBQUMzQixhQUFPO0FBQ0xDLFFBQUFBLE9BQU8sRUFBRTtBQURKLE9BQVA7QUFHRCxLLENBRUQ7Ozs7aUNBQ2FiLFcsRUFBdUJZLEcsRUFBdUI7QUFDekQsYUFBTyxJQUFQO0FBQ0QsSyxDQUVEO0FBQ0E7Ozs7a0NBQ2NaLFcsRUFBdUJNLFMsRUFBbUJGLFUsRUFBNkI7QUFDbkYsYUFBTyxJQUFQO0FBQ0Q7Ozs7RUF0RTZEVSxvQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgeyBwb2ludCB9IGZyb20gJ0B0dXJmL2hlbHBlcnMnO1xuaW1wb3J0IFN1cGVyY2x1c3RlciBmcm9tICdzdXBlcmNsdXN0ZXInO1xuaW1wb3J0IEh0bWxPdmVybGF5IGZyb20gJy4vaHRtbC1vdmVybGF5JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHRtbENsdXN0ZXJPdmVybGF5PFByb3BzLCBPYmpUeXBlPiBleHRlbmRzIEh0bWxPdmVybGF5PFByb3BzPiB7XG4gIF9zdXBlckNsdXN0ZXI6IE9iamVjdDtcbiAgX2xhc3RPYmplY3RzOiA/KE9ialR5cGVbXSkgPSBudWxsO1xuXG4gIGdldEl0ZW1zKCk6IE9iamVjdFtdIHtcbiAgICAvLyBzdXBlcmNsdXN0ZXIoKS5sb2FkKCkgaXMgZXhwZW5zaXZlIGFuZCB3ZSB3YW50IHRvIHJ1biBpdCBvbmx5XG4gICAgLy8gd2hlbiBuZWNlc3NhcnkgYW5kIG5vdCBmb3IgZXZlcnkgZnJhbWUuXG5cbiAgICAvLyBUT0RPOiBXYXJuIGlmIHRoaXMgaXMgcnVubmluZyBtYW55IHRpbWVzIC8gc2VjXG5cbiAgICBjb25zdCBuZXdPYmplY3RzID0gdGhpcy5nZXRBbGxPYmplY3RzKCk7XG4gICAgaWYgKG5ld09iamVjdHMgIT09IHRoaXMuX2xhc3RPYmplY3RzKSB7XG4gICAgICB0aGlzLl9zdXBlckNsdXN0ZXIgPSBuZXcgU3VwZXJjbHVzdGVyKHRoaXMuZ2V0Q2x1c3Rlck9wdGlvbnMoKSk7XG4gICAgICB0aGlzLl9zdXBlckNsdXN0ZXIubG9hZChcbiAgICAgICAgbmV3T2JqZWN0cy5tYXAob2JqZWN0ID0+IHBvaW50KHRoaXMuZ2V0T2JqZWN0Q29vcmRpbmF0ZXMob2JqZWN0KSwgeyBvYmplY3QgfSkpXG4gICAgICApO1xuICAgICAgdGhpcy5fbGFzdE9iamVjdHMgPSBuZXdPYmplY3RzO1xuICAgICAgLy8gY29uc29sZS5sb2coJ25ldyBTdXBlcmNsdXN0ZXIoKSBydW4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBjbHVzdGVycyA9IHRoaXMuX3N1cGVyQ2x1c3Rlci5nZXRDbHVzdGVycyhcbiAgICAgIFstMTgwLCAtOTAsIDE4MCwgOTBdLFxuICAgICAgTWF0aC5yb3VuZCh0aGlzLmdldFpvb20oKSlcbiAgICApO1xuXG4gICAgcmV0dXJuIGNsdXN0ZXJzLm1hcChcbiAgICAgICh7XG4gICAgICAgIGdlb21ldHJ5OiB7IGNvb3JkaW5hdGVzIH0sXG4gICAgICAgIHByb3BlcnRpZXM6IHsgY2x1c3RlciwgcG9pbnRfY291bnQ6IHBvaW50Q291bnQsIGNsdXN0ZXJfaWQ6IGNsdXN0ZXJJZCwgb2JqZWN0IH1cbiAgICAgIH0pID0+XG4gICAgICAgIGNsdXN0ZXJcbiAgICAgICAgICA/IHRoaXMucmVuZGVyQ2x1c3Rlcihjb29yZGluYXRlcywgY2x1c3RlcklkLCBwb2ludENvdW50KVxuICAgICAgICAgIDogdGhpcy5yZW5kZXJPYmplY3QoY29vcmRpbmF0ZXMsIG9iamVjdClcbiAgICApO1xuICB9XG5cbiAgZ2V0Q2x1c3Rlck9iamVjdHMoY2x1c3RlcklkOiBudW1iZXIpOiBPYmpUeXBlW10ge1xuICAgIHJldHVybiB0aGlzLl9zdXBlckNsdXN0ZXJcbiAgICAgIC5nZXRMZWF2ZXMoY2x1c3RlcklkLCBJbmZpbml0eSlcbiAgICAgIC5tYXAob2JqZWN0ID0+IG9iamVjdC5wcm9wZXJ0aWVzLm9iamVjdCk7XG4gIH1cblxuICAvLyBPdmVycmlkZSB0byBwcm92aWRlIGl0ZW1zIHRoYXQgbmVlZCBjbHVzdGVyaW5nLlxuICAvLyBJZiB0aGUgaXRlbXMgaGF2ZSBub3QgY2hhbmdlZCBwbGVhc2UgcHJvdmlkZSB0aGUgc2FtZSBhcnJheSB0byBhdm9pZFxuICAvLyByZWdlbmVyYXRpb24gb2YgdGhlIGNsdXN0ZXIgd2hpY2ggY2F1c2VzIHBlcmZvcm1hbmNlIGlzc3Vlcy5cbiAgZ2V0QWxsT2JqZWN0cygpOiBPYmpUeXBlW10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8vIG92ZXJyaWRlIHRvIHByb3ZpZGUgY29vcmRpbmF0ZXMgZm9yIGVhY2ggb2JqZWN0IG9mIGdldEFsbE9iamVjdHMoKVxuICBnZXRPYmplY3RDb29yZGluYXRlcyhvYmo6IE9ialR5cGUpOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICByZXR1cm4gWzAsIDBdO1xuICB9XG5cbiAgLy8gR2V0IG9wdGlvbnMgb2JqZWN0IHVzZWQgd2hlbiBpbnN0YW50aWF0aW5nIHN1cGVyY2x1c3RlclxuICBnZXRDbHVzdGVyT3B0aW9ucygpOiA/T2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgbWF4Wm9vbTogMjBcbiAgICB9O1xuICB9XG5cbiAgLy8gb3ZlcnJpZGUgdG8gcmV0dXJuIGFuIEh0bWxPdmVybGF5SXRlbVxuICByZW5kZXJPYmplY3QoY29vcmRpbmF0ZXM6IG51bWJlcltdLCBvYmo6IE9ialR5cGUpOiA/T2JqZWN0IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIG92ZXJyaWRlIHRvIHJldHVybiBhbiBIdG1sT3ZlcmxheUl0ZW1cbiAgLy8gdXNlIGdldENsdXN0ZXJPYmplY3RzKCkgdG8gZ2V0IGNsdXN0ZXIgY29udGVudHNcbiAgcmVuZGVyQ2x1c3Rlcihjb29yZGluYXRlczogbnVtYmVyW10sIGNsdXN0ZXJJZDogbnVtYmVyLCBwb2ludENvdW50OiBudW1iZXIpOiA/T2JqZWN0IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19