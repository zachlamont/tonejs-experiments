import "./App.css";
import MidiDropZone from "./components/MidiDropZone";
import MidiPlayer from "./components/MidiPlayer";

function App() {
  return (
    <>
      <div className="App">
        <h1>Tone.js Experiments</h1>
        <MidiDropZone />
        <MidiPlayer />
      </div>
    </>
  );
}

export default App;
