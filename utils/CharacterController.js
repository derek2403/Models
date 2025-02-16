import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { HOUSE_CONFIG } from '../components/House'

export function useCharacterController(animations, model) {
  const currentAnimation = useRef(null)
  const currentDirection = useRef('front') // 'front', 'back', 'left', 'right'
  const isRotating = useRef(false)
  const targetRotation = useRef(0)
  const position = useRef(new THREE.Vector3())
  
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false
  })

  const ROTATION_SPEED = 10 // Adjust for faster/slower turning
  const MOVEMENT_SPEED = 0.1
  const { UNIT } = HOUSE_CONFIG
  const WALL_PADDING = 0.3
  const characterRadius = 0.2

  const getRotationForDirection = (direction) => {
    switch(direction) {
      case 'front': return Math.PI        // Facing forward (no change)
      case 'back': return 0               // Facing backward (no change)
      case 'left': return -Math.PI / 2    // Changed: Now faces left when moving left
      case 'right': return Math.PI / 2    // Changed: Now faces right when moving right
      default: return Math.PI
    }
  }

  const turnToDirection = (newDirection) => {
    if (currentDirection.current !== newDirection) {
      isRotating.current = true
      currentDirection.current = newDirection
      targetRotation.current = getRotationForDirection(newDirection)
    }
  }

  const playAnimation = (name) => {
    if (!animations || !animations[name]) return
    if (currentAnimation.current === name) return

    // Fade out current animation
    if (currentAnimation.current && animations[currentAnimation.current]) {
      const current = animations[currentAnimation.current]
      current.fadeOut(0.2)
    }

    // Play new animation
    const newAnim = animations[name]
    newAnim.reset().fadeIn(0.2).play()
    
    currentAnimation.current = name
  }

  const checkWallCollision = (newPosition) => {
    const walls = [
      // Outer walls
      { start: new THREE.Vector2(-UNIT * 6, UNIT * 6), end: new THREE.Vector2(UNIT * 6, UNIT * 6) },
      { start: new THREE.Vector2(-UNIT * 6, -UNIT * 6), end: new THREE.Vector2(UNIT * 6, -UNIT * 6) },
      { start: new THREE.Vector2(-UNIT * 6, UNIT * 6), end: new THREE.Vector2(-UNIT * 6, UNIT * 3.5) },
      { start: new THREE.Vector2(-UNIT * 6, -UNIT * 3.5), end: new THREE.Vector2(-UNIT * 6, -UNIT * 6) },
      { start: new THREE.Vector2(UNIT * 6, UNIT * 6), end: new THREE.Vector2(UNIT * 6, -UNIT * 6) },

      // Inner walls using exact coordinates
      // Horizontal walls
      { start: new THREE.Vector2(6.30, -5.90), end: new THREE.Vector2(-14.60, -5.80) },
      { start: new THREE.Vector2(-0.10, 5.50), end: new THREE.Vector2(17.50, 5.50) },
      { start: new THREE.Vector2(-17.80, 5.50), end: new THREE.Vector2(-6.00, 5.50) },
      { start: new THREE.Vector2(17.50, -6.60), end: new THREE.Vector2(12.10, -6.10) },

      // Vertical walls
      { start: new THREE.Vector2(-6.60, -6.60), end: new THREE.Vector2(-6.60, -17.50) },
      { start: new THREE.Vector2(9.20, -5.70), end: new THREE.Vector2(9.60, -17.50) },
      
      // Additional vertical walls
      { start: new THREE.Vector2(-2.80, 5.80), end: new THREE.Vector2(-2.80, 17.50) },
      // Split the wall into two parts to create the doorway
      { start: new THREE.Vector2(-17.80, 3.20), end: new THREE.Vector2(-17.80, 2.70) },  // Upper section
      { start: new THREE.Vector2(-17.80, -2.70), end: new THREE.Vector2(-17.80, -3.00) }, // Lower section
      { start: new THREE.Vector2(-17.50, 17.50), end: new THREE.Vector2(-17.50, -17.50) },

      // Door positions for reference
      // Room 2 Door: x=8.30, z=-5.90
      // Room 3 Door: x=11.30, z=-6.00
      // Room 1 Door: x=-17.30, z=-5.80
      // Room 4 Door: x=-3.00, z=5.50
      // Room 5 Door: x=-0.20, z=5.50
      // New Door: x=-17.00, z=±2.70
    ]

    const characterPoint = new THREE.Vector2(newPosition.x, newPosition.z)

    for (const wall of walls) {
      const wallVector = new THREE.Vector2().subVectors(wall.end, wall.start)
      const wallLength = wallVector.length()
      const wallDirection = wallVector.normalize()
      
      const wallToCharacter = new THREE.Vector2().subVectors(characterPoint, wall.start)
      const projection = wallToCharacter.dot(wallDirection)
      
      if (projection >= -WALL_PADDING && projection <= wallLength + WALL_PADDING) {
        const distance = Math.abs(wallToCharacter.cross(wallDirection))
        if (distance < characterRadius + WALL_PADDING) {
          return true
        }
      }
    }
    
    return false
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW':
          if (!moveState.current.forward) {
            moveState.current.forward = true
            turnToDirection('front')
            playAnimation('Run')
          }
          break
        case 'KeyS':
          if (!moveState.current.backward) {
            moveState.current.backward = true
            turnToDirection('back')
            playAnimation('Run')
          }
          break
        case 'KeyA':
          if (!moveState.current.left) {
            moveState.current.left = true
            turnToDirection('left')
            playAnimation('Run')
          }
          break
        case 'KeyD':
          if (!moveState.current.right) {
            moveState.current.right = true
            turnToDirection('right')
            playAnimation('Run')
          }
          break
        case 'Digit1': playAnimation('Dancing'); break
        case 'Digit2': playAnimation('Happy'); break
        case 'Digit3': playAnimation('Sad'); break
        case 'Digit4': playAnimation('Singing'); break
        case 'Digit5': playAnimation('Talking'); break
        case 'Digit6': playAnimation('Arguing'); break
      }
    }

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
          moveState.current.forward = false
          break
        case 'KeyS':
          moveState.current.backward = false
          break
        case 'KeyA':
          moveState.current.left = false
          break
        case 'KeyD':
          moveState.current.right = false
          break
      }

      if (!moveState.current.forward && 
          !moveState.current.backward && 
          !moveState.current.left && 
          !moveState.current.right) {
        playAnimation('Stand')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [animations])

  useFrame((state, delta) => {
    if (!model.current) return

    position.current.copy(model.current.position)

    if (moveState.current.forward || 
        moveState.current.backward || 
        moveState.current.left || 
        moveState.current.right) {
      
      const moveVector = new THREE.Vector3()
      
      switch(currentDirection.current) {
        case 'front':
          moveVector.z = -MOVEMENT_SPEED
          break
        case 'back':
          moveVector.z = MOVEMENT_SPEED
          break
        case 'left':
          moveVector.x = -MOVEMENT_SPEED
          break
        case 'right':
          moveVector.x = MOVEMENT_SPEED
          break
      }

      const newPosition = model.current.position.clone().add(moveVector)
      
      if (!checkWallCollision(newPosition)) {
        model.current.position.copy(newPosition)
      }
    }

    if (isRotating.current) {
      const currentRot = model.current.rotation.y
      const targetRot = targetRotation.current
      
      let rotationDiff = targetRot - currentRot
      while (rotationDiff > Math.PI) rotationDiff -= 2 * Math.PI
      while (rotationDiff < -Math.PI) rotationDiff += 2 * Math.PI
      
      if (Math.abs(rotationDiff) < 0.1) {
        model.current.rotation.y = targetRot
        isRotating.current = false
      } else {
        model.current.rotation.y += rotationDiff * delta * ROTATION_SPEED
      }
    }
  })

  // Position logging on Enter key
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && model.current) {
        const pos = model.current.position
        console.log(`Current Position: x=${pos.x.toFixed(2)}, z=${pos.z.toFixed(2)}`)
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [])

  return { 
    moveState, 
    playAnimation,
    position: position.current,
    getCurrentPosition: () => model.current?.position || new THREE.Vector3() 
  }
} 