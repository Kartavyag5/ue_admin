import React from "react";
import LoginForm from "../../../components/login/Login";
import LoginSidebar from "../../../components/login/LoginSidebar";
import Header from "../../../components/navigation/Header";
import styles from "./login.module.css";
import { cognitoLogin} from "../../../services/cognito";
import { useCookies } from "react-cookie";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import ImageURLs from "../../../lib/images";
import router from "next/router";
import { domain } from "../../../../next.config";
import { Cookies } from "react-cookie";


const Login = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(["accesstoken", "idtoken"]);
  const [error, setError] = React.useState(false);
  const [popupText, setPopupText] = React.useState("");

  const submitHandler = async (state) => {
    try {
      // removeCookie("accesstoken", {domain: domain})
      // removeCookie("idtoken", {domain: domain})
      new Cookies().remove("accesstoken", {domain: domain});
      new Cookies().remove("idtoken", {domain: domain});
      const { emailId, password } = state;
      const cognitoResponse = await cognitoLogin({ emailId, password });
      if (cognitoResponse) {    
        const {accessToken, idToken, tokenExpiryTime} = cognitoResponse;
        setCookie("accesstoken", accessToken, {
        // domain: ".juegostudio.in", // Disable domain field while working locally
          domain: domain,
          expires: new Date(new Date(tokenExpiryTime * 1000).toUTCString()), // Multiplying with 1000 to convert timestamp from seconds to milisec
          // maxAge: 3600 * 24 * 1, // Expires after 1day (sec * hours * days)
          // sameSite: true,
        });
        setCookie("idtoken", idToken,{
          domain: domain,
          expires: new Date(new Date(tokenExpiryTime * 1000).toUTCString())
        })
        sessionStorage.setItem("accesstoken", accessToken);
        props.getDetail();
        // router.push("/");
      } else {
        setError(true);
        setPopupText("Something went wrong");
      }
    } catch (err) {
      setError(true);
      setPopupText(err.message);
    }
  };

  const openForgotPasswordPage = () => {
    router.push("/authentication/forgot-password");
  };

  return (
    <div>
      <Header isLogoutButton={false} isHelpButton={false} />
      <div className={styles.row}>
        <img
          className={styles.seperating_line}
          src={ImageURLs.SeparatingLine}
        />

        <div className={styles.md_5}>
          <LoginSidebar />
        </div>

        <div className={styles.md_7}>
          <div className={`${styles.card} ${styles.card_body}`}>
            <LoginForm
              submitHandler={submitHandler}
              handleForgotPasswordBtn={openForgotPasswordPage}
            />
          </div>
        </div>
      </div>

      {error && (
        <ErrorPopup
          toggle={() => setError(false)}
          bodyText={popupText}
          headerText={"Login Error"}
        />
      )}
    </div>
  );
};

export default Login;
