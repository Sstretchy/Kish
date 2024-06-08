import { sendRequest } from './requestService';

type TUserRequestData = {
  email: string;
  auth0Id: string;
};

export type TUserResponse = {
  userId: string;
  nickName: string;
};

export type TUpdateNickNameData = {
  userId: string;
  nickName: string;
};

export type TUpdateNickResponse = {
  nickName: string;
};

export const getUser = async (
  data: TUserRequestData,
): Promise<TUserResponse> => {
  const user = await sendRequest<TUserResponse>({
    url: `/users/register`,
    method: 'POST',
    data,
  });

  return user;
};

export const udpateNickName = async (
  data: TUpdateNickNameData,
): Promise<string> => {
  const user = await sendRequest<TUpdateNickResponse>({
    url: `/users/nickname`,
    method: 'PUT',
    data,
  });

  return user.nickName;
};
