import React from 'react';
import * as styles from './ActionsBar.less';
import { IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import classNames from 'classnames';
import { useAuth0 } from '@auth0/auth0-react';
import { removeInitialsIds } from 'utils/localStorage';
import { IActionsBarProps } from './IActionsBarProps';

export const ActionsBar = ({ isChatExpanded, setIsChatExpanded }: IActionsBarProps) => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    removeInitialsIds();
  };

  return (
    <div
      className={styles.ActionsBar}>
      <IconButton
        size="large"
        onClick={handleLogout}>
        <LogoutIcon fontSize="large" />
      </IconButton>
      <IconButton
        size="large"
        onClick={() => setIsChatExpanded(!isChatExpanded)}>
        <ChatIcon fontSize="large" />
      </IconButton>
    </div>
  );
};
