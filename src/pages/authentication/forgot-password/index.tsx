import React from "react";
import ForgotpasswordForm from "../../../components/forgotPassword/ForgotPassword";
import styles from './style.module.css';
import { forgotPassword } from "../../../services/cognito";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import LoginSidebar from "../../../components/login/LoginSidebar";
import Header from "../../../components/navigation/Header";
import ImageURLs from "../../../lib/images";
import router from "next/router";

const Forgotpassword = ({setCloseForgotPassword}) => {
  const [error, setError] = React.useState(false);
  const [popupText, setPopupText] = React.useState('')
 
  const submitHandler = async(state) => {
    try { 
      const { emailId } = state;
      if(emailId) { 
        //after successful api open login page
        await forgotPassword({ email: emailId });
        // router.push('/authentication/login');
        router.push('/')
      }
      else {
        setError(true);
        setPopupText("Field cant be empty");
      }
    } catch(err){
      setError(true);
      setPopupText(err.message);
    }
  }

  const openLoginPage = () => {
    // router.push('/authentication/login')
    router.push('/') // TODO: redirects to login page after auth check
  }
  
  return (
    <div>
        <Header isLogoutButton={false} isHelpButton={false} />

        <div className={styles.row}>
          <img className={styles.seperating_line} src={ImageURLs.SeparatingLine} />

          <div className={styles.md_5}>
            <LoginSidebar />
          </div>
          
          <div className={styles.md_7}>
            <div className={`${styles.card} ${styles.card_body}`}>
              <ForgotpasswordForm  
                handleLoginBtn = {openLoginPage}
                submitHandler = {submitHandler}
              />
            </div>
          </div>

        {error && 
          <ErrorPopup
            toggle={()=> setError(false)} 
            bodyText={popupText}
            headerText={'Error'}
          />
        }
      </div>
    </div>
  )
}

export default Forgotpassword