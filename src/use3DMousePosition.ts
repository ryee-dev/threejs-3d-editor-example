import React from "react";
import * as THREE from "three";
import { useThree } from "react-three-fiber";
import useEventListener from "./useEventListener";
import { Camera } from "three";

export function get3DMousePosition(
  x: number,
  y: number,
  width: number,
  height: number,
  camera: Camera
) {
  var raycaster = new THREE.Raycaster();
  var planeY = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  var mv = new THREE.Vector2((x / width) * 2 - 1, -(y / height) * 2 + 1);
  raycaster.setFromCamera(mv, camera);
  let pos = new THREE.Vector3();
  raycaster.ray.intersectPlane(planeY, pos);
  return pos;
}

export default function use3DMousePosition(initVal = [0, 0, 0]) {
  const [position, setPosition] = React.useState(initVal);
  const { gl, camera, viewport } = useThree();
  const { width, height } = viewport;
  const { left, top } = gl.domElement.getBoundingClientRect();
  useEventListener("mousemove", (e: MouseEvent) => {
    const pos = get3DMousePosition(
      e.clientX - left,
      e.clientY - top,
      width,
      height,
      camera
    );

    const { x, y, z } = pos;
    setPosition([x, y, z]);
  });
  return position;
}
