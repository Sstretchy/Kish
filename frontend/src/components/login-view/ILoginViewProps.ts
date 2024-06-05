import React from 'react';
import { Socket } from 'socket.io-client';

export interface ILoginViewProps {
  socket: Socket<any>;
  setCurrentRoomId: React.Dispatch<React.SetStateAction<string>>;
  currentUserId: string;
  currentRoomId: string;
  setReadyToPlay: React.Dispatch<React.SetStateAction<boolean>>
}
