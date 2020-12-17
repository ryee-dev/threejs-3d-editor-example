import React from "react";
import { useThree } from "react-three-fiber";
import useEventListener from "./useEventListener";
import { CanvasContext, ActionType } from "./CanvasContext";
import * as THREE from "three";
import { PlaneBufferGeometry } from "three";
import { get3DMousePosition } from "./use3DMousePosition";

export default function DragSelect({ setSelected, entities, selecting }) {
  const [{ dragging }, dispatch] = React.useContext(CanvasContext);
  const { camera, gl: renderer, viewport } = useThree();
  const [box, setBox] = React.useState(null);
  const { left, top } = renderer.domElement.getBoundingClientRect();

  useEventListener(
    "mousedown",
    function(event) {
      if (event.target.parentElement.id !== "level-editor") return;
      if (dragging || !selecting) return;
      dispatch({ type: ActionType.dragging });
      const position = get3DMousePosition(
        event.clientX - left,
        event.clientY - top,
        viewport.width,
        viewport.height,
        camera
      );
      setBox({
        x: position.x,
        y: position.y,
        width: 0.001,
        height: 0.001,
        startPointX: position.x,
        startPointY: position.y
      });
    },
    document
  );

  useEventListener(
    "mousemove",
    function(event) {
      if (box) {
        const position = get3DMousePosition(
          event.clientX - left,
          event.clientY - top,
          viewport.width,
          viewport.height,
          camera
        );
        const pointBottomRightX = Math.max(box.startPointX, position.x);
        const pointBottomRightY = Math.max(box.startPointY, position.y);
        const pointTopLeftX = Math.min(box.startPointX, position.x);
        const pointTopLeftY = Math.min(box.startPointY, position.y);

        const width = pointBottomRightX - pointTopLeftX;
        const height = pointBottomRightY - pointTopLeftY;
        // Since the box is centered around it's position, we have to
        // transform it.
        const x = pointTopLeftX + width / 2;
        const y = pointBottomRightY - height / 2;

        setBox(box => {
          return {
            ...box,
            x,
            y,
            width: width || 0.01,
            height: height || 0.01
          };
        });

        const ids = entities
          .filter(({ position }) => {
            return (
              position[0] > pointTopLeftX &&
              position[0] < pointBottomRightX &&
              position[1] < pointBottomRightY &&
              position[1] > pointTopLeftY
            );
          })
          .map(e => e.id);
        setSelected(ids);
      }
    },
    document
  );

  useEventListener(
    "mouseup",
    function(event) {
      if (box) {
        const position = get3DMousePosition(
          event.clientX - left,
          event.clientY - top,
          viewport.width,
          viewport.height,
          camera
        );
        const pointBottomRightX = Math.max(box.startPointX, position.x);
        const pointBottomRightY = Math.max(box.startPointY, position.y);
        const pointTopLeftX = Math.min(box.startPointX, position.x);
        const pointTopLeftY = Math.min(box.startPointY, position.y);
        const ids = entities
          .filter(({ position }) => {
            return (
              position[0] > pointTopLeftX &&
              position[0] < pointBottomRightX &&
              position[1] < pointBottomRightY &&
              position[1] > pointTopLeftY
            );
          })
          .map(e => e.id);
        setSelected(ids);

        setBox(null);
        dispatch({ type: ActionType.dropped });
      }
    },
    document
  );

  const [planeGeo, edgeGeo] = React.useMemo(() => {
    const geo = new PlaneBufferGeometry(
      box ? box.width : 0,
      box ? box.height : 0
    );
    return [geo, new THREE.EdgesGeometry(geo)];
  }, [box]);
  if (!box) return null;
  return (
    <>
      <mesh position={[box.x, box.y, 100]} geometry={planeGeo}>
        <meshBasicMaterial
          color={0x4ba0ff}
          transparent={true}
          opacity={0.3}
          attach="material"
        />
      </mesh>
      <lineSegments position={[box.x, box.y, 100]} geometry={edgeGeo}>
        <lineBasicMaterial color={0x55aaff} attach="material" />
      </lineSegments>
    </>
  );
}
