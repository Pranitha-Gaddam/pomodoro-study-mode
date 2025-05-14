import React, { useState, useEffect } from "react";
import { FaRedo, FaCog } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import TaskManager from "./TaskList";
import BackgroundSelector from "./BackgroundSelector";
import BackgroundMusic from "./BackgroundMusic";

const DEFAULT_TIMES = {
  Pomodoro: 25 * 60,
  "Short Break": 5 * 60,
  "Long Break": 15 * 60,
};

const StudyMode = () => {
  const [time, setTime] = useState(DEFAULT_TIMES.Pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("Pomodoro");
  const [sessions, setSessions] = useState(0);
  const [background, setBackground] = useState(() => localStorage.getItem("selectedBackground") || "images/backgrounds/1883de5bfee36b043b973bef00c561e0.gif");
  const [durations, setDurations] = useState({ ...DEFAULT_TIMES });
  const [tempDurations, setTempDurations] = useState({ ...DEFAULT_TIMES }); // Temporary state for timer settings
  const [showSettings, setShowSettings] = useState(false);
  const [autoTransition, setAutoTransition] = useState(true);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      handleSessionEnd();
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  const handleSessionEnd = () => {
    if (autoTransition) {
      if (mode === "Pomodoro") {
        setSessions(s => s + 1);
        setMode((sessions + 1) % 4 === 0 ? "Long Break" : "Short Break");
      } else {
        setMode("Pomodoro");
      }
      setTime(durations[mode]);
    } else {
      alert("Session ended. Choose to restart or move to the next mode.");
    }
    setIsRunning(false);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setTime(durations[newMode]);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setTime(durations[mode]);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const percentage = ((durations[mode] - time) / durations[mode]) * 100;

  const handleBackgroundChange = (newBg) => {
    setBackground(newBg);
    localStorage.setItem("selectedBackground", newBg);
  };

  const saveSettings = () => {
    setDurations({ ...tempDurations });  // Save the temporary settings to durations
    setTime(tempDurations[mode]); // Reset time to match the updated setting
    setShowSettings(false);
  };

  const resetSettings = () => {
    setTempDurations({ ...DEFAULT_TIMES });
    setAutoTransition(true);
  };

  return (
    <div className="relative flex bg-black flex-col items-center justify-center h-screen w-full text-white studymode"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>

      <div className="fixed top-2 right-6 flex gap-3 z-50">
        <TaskManager />
      </div>

      <div className="flex space-x-4 mb-6">
        {["Pomodoro", "Short Break", "Long Break"].map((item) => (
          <button
            key={item}
            className={`px-4 py-1.5 font-semibold text-lg rounded-lg transition-all ${
              mode === item
                ? "bg-white text-white shadow-lg glass-effect"
                : "glass-effect-inactive border border-neutral-500 text-white shadow-sm hover:shadow-md hover:bg-opacity-30"
            }`}
            onClick={() => handleModeChange(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div style={{ width: 300, height: 300 }} className="timer rounded-full">
        <CircularProgressbar
          value={percentage}
          text={formatTime(time)}
          styles={buildStyles({
            textColor: "rgba(255, 255, 255, 1)",
            pathColor: "rgba(255, 255, 255, 0.6)",
            trailColor: "rgba(255, 255, 255, 0.3)",
            pathTransitionDuration: 0.5,
            backgroundColor: "rgba(0,0,0, 0.4)",
            textSize: "28px",
          })}
        />
      </div>

      <div className="mt-6 flex items-center space-x-4 relative ">
        <button className="px-4 py-1.5 font-semibold text-lg rounded-lg transition-all glass-effect-start border-neutral-500 text-white hover:shadow-lg" onClick={toggleTimer}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button className="text-white opacity-80 hover:opacity-90 shadow-xl hover:rotate-15 active:rotate-90 hover:scale-110 transition-all ease-linear" onClick={resetTimer}>
          <FaRedo size={18} />
        </button>

          {/* absolute top-full -right-3 bg-white shadow:md rounded-lg p-2 w-64 z-10 mt-3
                before:absolute before:top-0 before:right-4 before:w-3 before:h-3 before:bg-white before:rotate-45 before:-translate-y-1/2 */}
          <button className="text-white opacity-80 hover:opacity-90 shadow-xl -mr-4 hover:rotate-15 active:rotate-90 hover:scale-110 transition-all ease-linear" onClick={() => setShowSettings(!showSettings)}><FaCog size={24} /></button>
          {showSettings && (
            <div className="absolute -right-4 md:left-full top-full mt-1 shadow:md glass-effect text-white px-1.5 py-1 w-35 rounded-lg text-sm md:text-md ">
              {Object.keys(tempDurations).map((key) => (
                <div key={key} className="flex justify-between py-1">
                  <span>{key}</span>
                  <input 
                    type="number" 
                    value={tempDurations[key] / 60} 
                    onChange={(e) => setTempDurations({ ...tempDurations, [key]: e.target.value * 60 })} 
                    className="w-12 bg-gray-700 text-white p-1 -mt-1 rounded" 
                  />
                  </div>
              ))}
              <div className="flex justify-between py-1 items-center">
                <span>Auto Transition</span>
                <input type="checkbox" checked={autoTransition} onChange={() => setAutoTransition(!autoTransition)} />
              </div>
              <div className="flex justify-end space-x-2 mt-1">
                <button className="bg-slate-700 text-white hover:bg-gray-700 active:bg-gray-800 px-3 py-1 rounded transition-all" onClick={saveSettings}>Save</button>
                <button className="bg-white text-black hover:bg-neutral-200 px-3 py-1 rounded transition-all active:bg-neutral-300" onClick={resetSettings}>Reset</button>
              </div>
            </div>
          )}
      </div>
      <BackgroundSelector background={background} setBackground={handleBackgroundChange} />
      <BackgroundMusic />
    </div>
  );
};

export default StudyMode;