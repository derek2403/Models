import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment as EnvironmentMap } from '@react-three/drei'
import { Suspense } from 'react'
import { Environment } from './Environment'
import { Boy } from './Boy'

const Scene = () => {
  return (
    <Canvas 
      camera={{ position: [0, 10, 20], fov: 45 }}
      shadows
    >
      <color attach="background" args={['#87CEEB']} /> {/* Sky blue background */}
      <Suspense fallback={null}>
        <Environment />
        <Boy />
        <OrbitControls 
          makeDefault 
          maxPolarAngle={Math.PI / 2.5} 
          minPolarAngle={Math.PI / 6}
        />
        <EnvironmentMap preset="sunset" />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
      </Suspense>
    </Canvas>
  )
}

export default Scene 