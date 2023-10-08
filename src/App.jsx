import "./App.css";
import MidiDropZone from "./components/MidiDropZone";
import MidiPlayer from "./components/MidiPlayer";
import SimplePlayhead from "./components/SimplePlayhead";
import InteractivePlayhead from "./components/InteractivePlayhead";

function App() {
  return (
    <>
      <div className="App">
        <h1>Tone.js Experiments</h1>
        <MidiDropZone />
        <MidiPlayer />
        <SimplePlayhead />
        <InteractivePlayhead />
      </div>
    </>
  );
}

export default App;
