import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import { sharedState } from "./sharedState"; // Adjust the path accordingly

const MidiPlayer = () => {
  // State to hold the parsed MIDI data
  const [midi, setMidi] = useState(null);

  // State to track when the MIDI sampler is loaded and ready
  const [isLoaded, setIsLoaded] = useState(false);

  // State to hold the name of the uploaded MIDI file for display
  const [midiFileName, setMidiFileName] = useState("");

  // State to hold the created Part from Tone.js
  const [part, setPart] = useState(null);

  // State to track if the MIDI is currently playing or paused
  const [isPlaying, setIsPlaying] = useState(false);

  // Create a Tone.js sampler with specific URLs and base URL
  const sampler = new Tone.Sampler({
    urls: {
      A1: "A1.mp3",
      A2: "A2.mp3",
    },
    baseUrl: "https://tonejs.github.io/audio/casio/",
    onload: () => setIsLoaded(true),
  }).toDestination();

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      setMidiFileName(file.name); // Store the name for display
      const arrayBuffer = await file.arrayBuffer();
      const midiData = new Midi(arrayBuffer);

      if (midiData && midiData.tracks) {
        const midiPart = new Tone.Part((time, note) => {
          sampler.triggerAttackRelease(
            note.name,
            note.duration,
            time,
            note.velocity
          );
        }).start(0);

        midiPart.loop = false;
        midiData.tracks[0].notes.forEach((note) => {
          midiPart.at(note.time, note);
        });

        setPart(midiPart);
        setMidi(midiData);
      } else {
        console.error("MIDI file is either invalid or lacks tracks");
      }
      // Once we set the MIDI and the sampler is loaded, we set isMidiLoaded to true
      sharedState.isMidiLoaded = true;
    },
    [sampler]
  );

  const togglePlayback = () => {
    if (isLoaded) {
      Tone.start();
      if (isPlaying) {
        Tone.Transport.pause();
      } else {
        Tone.Transport.start();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".mid",
  });

  return (
    <div className="midi-player">
      <h2>Midi Player 2</h2>
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
      {midi && isLoaded && (
        <button onClick={togglePlayback}>
          {isPlaying ? "Pause" : "Play"} MIDI
        </button>
      )}
    </div>
  );
};

export default MidiPlayer;
