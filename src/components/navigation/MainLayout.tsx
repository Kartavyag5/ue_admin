import Content from "./Content";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "./header.module.css";
import nextConfig from "../../../next.config";
import Login from "../../pages/authentication/login";
// import { getDetail } from "../../services/cognito";
// import { getRoleAuthorizedPages } from "./SidebarData";
interface props {
  breakpoint: any;
  children?: any;
  sidebarData: any;
  getNavItem: any;
  isLoggedIn: boolean;
}

const MainLayout = (props: props) => {

  // const [sidebarData, setSidebarData] = useState<Array<any>>([])

  // const getRole = (roles) => {
  //   if (roles["SUPER_ADMIN"]) return "SUPER_ADMIN";
  //   else if (roles["UE_CORP_ADMIN"]) return "UE_CORP_ADMIN";
  //   else if (roles["ORGANIZATION_ADMIN"]) return "ORGANIZATION_ADMIN";
  //   else if (roles["COMMUNITY_ADMIN"]) return "COMMUNITY_ADMIN";
  //   else if (roles["GAME_HOST"]) return "GAME_HOST";
  //   else if (roles["FAMILY_OR_FRIEND"]) return "FAMILY_OR_FRIEND";
  //   else if (roles["RESIDENT"]) return "RESIDENT";
  // };

  // const getNavItem = async () => {
  //   // TODO: Change Approcah here
  //   let res = await getDetail();
  //   localStorage.setItem("permissionToken", res.permission_token);
  //   let role = getRole(res.role);
  //   // setSidebarData(getRoleAuthorizedPages(role))
  // };

  // useEffect(() => {
  //   (async() => {
  //     // TODO: Change approcah here
  //     if(localStorage.getItem("spin_topia_login_success") === "yes") {
  //       let res = await getDetail();
  //       localStorage.setItem("permissionToken", res.permission_token);
  //       let role=getRole(res.role);
  //       setSidebarData(getRoleAuthorizedPages(role));
  //     }
  //   })();
  // }, [])

  return (
    <main className="cr-app" style={{ height: "100vh" }}>
      {/* by default if user not logged in redirect to login */}

      {/* {typeof window !== 'undefined'  && !localStorage.getItem('spin_topia_login_success') && ![`${nextConfig.basePath}/authentication/reset-password`,  `${nextConfig.basePath}/authentication/forgot-password`].includes(window.location.pathname) &&
          <Login  />
        } */}

      {/* single layout page setup for login reset password and forgot password  */}

      {typeof window !== "undefined" &&
      !props.isLoggedIn &&
      ![
        `${nextConfig.basePath}/authentication/reset-password`,
        `${nextConfig.basePath}/authentication/forgot-password`,
      ].includes(window.location.pathname) ? (
        <Login getDetail={props.getNavItem} />
      ) : typeof window !== "undefined" &&
        [
          `${nextConfig.basePath}/authentication/reset-password`,
          `${nextConfig.basePath}/authentication/login`,
          `${nextConfig.basePath}/authentication/forgot-password`,
        ].includes(window.location.pathname) ? (
        <div> {props.children}</div>
      ) : (
        typeof window !== "undefined" &&
        props.isLoggedIn && (
          <div>
            <Header isLogoutButton={true} isHelpButton={true} />
            <hr className={styles.seperating_line} />

            <Sidebar sidebarData={props.sidebarData} {...props} />
            <Content fluid>
              <div className="main-content">{props.children}</div>
            </Content>
          </div>
        )
      )}
    </main>
  );
};

export default React.memo(MainLayout);
