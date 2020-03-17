// @flow
/* eslint-env jest */

import { toGeoJson, toKml, toWkt, toStats, toIds, UNNAMED } from '../src/lib/exporter.js';
import { newFeatureId } from '../src/utils.js';
import type { GeoJsonFeature, GeoJsonFeatureCollection } from '../src/types.js';
import { createRandomFeature } from './utils/test-features.js';

let unsavedNamedFeature: GeoJsonFeature;
let unsavedUnnamedFeature: GeoJsonFeature;
let featureCollection: GeoJsonFeatureCollection;

beforeEach(() => {
  unsavedNamedFeature = createRandomFeature();
  unsavedNamedFeature.properties.name = 'hamster';
  unsavedNamedFeature.properties.description = 'i am a hamster geofence';

  unsavedUnnamedFeature = createRandomFeature();
  delete unsavedUnnamedFeature.properties.name;

  featureCollection = {
    type: 'FeatureCollection',
    properties: {},
    features: [unsavedNamedFeature, unsavedUnnamedFeature]
  };
});

describe('toGeoJson()', () => {
  test('when unsaved, named Feature', () => {
    const expectedFilename = `${unsavedNamedFeature.properties.name}.geojson`;
    const expectedMimeType = 'application/json';

    const actual = toGeoJson(unsavedNamedFeature);
    const actualParsed = JSON.parse(actual.data);

    expect(actual.filename).toEqual(expectedFilename);
    expect(actual.mimetype).toEqual(expectedMimeType);

    expect(actualParsed.properties.name).toEqual(unsavedNamedFeature.properties.name);
    expect(actualParsed.properties.description).toEqual(unsavedNamedFeature.properties.description);
    expect(actualParsed.id).toBeUndefined();
  });

  test('when unsaved, unnamed Feature', () => {
    const expectedFilename = `${UNNAMED}.geojson`;
    const expectedMimeType = 'application/json';

    const actual = toGeoJson(unsavedUnnamedFeature);
    const actualParsed = JSON.parse(actual.data);

    expect(actual.filename).toEqual(expectedFilename);
    expect(actual.mimetype).toEqual(expectedMimeType);

    expect(actualParsed.properties.name).toEqual(UNNAMED);
    expect(actualParsed.properties.description).toEqual('');
    expect(actualParsed.id).toBeUndefined();
  });

  test('when feature collection', () => {
    const expectedFilename = `geojsonFeatures.geojson`;
    const expectedMimeType = 'application/json';

    const actual = toGeoJson(featureCollection);
    const actualParsed: GeoJsonFeatureCollection = JSON.parse(actual.data);

    expect(actual.filename).toEqual(expectedFilename);
    expect(actual.mimetype).toEqual(expectedMimeType);

    expect(actualParsed.features[0].id).toBeUndefined();
    expect(actualParsed.features[0].properties.name).toEqual(
      featureCollection.features[0].properties.name
    );

    expect(actualParsed.features[1].id).toBeUndefined();
    expect(actualParsed.features[1].properties.name).toEqual(UNNAMED);
  });
});

describe('toKml()', () => {
  test('when unsaved, named Feature', () => {
    const expectedFilename = `${unsavedNamedFeature.properties.name}.kml`;
    const expectedMimeType = 'application/xml';

    const actual = toKml(unsavedNamedFeature);

    expect(actual.filename).toEqual(expectedFilename);
    expect(actual.mimetype).toEqual(expectedMimeType);

    expect(actual.data).toContain(`<name>${unsavedNamedFeature.properties.name}</name>`);

    expect(actual.data).toContain(
      `<description>${unsavedNamedFeature.properties.description}</description>`
    );
  });

  test('when unsaved, unnamed Feature', () => {
    const expectedFilename = `${UNNAMED}.kml`;
    const expectedMimeType = 'application/xml';

    const actual = toKml(unsavedUnnamedFeature);

    expect(actual.filename).toEqual(expectedFilename);
    expect(actual.mimetype).toEqual(expectedMimeType);

    expect(actual.data).toContain(`<name>${UNNAMED}</name>`);
  });
});

