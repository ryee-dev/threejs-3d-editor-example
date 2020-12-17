import * as React from "react";
import uuid from "uuid";
import PanControls from "./PanControlsContainer";
import Camera from "./Camera";
import Grid from "./Grid";
import use3DMousePosition from "./use3DMousePosition";
import BackPlane from "./BackPlane";
import Entity from "./Entity";
import useEventListener from "./useEventListener";
import DragSelect from "./DragSelect";
interface SceneControlProps {
  recenter: number;
}
const SceneControl: React.FC<SceneControlProps> = ({ recenter }) => {
  return (
    <>
      <PanControls recenter={recenter} />
    </>
  );
};

interface CanvasAppProps {
  recenter: number;
  selected: string[];
  setSelected: React.Dispatch<string[]>;
  setDragging: React.Dispatch<any>;
  dragging: any;
  selecting: boolean;
}
const CanvasApp: React.FC<CanvasAppProps> = ({
  recenter,
  selected,
  setSelected,
  setDragging,
  dragging,
  selecting,
  entities,
  setEntities
}) => {
  const mousePosition = use3DMousePosition();
  React.useEffect(() => {
    function mouseUp() {
      setDragging(false);
      document.removeEventListener("mouseup", mouseUp);
      const id = uuid.v4();
      setEntities(e => [...e, { id, ...dragging, position: mousePosition }]);

      setSelected([id]);
    }
    if (dragging) {
      document.addEventListener("mouseup", mouseUp);
    }
    return () => document.removeEventListener("mouseup", mouseUp);
  }, [dragging, setDragging, mousePosition]);

  const elementList = ["input", "textarea"];
  useEventListener("keydown", (e: KeyboardEvent) => {
    if (elementList.includes(e.target.tagName)) return;
    if (e.key === "Backspace" && selected) {
      setEntities(e => e.filter(({ id }) => !selected.includes(id)));
      setSelected([]);
    }
  });
  return (
    <>
      <Camera />
      <SceneControl recenter={recenter} />
      <ambientLight />
      <Grid />
      <pointLight position={[10, 10, -10]} />

      {dragging && (
        <Entity
          dragging
          {...dragging}
          mousePosition={mousePosition}
          setPosition={() => {}}
        />
      )}
      {entities.map(e => (
        <Entity
          key={e.id}
          {...e}
          selected={selected && selected.includes(e.id)}
          setSelected={setSelected}
          setPosition={(fn: (p: any) => void) => {
            setEntities(entities => {
              return entities.map(e => {
                if (selected && selected.includes(e.id)) {
                  return { ...e, position: fn(e.position) };
                }
                return e;
              });
            });
          }}
        />
      ))}

      <BackPlane setSelected={setSelected} />
      <DragSelect
        selecting={selecting}
        setSelected={setSelected}
        entities={entities}
      />
    </>
  );
};

export default CanvasApp;
