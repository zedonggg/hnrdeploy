'use client';
import React, { useState, useEffect, useRef } from "react";
import { TbAlarm } from "react-icons/tb";
import axios from 'axios';
import { motion } from 'motion/react';





export default function Home() {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [ampm, setAmpm] = useState("");
  const [alarmTime, setAlarmTime] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [alarmTriggered, setAlarmTriggered] = useState(false); 
  const [isPopupVisible, setIsPopupVisible] = useState(false); 
  const alarmAudioRef = useRef(null);
  const [alarmSetMessage, setAlarmSetMessage] = useState("");


  // Initialize alarm audio only once
  useEffect(() => {
    alarmAudioRef.current = new Audio("/alarm2.mp3");
    alarmAudioRef.current.loop = false; // Prevent infinite looping

    const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const isAM = hours < 12;

  // Convert hours to 12-hour format
  const formattedHour = hours % 12 || 12;
  const formattedMinute = minutes.toString().padStart(2, "0");
  const formattedAmpm = isAM ? "AM" : "PM";

  setHour(formattedHour.toString()); // Default hour
  setMinute(formattedMinute); // Default minute
  setAmpm(formattedAmpm); // Default AM/PM
  }, []);

  // Update current time to system time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const isAM = hours < 12;

      const formattedTime = `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${
        isAM ? "AM" : "PM"
      }`;
      setCurrentTime(formattedTime);
    };

    const interval = setInterval(updateTime, 1000);
    updateTime(); // Initial update
    return () => clearInterval(interval);
  }, []);

  // Function to handle alarm time
  useEffect(() => {
    if (!alarmTime || alarmTriggered) return;

    const alarmDate = new Date();
    let [hourPart, minutePart] = alarmTime.split(':');
    let [minute, ampm] = minutePart.split(' ');
    hourPart = parseInt(hourPart);
    minute = parseInt(minute);

    if (ampm === "PM" && hourPart !== 12) {
      hourPart += 12; 
    } else if (ampm === "AM" && hourPart === 12) {
      hourPart = 0;
    }

    alarmDate.setHours(hourPart);
    alarmDate.setMinutes(minute);
    alarmDate.setSeconds(0);

    const interval = setInterval(() => {
      const now = new Date();
      if (now >= alarmDate && !alarmTriggered) {
        setAlarmTriggered(true);
        if (alarmAudioRef.current) {
          alarmAudioRef.current.play(); // Play alarm
        }
        setIsPopupVisible(true); // Show popup
        startAudioProcessing();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarmTime, alarmTriggered]);

  const handleSetAlarm = () => {
    if (hour && minute && ampm) {
      const formattedTime = `${hour}:${minute} ${ampm}`;
      setAlarmTime(formattedTime);
      setAlarmSetMessage(`Alarm set for ${formattedTime}`);
    } else {
      setAlarmSetMessage("Please select a valid time for the alarm!");
    }
  };
  

  const startAudioProcessing = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/audio/');
      alert(`Audio processing result: ${response.data.inferred_class}`);
      stopAlarm(); // Stop alarm after processing audio
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong while processing the audio.');
    }
  };

  const stopAlarm = () => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.pause(); // Stop audio
      alarmAudioRef.current.currentTime = 0; // Reset audio
    }
    setIsPopupVisible(false); // Hide popup
    setAlarmTriggered(false); // Reset alarm state
    setAlarmTime(""); // Reset alarm time
    setHour(""); // Reset hour
    setMinute(""); // Reset minute
    setAmpm(""); // Reset AM/PM
    setAlarmSetMessage("");
  };
  

  return (
    <div className="bg-[#f5f5f5] w-screen h-screen">
      <div className="bg-[url('../woof.png')] w-screen h-screen bg-repeat bg-[length:100px_100px] animate-scroll">
        <div className="bg-[#f5f5f5] w-screen h-screen bg-opacity-50">
          <div className="flex items-center justify-center w-full h-full">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg text-center">
              <h1 className="inline-flex items-center justify-center text-4xl mb-4 text-black">
                <TbAlarm className="mr-2" />
                Ring Ring Bark Bark 🐶
              </h1>
              <div className="wrapper">
                <h2 className="text-8xl inline text-amber-500 font-semibold">{currentTime}</h2>
                <div className="content grid grid-cols-3 gap-6 mt-6 text-black">
                  {/* Hour Selection */}
                  <div className="column flex flex-col items-center text-black">
                    <label htmlFor="hour" className="text-lg text-black">
                      Set Hour
                    </label>
                    <select
                      id="hour"
                      value={hour}
                      onChange={(e) => setHour(e.target.value)}
                      className="border-2 border-gray-400 rounded-none p-4 text-xl w-auto mt-2"
                    >
                      <option value="" disabled hidden>
                        Hour
                      </option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Minute Selection */}
                  <div className="column flex flex-col items-center">
                    <label htmlFor="minute" className="text-lg">
                      Set Minute
                    </label>
                    <select
                      id="minute"
                      value={minute}
                      onChange={(e) => setMinute(e.target.value)}
                      className="border-2 border-gray-400 rounded-lg p-4 text-xl w-auto mt-2"
                    >
                      <option value="" disabled hidden>
                        Minute
                      </option>
                      {Array.from({ length: 60 }, (_, i) =>
                        i < 10 ? `0${i}` : `${i}`
                      ).map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* AM/PM Selection */}
                  <div className="column flex flex-col items-center">
                    <label htmlFor="ampm" className="text-lg">
                      Set AM/PM
                    </label>
                    <select
                      id="ampm"
                      value={ampm}
                      onChange={(e) => setAmpm(e.target.value)}
                      className="border-2 border-gray-400 rounded-lg p-4 text-xl w-auto mt-2"
                    >
                      <option value="" disabled hidden>
                        AM/PM
                      </option>
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
                <motion.button
                  onClick={handleSetAlarm}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 1.2 }}
                  className="bg-amber-500 text-white py-3 px-8 rounded-lg text-xl mt-8 hover:bg-amber-700"
                >
                  Set Alarm!
                </motion.button>
                {alarmSetMessage && (
  <motion.p animate={{ scale: 1.2 }} transition={{ type: "spring" }} className="text-lg mt-4 text-amber-500 font-semibold">
    {alarmSetMessage}
  </motion.p>
)}

                <br/>

                {/* <button
                  onClick={startAudioProcessing}
                  className="bg-blue-500 text-white py-3 px-8 rounded-lg text-xl mt-8 hover:bg-blue-700"
                >
                  Start Recording
                </button> */}

                {isPopupVisible && (
                  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 bg-red-flash">
                  <motion.div animate={{
    y: [0, -60, 0],
  }} transition={{ repeat: Infinity, duration: 1 }} className="bg-white shadow-lg rounded-2xl p-8 max-w-lg text-center relative">
                    <button
                      onClick={stopAlarm}
                      className="absolute top-2 right-2 text-xl font-bold text-gray-800"
                    >
                      X
                    </button>
                    <h1 className="text-6xl text-red-600 font-bold mb-4">WAKE UP!</h1>
                    <img src="/Videos/dog.gif" />
                    <h1 className="text-6xl text-black font-bold mb-4">Bark as loud as you can!</h1>
                  </motion.div>
                </div>
                )}

              </div>
              <style jsx>{`
              @keyframes flash-red {
                0%, 100% { background-color: rgba(255, 0, 0, 0.5); }
                50% { background-color: rgba(255, 77, 77, 0.5); }
              }
              .bg-red-flash { animation: flash-red 1s infinite; }
            `}</style>
              <audio id="alarm-audio" src="/hnr25_alarm.mp3" preload="auto"></audio>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
