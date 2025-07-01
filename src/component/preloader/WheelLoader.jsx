// src/component/preloader/WheelLoader.jsx
import React from 'react'
import styles from './WheelLoader.module.css'

export default function WheelLoader() {
    return (
        <div className={styles.gearbox}>
            <div className={styles.overlay}></div>
            <div className={`${styles.gear} ${styles.one}`}>
                <div className={styles.gearInner}>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                </div>
            </div>
            <div className={`${styles.gear} ${styles.two}`}>
                <div className={styles.gearInner}>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                </div>
            </div>
            <div className={`${styles.gear} ${styles.three}`}>
                <div className={styles.gearInner}>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                </div>
            </div>
            <div className={`${styles.gear} ${styles.four} ${styles.large}`}>
                <div className={styles.gearInner}>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                </div>
            </div>
        </div>
  )
}
