import React from "react";
import styles from "./header.module.css";
import Link from "next/link";
import ImageURLs from "../../lib/images";
import Logout from "../../../public/logout-icon.png";
import nextConfig, { domain } from "../../../next.config";
import Config from "../../../next.config";
import Button from "../button/Button";
import { useCookies, Cookies } from "react-cookie"
import Constants from "../../lib/Constants";




const Header = ({ isLogoutButton, isHelpButton }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['accesstoken','idtoken']);
  return (
    <nav
      className={`${styles.cr_header} ${styles.navbar} ${styles.navbar_expand} `}
    >
      <ul className={styles.navbar_nav}>
        <Link href="/">
          <a>
            {" "}
            <img src={ImageURLs.logo} width="60%" height="auto" />{" "}
          </a>
        </Link>
      </ul>
      {isHelpButton && (
        <div className={styles.help_text}>
          <Button ButtonText="Help" handleButtonClick={() => window.open(Constants.helpLink, '_blank')} />
        </div>
      )}

      {isLogoutButton && (
        <div className={styles.log_out}>
          <Button ButtonText="Log out" handleButtonClick={(e) => {
            e.preventDefault();
            localStorage.removeItem("permissionToken");
            localStorage.clear()
            sessionStorage.removeItem("accesstoken");
            removeCookie("accesstoken",{domain: domain}); //TODO : find a proper way to clear cookies
            removeCookie("idtoken", {domain: domain});
            new Cookies().remove("accesstoken", {domain: domain});
            new Cookies().remove("idtoken", {domain: domain});
            window.location.href = nextConfig.basePath;
          }} />
        </div>
      )}

    </nav>
  );
};

export default React.memo(Header);
