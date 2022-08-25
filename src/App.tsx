import { Suspense, useEffect, useState } from "react"
import { Canvas } from "react-three-fiber"
import { Stats, OrbitControls, useGLTF } from "@react-three/drei"
import { EdgesGeometry, LineBasicMaterial } from 'three'

interface RoomProp {
  position: [number, number, number],
  isSelected: boolean
}

function Room({position, isSelected}:RoomProp) {
  const {nodes}:any = useGLTF('/level-react-draco.glb')

  const lineMaterial = new LineBasicMaterial({color: 0x000000, linewidth: 10})

  return <group position={position} rotation={[Math.PI / 2, -Math.PI / 9, 0]}>
          <mesh geometry={nodes.Level.geometry} material={nodes.Level.material}  />
          {isSelected && <lineSegments geometry={new EdgesGeometry(nodes.Level.geometry)} material={lineMaterial} />}
        </group>
}

const boxes = [[0, 0, 0],[-2, 0, 2],[0, -2, 2],[-2, -2, 4]]

const App = () => {
  let [selectedIdx , setSelectedIdx] = useState(0)

  const handler = (e:any) => {
    if (e.key == 'ArrowRight') {
      selectedIdx++
      selectedIdx = selectedIdx % boxes.length
      console.log(selectedIdx)
      setSelectedIdx (selectedIdx)
    } else if (e.key == 'ArrowLeft') {
      selectedIdx--
      if (selectedIdx < 0) selectedIdx = boxes.length - 1
      setSelectedIdx (selectedIdx)
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', handler)
    return (() => {
      window.removeEventListener('keydown', handler)
    })
  }, [selectedIdx])

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <Canvas
        orthographic camera={{ zoom: 120, position: [10, 10, 10] }}
        onCreated={({ gl }) => {
          gl.setClearColor("#252934");
        }}
      >
        <Stats />
        <OrbitControls />
        <Suspense fallback={null}>
          {
            boxes.map(([x, y, z], idx) => <Room position={[x, y, z]} key={idx} isSelected={idx==selectedIdx} />)
          }

        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;
