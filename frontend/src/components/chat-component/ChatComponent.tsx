import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import * as styles from './ChatComponent.less';
import * as scrollStyle from 'styles/PrettyScroll.less';
import {
  FilledInput,
  IconButton,
  InputAdornment,
  Paper,
  Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import classNames from 'classnames';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth0 } from '@auth0/auth0-react';

type ChatMessage = {
  username: string;
  message: string;
  userId: string;
};

export const ChatComponent = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [placeholderName, setPlaceholderName] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [isChatExpanded, setIsChatExpanded] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Регистрация пользователя при аутентификации
      axios.post('http://localhost:3001/api/register', { email: user.email, name: user.name, auth0Id: user.sub })
        .then(response => {
          if (response.data.success) {
            setCurrentUserId(response.data.userId);
            setName(user.name);
            setPlaceholderName(user.name);
          }
        });
    }

    // Получение всех сообщений при загрузке компонента
    axios.get('http://localhost:3001/api/messages')
      .then(response => {
        if (response.data.success) {
          setMessages(response.data.messages);
        }
      });

  }, [isAuthenticated, user]);

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    if (!message) return;
    axios.post('http://localhost:3001/api/messages', { userId: currentUserId, message })
      .then(response => {
        if (response.data.success) {
          setMessages(prevMessages => [...prevMessages, response.data.message]);
          setMessage('');
        }
      });
  };

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <>
      <div
        className={classNames(styles.OpenChatIcon, {
          [styles.OpenChatIcon_hide]: isChatExpanded,
        })}>
        <IconButton
          size="large"
          color="primary"
          onClick={() => setIsChatExpanded(!isChatExpanded)}>
          <ChatIcon fontSize="large" />
        </IconButton>
      </div>
      <div
        className={classNames(styles.ChatComponent, {
          [styles.ChatComponent_collapsed]: !isChatExpanded,
        })}>
        <div className={styles.ChatComponent__nameContainer}>
          <div className={styles.ChatComponent__closeChatIcon}>
            <h2>Представьтесь:</h2>
            <IconButton
              size="small"
              onClick={() => setIsChatExpanded(!isChatExpanded)}>
              <CloseIcon />
            </IconButton>
          </div>
          {!isAuthenticated && (
            <button onClick={handleLogin}>Log In</button>
          )}
          {isAuthenticated && (
            <div>
              <button onClick={handleLogout}>Log Out</button>
              <Typography>Здравствуйте, {placeholderName}</Typography>
            </div>
          )}
        </div>
        <Paper
          className={classNames(
            styles.ChatComponent__chat,
            scrollStyle.PrettyScroll,
          )}>
          {messages.map((msg, index) => (
            <div
              className={
                currentUserId === msg.userId
                  ? styles.ChatComponent__message
                  : ''
              }
              key={index}>
              <Typography>{msg.username}:</Typography>
              <Typography>{msg.message}</Typography>
            </div>
          ))}
        </Paper>

        <form onSubmit={sendMessage}>
          <FilledInput
            value={message}
            onChange={(e: {
              target: { value: React.SetStateAction<string> };
            }) => setMessage(e.target.value)}
            size="small"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  disabled={!message}
                  size="small"
                  onClick={sendMessage}>
                  <ChevronRightIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </form>
      </div>
    </>
  );
};
