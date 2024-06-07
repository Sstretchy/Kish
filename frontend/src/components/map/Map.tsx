import React, { useEffect, useState } from 'react';
import * as styles from './Map.less';
import { TToken } from 'api/gameSession';

type MapProps = {
  currentUserId: string;
  nickName: string;
  socket: any; // Добавляем сокет как пропс
  currentRoomId: string;
};

const areas = [
  { id: 1, location: 'Побережье', top: 10, left: 60, width: 300, height: 300 },
  { id: 2, location: 'Деревня', top: 5, left: 365, width: 300, height: 300 },
  { id: 3, location: 'Город', top: 40, left: 668, width: 280, height: 280 },
  { id: 4, location: 'Горы', top: 335, left: 80, width: 300, height: 300 },
  { id: 5, location: 'Лес', top: 315, left: 445, width: 340, height: 340 },
];

export const Map = ({ currentUserId, nickName, socket, currentRoomId }: MapProps) => {
  const [tokens, setTokens] = useState<TToken[]>([]);

  useEffect(() => {
    socket.on('load tokens', (loadedTokens: TToken[]) => {
      setTokens(loadedTokens);
    });

    socket.on('update tokens', (updatedTokens: TToken[]) => {
      setTokens(updatedTokens);
    });

    // Отписываемся от событий при размонтировании компонента
    return () => {
      socket.off('load tokens');
      socket.off('update tokens');
    };
  }, [socket]);

  const handleAreaClick = (top: number, left: number, location: string) => {
    const existingTokenIndex = tokens.findIndex(
      (token) => token.userId === currentUserId,
    );

    if (existingTokenIndex !== -1) {
      // Если токен уже существует, обновляем его положение
      const updatedTokens = [...tokens];
      updatedTokens[existingTokenIndex] = {
        ...updatedTokens[existingTokenIndex],
        x: left + 50,
        y: top + 50,
        location,
      };
      setTokens(updatedTokens);
      socket.emit('place token', {
        roomId: currentRoomId,
        token: updatedTokens[existingTokenIndex],
      });
    } else {
      // Если токен не существует, создаем новый
      const newToken: TToken = {
        x: left + 50,
        y: top + 50,
        userId: currentUserId,
        color: 'red', // Присваиваем цвет пользователю, здесь используем фиксированный цвет, но его можно сделать динамическим
        nickName,
        location,
      };
      setTokens([...tokens, newToken]);
      socket.emit('place token', { roomId: currentRoomId, token: newToken });
    }
  };

  return (
    <div className={styles.Map}>
      {areas.map((area) => (
        <div
          key={area.id}
          className={styles.Map__area}
          style={{
            top: `${area.top}px`,
            left: `${area.left}px`,
            width: `${area.width}px`,
            height: `${area.height}px`,
          }}
          onClick={() => handleAreaClick(area.top, area.left, area.location)}
        />
      ))}
      {tokens.map((token, index) => (
        <div
          key={index}
          className={styles.Map__token}
          style={{
            top: `${token.y}px`,
            left: `${token.x}px`,
            backgroundColor: token.color,
          }}
          title={token.nickName}
        />
      ))}
    </div>
  );
};
