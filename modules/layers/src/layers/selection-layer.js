// @flow
/* eslint-env browser */
import { CompositeLayer } from 'kepler-outdated-deck.gl-core';
import { PolygonLayer } from 'kepler-outdated-deck.gl-layers';
import { polygon } from '@turf/helpers';
import turfBuffer from '@turf/buffer';
import turfDifference from '@turf/difference';

import EditableGeoJsonLayer from './editable-geojson-layer';

export const SELECTION_TYPE = {
  NONE: null,
  RECTANGLE: 'rectangle',
  POLYGON: 'polygon'
};

const defaultProps = {
  selectionType: SELECTION_TYPE.RECTANGLE,
  layerIds: [],
  onSelect: () => {}
};

const EMPTY_DATA = {
  type: 'FeatureCollection',
  features: []
};

const EXPANSION_KM = 50;
const LAYER_ID_GEOJSON = 'selection-geojson';
const LAYER_ID_BLOCKER = 'selection-blocker';

const PASS_THROUGH_PROPS = [
  'lineWidthScale',
  'lineWidthMinPixels',
  'lineWidthMaxPixels',
  'lineWidthUnits',
  'lineJointRounded',
  'lineMiterLimit',
  'pointRadiusScale',
  'pointRadiusMinPixels',
  'pointRadiusMaxPixels',
  'lineDashJustified',
  'getLineColor',
  'getFillColor',
  'getRadius',
  'getLineWidth',
  'getLineDashArray',
  'getTentativeLineDashArray',
  'getTentativeLineColor',
  'getTentativeFillColor',
  'getTentativeLineWidth'
];

export default class SelectionLayer extends CompositeLayer {
  _selectRectangleObjects(coordinates: any) {
    const { layerIds, onSelect } = this.props;

    const [x1, y1] = this.context.viewport.project(coordinates[0][0]);
    const [x2, y2] = this.context.viewport.project(coordinates[0][2]);

    const pickingInfos = this.context.deck.pickObjects({
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
      layerIds
    });

    onSelect({ pickingInfos });
  }

  _selectPolygonObjects(coordinates: any) {
    const { layerIds, onSelect } = this.props;
    const mousePoints = coordinates[0].map(c => this.context.viewport.project(c));

    const allX = mousePoints.map(mousePoint => mousePoint[0]);
    const allY = mousePoints.map(mousePoint => mousePoint[1]);
    const x = Math.min(...allX);
    const y = Math.min(...allY);
    const maxX = Math.max(...allX);
    const maxY = Math.max(...allY);

    // Use a polygon to hide the outside, because pickObjects()
    // does not support polygons
    const landPointsPoly = polygon(coordinates);
    const bigBuffer = turfBuffer(landPointsPoly, EXPANSION_KM);
    let bigPolygon;
    try {
      // turfDifference throws an exception if the polygon
      // intersects with itself (TODO: check if true in all versions)
      bigPolygon = turfDifference(bigBuffer, landPointsPoly);
    } catch (e) {
      // invalid selection polygon
      console.log('turfDifference() error', e); // eslint-disable-line
      return;
    }

    this.setState({
      pendingPolygonSelection: {
        bigPolygon
      }
    });

    const blockerId = `${this.props.id}-${LAYER_ID_BLOCKER}`;

    // HACK, find a better way
    setTimeout(() => {
      const pickingInfos = this.context.deck.pickObjects({
        x,
        y,
        width: maxX - x,
        height: maxY - y,
        layerIds: [blockerId, ...layerIds]
      });

      onSelect({
        pickingInfos: pickingInfos.filter(item => item.layer.id !== this.props.id)
      });
    }, 250);
  }

  renderLayers() {
    const { pendingPolygonSelection } = this.state;

    const mode =
      {
        [SELECTION_TYPE.RECTANGLE]: 'drawRectangle',
        [SELECTION_TYPE.POLYGON]: 'drawPolygon'
      }[this.props.selectionType] || 'view';

    const inheritedProps = {};
    PASS_THROUGH_PROPS.forEach(p => {
      if (this.props[p] !== undefined) inheritedProps[p] = this.props[p];
    });

    const layers = [
      new EditableGeoJsonLayer(
        this.getSubLayerProps({
          id: LAYER_ID_GEOJSON,
          pickable: true,
          mode,
          selectedFeatureIndexes: [],
          data: EMPTY_DATA,
          onEdit: ({ updatedData, editType }) => {
            if (editType === 'addFeature') {
              const { coordinates } = updatedData.features[0].geometry;

              if (this.props.selectionType === SELECTION_TYPE.RECTANGLE) {
                this._selectRectangleObjects(coordinates);
              } else if (this.props.selectionType === SELECTION_TYPE.POLYGON) {
                this._selectPolygonObjects(coordinates);
              }
            }
          },
          ...inheritedProps
        })
      )
    ];

    if (pendingPolygonSelection) {
      const { bigPolygon } = pendingPolygonSelection;
      layers.push(
        new PolygonLayer(
          this.getSubLayerProps({
            id: LAYER_ID_BLOCKER,
            pickable: true,
            stroked: false,
            opacity: 1.0,
            data: [bigPolygon],
            getLineColor: obj => [0, 0, 0, 1],
            getFillColor: obj => [0, 0, 0, 1],
            getPolygon: o => o.geometry.coordinates
          })
        )
      );
    }

    return layers;
  }

  shouldUpdateState({ changeFlags: { stateChanged, propsOrDataChanged } }: Object) {
    return stateChanged || propsOrDataChanged;
  }
}

SelectionLayer.layerName = 'SelectionLayer';
SelectionLayer.defaultProps = defaultProps;
