import { ChatMessage } from 'types/TChatMessage';
import { sendRequest } from './requestService';

export interface TMessagesResponse {
  messages: ChatMessage[];
};

export const getMessages = async (
  roomId: string,
): Promise<TMessagesResponse> => {
  const data = await sendRequest<TMessagesResponse>({
    url: `http://localhost:3001/api/messages/${roomId}`,
    method: 'GET',
  });

  return data;
};
