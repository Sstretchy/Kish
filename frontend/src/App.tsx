import React from 'react';
import * as styles from './App.less';
import { ChatComponent } from 'components/chat-component/ChatComponent';
import { Map } from 'components/map/Map';
import { useAuth0 } from '@auth0/auth0-react';

export const App = () => {

  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Oops... {error.message}</div>;
  }
  return (
      <div className={styles.App}>
        <div className={styles.App__mainContent} />
        <Map />
        <ChatComponent />
      </div>
  );
};
