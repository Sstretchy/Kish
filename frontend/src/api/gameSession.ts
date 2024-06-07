import { sendRequest } from './requestService';

export type TToken = {
  x: number;
  y: number;
  userId: string;
  color: string;
  nickName: string;
  location: string;
};

export type TGameSessionResponse = {
  roomId: string;
  tokens: TToken[];
};

export const createGameSession = async (roomId: string): Promise<TGameSessionResponse> => {
  const data = await sendRequest<TGameSessionResponse>({
    url: '/game-sessions/create',
    method: 'POST',
    data: { roomId },
  });

  return data;
};
