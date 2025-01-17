// @flow
/* eslint-env browser */

import { CompositeLayer } from 'kepler-outdated-deck.gl-core';
import { ScatterplotLayer, LineLayer } from 'kepler-outdated-deck.gl-layers';

const defaultProps = {};

export default class ElevatedEditHandleLayer extends CompositeLayer {
  renderLayers() {
    const handles = new ScatterplotLayer(
      Object.assign({}, this.props, {
        id: `${this.props.id}-ScatterplotLayer`,
        data: this.props.data
      })
    );

    const lines = new LineLayer(
      Object.assign({}, this.props, {
        id: `${this.props.id}-LineLayer`,
        data: this.props.data,
        pickable: false,
        getSourcePosition: ({ position }) => [position[0], position[1], 0],
        getTargetPosition: ({ position }) => [position[0], position[1], position[2] || 0],
        getColor: [150, 150, 150, 200],
        getStrokeWidth: 3
      })
    );

    return [handles, lines];
  }
}

ElevatedEditHandleLayer.layerName = 'ElevatedEditHandleLayer';
ElevatedEditHandleLayer.defaultProps = defaultProps;
