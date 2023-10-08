import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import { sharedState } from "./sharedState"; // Adjust the path accordingly

const InteractivePlayhead = () => {
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const updatePlayhead = () => {
      if (!isDragging) {
        setPosition(Tone.Transport.progress);
        setIsPlaying(Tone.Transport.state === "started");
      }
    };

    const interval = setInterval(updatePlayhead, 50);

    return () => {
      clearInterval(interval);
    };
  }, [isDragging]);

  const handleMouseDown = () => {
    setIsDragging(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const boundingRect = containerRef.current.getBoundingClientRect();
      const newPosition = (e.clientX - boundingRect.left) / boundingRect.width;
      setPosition(Math.min(Math.max(newPosition, 0), 1));
      Tone.Transport.progress = newPosition;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    // Calculate the time based on the progress and total duration
    const newTime = position * Tone.Transport.loopEnd;

    // Set the Transport's position to the calculated time
    Tone.Transport.position = newTime;

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
};


  useEffect(() => {
    if (!isDragging) {
      // Don't update the position from Tone.Transport if the playhead is being dragged
      const loop = new Tone.Loop((time) => {
        setPosition(Tone.Transport.progress);
        setIsPlaying(Tone.Transport.state === "started");
      }, "16n");

      loop.start();

      return () => {
        loop.stop();
        loop.dispose();
      };
    }
  }, [isDragging]);

  const togglePlayback = () => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.pause();
    } else {
      Tone.Transport.start();
    }
  };

  return (
    <div>
      {/* Playhead progress */}
      <div
        ref={containerRef}
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
            cursor: "pointer",
          }}
          onMouseDown={handleMouseDown}
        ></div>
      </div>

      {/* Playback control button */}
      {sharedState.isMidiLoaded && (
        <button onClick={togglePlayback} style={{ marginTop: "10px" }}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      )}
    </div>
  );
};

export default InteractivePlayhead;
