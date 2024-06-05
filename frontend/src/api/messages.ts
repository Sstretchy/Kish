import { ChatMessage } from 'types/TChatMessage';
import { sendRequest } from './requestService';

export type TMessagesResponse = {
  messages: ChatMessage[];
};

export const getMessages = async (
  roomId: string,
): Promise<TMessagesResponse> => {
  const data = await sendRequest<TMessagesResponse>({
    url: `/messages/${roomId}`,
    method: 'GET',
  });

  return data;
};
