"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("events"));

var _document = _interopRequireDefault(require("global/document"));

var _window = _interopRequireDefault(require("global/window"));

var _keplerOudatedDeck = require("kepler-oudated-deck.gl-core");

var _deckDrawer = _interopRequireDefault(require("./deck-renderer/deck-drawer"));

var _layerMouseEvent = _interopRequireDefault(require("./layer-mouse-event"));

var _nebulaLayer = _interopRequireDefault(require("./nebula-layer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LOGGER_PREFIX = 'Nebula: ';

var Nebula =
/*#__PURE__*/
function () {
  function Nebula() {
    var _this = this;

    _classCallCheck(this, Nebula);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "deckgl", void 0);

    _defineProperty(this, "mainContainer", void 0);

    _defineProperty(this, "deckglMouseOverInfo", void 0);

    _defineProperty(this, "_deckDrawer", void 0);

    _defineProperty(this, "_mouseWasDown", void 0);

    _defineProperty(this, "wmViewport", void 0);

    _defineProperty(this, "queryObjectEvents", new _events.default());

    _defineProperty(this, "forceUpdate", void 0);

    _defineProperty(this, "inited", void 0);

    _defineProperty(this, "_onMouseEvent", function (event) {
      if (!_this._isNebulaEvent(event)) {
        return;
      }

      if (event.type === 'mousedown') {
        _this._mouseWasDown = true;
      } // offsetX/Y of the MouseEvent provides the offset in the X/Y coordinate
      // of the mouse pointer between that event and the padding edge of the target node.
      // We set our listener to document so we need to adjust offsetX/Y
      // in case the target is not be our WebGL canvas.


      var _ref = _this.mainContainer ? _this.mainContainer.getBoundingClientRect() : {},
          _ref$top = _ref.top,
          top = _ref$top === void 0 ? 0 : _ref$top,
          _ref$left = _ref.left,
          left = _ref$left === void 0 ? 0 : _ref$left;

      var proxyEvent = new Proxy(event, {
        get: function get(original, propertyName) {
          if (propertyName === 'offsetX') {
            return original.pageX - left;
          }

          if (propertyName === 'offsetY') {
            return original.pageY - top;
          } // TODO: Properly use pointer events


          if (propertyName === 'type') {
            return original.type.replace('pointer', 'mouse');
          }

          var result = original[propertyName];

          if (typeof result === 'function') {
            return result.bind(original);
          }

          return result;
        }
      });

      _this._handleDeckGLEvent(proxyEvent);
    });
  }

  _createClass(Nebula, [{
    key: "init",
    value: function init(props) {
      var _this2 = this;

      this.props = props;
      this.wmViewport = new _keplerOudatedDeck.WebMercatorViewport(this.props.viewport); // TODO: Properly use pointer events: ['click', 'dblclick', 'pointermove', 'pointerup', 'pointerdown']

      ['click', 'dblclick', 'mousemove', 'mouseup', 'mousedown'].forEach(function (name) {
        return _document.default.addEventListener(name, _this2._onMouseEvent, true);
      });
    }
  }, {
    key: "detach",
    value: function detach() {
      var _this3 = this;

      // TODO: Properly use pointer events: ['click', 'dblclick', 'pointermove', 'pointerup', 'pointerdown']
      ['click', 'dblclick', 'mousemove', 'mouseup', 'mousedown'].forEach(function (name) {
        return _document.default.removeEventListener(name, _this3._onMouseEvent, true);
      });
    }
  }, {
    key: "updateProps",
    value: function updateProps(newProps) {
      this.props = newProps;
      var viewport = this.props.viewport;
      this.wmViewport = new _keplerOudatedDeck.WebMercatorViewport(viewport);
    }
  }, {
    key: "log",
    value: function log(message) {
      var logger = this.props.logger;

      if (logger && logger.info) {
        logger.info(LOGGER_PREFIX + message);
      }
    }
  }, {
    key: "updateAllDeckObjects",
    value: function updateAllDeckObjects() {
      this.getAllLayers().forEach(function (layer) {
        if (layer && layer.deckCache) {
          layer.deckCache.updateAllDeckObjects();
        }
      });
      this.forceUpdate();
    }
  }, {
    key: "updateDeckObjectsByIds",
    value: function updateDeckObjectsByIds(ids) {
      this.getAllLayers().forEach(function (layer) {
        if (layer && layer.deckCache) {
          layer.deckCache.updateDeckObjectsByIds(ids);
        }
      });
      this.forceUpdate();
    }
  }, {
    key: "rerenderLayers",
    value: function rerenderLayers() {
      this.updateAllDeckObjects();
    }
  }, {
    key: "_isNebulaEvent",
    value: function _isNebulaEvent(_ref2) {
      var buttons = _ref2.buttons,
          target = _ref2.target,
          type = _ref2.type;
      var viewport = this.props.viewport; // allow mouseup event aggressively to cancel drag properly
      // TODO: use pointer capture setPointerCapture() to capture mouseup properly after deckgl

      if (this._mouseWasDown && type === 'mouseup') {
        this._mouseWasDown = false;
        return true;
      } // allow mousemove event while dragging


      if (type === 'mousemove' && buttons > 0) {
        return true;
      }

      if (!target.getBoundingClientRect) {
        return false;
      }

      var rect = target.getBoundingClientRect(); // Only listen to events coming from the basemap
      // identified by the canvas of the same size as viewport.
      // Need to round the rect dimension as some monitors
      // have some sub-pixel difference with viewport.

      return Math.round(rect.width) === Math.round(viewport.width) && Math.round(rect.height) === Math.round(viewport.height);
    }
  }, {
    key: "getMouseGroundPosition",
    value: function getMouseGroundPosition(event) {
      return this.wmViewport.unproject([event.offsetX, event.offsetY]);
    }
  }, {
    key: "unprojectMousePosition",
    value: function unprojectMousePosition(mousePosition) {
      return this.wmViewport.unproject(mousePosition);
    }
  }, {
    key: "_handleDeckGLEvent",
    value: function _handleDeckGLEvent(event) {
      var deckgl = this.deckgl,
          _this$props = this.props,
          onMapMouseEvent = _this$props.onMapMouseEvent,
          selectionType = _this$props.selectionType,
          eventFilter = _this$props.eventFilter;
      var sendMapEvent = true;
      var cursor = 'auto';

      if (event && deckgl && selectionType) {
        if (!this._deckDrawer) this._deckDrawer = new _deckDrawer.default(this);
        var lngLat = this.getMouseGroundPosition(event);
        if (eventFilter && !eventFilter(lngLat, event)) return;

        var drawerResult = this._deckDrawer.handleEvent(event, lngLat, selectionType);

        if (drawerResult.redraw) this.forceUpdate();
        return;
      }

      if (event && deckgl && (!event.buttons || event.type !== 'mousemove')) {
        // TODO: sort by mouse priority
        var layerIds = deckgl.props.layers.filter(function (l) {
          return l && l.props && l.props.nebulaLayer && l.props.nebulaLayer.enablePicking;
        }).map(function (l) {
          return l.id;
        });
        var pickingInfo = deckgl.pickObject({
          x: event.offsetX,
          y: event.offsetY,
          radius: 5,
          layerIds: layerIds
        });
        this.queryObjectEvents.emit('pick', {
          event: event,
          pickingInfo: pickingInfo
        });

        if (pickingInfo) {
          sendMapEvent = false;
          var index = pickingInfo.index,
              _lngLat = pickingInfo.lngLat;
          if (eventFilter && !eventFilter(_lngLat, event)) return;
          var deckLayer = pickingInfo.layer,
              object = pickingInfo.object;

          if (deckLayer && deckLayer.props && deckLayer.props.nebulaLayer && deckLayer.props.nebulaLayer.eventHandler) {
            deckLayer.props.nebulaLayer.eventHandler(event, pickingInfo);
          }

          var original = object.original || deckLayer.props.nebulaLayer && deckLayer.props.nebulaLayer.deckCache && deckLayer.props.nebulaLayer.deckCache.originals[index];

          if (original) {
            this.deckglMouseOverInfo = {
              originalLayer: deckLayer.props.nebulaLayer,
              index: index
            };
            var nebulaMouseEvent = new _layerMouseEvent.default(event, {
              data: original,
              metadata: object.metadata,
              groundPoint: _lngLat,
              nebula: this
            });
            deckLayer.props.nebulaLayer.emit(event.type, nebulaMouseEvent);
            this.forceUpdate();
          }

          cursor = 'pointer';
        }
      }

      if (_document.default.documentElement) {
        _document.default.documentElement.style.cursor = cursor;
      }

      if (sendMapEvent) {
        this.deckglMouseOverInfo = null;

        var _lngLat2 = this.getMouseGroundPosition(event);

        if (eventFilter && !eventFilter(_lngLat2, event)) return; // send to layers first

        var _nebulaMouseEvent = new _layerMouseEvent.default(event, {
          groundPoint: _lngLat2,
          nebula: this
        });

        this.getAllLayers().filter(function (layer) {
          return layer && layer.usesMapEvents;
        }).forEach(function (layer) {
          return layer.emit('mapMouseEvent', _nebulaMouseEvent);
        });
        this.getAllLayers().filter(function (layer) {
          return layer && layer.props && layer.props.nebulaLayer && layer.props.nebulaLayer.mapMouseEvent;
        }).forEach(function (layer) {
          return layer.props.nebulaLayer.mapMouseEvent(_nebulaMouseEvent, layer);
        });

        if (onMapMouseEvent) {
          onMapMouseEvent(event, _lngLat2);
        }
      }
    }
  }, {
    key: "getExtraDeckLayers",
    value: function getExtraDeckLayers() {
      var result = [];
      if (this._deckDrawer) result.push.apply(result, _toConsumableArray(this._deckDrawer.render()));
      return result;
    }
  }, {
    key: "renderDeckLayers",
    value: function renderDeckLayers() {
      var _this4 = this;

      return this.getAllLayers().map(function (layer) {
        return layer instanceof _nebulaLayer.default ? layer.render({
          nebula: _this4
        }) : layer;
      }).filter(Boolean);
    }
  }, {
    key: "getAllLayers",
    value: function getAllLayers() {
      var result = [];
      this.props.layers.filter(Boolean).forEach(function (layer) {
        result.push(layer); // Only NebulaLayers have helpers, Deck GL layers don't.

        if (layer instanceof _nebulaLayer.default) {
          result.push.apply(result, _toConsumableArray(layer.helperLayers));
        }
      });
      return result.filter(Boolean);
    }
  }, {
    key: "getRenderedLayers",
    value: function getRenderedLayers() {
      return _toConsumableArray(this.renderDeckLayers()).concat(_toConsumableArray(this.getExtraDeckLayers()));
    }
  }, {
    key: "updateAndGetRenderedLayers",
    value: function updateAndGetRenderedLayers(layers, viewport, container) {
      if (this.inited) {
        this.updateProps({
          layers: layers,
          viewport: viewport
        });

        this.forceUpdate = function () {
          return container.forceUpdate();
        };
      } else {
        this.inited = true;
        this.init({
          layers: layers,
          viewport: viewport
        });

        this.forceUpdate = function () {
          return container.forceUpdate();
        };

        this.updateAllDeckObjects();
      }

      return this.getRenderedLayers();
    }
  }, {
    key: "setDeck",
    value: function setDeck(deckgl) {
      if (deckgl) {
        this.deckgl = deckgl;
      }
    }
  }, {
    key: "setMainContainer",
    value: function setMainContainer(mainContainer) {
      if (mainContainer) {
        this.mainContainer = mainContainer;
      }
    }
  }]);

  return Nebula;
}();

exports.default = Nebula;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbmVidWxhLmpzIl0sIm5hbWVzIjpbIkxPR0dFUl9QUkVGSVgiLCJOZWJ1bGEiLCJFdmVudEVtaXR0ZXIiLCJldmVudCIsIl9pc05lYnVsYUV2ZW50IiwidHlwZSIsIl9tb3VzZVdhc0Rvd24iLCJtYWluQ29udGFpbmVyIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInByb3h5RXZlbnQiLCJQcm94eSIsImdldCIsIm9yaWdpbmFsIiwicHJvcGVydHlOYW1lIiwicGFnZVgiLCJwYWdlWSIsInJlcGxhY2UiLCJyZXN1bHQiLCJiaW5kIiwiX2hhbmRsZURlY2tHTEV2ZW50IiwicHJvcHMiLCJ3bVZpZXdwb3J0IiwiV2ViTWVyY2F0b3JWaWV3cG9ydCIsInZpZXdwb3J0IiwiZm9yRWFjaCIsIm5hbWUiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb3VzZUV2ZW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm5ld1Byb3BzIiwibWVzc2FnZSIsImxvZ2dlciIsImluZm8iLCJnZXRBbGxMYXllcnMiLCJsYXllciIsImRlY2tDYWNoZSIsInVwZGF0ZUFsbERlY2tPYmplY3RzIiwiZm9yY2VVcGRhdGUiLCJpZHMiLCJ1cGRhdGVEZWNrT2JqZWN0c0J5SWRzIiwiYnV0dG9ucyIsInRhcmdldCIsInJlY3QiLCJNYXRoIiwicm91bmQiLCJ3aWR0aCIsImhlaWdodCIsInVucHJvamVjdCIsIm9mZnNldFgiLCJvZmZzZXRZIiwibW91c2VQb3NpdGlvbiIsImRlY2tnbCIsIm9uTWFwTW91c2VFdmVudCIsInNlbGVjdGlvblR5cGUiLCJldmVudEZpbHRlciIsInNlbmRNYXBFdmVudCIsImN1cnNvciIsIl9kZWNrRHJhd2VyIiwiRGVja0RyYXdlciIsImxuZ0xhdCIsImdldE1vdXNlR3JvdW5kUG9zaXRpb24iLCJkcmF3ZXJSZXN1bHQiLCJoYW5kbGVFdmVudCIsInJlZHJhdyIsImxheWVySWRzIiwibGF5ZXJzIiwiZmlsdGVyIiwibCIsIm5lYnVsYUxheWVyIiwiZW5hYmxlUGlja2luZyIsIm1hcCIsImlkIiwicGlja2luZ0luZm8iLCJwaWNrT2JqZWN0IiwieCIsInkiLCJyYWRpdXMiLCJxdWVyeU9iamVjdEV2ZW50cyIsImVtaXQiLCJpbmRleCIsImRlY2tMYXllciIsIm9iamVjdCIsImV2ZW50SGFuZGxlciIsIm9yaWdpbmFscyIsImRlY2tnbE1vdXNlT3ZlckluZm8iLCJvcmlnaW5hbExheWVyIiwibmVidWxhTW91c2VFdmVudCIsIkxheWVyTW91c2VFdmVudCIsImRhdGEiLCJtZXRhZGF0YSIsImdyb3VuZFBvaW50IiwibmVidWxhIiwiZG9jdW1lbnRFbGVtZW50Iiwic3R5bGUiLCJ1c2VzTWFwRXZlbnRzIiwibWFwTW91c2VFdmVudCIsInB1c2giLCJyZW5kZXIiLCJOZWJ1bGFMYXllciIsIkJvb2xlYW4iLCJoZWxwZXJMYXllcnMiLCJyZW5kZXJEZWNrTGF5ZXJzIiwiZ2V0RXh0cmFEZWNrTGF5ZXJzIiwiY29udGFpbmVyIiwiaW5pdGVkIiwidXBkYXRlUHJvcHMiLCJpbml0IiwiZ2V0UmVuZGVyZWRMYXllcnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxhQUFhLEdBQUcsVUFBdEI7O0lBRXFCQyxNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OytDQWdDZSxJQUFJQyxlQUFKLEU7Ozs7OzsyQ0ErRGxCLFVBQUNDLEtBQUQsRUFBOEI7QUFDNUMsVUFBSSxDQUFDLEtBQUksQ0FBQ0MsY0FBTCxDQUFvQkQsS0FBcEIsQ0FBTCxFQUFpQztBQUMvQjtBQUNEOztBQUVELFVBQUlBLEtBQUssQ0FBQ0UsSUFBTixLQUFlLFdBQW5CLEVBQWdDO0FBQzlCLFFBQUEsS0FBSSxDQUFDQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0QsT0FQMkMsQ0FTNUM7QUFDQTtBQUNBO0FBQ0E7OztBQVo0QyxpQkFhZCxL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Q2tFLFlBQWYsRUFBTjtBQUNEO0FBQ0YsT0FORDtBQVFBLGFBQU9wRixNQUFNLENBQUNrRCxNQUFQLENBQWNpQyxPQUFkLENBQVA7QUFDRDs7O3dDQUVtQjtBQUNsQixnQ0FBVyxLQUFLRSxnQkFBTCxFQUFYLDRCQUF1QyxLQUFLQyxrQkFBTCxFQUF2QztBQUNEOzs7K0NBRTBCckMsTSxFQUFrQjNDLFEsRUFBK0JpRixTLEVBQW1CO0FBQzdGLFVBQUksS0FBS0MsTUFBVCxFQUFpQjtBQUNmLGFBQUtDLFdBQUwsQ0FBaUI7QUFBRXhDLFVBQUFBLE1BQU0sRUFBTkEsTUFBRjtBQUFVM0MsVUFBQUEsUUFBUSxFQUFSQTtBQUFWLFNBQWpCOztBQUNBLGFBQUtlLFdBQUwsR0FBbUI7QUFBQSxpQkFBTWtFLFNBQVMsQ0FBQ2xFLFdBQVYsRUFBTjtBQUFBLFNBQW5CO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsYUFBS21FLE1BQUwsR0FBYyxJQUFkO0FBQ0EsYUFBS0UsSUFBTCxDQUFVO0FBQUV6QyxVQUFBQSxNQUFNLEVBQU5BLE1BQUY7QUFBVTNDLFVBQUFBLFFBQVEsRUFBUkE7QUFBVixTQUFWOztBQUNBLGFBQUtlLFdBQUwsR0FBbUI7QUFBQSxpQkFBTWtFLFNBQVMsQ0FBQ2xFLFdBQVYsRUFBTjtBQUFBLFNBQW5COztBQUNBLGFBQUtELG9CQUFMO0FBQ0Q7O0FBRUQsYUFBTyxLQUFLdUUsaUJBQUwsRUFBUDtBQUNEOzs7NEJBRU94RCxNLEVBQXVCO0FBQzdCLFVBQUlBLE1BQUosRUFBWTtBQUNWLGFBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUNEO0FBQ0Y7OztxQ0FFZ0IvQyxhLEVBQThCO0FBQzdDLFVBQUlBLGFBQUosRUFBbUI7QUFDakIsYUFBS0EsYUFBTCxHQUFxQkEsYUFBckI7QUFDRDtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCB7IFdlYk1lcmNhdG9yVmlld3BvcnQgfSBmcm9tICdrZXBsZXItb3VkYXRlZC1kZWNrLmdsLWNvcmUnO1xuXG5pbXBvcnQgRGVja0RyYXdlciBmcm9tICcuL2RlY2stcmVuZGVyZXIvZGVjay1kcmF3ZXInO1xuaW1wb3J0IExheWVyTW91c2VFdmVudCBmcm9tICcuL2xheWVyLW1vdXNlLWV2ZW50JztcbmltcG9ydCBOZWJ1bGFMYXllciBmcm9tICcuL25lYnVsYS1sYXllcic7XG5cbmNvbnN0IExPR0dFUl9QUkVGSVggPSAnTmVidWxhOiAnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOZWJ1bGEge1xuICBpbml0KHByb3BzOiBPYmplY3QpIHtcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgdGhpcy53bVZpZXdwb3J0ID0gbmV3IFdlYk1lcmNhdG9yVmlld3BvcnQodGhpcy5wcm9wcy52aWV3cG9ydCk7XG5cbiAgICAvLyBUT0RPOiBQcm9wZXJseSB1c2UgcG9pbnRlciBldmVudHM6IFsnY2xpY2snLCAnZGJsY2xpY2snLCAncG9pbnRlcm1vdmUnLCAncG9pbnRlcnVwJywgJ3BvaW50ZXJkb3duJ11cbiAgICBbJ2NsaWNrJywgJ2RibGNsaWNrJywgJ21vdXNlbW92ZScsICdtb3VzZXVwJywgJ21vdXNlZG93biddLmZvckVhY2gobmFtZSA9PlxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCB0aGlzLl9vbk1vdXNlRXZlbnQsIHRydWUpXG4gICAgKTtcbiAgfVxuXG4gIGRldGFjaCgpIHtcbiAgICAvLyBUT0RPOiBQcm9wZXJseSB1c2UgcG9pbnRlciBldmVudHM6IFsnY2xpY2snLCAnZGJsY2xpY2snLCAncG9pbnRlcm1vdmUnLCAncG9pbnRlcnVwJywgJ3BvaW50ZXJkb3duJ11cbiAgICBbJ2NsaWNrJywgJ2RibGNsaWNrJywgJ21vdXNlbW92ZScsICdtb3VzZXVwJywgJ21vdXNlZG93biddLmZvckVhY2gobmFtZSA9PlxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihuYW1lLCB0aGlzLl9vbk1vdXNlRXZlbnQsIHRydWUpXG4gICAgKTtcbiAgfVxuXG4gIHVwZGF0ZVByb3BzKG5ld1Byb3BzOiBPYmplY3QpIHtcbiAgICB0aGlzLnByb3BzID0gbmV3UHJvcHM7XG4gICAgY29uc3QgeyB2aWV3cG9ydCB9ID0gdGhpcy5wcm9wcztcblxuICAgIHRoaXMud21WaWV3cG9ydCA9IG5ldyBXZWJNZXJjYXRvclZpZXdwb3J0KHZpZXdwb3J0KTtcbiAgfVxuXG4gIHByb3BzOiBPYmplY3Q7XG4gIGRlY2tnbDogT2JqZWN0IHwgbnVsbDtcbiAgbWFpbkNvbnRhaW5lcjogT2JqZWN0IHwgbnVsbDtcbiAgZGVja2dsTW91c2VPdmVySW5mbzogP09iamVjdDtcbiAgX2RlY2tEcmF3ZXI6IERlY2tEcmF3ZXI7XG4gIF9tb3VzZVdhc0Rvd246IGJvb2xlYW47XG4gIHdtVmlld3BvcnQ6IFdlYk1lcmNhdG9yVmlld3BvcnQ7XG4gIHF1ZXJ5T2JqZWN0RXZlbnRzOiBFdmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIGZvcmNlVXBkYXRlOiBGdW5jdGlvbjtcbiAgaW5pdGVkOiBib29sZWFuO1xuXG4gIGxvZyhtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBjb25zdCB7IGxvZ2dlciB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAobG9nZ2VyICYmIGxvZ2dlci5pbmZvKSB7XG4gICAgICBsb2dnZXIuaW5mbyhMT0dHRVJfUFJFRklYICsgbWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQWxsRGVja09iamVjdHMoKSB7XG4gICAgdGhpcy5nZXRBbGxMYXllcnMoKS5mb3JFYWNoKGxheWVyID0+IHtcbiAgICAgIGlmIChsYXllciAmJiBsYXllci5kZWNrQ2FjaGUpIHtcbiAgICAgICAgKGxheWVyLmRlY2tDYWNoZTogYW55KS51cGRhdGVBbGxEZWNrT2JqZWN0cygpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfVxuXG4gIHVwZGF0ZURlY2tPYmplY3RzQnlJZHMoaWRzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuZ2V0QWxsTGF5ZXJzKCkuZm9yRWFjaChsYXllciA9PiB7XG4gICAgICBpZiAobGF5ZXIgJiYgbGF5ZXIuZGVja0NhY2hlKSB7XG4gICAgICAgIChsYXllci5kZWNrQ2FjaGU6IGFueSkudXBkYXRlRGVja09iamVjdHNCeUlkcyhpZHMpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgfVxuXG4gIHJlcmVuZGVyTGF5ZXJzKCkge1xuICAgIHRoaXMudXBkYXRlQWxsRGVja09iamVjdHMoKTtcbiAgfVxuXG4gIF9pc05lYnVsYUV2ZW50KHsgYnV0dG9ucywgdGFyZ2V0LCB0eXBlIH06IE9iamVjdCkge1xuICAgIGNvbnN0IHsgdmlld3BvcnQgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAvLyBhbGxvdyBtb3VzZXVwIGV2ZW50IGFnZ3Jlc3NpdmVseSB0byBjYW5jZWwgZHJhZyBwcm9wZXJseVxuICAgIC8vIFRPRE86IHVzZSBwb2ludGVyIGNhcHR1cmUgc2V0UG9pbnRlckNhcHR1cmUoKSB0byBjYXB0dXJlIG1vdXNldXAgcHJvcGVybHkgYWZ0ZXIgZGVja2dsXG4gICAgaWYgKHRoaXMuX21vdXNlV2FzRG93biAmJiB0eXBlID09PSAnbW91c2V1cCcpIHtcbiAgICAgIHRoaXMuX21vdXNlV2FzRG93biA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gYWxsb3cgbW91c2Vtb3ZlIGV2ZW50IHdoaWxlIGRyYWdnaW5nXG4gICAgaWYgKHR5cGUgPT09ICdtb3VzZW1vdmUnICYmIGJ1dHRvbnMgPiAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIXRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIC8vIE9ubHkgbGlzdGVuIHRvIGV2ZW50cyBjb21pbmcgZnJvbSB0aGUgYmFzZW1hcFxuICAgIC8vIGlkZW50aWZpZWQgYnkgdGhlIGNhbnZhcyBvZiB0aGUgc2FtZSBzaXplIGFzIHZpZXdwb3J0LlxuICAgIC8vIE5lZWQgdG8gcm91bmQgdGhlIHJlY3QgZGltZW5zaW9uIGFzIHNvbWUgbW9uaXRvcnNcbiAgICAvLyBoYXZlIHNvbWUgc3ViLXBpeGVsIGRpZmZlcmVuY2Ugd2l0aCB2aWV3cG9ydC5cbiAgICByZXR1cm4gKFxuICAgICAgTWF0aC5yb3VuZChyZWN0LndpZHRoKSA9PT0gTWF0aC5yb3VuZCh2aWV3cG9ydC53aWR0aCkgJiZcbiAgICAgIE1hdGgucm91bmQocmVjdC5oZWlnaHQpID09PSBNYXRoLnJvdW5kKHZpZXdwb3J0LmhlaWdodClcbiAgICApO1xuICB9XG5cbiAgX29uTW91c2VFdmVudCA9IChldmVudDogd2luZG93Lk1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAoIXRoaXMuX2lzTmVidWxhRXZlbnQoZXZlbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZWRvd24nKSB7XG4gICAgICB0aGlzLl9tb3VzZVdhc0Rvd24gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIG9mZnNldFgvWSBvZiB0aGUgTW91c2VFdmVudCBwcm92aWRlcyB0aGUgb2Zmc2V0IGluIHRoZSBYL1kgY29vcmRpbmF0ZVxuICAgIC8vIG9mIHRoZSBtb3VzZSBwb2ludGVyIGJldHdlZW4gdGhhdCBldmVudCBhbmQgdGhlIHBhZGRpbmcgZWRnZSBvZiB0aGUgdGFyZ2V0IG5vZGUuXG4gICAgLy8gV2Ugc2V0IG91ciBsaXN0ZW5lciB0byBkb2N1bWVudCBzbyB3ZSBuZWVkIHRvIGFkanVzdCBvZmZzZXRYL1lcbiAgICAvLyBpbiBjYXNlIHRoZSB0YXJnZXQgaXMgbm90IGJlIG91ciBXZWJHTCBjYW52YXMuXG4gICAgY29uc3QgeyB0b3AgPSAwLCBsZWZ0ID0gMCB9ID0gdGhpcy5tYWluQ29udGFpbmVyXG4gICAgICA/IHRoaXMubWFpbkNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgOiB7fTtcbiAgICBjb25zdCBwcm94eUV2ZW50ID0gbmV3IFByb3h5KGV2ZW50LCB7XG4gICAgICBnZXQ6IChvcmlnaW5hbDogYW55LCBwcm9wZXJ0eU5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSAnb2Zmc2V0WCcpIHtcbiAgICAgICAgICByZXR1cm4gb3JpZ2luYWwucGFnZVggLSBsZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3BlcnR5TmFtZSA9PT0gJ29mZnNldFknKSB7XG4gICAgICAgICAgcmV0dXJuIG9yaWdpbmFsLnBhZ2VZIC0gdG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETzogUHJvcGVybHkgdXNlIHBvaW50ZXIgZXZlbnRzXG4gICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09ICd0eXBlJykge1xuICAgICAgICAgIHJldHVybiBvcmlnaW5hbC50eXBlLnJlcGxhY2UoJ3BvaW50ZXInLCAnbW91c2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG9yaWdpbmFsW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5iaW5kKG9yaWdpbmFsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5faGFuZGxlRGVja0dMRXZlbnQocHJveHlFdmVudCk7XG4gIH07XG5cbiAgZ2V0TW91c2VHcm91bmRQb3NpdGlvbihldmVudDogT2JqZWN0KSB7XG4gICAgcmV0dXJuIHRoaXMud21WaWV3cG9ydC51bnByb2plY3QoW2V2ZW50Lm9mZnNldFgsIGV2ZW50Lm9mZnNldFldKTtcbiAgfVxuXG4gIHVucHJvamVjdE1vdXNlUG9zaXRpb24obW91c2VQb3NpdGlvbjogW251bWJlciwgbnVtYmVyXSk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgIHJldHVybiB0aGlzLndtVmlld3BvcnQudW5wcm9qZWN0KG1vdXNlUG9zaXRpb24pO1xuICB9XG5cbiAgX2hhbmRsZURlY2tHTEV2ZW50KGV2ZW50OiBPYmplY3QpIHtcbiAgICBjb25zdCB7XG4gICAgICBkZWNrZ2wsXG4gICAgICBwcm9wczogeyBvbk1hcE1vdXNlRXZlbnQsIHNlbGVjdGlvblR5cGUsIGV2ZW50RmlsdGVyIH1cbiAgICB9ID0gdGhpcztcbiAgICBsZXQgc2VuZE1hcEV2ZW50ID0gdHJ1ZTtcbiAgICBsZXQgY3Vyc29yID0gJ2F1dG8nO1xuXG4gICAgaWYgKGV2ZW50ICYmIGRlY2tnbCAmJiBzZWxlY3Rpb25UeXBlKSB7XG4gICAgICBpZiAoIXRoaXMuX2RlY2tEcmF3ZXIpIHRoaXMuX2RlY2tEcmF3ZXIgPSBuZXcgRGVja0RyYXdlcih0aGlzKTtcblxuICAgICAgY29uc3QgbG5nTGF0ID0gdGhpcy5nZXRNb3VzZUdyb3VuZFBvc2l0aW9uKGV2ZW50KTtcbiAgICAgIGlmIChldmVudEZpbHRlciAmJiAhZXZlbnRGaWx0ZXIobG5nTGF0LCBldmVudCkpIHJldHVybjtcblxuICAgICAgY29uc3QgZHJhd2VyUmVzdWx0ID0gdGhpcy5fZGVja0RyYXdlci5oYW5kbGVFdmVudChldmVudCwgbG5nTGF0LCBzZWxlY3Rpb25UeXBlKTtcbiAgICAgIGlmIChkcmF3ZXJSZXN1bHQucmVkcmF3KSB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50ICYmIGRlY2tnbCAmJiAoIWV2ZW50LmJ1dHRvbnMgfHwgZXZlbnQudHlwZSAhPT0gJ21vdXNlbW92ZScpKSB7XG4gICAgICAvLyBUT0RPOiBzb3J0IGJ5IG1vdXNlIHByaW9yaXR5XG4gICAgICBjb25zdCBsYXllcklkcyA9IGRlY2tnbC5wcm9wcy5sYXllcnNcbiAgICAgICAgLmZpbHRlcihsID0+IGwgJiYgbC5wcm9wcyAmJiBsLnByb3BzLm5lYnVsYUxheWVyICYmIGwucHJvcHMubmVidWxhTGF5ZXIuZW5hYmxlUGlja2luZylcbiAgICAgICAgLm1hcChsID0+IGwuaWQpO1xuXG4gICAgICBjb25zdCBwaWNraW5nSW5mbyA9IGRlY2tnbC5waWNrT2JqZWN0KHtcbiAgICAgICAgeDogZXZlbnQub2Zmc2V0WCxcbiAgICAgICAgeTogZXZlbnQub2Zmc2V0WSxcbiAgICAgICAgcmFkaXVzOiA1LFxuICAgICAgICBsYXllcklkc1xuICAgICAgfSk7XG4gICAgICB0aGlzLnF1ZXJ5T2JqZWN0RXZlbnRzLmVtaXQoJ3BpY2snLCB7IGV2ZW50LCBwaWNraW5nSW5mbyB9KTtcbiAgICAgIGlmIChwaWNraW5nSW5mbykge1xuICAgICAgICBzZW5kTWFwRXZlbnQgPSBmYWxzZTtcblxuICAgICAgICBjb25zdCB7IGluZGV4LCBsbmdMYXQgfSA9IHBpY2tpbmdJbmZvO1xuICAgICAgICBpZiAoZXZlbnRGaWx0ZXIgJiYgIWV2ZW50RmlsdGVyKGxuZ0xhdCwgZXZlbnQpKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgeyBsYXllcjogZGVja0xheWVyLCBvYmplY3QgfSA9IHBpY2tpbmdJbmZvO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBkZWNrTGF5ZXIgJiZcbiAgICAgICAgICBkZWNrTGF5ZXIucHJvcHMgJiZcbiAgICAgICAgICBkZWNrTGF5ZXIucHJvcHMubmVidWxhTGF5ZXIgJiZcbiAgICAgICAgICBkZWNrTGF5ZXIucHJvcHMubmVidWxhTGF5ZXIuZXZlbnRIYW5kbGVyXG4gICAgICAgICkge1xuICAgICAgICAgIGRlY2tMYXllci5wcm9wcy5uZWJ1bGFMYXllci5ldmVudEhhbmRsZXIoZXZlbnQsIHBpY2tpbmdJbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsID1cbiAgICAgICAgICBvYmplY3Qub3JpZ2luYWwgfHxcbiAgICAgICAgICAoZGVja0xheWVyLnByb3BzLm5lYnVsYUxheWVyICYmXG4gICAgICAgICAgICBkZWNrTGF5ZXIucHJvcHMubmVidWxhTGF5ZXIuZGVja0NhY2hlICYmXG4gICAgICAgICAgICBkZWNrTGF5ZXIucHJvcHMubmVidWxhTGF5ZXIuZGVja0NhY2hlLm9yaWdpbmFsc1tpbmRleF0pO1xuXG4gICAgICAgIGlmIChvcmlnaW5hbCkge1xuICAgICAgICAgIHRoaXMuZGVja2dsTW91c2VPdmVySW5mbyA9IHsgb3JpZ2luYWxMYXllcjogZGVja0xheWVyLnByb3BzLm5lYnVsYUxheWVyLCBpbmRleCB9O1xuICAgICAgICAgIGNvbnN0IG5lYnVsYU1vdXNlRXZlbnQgPSBuZXcgTGF5ZXJNb3VzZUV2ZW50KGV2ZW50LCB7XG4gICAgICAgICAgICBkYXRhOiBvcmlnaW5hbCxcbiAgICAgICAgICAgIG1ldGFkYXRhOiBvYmplY3QubWV0YWRhdGEsXG4gICAgICAgICAgICBncm91bmRQb2ludDogbG5nTGF0LFxuICAgICAgICAgICAgbmVidWxhOiB0aGlzXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZGVja0xheWVyLnByb3BzLm5lYnVsYUxheWVyLmVtaXQoZXZlbnQudHlwZSwgbmVidWxhTW91c2VFdmVudCk7XG4gICAgICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3Vyc29yID0gJ3BvaW50ZXInO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5jdXJzb3IgPSBjdXJzb3I7XG4gICAgfVxuXG4gICAgaWYgKHNlbmRNYXBFdmVudCkge1xuICAgICAgdGhpcy5kZWNrZ2xNb3VzZU92ZXJJbmZvID0gbnVsbDtcblxuICAgICAgY29uc3QgbG5nTGF0ID0gdGhpcy5nZXRNb3VzZUdyb3VuZFBvc2l0aW9uKGV2ZW50KTtcbiAgICAgIGlmIChldmVudEZpbHRlciAmJiAhZXZlbnRGaWx0ZXIobG5nTGF0LCBldmVudCkpIHJldHVybjtcblxuICAgICAgLy8gc2VuZCB0byBsYXllcnMgZmlyc3RcbiAgICAgIGNvbnN0IG5lYnVsYU1vdXNlRXZlbnQgPSBuZXcgTGF5ZXJNb3VzZUV2ZW50KGV2ZW50LCB7XG4gICAgICAgIGdyb3VuZFBvaW50OiBsbmdMYXQsXG4gICAgICAgIG5lYnVsYTogdGhpc1xuICAgICAgfSk7XG4gICAgICB0aGlzLmdldEFsbExheWVycygpXG4gICAgICAgIC5maWx0ZXIobGF5ZXIgPT4gbGF5ZXIgJiYgbGF5ZXIudXNlc01hcEV2ZW50cylcbiAgICAgICAgLmZvckVhY2gobGF5ZXIgPT4gbGF5ZXIuZW1pdCgnbWFwTW91c2VFdmVudCcsIG5lYnVsYU1vdXNlRXZlbnQpKTtcblxuICAgICAgdGhpcy5nZXRBbGxMYXllcnMoKVxuICAgICAgICAuZmlsdGVyKFxuICAgICAgICAgIGxheWVyID0+XG4gICAgICAgICAgICBsYXllciAmJiBsYXllci5wcm9wcyAmJiBsYXllci5wcm9wcy5uZWJ1bGFMYXllciAmJiBsYXllci5wcm9wcy5uZWJ1bGFMYXllci5tYXBNb3VzZUV2ZW50XG4gICAgICAgIClcbiAgICAgICAgLmZvckVhY2gobGF5ZXIgPT4gbGF5ZXIucHJvcHMubmVidWxhTGF5ZXIubWFwTW91c2VFdmVudChuZWJ1bGFNb3VzZUV2ZW50LCBsYXllcikpO1xuXG4gICAgICBpZiAob25NYXBNb3VzZUV2ZW50KSB7XG4gICAgICAgIG9uTWFwTW91c2VFdmVudChldmVudCwgbG5nTGF0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRFeHRyYURlY2tMYXllcnMoKTogT2JqZWN0W10ge1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG4gICAgaWYgKHRoaXMuX2RlY2tEcmF3ZXIpIHJlc3VsdC5wdXNoKC4uLnRoaXMuX2RlY2tEcmF3ZXIucmVuZGVyKCkpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHJlbmRlckRlY2tMYXllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWxsTGF5ZXJzKClcbiAgICAgIC5tYXAobGF5ZXIgPT4gKGxheWVyIGluc3RhbmNlb2YgTmVidWxhTGF5ZXIgPyBsYXllci5yZW5kZXIoeyBuZWJ1bGE6IHRoaXMgfSkgOiBsYXllcikpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuICB9XG5cbiAgZ2V0QWxsTGF5ZXJzKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG4gICAgdGhpcy5wcm9wcy5sYXllcnMuZmlsdGVyKEJvb2xlYW4pLmZvckVhY2gobGF5ZXIgPT4ge1xuICAgICAgcmVzdWx0LnB1c2gobGF5ZXIpO1xuICAgICAgLy8gT25seSBOZWJ1bGFMYXllcnMgaGF2ZSBoZWxwZXJzLCBEZWNrIEdMIGxheWVycyBkb24ndC5cbiAgICAgIGlmIChsYXllciBpbnN0YW5jZW9mIE5lYnVsYUxheWVyKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKC4uLmxheWVyLmhlbHBlckxheWVycyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0LmZpbHRlcihCb29sZWFuKTtcbiAgfVxuXG4gIGdldFJlbmRlcmVkTGF5ZXJzKCkge1xuICAgIHJldHVybiBbLi4udGhpcy5yZW5kZXJEZWNrTGF5ZXJzKCksIC4uLnRoaXMuZ2V0RXh0cmFEZWNrTGF5ZXJzKCldO1xuICB9XG5cbiAgdXBkYXRlQW5kR2V0UmVuZGVyZWRMYXllcnMobGF5ZXJzOiBPYmplY3RbXSwgdmlld3BvcnQ6IFdlYk1lcmNhdG9yVmlld3BvcnQsIGNvbnRhaW5lcjogT2JqZWN0KSB7XG4gICAgaWYgKHRoaXMuaW5pdGVkKSB7XG4gICAgICB0aGlzLnVwZGF0ZVByb3BzKHsgbGF5ZXJzLCB2aWV3cG9ydCB9KTtcbiAgICAgIHRoaXMuZm9yY2VVcGRhdGUgPSAoKSA9PiBjb250YWluZXIuZm9yY2VVcGRhdGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5pbml0KHsgbGF5ZXJzLCB2aWV3cG9ydCB9KTtcbiAgICAgIHRoaXMuZm9yY2VVcGRhdGUgPSAoKSA9PiBjb250YWluZXIuZm9yY2VVcGRhdGUoKTtcbiAgICAgIHRoaXMudXBkYXRlQWxsRGVja09iamVjdHMoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nZXRSZW5kZXJlZExheWVycygpO1xuICB9XG5cbiAgc2V0RGVjayhkZWNrZ2w6IE9iamVjdCB8IG51bGwpIHtcbiAgICBpZiAoZGVja2dsKSB7XG4gICAgICB0aGlzLmRlY2tnbCA9IGRlY2tnbDtcbiAgICB9XG4gIH1cblxuICBzZXRNYWluQ29udGFpbmVyKG1haW5Db250YWluZXI6IE9iamVjdCB8IG51bGwpIHtcbiAgICBpZiAobWFpbkNvbnRhaW5lcikge1xuICAgICAgdGhpcy5tYWluQ29udGFpbmVyID0gbWFpbkNvbnRhaW5lcjtcbiAgICB9XG4gIH1cbn1cbiJdfQ==