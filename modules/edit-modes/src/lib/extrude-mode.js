// @flow

import bearing from '@turf/bearing';
import { generatePointsParallelToLinePoints } from '../utils.js';
import type { FeatureCollection } from '../geojson-types.js';
import type {
  ModeProps,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent
} from '../types.js';
import { getPickedEditHandle, type GeoJsonEditAction } from './geojson-edit-mode.js';
import { ModifyMode } from './modify-mode.js';
import { ImmutableFeatureCollection } from './immutable-feature-collection.js';

export class ExtrudeMode extends ModifyMode {
  isPointAdded: boolean = false;
  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void {
    let editAction: ?GeoJsonEditAction = null;

    const editHandle = getPickedEditHandle(event.pointerDownPicks);

    if (event.isDragging && editHandle) {
      const size = this.coordinatesSize(
        editHandle.positionIndexes,
        editHandle.featureIndex,
        props.data
      );
      const positionIndexes = this.isPointAdded
        ? this.nextPositionIndexes(editHandle.positionIndexes, size)
        : editHandle.positionIndexes;
      // p1 and p1 are end points for edge
      const p1 = this.getPointForPositionIndexes(
        this.prevPositionIndexes(positionIndexes, size),
        editHandle.featureIndex,
        props.data
      );
      const p2 = this.getPointForPositionIndexes(
        positionIndexes,
        editHandle.featureIndex,
        props.data
      );
      if (p1 && p2) {
        // p3 and p4 are end points for moving (extruding) edge
        const [p3, p4] = generatePointsParallelToLinePoints(p1, p2, event.mapCoords);

        const updatedData = new ImmutableFeatureCollection(props.data)
          .replacePosition(
            editHandle.featureIndex,
            this.prevPositionIndexes(positionIndexes, size),
            p4
          )
          .replacePosition(editHandle.featureIndex, positionIndexes, p3)
          .getObject();

        editAction = {
          updatedData,
          editType: 'extruding',
          editContext: {
            featureIndexes: [editHandle.featureIndex],
            positionIndexes: this.nextPositionIndexes(editHandle.positionIndexes, size),
            position: p3
          }
        };

        props.onEdit(editAction);
      }
    }

    const cursor = this.getCursor(event);
    props.onUpdateCursor(cursor);

    // Cancel map panning if pointer went down on an edit handle
    const cancelMapPan = Boolean(editHandle);
    if (cancelMapPan) {
      event.sourceEvent.stopPropagation();
    }
  }

  handleStartDraggingAdapter(
    event: StartDraggingEvent,
    props: ModeProps<FeatureCollection>
  ): ?GeoJsonEditAction {
    let editAction: ?GeoJsonEditAction = null;

    const selectedFeatureIndexes = props.selectedIndexes;

    const editHandle = getPickedEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle && editHandle.type === 'intermediate') {
      const size = this.coordinatesSize(
        editHandle.positionIndexes,
        editHandle.featureIndex,
        props.data
      );
      // p1 and p1 are end points for edge
      const p1 = this.getPointForPositionIndexes(
        this.prevPositionIndexes(editHandle.positionIndexes, size),
        editHandle.featureIndex,
        props.data
      );
      const p2 = this.getPointForPositionIndexes(
        editHandle.positionIndexes,
        editHandle.featureIndex,
        props.data
      );

      if (p1 && p2) {
        let updatedData = new ImmutableFeatureCollection(props.data);
        if (
          !this.isOrthogonal(editHandle.positionIndexes, editHandle.featureIndex, size, props.data)
        ) {
          updatedData = updatedData.addPosition(
            editHandle.featureIndex,
            editHandle.positionIndexes,
            p2
          );
        }
        if (
          !this.isOrthogonal(
            this.prevPositionIndexes(editHandle.positionIndexes, size),
            editHandle.featureIndex,
            size,
            props.data
          )
        ) {
          updatedData = updatedData.addPosition(
            editHandle.featureIndex,
            editHandle.positionIndexes,
            p1
          );
          this.isPointAdded = true;
        }

        editAction = {
          updatedData: updatedData.getObject(),
          editType: 'startExtruding',
          editContext: {
            featureIndexes: [editHandle.featureIndex],
            positionIndexes: editHandle.positionIndexes,
            position: p1
          }
        };
      }
    }

