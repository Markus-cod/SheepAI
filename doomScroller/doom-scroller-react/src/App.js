import React, { useRef, useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Try to start video once loaded
    const vid = videoRef.current;
    if (vid) {
      const onCanPlay = () => {
        vid.play().then(() => setPlaying(true)).catch(console.warn);
      };
      vid.addEventListener("canplay", onCanPlay);
      return () => vid.removeEventListener("canplay", onCanPlay);
    }
  }, []);

  return (
    <div className="App">
      <video
        id="background"
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="videos/bg.mp4" type="video/mp4" />
        Your browser does not support video.
      </video>

      <div className="overlay">
        <h1>Video should be visible now</h1>
        <p>(status: {playing ? "playing ✅" : "loading..."})</p>
      </div>
    </div>
  );
}