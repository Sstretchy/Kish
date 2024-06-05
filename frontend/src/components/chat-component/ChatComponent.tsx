import React, { useState, useEffect, FormEvent } from 'react';
import * as styles from './ChatComponent.less';
import * as scrollStyle from 'styles/PrettyScroll.less';
import {
  Button,
  FilledInput,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import classNames from 'classnames';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth0 } from '@auth0/auth0-react';
import { IChatComponentProps } from './IChatComponentProps';
import { ChatMessage } from 'types/TChatMessage';
import { removeInitialsIds } from 'utils/localStorage';
import { TMessagesResponse, getMessages } from 'api/messages';
import { udpateNickName } from 'api/users';

export const ChatComponent = ({
  socket,
  currentUserId,
  currentRoomId,
  nickName,
  setNickName,
}: IChatComponentProps) => {
  const [snakbarOpened, setSnakbarOpened] = useState(false);
  const { logout, isAuthenticated } = useAuth0();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const [name, setName] = useState('');

  useEffect(() => {
    (async () => {
      if (currentRoomId) {
        socket.emit('join room', {
          roomId: currentRoomId,
          userId: currentUserId,
        });

        socket.on('chat message', (msg: ChatMessage) => {
          console.log('Received message:', msg);
          setMessages((prevMessages) => [...prevMessages, msg]);
        });

        const { messages }: TMessagesResponse =
          await getMessages(currentRoomId);

        setMessages(messages);
      }
    })();

    return () => {
      socket.off('chat message');
    };
  }, [currentRoomId]);

  const sendNickName = async (event: FormEvent) => {
    event.preventDefault();
    const nickName = await udpateNickName({
      userId: currentUserId,
      nickName: name,
    });

    setNickName(nickName);
    setName('');
    localStorage.setItem('nickName', nickName);
  };

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    socket.emit('chat message', {
      roomId: currentRoomId,
      userId: currentUserId,
      message,
    });
    setMessage('');
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    removeInitialsIds();
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
          onClick={handleLogout}>
          <LogoutIcon fontSize="large" />
        </IconButton>
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
            <Snackbar
              message="Скопировано в буфер обмена"
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              autoHideDuration={2000}
              onClose={() => setSnakbarOpened(false)}
              open={snakbarOpened}
            />
            <Button
              variant="contained"
              // fullWidth
              size="small"
              onClick={() => {
                setSnakbarOpened(true);
                navigator.clipboard.writeText(currentRoomId);
              }}>
              #{currentRoomId}
            </Button>
            <IconButton
              size="small"
              onClick={() => setIsChatExpanded(!isChatExpanded)}>
              <CloseIcon />
            </IconButton>
          </div>
          {isAuthenticated && (
            <div>
              <Typography>Здравствуйте, {nickName}</Typography>
              <form onSubmit={sendNickName}>
                <FilledInput
                  fullWidth
                  placeholder="Сменить никнейм"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  size="small"
                  color="secondary"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={sendNickName}>
                        <ChevronRightIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </form>
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
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
