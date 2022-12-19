import React from "react";
import Input from "../Input/Input";
import styles from './login.module.css';

const LoginForm = ({ submitHandler, handleForgotPasswordBtn }) => {
  const [state, setstate] = React.useState({ emailId: '', password: '', error: '' })

  function handleFormSubmit(e) {
    e.preventDefault();
    submitHandler(state);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div className={styles.top_heading}>
        <h3>Log in</h3>
      </div>

      <div className={styles.formgroup}>
        <label className={styles.label}>Email </label>
        <Input required={true}  className={`${styles.form_control} `} type="email" name="email_id" value={state.emailId} onChange={(val) => setstate({ ...state, emailId: val })} />
      </div>
      <br/>
      <div className={styles.formgroup} style={{marginBottom:'0px'}}>
        <label className={styles.label}>Password </label>
        <Input required={true} className={`${styles.form_control} `} type="password" name="password" value={state.password} onChange={(val) => setstate({ ...state, password: val })} />
      </div>

      <input type="button" className={`${styles.small_text} ${styles.btn_link}`}  onClick={() => handleForgotPasswordBtn()}   value="Forgot Password?" />
      
      {/* <button type="button" onClick={() => openForgotPassword()} className={` ${styles.btn_link}  ${styles.btn} `} >
        <small className={styles.small_text}>Forgot Password? </small>
      </button> */}
      <br/>

      <button type="submit" className={`${styles.login_btn} ${styles.btn}`}>Log in</button>
      {state.error && <p className={styles.error_message}>{state.error}</p>}
    </form>
  )
}

export default LoginForm;
