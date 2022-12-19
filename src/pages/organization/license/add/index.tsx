import router, { useRouter } from "next/router";
import React, { useState, useRef, useContext } from "react";
import FormControl from "../../../../components/form-control/FormControl";
import LicencesForm from "../../../../components/licence/licencesForm";
import { addLicense, editLicense, getOrgCommPayList, getPricingPlanList, licenseList } from "../../../../services/licenseService";
import FullScreenPopup from "../../../../components/popup/FullScreenPopup";
import { getCommunityList } from "../../../../services/communityService";
import { getGameList } from "../../../../services/licenseService";
import Constants from "../../../../lib/Constants";
import ErrorPopup from "../../../../components/popup/ErrorPopup";
import { getGMTTimeStamp } from "../../../../helper/dateTime";
import { RoleContext } from "../../../../context/roleContext";
import { getTopUserRole } from "../../../../helper/roles";

const LicenseAddForm = () => {
  const router = useRouter();

  const roleDetails = useContext(RoleContext);


  const licenseId = router.query.licenseId;
  const communityId = router.query.communityId;
  const communityName = router.query.communityName;
  let heading = (typeof licenseId !== 'undefined' ? 'Edit/view' : 'Add') + ' license';


  const [openPopup, setOpenPopup] = useState<popup>(
    {
      state: false,
      message: '',
      subMessage: ''
    });
  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });

  const [isApiLoaded, setIsApiLoaded] = useState(false)
  const [data, setData] = useState({ community_name: communityName, community_id: communityId });

  const [communityList, setcommunityList] = useState([])
  const [gameList, setGameList] = useState([])
  const [planList, setPlanList] = useState([])
  const [orgCommPayList, setOrgCommPayList] = useState([])
  const [dataChange, setDataChange] = useState(false)



  let totalCommunity = useRef(0);
  let totalGame = useRef(0);
  let totalplan = useRef(0);
  let commSearchText = useRef("");
  let gameSearchText = useRef("");
  let planSearchText = useRef("");

  let allowEditLicense = useRef(false)


  React.useEffect(() => {
    if(getTopUserRole(roleDetails))  {
    if (Constants.rolePermissions.rolesNotAllowedToAddOrEditLicense.includes(getTopUserRole(roleDetails))) allowEditLicense.current = true;
    (async () => {
      await Promise.all([
        getCommunityOptions(),
        getGameOptions(),
        !(Constants.rolePermissions.rolesNotAllowedToAddOrEditLicense.includes(getTopUserRole(roleDetails))) && getPlanOptions(),
        getOrgCommunityPayOptions(),
      ])
      if (typeof licenseId !== 'undefined')
        await getlicenseDetailForId(licenseId);
        setIsApiLoaded(true)
    })();}
  }, [getTopUserRole(roleDetails)])



  //api call to get community list
  const getCommunityOptions = async () => {
    try {
      let reqData: communityReqheaders = {
        // organization_id:router.query.organizationId,
        // limit:Constants.filterDropDownLimit,   // TODO: removed limit for MS2 
        query_type: Constants.queryType.dropDown   
      };
      if (router.query.organizationId) reqData.organization_id = router.query.organizationId;
      if (commSearchText.current !== "") reqData.community_name = commSearchText.current;
      const res = await getCommunityList({ reqData });
      setcommunityList([...res.community_list]);
      if (typeof res.total_count !== 'undefined') totalCommunity.current = res.total_count;
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  //api call to get game list
  const getGameOptions = async () => {
    try {
      let reqData: gameListPayload = {
        // limit:Constants.filterDropDownLimit,  // TODO: removed limit for MS2 
      };
      if (gameSearchText.current !== "") reqData.game_name = gameSearchText.current;
      const res = await getGameList({ reqData });
      setGameList([...res.game_list]);
      if (typeof res.total_count !== 'undefined') totalGame.current = res.total_count;
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  //api call to get plan list
  const getPlanOptions = async () => {
    try {
      let reqData: planlistPayload = {
        // limit:Constants.filterDropDownLimit,  // TODO: removed limit for MS2 
      };
      if (planSearchText.current !== "") reqData.plan_name = planSearchText.current;
      const res = await getPricingPlanList({ reqData });
      setPlanList([...res.pricing_plan_list]);
      if (typeof res.total_count !== 'undefined') totalplan.current = res.total_count;
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  //api call to get plan list
  const getOrgCommunityPayOptions = async () => {
    try {
      let reqData = {};
      const res = await getOrgCommPayList({ reqData });
      setOrgCommPayList(res.org_comm_pay_list);
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  // get license detail for id
  const getlicenseDetailForId = async (id) => {
    try {
      let reqData: licenseListPayload = { limit: 1, license_ids: [id], list_type: Constants.userListType.table };

      const res = await licenseList({ reqData });
      setData({ ...data, ...res.license_list[0] });
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }



  let communityOptionList = communityList.map(function (option) {
    return { label: option.community_name, value: option.community_id };
  })

  let gameOptionList = gameList.map((option) => {
    return { label: option.game_name, value: option.game_id };
  })

  let planOptionList = planList.map((option) => {
    return { label: option.plan_name, value: option.pricing_plan_id };
  })

  let orgComPayOptionList = orgCommPayList.map((option) => {
    return { label: option.org_comm_pay_name, value: option.org_comm_pay_id };
  })


  const handleCommunityScroll = () => {
    // if (totalCommunity.current > communityList.length) getCommunityOptions() // TODO: Lazy loading removed
  }
  const handleCommunitySearch = (value) => {
    commSearchText.current = value;
    getCommunityOptions()
  }

  const handleCommunityToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening && commSearchText.current.length) {
      commSearchText.current = "";
      getCommunityOptions()
    }
  }

  const handleGameSearch = (value) => {
    gameSearchText.current = value;
    getGameOptions()
  }

  const handleGameScroll = () => {
    // if (totalGame.current > gameList.length) getGameOptions() // TODO: Lazy loading removed
  }

  const handleGameToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening && gameSearchText.current.length) {
      gameSearchText.current = "";
      getGameOptions()
    }
  }

  const handlePlanSearch = (value) => {
    planSearchText.current = value;
    getPlanOptions()
  }

  const handlePlanScroll = () => {
    // if (totalplan.current > planList.length) getPlanOptions(); // TODO: Lazy loading removed
  }

  const handlePlanToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening && planSearchText.current.length) {
      planSearchText.current = "";
      getPlanOptions()
    }
  }

  const isFormDirty = (isChange) => {
    if (isChange !== dataChange) setDataChange(isChange) // checking if form field has changed
  }

  const handleCancel = () => {
    if (dataChange) {
      const {
        SaveFormAlertMsgData: { message, subMessage },
      } = Constants;
      setOpenPopup({
        state: true,
        message,
        subMessage,
      });
    }
    else
      router.back();
  };

  const handlePopupConfirm = () => {
    router.back();
  }


  //submit form data
  const handleFormData = async (data) => {


    //checking mandatory fields
    let mandatoryFieldMsg = [];

    Object.entries(data).forEach(([key, value], index) => {
      if ((typeof value === 'undefined' || value === '') && index !== 6) {
        mandatoryFieldMsg.push(key)
      }
    });

    if (mandatoryFieldMsg.length > 0) {
      const {
        MandatoryFieldAlertMsgData: { errorMessageOne, errorMessageTwo },
      } = Constants;
      setOpenPopup({ ...openPopup, state: true, message: mandatoryFieldMsg, subMessage: mandatoryFieldMsg.length === 1 ? errorMessageOne : errorMessageTwo })
      return false;
    }

    try {
      let response;

      let reqData = {
        license_id: (typeof licenseId !== 'undefined') ? licenseId : '',
        community_id: (data.community) ? data.community.value : '',
        game_id: (data.game_licensed) ? data.game_licensed.value : '',
        pricing_plan_id: (data.game_pricing_plan) ? (data.game_pricing_plan.value) : '',
        effective_date: (data.effective_date) ? getGMTTimeStamp({ date: data.effective_date }) : '',
        expire_date: (data.expire_date) ? getGMTTimeStamp({ date: data.expire_date }) : 0,
        renewal_as_of_date: (data.renewal__date) ? getGMTTimeStamp({ date: data.renewal__date }) : '',
        org_community_pay: (data.organization_community_pay) ? (data.organization_community_pay.value) : ''
      }

      // if(!data.expire_date) delete reqData.expire_date

      if (licenseId) {
        response = await editLicense({ reqData });
      } else {
        delete reqData.license_id;
        response = await addLicense({ reqData });
      }
      router.back()
    } catch (err) {
      // setErrorMessage(err.message); 
      setErrorData({ state: true, message: err.message });
      console.error(err);
    }
  }


  return (
    <div className={`container`}>
      <FormControl heading={heading} showBackButton={true} handleBackButton={handleCancel} />
      <div className={`row`}>
        {/* Load form once all api call is done for edit form */}
        {isApiLoaded &&
          <LicencesForm
            editData={data}
            handleFormData={handleFormData}
            handleCancel={handleCancel}
            handleCommunityScroll={handleCommunityScroll}
            handleCommunitySearch={handleCommunitySearch}
            handleCommunityToggle={handleCommunityToggle}
            handleGameScroll={handleGameScroll}
            handleGameSearch={handleGameSearch}
            handleGameToggle={handleGameToggle}
            handlePlanScroll={handlePlanScroll}
            handlePlanSearch={handlePlanSearch}
            handlePlanToggle={handlePlanToggle}
            communityOptions={communityOptionList}
            gameOptionList={gameOptionList}
            planOptionList={planOptionList}
            orgComPayOptionList={orgComPayOptionList}
            isFormDirty={isFormDirty}
            allowEditLicense={allowEditLicense.current}

          />
        }
      </div>
      {openPopup.state &&
        <FullScreenPopup
          bodyText={openPopup.message}
          subText={openPopup.subMessage}
          onCancel={() => setOpenPopup({ ...openPopup, state: false })}
          onConfirm={() => handlePopupConfirm()}
          cancelBtnText={typeof openPopup.message === 'string' ? 'No' : 'Okay'}
          confirmBtn={typeof openPopup.message === 'string' ? true : false} //dont show confirm btn for mandatory field check
        />
      }
      {errorData.state && (
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={"Error"}
        />
      )}
    </div>
  )
}

export default React.memo(LicenseAddForm);