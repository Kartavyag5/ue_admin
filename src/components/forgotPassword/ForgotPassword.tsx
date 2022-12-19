import React, { useRef, useState } from "react";
import { userSearch } from "../../services/personService";
import Input from "../Input/Input";
import ErrorPopup from "../popup/ErrorPopup";
import styles from './index.module.css';
import Constants from "../../lib/Constants";


const ForgotpasswordForm = ({ handleLoginBtn, submitHandler }) => {

  const [state, setstate] = React.useState({ emailId: '', error: '' })

  const [errorData, setErrorData] = useState<errorData>({
    state: false,
    message: "",
    alertType: 1
  });

  const userNotExistsCode = useRef();

  const { ResponseCodes } = Constants;


  function handleFormSubmit(e) {
    e.preventDefault();
    (userNotExistsCode.current !== ResponseCodes.userNotExists) && submitHandler(state);
  }

  const handleEmailValidation = async (email) => {

    try {
      let reqData = {
        email_id: email
      }
      if (reqData.email_id) {
        const res = await userSearch({ reqData })
        if (ResponseCodes.userNotExists === res) {
          userNotExistsCode.current = res;
          setErrorData({ state: true, message: "User does not exists!", alertType: 5 })
        }
      }
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  const toggle = () => {
    setErrorData({ state: false, message: "", alertType: 1 })
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div className={styles.top_heading}>
        <h3>Enter Registered Email</h3>
      </div>

      <div className={styles.formgroup}>
        <Input required={true} className={`${styles.form_control} `} handleOnBlur={handleEmailValidation} type="email" name="email_id" value={state.emailId} onChange={(val) => setstate({ ...state, emailId: val })} />
      </div>

      <br />

      <button type="submit" className={`${styles.login_btn} ${styles.btn}`}>Send Reset Email</button>

      <button type="button" onClick={() => handleLoginBtn()} className={`${styles.login_btn} ${styles.btn}`}>Log in</button>

      {state.error && <p className={styles.error_message}>{state.error}</p>}

      {errorData.state && (
        <ErrorPopup
          toggle={toggle}
          bodyText={errorData.message}
          headerText={errorData.alertType === 4 ? "Alert" : "Error"}
          alertType={errorData.alertType}
        />)}
    </form>


  )
}

export default ForgotpasswordForm;