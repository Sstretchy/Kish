import axios, { Method } from 'axios';

interface RequestOptions {
  url: string;
  method: Method;
  data?: any;
}

export const sendRequest = async <T>({
  url,
  method,
  data,
}: RequestOptions): Promise<T> => {
  try {
    const response = await axios({
      url: `${process.env.API_URL}/api${url}`,
      method,
      data,
    });

    return response.data;
  } catch (error) {
    console.error('Error making request:', error);
    throw error;
  }
};
