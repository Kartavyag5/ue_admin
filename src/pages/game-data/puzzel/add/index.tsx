import router, { useRouter }  from "next/router";
import React, { useRef, useState } from "react";
import FormControl from "../../../../components/form-control/FormControl";
import AddPuzzle from "../../../../components/game-data/addpuzzle";
import FullScreenPopup from "../../../../components/popup/FullScreenPopup";
import { getGameList } from "../../../../services/licenseService";
import { remove_duplicates_from_list } from "../../../../helper/removeDuplicates";
import { gameLevelList, puzzleAdd, puzzlecategoryList, puzzleEdit, puzzleList } from "../../../../services/gameDataMaintanance";
import ErrorPopup from "../../../../components/popup/ErrorPopup";
import Constants from "../../../../lib/Constants";

const Index = () => {
  const router = useRouter();

  let heading =  'Add Spintopia Puzzle';

  const [openPopup, setOpenPopup] = useState <popup>(
    {
      state:false, 
      message: '', 
      subMessage: ''
    });

  const [errorData, setErrorData] = useState({
      state: false,
      message: "",
    });    

  const [data, setData] = useState({ });
  const [gameData, setGameData] = useState([])
  const [puzzleCategoryData, setPuzzleCategoryData] = useState([])
  const [gameLevelData, setGameLevelData] = useState([])
  const [dataChange, setDataChange] = useState(false)


  let totalGame = useRef(0);
  let totalcategory = useRef(0);
  let gameSearchText = useRef("");
  let selectedGameId = useRef(0);
  let categorySearchText = useRef("");
  let levelSearchText = useRef("");

  React.useEffect(() => {
    getGameOptions();
    getGameLevelOptions();
  }, [])

  //api call to get game list
  const getGameOptions = async () => { 
      
    try {
      let reqData:gameListPayload = {
        // limit:Constants.filterDropDownLimit, // TODO: removed limit for MS2
        };
      if(gameSearchText.current !== "")  reqData.game_name = gameSearchText.current;
      const res = await getGameList({ reqData }); 
      setGameData([...res.game_list]);
      if (typeof res.total_count !== 'undefined') totalGame.current = res.total_count
      } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
  }
  
  //api call to fetch puzzle category 
  const getPuzzleCategoryOptions = async ({gameIds = 0}) => {
    try {
      let reqData:puzzleCategoryPayload = { 
        // limit: Constants.filterDropDownLimit, // TODO: removed limit for MS2
      };
      if(gameIds !== 0) reqData.game_ids = selectedGameId.current;
      if(categorySearchText.current !== "") reqData.category_name = categorySearchText.current;
      const res = await puzzlecategoryList({ reqData });
      setPuzzleCategoryData([...res.puzzle_category_list]);
        if (typeof res.total_count !== 'undefined') totalcategory.current = res.total_count
      
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
  };

  //api call to fetch puzzle category 
  const getGameLevelOptions = async () => {
    try {
      let reqData:gameLevelPayload = { };
      if(levelSearchText.current !== "") reqData.game_level_name = levelSearchText.current;
      const res = await gameLevelList({ reqData })
      setGameLevelData(res);       
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
  };


  let gameOptionList = gameData.map((option)=> {
    return { label: option.game_name, value: option.game_id };
  })

  let categoryOptionList = puzzleCategoryData.map((option)=> {
    return { label: option.category_name, value: option.puzzle_category_id };
  })

  let gameLevelOptionList = gameLevelData.map((option)=> {
    return { label: option.game_level_name, value: option.game_level };
  })

  const handleGameSearch = (value) => {
    gameSearchText.current = value;
    getGameOptions()
  }

  const handleGameScroll = () => {
    // if(totalGame.current > gameData.length)  getGameOptions() //TODO : Lazy loading removed
  }

  const handleGameChange = (game) => {
    selectedGameId.current = game.value;
    getPuzzleCategoryOptions({gameIds:selectedGameId.current})
  }


  const handleGameToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening &&  gameSearchText.current.length) {
      gameSearchText.current = "";
      getGameOptions()
    }
  }

  const handleCategoryScroll = () => {
    // if(totalcategory.current > puzzleCategoryData.length) getPuzzleCategoryOptions({}) //TODO : Lazy loading removed
  
  }

  const handleCategorySearch = (value) => {
    categorySearchText.current = value;
    getPuzzleCategoryOptions({gameIds:selectedGameId.current})
  }

  const handleCategoryToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening &&  categorySearchText.current.length) {
      categorySearchText.current = "";
      getPuzzleCategoryOptions({gameIds:selectedGameId.current})
    }
  }

  const handleLevelSearch = (value) => {
    levelSearchText.current = value;
    getGameLevelOptions();
  }

  const handleLevelToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening &&  levelSearchText.current.length) {
      levelSearchText.current = "";
      getGameLevelOptions();
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
  }

  const handlePopupConfirm = () => {
    router.back()
  }

  //submit form data
  const handleFormData = async (data) => { 
  
      //checking mandatory fields
      let message1 = [];
  

      if(typeof data.game_id === "undefined" || data.game_id=== '')  message1.push('Game');  
      if(typeof data.category_id === "undefined" || data.category_id === '')  message1.push('Category'); 
      if(typeof data.game_level === "undefined" || data.game_level=== '')  message1.push('Game Level');  
      if(data.words.length === 0 || data.words[0].word === "") message1.push(`word one`) // making word one as mandatory

      if(message1.length > 0) {
        const {
          MandatoryFieldAlertMsgData: {errorMessageOne, errorMessageTwo },
        } = Constants; 
        setOpenPopup({...openPopup, state:true, message:message1, subMessage: message1.length === 1 ? errorMessageOne : errorMessageTwo })
        return false;
      }
  
      try {
        let reqData = {
          puzzle_category_id: (typeof data.category_id !== 'undefined') ? data.category_id.value  : 1,
          game_level: (typeof data.game_level !== 'undefined') ? data.game_level.value : '',
          words: (typeof data.words !== 'undefined') ? JSON.stringify(data.words) : '',
        }      
        
        let response = await puzzleAdd({ reqData });
        router.back()
      } catch (err) {
        // setErrorMessage(err.message); 
        setErrorData({ state: true, message: err.message });

        console.error(err);
      }
  }

  
  return (
    <div className={`container`}>
      <FormControl  heading={heading} showBackButton={true} handleBackButton={handleCancel} />

      <div className={`row`}>
        <AddPuzzle 
            editData={data}
            handleFormData={handleFormData} 
            handleCancel={handleCancel}
            handleGameScroll={handleGameScroll}
            handleGameSearch ={handleGameSearch}
            handleGameToggle = {handleGameToggle}
            gameOptionList = { gameOptionList }
            onGameChange = {handleGameChange}
            handleCategoryScroll={handleCategoryScroll}
            handleCategoryToggle={handleCategoryToggle}
            handleCategorySearch={handleCategorySearch}
            categoryOptionList = { categoryOptionList }
            gameLevelOptionList= { gameLevelOptionList }
            handleLevelSearch={handleLevelSearch}
            handleLevelToggle={ handleLevelToggle}
            isFormDirty={isFormDirty}

        />
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
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={"Error"}
        />
      )}  

    </div>
  )

}

export default React.memo(Index);