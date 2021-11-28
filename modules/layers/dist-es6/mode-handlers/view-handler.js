"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewHandler = void 0;

var _modeHandler = require("./mode-handler.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ViewHandler =
/*#__PURE__*/
function (_ModeHandler) {
  _inherits(ViewHandler, _ModeHandler);

  function ViewHandler() {
    _classCallCheck(this, ViewHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(ViewHandler).apply(this, arguments));
  }

  _createClass(ViewHandler, [{
    key: "getCursor",
    value: function getCursor(_ref) {
      var isDragging = _ref.isDragging;
      return isDragging ? 'grabbing' : 'grab';
    }
  }, {
    key: "getEditHandles",
    value: function getEditHandles(picks, groundCoords) {
      return [];
    }
  }]);

  return ViewHandler;
}(_modeHandler.ModeHandler);

exports.ViewHandler = ViewHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3ZpZXctaGFuZGxlci5qcyJdLCJuYW1lcyI6WyJWaWV3SGFuZGxlciIsImlzRHJhZ2dpbmciLCJwaWNrcyIsImdyb3VuZENvb3JkcyIsIk1vZGVIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLFc7Ozs7Ozs7Ozs7Ozs7b0NBQ2dEO0FBQUEsVUFBL0NDLFVBQStDLFFBQS9DQSxVQUErQztBQUN6RCxhQUFPQSxVQUFVLEdBQUcsVUFBSCxHQUFnQixNQUFqQztBQUNEOzs7bUNBRWNDLEssRUFBdUJDLFksRUFBdUM7QUFDM0UsYUFBTyxFQUFQO0FBQ0Q7Ozs7RUFQOEJDLHdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUgeyBQb3NpdGlvbiB9IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgdHlwZSB7IEVkaXRIYW5kbGUgfSBmcm9tICcuL21vZGUtaGFuZGxlci5qcyc7XG5pbXBvcnQgeyBNb2RlSGFuZGxlciB9IGZyb20gJy4vbW9kZS1oYW5kbGVyLmpzJztcblxuZXhwb3J0IGNsYXNzIFZpZXdIYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBnZXRDdXJzb3IoeyBpc0RyYWdnaW5nIH06IHsgaXNEcmFnZ2luZzogYm9vbGVhbiB9KTogc3RyaW5nIHtcbiAgICByZXR1cm4gaXNEcmFnZ2luZyA/ICdncmFiYmluZycgOiAnZ3JhYic7XG4gIH1cblxuICBnZXRFZGl0SGFuZGxlcyhwaWNrcz86IEFycmF5PE9iamVjdD4sIGdyb3VuZENvb3Jkcz86IFBvc2l0aW9uKTogRWRpdEhhbmRsZVtdIHtcbiAgICByZXR1cm4gW107XG4gIH1cbn1cbiJdfQ==