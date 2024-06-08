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
import CloseIcon from '@mui/icons-material/Close';
import { useAuth0 } from '@auth0/auth0-react';
import { IChatComponentProps } from './IChatComponentProps';
import { ChatMessage } from 'types/TChatMessage';
import { TMessagesResponse, getMessages } from 'api/messages';
import { udpateNickName } from 'api/users';

export const ChatComponent = ({
  socket,
  currentUserId,
  currentRoomId,
  nickName,
  setNickName,
  setIsChatExpanded,
  isChatExpanded,
}: IChatComponentProps) => {
  const [snakbarOpened, setSnakbarOpened] = useState(false);
  const { isAuthenticated } = useAuth0();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    (async () => {
      if (currentRoomId && currentUserId) {
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

        setMessages((prevMessages) => [...prevMessages, ...messages]);

        socket.on('user joined', (nickName: string) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { nickname: '', message: `${nickName} присоединился к игре` },
          ]);
        });
      }
    })();

    return () => {
      socket.off('chat message');
    };
  }, [currentRoomId, currentUserId]);

  const sendNickName = async (event: FormEvent) => {
    event.preventDefault();

    if (name) {
      const nickName = await udpateNickName({
        userId: currentUserId,
        nickName: name,
      });

      setNickName(nickName);
      setName('');
      localStorage.setItem('nickName', nickName);
    }
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

  return (
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
        {messages.map((msg, index) =>
          msg.nickname ? (
            <div
              className={
                currentUserId === msg.userId
                  ? styles.ChatComponent__message
                  : ''
              }
              key={index}>
              <Typography>{msg.nickname}:</Typography>
              <Typography>{msg.message}</Typography>
            </div>
          ) : (
            <Typography fontSize={12}>{msg.message}</Typography>
          ),
        )}
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
  );
};
