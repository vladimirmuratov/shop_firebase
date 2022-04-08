import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import styles from "./profile-page.module.css";

export const ProfilePage: React.FC = (): JSX.Element => {
    const {data} = useSelector((state: RootState) => state.user)
    const {_id, email, image, name} = data
    return (
        <div className={styles.profilePage_wrapper}>
            <div className={styles.profilePage_block}>
                <span className={styles.profilePage_title}>ID:</span>
                <span className={styles.profilePage_result}>{_id}</span>
            </div>
            <div className={styles.profilePage_block}>
                <span className={styles.profilePage_title}>Имя:</span>
                <span className={styles.profilePage_result}>{name}</span>
            </div>
            <div className={styles.profilePage_block}>
                <span className={styles.profilePage_title}>Email:</span>
                <span className={styles.profilePage_result}>{email}</span>
            </div>
            <div className={styles.profilePage_block}>
                <span className={styles.profilePage_title}>image:</span>
                <span className={styles.profilePage_result}>{image}</span>
            </div>
        </div>
    )
}