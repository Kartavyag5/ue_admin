import React from 'react';
import styles from './sidebar.module.css';
import ImageURLs from '../../lib/images';
import Config from "../../../next.config";
import Constants from '../../lib/Constants';

const LoginSidebar = () =>  {
    return (
      <aside className={`${styles.login_sidebar} ${styles.cr_sidebar} ${styles.cr_sidebar_open} `}>

        {/* <div className={styles.cr_sidebar_background}  /> */}
        <div className={styles.cr_sidebar_content}>
          <p className={styles.text}>
          Account login is reserved for Utopia Experiences subscribers and game show hosts.
          If you are interested in learning more or having trouble with your current login, please contact us.
          </p>

          <div className={styles.footer}>
            <a className={styles.contactuslink} href={Constants.contactUsLink} target="_blank" rel="noopener noreferrer">
              <span className={styles.contactus}><img src={ImageURLs.letterIcon} />  Contact Us</span>
            </a>
            <br/><br/>
            <span>Build Id: {Constants.BuildID}</span>
          </div>

        </div>

      </aside>
    );
}

export default React.memo(LoginSidebar);
