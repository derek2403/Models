import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { useState, useEffect } from 'react'
import { House } from './House'
import { Landscape } from './Landscape'
import { Weather } from './Weather'

export function Environment({ weatherType = 'sunny', timeOfDay = 'day' }) {
  console.log('Environment timeOfDay:', timeOfDay) // Debug log
  const [weather, setWeather] = useState('sunny')
  const grassTexture = useTexture('/textures/grass.png')

  // Configure grass texture repeating
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping
  grassTexture.repeat.set(20, 20)

  const GROUND_SIZE = 200
  const GROUND_HEIGHT = -0.1

  // Weather cycle (optional - remove if you want manual control)
  useEffect(() => {
    const weatherTypes = ['sunny', 'cloudy', 'rain', 'thunderstorm']
    const interval = setInterval(() => {
      setWeather(weatherTypes[Math.floor(Math.random() * weatherTypes.length)])
    }, 30000) // Change weather every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // For manual weather control, you can use this function
  const handleWeatherChange = (event) => {
    if (event.key >= '1' && event.key <= '4') {
      const weatherTypes = ['sunny', 'cloudy', 'rain', 'thunderstorm']
      setWeather(weatherTypes[parseInt(event.key) - 1])
      console.log(`Weather changed to: ${weatherTypes[parseInt(event.key) - 1]}`)
    }
  }

  useEffect(() => {
    window.addEventListener('keypress', handleWeatherChange)
    return () => window.removeEventListener('keypress', handleWeatherChange)
  }, [])

  return (
    <group position={[0, 0, 0]}>
      {/* Grass ground */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, GROUND_HEIGHT, 0]} 
        receiveShadow
      >
        <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
        <meshStandardMaterial 
          map={grassTexture}
          roughness={1}
          metalness={0}
        />
      </mesh>

      <House timeOfDay={timeOfDay} />
      <Landscape />
      <Weather type={weather} />
    </group>
  )
} 