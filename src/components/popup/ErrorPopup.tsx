import React from "react";
import styles from './style.module.css';
import { AiFillCloseCircle } from 'react-icons/ai'
import Button from "../button/Button";
import { Cookies } from "react-cookie";
import nextConfig from "../../../next.config";

interface props {
  bodyText: string;
  headerText: string;
  toggle: () => void;
  confirmBtnText?: string,
  cancelBtn?:boolean,
  handleAlert?: () => void
  alertType?: number 
  handleContactSupportSucccess?: () => void
  handleDeleteRecord?:() => void
}

class ErrorPopup extends React.PureComponent<props> {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }

  getCookieValue = ({ cookieKey }) => {
    const cookieInstance = new Cookies();
    return cookieInstance.get(cookieKey);
  };


  componentDidMount() {
    if (document.getElementById('cr-sidebar')) document.getElementById('cr-sidebar').style.zIndex = '1';
  }

  handleButtonClick() {
    const isAuthorized = this.getCookieValue({ cookieKey: "accesstoken" });
    const activeSession = sessionStorage.getItem("accesstoken")
    const { alertType, toggle, handleAlert, handleContactSupportSucccess, handleDeleteRecord } = this.props;
    ;
    if(activeSession && isAuthorized) { 
      // const { alertType, toggle, handleAlert, handleContactSupportSucccess, handleDeleteRecord } = this.props;
      
      if(alertType === 2){       //alertType 2 , to handle rate host alert popup in gameSchedule/recordAttendance

        handleAlert()
      }
      else if(alertType === 3){
        handleContactSupportSucccess()
      }
      else if(alertType === 4){
        handleDeleteRecord()
      }
      else{
        toggle()
      }
    }
    else if(alertType === 5) {
      toggle()
    }
    else {
      // TODO: Redirect to login page
      localStorage.removeItem("permissionToken")
      window.location.href = nextConfig.basePath;
    }
  }

  render() {
    const { headerText, bodyText, toggle, confirmBtnText, cancelBtn } = this.props;

    return (
      <div className={styles.modal}>
        <div className={styles.overlay} >
          <div className={`${styles.modal_content} `}>
            <div className={styles.top_header}>
              <span className={styles.popup_content_h1} style = {this.getCookieValue({ cookieKey: "accesstoken" }) && {marginLeft : "2rem"}}> {headerText}
                {/* // TODO: Change condition here */}
                { this.getCookieValue({ cookieKey: "accesstoken" })
                  && sessionStorage.getItem("accesstoken")  
                  && <AiFillCloseCircle onClick={() => toggle()} className={styles.closeicon} /> 
                }
              </span>
    
            </div>
            <h3 className={styles.popup_content_h3}> {bodyText} </h3>
            <div className={`${styles.flex_item} ${styles.justify_center} ${styles.mt_3}`}>
              <div className={styles.margin_right}>
              <Button ButtonText={confirmBtnText || 'Okay'} handleButtonClick={this.handleButtonClick} />
              </div>
              {cancelBtn && <Button ButtonText={'No'} handleButtonClick={toggle} />}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default React.memo(ErrorPopup)