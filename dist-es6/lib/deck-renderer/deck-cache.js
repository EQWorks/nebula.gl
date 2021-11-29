"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DeckCache =
/*#__PURE__*/
function () {
  function DeckCache(getData, convert) {
    _classCallCheck(this, DeckCache);

    _defineProperty(this, "objects", void 0);

    _defineProperty(this, "originals", void 0);

    _defineProperty(this, "updateTrigger", void 0);

    _defineProperty(this, "_idToPosition", void 0);

    _defineProperty(this, "_getData", void 0);

    _defineProperty(this, "_convert", void 0);

    this.objects = [];
    this.originals = [];
    this.updateTrigger = 0;
    this._idToPosition = new Map();
    this._getData = getData;
    this._convert = convert;
  }

  _createClass(DeckCache, [{
    key: "updateAllDeckObjects",
    value: function updateAllDeckObjects() {
      var _this = this;

      if (!this._getData || !this._convert) return;
      this.originals.length = 0;
      this.objects.length = 0;

      this._idToPosition.clear();

      this._getData().forEach(function (d) {
        _this._idToPosition.set(d.id, _this.objects.length);

        _this.originals.push(d);

        _this.objects.push(_this._convert(d));
      });

      this.triggerUpdate();
    }
  }, {
    key: "updateDeckObjectsByIds",
    value: function updateDeckObjectsByIds(ids) {
      var _this2 = this;

      if (!this._getData || !this._convert) return;
      ids.forEach(function (id) {
        var p = _this2._idToPosition.get(id);

        if (p !== undefined) {
          _this2.objects[p] = _this2._convert(_this2.originals[p]);
        }
      });
      this.triggerUpdate();
    }
  }, {
    key: "triggerUpdate",
    value: function triggerUpdate() {
      this.updateTrigger++;
    }
  }, {
    key: "getDeckObjectById",
    value: function getDeckObjectById(id) {
      var p = this._idToPosition.get(id);

      return p !== undefined ? this.objects[p] : null;
    }
  }, {
    key: "getOriginalById",
    value: function getOriginalById(id) {
      var p = this._idToPosition.get(id);

      return p !== undefined ? this.originals[p] : null;
    }
  }]);

  return DeckCache;
}();

