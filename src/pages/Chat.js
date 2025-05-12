import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import './CSS/Chat.css';  // Assuming you already have the styles in this file

const Chat = ({ classroomId, studentId, username }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null); // Reference to the chat box

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    // Join the specific classroom chat
    newSocket.emit('joinRoom', { classroomId, studentId });

    // Fetch existing messages from the server
    axios.get(`http://localhost:4000/api/chat/messages/${classroomId}`)
      .then(response => {
        setMessages(response.data);
      })
      .catch(err => {
        console.error('Error fetching messages:', err);
      });

    // Listen for new chat messages
    newSocket.on('chatMessage', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [classroomId, studentId]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]); // Re-run when messages change

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('chatMessage', { classroomId, studentId, message });
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.studentId?._id === studentId ? 'sent' : 'received'}`}>
            <strong>{msg.studentId?._id === studentId ? 'You' : msg.studentId?.username}: </strong>
            {msg.message}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type a message" 
          className="chat-input"
        />
        <button onClick={handleSendMessage} className="send-btn">Send</button>
      </div>
    </div>
  );
};

export default Chat;
