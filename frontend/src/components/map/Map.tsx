import React from 'react';
import YourImage from '../../assets/map.png';
import * as styles from './Map.less';

export const Map = () => {
  return (
    <img
      className={styles.Map}
      src={YourImage}
      alt="Description of your image"
    />
  );
};
