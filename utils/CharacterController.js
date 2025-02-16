import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
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
  const { camera } = useThree()
  const moveVector = new THREE.Vector3()
  const cameraDirection = new THREE.Vector3()
  const cameraRight = new THREE.Vector3()

  const getRotationForDirection = (direction) => {
    switch(direction) {
      case 'front': return Math.PI
      case 'back': return 0
      case 'left': return -Math.PI / 2
      case 'right': return Math.PI / 2
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

    if (currentAnimation.current && animations[currentAnimation.current]) {
      const current = animations[currentAnimation.current]
      current.fadeOut(0.2)
    }

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
        case 'KeyW': moveState.current.forward = false; break
        case 'KeyS': moveState.current.backward = false; break
        case 'KeyA': moveState.current.left = false; break
        case 'KeyD': moveState.current.right = false; break
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
      
      camera.getWorldDirection(cameraDirection)
      cameraDirection.y = 0
      cameraDirection.normalize()
      
      cameraRight.copy(cameraDirection).cross(new THREE.Vector3(0, 1, 0))
      
      moveVector.set(0, 0, 0)
      
      if (moveState.current.forward) moveVector.add(cameraDirection)
      if (moveState.current.backward) moveVector.sub(cameraDirection)
      if (moveState.current.left) moveVector.sub(cameraRight)
      if (moveState.current.right) moveVector.add(cameraRight)

      if (moveVector.length() > 0) {
        moveVector.normalize().multiplyScalar(MOVEMENT_SPEED)
        
        const targetRotation = Math.atan2(moveVector.x, moveVector.z)
        model.current.rotation.y = targetRotation

        model.current.position.add(moveVector)
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
