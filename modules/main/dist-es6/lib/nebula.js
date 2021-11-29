"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _events = _interopRequireDefault(require("events"));

var _document = _interopRequireDefault(require("global/document"));

var _window = _interopRequireDefault(require("global/window"));

var _keplerOutdatedDeck = require("kepler-outdated-deck.gl-core");

var _deckDrawer = _interopRequireDefault(require("./deck-renderer/deck-drawer"));

var _layerMouseEvent = _interopRequireDefault(require("./layer-mouse-event"));

var _nebulaLayer = _interopRequireDefault(require("./nebula-layer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LOGGER_PREFIX = 'Nebula: ';

class Nebula {
  constructor() {
    var _this = this;

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

  init(props) {
    var _this2 = this;

    this.props = props;
    this.wmViewport = new _keplerOutdatedDeck.WebMercatorViewport(this.props.viewport); // TODO: Properly use pointer events: ['click', 'dblclick', 'pointermove', 'pointerup', 'pointerdown']

    ['click', 'dblclick', 'mousemove', 'mouseup', 'mousedown'].forEach(function (name) {
      return _document.default.addEventListener(name, _this2._onMouseEvent, true);
    });
  }

  detach() {
    var _this3 = this;

    // TODO: Properly use pointer events: ['click', 'dblclick', 'pointermove', 'pointerup', 'pointerdown']
    ['click', 'dblclick', 'mousemove', 'mouseup', 'mousedown'].forEach(function (name) {
      return _document.default.removeEventListener(name, _this3._onMouseEvent, true);
    });
  }

  updateProps(newProps) {
    this.props = newProps;
    var viewport = this.props.viewport;
    this.wmViewport = new _keplerOutdatedDeck.WebMercatorViewport(viewport);
  }

  log(message) {
    var logger = this.props.logger;

    if (logger && logger.info) {
      logger.info(LOGGER_PREFIX + message);
    }
  }

  updateAllDeckObjects() {
    this.getAllLayers().forEach(function (layer) {
      if (layer && layer.deckCache) {
        layer.deckCache.updateAllDeckObjects();
      }
    });
    this.forceUpdate();
  }

  updateDeckObjectsByIds(ids) {
    this.getAllLayers().forEach(function (layer) {
      if (layer && layer.deckCache) {
        layer.deckCache.updateDeckObjectsByIds(ids);
      }
    });
    this.forceUpdate();
  }

  rerenderLayers() {
    this.updateAllDeckObjects();
  }

  _isNebulaEvent(_ref2) {
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

  getMouseGroundPosition(event) {
    return this.wmViewport.unproject([event.offsetX, event.offsetY]);
  }

  unprojectMousePosition(mousePosition) {
    return this.wmViewport.unproject(mousePosition);
  }

  _handleDeckGLEvent(event) {
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

  getExtraDeckLayers() {
    var result = [];
    if (this._deckDrawer) result.push.apply(result, _toConsumableArray(this._deckDrawer.render()));
    return result;
  }

  renderDeckLayers() {
    var _this4 = this;

    return this.getAllLayers().map(function (layer) {
      return layer instanceof _nebulaLayer.default ? layer.render({
        nebula: _this4
      }) : layer;
    }).filter(Boolean);
  }

  getAllLayers() {
    var result = [];
    this.props.layers.filter(Boolean).forEach(function (layer) {
      result.push(layer); // Only NebulaLayers have helpers, Deck GL layers don't.

      if (layer instanceof _nebulaLayer.default) {
        result.push.apply(result, _toConsumableArray(layer.helperLayers));
      }
    });
    return result.filter(Boolean);
  }

  getRenderedLayers() {
    return _toConsumableArray(this.renderDeckLayers()).concat(_toConsumableArray(this.getExtraDeckLayers()));
  }

  updateAndGetRenderedLayers(layers, viewport, container) {
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

  setDeck(deckgl) {
    if (deckgl) {
      this.deckgl = deckgl;
    }
  }

  setMainContainer(mainContainer) {
    if (mainContainer) {
      this.mainContainer = mainContainer;
    }
  }

}

exports.default = Nebula;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbmVidWxhLmpzIl0sIm5hbWVzIjpbIkxPR0dFUl9QUkVGSVgiLCJOZWJ1bGEiLCJFdmVudEVtaXR0ZXIiLCJldmVudCIsIl9pc05lYnVsYUV2ZW50IiwidHlwZSIsIl9tb3VzZVdhc0Rvd24iLCJtYWluQ29udGFpbmVyIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInByb3h5RXZlbnQiLCJQcm94eSIsImdldCIsIm9yaWdpbmFsIiwicHJvcGVydHlOYW1lIiwicGFnZVgiLCJwYWdlWSIsInJlcGxhY2UiLCJyZXN1bHQiLCJiaW5kIiwiX2hhbmRsZURlY2tHTEV2ZW50IiwiaW5pdCIsInByb3BzIiwid21WaWV3cG9ydCIsIldlYk1lcmNhdG9yVmlld3BvcnQiLCJ2aWV3cG9ydCIsImZvckVhY2giLCJuYW1lIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uTW91c2VFdmVudCIsImRldGFjaCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ1cGRhdGVQcm9wcyIsIm5ld1Byb3BzIiwibG9nIiwibWVzc2FnZSIsImxvZ2dlciIsImluZm8iLCJ1cGRhdGVBbGxEZWNrT2JqZWN0cyIsImdldEFsbExheWVycyIsImxheWVyIiwiZGVja0NhY2hlIiwiZm9yY2VVcGRhdGUiLCJ1cGRhdGVEZWNrT2JqZWN0c0J5SWRzIiwiaWRzIiwicmVyZW5kZXJMYXllcnMiLCJidXR0b25zIiwidGFyZ2V0IiwicmVjdCIsIk1hdGgiLCJyb3VuZCIsIndpZHRoIiwiaGVpZ2h0IiwiZ2V0TW91c2VHcm91bmRQb3NpdGlvbiIsInVucHJvamVjdCIsIm9mZnNldFgiLCJvZmZzZXRZIiwidW5wcm9qZWN0TW91c2VQb3NpdGlvbiIsIm1vdXNlUG9zaXRpb24iLCJkZWNrZ2wiLCJvbk1hcE1vdXNlRXZlbnQiLCJzZWxlY3Rpb25UeXBlIiwiZXZlbnRGaWx0ZXIiLCJzZW5kTWFwRXZlbnQiLCJjdXJzb3IiLCJfZGVja0RyYXdlciIsIkRlY2tEcmF3ZXIiLCJsbmdMYXQiLCJkcmF3ZXJSZXN1bHQiLCJoYW5kbGVFdmVudCIsInJlZHJhdyIsImxheWVySWRzIiwibGF5ZXJzIiwiZmlsdGVyIiwibCIsIm5lYnVsYUxheWVyIiwiZW5hYmxlUGlja2luZyIsIm1hcCIsImlkIiwicGlja2luZ0luZm8iLCJwaWNrT2JqZWN0IiwieCIsInkiLCJyYWRpdXMiLCJxdWVyeU9iamVjdEV2ZW50cyIsImVtaXQiLCJpbmRleCIsImRlY2tMYXllciIsIm9iamVjdCIsImV2ZW50SGFuZGxlciIsIm9yaWdpbmFscyIsImRlY2tnbE1vdXNlT3ZlckluZm8iLCJvcmlnaW5hbExheWVyIiwibmVidWxhTW91c2VFdmVudCIsIkxheWVyTW91c2VFdmVudCIsImRhdGEiLCJtZXRhZGF0YSIsImdyb3VuZFBvaW50IiwibmVidWxhIiwiZG9jdW1lbnRFbGVtZW50Iiwic3R5bGUiLCJ1c2VzTWFwRXZlbnRzIiwibWFwTW91c2VFdmVudCIsImdldEV4dHJhRGVja0xheWVycyIsInB1c2giLCJyZW5kZXIiLCJyZW5kZXJEZWNrTGF5ZXJzIiwiTmVidWxhTGF5ZXIiLCJCb29sZWFuIiwiaGVscGVyTGF5ZXJzIiwiZ2V0UmVuZGVyZWRMYXllcnMiLCJ1cGRhdGVBbmRHZXRSZW5kZXJlZExheWVycyIsImNvbnRhaW5lciIsImluaXRlZCIsInNldERlY2siLCJzZXRNYWluQ29udGFpbmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxHQUFHLFVBQXRCOztBQUVlLE1BQU1DLE1BQU4sQ0FBYTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUEsK0NBZ0NRLElBQUlDLGVBQUosRUFoQ1I7O0FBQUE7O0FBQUE7O0FBQUEsMkNBK0ZWLFVBQUNDLEtBQUQsRUFBOEI7QUFDNUMsVUFBSSxDQUFDLEtBQUksQ0FB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QVU7QUFBRW9ELFFBQUFBLE1BQU0sRUFBTkEsTUFBRjtBQUFVaEQsUUFBQUEsUUFBUSxFQUFSQTtBQUFWLE9BQVY7O0FBQ0EsV0FBS2tCLFdBQUwsR0FBbUI7QUFBQSxlQUFNc0UsU0FBUyxDQUFDdEUsV0FBVixFQUFOO0FBQUEsT0FBbkI7O0FBQ0EsV0FBS0osb0JBQUw7QUFDRDs7QUFFRCxXQUFPLEtBQUt3RSxpQkFBTCxFQUFQO0FBQ0Q7O0FBRURJLEVBQUFBLE9BQU8sQ0FBQ3ZELE1BQUQsRUFBd0I7QUFDN0IsUUFBSUEsTUFBSixFQUFZO0FBQ1YsV0FBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0Q7QUFDRjs7QUFFRHdELEVBQUFBLGdCQUFnQixDQUFDOUcsYUFBRCxFQUErQjtBQUM3QyxRQUFJQSxhQUFKLEVBQW1CO0FBQ2pCLFdBQUtBLGFBQUwsR0FBcUJBLGFBQXJCO0FBQ0Q7QUFDRjs7QUFoVHlCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcbmltcG9ydCBkb2N1bWVudCBmcm9tICdnbG9iYWwvZG9jdW1lbnQnO1xuaW1wb3J0IHdpbmRvdyBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCB7IFdlYk1lcmNhdG9yVmlld3BvcnQgfSBmcm9tICdrZXBsZXItb3V0ZGF0ZWQtZGVjay5nbC1jb3JlJztcblxuaW1wb3J0IERlY2tEcmF3ZXIgZnJvbSAnLi9kZWNrLXJlbmRlcmVyL2RlY2stZHJhd2VyJztcbmltcG9ydCBMYXllck1vdXNlRXZlbnQgZnJvbSAnLi9sYXllci1tb3VzZS1ldmVudCc7XG5pbXBvcnQgTmVidWxhTGF5ZXIgZnJvbSAnLi9uZWJ1bGEtbGF5ZXInO1xuXG5jb25zdCBMT0dHRVJfUFJFRklYID0gJ05lYnVsYTogJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmVidWxhIHtcbiAgaW5pdChwcm9wczogT2JqZWN0KSB7XG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgIHRoaXMud21WaWV3cG9ydCA9IG5ldyBXZWJNZXJjYXRvclZpZXdwb3J0KHRoaXMucHJvcHMudmlld3BvcnQpO1xuXG4gICAgLy8gVE9ETzogUHJvcGVybHkgdXNlIHBvaW50ZXIgZXZlbnRzOiBbJ2NsaWNrJywgJ2RibGNsaWNrJywgJ3BvaW50ZXJtb3ZlJywgJ3BvaW50ZXJ1cCcsICdwb2ludGVyZG93biddXG4gICAgWydjbGljaycsICdkYmxjbGljaycsICdtb3VzZW1vdmUnLCAnbW91c2V1cCcsICdtb3VzZWRvd24nXS5mb3JFYWNoKG5hbWUgPT5cbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgdGhpcy5fb25Nb3VzZUV2ZW50LCB0cnVlKVxuICAgICk7XG4gIH1cblxuICBkZXRhY2goKSB7XG4gICAgLy8gVE9ETzogUHJvcGVybHkgdXNlIHBvaW50ZXIgZXZlbnRzOiBbJ2NsaWNrJywgJ2RibGNsaWNrJywgJ3BvaW50ZXJtb3ZlJywgJ3BvaW50ZXJ1cCcsICdwb2ludGVyZG93biddXG4gICAgWydjbGljaycsICdkYmxjbGljaycsICdtb3VzZW1vdmUnLCAnbW91c2V1cCcsICdtb3VzZWRvd24nXS5mb3JFYWNoKG5hbWUgPT5cbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgdGhpcy5fb25Nb3VzZUV2ZW50LCB0cnVlKVxuICAgICk7XG4gIH1cblxuICB1cGRhdGVQcm9wcyhuZXdQcm9wczogT2JqZWN0KSB7XG4gICAgdGhpcy5wcm9wcyA9IG5ld1Byb3BzO1xuICAgIGNvbnN0IHsgdmlld3BvcnQgfSA9IHRoaXMucHJvcHM7XG5cbiAgICB0aGlzLndtVmlld3BvcnQgPSBuZXcgV2ViTWVyY2F0b3JWaWV3cG9ydCh2aWV3cG9ydCk7XG4gIH1cblxuICBwcm9wczogT2JqZWN0O1xuICBkZWNrZ2w6IE9iamVjdCB8IG51bGw7XG4gIG1haW5Db250YWluZXI6IE9iamVjdCB8IG51bGw7XG4gIGRlY2tnbE1vdXNlT3ZlckluZm86ID9PYmplY3Q7XG4gIF9kZWNrRHJhd2VyOiBEZWNrRHJhd2VyO1xuICBfbW91c2VXYXNEb3duOiBib29sZWFuO1xuICB3bVZpZXdwb3J0OiBXZWJNZXJjYXRvclZpZXdwb3J0O1xuICBxdWVyeU9iamVjdEV2ZW50czogRXZlbnRFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBmb3JjZVVwZGF0ZTogRnVuY3Rpb247XG4gIGluaXRlZDogYm9vbGVhbjtcblxuICBsb2cobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgY29uc3QgeyBsb2dnZXIgfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKGxvZ2dlciAmJiBsb2dnZXIuaW5mbykge1xuICAgICAgbG9nZ2VyLmluZm8oTE9HR0VSX1BSRUZJWCArIG1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUFsbERlY2tPYmplY3RzKCkge1xuICAgIHRoaXMuZ2V0QWxsTGF5ZXJzKCkuZm9yRWFjaChsYXllciA9PiB7XG4gICAgICBpZiAobGF5ZXIgJiYgbGF5ZXIuZGVja0NhY2hlKSB7XG4gICAgICAgIChsYXllci5kZWNrQ2FjaGU6IGFueSkudXBkYXRlQWxsRGVja09iamVjdHMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gIH1cblxuICB1cGRhdGVEZWNrT2JqZWN0c0J5SWRzKGlkczogc3RyaW5nW10pIHtcbiAgICB0aGlzLmdldEFsbExheWVycygpLmZvckVhY2gobGF5ZXIgPT4ge1xuICAgICAgaWYgKGxheWVyICYmIGxheWVyLmRlY2tDYWNoZSkge1xuICAgICAgICAobGF5ZXIuZGVja0NhY2hlOiBhbnkpLnVwZGF0ZURlY2tPYmplY3RzQnlJZHMoaWRzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gIH1cblxuICByZXJlbmRlckxheWVycygpIHtcbiAgICB0aGlzLnVwZGF0ZUFsbERlY2tPYmplY3RzKCk7XG4gIH1cblxuICBfaXNOZWJ1bGFFdmVudCh7IGJ1dHRvbnMsIHRhcmdldCwgdHlwZSB9OiBPYmplY3QpIHtcbiAgICBjb25zdCB7IHZpZXdwb3J0IH0gPSB0aGlzLnByb3BzO1xuXG4gICAgLy8gYWxsb3cgbW91c2V1cCBldmVudCBhZ2dyZXNzaXZlbHkgdG8gY2FuY2VsIGRyYWcgcHJvcGVybHlcbiAgICAvLyBUT0RPOiB1c2UgcG9pbnRlciBjYXB0dXJlIHNldFBvaW50ZXJDYXB0dXJlKCkgdG8gY2FwdHVyZSBtb3VzZXVwIHByb3Blcmx5IGFmdGVyIGRlY2tnbFxuICAgIGlmICh0aGlzLl9tb3VzZVdhc0Rvd24gJiYgdHlwZSA9PT0gJ21vdXNldXAnKSB7XG4gICAgICB0aGlzLl9tb3VzZVdhc0Rvd24gPSBmYWxzZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIGFsbG93IG1vdXNlbW92ZSBldmVudCB3aGlsZSBkcmFnZ2luZ1xuICAgIGlmICh0eXBlID09PSAnbW91c2Vtb3ZlJyAmJiBidXR0b25zID4gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCF0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgcmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAvLyBPbmx5IGxpc3RlbiB0byBldmVudHMgY29taW5nIGZyb20gdGhlIGJhc2VtYXBcbiAgICAvLyBpZGVudGlmaWVkIGJ5IHRoZSBjYW52YXMgb2YgdGhlIHNhbWUgc2l6ZSBhcyB2aWV3cG9ydC5cbiAgICAvLyBOZWVkIHRvIHJvdW5kIHRoZSByZWN0IGRpbWVuc2lvbiBhcyBzb21lIG1vbml0b3JzXG4gICAgLy8gaGF2ZSBzb21lIHN1Yi1waXhlbCBkaWZmZXJlbmNlIHdpdGggdmlld3BvcnQuXG4gICAgcmV0dXJuIChcbiAgICAgIE1hdGgucm91bmQocmVjdC53aWR0aCkgPT09IE1hdGgucm91bmQodmlld3BvcnQud2lkdGgpICYmXG4gICAgICBNYXRoLnJvdW5kKHJlY3QuaGVpZ2h0KSA9PT0gTWF0aC5yb3VuZCh2aWV3cG9ydC5oZWlnaHQpXG4gICAgKTtcbiAgfVxuXG4gIF9vbk1vdXNlRXZlbnQgPSAoZXZlbnQ6IHdpbmRvdy5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgaWYgKCF0aGlzLl9pc05lYnVsYUV2ZW50KGV2ZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldmVudC50eXBlID09PSAnbW91c2Vkb3duJykge1xuICAgICAgdGhpcy5fbW91c2VXYXNEb3duID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBvZmZzZXRYL1kgb2YgdGhlIE1vdXNlRXZlbnQgcHJvdmlkZXMgdGhlIG9mZnNldCBpbiB0aGUgWC9ZIGNvb3JkaW5hdGVcbiAgICAvLyBvZiB0aGUgbW91c2UgcG9pbnRlciBiZXR3ZWVuIHRoYXQgZXZlbnQgYW5kIHRoZSBwYWRkaW5nIGVkZ2Ugb2YgdGhlIHRhcmdldCBub2RlLlxuICAgIC8vIFdlIHNldCBvdXIgbGlzdGVuZXIgdG8gZG9jdW1lbnQgc28gd2UgbmVlZCB0byBhZGp1c3Qgb2Zmc2V0WC9ZXG4gICAgLy8gaW4gY2FzZSB0aGUgdGFyZ2V0IGlzIG5vdCBiZSBvdXIgV2ViR0wgY2FudmFzLlxuICAgIGNvbnN0IHsgdG9wID0gMCwgbGVmdCA9IDAgfSA9IHRoaXMubWFpbkNvbnRhaW5lclxuICAgICAgPyB0aGlzLm1haW5Db250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIDoge307XG4gICAgY29uc3QgcHJveHlFdmVudCA9IG5ldyBQcm94eShldmVudCwge1xuICAgICAgZ2V0OiAob3JpZ2luYWw6IGFueSwgcHJvcGVydHlOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKHByb3BlcnR5TmFtZSA9PT0gJ29mZnNldFgnKSB7XG4gICAgICAgICAgcmV0dXJuIG9yaWdpbmFsLnBhZ2VYIC0gbGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09ICdvZmZzZXRZJykge1xuICAgICAgICAgIHJldHVybiBvcmlnaW5hbC5wYWdlWSAtIHRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IFByb3Blcmx5IHVzZSBwb2ludGVyIGV2ZW50c1xuICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSAndHlwZScpIHtcbiAgICAgICAgICByZXR1cm4gb3JpZ2luYWwudHlwZS5yZXBsYWNlKCdwb2ludGVyJywgJ21vdXNlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHQgPSBvcmlnaW5hbFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuYmluZChvcmlnaW5hbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX2hhbmRsZURlY2tHTEV2ZW50KHByb3h5RXZlbnQpO1xuICB9O1xuXG4gIGdldE1vdXNlR3JvdW5kUG9zaXRpb24oZXZlbnQ6IE9iamVjdCkge1xuICAgIHJldHVybiB0aGlzLndtVmlld3BvcnQudW5wcm9qZWN0KFtldmVudC5vZmZzZXRYLCBldmVudC5vZmZzZXRZXSk7XG4gIH1cblxuICB1bnByb2plY3RNb3VzZVBvc2l0aW9uKG1vdXNlUG9zaXRpb246IFtudW1iZXIsIG51bWJlcl0pOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICByZXR1cm4gdGhpcy53bVZpZXdwb3J0LnVucHJvamVjdChtb3VzZVBvc2l0aW9uKTtcbiAgfVxuXG4gIF9oYW5kbGVEZWNrR0xFdmVudChldmVudDogT2JqZWN0KSB7XG4gICAgY29uc3Qge1xuICAgICAgZGVja2dsLFxuICAgICAgcHJvcHM6IHsgb25NYXBNb3VzZUV2ZW50LCBzZWxlY3Rpb25UeXBlLCBldmVudEZpbHRlciB9XG4gICAgfSA9IHRoaXM7XG4gICAgbGV0IHNlbmRNYXBFdmVudCA9IHRydWU7XG4gICAgbGV0IGN1cnNvciA9ICdhdXRvJztcblxuICAgIGlmIChldmVudCAmJiBkZWNrZ2wgJiYgc2VsZWN0aW9uVHlwZSkge1xuICAgICAgaWYgKCF0aGlzLl9kZWNrRHJhd2VyKSB0aGlzLl9kZWNrRHJhd2VyID0gbmV3IERlY2tEcmF3ZXIodGhpcyk7XG5cbiAgICAgIGNvbnN0IGxuZ0xhdCA9IHRoaXMuZ2V0TW91c2VHcm91bmRQb3NpdGlvbihldmVudCk7XG4gICAgICBpZiAoZXZlbnRGaWx0ZXIgJiYgIWV2ZW50RmlsdGVyKGxuZ0xhdCwgZXZlbnQpKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGRyYXdlclJlc3VsdCA9IHRoaXMuX2RlY2tEcmF3ZXIuaGFuZGxlRXZlbnQoZXZlbnQsIGxuZ0xhdCwgc2VsZWN0aW9uVHlwZSk7XG4gICAgICBpZiAoZHJhd2VyUmVzdWx0LnJlZHJhdykgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldmVudCAmJiBkZWNrZ2wgJiYgKCFldmVudC5idXR0b25zIHx8IGV2ZW50LnR5cGUgIT09ICdtb3VzZW1vdmUnKSkge1xuICAgICAgLy8gVE9ETzogc29ydCBieSBtb3VzZSBwcmlvcml0eVxuICAgICAgY29uc3QgbGF5ZXJJZHMgPSBkZWNrZ2wucHJvcHMubGF5ZXJzXG4gICAgICAgIC5maWx0ZXIobCA9PiBsICYmIGwucHJvcHMgJiYgbC5wcm9wcy5uZWJ1bGFMYXllciAmJiBsLnByb3BzLm5lYnVsYUxheWVyLmVuYWJsZVBpY2tpbmcpXG4gICAgICAgIC5tYXAobCA9PiBsLmlkKTtcblxuICAgICAgY29uc3QgcGlja2luZ0luZm8gPSBkZWNrZ2wucGlja09iamVjdCh7XG4gICAgICAgIHg6IGV2ZW50Lm9mZnNldFgsXG4gICAgICAgIHk6IGV2ZW50Lm9mZnNldFksXG4gICAgICAgIHJhZGl1czogNSxcbiAgICAgICAgbGF5ZXJJZHNcbiAgICAgIH0pO1xuICAgICAgdGhpcy5xdWVyeU9iamVjdEV2ZW50cy5lbWl0KCdwaWNrJywgeyBldmVudCwgcGlja2luZ0luZm8gfSk7XG4gICAgICBpZiAocGlja2luZ0luZm8pIHtcbiAgICAgICAgc2VuZE1hcEV2ZW50ID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgeyBpbmRleCwgbG5nTGF0IH0gPSBwaWNraW5nSW5mbztcbiAgICAgICAgaWYgKGV2ZW50RmlsdGVyICYmICFldmVudEZpbHRlcihsbmdMYXQsIGV2ZW50KSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHsgbGF5ZXI6IGRlY2tMYXllciwgb2JqZWN0IH0gPSBwaWNraW5nSW5mbztcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgZGVja0xheWVyICYmXG4gICAgICAgICAgZGVja0xheWVyLnByb3BzICYmXG4gICAgICAgICAgZGVja0xheWVyLnByb3BzLm5lYnVsYUxheWVyICYmXG4gICAgICAgICAgZGVja0xheWVyLnByb3BzLm5lYnVsYUxheWVyLmV2ZW50SGFuZGxlclxuICAgICAgICApIHtcbiAgICAgICAgICBkZWNrTGF5ZXIucHJvcHMubmVidWxhTGF5ZXIuZXZlbnRIYW5kbGVyKGV2ZW50LCBwaWNraW5nSW5mbyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvcmlnaW5hbCA9XG4gICAgICAgICAgb2JqZWN0Lm9yaWdpbmFsIHx8XG4gICAgICAgICAgKGRlY2tMYXllci5wcm9wcy5uZWJ1bGFMYXllciAmJlxuICAgICAgICAgICAgZGVja0xheWVyLnByb3BzLm5lYnVsYUxheWVyLmRlY2tDYWNoZSAmJlxuICAgICAgICAgICAgZGVja0xheWVyLnByb3BzLm5lYnVsYUxheWVyLmRlY2tDYWNoZS5vcmlnaW5hbHNbaW5kZXhdKTtcblxuICAgICAgICBpZiAob3JpZ2luYWwpIHtcbiAgICAgICAgICB0aGlzLmRlY2tnbE1vdXNlT3ZlckluZm8gPSB7IG9yaWdpbmFsTGF5ZXI6IGRlY2tMYXllci5wcm9wcy5uZWJ1bGFMYXllciwgaW5kZXggfTtcbiAgICAgICAgICBjb25zdCBuZWJ1bGFNb3VzZUV2ZW50ID0gbmV3IExheWVyTW91c2VFdmVudChldmVudCwge1xuICAgICAgICAgICAgZGF0YTogb3JpZ2luYWwsXG4gICAgICAgICAgICBtZXRhZGF0YTogb2JqZWN0Lm1ldGFkYXRhLFxuICAgICAgICAgICAgZ3JvdW5kUG9pbnQ6IGxuZ0xhdCxcbiAgICAgICAgICAgIG5lYnVsYTogdGhpc1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGRlY2tMYXllci5wcm9wcy5uZWJ1bGFMYXllci5lbWl0KGV2ZW50LnR5cGUsIG5lYnVsYU1vdXNlRXZlbnQpO1xuICAgICAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnNvciA9ICdwb2ludGVyJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuY3Vyc29yID0gY3Vyc29yO1xuICAgIH1cblxuICAgIGlmIChzZW5kTWFwRXZlbnQpIHtcbiAgICAgIHRoaXMuZGVja2dsTW91c2VPdmVySW5mbyA9IG51bGw7XG5cbiAgICAgIGNvbnN0IGxuZ0xhdCA9IHRoaXMuZ2V0TW91c2VHcm91bmRQb3NpdGlvbihldmVudCk7XG4gICAgICBpZiAoZXZlbnRGaWx0ZXIgJiYgIWV2ZW50RmlsdGVyKGxuZ0xhdCwgZXZlbnQpKSByZXR1cm47XG5cbiAgICAgIC8vIHNlbmQgdG8gbGF5ZXJzIGZpcnN0XG4gICAgICBjb25zdCBuZWJ1bGFNb3VzZUV2ZW50ID0gbmV3IExheWVyTW91c2VFdmVudChldmVudCwge1xuICAgICAgICBncm91bmRQb2ludDogbG5nTGF0LFxuICAgICAgICBuZWJ1bGE6IHRoaXNcbiAgICAgIH0pO1xuICAgICAgdGhpcy5nZXRBbGxMYXllcnMoKVxuICAgICAgICAuZmlsdGVyKGxheWVyID0+IGxheWVyICYmIGxheWVyLnVzZXNNYXBFdmVudHMpXG4gICAgICAgIC5mb3JFYWNoKGxheWVyID0+IGxheWVyLmVtaXQoJ21hcE1vdXNlRXZlbnQnLCBuZWJ1bGFNb3VzZUV2ZW50KSk7XG5cbiAgICAgIHRoaXMuZ2V0QWxsTGF5ZXJzKClcbiAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICBsYXllciA9PlxuICAgICAgICAgICAgbGF5ZXIgJiYgbGF5ZXIucHJvcHMgJiYgbGF5ZXIucHJvcHMubmVidWxhTGF5ZXIgJiYgbGF5ZXIucHJvcHMubmVidWxhTGF5ZXIubWFwTW91c2VFdmVudFxuICAgICAgICApXG4gICAgICAgIC5mb3JFYWNoKGxheWVyID0+IGxheWVyLnByb3BzLm5lYnVsYUxheWVyLm1hcE1vdXNlRXZlbnQobmVidWxhTW91c2VFdmVudCwgbGF5ZXIpKTtcblxuICAgICAgaWYgKG9uTWFwTW91c2VFdmVudCkge1xuICAgICAgICBvbk1hcE1vdXNlRXZlbnQoZXZlbnQsIGxuZ0xhdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0RXh0cmFEZWNrTGF5ZXJzKCk6IE9iamVjdFtdIHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgIGlmICh0aGlzLl9kZWNrRHJhd2VyKSByZXN1bHQucHVzaCguLi50aGlzLl9kZWNrRHJhd2VyLnJlbmRlcigpKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZW5kZXJEZWNrTGF5ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLmdldEFsbExheWVycygpXG4gICAgICAubWFwKGxheWVyID0+IChsYXllciBpbnN0YW5jZW9mIE5lYnVsYUxheWVyID8gbGF5ZXIucmVuZGVyKHsgbmVidWxhOiB0aGlzIH0pIDogbGF5ZXIpKVxuICAgICAgLmZpbHRlcihCb29sZWFuKTtcbiAgfVxuXG4gIGdldEFsbExheWVycygpIHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgIHRoaXMucHJvcHMubGF5ZXJzLmZpbHRlcihCb29sZWFuKS5mb3JFYWNoKGxheWVyID0+IHtcbiAgICAgIHJlc3VsdC5wdXNoKGxheWVyKTtcbiAgICAgIC8vIE9ubHkgTmVidWxhTGF5ZXJzIGhhdmUgaGVscGVycywgRGVjayBHTCBsYXllcnMgZG9uJ3QuXG4gICAgICBpZiAobGF5ZXIgaW5zdGFuY2VvZiBOZWJ1bGFMYXllcikge1xuICAgICAgICByZXN1bHQucHVzaCguLi5sYXllci5oZWxwZXJMYXllcnMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdC5maWx0ZXIoQm9vbGVhbik7XG4gIH1cblxuICBnZXRSZW5kZXJlZExheWVycygpIHtcbiAgICByZXR1cm4gWy4uLnRoaXMucmVuZGVyRGVja0xheWVycygpLCAuLi50aGlzLmdldEV4dHJhRGVja0xheWVycygpXTtcbiAgfVxuXG4gIHVwZGF0ZUFuZEdldFJlbmRlcmVkTGF5ZXJzKGxheWVyczogT2JqZWN0W10sIHZpZXdwb3J0OiBXZWJNZXJjYXRvclZpZXdwb3J0LCBjb250YWluZXI6IE9iamVjdCkge1xuICAgIGlmICh0aGlzLmluaXRlZCkge1xuICAgICAgdGhpcy51cGRhdGVQcm9wcyh7IGxheWVycywgdmlld3BvcnQgfSk7XG4gICAgICB0aGlzLmZvcmNlVXBkYXRlID0gKCkgPT4gY29udGFpbmVyLmZvcmNlVXBkYXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuaW5pdCh7IGxheWVycywgdmlld3BvcnQgfSk7XG4gICAgICB0aGlzLmZvcmNlVXBkYXRlID0gKCkgPT4gY29udGFpbmVyLmZvcmNlVXBkYXRlKCk7XG4gICAgICB0aGlzLnVwZGF0ZUFsbERlY2tPYmplY3RzKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVuZGVyZWRMYXllcnMoKTtcbiAgfVxuXG4gIHNldERlY2soZGVja2dsOiBPYmplY3QgfCBudWxsKSB7XG4gICAgaWYgKGRlY2tnbCkge1xuICAgICAgdGhpcy5kZWNrZ2wgPSBkZWNrZ2w7XG4gICAgfVxuICB9XG5cbiAgc2V0TWFpbkNvbnRhaW5lcihtYWluQ29udGFpbmVyOiBPYmplY3QgfCBudWxsKSB7XG4gICAgaWYgKG1haW5Db250YWluZXIpIHtcbiAgICAgIHRoaXMubWFpbkNvbnRhaW5lciA9IG1haW5Db250YWluZXI7XG4gICAgfVxuICB9XG59XG4iXX0=