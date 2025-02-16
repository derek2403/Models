import * as THREE from 'three'
import { useTexture } from '@react-three/drei'

export function Tree({ position = [0, 0, 0] }) {
  const trunkTexture = useTexture('/textures/tree-bark.jpg')
  const leavesTexture = useTexture('/textures/tree-leaves.png')

  // Configure textures
  trunkTexture.wrapS = trunkTexture.wrapT = THREE.RepeatWrapping
  leavesTexture.wrapS = leavesTexture.wrapT = THREE.RepeatWrapping

  return (
    <group position={position}>
      {/* Tree trunk */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.3, 3, 8]} />
        <meshStandardMaterial map={trunkTexture} roughness={0.9} />
      </mesh>
      
      {/* Tree leaves */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[1.5, 3, 8]} />
        <meshStandardMaterial 
          map={leavesTexture} 
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
} 