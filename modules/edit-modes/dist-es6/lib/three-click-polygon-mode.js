"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThreeClickPolygonMode = void 0;

var _geojsonEditMode = require("./geojson-edit-mode.js");

class ThreeClickPolygonMode extends _geojsonEditMode.BaseGeoJsonEditMode {
  handleClickAdapter(event, props) {
    super.handleClickAdapter(event, props);
    var tentativeFeature = this.getTentativeFeature();
    var clickSequence = this.getClickSequence();

    if (clickSequence.length > 2 && tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
      var editAction = this.getAddFeatureOrBooleanPolygonAction(tentativeFeature.geometry, props);
      this.resetClickSequence();

      this._setTentativeFeature(null);

      return editAction;
    }

    return null;
  }

  getCursorAdapter() {
    return 'cell';
  }

}

exports.ThreeClickPolygonMode = ThreeClickPolygonMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvdGhyZWUtY2xpY2stcG9seWdvbi1tb2RlLmpzIl0sIm5hbWVzIjpbIlRocmVlQ2xpY2tQb2x5Z29uTW9kZSIsIkJhc2VHZW9Kc29uRWRpdE1vZGUiLCJoYW5kbGVDbGlja0FkYXB0ZXIiLCJldmVudCIsInByb3BzIiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsImxlbmd0aCIsImdlb21ldHJ5IiwidHlwZSIsImVkaXRBY3Rpb24iLCJnZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbiIsInJlc2V0Q2xpY2tTZXF1ZW5jZSIsIl9zZXRUZW50YXRpdmVGZWF0dXJlIiwiZ2V0Q3Vyc29yQWRhcHRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUlBOztBQUVPLE1BQU1BLHFCQUFOLFNBQW9DQyxvQ0FBcEMsQ0FBd0Q7QUFDN0RDLEVBQUFBLGtCQUFrQixDQUFDQyxLQUFELEVBQW9CQyxLQUFwQixFQUE2RTtBQUM3RixVQUFNRixrQkFBTixDQUF5QkMsS0FBekIsRUFBZ0NDLEtBQWhDO0FBRUEsUUFBTUMsZ0JBQWdCLEdBQUcsS0FBS0MsbUJBQUwsRUFBekI7QUFDQSxRQUFNQyxhQUFhLEdBQUcsS0FBS0MsZ0JBQUwsRUFBdEI7O0FBRUEsUUFDRUQsYUFBYSxDQUFDRSxNQUFkLEdBQXVCLENBQXZCLElBQ0FKLGdCQURBLElBRUFBLGdCQUFnQixDQUFDSyxRQUFqQixDQUEwQkMsSUFBMUIsS0FBbUMsU0FIckMsRUFJRTtBQUNBLFVBQU1DLFVBQVUsR0FBRyxLQUFLQyxtQ0FBTCxDQUF5Q1IsZ0JBQWdCLENBQUNLLFFBQTFELEVBQW9FTixLQUFwRSxDQUFuQjtBQUNBLFdBQUtVLGtCQUFMOztBQUNBLFdBQUtDLG9CQUFMLENBQTBCLElBQTFCOztBQUNBLGFBQU9ILFVBQVA7QUFDRDs7QUFFRCxXQUFPLElBQVA7QUFDRDs7QUFFREksRUFBQUEsZ0JBQWdCLEdBQUc7QUFDakIsV0FBTyxNQUFQO0FBQ0Q7O0FBdkI0RCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB0eXBlIHsgQ2xpY2tFdmVudCwgTW9kZVByb3BzIH0gZnJvbSAnLi4vdHlwZXMuanMnO1xuaW1wb3J0IHR5cGUgeyBGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJy4uL2dlb2pzb24tdHlwZXMuanMnO1xuaW1wb3J0IHsgQmFzZUdlb0pzb25FZGl0TW9kZSwgdHlwZSBHZW9Kc29uRWRpdEFjdGlvbiB9IGZyb20gJy4vZ2VvanNvbi1lZGl0LW1vZGUuanMnO1xuXG5leHBvcnQgY2xhc3MgVGhyZWVDbGlja1BvbHlnb25Nb2RlIGV4dGVuZHMgQmFzZUdlb0pzb25FZGl0TW9kZSB7XG4gIGhhbmRsZUNsaWNrQWRhcHRlcihldmVudDogQ2xpY2tFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiA/R2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIHN1cGVyLmhhbmRsZUNsaWNrQWRhcHRlcihldmVudCwgcHJvcHMpO1xuXG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmIChcbiAgICAgIGNsaWNrU2VxdWVuY2UubGVuZ3RoID4gMiAmJlxuICAgICAgdGVudGF0aXZlRmVhdHVyZSAmJlxuICAgICAgdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSAnUG9seWdvbidcbiAgICApIHtcbiAgICAgIGNvbnN0IGVkaXRBY3Rpb24gPSB0aGlzLmdldEFkZEZlYXR1cmVPckJvb2xlYW5Qb2x5Z29uQWN0aW9uKHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnksIHByb3BzKTtcbiAgICAgIHRoaXMucmVzZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuICAgICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRDdXJzb3JBZGFwdGVyKCkge1xuICAgIHJldHVybiAnY2VsbCc7XG4gIH1cbn1cbiJdfQ==