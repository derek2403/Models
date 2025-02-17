import { useState, useEffect } from 'react'
import { checkPosition, getCheckpoints, goto } from '../utils/character'

export function CharacterControlTest({ characters }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [currentPosition, setCurrentPosition] = useState(null)
  const [checkpoints, setCheckpoints] = useState([])
  const [selectedCheckpoint, setSelectedCheckpoint] = useState('')

  useEffect(() => {
    // Get all available checkpoints
    const points = getCheckpoints()
    setCheckpoints(Object.keys(points))
  }, [])

  const handleCheckPosition = () => {
    if (!selectedCharacter?.ref?.current) return
    
    const position = checkPosition(
      selectedCharacter.name, 
      selectedCharacter.ref.current.position
    )
    
    setCurrentPosition(position)
    console.log('Current Position:', position)
  }

  const handleGoto = () => {
    if (!selectedCharacter?.ref?.current || !selectedCheckpoint) return
    
    const movement = goto(
      selectedCharacter.name, 
      selectedCheckpoint, 
      {
        playAnimation: (name) => {
          if (selectedCharacter.animations?.[name]) {
            selectedCharacter.animations[name].reset().fadeIn(0.2).play()
          }
        }
      }
    )

    if (movement) {
      // Store the movement update function in the character's ref
      selectedCharacter.ref.current.activeGoto = movement
    }
  }

  return (
    <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg w-80">
      <h3 className="text-lg font-bold mb-4">Character Control Test</h3>
      
      {/* Character Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Character:</label>
        <select 
          className="w-full p-2 border rounded"
          value={selectedCharacter?.id || ''}
          onChange={(e) => {
            const char = characters.find(c => c.id === Number(e.target.value))
            setSelectedCharacter(char)
            setCurrentPosition(null) // Reset position display on character change
          }}
        >
          <option value="">Select a character...</option>
          {characters.map(char => (
            <option key={char.id} value={char.id}>
              {char.name}
            </option>
          ))}
        </select>
      </div>

      {/* Position Check */}
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2"
          onClick={handleCheckPosition}
          disabled={!selectedCharacter}
        >
          Check Position
        </button>
        {currentPosition && (
          <div className="text-sm bg-gray-100 p-2 rounded">
            <p>X: {currentPosition.position.x.toFixed(2)}</p>
            <p>Z: {currentPosition.position.z.toFixed(2)}</p>
            {currentPosition.nearest && (
              <p>Nearest: {currentPosition.nearest.id}</p>
            )}
          </div>
        )}
      </div>

      {/* Goto Control */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Go to:</label>
        <select 
          className="w-full p-2 border rounded mb-2"
          value={selectedCheckpoint}
          onChange={(e) => setSelectedCheckpoint(e.target.value)}
          disabled={!selectedCharacter}
        >
          <option value="">Select destination...</option>
          {checkpoints.map(checkpoint => (
            <option key={checkpoint} value={checkpoint}>
              {checkpoint}
            </option>
          ))}
        </select>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
          onClick={handleGoto}
          disabled={!selectedCharacter || !selectedCheckpoint}
        >
          Go to Location
        </button>
      </div>
    </div>
  )
} 