import WeatherContainer from "./components/WeatherContainer/WeatherContainer";
import './App.css';

function App() {
  return (
    <div className="bg-gray-800 font-sans w-full h-full items-center justify-center">
      <header className="App-header">
        <h1 className="text-4xl">Climatify</h1>
        <WeatherContainer/>
      </header>
    </div>
  );
}

export default App;