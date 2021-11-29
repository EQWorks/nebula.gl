"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helpers = require("@turf/helpers");

var _supercluster = _interopRequireDefault(require("supercluster"));

var _htmlOverlay = _interopRequireDefault(require("./html-overlay"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HtmlClusterOverlay extends _htmlOverlay.default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_superCluster", void 0);

    _defineProperty(this, "_lastObjects", null);
  }

  getItems() {
    var _this = this;

    // supercluster().load() is expensive and we want to run it only
    // when necessary and not for every frame.
    // TODO: Warn if this is running many times / sec
    var newObjects = this.getAllObjects();

    if (newObjects !== this._lastObjects) {
      this._superCluster = new _supercluster.default(this.getClusterOptions());

      this._superCluster.load(newObjects.map(function (object) {
        return (0, _helpers.point)(_this.getObjectCoordinates(object), {
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
      return cluster ? _this.renderCluster(coordinates, clusterId, pointCount) : _this.renderObject(coordinates, object);
    });
  }

  getClusterObjects(clusterId) {
    return this._superCluster.getLeaves(clusterId, Infinity).map(function (object) {
      return object.properties.object;
    });
  } // Override to provide items that need clustering.
  // If the items have not changed please provide the same array to avoid
  // regeneration of the cluster which causes performance issues.


  getAllObjects() {
    return [];
  } // override to provide coordinates for each object of getAllObjects()


  getObjectCoordinates(obj) {
    return [0, 0];
  } // Get options object used when instantiating supercluster


  getClusterOptions() {
    return {
      maxZoom: 20
    };
  } // override to return an HtmlOverlayItem


  renderObject(coordinates, obj) {
    return null;
  } // override to return an HtmlOverlayItem
  // use getClusterObjects() to get cluster contents


  renderCluster(coordinates, clusterId, pointCount) {
    return null;
  }

}

exports.default = HtmlClusterOverlay;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9odG1sLWNsdXN0ZXItb3ZlcmxheS5qcyJdLCJuYW1lcyI6WyJIdG1sQ2x1c3Rlck92ZXJsYXkiLCJIdG1sT3ZlcmxheSIsImdldEl0ZW1zIiwibmV3T2JqZWN0cyIsImdldEFsbE9iamVjdHMiLCJfbGFzdE9iamVjdHMiLCJfc3VwZXJDbHVzdGVyIiwiU3VwZXJjbHVzdGVyIiwiZ2V0Q2x1c3Rlck9wdGlvbnMiLCJsb2FkIiwibWFwIiwib2JqZWN0IiwiZ2V0T2JqZWN0Q29vcmRpbmF0ZXMiLCJjbHVzdGVycyIsImdldENsdXN0ZXJzIiwiTWF0aCIsInJvdW5kIiwiZ2V0Wm9vbSIsImNvb3JkaW5hdGVzIiwiZ2VvbWV0cnkiLCJwcm9wZXJ0aWVzIiwiY2x1c3RlciIsInBvaW50Q291bnQiLCJwb2ludF9jb3VudCIsImNsdXN0ZXJJZCIsImNsdXN0ZXJfaWQiLCJyZW5kZXJDbHVzdGVyIiwicmVuZGVyT2JqZWN0IiwiZ2V0Q2x1c3Rlck9iamVjdHMiLCJnZXRMZWF2ZXMiLCJJbmZpbml0eSIsIm9iaiIsIm1heFpvb20iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsa0JBQU4sU0FBaURDLG9CQUFqRCxDQUFvRTtBQUFBO0FBQUE7O0FBQUE7O0FBQUEsMENBRXBELElBRm9EO0FBQUE7O0FBSWpGQyxFQUFBQSxRQUFRLEdBQWE7QUFBQTs7QUFDbkI7QUFDQTtBQUVBO0FBRUEsUUFBTUMsVUFBVSxHQUFHLEtBQUtDLGFBQUwsRUFBbkI7O0FBQ0EsUUFBSUQsVUFBVSxLQUFLLEtBQUtFLFlBQXhCLEVBQXNDO0FBQ3BDLFdBQUtDLGFBQUwsR0FBcUIsSUFBSUMscUJBQUosQ0FBaUIsS0FBS0MsaUJBQUwsRUFBakIsQ0FBckI7O0FBQ0EsV0FBS0YsYUFBTCxDQUFtQkcsSUFBbkIsQ0FDRU4sVUFBVSxDQUFDTyxHQUFYLENBQWUsVUFBQUMsTUFBTTtBQUFBLGVBQUksb0JBQU0sS0FBSSxDQUFDQyxvQkFBTCxDQUEwQkQsTUFBMUIsQ0FBTixFQUF5QztBQUFFQSxVQUFBQSxNQUFNLEVBQU5BO0FBQUYsU0FBekMsQ0FBSjtBQUFBLE9BQXJCLENBREY7O0FBR0EsV0FBS04sWUFBTCxHQUFvQkYsVUFBcEIsQ0FMb0MsQ0FNcEM7QUFDRDs7QUFFRCxRQUFNVSxRQUFRLEdBQUcsS0FBS1AsYUFBTCxDQUFtQlEsV0FBbkIsQ0FDZixDQUFDLENBQUMsR0FBRixFQUFPLENBQUMsRUFBUixFQUFZLEdBQVosRUFBaUIsRUFBakIsQ0FEZSxFQUVmQyxJQUFJLENBQUNDLEtBQUwsQ0FBVyxLQUFLQyxPQUFMLEVBQVgsQ0FGZSxDQUFqQjs7QUFLQSxXQUFPSixRQUFRLENBQUNILEdBQVQsQ0FDTDtBQUFBLFVBQ2NRLFdBRGQsUUFDRUMsUUFERixDQUNjRCxXQURkO0FBQUEsaUNBRUVFLFVBRkY7QUFBQSxVQUVnQkMsT0FGaEIsbUJBRWdCQSxPQUZoQjtBQUFBLFVBRXNDQyxVQUZ0QyxtQkFFeUJDLFdBRnpCO0FBQUEsVUFFOERDLFNBRjlELG1CQUVrREMsVUFGbEQ7QUFBQSxVQUV5RWQsTUFGekUsbUJBRXlFQSxNQUZ6RTtBQUFBLGFBSUVVLE9BQU8sR0FDSCxLQUFJLENBQUNLLGFBQUwsQ0FBbUJSLFdBQW5CLEVBQWdDTSxTQUFoQyxFQUEyQ0YsVUFBM0MsQ0FERyxHQUVILEtBQUksQ0FBQ0ssWUFBTCxDQUFrQlQsV0FBbEIsRUFBK0JQLE1BQS9CLENBTk47QUFBQSxLQURLLENBQVA7QUFTRDs7QUFFRGlCLEVBQUFBLGlCQUFpQixDQUFDSixTQUFELEVBQStCO0FBQzlDLFdBQU8sS0FBS2xCLGFBQUwsQ0FDSnVCLFNBREksQ0FDTUwsU0FETixFQUNpQk0sUUFEakIsRUFFSnBCLEdBRkksQ0FFQSxVQUFBQyxNQUFNO0FBQUEsYUFBSUEsTUFBTSxDQUFDUyxVQUFQLENBQWtCVCxNQUF0QjtBQUFBLEtBRk4sQ0FBUDtBQUdELEdBeENnRixDQTBDakY7QUFDQTtBQUNBOzs7QUFDQVAsRUFBQUEsYUFBYSxHQUFjO0FBQ3pCLFdBQU8sRUFBUDtBQUNELEdBL0NnRixDQWlEakY7OztBQUNBUSxFQUFBQSxvQkFBb0IsQ0FBQ21CLEdBQUQsRUFBaUM7QUFDbkQsV0FBTyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVA7QUFDRCxHQXBEZ0YsQ0FzRGpGOzs7QUFDQXZCLEVBQUFBLGlCQUFpQixHQUFZO0FBQzNCLFdBQU87QUFDTHdCLE1BQUFBLE9BQU8sRUFBRTtBQURKLEtBQVA7QUFHRCxHQTNEZ0YsQ0E2RGpGOzs7QUFDQUwsRUFBQUEsWUFBWSxDQUFDVCxXQUFELEVBQXdCYSxHQUF4QixFQUErQztBQUN6RCxXQUFPLElBQVA7QUFDRCxHQWhFZ0YsQ0FrRWpGO0FBQ0E7OztBQUNBTCxFQUFBQSxhQUFhLENBQUNSLFdBQUQsRUFBd0JNLFNBQXhCLEVBQTJDRixVQUEzQyxFQUF3RTtBQUNuRixXQUFPLElBQVA7QUFDRDs7QUF0RWdGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCB7IHBvaW50IH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgU3VwZXJjbHVzdGVyIGZyb20gJ3N1cGVyY2x1c3Rlcic7XG5pbXBvcnQgSHRtbE92ZXJsYXkgZnJvbSAnLi9odG1sLW92ZXJsYXknO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdG1sQ2x1c3Rlck92ZXJsYXk8UHJvcHMsIE9ialR5cGU+IGV4dGVuZHMgSHRtbE92ZXJsYXk8UHJvcHM+IHtcbiAgX3N1cGVyQ2x1c3RlcjogT2JqZWN0O1xuICBfbGFzdE9iamVjdHM6ID8oT2JqVHlwZVtdKSA9IG51bGw7XG5cbiAgZ2V0SXRlbXMoKTogT2JqZWN0W10ge1xuICAgIC8vIHN1cGVyY2x1c3RlcigpLmxvYWQoKSBpcyBleHBlbnNpdmUgYW5kIHdlIHdhbnQgdG8gcnVuIGl0IG9ubHlcbiAgICAvLyB3aGVuIG5lY2Vzc2FyeSBhbmQgbm90IGZvciBldmVyeSBmcmFtZS5cblxuICAgIC8vIFRPRE86IFdhcm4gaWYgdGhpcyBpcyBydW5uaW5nIG1hbnkgdGltZXMgLyBzZWNcblxuICAgIGNvbnN0IG5ld09iamVjdHMgPSB0aGlzLmdldEFsbE9iamVjdHMoKTtcbiAgICBpZiAobmV3T2JqZWN0cyAhPT0gdGhpcy5fbGFzdE9iamVjdHMpIHtcbiAgICAgIHRoaXMuX3N1cGVyQ2x1c3RlciA9IG5ldyBTdXBlcmNsdXN0ZXIodGhpcy5nZXRDbHVzdGVyT3B0aW9ucygpKTtcbiAgICAgIHRoaXMuX3N1cGVyQ2x1c3Rlci5sb2FkKFxuICAgICAgICBuZXdPYmplY3RzLm1hcChvYmplY3QgPT4gcG9pbnQodGhpcy5nZXRPYmplY3RDb29yZGluYXRlcyhvYmplY3QpLCB7IG9iamVjdCB9KSlcbiAgICAgICk7XG4gICAgICB0aGlzLl9sYXN0T2JqZWN0cyA9IG5ld09iamVjdHM7XG4gICAgICAvLyBjb25zb2xlLmxvZygnbmV3IFN1cGVyY2x1c3RlcigpIHJ1bicpO1xuICAgIH1cblxuICAgIGNvbnN0IGNsdXN0ZXJzID0gdGhpcy5fc3VwZXJDbHVzdGVyLmdldENsdXN0ZXJzKFxuICAgICAgWy0xODAsIC05MCwgMTgwLCA5MF0sXG4gICAgICBNYXRoLnJvdW5kKHRoaXMuZ2V0Wm9vbSgpKVxuICAgICk7XG5cbiAgICByZXR1cm4gY2x1c3RlcnMubWFwKFxuICAgICAgKHtcbiAgICAgICAgZ2VvbWV0cnk6IHsgY29vcmRpbmF0ZXMgfSxcbiAgICAgICAgcHJvcGVydGllczogeyBjbHVzdGVyLCBwb2ludF9jb3VudDogcG9pbnRDb3VudCwgY2x1c3Rlcl9pZDogY2x1c3RlcklkLCBvYmplY3QgfVxuICAgICAgfSkgPT5cbiAgICAgICAgY2x1c3RlclxuICAgICAgICAgID8gdGhpcy5yZW5kZXJDbHVzdGVyKGNvb3JkaW5hdGVzLCBjbHVzdGVySWQsIHBvaW50Q291bnQpXG4gICAgICAgICAgOiB0aGlzLnJlbmRlck9iamVjdChjb29yZGluYXRlcywgb2JqZWN0KVxuICAgICk7XG4gIH1cblxuICBnZXRDbHVzdGVyT2JqZWN0cyhjbHVzdGVySWQ6IG51bWJlcik6IE9ialR5cGVbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3N1cGVyQ2x1c3RlclxuICAgICAgLmdldExlYXZlcyhjbHVzdGVySWQsIEluZmluaXR5KVxuICAgICAgLm1hcChvYmplY3QgPT4gb2JqZWN0LnByb3BlcnRpZXMub2JqZWN0KTtcbiAgfVxuXG4gIC8vIE92ZXJyaWRlIHRvIHByb3ZpZGUgaXRlbXMgdGhhdCBuZWVkIGNsdXN0ZXJpbmcuXG4gIC8vIElmIHRoZSBpdGVtcyBoYXZlIG5vdCBjaGFuZ2VkIHBsZWFzZSBwcm92aWRlIHRoZSBzYW1lIGFycmF5IHRvIGF2b2lkXG4gIC8vIHJlZ2VuZXJhdGlvbiBvZiB0aGUgY2x1c3RlciB3aGljaCBjYXVzZXMgcGVyZm9ybWFuY2UgaXNzdWVzLlxuICBnZXRBbGxPYmplY3RzKCk6IE9ialR5cGVbXSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLy8gb3ZlcnJpZGUgdG8gcHJvdmlkZSBjb29yZGluYXRlcyBmb3IgZWFjaCBvYmplY3Qgb2YgZ2V0QWxsT2JqZWN0cygpXG4gIGdldE9iamVjdENvb3JkaW5hdGVzKG9iajogT2JqVHlwZSk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgIHJldHVybiBbMCwgMF07XG4gIH1cblxuICAvLyBHZXQgb3B0aW9ucyBvYmplY3QgdXNlZCB3aGVuIGluc3RhbnRpYXRpbmcgc3VwZXJjbHVzdGVyXG4gIGdldENsdXN0ZXJPcHRpb25zKCk6ID9PYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICBtYXhab29tOiAyMFxuICAgIH07XG4gIH1cblxuICAvLyBvdmVycmlkZSB0byByZXR1cm4gYW4gSHRtbE92ZXJsYXlJdGVtXG4gIHJlbmRlck9iamVjdChjb29yZGluYXRlczogbnVtYmVyW10sIG9iajogT2JqVHlwZSk6ID9PYmplY3Qge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gb3ZlcnJpZGUgdG8gcmV0dXJuIGFuIEh0bWxPdmVybGF5SXRlbVxuICAvLyB1c2UgZ2V0Q2x1c3Rlck9iamVjdHMoKSB0byBnZXQgY2x1c3RlciBjb250ZW50c1xuICByZW5kZXJDbHVzdGVyKGNvb3JkaW5hdGVzOiBudW1iZXJbXSwgY2x1c3RlcklkOiBudW1iZXIsIHBvaW50Q291bnQ6IG51bWJlcik6ID9PYmplY3Qge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iXX0=