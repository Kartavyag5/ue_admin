import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AddGame from "../../../../components/adminstrative-data/addgame";
import FormControl from "../../../../components/form-control/FormControl";
import { addEditGameData, getGameList } from "../../../../services/adminDataMaintenance";
import FullScreenPopup from "../../../../components/popup/FullScreenPopup";
import Constants from "../../../../lib/Constants";
import ErrorPopup from "../../../../components/popup/ErrorPopup";

const GamesForm = () => {
  // Edit Mode decided based on gameId in queryParam  const router = useRouter();
  const router = useRouter();
  const { gameId, gameName, gameDescription } = router.query; // Only used in Edit mode
  const [isApiLoaded, setIsApiLoaded] = React.useState(false)
  const [defaultFormDataForEdit, setDefaultFormDataForEdit] = useState([])
  const [dataChange, setDataChange] = useState(false)

  const [openPopup, setOpenPopup] = useState<popup>({
    state: false,
    message: "",
    subMessage: "",
  });
  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });


  let heading = (gameId ?" View/Edit ": "Add ") + "Game";
  
  useEffect(() => {
    let gameId = router.query.gameId;
    if(typeof gameId !== "undefined"){
      getGamedetailForId()  
    } 
    else
      setIsApiLoaded(true)

  }, [])


  const getGamedetailForId = async() => {
    try{
     let reqData:gameListPayload = {
       game_ids:gameId,
       limit:1
     }
     const gameResList = await getGameList({reqData}) 
     setDefaultFormDataForEdit(gameResList.game_list[0])     
    }catch(err){
        console.error(err);
        setErrorData({ state: true, message: err.message });
    }
    setIsApiLoaded(true)
  }

  const isFormDirty = (isChange) => { 
    if(isChange !== dataChange) setDataChange(isChange) // checking if form field has changed
   }
 
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
       router.back();
   };
 
   const handlePopupConfirm = () => {
     router.back();
   }

  const handleFormSubmit = async (formData) => {    
    try {
      const reqData = {
        ...formData,
      };
      let missingFields = [];
  
      for(let [key,value]  of Object.entries(formData))  {   
        if(typeof value === 'undefined' || value === '') 
        {
          missingFields.push(key)
        } 
      }
      if(missingFields.length > 0) {
        const {
          MandatoryFieldAlertMsgData: {errorMessageOne, errorMessageTwo },
        } = Constants; 
        setOpenPopup({...openPopup, state:true, message: missingFields, subMessage: missingFields.length === 1 ? errorMessageOne : errorMessageTwo })
        return false;
      }

      if (gameId) reqData.game_id = gameId; // Pass game id only for edit mode
      await addEditGameData({ reqData, actionType: gameId ? "EDIT" : "ADD" });
      router.back();
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  return (
    <div className={`container`}>
      <FormControl
        heading={heading}
        showBackButton={true}
        handleBackButton={handleCancel}
      />
      <div className={`row`}>
        {isApiLoaded &&
        <AddGame
          defaultData={defaultFormDataForEdit}
          handleFormData={handleFormSubmit}
          handleCancel={handleCancel}
          isFormDirty={isFormDirty}

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
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={"Error"}
        />
      )}
    </div>
  );
};

export default React.memo(GamesForm);
