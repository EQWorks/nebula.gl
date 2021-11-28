"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toDeckColor = toDeckColor;
exports.recursivelyTraverseNestedArrays = recursivelyTraverseNestedArrays;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function toDeckColor(color) {
  var defaultColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [255, 0, 0, 255];

  if (!Array.isArray(color)) {
    return defaultColor;
  }

  return [color[0] * 255, color[1] * 255, color[2] * 255, color[3] * 255];
} //
// a GeoJSON helper function that calls the provided function with
// an argument that is the most deeply-nested array having elements
// that are arrays of primitives as an argument, e.g.
//
// {
//   "type": "MultiPolygon",
//   "coordinates": [
//       [
//           [[30, 20], [45, 40], [10, 40], [30, 20]]
//       ],
//       [
//           [[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]
//       ]
//   ]
// }
//
// the function would be called on:
//
// [[30, 20], [45, 40], [10, 40], [30, 20]]
//
// and
//
// [[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]
//


function recursivelyTraverseNestedArrays(array, prefix, fn) {
  if (!Array.isArray(array[0])) {
    return true;
  }

  for (var i = 0; i < array.length; i++) {
    if (recursivelyTraverseNestedArrays(array[i], _toConsumableArray(prefix).concat([i]), fn)) {
      fn(array, prefix);
      break;
    }
  }

  return false;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvdXRpbHMuanMiXSwibmFtZXMiOlsidG9EZWNrQ29sb3IiLCJjb2xvciIsImRlZmF1bHRDb2xvciIsIkFycmF5IiwiaXNBcnJheSIsInJlY3Vyc2l2ZWx5VHJhdmVyc2VOZXN0ZWRBcnJheXMiLCJhcnJheSIsInByZWZpeCIsImZuIiwiaSIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUVPLFNBQVNBLFdBQVQsQ0FDTEMsS0FESyxFQUc2QjtBQUFBLE1BRGxDQyxZQUNrQyx1RUFEZSxDQUFDLEdBQUQsRUFBTSxDQUFOLEVBQVMsQ0FBVCxFQUFZLEdBQVosQ0FDZjs7QUFDbEMsTUFBSSxDQUFDQyxLQUFLLENBQUNDLE9BQU4sQ0FBY0gsS0FBZCxDQUFMLEVBQTJCO0FBQ3pCLFdBQU9DLFlBQVA7QUFDRDs7QUFDRCxTQUFPLENBQUNELEtBQUssQ0FBQyxDQUFELENBQUwsR0FBVyxHQUFaLEVBQWlCQSxLQUFLLENBQUMsQ0FBRCxDQUFMLEdBQVcsR0FBNUIsRUFBaUNBLEtBQUssQ0FBQyxDQUFELENBQUwsR0FBVyxHQUE1QyxFQUFpREEsS0FBSyxDQUFDLENBQUQsQ0FBTCxHQUFXLEdBQTVELENBQVA7QUFDRCxDLENBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNJLCtCQUFULENBQ0xDLEtBREssRUFFTEMsTUFGSyxFQUdMQyxFQUhLLEVBSUw7QUFDQSxNQUFJLENBQUNMLEtBQUssQ0FBQ0MsT0FBTixDQUFjRSxLQUFLLENBQUMsQ0FBRCxDQUFuQixDQUFMLEVBQThCO0FBQzVCLFdBQU8sSUFBUDtBQUNEOztBQUNELE9BQUssSUFBSUcsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0gsS0FBSyxDQUFDSSxNQUExQixFQUFrQ0QsQ0FBQyxFQUFuQyxFQUF1QztBQUNyQyxRQUFJSiwrQkFBK0IsQ0FBQ0MsS0FBSyxDQUFDRyxDQUFELENBQU4scUJBQWVGLE1BQWYsVUFBdUJFLENBQXZCLElBQTJCRCxFQUEzQixDQUFuQyxFQUFtRTtBQUNqRUEsTUFBQUEsRUFBRSxDQUFDRixLQUFELEVBQVFDLE1BQVIsQ0FBRjtBQUNBO0FBQ0Q7QUFDRjs7QUFDRCxTQUFPLEtBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0RlY2tDb2xvcihcbiAgY29sb3I/OiA/W251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sXG4gIGRlZmF1bHRDb2xvcjogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMjU1LCAwLCAwLCAyNTVdXG4pOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShjb2xvcikpIHtcbiAgICByZXR1cm4gZGVmYXVsdENvbG9yO1xuICB9XG4gIHJldHVybiBbY29sb3JbMF0gKiAyNTUsIGNvbG9yWzFdICogMjU1LCBjb2xvclsyXSAqIDI1NSwgY29sb3JbM10gKiAyNTVdO1xufVxuXG4vL1xuLy8gYSBHZW9KU09OIGhlbHBlciBmdW5jdGlvbiB0aGF0IGNhbGxzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiB3aXRoXG4vLyBhbiBhcmd1bWVudCB0aGF0IGlzIHRoZSBtb3N0IGRlZXBseS1uZXN0ZWQgYXJyYXkgaGF2aW5nIGVsZW1lbnRzXG4vLyB0aGF0IGFyZSBhcnJheXMgb2YgcHJpbWl0aXZlcyBhcyBhbiBhcmd1bWVudCwgZS5nLlxuLy9cbi8vIHtcbi8vICAgXCJ0eXBlXCI6IFwiTXVsdGlQb2x5Z29uXCIsXG4vLyAgIFwiY29vcmRpbmF0ZXNcIjogW1xuLy8gICAgICAgW1xuLy8gICAgICAgICAgIFtbMzAsIDIwXSwgWzQ1LCA0MF0sIFsxMCwgNDBdLCBbMzAsIDIwXV1cbi8vICAgICAgIF0sXG4vLyAgICAgICBbXG4vLyAgICAgICAgICAgW1sxNSwgNV0sIFs0MCwgMTBdLCBbMTAsIDIwXSwgWzUsIDEwXSwgWzE1LCA1XV1cbi8vICAgICAgIF1cbi8vICAgXVxuLy8gfVxuLy9cbi8vIHRoZSBmdW5jdGlvbiB3b3VsZCBiZSBjYWxsZWQgb246XG4vL1xuLy8gW1szMCwgMjBdLCBbNDUsIDQwXSwgWzEwLCA0MF0sIFszMCwgMjBdXVxuLy9cbi8vIGFuZFxuLy9cbi8vIFtbMTUsIDVdLCBbNDAsIDEwXSwgWzEwLCAyMF0sIFs1LCAxMF0sIFsxNSwgNV1dXG4vL1xuZXhwb3J0IGZ1bmN0aW9uIHJlY3Vyc2l2ZWx5VHJhdmVyc2VOZXN0ZWRBcnJheXMoXG4gIGFycmF5OiBBcnJheTxhbnk+LFxuICBwcmVmaXg6IEFycmF5PG51bWJlcj4sXG4gIGZuOiBGdW5jdGlvblxuKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShhcnJheVswXSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHJlY3Vyc2l2ZWx5VHJhdmVyc2VOZXN0ZWRBcnJheXMoYXJyYXlbaV0sIFsuLi5wcmVmaXgsIGldLCBmbikpIHtcbiAgICAgIGZuKGFycmF5LCBwcmVmaXgpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbiJdfQ==