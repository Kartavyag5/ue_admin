import React from "react";
import Input from "../Input/Input";
import styles from './index.module.css';

const ResetPasswordForm = ({ submitHandler }) => {

  const [state, setstate] = React.useState({ password1: '',  password2: '',  error: '' })

  function handleFormSubmit(e) {
    e.preventDefault();
    submitHandler(state);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div className={styles.top_heading}>
        <h3>Reset Password</h3>
      </div>

      <div className={styles.formgroup}>
        <Input required={true} className={`${styles.form_control}`} placeholder="Enter new Password" type="password" name="password1" value={state.password1} onChange={(val) => setstate({ ...state, password1: val })} />
      </div>

      <br />

      <div className={styles.formgroup}>
        <Input required={true} className={`${styles.form_control} `} placeholder="Confirm new Password" type="password" name="password2" value={state.password2} onChange={(val) => setstate({ ...state, password2: val })} />
      </div>

      <br />

      <button type="submit" className={`${styles.login_btn} ${styles.btn}`}>Update Password</button>

      {state.error && <p className={styles.error_message}>{state.error}</p>}
    </form>

  )
}

export default ResetPasswordForm;