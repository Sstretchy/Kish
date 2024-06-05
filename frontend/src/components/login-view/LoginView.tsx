import React, { useEffect, useState } from 'react';
import * as styles from './LoginView.less';
import Logo from '../../assets/logo_game_medieval_punk.png';
import { Button, Snackbar, TextField, Typography } from '@mui/material';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ILoginViewProps } from './ILoginViewProps';

export const LoginView = ({
  socket,
  setCurrentRoomId,
  currentUserId,
  currentRoomId,
  setReadyToPlay,
}: ILoginViewProps) => {
  const [snakbarOpened, setSnakbarOpened] = useState(false);
  const [codeForEntering, setCodeForEntering] = useState('');

  const { isLoading, error, isAuthenticated, loginWithRedirect, logout } =
    useAuth0();

  const joinRoom = (roomId: string) => {
    setCurrentRoomId(roomId);
    setReadyToPlay(true);
  };

  const createRoom = () => {
    axios
      .post('http://localhost:3001/api/rooms/create', { userId: currentUserId })
      .then((response) => {
        if (response.data.success) {
          joinRoom(response.data.roomId);
        }
      });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  return (
    <div className={styles.LoginView}>
      <img src={Logo} />
      <div className={styles.LoginView__container}>
        <h1>Король и Шут</h1>
        <Typography
          fontSize={40}
          color="primary">
          Настольная онлайн игра для 4 игроков
        </Typography>
        {!isAuthenticated ? (
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => loginWithRedirect()}>
            Войти
          </Button>
        ) : (
          <div className={styles.LoginView__buttons}>
            {currentRoomId ? (
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => {
                  setSnakbarOpened(true);
                  navigator.clipboard.writeText(currentRoomId);
                }}>
                <ContentCopyOutlinedIcon />
                &nbsp;&nbsp;
                {currentRoomId}
              </Button>
            ) : (
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={createRoom}>
                Создать комнату
              </Button>
            )}
            <Snackbar
              message="Скопировано в буфер обмена"
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              autoHideDuration={2000}
              onClose={() => setSnakbarOpened(false)}
              open={snakbarOpened}
            />
            <div className={styles.LoginView__codeContainer}>
              <Button
                color="primary"
                disabled={!codeForEntering}
                variant="contained"
                fullWidth
                size="large"
                onClick={() => joinRoom(codeForEntering)}>
                Присоединиться к игре
              </Button>
              <TextField
                placeholder="Введите код комнаты"
                className={styles.LoginView__input}
                variant="outlined"
                fullWidth
                value={codeForEntering}
                onChange={(e) => setCodeForEntering(e.target.value)}
                size="small"
              />
            </div>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }>
              Выход
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
