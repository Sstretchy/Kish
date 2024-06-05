export const getInitialsIds = () => {
  return {
    savedRoomId: localStorage.getItem('currentRoomId'),
  };
};

export const setInitialsIds = (
  currentRoomId: string,
) => {
  localStorage.setItem('currentRoomId', currentRoomId);
};

export const removeInitialsIds = () => {
  localStorage.removeItem('currentRoomId');
};
