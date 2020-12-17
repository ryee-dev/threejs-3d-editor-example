import * as React from "react";
import * as THREE from "three";
import { extend, useFrame, useThree } from "react-three-fiber";
import PanControls from "./PanControls";
import { CanvasContext } from "./CanvasContext";
extend({ PanControls });

export default function PanControlsContainer({ recenter }) {
  const [context] = React.useContext(CanvasContext);
  const controls = React.useRef();
  const { camera, gl } = useThree();
  React.useEffect(() => {
    camera.position.set(0, 0, 100000);
    controls.current.reset();
  }, [recenter, camera]);
  useFrame(state => {
    controls.current.update();
  });
  return (
    <panControls
      ref={controls}
      enabled={!context.dragging}
      args={[camera, gl.domElement]}
      enableRotate={false}
      screenSpacePanning={true}
      maxZoom={10000}
      minZoom={0.00018}
      mouseButtons={{
        MIDDLE: THREE.MOUSE.DOLLY,
        LEFT: THREE.MOUSE.PAN
      }}
    />
  );
}
