import React from "react";
import {
  OrbitControls,
  MapControls,
  OrthographicCamera,
  PerspectiveCamera
} from "drei";
import * as THREE from "three";

const CameraView = (props) => {
  const { isOrthographic } = props;
  return (
    <>
      {isOrthographic ? (
        // @ts-ignore
        <MapControls
          enableRotate={false}
          dampingFactor={0.6}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.PAN,
            RIGHT: THREE.MOUSE.PAN
          }}
        />
      ) : (
        // @ts-ignore
        <OrbitControls
          maxDistance={100}
          minDistance={10}
          enablePan
          dampingFactor={0.6}
          maxPolarAngle={Math.PI / 2.1}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
          }}
        />
      )}
      {
        // @ts-ignore
        <OrthographicCamera
          makeDefault={isOrthographic}
          position={[0, 100, 0]}
          zoom={45}
        />
      }

      {
        // @ts-ignore
        <PerspectiveCamera
          makeDefault={!isOrthographic}
          position={[20, 20, -20]}
        />
      }
    </>
  );
};

export default CameraView;
