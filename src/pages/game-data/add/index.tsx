import router, { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import FormControl from "../../../components/form-control/FormControl";
import AddCategory from "../../../components/game-data/addcategory";
import { remove_duplicates_from_list } from "../../../helper/removeDuplicates";
import { puzzleAddCategory, puzzlecategoryList, puzzleEditCategory } from "../../../services/gameDataMaintanance";
import { getGameList } from "../../../services/licenseService";
import FullScreenPopup from "../../../components/popup/FullScreenPopup";
import Constants from "../../../lib/Constants";
import ErrorPopup from "../../../components/popup/ErrorPopup";

const PuzzleAddEdit = () => {

  const router = useRouter();

  const puzzleCategoryId = router.query.puzzleCategoryId;
  const [dataChange, setDataChange] = useState(false)


  const [openPopup, setOpenPopup] = useState <popup>(
    {
      state:false, 
      message: '', 
      subMessage: ''
    });

  const [errorData, setErrorData] = useState<errorData>({
      state: false,
      message: "",
      alertType:1
    });    

  const [isApiLoaded, setIsApiLoaded] = useState(false)
  const [data, setData] = useState({ });

  const [gameData, setGameData] = useState([])

  let heading = (typeof puzzleCategoryId !== 'undefined' ? 'View/Edit' : 'Add ') +' Puzzle Category';
  let totalGame = useRef(0)
  let gameSearchText = useRef("");

  React.useEffect(() => {
    (async() => {
      await Promise.all([  
          getGameOptions(),
          typeof puzzleCategoryId !== 'undefined' && await getPuzzlecategoryDetailForId(puzzleCategoryId)
      ]) 
      setIsApiLoaded(true)
    })()
  }, [])

  //api call to get game list
  const getGameOptions = async () => { 
      
    try {
      let reqData:gameListPayload = {
        // limit:Constants.filterDropDownLimit, // TODO: removed limit for MS2
      };  
      if(gameSearchText.current !== "") reqData.game_name = gameSearchText.current; 
      const res = await getGameList({ reqData }); 
      setGameData([...res.game_list]);
      if (typeof res.total_count !== 'undefined') totalGame.current = res.total_count
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  } 

  const getPuzzlecategoryDetailForId = async (id) => {

    try {
      let reqData:puzzleCategoryPayload = {puzzle_category_ids:id, limit:1}; //puzzle_category_id
      
      const res = await puzzlecategoryList({ reqData });  
      setData({...data, ...res.puzzle_category_list[0]});      
    } catch (err) {
      console.error(err.message);
      setErrorData({ state: true, message: err.message });

    }

  } 

  let gameOptionList = gameData.map((option)=> {
    return { label: option.game_name, value: option.game_id };
  })

  const handleGameSearch = (value) => {
    gameSearchText.current = value;
    getGameOptions()
  }

  const handleGameScroll = () => {
    if (totalGame.current > gameData.length)  getGameOptions()
  }

  const handleGameToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening &&  gameSearchText.current.length) {
      gameSearchText.current = "";
      getGameOptions()
    }
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
      router.back()
  }  


  const handlePopupConfirm = () => {
    router.back()
  }

  //submit form data
  const handleFormData = async (data) => { 

    //checking mandatory fields
    let message1 = [];

    for(let [key,value]  of Object.entries(data))  {   
      if(typeof value === 'undefined' || value === '') 
      {
        message1.push(key)
      } 
    }

    if(message1.length > 0) {
      const {
        MandatoryFieldAlertMsgData: {errorMessageOne, errorMessageTwo },
      } = Constants; 
      setOpenPopup({...openPopup, state:true, message:message1, subMessage: message1.length === 1 ? errorMessageOne : errorMessageTwo })
      return false;
    }

    try {
      let reqData = {
        puzzle_category_id: (typeof puzzleCategoryId !== 'undefined') ? puzzleCategoryId : '',
        category_name: (typeof data.category_name !== 'undefined') ? data.category_name : '',
        category_description:  (typeof data.category_description !== 'undefined') ? (data.category_description) : '',
        game_id: (typeof data.game !== 'undefined') ? data.game.value : '',
        status: (typeof data.status !== 'undefined') ? data.status : '',
      }                
      if(typeof puzzleCategoryId !== 'undefined') {
        let response = await puzzleEditCategory({ reqData });
      } else {
        delete reqData.puzzle_category_id;
        let response = await puzzleAddCategory({ reqData });
      }
      router.back()
    } catch (err) {
      // setErrorMessage(err.message);
      setErrorData({ state: true, message: err.message });
      console.log(err);
    }
  }

  const deletePuzzleCategory = async () => { //delete functionality
    try{
      let reqData = {
        puzzle_category_id:puzzleCategoryId,
        status:5
      }
      await puzzleEditCategory({ reqData });
      router.back()
    }
    catch(err) {
        console.error(err);
        setErrorData({ state: true, message: err.message })
    }
  }

  const handleDelete = () => { // show alert popup onclick of delete
    setErrorData({ state: true, message: Constants.deleteAlertMsg.message, alertType:4 });   
  }



  return (
    <div className={`container`}>
      <FormControl  heading={heading} showBackButton={true} handleBackButton={handleCancel} />

      <div className={`row`}>
        {isApiLoaded &&
            <AddCategory
              editData={data}
              handleFormData={handleFormData} 
              handleCancel={handleCancel}
              handleDelete={handleDelete}
              handleGameScroll={handleGameScroll}
              handleGameSearch ={handleGameSearch}
              gameOptionList = { gameOptionList }
              handleGameToggle={handleGameToggle}
              isFormDirty={isFormDirty}   
            />
        }
        </div>

        {openPopup.state && 
          <FullScreenPopup
            bodyText={openPopup.message} 
            subText ={openPopup.subMessage}
            onCancel={()=> setOpenPopup({...openPopup, state:false})}
            onConfirm={()=> handlePopupConfirm()}
            cancelBtnText ={typeof openPopup.message === 'string' ? 'No' : 'Okay'}
            confirmBtn = {typeof openPopup.message === 'string' ? true : false} //dont show confirm btn for mandatory field check
          />
        }
         {errorData.state && (
       <ErrorPopup
       toggle={() => setErrorData({ state: false, message: "", alertType:1 })}
       bodyText={errorData.message}
       headerText={errorData.alertType === 4 ? "Alert" : "Error"}
       handleDeleteRecord={deletePuzzleCategory}
       cancelBtn = {errorData.alertType === 4 && true}
       alertType = {errorData.alertType}
       confirmBtnText ={errorData.alertType === 4 && "Yes"}
     />
      )}

    </div>
  )

}

export default PuzzleAddEdit;