import * as THREE from 'three'
import { useTexture } from '@react-three/drei'

// Export constants for use in collision system
export const HOUSE_CONFIG = {
  UNIT: 3,
  WALL_HEIGHT: 3,
  WALL_THICKNESS: 0.2,
  FLOOR_HEIGHT: 0
}

// Helper component for street lamp
function StreetLamp({ position, isNight }) {
  return (
    <group position={position}>
      {/* Lamp post (tall cylinder) */}
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
        <meshStandardMaterial color="#2A2A2A" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Lamp head (shorter, wider cylinder) */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.4, 8]} />
        <meshStandardMaterial 
          color={isNight ? "#FFFFFF" : "#D3D3D3"}
          emissive={isNight ? "#FFFFFF" : "#000000"}
          emissiveIntensity={isNight ? 1 : 0}
        />
      </mesh>
      
      {/* Light source */}
      <pointLight
        position={[0, 1.5, 0]}
        distance={15}
        intensity={isNight ? 50 : 10}
        color="#FFFFFF"
        castShadow
        decay={2}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
    </group>
  )
}

export function House({ timeOfDay = 'day' }) {
  // Add console.log to verify timeOfDay prop
  console.log('House timeOfDay:', timeOfDay)
  const isNight = timeOfDay === 'night'
  
  // Load textures
  const wallTexture = useTexture('/textures/wall.jpg')
  const floorTexture = useTexture('/textures/floor.jpg')

  // Configure texture repeating
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping
  wallTexture.repeat.set(2, 2)
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
  floorTexture.repeat.set(8, 8)

  const { UNIT, WALL_HEIGHT, WALL_THICKNESS, FLOOR_HEIGHT } = HOUSE_CONFIG

  // Street lamp positions
  const streetLamps = [
    [-17.00, 0, -17.48],  // Corner 1
    [8.53, 0, -17.43],    // Corner 2
    [10.06, 0, -16.28],   // Corner 3
    [17.42, 0, 6.86],     // Corner 4
    [-17.00, 0, 6.73],
    [17.48, 0, 4.86],
    [-17.00, 0, 4.97], 
    [0.73, 0, -5.30],
    
  ]

  return (
    <group position={[0, FLOOR_HEIGHT, 0]}>
      {/* Main Floor */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
      >
        <boxGeometry args={[UNIT * 12, UNIT * 12, 0.2]} />
        <meshStandardMaterial 
          map={floorTexture} 
          roughness={0.8} 
          metalness={0.2}
          color={isNight ? new THREE.Color(0.7, 0.7, 0.7) : new THREE.Color(1, 1, 1)}
        />
      </mesh>

      {/* Street Lamps */}
      {streetLamps.map((position, index) => (
        <StreetLamp
          key={`street-lamp-${index}`}
          position={position}
          isNight={isNight}
        />
      ))}

      {/* Outer Walls */}
      <Wall size={[UNIT * 12, WALL_HEIGHT, WALL_THICKNESS]} position={[0, WALL_HEIGHT/2, UNIT * 6]} texture={wallTexture} isNight={isNight} />
      <Wall size={[UNIT * 12, WALL_HEIGHT, WALL_THICKNESS]} position={[0, WALL_HEIGHT/2, -UNIT * 6]} texture={wallTexture} isNight={isNight} />
      
      {/* Left outer wall with entrance cutout */}
      <Wall size={[UNIT * 5, WALL_HEIGHT, WALL_THICKNESS]} position={[-UNIT * 6, WALL_HEIGHT/2, UNIT * 3.5]} rotation={[0, Math.PI/2, 0]} texture={wallTexture} isNight={isNight} />
      <Wall size={[UNIT * 5, WALL_HEIGHT, WALL_THICKNESS]} position={[-UNIT * 6, WALL_HEIGHT/2, -UNIT * 3.5]} rotation={[0, Math.PI/2, 0]} texture={wallTexture} isNight={isNight} />
      <Wall size={[UNIT * 12, WALL_HEIGHT, WALL_THICKNESS]} position={[UNIT * 6, WALL_HEIGHT/2, 0]} rotation={[0, Math.PI/2, 0]} texture={wallTexture} isNight={isNight} />

      {/* Room 1 (Top Left) */}
      <Wall size={[UNIT * 4, WALL_HEIGHT, WALL_THICKNESS]} position={[-UNIT * 4, WALL_HEIGHT/2, UNIT * 2]} texture={wallTexture} isNight={isNight} />
      <Wall size={[UNIT * 4, WALL_HEIGHT, WALL_THICKNESS]} position={[-UNIT * 0.99, WALL_HEIGHT/2, UNIT * 4]} rotation={[0, Math.PI/2, 0]} texture={wallTexture} isNight={isNight} />

      {/* Room 2 (Top Right) */}
      <Wall size={[UNIT * 6, WALL_HEIGHT, WALL_THICKNESS]} position={[UNIT * 3, WALL_HEIGHT/2, UNIT * 2]} texture={wallTexture} isNight={isNight} />

      {/* Room 3 (Center) */}
      <Wall size={[UNIT * 5, WALL_HEIGHT, WALL_THICKNESS]} position={[-1, WALL_HEIGHT/2, -6]} texture={wallTexture} isNight={isNight} />

      {/* Room 4 (Bottom Left) */}
      <Wall size={[UNIT * 4, WALL_HEIGHT, WALL_THICKNESS]} position={[-UNIT * 3, WALL_HEIGHT/2, -UNIT * 2]} texture={wallTexture} isNight={isNight} />
      <Wall size={[UNIT * 4, WALL_HEIGHT, WALL_THICKNESS]} position={[-UNIT * 2, WALL_HEIGHT/2, -UNIT * 4]} rotation={[0, Math.PI/2, 0]} texture={wallTexture} isNight={isNight} />

      {/* Room 5 (Bottom Right) */}
      <Wall size={[UNIT * 2, WALL_HEIGHT, WALL_THICKNESS]} position={[UNIT * 5, WALL_HEIGHT/2, -UNIT * 2]} texture={wallTexture} isNight={isNight} />
      <Wall size={[UNIT * 4, WALL_HEIGHT, WALL_THICKNESS]} position={[UNIT * 3, WALL_HEIGHT/2, -UNIT * 4]} rotation={[0, Math.PI/2, 0]} texture={wallTexture} isNight={isNight} />
    </group>
  )
}

// Helper component for walls
function Wall({ size, position, rotation = [0, 0, 0], texture, isNight }) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial 
        map={texture} 
        roughness={0.8} 
        metalness={0.2}
        color={isNight ? new THREE.Color(0.7, 0.7, 0.7) : new THREE.Color(1, 1, 1)}
      />
    </mesh>
  )
} 