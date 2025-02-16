import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment as EnvironmentMap } from '@react-three/drei'
import { Suspense } from 'react'
import { Environment } from './Environment'
import { Boy } from './Boy'

const Scene = () => {
  // Fixed isometric-like camera position
  const CAMERA_POSITION = [30, 20, 30]
  const CAMERA_FOV = 45
  const CAMERA_TARGET = [0, 0, 0]

  return (
    <Canvas 
      camera={{ 
        position: CAMERA_POSITION,
        fov: CAMERA_FOV,
        // Lock the camera by setting up initial target
        lookAt: CAMERA_TARGET
      }}
      shadows
    >
      <color attach="background" args={['#87CEEB']} /> {/* Sky blue background */}
      <Suspense fallback={null}>
        <Environment />
        <Boy />
        {/* Remove OrbitControls to lock camera */}
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