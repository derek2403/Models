import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { House } from './House'
import { Landscape } from './Landscape'

export function Environment() {
  // Load grass texture
  const grassTexture = useTexture('/textures/grass.png')

  // Configure grass texture repeating
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping
  grassTexture.repeat.set(20, 20)  // Increased repeat for larger area

  const GROUND_SIZE = 200
  const GROUND_HEIGHT = -0.1 // Slightly below 0 to prevent z-fighting

  return (
    <group position={[0, 0, 0]}>
      {/* Grass ground */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, GROUND_HEIGHT, 0]} 
        receiveShadow
      >
        <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
        <meshStandardMaterial 
          map={grassTexture}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* House is centered at origin */}
      <House />
      <Landscape />
    </group>
  )
} 