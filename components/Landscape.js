import { Tree } from './Tree'
import { Road } from './Road'
import { HOUSE_CONFIG } from './House'

const { UNIT } = HOUSE_CONFIG

export function Landscape() {
  // Tree positions around the house and roads
  const treePositions = [
    // Front yard trees
    [-UNIT * 10, 0, -UNIT * 8],
    [-UNIT * 10, 0, -UNIT * 6],
    [-UNIT * 12, 0, -UNIT * 7],
    
    // Back yard trees
    [-UNIT * 10, 0, UNIT * 8],
    [-UNIT * 12, 0, UNIT * 7],
    [-UNIT * 9, 0, UNIT * 6],
    
    // Right side trees
    [UNIT * 8, 0, -UNIT * 8],
    [UNIT * 8, 0, -UNIT * 4],
    [UNIT * 8, 0, 0],
    [UNIT * 8, 0, UNIT * 4],
    [UNIT * 8, 0, UNIT * 8],
    
    // Far right trees
    [UNIT * 12, 0, -UNIT * 6],
    [UNIT * 12, 0, -UNIT * 2],
    [UNIT * 12, 0, UNIT * 2],
    [UNIT * 12, 0, UNIT * 6],
    
    // Road side trees
    [-UNIT * 14, 0, -UNIT * 12],
    [-UNIT * 14, 0, -UNIT * 8],
    [-UNIT * 14, 0, -UNIT * 4],
    [-UNIT * 14, 0, 0],
    [-UNIT * 14, 0, UNIT * 4],
    [-UNIT * 14, 0, UNIT * 8],
    [-UNIT * 14, 0, UNIT * 12],
    
    // Corner clusters
    [-UNIT * 10, 0, -UNIT * 12],
    [-UNIT * 12, 0, -UNIT * 14],
    [UNIT * 10, 0, -UNIT * 12],
    [UNIT * 12, 0, -UNIT * 14],
    [UNIT * 10, 0, UNIT * 12],
    [UNIT * 12, 0, UNIT * 14],
    
    // Random forest effect
    [UNIT * 16, 0, -UNIT * 8],
    [UNIT * 15, 0, -UNIT * 4],
    [UNIT * 16, 0, 0],
    [UNIT * 15, 0, UNIT * 4],
    [UNIT * 16, 0, UNIT * 8],
  ]

  return (
    <group>
      <Road />
      {treePositions.map((position, index) => (
        <Tree 
          key={index} 
          position={position} 
          // Increased base scale with random variation
          scale={[
            1.2 + Math.random() * 0.6,
            1.3 + Math.random() * 0.5,
            1.2 + Math.random() * 0.6
          ]}
        />
      ))}
    </group>
  )
} 