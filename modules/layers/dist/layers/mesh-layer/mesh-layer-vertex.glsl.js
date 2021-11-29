"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "\n#define SHADER_NAME mesh-layer-vs\n\n// Scale the model\nuniform float sizeScale;\n\n// Primitive attributes\nattribute vec3 positions;\nattribute vec3 normals;\nattribute vec2 texCoords;\n\n// Instance attributes\nattribute vec3 instancePositions;\nattribute vec2 instancePositions64xy;\nattribute vec3 instanceRotations;\nattribute vec4 instanceColors;\nattribute vec3 instancePickingColors;\n\n// Outputs to fragment shader\nvarying vec2 vTexCoord;\nvarying vec4 vColor;\n\n// yaw(z) pitch(y) roll(x)\nmat3 getRotationMatrix(vec3 rotation) {\n  float sr = sin(rotation.x);\n  float sp = sin(rotation.y);\n  float sw = sin(rotation.z);\n\n  float cr = cos(rotation.x);\n  float cp = cos(rotation.y);\n  float cw = cos(rotation.z);\n\n  return mat3(\n    cw * cp,                  // 0,0\n    sw * cp,                  // 1,0\n    -sp,                      // 2,0\n    -sw * cr + cw * sp * sr,  // 0,1\n    cw * cr + sw * sp * sr,   // 1,1\n    cp * sr,                  // 2,1\n    sw * sr + cw * sp * cr,   // 0,2\n    -cw * sr + sw * sp * cr,  // 1,2\n    cp * cr                   // 2,2\n  );\n}\n\nvoid main(void) {\n  mat3 rotationMatrix = getRotationMatrix(instanceRotations);\n\n  vec3 pos = rotationMatrix * positions;\n  pos = project_scale(pos * sizeScale);\n  // TODO - backward compatibility, remove in next major release\n  if (project_uPixelsPerMeter.y < 0.0) {\n    pos.y = -pos.y;\n  }\n\n  vec4 worldPosition;\n  gl_Position = project_position_to_clipspace(instancePositions, instancePositions64xy, pos, worldPosition);\n\n  // TODO - transform normals\n\n  picking_setPickingColor(instancePickingColors);\n\n  vTexCoord = texCoords;\n  vColor = instanceColors;\n}\n";
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbXX0=