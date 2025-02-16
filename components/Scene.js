import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, useProgress } from '@react-three/drei'
import { Suspense, useEffect } from 'react'
import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

function LoadingScreen() {
  const { progress } = useProgress()
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '1.5em',
      color: 'black'
    }}>
      {progress.toFixed(0)}% loaded
    </div>
  )
}

function Model() {
  const gltf = useGLTF('/girl.glb', true, true, (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    loader.setDRACOLoader(dracoLoader)
  })
  console.log('GLTF loaded:', gltf)
  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.frustumCulled = true
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [gltf])

  return <primitive object={gltf.scene} scale={1.5} position={[0, -1, 0]} />
}

const Scene = () => {
  return (
    <Canvas 
      camera={{ position: [0, 1, 5], fov: 45 }}
      shadows
    >
      <color attach="background" args={['#f0f0f0']} />
      <Suspense fallback={<LoadingScreen />}>
        <Model />
        <OrbitControls 
          makeDefault 
          maxPolarAngle={Math.PI / 2} 
          minPolarAngle={0}
        />
        <Environment preset="sunset" />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
        />
        <gridHelper args={[10, 10]} />
      </Suspense>
    </Canvas>
  )
}

export default Scene 