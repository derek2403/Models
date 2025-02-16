import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment as EnvironmentMap } from '@react-three/drei'
import { Suspense } from 'react'
import { Boy } from '../components/Boy'
import { Environment } from '../components/Environment'

export default function Home() {
  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        camera={{
          position: [15, 15, 15],
          fov: 50
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          <Boy />
          <Environment />
          
          <OrbitControls
            target={[0, 1, 0]}
            maxPolarAngle={Math.PI / 2.5}
            minPolarAngle={Math.PI / 6}
          />
          
          <EnvironmentMap preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  )
}
