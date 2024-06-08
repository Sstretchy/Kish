import { Socket } from "socket.io-client";

export interface IChatComponentProps {
  socket: Socket<any>;
  currentRoomId: string;
  currentUserId: string;
  setNickName: React.Dispatch<React.SetStateAction<string>>;
  nickName: string;
  setIsChatExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isChatExpanded: boolean;
}
