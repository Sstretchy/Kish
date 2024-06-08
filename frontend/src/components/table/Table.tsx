import React from 'react';
import * as styles from './Table.less';
import { ITableProps } from './ITableProps';

export const Table = ({ children }: ITableProps) => {
  return (
    <div className={styles.Table}>
      <div className={styles.Table__top}>
        <div className={styles.ShoreLine}>
          <div className={styles.ShoreLine__card} />
          <div className={styles.ShoreLine__card} />
          <div className={styles.ShoreLine__card} />
        </div>
        <div className={styles.Village}>
          <div className={styles.Village__card} />
          <div className={styles.Village__card} />
          <div className={styles.Village__card} />
        </div>
      </div>
      <div className={styles.Table__middleSection}>
        <div className={styles.Table__left}>
          <div className={styles.Event} />
          <div className={styles.Event} />
          <div className={styles.Event} />
          <div className={styles.Event} />
        </div>
        {children}
        <div className={styles.Table__right}>
          <div className={styles.Sity}>
            <div className={styles.Sity__card} />
            <div className={styles.Sity__card} />
            <div className={styles.Sity__card} />
          </div>
          <div className={styles.Store} />
        </div>
      </div>
      <div className={styles.Table__bottom}>
        <div className={styles.Mountains}>
          <div className={styles.Mountains__card} />
          <div className={styles.Mountains__card} />
          <div className={styles.Mountains__card} />
        </div>
        <div className={styles.Forest}>
          <div className={styles.Forest__card} />
          <div className={styles.Forest__card} />
          <div className={styles.Forest__card} />
        </div>
      </div>
    </div>
  );
};
