import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [session, setSession] = useState<number>(25);
  const [rest, setRest] = useState<number>(5);
  const [timer, setTimer] = useState<number>(1500);
  const [isActive, setisActive] = useState<boolean>(false);
  const [timingType, setTimingType] = useState<string>("SESSION");
  const [audioPlay, setAudioPlay] = useState<boolean>(false);
  const audioRef:any = useRef<HTMLAudioElement>(null);

  const defaultSession = 25;
  const defaultRest = 5;
  const defaultTimer = 1500;

  const formatedTime = (timer:any) => {
    const minutes = Math.floor(timer/60);
    const seconds = timer % 60;
    return `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
  };

  const activeorpaused = () => {
    if (isActive) {
      return " ACTIVE";
    } else {
      return " PAUSED";
    }
  };

  const handleClickReset = () => {
    setisActive(false);
    setTimer(defaultTimer);
    setSession(defaultSession);
    setRest(defaultRest);
    setTimingType("SESSION");
    setAudioPlay (false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const changeBreak = (sign:any) => {
    if (sign === "+" && rest < 60) {
      setRest((prevRest) => prevRest + 1);
    }
    if (sign === "-" && rest > 1) {
      setRest((prevRest) => prevRest -1);
    }
  };

  const changeSession = (sign:any) => {
    if (sign === "+" && session < 60) {
      setSession((prevSession) => prevSession + 1);
    }
    if (sign === "-" && session > 1) {
      setSession((prevSession) => prevSession -1);
    } 
  };

  useEffect (() => {
    if (!isActive) {
      setTimer(session*60);
    }
    if (timingType === "BREAK" && isActive) {
      setTimer(rest*60); 
    }
    if (timingType ==="SESSION" && isActive) {
      setTimer(session*60);
    }
  }, [session, timingType]);

  useEffect (() => {
    let interval: any;

    if (isActive && timer > -1  ) {
      interval = setInterval (() => {
        setTimer((prevTimer) => prevTimer -1);
      }, 1000);
    } else if (timer === -1  && timingType === "SESSION") {
      setAudioPlay(true);
      setTimingType("BREAK");
    } else if (timer === -1  && timingType === "BREAK") {
      setAudioPlay(true);
      setTimingType("SESSION");
    }

    return () => clearInterval(interval);
  }, [isActive, timer]);

  

  const handleStartStop = () => {
    if (isActive) {
      setisActive(false);
    } else {
      setisActive(true);
    }
  };

  if (audioPlay) {
    audioRef.current.play();
    setTimeout(() => {
      setAudioPlay (false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }, 3690);
  }



  return (
    <>
    <audio id="beep" ref={audioRef} src="./src/Alarm.mp3" ></audio>
    <div id="session-label">Session Length:</div>
    <div id="session-length">{session}</div>
    <button id="session-decrement" onClick ={() => changeSession("-")}>-</button>
    <button id="session-increment" onClick ={() => changeSession("+")}>+</button>

    <div id="break-label">Break Length:</div>
    <div id="break-length">{rest}</div>
    <button id="break-decrement" onClick={() => changeBreak("-")} >-</button>
    <button id="break-increment" onClick={() => changeBreak("+")}>+</button>

    <div id="timer-label">{timingType}{activeorpaused()}</div>
    <div id="time-left">{formatedTime(timer)}</div>
    <button id="start_stop" onClick={handleStartStop}>start/stop</button>
    <button id="reset" onClick={handleClickReset}>reset</button>


    
    </>
  )
}

export default App
