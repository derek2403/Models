import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function useCharacterController(animations, model) {
  const currentAnimation = useRef(null)
  const currentDirection = useRef('front') // 'front', 'back', 'left', 'right'
  const isRotating = useRef(false)
  const targetRotation = useRef(0)
  
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false
  })

  const ROTATION_SPEED = 10 // Adjust for faster/slower turning
  const MOVEMENT_SPEED = 0.1

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

    // Handle rotation
    if (isRotating.current) {
      const currentRot = model.current.rotation.y
      const targetRot = targetRotation.current
      
      // Calculate the shortest rotation path
      let rotationDiff = targetRot - currentRot
      while (rotationDiff > Math.PI) rotationDiff -= 2 * Math.PI
      while (rotationDiff < -Math.PI) rotationDiff += 2 * Math.PI
      
      if (Math.abs(rotationDiff) < 0.1) {
        // Rotation complete
        model.current.rotation.y = targetRot
        isRotating.current = false
      } else {
        // Smooth rotation
        model.current.rotation.y += rotationDiff * delta * ROTATION_SPEED
      }
    }

    // Handle movement in the facing direction
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

      model.current.position.add(moveVector)
    }
  })

  return { moveState, playAnimation }
} 