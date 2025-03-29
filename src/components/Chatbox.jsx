import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

const Chatbox = () => {
  const [showChat, setShowChat] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const chatMessagesRef = useRef(null);
  const volumeCanvasRef = useRef(null);

  // Gemini API configuration
  const GEMINI_API_KEY = "AIzaSyCqTFBKfrU8EqEoxc6e4Nezv7fTAP2BVNw"; // Replace with your actual Gemini API key
  const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  // Refs for audio/speech
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const volumeAnimationRef = useRef(null);
  const recognitionRef = useRef(null);

  // Toggle the chatbot window
  const toggleChatbot = () => {
    setShowChat(!showChat);
  };

  // Scroll chat container to the bottom whenever messages update
  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add a message to state
  const addMessage = (sender, text) => {
    const newMsg = { sender, text, timestamp: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Send a message (user text) and get a bot reply
  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    addMessage("user", inputValue);
    const userText = inputValue;
    setInputValue("");
    
    try {
      const botReply = await getBotResponse(userText);
      addMessage("bot", botReply);
    } catch (error) {
      addMessage("bot", "Sorry, there was an error processing your message.");
    }
  };

  // Get bot response via Gemini API
  const getBotResponse = async (userText) => {
    try {
      const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ 
              text: userText 
            }]
          }],
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.7,
            topP: 0.9
          }
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text.trim();
      } else {
        return "No response from the model.";
      }
    } catch (error) {
      console.error("Error in getBotResponse:", error);
      throw error;
    }
  };

  // ----- Audio Recording and Speech Recognition Functions -----

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Audio recording not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      mediaRecorder.onstop = () => {
        addMessage("user", "[Audio recorded]");
      };
      mediaRecorder.start();
      setIsRecording(true);
      startVolumeMeter(stream);
      startSpeechRecognition();
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    stopVolumeMeter();
    stopSpeechRecognition();
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      await startRecording();
    } else {
      stopRecording();
    }
  };

  // Speech recognition using the Web Speech API
  const startSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.warn("Speech recognition not supported.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
    recognition.onend = () => {
      if (isRecording) stopRecording();
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Volume meter (visual equalizer) functions
  const startVolumeMeter = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    analyserRef.current = analyser;
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    animateMeter();
  };

  const animateMeter = () => {
    const canvas = volumeCanvasRef.current;
    if (!canvas || !analyserRef.current) return;
    const ctx = canvas.getContext("2d");
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = (canvas.width / dataArray.length) * 2.5;
    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const barValue = dataArray[i];
      const barHeight = (barValue / 255) * canvas.height;
      ctx.fillStyle = `rgb(${barValue + 100}, 50, 50)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
    volumeAnimationRef.current = requestAnimationFrame(animateMeter);
  };

  const stopVolumeMeter = () => {
    if (volumeAnimationRef.current) {
      cancelAnimationFrame(volumeAnimationRef.current);
      volumeAnimationRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  // ----- Text-to-Speech (per bot message) -----
  const speakText = (text) => {
    if (!window.speechSynthesis) {
      alert("Speech Synthesis not supported in this browser.");
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  };

  // ----- File Upload Handling -----
  const triggerFileDialog = (mode) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    fileInput.accept = mode === "image" ? "image/*" : "*/*";
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        addMessage("user", `Uploaded file: ${file.name}`);
      }
    };
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  return (
    <div>
      {/* Floating Chat Toggle Button */}
      <div className="chat-toggle-btn" onClick={toggleChatbot}>
        <img src="https://png.pngtree.com/png-clipart/20230401/original/pngtree-smart-chatbot-cartoon-clipart-png-image_9015126.png" alt="Chat" />
      </div>

      {/* Chat Window */}
      {showChat && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Chatbot</span>
            <button className="close-btn" onClick={toggleChatbot}>
              X
            </button>
          </div>

          {/* Volume Meter */}
          <div className="volume-meter-container">
            <canvas ref={volumeCanvasRef} width="300" height="50"></canvas>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages" ref={chatMessagesRef}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message-bubble ${
                  msg.sender === "bot" ? "bot-message" : "user-message"
                }`}
              >
                {msg.text}
                <br />
                <span className="message-timestamp">{msg.timestamp}</span>
                {msg.sender === "bot" && (
                  <div className="bot-actions">
                    <button onClick={() => speakText(msg.text)}>Speak</button>
                    {/* Add more bot action buttons here as needed */}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input Area */}
          <div className="chat-input-area">
            <div className="input-buttons">
              <button className="icon-btn" onClick={() => triggerFileDialog("any")}>
                <img
                  src="https://static.vecteezy.com/system/resources/previews/004/588/642/non_2x/attach-paper-clip-thin-line-flat-color-icon-linear-illustration-pictogram-isolated-on-white-background-colorful-long-shadow-design-free-vector.jpg"
                  alt="Attach"
                />
              </button>
              <button className="icon-btn" onClick={() => triggerFileDialog("image")}>
                <img
                  src="https://static.vecteezy.com/system/resources/previews/000/593/600/original/camera-icon-logo-template-illustration-design-vector-eps-10.jpg"
                  alt="Camera"
                />
              </button>
              <button className="icon-btn" onClick={toggleRecording}>
                <img
                  id="mic-icon"
                  src="https://static.vecteezy.com/system/resources/previews/012/750/893/original/microphone-silhouette-icon-voice-record-simbol-audio-mic-logo-vector.jpg"
                  alt="Mic"
                />
              </button>
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
            />
            <button className="send-btn" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbox;