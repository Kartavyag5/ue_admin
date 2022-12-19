import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import AddPlan from "../../../../components/adminstrative-data/addplan";
import FormControl from "../../../../components/form-control/FormControl";
import ErrorPopup from "../../../../components/popup/ErrorPopup";
import FullScreenPopup from "../../../../components/popup/FullScreenPopup";
import Constants from "../../../../lib/Constants";
import { addEditPricingPlanData, getPricingPlanList } from "../../../../services/adminDataMaintenance";
import { getGameList } from "../../../../services/adminDataMaintenance";

interface gamesListReqBody {
  page_number?: number;
  limit?: number;
  last_id?: number;
  name?: string;
  game_ids?: Array<number>;
}

const PricingPlanForm = (props) => {

  const router = useRouter();
  const { planId } = router.query;
  let heading = (typeof planId !== "undefined" ? "View/Edit" : "Add ") + " Plan";

  const totalEntries = useRef(0);
  const gameSearchText = useRef("");

  const [isApiLoaded, setIsApiLoaded] = React.useState(false)
  const [gamesList, setGamesList] = useState([]);
  const [defaultFormDataForEdit, setDefaultFormDataForEdit] = useState([])
  const [dataChange, setDataChange] = useState(false)

  const [openPopup, setOpenPopup] = useState({
    state: false,
    message: undefined, // TODO: Important
    subMessage: "",
  });
  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
    alertType:1
  });
 

  useEffect(() => {
    (async () => {
      const gamesListRes = await getGamesData({
        // limit: Constants.filterDropDownLimit, // TODO: removed limit, pagenumber for MS2 
      });
      totalEntries.current = gamesListRes.total_count;
      setGamesList(gamesListRes.game_list);
      let planId = router.query.planId
      typeof planId !== "undefined" && await getPlanDetailForId()
      setIsApiLoaded(true)

    })();
    // let planId = router.query.planId
    // typeof planId !== "undefined" && getPlanDetailForId()
  }, []);



  // api call to get plan details on id
  const getPlanDetailForId = async () => {
    try {
      let reqData: planlistPayload = {
        pricing_plan_ids: planId,
        limit: 1
      }
      const planResList = await getPricingPlanList({ reqData })
      setDefaultFormDataForEdit(planResList.pricing_plan_list[0])
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message, alertType:1 });
    }
  }

  const isFormDirty = (isChange) => { 
    if(isChange !== dataChange) setDataChange(isChange) // checking if form field has changed
   }
 
  const handlePopupConfirm = () => {
    router.back();
  };

  const handleCancel = () => {
    if(dataChange){
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
      router.back()
  } 

  const handleFormSubmit = async (formData) => {

    let missingFields = [];
    for (let [key, value] of Object.entries(formData)) {
      if (typeof value === 'undefined' || value === '') {
        missingFields.push(key)
      }
    }
    if (missingFields.length > 0) {
      const {
        MandatoryFieldAlertMsgData: { errorMessageOne, errorMessageTwo },
      } = Constants;
      setOpenPopup({ ...openPopup, state: true, message: missingFields, subMessage: missingFields.length === 1 ? errorMessageOne : errorMessageTwo })
      return false;
    }
    try {
      const reqData = {
        ...formData,
        game_id: formData.game.value,
        xtra_hosted_games: formData.extra_hosted_games
      };
      if (planId) reqData.pricing_plan_id = planId; // Pass plan id only for edit mode

      await addEditPricingPlanData({
        reqData,
        actionType: planId ? "EDIT" : "ADD",
      });
      router.back();
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message, alertType:1 });
    }
  };

  const getGamesData = async (reqData: gamesListReqBody) => {
    try {
      if(reqData.name === "") delete reqData.name
      const gamesListRes = await getGameList({ reqData });
      return gamesListRes;
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message, alertType:1 });
    }
  };

  const handleGameSearch = async (searchString) => {
    try {
      gameSearchText.current = searchString
      const gamesListRes = await getGamesData({ name: gameSearchText.current });
      setGamesList([...gamesListRes.game_list]);
      if(gamesListRes.total_count) totalEntries.current = gamesListRes.total_count;
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message, alertType:1 });

    }
  };

  const handleGameScroll = async () => {
    // try {                                             // TODO: Lazy loading removed
    //   if (totalEntries.current > gamesList.length) {
    //     const gamesListRes = await getGamesData({
    //       // limit: Constants.filterDropDownLimit, // TODO: removed limit, last id for MS2 
    //     });
    //     setGamesList([...gamesList,...gamesListRes.game_list]);
    //   }
    // } catch (err) {
    //   console.error(err);
    //   setErrorData({ state: true, message: err.message });

    // }
  };

  let gameOptionList = gamesList.map(({ game_name, game_id }) => {
    return { label: game_name, value: game_id };
  });

  const handleGameToggle = async (isOpen) => {
    const isOpening = !isOpen;
     if(isOpening &&  gameSearchText.current.length) {
      gameSearchText.current = "";
      const gamesListRes = await getGamesData({
        name: gameSearchText.current,
      });
      setGamesList([...gamesListRes.game_list]);
      if(gamesListRes.total_count) totalEntries.current = gamesListRes.total_count;
    }
  }


  const deletePlan = async () => { //delete functionality
    try{
      let reqData = {
         pricing_plan_id:planId,
         status:5
      }
      await addEditPricingPlanData({
        reqData,
        actionType: planId ? "EDIT" : "ADD",
      });
      router.back()
    }
    catch(err) {
        console.error(err);
        setErrorData({ state: true, message: err.message, alertType:1 })
    }
  }

  const handleDelete = () => { // show alert popup onclick of delete
    setErrorData({ state: true, message: Constants.deleteAlertMsg.message, alertType:4 });   
  }

  return (
    <div className={`container`}>
      <FormControl
        heading={heading}
        showBackButton={true}
        handleBackButton={handleCancel}
      />

      <div className={`row`}>
        {isApiLoaded &&

          <AddPlan
            defaultData={defaultFormDataForEdit}
            options={gameOptionList}
            handleGameScroll={handleGameScroll}
            handleGameSearch={handleGameSearch}
            handleFormData={handleFormSubmit}
            handleCancel={handleCancel}
            handleGameToggle={handleGameToggle}
            isFormDirty={isFormDirty}
            handleDelete={handleDelete}
          />
        }
      </div>
      {openPopup.state && (
        <FullScreenPopup
          bodyText={openPopup.message}
          subText={openPopup.subMessage}
          onCancel={() => setOpenPopup({ ...openPopup, state: false })}
          onConfirm={() => handlePopupConfirm()}
          cancelBtnText={typeof openPopup.message === "string" ? "No" : "Okay"}
          confirmBtn={typeof openPopup.message === "string" ? true : false} //dont show confirm btn for mandatory field check
        />
      )}
      {errorData.state && (
         <ErrorPopup
         toggle={() => setErrorData({ state: false, message: "", alertType:1 })}
         bodyText={errorData.message}
         headerText={errorData.alertType === 4 ? "Alert" : "Error"}
         handleDeleteRecord={deletePlan}
         cancelBtn = {errorData.alertType === 4 && true}
         alertType = {errorData.alertType}
         confirmBtnText ={errorData.alertType === 4 && "Yes"}
       />
      )}
    </div>
  );
};

export default React.memo(PricingPlanForm);
