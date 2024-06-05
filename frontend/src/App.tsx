import React, { useEffect, useState } from 'react';
import * as styles from './App.less';
import { ChatComponent } from 'components/chat-component/ChatComponent';
import { Map } from 'components/map/Map';
import { LoginView } from 'components/login-view/LoginView';
import { io } from 'socket.io-client';
import { getInitialsIds, setInitialsIds } from 'utils/localStorage';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const socket = io('http://localhost:3001');

export const App = () => {
  const [readyToPlay, setReadyToPlay] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [nickName, setNickName] = useState('');

  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Регистрация пользователя при аутентификации
      axios
        .post('http://localhost:3001/api/users/register', {
          email: user.email,
          name: user.name,
          auth0Id: user.sub,
        })
        .then((response) => {
          if (response.data.success) {
            setCurrentUserId(response.data.userId);
            setNickName(response.data.nickName);
          }
        });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const { savedRoomId } = getInitialsIds();

    if (savedRoomId && isAuthenticated ) {
      setCurrentRoomId(savedRoomId);
      setReadyToPlay(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (readyToPlay) {
      setInitialsIds(currentRoomId);
    }
  }, [readyToPlay]);

  console.log(currentRoomId)

  if (!readyToPlay) {
    return (
      <LoginView
        socket={socket}
        setCurrentRoomId={setCurrentRoomId}
        currentRoomId={currentRoomId}
        currentUserId={currentUserId}
        setReadyToPlay={setReadyToPlay}
      />
    );
  }

  return (
    <div className={styles.App}>
      <div className={styles.App__mainContent} />
      <Map />
      <ChatComponent
        socket={socket}
        currentRoomId={currentRoomId}
        currentUserId={currentUserId}
        setNickName={setNickName}
        nickName={nickName}
      />
    </div>
  );
};