    return editAction;
  }

  handleStopDraggingAdapter(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>
  ): ?GeoJsonEditAction {
    let editAction: ?GeoJsonEditAction = null;

    const selectedFeatureIndexes = props.selectedIndexes;
    const editHandle = getPickedEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle) {
      const size = this.coordinatesSize(
        editHandle.positionIndexes,
        editHandle.featureIndex,
        props.data
      );
      const positionIndexes = this.isPointAdded
        ? this.nextPositionIndexes(editHandle.positionIndexes, size)
        : editHandle.positionIndexes;
      // p1 and p1 are end points for edge
      const p1 = this.getPointForPositionIndexes(
        this.prevPositionIndexes(positionIndexes, size),
        editHandle.featureIndex,
        props.data
      );
      const p2 = this.getPointForPositionIndexes(
        positionIndexes,
        editHandle.featureIndex,
        props.data
      );

      if (p1 && p2) {
        // p3 and p4 are end points for new moved (extruded) edge
        const [p3, p4] = generatePointsParallelToLinePoints(p1, p2, event.mapCoords);

        const updatedData = new ImmutableFeatureCollection(props.data)
          .replacePosition(
            editHandle.featureIndex,
            this.prevPositionIndexes(positionIndexes, size),
            p4
          )
          .replacePosition(editHandle.featureIndex, positionIndexes, p3)
          .getObject();

        editAction = {
          updatedData,
          editType: 'extruded',
          editContext: {
            featureIndexes: [editHandle.featureIndex],
            positionIndexes: editHandle.positionIndexes,
            position: p3
          }
        };
      }
    }
    this.isPointAdded = false;

    return editAction;
  }

  coordinatesSize(
    positionIndexes: number[],
    featureIndex: number,
    { features }: FeatureCollection
  ) {
    let size = 0;
    const feature = features[featureIndex];
    const coordinates: any = feature.geometry.coordinates;
    // for Multi polygons, length will be 3
    if (positionIndexes.length === 3) {
      const [a, b] = positionIndexes;
      if (coordinates.length && coordinates[a].length) {
        size = coordinates[a][b].length;
      }
    } else {
      const [b] = positionIndexes;
      if (coordinates.length && coordinates[b].length) {
        size = coordinates[b].length;
      }
    }
    return size;
  }

  getBearing(p1: any, p2: any) {
    const angle = bearing(p1, p2);
    if (angle < 0) {
      return Math.floor(360 + angle);
    }
    return Math.floor(angle);
  }

  isOrthogonal(
    positionIndexes: number[],
    featureIndex: number,
    size: number,
    features: FeatureCollection
  ) {
    if (positionIndexes[positionIndexes.length - 1] === size - 1) {
      positionIndexes[positionIndexes.length - 1] = 0;
    }
    const prevPoint = this.getPointForPositionIndexes(
      this.prevPositionIndexes(positionIndexes, size),
      featureIndex,
      features
    );
    const nextPoint = this.getPointForPositionIndexes(
      this.nextPositionIndexes(positionIndexes, size),
      featureIndex,
      features
    );
    const currentPoint = this.getPointForPositionIndexes(positionIndexes, featureIndex, features);
    const prevAngle = this.getBearing(currentPoint, prevPoint);
    const nextAngle = this.getBearing(currentPoint, nextPoint);
    return [89, 90, 91, 269, 270, 271].includes(Math.abs(prevAngle - nextAngle));
  }

  nextPositionIndexes(positionIndexes: number[], size: number): number[] {
    const next = [...positionIndexes];
    if (next.length) {
      next[next.length - 1] = next[next.length - 1] === size - 1 ? 0 : next[next.length - 1] + 1;
    }
    return next;
  }

  prevPositionIndexes(positionIndexes: number[], size: number): number[] {
    const prev = [...positionIndexes];
    if (prev.length) {
      prev[prev.length - 1] = prev[prev.length - 1] === 0 ? size - 2 : prev[prev.length - 1] - 1;
    }
    return prev;
  }

  getPointForPositionIndexes(
    positionIndexes: number[],
    featureIndex: number,
    { features }: FeatureCollection
  ) {
    let p1;
    const feature = features[featureIndex];
    const coordinates: any = feature.geometry.coordinates;
    // for Multi polygons, length will be 3
    if (positionIndexes.length === 3) {
      const [a, b, c] = positionIndexes;
      if (coordinates.length && coordinates[a].length) {
        p1 = coordinates[a][b][c];
      }
    } else {
      const [b, c] = positionIndexes;
      if (coordinates.length && coordinates[b].length) {
        p1 = coordinates[b][c];
      }
    }
    return p1;
  }
}
