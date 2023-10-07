import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Midi } from "@tonejs/midi";

const MidiDropZone = () => {
  const [midiData, setMidiData] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const file = acceptedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const midi = new Midi(arrayBuffer);
      setMidiData(JSON.stringify(midi, undefined, 2));
    } catch (error) {
      console.error("Error parsing MIDI file", error);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".mid",
  });

  return (
    <div className="drag-n-drop-midi">
        <h2> Drag & Drop MIDI</h2>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the MIDI file here...</p>
        ) : (
          <p>Drag & drop a MIDI file here, or click to select one</p>
        )}
      </div>
      {midiData && (
        <div>
          <h3>JSON Output:</h3>
          <div
            className="output"
            style={{ height: expanded ? "auto" : "200px" }}
          >
            {midiData}
          </div>
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MidiDropZone;
