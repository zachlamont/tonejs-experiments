import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";

const MidiPlayer = () => {
  // State to hold the parsed MIDI data
  const [midi, setMidi] = useState(null);

  // State to track when the MIDI sampler is loaded and ready
  const [isLoaded, setIsLoaded] = useState(false);

  // State to hold the name of the uploaded MIDI file for display
  const [midiFileName, setMidiFileName] = useState("");

  const [part, setPart] = useState(null);

  // Create a Tone.js sampler with specific URLs and base URL
  // This is used to play back the MIDI data with actual sounds
  const sampler = new Tone.Sampler({
    urls: {
      A1: "A1.mp3",
      A2: "A2.mp3",
    },
    baseUrl: "https://tonejs.github.io/audio/casio/",
    // Once the sampler loads, we set our isLoaded state to true
    onload: () => setIsLoaded(true),
  }).toDestination();

  // Callback when a MIDI file is dropped onto our drop zone
  const onDrop = useCallback(
    async (acceptedFiles) => {
      try {
        const file = acceptedFiles[0];
        // Set the name of the MIDI file for display
        setMidiFileName(file.name);
        // Convert the file to an array buffer for parsing
        const arrayBuffer = await file.arrayBuffer();
        const midiData = new Midi(arrayBuffer);

        // Ensure we have valid MIDI data with tracks
        if (midiData && midiData.tracks) {
          // Create a Tone.js Part which schedules note events for playback
          const midiPart = new Tone.Part((time, note) => {
            sampler.triggerAttackRelease(
              note.name,
              note.duration,
              time,
              note.velocity
            );
          }).start(0);

          // Disabling loop ensures the MIDI only plays once per button click
          midiPart.loop = false;

          // Schedule the note events for playback
          midiData.tracks[0].notes.forEach((note) => {
            midiPart.at(note.time, note);
          });

          setPart(midiPart); // Store our created Part in state
          setMidi(midiData); // Store the parsed MIDI data in state
        } else {
          throw new Error("Midi data is invalid or missing tracks");
        }
      } catch (error) {
        console.error("Error processing MIDI file", error);
      }
    },
    [sampler] // Re-create this callback if the sampler instance changes
  );

  // Function to handle the playback of the MIDI data
  const playMidi = () => {
    if (isLoaded) {
      Tone.start(); // Required to start audio context in some browsers
      Tone.Transport.stop(); // Ensure playback is stopped
      Tone.Transport.position = 0; // Reset playback to start of MIDI file
      Tone.Transport.start(); // Start the playback
    }
  };

  // Setting up the dropzone hooks
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".mid", // Only accept .mid files
  });

  return (
    <div className="midi-player">
      <h2> Midi Player </h2>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the MIDI file here...</p>
        ) : midiFileName ? (
          <p>{midiFileName}</p>
        ) : (
          <p>Drag & drop a MIDI file here, or click to select one</p>
        )}
      </div>
      {/* Only show the play button if we have a loaded MIDI file */}
      {midi && isLoaded && <button onClick={playMidi}>Play MIDI</button>}
    </div>
  );
};

export default MidiPlayer;
