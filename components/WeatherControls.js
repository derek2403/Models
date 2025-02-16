export function WeatherControls({ onWeatherChange, onTimeChange, currentWeather, currentTime }) {
  return (
    <div className="absolute top-4 right-4 bg-black/50 p-4 rounded-lg text-white">
      <div className="mb-4">
        <h3 className="mb-2 font-bold">Time of Day</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onTimeChange('day')}
            className={`px-3 py-1 rounded ${currentTime === 'day' ? 'bg-blue-500' : 'bg-gray-600'}`}
          >
            Day
          </button>
          <button
            onClick={() => onTimeChange('night')}
            className={`px-3 py-1 rounded ${currentTime === 'night' ? 'bg-blue-500' : 'bg-gray-600'}`}
          >
            Night
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="mb-2 font-bold">Weather</h3>
        <div className="flex flex-wrap gap-2">
          {['sunny', 'cloudy', 'rain', 'thunderstorm'].map((weather) => (
            <button
              key={weather}
              onClick={() => onWeatherChange(weather)}
              className={`px-3 py-1 rounded capitalize ${
                currentWeather === weather ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              {weather}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 