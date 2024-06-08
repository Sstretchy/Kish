import React, { useEffect, useState, useCallback } from 'react';
import * as styles from './Map.less';
import { TToken } from 'api/gameSession';
import { IMapProps } from './IMapProps';
import { LOCATIONS } from 'const/consts';
import { getRandomTokenColor } from 'utils/token';

export const Map = ({
  currentUserId,
  nickName,
  socket,
  currentRoomId,
}: IMapProps) => {
  const [tokens, setTokens] = useState<TToken[]>([]);

  useEffect(() => {
    socket.on('load tokens', (loadedTokens: TToken[]) => {
      setTokens(loadedTokens);
    });

    socket.on('update tokens', (updatedTokens: TToken[]) => {
      setTokens(updatedTokens);
    });

    return () => {
      socket.off('load tokens');
      socket.off('update tokens');
    };
  }, [socket]);

  const handleAreaClick = useCallback(
    (location: string) => {
      const existingTokenIndex = tokens.findIndex(
        (token) => token.userId === currentUserId,
      );

      if (existingTokenIndex !== -1) {
        if (tokens[existingTokenIndex].location === location) {
          return;
        }

        const updatedTokens = [...tokens];
        updatedTokens[existingTokenIndex] = {
          ...updatedTokens[existingTokenIndex],
          location,
        };
        setTokens(updatedTokens);
        socket.emit('place token', {
          roomId: currentRoomId,
          token: updatedTokens[existingTokenIndex],
        });
      } else {
        const usedColors = tokens.map((token) => token.color);
        const newColor = getRandomTokenColor(usedColors);

        const newToken: TToken = {
          userId: currentUserId,
          color: newColor,
          nickName,
          location,
        };
        setTokens([...tokens, newToken]);
        socket.emit('place token', { roomId: currentRoomId, token: newToken });
      }
    },
    [tokens],
  );

  return (
    <div className={styles.Map}>
      {LOCATIONS.map((area) => (
        <div
          key={area.id}
          className={styles.Map__area}
          style={{
            top: `${area.top}px`,
            left: `${area.left}px`,
            width: `${area.width}px`,
            height: `${area.height}px`,
          }}
          onClick={() => handleAreaClick(area.location)}>
          {tokens
            .filter((token) => token.location === area.location)
            .map((token, index) => (
              <div
                key={index}
                className={styles.Map__token}
                style={{
                  backgroundImage: `radial-gradient(${token.color}, black)`,
                }}
                title={token.nickName}
              />
            ))}
        </div>
      ))}
    </div>
  );
};
