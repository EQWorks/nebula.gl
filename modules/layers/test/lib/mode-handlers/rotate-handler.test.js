// @flow

import type { FeatureCollection } from 'kepler-outdated-nebula.gl-edit-modes';
import { RotateHandler } from '../../../src/mode-handlers/rotate-handler';
import { FeatureType, createFeatureCollection } from '../test-utils.js';

import {
  testModeHandlerHandlePointMove,
  testHandleStartDragging,
  testHandleStopDragging
} from './mode-handler-utils.js';

const modeName = 'rotate';
const featureCollection: FeatureCollection = createFeatureCollection({
  mockGeoJsonProperties: true
});

testModeHandlerHandlePointMove(modeName, RotateHandler, featureCollection, '_isRotatable');

testHandleStartDragging(
  modeName,
  RotateHandler,
  featureCollection,
  '_isRotatable',
  '_geometryBeingRotated'
);

// Rotating a point feature will not change coordinates
testHandleStopDragging(
  modeName,
  RotateHandler,
  featureCollection,
  featureType => ![FeatureType.POINT].includes(featureType)
);
