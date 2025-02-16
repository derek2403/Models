import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment as EnvironmentMap } from '@react-three/drei'
import { Suspense, useState, useRef, useEffect } from 'react'
import { Boy } from '../components/Boy'
import { Girl } from '../components/Girl'
import { Environment } from '../components/Environment'
import { WeatherControls } from '../components/WeatherControls'
import { TimeSimulation } from '../utils/TimeSimulation'
import weatherConfigs from '../config/weather.json'

export default function Home() {
  const [weather, setWeather] = useState('sunny')
  const [characters, setCharacters] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(true)
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

  const handleCreateCharacter = (e) => {
    e.preventDefault()
    // Validate all fields are filled
    if (!characterForm.name || !characterForm.occupation || 
        !characterForm.mbti || !characterForm.age || 
        !characterForm.hobby || !characterForm.gender) {
      alert("Please fill in all fields")
      return
    }

    const newCharacter = {
      ...characterForm,
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
    if (character.gender.toLowerCase() === 'male') {
      return <Boy key={character.id} character={character} />
    } else if (character.gender.toLowerCase() === 'female') {
      return <Girl key={character.id} character={character} />
    }
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

      {/* Character Creation Modal */}
      {showCreateModal && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl w-96">
          <h2 className="text-2xl mb-4">Create Character</h2>
          <form onSubmit={handleCreateCharacter}>
            <input
              required
              className="w-full mb-2 p-2 border rounded"
              placeholder="Name"
              value={characterForm.name}
              onChange={e => setCharacterForm(prev => ({ ...prev, name: e.target.value }))}
            />
            <input
              required
              className="w-full mb-2 p-2 border rounded"
              placeholder="Occupation"
              value={characterForm.occupation}
              onChange={e => setCharacterForm(prev => ({ ...prev, occupation: e.target.value }))}
            />
            <input
              required
              className="w-full mb-2 p-2 border rounded"
              placeholder="MBTI"
              value={characterForm.mbti}
              onChange={e => setCharacterForm(prev => ({ ...prev, mbti: e.target.value }))}
            />
            <input
              required
              type="number"
              className="w-full mb-2 p-2 border rounded"
              placeholder="Age"
              value={characterForm.age}
              onChange={e => setCharacterForm(prev => ({ ...prev, age: e.target.value }))}
            />
            <input
              required
              className="w-full mb-2 p-2 border rounded"
              placeholder="Hobby"
              value={characterForm.hobby}
              onChange={e => setCharacterForm(prev => ({ ...prev, hobby: e.target.value }))}
            />
            <select
              required
              className="w-full mb-2 p-2 border rounded"
              value={characterForm.gender}
              onChange={e => setCharacterForm(prev => ({ ...prev, gender: e.target.value }))}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <div className="mb-2">
              <p className="mb-1">Characteristics:</p>
              {characterForm.characteristics.map((char, index) => (
                <input
                  key={index}
                  required
                  className="w-full mb-1 p-2 border rounded"
                  placeholder={`Characteristic ${index + 1}`}
                  value={char}
                  onChange={e => {
                    const newChars = [...characterForm.characteristics]
                    newChars[index] = e.target.value
                    setCharacterForm(prev => ({ ...prev, characteristics: newChars }))
                  }}
                />
              ))}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Create Character
            </button>
          </form>
        </div>
      )}

      {/* Create Character Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="absolute top-4 left-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Create Character
      </button>

      {/* Characters List Button */}
      <button
        onClick={() => setShowCharactersList(true)}
        className="absolute top-4 left-40 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Show Characters
      </button>

      {/* Characters List Modal */}
      {showCharactersList && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl mb-4">Characters List</h2>
          {characters.map(char => (
            <div key={char.id} className="mb-4 p-4 border rounded">
              <h3 className="text-xl font-bold">{char.name}</h3>
              <p>Occupation: {char.occupation}</p>
              <p>MBTI: {char.mbti}</p>
              <p>Age: {char.age}</p>
              <p>Hobby: {char.hobby}</p>
              <p>Gender: {char.gender}</p>
              <div>
                <p className="font-bold">Characteristics:</p>
                <ul className="list-disc pl-5">
                  {char.characteristics.map((trait, index) => (
                    <li key={index}>{trait}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <button
            onClick={() => setShowCharactersList(false)}
            className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-4"
          >
            Close
          </button>
        </div>
      )}

      <WeatherControls
        onWeatherChange={setWeather}
        timeSimRef={timeSimRef}
        currentWeather={weather}
        currentTime={timeState.date}
      />
    </div>
  )
}
