import * as THREE from 'three'
import mapData from '../data/map.json'

// Cache for storing current character positions
const characterPositions = new Map()
const MOVEMENT_SPEED = 0.1
const COLLISION_THRESHOLD = 0.5

// Helper to get closest point from current position to target
const getClosestPoint = (current, target) => {
  const dx = target.x - current.x
  const dz = target.z - current.z
  const distance = Math.sqrt(dx * dx + dz * dz)
  return {
    direction: new THREE.Vector3(dx / distance, 0, dz / distance),
    distance
  }
}

// Helper function to check wall collisions
const checkWallCollision = (newPosition) => {
  for (const direction in mapData.walls) {
    const walls = mapData.walls[direction]
    for (const wall of walls) {
      const start = new THREE.Vector2(wall.start.x, wall.start.z)
      const end = new THREE.Vector2(wall.end.x, wall.end.z)
      
      // Calculate distance from point to line segment
      const line = end.clone().sub(start)
      const len = line.length()
      const lineDirection = line.clone().normalize()
      
      const point = new THREE.Vector2(newPosition.x, newPosition.z)
      const pointToStart = point.clone().sub(start)
      
      // Project point onto line
      const projection = pointToStart.dot(lineDirection)
      
      if (projection >= 0 && projection <= len) {
        const projectedPoint = start.clone().add(lineDirection.multiplyScalar(projection))
        const distance = point.distanceTo(projectedPoint)
        
        if (distance < COLLISION_THRESHOLD) {
          return true
        }
      }
    }
  }
  return false
}

// Get all available checkpoints from map data
export const getCheckpoints = () => {
  const checkpoints = {
    // Rooms and furniture
    ...Object.entries(mapData.rooms).reduce((acc, [roomKey, room]) => {
      Object.entries(room.furniture).forEach(([furnitureKey, position]) => {
        acc[`${roomKey}_${furnitureKey}`] = position
      })
      return acc
    }, {}),
    
    // Talking areas
    ...mapData.commonArea.talkingAreas.reduce((acc, area) => {
      acc[area.id] = { x: area.x, z: area.z }
      return acc
    }, {})
  }
  
  return checkpoints
}

// Check and store character position
export const checkPosition = (character, position) => {
  if (!position) return null
  
  const currentPos = {
    x: position.x,
    z: position.z
  }
  
  characterPositions.set(character, currentPos)
  
  // Find nearest checkpoint
  const checkpoints = getCheckpoints()
  let nearestPoint = null
  let shortestDistance = Infinity
  
  Object.entries(checkpoints).forEach(([id, point]) => {
    const dx = point.x - currentPos.x
    const dz = point.z - currentPos.z
    const distance = Math.sqrt(dx * dx + dz * dz)
    
    if (distance < shortestDistance) {
      shortestDistance = distance
      nearestPoint = { id, point, distance }
    }
  })
  
  console.log(`Character ${character} position:`, currentPos)
  return {
    position: currentPos,
    nearest: nearestPoint
  }
}

// Go to specified checkpoint
export const goto = (character, checkpointId, controller) => {
  const checkpoints = getCheckpoints()
  const target = checkpoints[checkpointId]
  
  if (!target) {
    console.error(`Checkpoint ${checkpointId} not found`)
    return null
  }
  
  let isRunning = false
  let lastPosition = null
  let stationaryTime = 0
  
  // Start running animation
  if (controller && controller.playAnimation) {
    controller.playAnimation('Run')
    isRunning = true
  }
  
  return {
    update: (model, delta) => {
      if (!model) return false
      
      // Calculate exact distance to target
      const dx = model.position.x - target.x
      const dz = model.position.z - target.z
      const distance = Math.sqrt(dx * dx + dz * dz)
      
      // If close enough to target (within 0.1 units), stop
      if (distance < 0.1) {
        // Stop at exact target position
        model.position.x = target.x
        model.position.z = target.z
        
        // Update cache
        characterPositions.set(character, {
          x: target.x,
          z: target.z
        })
        
        return true // This will trigger the animation change in Boy.js
      }
      
      // Continue movement
      const direction = new THREE.Vector3(
        target.x - model.position.x,
        0,
        target.z - model.position.z
      ).normalize()
      
      const moveAmount = MOVEMENT_SPEED * delta * 60
      const movement = direction.multiplyScalar(moveAmount)
      
      // Calculate new position
      const newPosition = model.position.clone().add(movement)
      
      // Check for collisions
      if (!checkWallCollision(newPosition)) {
        // Update position
        model.position.copy(newPosition)
        
        // Update rotation to face movement direction
        const targetRotation = Math.atan2(direction.x, direction.z)
        model.rotation.y = targetRotation
        
        // Update character position in cache
        characterPositions.set(character, {
          x: newPosition.x,
          z: newPosition.z
        })
      }
      
      return false
    }
  }
}

// Animation control function
export const playAnimation = (character, animationName, controller) => {
  if (!controller || !controller.playAnimation) {
    console.error('Animation controller not found')
    return null
  }

  // List of available animations
  const validAnimations = [
    'Run',
    'Dancing',
    'Happy',
    'Sad',
    'Singing',
    'Talking',
    'Arguing'
  ]

  if (!validAnimations.includes(animationName)) {
    console.error(`Invalid animation: ${animationName}`)
    return null
  }

  controller.playAnimation(animationName)
  return true
}

// Export map data for reference
export const mapInfo = {
  rooms: mapData.rooms,
  commonArea: mapData.commonArea,
  boundaries: mapData.metadata.boundaries
} 