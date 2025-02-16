import { House } from './House'
import { HOUSE_CONFIG } from './House'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'

const { UNIT } = HOUSE_CONFIG

// Tree component
function Tree({ position }) {
  return (
    <group position={position}>
      {/* Tree trunk */}
      <mesh castShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      {/* Tree top */}
      <mesh castShadow position={[0, 2.5, 0]}>
        <coneGeometry args={[1, 3, 8]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
    </group>
  )
}

export function Landscape() {
  // Load grass texture
  const grassTexture = useTexture('/textures/grass.png')
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping
  grassTexture.repeat.set(24, 24)
  
  const housePositions = [
    // North house
    { position: [0, 0, -UNIT * 8], rotation: [0, Math.PI, 0], id: 'north' },
    // South house
    { position: [0, 0, UNIT * 8], rotation: [0, 0, 0], id: 'south' },
    // East house
    { position: [UNIT * 8, 0, 0], rotation: [0, Math.PI/2, 0], id: 'east' },
    // West house
    { position: [-UNIT * 8, 0, 0], rotation: [0, -Math.PI/2, 0], id: 'west' }
  ]

  // Tree positions around houses
  const treePositions = [
    // North cluster
    [-UNIT * 4, 0, -UNIT * 10],
    [UNIT * 4, 0, -UNIT * 10],
    // South cluster
    [-UNIT * 4, 0, UNIT * 10],
    [UNIT * 4, 0, UNIT * 10],
    // East cluster
    [UNIT * 10, 0, -UNIT * 4],
    [UNIT * 10, 0, UNIT * 4],
    // West cluster
    [-UNIT * 10, 0, -UNIT * 4],
    [-UNIT * 10, 0, UNIT * 4],
    // Corner trees
    [UNIT * 6, 0, UNIT * 6],
    [-UNIT * 6, 0, UNIT * 6],
    [UNIT * 6, 0, -UNIT * 6],
    [-UNIT * 6, 0, -UNIT * 6],
  ]

  return (
    <group>
      {/* Houses */}
      {housePositions.map((config) => (
        <House 
          key={config.id}
          position={config.position}
          rotation={config.rotation}
          id={config.id}
        />
      ))}

      {/* Trees */}
      {treePositions.map((position, index) => (
        <Tree key={`tree-${index}`} position={position} />
      ))}

      {/* Ground plane with updated grass texture */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[UNIT * 24, UNIT * 24]} />
        <meshStandardMaterial 
          map={grassTexture}
          roughness={1}
          normalScale={new THREE.Vector2(1, 1)}
        />
      </mesh>
    </group>
  )
} 