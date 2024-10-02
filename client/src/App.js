import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import './App.css';

function App() {
  const [value, setValue] = useState('');
  const [toggleButton, setToggleButton] = useState('Disconnect');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    function onConnect() {
      console.log('Is socket connected? ' + socket.connected);
      setMessages(previous => [...previous, `*connected (recovered: ${socket.recovered})*`]);
      window.scrollTo(0, document.body.scrollHeight);
    }

    function onDisconnect() {
      console.log('Is socket connected? ' + socket.connected);
      setMessages(previous => [...previous, "*disconnected*"]);
      window.scrollTo(0, document.body.scrollHeight);
    }

    function onMessageEvent(value) {
      setMessages(previous => [...previous, value]);
      window.scrollTo(0, document.body.scrollHeight);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat message', onMessageEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chat message', onMessageEvent);
    };
  }, []);

  useEffect(() => {
    // no-op if the socket is already connected
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  function onSubmit(event) {
    event.preventDefault();
    if (value) {
      socket.emit('chat message', value);
      setValue('');
    }
  }

  function onClick() {
    if (socket.connected) {
      setToggleButton('Connect');
      socket.disconnect();
    } else {
      setToggleButton('Disconnect');
      socket.connect();
    }
  }

  return (
    <>
      <ul id="messages">
        {messages.map((message, i) => (
          <li key={message + i}>{message}</li>
        ))}
      </ul>
      <form onSubmit={onSubmit} id="form" action="">
        <input value={value} onChange={e => setValue(e.target.value)} id="input" autoComplete="off" />
        <button>Send</button>
        <button onClick={onClick}>{toggleButton}</button>
      </form>
    </>
  );
}

export default App;