exports.default = DeckCache;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZGVjay1yZW5kZXJlci9kZWNrLWNhY2hlLmpzIl0sIm5hbWVzIjpbIkRlY2tDYWNoZSIsImdldERhdGEiLCJjb252ZXJ0Iiwib2JqZWN0cyIsIm9yaWdpbmFscyIsInVwZGF0ZVRyaWdnZXIiLCJfaWRUb1Bvc2l0aW9uIiwiTWFwIiwiX2dldERhdGEiLCJfY29udmVydCIsImxlbmd0aCIsImNsZWFyIiwiZm9yRWFjaCIsImQiLCJzZXQiLCJpZCIsInB1c2giLCJ0cmlnZ2VyVXBkYXRlIiwiaWRzIiwicCIsImdldCIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0lBRXFCQSxTOzs7QUFRbkIscUJBQVlDLE9BQVosRUFBb0NDLE9BQXBDLEVBQTZEO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQzNELFNBQUtDLE9BQUwsR0FBZSxFQUFmO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNBLFNBQUtDLGFBQUwsR0FBcUIsQ0FBckI7QUFFQSxTQUFLQyxhQUFMLEdBQXFCLElBQUlDLEdBQUosRUFBckI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCUCxPQUFoQjtBQUNBLFNBQUtRLFFBQUwsR0FBZ0JQLE9BQWhCO0FBQ0Q7Ozs7MkNBRXNCO0FBQUE7O0FBQ3JCLFVBQUksQ0FBQyxLQUFLTSxRQUFOLElBQWtCLENBQUMsS0FBS0MsUUFBNUIsRUFBc0M7QUFFdEMsV0FBS0wsU0FBTCxDQUFlTSxNQUFmLEdBQXdCLENBQXhCO0FBQ0EsV0FBS1AsT0FBTCxDQUFhTyxNQUFiLEdBQXNCLENBQXRCOztBQUNBLFdBQUtKLGFBQUwsQ0FBbUJLLEtBQW5COztBQUVBLFdBQUtILFFBQUwsR0FBZ0JJLE9BQWhCLENBQXdCLFVBQUFDLENBQUMsRUFBSTtBQUMzQixRQUFBLEtBQUksQ0FBQ1AsYUFBTCxDQUFtQlEsR0FBbkIsQ0FBd0JELENBQUQsQ0FBU0UsRUFBaEMsRUFBb0MsS0FBSSxDQUFDWixPQUFMLENBQWFPLE1BQWpEOztBQUNBLFFBQUEsS0FBSSxDQUFDTixTQUFMLENBQWVZLElBQWYsQ0FBb0JILENBQXBCOztBQUNBLFFBQUEsS0FBSSxDQUFDVixPQUFMLENBQWFhLElBQWIsQ0FBa0IsS0FBSSxDQUFDUCxRQUFMLENBQWNJLENBQWQsQ0FBbEI7QUFDRCxPQUpEOztBQU1BLFdBQUtJLGFBQUw7QUFDRDs7OzJDQUVzQkMsRyxFQUFlO0FBQUE7O0FBQ3BDLFVBQUksQ0FBQyxLQUFLVixRQUFOLElBQWtCLENBQUMsS0FBS0MsUUFBNUIsRUFBc0M7QUFFdENTLE1BQUFBLEdBQUcsQ0FBQ04sT0FBSixDQUFZLFVBQUFHLEVBQUUsRUFBSTtBQUNoQixZQUFNSSxDQUFDLEdBQUcsTUFBSSxDQUFDYixhQUFMLENBQW1CYyxHQUFuQixDQUF1QkwsRUFBdkIsQ0FBVjs7QUFDQSxZQUFJSSxDQUFDLEtBQUtFLFNBQVYsRUFBcUI7QUFDbkIsVUFBQSxNQUFJLENBQUNsQixPQUFMLENBQWFnQixDQUFiLElBQWtCLE1BQUksQ0FBQ1YsUUFBTCxDQUFjLE1BQUksQ0FBQ0wsU0FBTCxDQUFlZSxDQUFmLENBQWQsQ0FBbEI7QUFDRDtBQUNGLE9BTEQ7QUFPQSxXQUFLRixhQUFMO0FBQ0Q7OztvQ0FFZTtBQUNkLFdBQUtaLGFBQUw7QUFDRDs7O3NDQUVpQlUsRSxFQUFvQjtBQUNwQyxVQUFNSSxDQUFDLEdBQUcsS0FBS2IsYUFBTCxDQUFtQmMsR0FBbkIsQ0FBdUJMLEVBQXZCLENBQVY7O0FBQ0EsYUFBT0ksQ0FBQyxLQUFLRSxTQUFOLEdBQWtCLEtBQUtsQixPQUFMLENBQWFnQixDQUFiLENBQWxCLEdBQW9DLElBQTNDO0FBQ0Q7OztvQ0FFZUosRSxFQUFvQjtBQUNsQyxVQUFNSSxDQUFDLEdBQUcsS0FBS2IsYUFBTCxDQUFtQmMsR0FBbkIsQ0FBdUJMLEVBQXZCLENBQVY7O0FBQ0EsYUFBT0ksQ0FBQyxLQUFLRSxTQUFOLEdBQWtCLEtBQUtqQixTQUFMLENBQWVlLENBQWYsQ0FBbEIsR0FBc0MsSUFBN0M7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlY2tDYWNoZTxUT1JJRywgVENPTlY+IHtcbiAgb2JqZWN0czogVENPTlZbXTtcbiAgb3JpZ2luYWxzOiBUT1JJR1tdO1xuICB1cGRhdGVUcmlnZ2VyOiBudW1iZXI7XG4gIF9pZFRvUG9zaXRpb246IE1hcDxzdHJpbmcsIG51bWJlcj47XG4gIF9nZXREYXRhOiAoKSA9PiBUT1JJR1tdO1xuICBfY29udmVydDogVE9SSUcgPT4gVENPTlY7XG5cbiAgY29uc3RydWN0b3IoZ2V0RGF0YTogKCkgPT4gVE9SSUdbXSwgY29udmVydDogVE9SSUcgPT4gVENPTlYpIHtcbiAgICB0aGlzLm9iamVjdHMgPSBbXTtcbiAgICB0aGlzLm9yaWdpbmFscyA9IFtdO1xuICAgIHRoaXMudXBkYXRlVHJpZ2dlciA9IDA7XG5cbiAgICB0aGlzLl9pZFRvUG9zaXRpb24gPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fZ2V0RGF0YSA9IGdldERhdGE7XG4gICAgdGhpcy5fY29udmVydCA9IGNvbnZlcnQ7XG4gIH1cblxuICB1cGRhdGVBbGxEZWNrT2JqZWN0cygpIHtcbiAgICBpZiAoIXRoaXMuX2dldERhdGEgfHwgIXRoaXMuX2NvbnZlcnQpIHJldHVybjtcblxuICAgIHRoaXMub3JpZ2luYWxzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5vYmplY3RzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5faWRUb1Bvc2l0aW9uLmNsZWFyKCk7XG5cbiAgICB0aGlzLl9nZXREYXRhKCkuZm9yRWFjaChkID0+IHtcbiAgICAgIHRoaXMuX2lkVG9Qb3NpdGlvbi5zZXQoKGQ6IGFueSkuaWQsIHRoaXMub2JqZWN0cy5sZW5ndGgpO1xuICAgICAgdGhpcy5vcmlnaW5hbHMucHVzaChkKTtcbiAgICAgIHRoaXMub2JqZWN0cy5wdXNoKHRoaXMuX2NvbnZlcnQoZCkpO1xuICAgIH0pO1xuXG4gICAgdGhpcy50cmlnZ2VyVXBkYXRlKCk7XG4gIH1cblxuICB1cGRhdGVEZWNrT2JqZWN0c0J5SWRzKGlkczogc3RyaW5nW10pIHtcbiAgICBpZiAoIXRoaXMuX2dldERhdGEgfHwgIXRoaXMuX2NvbnZlcnQpIHJldHVybjtcblxuICAgIGlkcy5mb3JFYWNoKGlkID0+IHtcbiAgICAgIGNvbnN0IHAgPSB0aGlzLl9pZFRvUG9zaXRpb24uZ2V0KGlkKTtcbiAgICAgIGlmIChwICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5vYmplY3RzW3BdID0gdGhpcy5fY29udmVydCh0aGlzLm9yaWdpbmFsc1twXSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnRyaWdnZXJVcGRhdGUoKTtcbiAgfVxuXG4gIHRyaWdnZXJVcGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGVUcmlnZ2VyKys7XG4gIH1cblxuICBnZXREZWNrT2JqZWN0QnlJZChpZDogc3RyaW5nKTogP1RDT05WIHtcbiAgICBjb25zdCBwID0gdGhpcy5faWRUb1Bvc2l0aW9uLmdldChpZCk7XG4gICAgcmV0dXJuIHAgIT09IHVuZGVmaW5lZCA/IHRoaXMub2JqZWN0c1twXSA6IG51bGw7XG4gIH1cblxuICBnZXRPcmlnaW5hbEJ5SWQoaWQ6IHN0cmluZyk6ID9UT1JJRyB7XG4gICAgY29uc3QgcCA9IHRoaXMuX2lkVG9Qb3NpdGlvbi5nZXQoaWQpO1xuICAgIHJldHVybiBwICE9PSB1bmRlZmluZWQgPyB0aGlzLm9yaWdpbmFsc1twXSA6IG51bGw7XG4gIH1cbn1cbiJdfQ==