import React, { useEffect, useState } from 'react';
import * as styles from './App.less';
import { ChatComponent } from 'components/chat-component/ChatComponent';
import { Map } from 'components/map/Map';
import { LoginView } from 'components/login-view/LoginView';
import { io } from 'socket.io-client';
import { getInitialsIds, setInitialsIds } from 'utils/localStorage';
import { useAuth0 } from '@auth0/auth0-react';
import { TUserResponse, getUser } from 'api/users';
import { ActionsBar } from 'components/actions-bar/ActionsBar';
import { TopPanel } from 'components/top-panel/TopPanel';
import { Table } from 'components/table/Table';

const socket = io(process.env.API_URL);

export const App = () => {
  const [readyToPlay, setReadyToPlay] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [nickName, setNickName] = useState('');

  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    (async () => {
      if (isAuthenticated && user) {
        const { userId, nickName }: TUserResponse = await getUser({
          email: user.email,
          auth0Id: user.sub,
        });

        setCurrentUserId(userId);
        setNickName(nickName);
      }
    })();
  }, [isAuthenticated, user]);

  useEffect(() => {
    const { savedRoomId } = getInitialsIds();

    if (savedRoomId && isAuthenticated) {
      setCurrentRoomId(savedRoomId);
      setReadyToPlay(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (readyToPlay) {
      setInitialsIds(currentRoomId);
    }
  }, [readyToPlay]);

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
      <div className={styles.App__topContainer}>
        <TopPanel />
        <Table>
          <Map
            currentUserId={currentUserId!}
            nickName={nickName}
            socket={socket}
            currentRoomId={currentRoomId}
          />
        </Table>
      </div>
      <div className={styles.App__rightContainer}>
        <ActionsBar
          isChatExpanded={isChatExpanded}
          setIsChatExpanded={setIsChatExpanded}
        />
        <ChatComponent
          socket={socket}
          currentRoomId={currentRoomId}
          currentUserId={currentUserId}
          setNickName={setNickName}
          nickName={nickName}
          isChatExpanded={isChatExpanded}
          setIsChatExpanded={setIsChatExpanded}
        />
      </div>
    </div>
  );
};