describe('toWkt()', () => {
  test('when feature', () => {
    const expectedFilename = `llamallama.wkt`;
    const expectedMimeType = 'text/plain';
    const expectedData = 'POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))';

    const actual = toWkt({
      type: 'Feature',
      properties: { name: 'llamallama' },
      id: 'abc',
      geometry: {
        type: 'Polygon',
        coordinates: [[[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]]
      }
    });

    expect(actual.filename).toEqual(expectedFilename);
    expect(actual.mimetype).toEqual(expectedMimeType);
    expect(actual.data).toEqual(expectedData);
  });

  test('when feature collection', () => {
    const expectedFilename = `geojsonFeatures.wkt`;
    const expectedMimeType = 'text/plain';
    const expectedData =
      'POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))\nPOLYGON ((3 1, 4 4, 2 4, 1 2, 3 1))';

    const actual = toWkt({
      type: 'FeatureCollection',
      properties: {},
      features: [
        {
          type: 'Feature',
          properties: { name: 'llamallama1' },
          id: 'abc',
          geometry: {
            type: 'Polygon',
            coordinates: [[[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]]
          }
        },
        {
          type: 'Feature',
          properties: { name: 'llamallama2' },
          id: 'def',
          geometry: {
            type: 'Polygon',
            coordinates: [[[3, 1], [4, 4], [2, 4], [1, 2], [3, 1]]]
          }
        }
      ]
    });

    expect(actual.filename).toEqual(expectedFilename);
    expect(actual.mimetype).toEqual(expectedMimeType);
    expect(actual.data).toEqual(expectedData);
  });

  test('when empty feature collection', () => {
    const expectedFilename = `geojsonFeatures.wkt`;
    const expectedMimeType = 'text/plain';
    const expectedData = '';

    const actual = toWkt({
      type: 'FeatureCollection',
      properties: {},
      features: []
    });

    expect(actual.filename).toEqual(expectedFilename);
    expect(actual.mimetype).toEqual(expectedMimeType);
    expect(actual.data).toEqual(expectedData);
  });
});

describe('toStats()', () => {
  test('when feature', () => {
    const expectedFilename = `llamallama.txt`;
    const expectedMimeType = 'text/plain';
    const expectedData = 'Features: 1\nPolygons: 1\nRings: 1\nPoints: 5';

    const actual = toStats({
      type: 'Feature',
      properties: { name: 'llamallama' },
      id: 'abc',
      geometry: {
        type: 'Polygon',
        coordinates: [[[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]]
      }
    });

    expect(actual.filename).toEqual(expectedFilename);
    expect(actual.mimetype).toEqual(expectedMimeType);
    expect(actual.data).toEqual(expectedData);
  });

  test('when feature collection', () => {
    const expectedFilename = `geojsonFeatures.txt`;
    const expectedMimeType = 'text/plain';
    const expectedData = 'Features: 2\nPolygons: 3\nRings: 4\nPoints: 20';

    const actual = toStats({
      type: 'FeatureCollection',
      properties: {},
      features: [
        {
          type: 'Feature',
          properties: { name: 'llamallama1' },
          id: 'abc',
          geometry: {
            type: 'Polygon',
            coordinates: [[[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]]
          }
        },
        {
          type: 'Feature',
          properties: { name: 'llamallama2' },
          id: 'def',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [[3, 1], [4, 4], [2, 4], [1, 2], [3, 1]],
                [[3.5, 3.5], [2, 3.5], [1.5, 2], [2.5, 1.5], [3.5, 3.5]]
              ],
              [[[13, 11], [14, 14], [12, 14], [11, 12], [13, 11]]]
            ]
          }
        }
      ]
    });

    expect(actual.filename).toEqual(expectedFilename);
    expect(actual.mimetype).toEqual(expectedMimeType);
    expect(actual.data).toEqual(expectedData);
  });
});

describe('toIds()', () => {
  test('when feature', () => {
    const expectedFilename = `llamallama.txt`;
    const expectedMimeType = 'text/plain';
    const expectedData = 'abc';

    const actual = toIds({
      type: 'Feature',
      properties: { name: 'llamallama' },
      id: 'abc',
      geometry: {
        type: 'Polygon',
        coordinates: [[[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]]
      }
    });

    expect(actual.filename).toEqual(expectedFilename);
    expect(actual.mimetype).toEqual(expectedMimeType);
    expect(actual.data).toEqual(expectedData);
  });

  test('when feature collection', () => {
    const expectedFilename = `geojsonFeatures.txt`;
    const expectedMimeType = 'text/plain';
    const expectedData = 'abc\ndef';

    const actual = toIds({
      type: 'FeatureCollection',
      properties: {},
      features: [
        {
          type: 'Feature',
          properties: { name: 'llamallama1' },
          id: 'abc',
          geometry: {
            type: 'Polygon',
            coordinates: [[[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]]
          }
        },
        {
          type: 'Feature',
          properties: { name: 'llamallama2' },
          id: 'def',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [[3, 1], [4, 4], [2, 4], [1, 2], [3, 1]],
                [[3.5, 3.5], [2, 3.5], [1.5, 2], [2.5, 1.5], [3.5, 3.5]]
              ],
              [[[13, 11], [14, 14], [12, 14], [11, 12], [13, 11]]]
            ]
          }
        },
        {
          type: 'Feature',
          properties: {},
          id: newFeatureId(),
          geometry: {
            type: 'Polygon',
            coordinates: [[[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]]
          }
        }
      ]
    });

    expect(actual.filename).toEqual(expectedFilename);
    expect(actual.mimetype).toEqual(expectedMimeType);
    expect(actual.data).toEqual(expectedData);
  });
});