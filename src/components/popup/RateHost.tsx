import React, { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import styles from "./style.module.css";
import Button from "../button/Button";
import ErrorPopup from "../../components/popup/ErrorPopup";
import { rateHost } from "../../services/gameSchedule";


interface RateHostProps {
    toggle: Function
    hostName: any
    gameName: any
    gameDate: any
    gameScheduleId: any
    communityId: any
    handleSaveData : Function
    handleIsHostRated: Function
}
function RateHost({ toggle, handleSaveData,  handleIsHostRated, hostName, gameName, gameDate, communityId, gameScheduleId }: RateHostProps) {

    const [engagementRate, setEngagementRate] = useState(1)
    const [competenceRate, setCompetenceRate] = useState(1)
    const [isRecomended, setRecomended] = useState("1")
    const [comments, setComments] = useState("")
    const Ratings = [{ id: 1, label: 1 }, { id: 2, label: 2 }, { id: 3, label: 3 }, { id: 4, label: 4 }, { id: 5, label: 5 }]

    const [errorData, setErrorData] = useState({
        state: false,
        message: "",
    });


    // submit response    
    const handleButtonClick = async () => {
        try {
            let reqData:rateHostPayload = {
                game_schedule_id: gameScheduleId,
                community_id: communityId,
                engagement_rate: engagementRate,
                knowledge_rate: competenceRate,
                recommend: isRecomended,
            }
            if(comments !== "") reqData.comments = comments;
            await rateHost({ reqData });
            handleSaveData()
            handleIsHostRated()
            toggle()

        } catch (err) {
            console.error(err);
            setErrorData({ state: true, message: err.message });
        }
    }

    return (
        <div className={styles.modal}>
            <div className={styles.overlay}>
                <div className={`${styles.modal_content} ${styles.role_modal_content}`} style={{ paddingTop: "1rem", top: "2rem" }}>
                    <div className={styles.top_header}>
                        <div className={`${styles.flex_item} ${styles.justify_center}`}>
                            <label
                                className={`${styles.align_center} ${styles.popup_header}`}
                            >
                                RATE HOST
                            </label>
                        </div>
                        <span
                            className={`${styles.popup_content_h1} ${styles.rate_host_close_btn}`}
                        >
                            <AiFillCloseCircle
                                onClick={() => toggle()}
                                className={styles.closeicon}
                            />
                        </span>
                    </div>
                    <div className={styles.modal_flex}>
                        <div className={styles.popup_content_h5}>
                            Please rate the Host who ran this game for you.
                        </div>
                        <div className={styles.popup_content_h5}>
                            On scale of 1-5(1 being Poor, 5 being Great),
                        </div>
                        <div className={styles.popup_content_h5}>
                            please give us your thoughts:
                        </div>
                    </div>
                    <div className={`${styles.flex_item} ${styles.justify_around}`}>
                        <div  style={{marginTop : "1rem"}}>
                            <label className={styles.rate_host_label}>Game Name</label>
                            <input type="text" disabled={true} className={styles.rate_host_input} value={gameName}></input>
                        </div>
                        <div  style={{marginTop : "1rem"}}>
                            <label className={styles.rate_host_label}>Date of game</label>
                            <input type="text" disabled={true} className={styles.rate_host_input} value={gameDate}></input>
                        </div>
                        <div  style={{marginTop : "1rem"}}>
                            <label className={styles.rate_host_label}>Host Name</label>
                            <input type="text" disabled={true} className={styles.rate_host_input} value={hostName} style={{width:"11rem"}}></input>
                        </div>
                    </div>
                    <div style={{ paddingTop: "2rem" }}>
                        <div className={styles.flex_item}>
                            <label className={`${styles.rate_host_label} ${styles.feedback_label}`}>Overall Engagement with Players</label>
                            <div >
                                {Ratings.map(el =>
                                    <>
                                        <label className={styles.ratings}>{el.id}</label>
                                        <input className={styles.radio_btn} type="radio" onClick={() => setEngagementRate(el.id)} checked={engagementRate == el.id}></input>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={styles.flex_item} style={{ marginTop: "1.25rem" }} >
                            <label className={`${styles.rate_host_label} ${styles.feedback_label}`}>Knowledge and Competence with gameplay</label>
                            <div >
                                {Ratings.map(el =>
                                    <>
                                        <label className={styles.ratings}>{el.id}</label>
                                        <input className={styles.radio_btn} type="radio" onClick={() => setCompetenceRate(el.id)} checked={competenceRate == el.id ? true : false}></input>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={styles.flex_item} style={{ marginTop: "1.25rem" }}>
                            <label className={`${styles.rate_host_label} ${styles.feedback_label}`}>Would you recommend this host to others?</label>
                            <div>
                                <label className={styles.ratings} style={{ paddingRight: '0.25rem' }}>Y</label>
                                <input className={styles.radio_btn} type="radio" onClick={() => setRecomended("1")} checked={isRecomended === "1"}></input>
                                <label className={styles.ratings} style={{ paddingRight: '0.25rem' }}>N</label>
                                <input className={styles.radio_btn} type="radio" onClick={() => setRecomended("2")} checked={isRecomended === "2"}></input>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.flex_item} ${styles.justify_center} ${styles.align_center}`} style={{ marginTop: "1rem"}}>
                        <label className={`${styles.rate_host_label} ${styles.align_center}`}>Comments</label>
                        <textarea className={styles.comment} onChange={(e) => setComments(e.target.value)} cols={50}></textarea>
                        {/* <input type="text" placeholder="255 characters limit" className={styles.comment} onChange={(e) => setComments(e.target.value)} maxLength={255}></input> */}
                    </div>
                    <div className={styles.btn}>
                        <Button handleButtonClick={handleButtonClick} ButtonText="Save" type="button" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RateHost;
