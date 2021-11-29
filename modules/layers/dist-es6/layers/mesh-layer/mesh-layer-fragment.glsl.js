"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "\n#define SHADER_NAME mesh-layer-fs\n\nprecision highp float;\n\nuniform bool hasTexture;\nuniform sampler2D sampler;\nuniform vec4 color;\n\nvarying vec2 vTexCoord;\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_FragColor = hasTexture ? texture2D(sampler, vTexCoord) : vColor / 255.;\n\n  // use highlight color if this fragment belongs to the selected object.\n  gl_FragColor = picking_filterHighlightColor(gl_FragColor);\n\n  // use picking color if rendering to picking FBO.\n  gl_FragColor = picking_filterPickingColor(gl_FragColor);\n}\n";
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbXX0=