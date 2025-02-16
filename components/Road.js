import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { HOUSE_CONFIG } from './House'

export function Road() {
  const { UNIT } = HOUSE_CONFIG
  const roadTexture = useTexture('/textures/road.jpg')
  
  // Configure texture
  roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping
  roadTexture.repeat.set(1, 10)

  return (
    <mesh 
      position={[0, 0, 0]} 
      rotation={[0, 0, 0]}
      userData={{ type: 'decoration' }}
    >
      <planeGeometry args={[UNIT * 4, UNIT * 20]} />
      <meshStandardMaterial map={roadTexture} roughness={0.8} />
    </mesh>
  )
} 