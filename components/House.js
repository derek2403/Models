import * as THREE from 'three'
import { useTexture } from '@react-three/drei'

export function House() {
  // Load textures
  const wallTexture = useTexture('/textures/wall.jpg')
  const floorTexture = useTexture('/textures/floor.jpg')

  // Configure texture repeating
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping
  wallTexture.repeat.set(2, 2)
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
  floorTexture.repeat.set(8, 8)

  const UNIT = 3 // Base unit
  const WALL_HEIGHT = 3
  const WALL_THICKNESS = 0.2

  return (
    <group position={[0, 0, 0]}>
      {/* Main Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[UNIT * 12, UNIT * 12, 0.2]} />
        <meshStandardMaterial map={floorTexture} roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Outer Walls */}
      <Wall size={[UNIT * 12, WALL_HEIGHT, WALL_THICKNESS]} position={[0, WALL_HEIGHT/2, UNIT * 6]} texture={wallTexture} />
      <Wall size={[UNIT * 12, WALL_HEIGHT, WALL_THICKNESS]} position={[0, WALL_HEIGHT/2, -UNIT * 6]} texture={wallTexture} />
      
      {/* Left outer wall with entrance cutout */}
      <Wall size={[UNIT * 5, WALL_HEIGHT, WALL_THICKNESS]} position={[-UNIT * 6, WALL_HEIGHT/2, UNIT * 3.5]} rotation={[0, Math.PI/2, 0]} texture={wallTexture} />
      <Wall size={[UNIT * 5, WALL_HEIGHT, WALL_THICKNESS]} position={[-UNIT * 6, WALL_HEIGHT/2, -UNIT * 3.5]} rotation={[0, Math.PI/2, 0]} texture={wallTexture} />
      <Wall size={[UNIT * 12, WALL_HEIGHT, WALL_THICKNESS]} position={[UNIT * 6, WALL_HEIGHT/2, 0]} rotation={[0, Math.PI/2, 0]} texture={wallTexture} />

      {/* Room 1 (Top Left) */}
      <Wall size={[UNIT * 4, WALL_HEIGHT, WALL_THICKNESS]} position={[-UNIT * 4, WALL_HEIGHT/2, UNIT * 2]} texture={wallTexture} />
      <Wall size={[UNIT * 4, WALL_HEIGHT, WALL_THICKNESS]} position={[-UNIT * 0.99, WALL_HEIGHT/2, UNIT * 4]} rotation={[0, Math.PI/2, 0]} texture={wallTexture} />

      {/* Room 2 (Top Right) */}
      <Wall size={[UNIT * 6, WALL_HEIGHT, WALL_THICKNESS]} position={[UNIT * 3, WALL_HEIGHT/2, UNIT * 2]} texture={wallTexture} />

      {/* Room 3 (Center) */}
      <Wall size={[UNIT * 5, WALL_HEIGHT, WALL_THICKNESS]} position={[-1, WALL_HEIGHT/2, -6]} texture={wallTexture} />

      {/* Room 4 (Bottom Left) */}
      <Wall size={[UNIT * 4, WALL_HEIGHT, WALL_THICKNESS]} position={[-UNIT * 3, WALL_HEIGHT/2, -UNIT * 2]} texture={wallTexture} />
      <Wall size={[UNIT * 4, WALL_HEIGHT, WALL_THICKNESS]} position={[-UNIT * 2, WALL_HEIGHT/2, -UNIT * 4]} rotation={[0, Math.PI/2, 0]} texture={wallTexture} />

      {/* Room 5 (Bottom Right) */}
      <Wall size={[UNIT * 2, WALL_HEIGHT, WALL_THICKNESS]} position={[UNIT * 5, WALL_HEIGHT/2, -UNIT * 2]} texture={wallTexture} />
      <Wall size={[UNIT * 4, WALL_HEIGHT, WALL_THICKNESS]} position={[UNIT * 3, WALL_HEIGHT/2, -UNIT * 4]} rotation={[0, Math.PI/2, 0]} texture={wallTexture} />
    </group>
  )
}

// Helper component for walls
function Wall({ size, position, rotation = [0, 0, 0], texture }) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial map={texture} roughness={0.8} metalness={0.2} />
    </mesh>
  )
} 