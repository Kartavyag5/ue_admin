import React, { useEffect } from "react";
import ResetPasswordForm from "../../../components/resetPassword/ResetPassword";
import styles from './style.module.css';
import Constants from "../../../lib/Constants";
import { useRouter } from 'next/router'
import { setUserPassword, resetPassword } from "../../../services/cognito"
import ErrorPopup from "../../../components/popup/ErrorPopup";
import LoginSidebar from "../../../components/login/LoginSidebar";
import Header from "../../../components/navigation/Header";
import ImageURLs from "../../../lib/images";
import { useCookies } from "react-cookie"

const ResetPassword = () => {
  const router = useRouter()
  const [error, setError] = React.useState(false);
  const [popupText, setPopupText] = React.useState('')
  const [cookies, setCookie, removeCookie] = useCookies(['accesstoken', 'idtoken']);

  useEffect(() => {
    removeCookie("accesstoken");
    removeCookie("idtoken")
    sessionStorage.removeItem("accesstoken");
  }, []);

  const submitHandler = async(state) => {
    try { 
      const { password1, password2 } = state;
      if(password1 === password2) {
        const { username, tempPass, type, verificationCode, email } : any = router.query
        console.log("Passing data", { username, tempPass, password1, email, type})
        if(parseInt(type) === 1) await setUserPassword({ userName: username, tempPassword: tempPass, newUserPassowrd: password1 });
        else if(parseInt(type) === 2) await resetPassword({ email, verificationCode, newPassword: password1});
        else {
          setError(true);
          setPopupText("Type does not exist");
          return;
        }
        router.push('/');
      } else {
        setError(true);
        setPopupText("Password dont match");
      }
    //after successful api open login page
    } catch(err){
      setError(true);
      setPopupText(err.message);
    }
  }
  
  return (
    <div>
        <Header isLogoutButton={false} isHelpButton={false}/>

        <div className={styles.row}>
          <img className={styles.seperating_line} src={ImageURLs.SeparatingLine} />

          <div className={styles.md_5}>
            <LoginSidebar />
          </div>

          <div className={styles.md_7}>
            <div className={`${styles.card} ${styles.card_body}`}>
              <ResetPasswordForm  
                submitHandler = {submitHandler}
              />
            </div>
          </div>

          {error && 
            <ErrorPopup
              toggle={()=> setError(false)} 
              bodyText={popupText}
              headerText={'Password Reset Error'}
            />
          }
        </div>
    </div>
  
  )
}

export default ResetPassword;