import { sendRequest } from './requestService';

export const createRoom = async (userId: string): Promise<string> => {
  const data = await sendRequest<{ roomId: string }>({
    url: '/rooms/create',
    method: 'POST',
    data: { userId },
  });

  return data.roomId;
};
