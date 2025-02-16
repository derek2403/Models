import React from 'react'

export function CreateCharacterModal({ 
  showModal, 
  onClose, 
  onSubmit, 
  characterForm, 
  setCharacterForm 
}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Validate all fields are filled
    if (!characterForm.name || !characterForm.occupation || 
        !characterForm.mbti || !characterForm.age || 
        !characterForm.hobby || !characterForm.gender ||
        characterForm.characteristics.some(char => !char)) {
      alert("Please fill in all fields")
      return
    }
    onSubmit(characterForm)
  }

  if (!showModal) return null

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl w-96">
      <h2 className="text-2xl mb-4">Create Character</h2>
      <form onSubmit={handleSubmit}>
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
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Create
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
} 