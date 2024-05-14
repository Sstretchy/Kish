import React from 'react'
import { useState, useEffect, FormEvent } from 'react';
import io from 'socket.io-client';
import styles from './ChatComponent.less';
import scrollStyle from '../styles/PrettyScroll.less';
import { FilledInput, IconButton, InputAdornment, Paper, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import classNames from 'classnames';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const socket = io('http://localhost:3001');

type ChatMessage = {
  username: string,
  message: string,
  userId: string
}

const ChatComponent = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [placeholderName, setPlaceholderName] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [isChatExpanded, setIsChatExpanded] = useState(true);


  useEffect(() => {
    socket.on('chat message', (msg: ChatMessage) => {
      setMessages(prevMessages => [...prevMessages, msg]);
      console.log(msg.userId)
    });

    socket.on('connect', () => {
      setCurrentUserId(socket.id as string);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    socket.emit('chat message', message);
    setMessage('');
  };

  const sendName = (event: FormEvent) => {
    event.preventDefault();
    socket.emit('set username', name);
    setPlaceholderName(name);
    setName('');
  };

  return (
    <>
      <div className={classNames(styles.OpenChatIcon, { [styles.OpenChatIcon_hide]: isChatExpanded })}><IconButton size='large' color='primary'  onClick={() => setIsChatExpanded(!isChatExpanded)}><ChatIcon fontSize='large' /></IconButton></div>
      <div className={classNames(styles.ChatComponent, { [styles.ChatComponent_collapsed]: !isChatExpanded })}>
        <div className={styles.ChatComponent__nameContainer}>
          <div className={styles.ChatComponent__closeChatIcon}><h2>Представьтесь:</h2>
            <IconButton size='small' onClick={() => setIsChatExpanded(!isChatExpanded)}><CloseIcon /></IconButton></div>
          <form onSubmit={sendName}>
            <FilledInput placeholder={placeholderName ? `Здравствуйте, ${placeholderName}` : ''} value={name} onChange={(e) => setName(e.target.value)} size='small' color='secondary'
              endAdornment={
                <InputAdornment position="end">
                  <IconButton size='small' onClick={sendName} ><ChevronRightIcon /></IconButton>
                </InputAdornment>
              }
            />
          </form>

        </div>
        <Paper className={classNames(styles.ChatComponent__chat, scrollStyle.PrettyScroll)}>
          {messages.map((msg, index) => (<div className={currentUserId === msg.userId ? styles.ChatComponent__message : ''} key={index}>
            <Typography >{msg.username}:</Typography>
            <Typography >{msg.message}</Typography>
          </div>
          ))}
        </Paper>

        <form onSubmit={sendMessage}>
          <FilledInput value={message} onChange={(e) => setMessage(e.target.value)} size='small'
            endAdornment={
              <InputAdornment position="end">
                <IconButton disabled={!message} size='small' onClick={sendMessage} ><ChevronRightIcon /></IconButton>
              </InputAdornment>
            }
          />
        </form>
      </div>
    </>
  );
};

export default ChatComponent;
