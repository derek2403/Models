import * as THREE from 'three'
import { useTexture } from '@react-three/drei'

export function Environment() {
  // Load textures
  const grassTexture = useTexture('/textures/grass.jpg')
  const wallTexture = useTexture('/textures/wall.jpg')
  const floorTexture = useTexture('/textures/floor.jpg')

  // Configure texture repeating
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping
  grassTexture.repeat.set(10, 10)
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping
  wallTexture.repeat.set(2, 2)
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
  floorTexture.repeat.set(4, 4)

  return (
    <group>
      {/* Grass ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          map={grassTexture}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Room */}
      <group position={[0, 1.5, -5]}>
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
          <boxGeometry args={[10, 10, 0.1]} />
          <meshStandardMaterial 
            map={floorTexture}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>

        {/* Back Wall */}
        <mesh position={[0, 0, -5]} receiveShadow castShadow>
          <boxGeometry args={[10, 3, 0.1]} />
          <meshStandardMaterial 
            map={wallTexture}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>

        {/* Left Wall */}
        <mesh position={[-5, 0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[10, 3, 0.1]} />
          <meshStandardMaterial 
            map={wallTexture}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>

        {/* Right Wall */}
        <mesh position={[5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[10, 3, 0.1]} />
          <meshStandardMaterial 
            map={wallTexture}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      </group>
    </group>
  )
} 