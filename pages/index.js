import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment as EnvironmentMap } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { Boy } from '../components/Boy'
import { Environment } from '../components/Environment'
import { WeatherControls } from '../components/WeatherControls'

// Weather-specific configurations
const WEATHER_CONFIGS = {
  sunny: {
    day: {
      skyColor: '#87CEEB',
      ambientLight: 0.5,
      directionalLight: 1,
    },
    night: {
      skyColor: '#0A1128',
      ambientLight: 0.1,
      directionalLight: 0.05,
    }
  },
  cloudy: {
    day: {
      skyColor: '#C4C4C4',
      ambientLight: 0.3,
      directionalLight: 0.5,
    },
    night: {
      skyColor: '#1A1A1A',
      ambientLight: 0.05,
      directionalLight: 0.03,
    }
  },
  rain: {
    day: {
      skyColor: '#4A4A4A',
      ambientLight: 0.2,
      directionalLight: 0.3,
    },
    night: {
      skyColor: '#0A0A0A',
      ambientLight: 0.03,
      directionalLight: 0.02,
    }
  },
  thunderstorm: {
    day: {
      skyColor: '#2A2A2A',
      ambientLight: 0.1,
      directionalLight: 0.2,
    },
    night: {
      skyColor: '#050505',
      ambientLight: 0.02,
      directionalLight: 0.01,
    }
  }
}

export default function Home() {
  const [weather, setWeather] = useState('sunny')
  const [timeOfDay, setTimeOfDay] = useState('day')

  const currentConfig = WEATHER_CONFIGS[weather][timeOfDay]

  return (
    <div className="w-full h-screen relative">
      <Canvas
        shadows
        camera={{
          position: [15, 15, 15],
          fov: 50
        }}
      >
        <color attach="background" args={[currentConfig.skyColor]} />
        
        <Suspense fallback={null}>
          <ambientLight intensity={currentConfig.ambientLight} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={currentConfig.directionalLight}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          <Boy />
          <Environment weatherType={weather} timeOfDay={timeOfDay} />
          
          <OrbitControls
            target={[0, 1, 0]}
            maxPolarAngle={Math.PI / 2.5}
            minPolarAngle={Math.PI / 6}
          />
          
          {/* Only show environment map during day and sunny weather */}
          {weather === 'sunny' && timeOfDay === 'day' && (
            <EnvironmentMap preset="sunset" />
          )}
        </Suspense>
      </Canvas>

      <WeatherControls
        onWeatherChange={setWeather}
        onTimeChange={setTimeOfDay}
        currentWeather={weather}
        currentTime={timeOfDay}
      />
    </div>
  )
}
