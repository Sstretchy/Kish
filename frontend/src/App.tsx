import React, { useEffect } from 'react'
import ChatComponent from './components/ChatComponent'
import styles from './app.module.css';

console.log(styles)

export const App = () => {

  useEffect(() => console.log(styles), [])

  return (
    <div
     className={styles.app}
     >
      <div >
      </div>
      <ChatComponent />
    </div>)
}