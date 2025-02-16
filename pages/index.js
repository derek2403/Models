import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment as EnvironmentMap } from '@react-three/drei'
import { Suspense, useState, useRef, useEffect } from 'react'
import { Boy } from '../components/Boy'
import { Girl } from '../components/Girl'
import { Environment } from '../components/Environment'
import { WeatherControls } from '../components/WeatherControls'
import { CreateCharacterModal } from '../components/CreateCharacterModal'
import { CharactersListModal } from '../components/CharactersListModal'
import { TimeSimulation } from '../utils/TimeSimulation'
import weatherConfigs from '../config/weather.json'

export default function Home() {
  const [weather, setWeather] = useState('sunny')
  const [characters, setCharacters] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCharactersList, setShowCharactersList] = useState(false)
  const [characterForm, setCharacterForm] = useState({
    name: '',
    occupation: '',
    mbti: '',
    age: '',
    hobby: '',
    gender: '',
    characteristics: ['', '', '', '', '']
  })
  const [timeState, setTimeState] = useState({
    timeOfDay: 'day',
    dayProgress: 0.5,
    hours: 12,
    date: new Date()
  })
  const timeSimRef = useRef(new TimeSimulation(1000))

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeState = timeSimRef.current.update()
      setTimeState(newTimeState)
    }, 16.67)

    return () => clearInterval(interval)
  }, [])

  // Get current config with fallback to day/night if specific time not found
  const getCurrentConfig = () => {
    const timeOfDay = timeState.timeOfDay
    if (weatherConfigs[weather][timeOfDay]) {
      return weatherConfigs[weather][timeOfDay]
    }
    // Fallback to day/night if specific time not found
    return weatherConfigs[weather][timeOfDay === 'night' ? 'night' : 'day']
  }

  const currentConfig = getCurrentConfig()

  const handleCreateCharacter = (formData) => {
    const newCharacter = {
      ...formData,
      id: Date.now(),
      position: [Math.random() * 10 - 5, 0, Math.random() * 10 - 5]
    }
    setCharacters(prev => [...prev, newCharacter])
    setShowCreateModal(false)
    setCharacterForm({
      name: '',
      occupation: '',
      mbti: '',
      age: '',
      hobby: '',
      gender: '',
      characteristics: ['', '', '', '', '']
    })
  }

  const renderCharacter = (character) => {
    const gender = character.gender.toLowerCase()
    if (gender === 'male') {
      return <Boy key={character.id} character={character} />
    } else if (gender === 'female') {
      return <Girl key={character.id} character={character} />
    }
    return null
  }

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
          
          {characters.map(character => renderCharacter(character))}
          <Environment weatherType={weather} timeState={timeState} />
          
          <OrbitControls
            target={[0, 1, 0]}
            maxPolarAngle={Math.PI / 2.5}
            minPolarAngle={Math.PI / 6}
          />
          
          {weather === 'sunny' && timeState.timeOfDay === 'day' && (
            <EnvironmentMap preset="sunset" />
          )}
        </Suspense>
      </Canvas>

      {/* Top Bar Controls */}
      <div className="absolute top-4 left-4 flex gap-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Create Character
        </button>
        <button
          onClick={() => setShowCharactersList(true)}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Show Characters
        </button>
      </div>

      {/* Modals */}
      <CreateCharacterModal
        showModal={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCharacter}
        characterForm={characterForm}
        setCharacterForm={setCharacterForm}
      />

      <CharactersListModal
        showModal={showCharactersList}
        onClose={() => setShowCharactersList(false)}
        characters={characters}
      />

      <WeatherControls
        onWeatherChange={setWeather}
        timeSimRef={timeSimRef}
        currentWeather={weather}
        currentTime={timeState.date}
      />
    </div>
  )
}
