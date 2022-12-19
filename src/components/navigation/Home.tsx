import React, { useEffect, useState } from "react";
import MainLayout from "./MainLayout";
import Sidebar from "./Sidebar";
import { getDetail } from "../../services/cognito";
import { getRoleAuthorizedPages } from "./SidebarData";
import { RoleProvider } from "../../context/roleContext";
import { Cookies } from "react-cookie";
import ErrorPopup from "../popup/ErrorPopup";

export default function Home({ Component, props }) {

  const getCookieValue = ({ cookieKey }) => {
    const cookieInstance = new Cookies();
    return cookieInstance.get(cookieKey);
  };

  let accessToken = getCookieValue({ cookieKey: "accesstoken" });

  const [sidebarData, setSidebarData] = useState<Array<any>>([]);
  const [roleDetails, setRoleDetails] = useState<any>({}); // TODO: Change to ref and avoid unwanted rerenders
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(accessToken ? true : false);
  const [error, setError] = React.useState(false);
  const [popupText, setPopupText] = React.useState('')

  const getRole = (roles) => {
    if (roles["SUPER_ADMIN"]) return "SUPER_ADMIN";
    else if (roles["UE_CORP_ADMIN"]) return "UE_CORP_ADMIN";
    else if (roles["ORGANIZATION_ADMIN"]) return "ORGANIZATION_ADMIN";
    else if (roles["COMMUNITY_ADMIN"]) return "COMMUNITY_ADMIN";
    else if (roles["GAME_HOST"]) return "GAME_HOST";
    else if (roles["FAMILY_OR_FRIEND"]) return "FAMILY_OR_FRIEND";
    else if (roles["RESIDENT"]) return "RESIDENT";
  };

  

  const getNavItem = async () => {
    // TODO: Change approcah here
    accessToken = getCookieValue({ cookieKey: "accesstoken" });
    try{
      if (accessToken) {        
        let res = await getDetail();
        setIsLoggedIn(true);
        setRoleDetails(res.role);
        let topRole = getRole(res.role);
        setSidebarData(getRoleAuthorizedPages(topRole));
    } else {
      setIsLoggedIn(false);
    }  
  }
  catch(err){
    setError(true)
    setPopupText(err.message)
  }
  };

  useEffect(() => {
    getNavItem();
  }, []);

  return (
    <RoleProvider value={roleDetails}>
      <MainLayout
        {...props}
        sidebarData={sidebarData}
        getNavItem={getNavItem}
        isLoggedIn={isLoggedIn}
      >
        <Component {...props} />
        {error && (
          <ErrorPopup
            toggle={() => setError(false)}
            bodyText={popupText}
            headerText={"Login Error"}
          />
        )}
      </MainLayout>
    </RoleProvider>
  );
}
