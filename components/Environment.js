import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { House } from './House'

export function Environment() {
  // Load grass texture
  const grassTexture = useTexture('/textures/grass.png')

  // Configure grass texture repeating
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping
  grassTexture.repeat.set(20, 20)  // Increased repeat for larger area

  return (
    <group>
      {/* Grass ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} /> {/* Increased size for larger ground */}
        <meshStandardMaterial 
          map={grassTexture}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Add the house */}
      <House />
    </group>
  )
} 