import React, { useState, useEffect } from "react";
import * as Tone from "tone";

const SimplePlayhead = () => {
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transportData, setTransportData] = useState({
    position: "0:0:0",
    progress: 0,
    seconds: 0,
  });

  useEffect(() => {
    const loop = new Tone.Loop((time) => {
      setPosition(Tone.Transport.progress);
      setTransportData({
        position: Tone.Transport.position,
        progress: Tone.Transport.progress,
        seconds: Tone.Transport.seconds,
      });
      setIsPlaying(Tone.Transport.state === "started");
    }, "16n"); // Every sixteenth note

    Tone.Transport.loopEnd = "4m"; // 4 measures long
    Tone.Transport.loop = true;

    loop.start(0);

    return () => {
      loop.dispose();
    };
  }, []);

  return (
    <div className="simple-playhead">
      {/* Transport data */}
      <div>
        <strong>Position:</strong> {transportData.position} <br />
        <strong>Progress:</strong> {transportData.progress.toFixed(2)} <br />
        <strong>Seconds:</strong> {transportData.seconds.toFixed(2)} <br />
      </div>

      {/* Playhead progress */}
      <div
        style={{
          height: "20px",
          width: "100%",
          background: "lightgray",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${position * 100}%`,
            background: "green",
          }}
        ></div>
      </div>
    </div>
  );
};

export default SimplePlayhead;
