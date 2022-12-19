import { useRouter } from "next/router";
import React, {useEffect, useRef, useState } from "react";
import FormControl from "../../../../components/form-control/FormControl";
import AddSchedule from "../../../../components/game-schedule/addScheduleForm";
import ErrorPopup from "../../../../components/popup/ErrorPopup";
import FullScreenPopup from "../../../../components/popup/FullScreenPopup";
import ShowPlayerDetailPopup from "../../../../components/popup/showPlayerDetailPopup";
import Constants from "../../../../lib/Constants";
import { getGameList } from "../../../../services/adminDataMaintenance";
import { getCommunityList, geTimezoneList } from "../../../../services/communityService";
import { gameLevelList } from "../../../../services/gameDataMaintanance";
import { addOrEditSchedule, getCustomSpinnerSpace, getGameSchedules } from "../../../../services/gameSchedule";
import { getHostList, getUserList } from "../../../../services/personService";
import { getDetail} from "../../../../services/cognito";

const AddScheduleForm = () => {

  const router = useRouter();

  const { gameScheduleId, gameName, date, commName, allowToEdit, allowToView, isAdd, from, community_id, is_zoom_game } = router.query;
  let heading = (typeof gameScheduleId !== "undefined" && isAdd !== "true" ? 'Edit ' : 'Add ') + ' Game'
  let subHeading = `${gameName} - ${date} - ${commName}`
  let pageType = (typeof gameScheduleId !== "undefined" ? 'Edit' : 'Add')

  const [isPopupOpen, setPopupOpen] = React.useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false)
  const [CommunityListforFilter, setCommunityListforFilter] = useState([])
  const [gameforFilter, setGameforFilter] = useState([]);
  const [gameLevel, setGameLevel] = useState([]);
  const [customSpinnerList, setCustomSpinnerList] = useState([]);
  const [playerDataforFilter, setPlayerDataforFilter] = React.useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState({
    player1: 0,
    player2: 0,
    player3: 0,
    player4: 0
  })
  const [hostIdList, setHostIdList] = useState([]);
  const [hostId, setHostId] = useState<string>()
  const [defaultData, setDefaultData] = useState()
  const [timezoneList, setTimezoneList] = useState([])
  const [timezone, setTimezone] = useState()
  const [resetPlayerSelection, setResetPlayerSelection] = useState(false);
  const [dataChange, setDataChange] = useState(false)
  const [commId, setCommId] = useState(community_id ? +community_id : 0);
  const [isZoomGame, setIsZoomGame] = useState(is_zoom_game ? is_zoom_game : "2");
  const [resetHostSelection, setResetHostSelection] = useState(false);
  const [resetGameSelection, setResetGameSelection] = useState(false);
  const [hostCommId, setHostCommId] = useState<any>([]);
  const [link, setLink] = useState("");
  const [gameHostRoleId, setGameHostRoleId] = useState<any>();
  const handleHostCommunity = async() => {
    const res = await getDetail();
    setHostCommId(res)
    setGameHostRoleId(res.user_role[0].role_id);
  }

  const isGameHost = hostCommId?.role?.GAME_HOST;
  const isFamilyOrResident = hostCommId?.role?.RESIDENT || hostCommId?.role?.FAMILY_OR_FRIEND;
  const isGameHostRoleId = gameHostRoleId;


  const [openPopup, setOpenPopup] = useState<popup>({
    state: false,
    message: '',
    subMessage: ''
  });
  const [errorData, setErrorData] = useState<errorData>({
    state: false,
    message: "",
    headerText: "Error"
  });


  let totalGame = useRef(0);
  let totalPlayers = useRef(0);
  let totalHost = useRef(0)
  let totalCommunity = useRef(0);
  let commSearchText = useRef("");
  let gameSearchText = useRef("");
  let hostIdSearchText = useRef("");
  let playerSearchText = useRef("");
  let levelSearchText = useRef("");
  let initalRender = useRef(false);
  let saveAndContinue = useRef(false);
  let scheduleId = useRef();
  let isDirty = useRef(false);
  let isDataSaved = useRef(false);
  let communityId = useRef();

  useEffect(() => {
    handleHostCommunity()
  }, [])

  useEffect(() => {    
    (async () => {
      await Promise.all([
        getCommunityListForFilter(),
        getGameLevelOptions(),
        getCustomSpinnerList(),
        getTimezones({})
      ])
      let gameScheduleId = router.query.gameScheduleId
      if (typeof gameScheduleId !== 'undefined') {
        await getpersonListForFilter(),
        await getHostIdListForFilter(),
        await getScheduleDetailForId(),
        await getGameFilterList(),
        initalRender.current = true;
      }
      setIsApiLoaded(true);
    })();
  }, []);


  useEffect(() => {
    if(commId){
      getpersonListForFilter();
      getHostIdListForFilter();
      getGameFilterList();
    }
  },[commId])

  useEffect(() => {
    if(isZoomGame && commId){ //call host id api only when community id and is_zoom _game is set
      hostIdSearchText.current = ""; //empty search string while toggle of is_zoom_game
      getHostIdListForFilter();
    }
  },[isZoomGame])

  //api call to get community list
  const getCommunityListForFilter = async () => {
    try {
      let reqData: communityReqheaders = {
        // limit: Constants.filterDropDownLimit,  //TODO: limit removed for MS2
        query_type: Constants.queryType.detailView

      };
      if (commSearchText.current !== "") reqData.community_name = commSearchText.current;
      const res = await getCommunityList({ reqData });
      setCommunityListforFilter([...res.community_list]);
      if (typeof res.total_count !== "undefined") totalCommunity.current = res.total_count;
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  // api call to get game list
  const getGameFilterList = async () => {
    try {
      let reqData: gameListPayload = {
        // limit: Constants.filterDropDownLimit, // TODO : removed limit,last_id and page_number for default value fetch 
      };
      if (commId > 0) reqData.community_id = commId;

      if (gameSearchText.current !== "") reqData.game_name = gameSearchText.current;
      const res = await getGameList({ reqData });
      setGameforFilter([...res.game_list]);
      if (typeof res.total_count !== "undefined") totalGame.current = res.total_count;
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  //api call to get gameLevel list
  const getGameLevelOptions = async () => {
    try {
      let reqData: gameLevelPayload = {};
      if (levelSearchText.current !== "") reqData.game_level_name = levelSearchText.current;
      const res = await gameLevelList({ reqData });
      setGameLevel(res);
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  //api call to get host id list
  const getHostIdListForFilter = async () => {
    try {
      let reqData: hostListPayload = {
        community_id : commId,
        is_zoom_game : 2
      };

      if (hostIdSearchText.current !== "") reqData.host_list_query = hostIdSearchText.current;
      const res = await getHostList({ reqData });
      setHostIdList([...res.host_mail_list]);
      if (typeof res.total_count !== "undefined") totalHost.current = res.total_count;
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };


  //api call to get customSpinner list
  const getCustomSpinnerList = async () => {
    try {
      let reqData = {};
      const res = await getCustomSpinnerSpace({ reqData });
      setCustomSpinnerList(res.custome_spinner_space_list);
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };


  // api call to fetch person list for name filter
  const getpersonListForFilter = async () => {

    try {
      let reqData: userListPayload = {
        list_type: Constants.userListType.dropDown,
        // limit: Constants.filterDropDownLimit   // TODO : removed limit,last_id and page_number for default value fetch
        query_type: Constants.queryType.dropDown
      };
      if (playerSearchText.current !== "") reqData.name = playerSearchText.current;
      if (commId > 0) reqData.community_ids = commId;
      const res = await getUserList({ reqData });
      setPlayerDataforFilter([...res.user_list,{user_id:0, first_name:"None", last_name:""}])
      if (typeof res.total_count !== "undefined") totalPlayers.current = res.total_count;
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
  };

  //api call to get schedule list to fetch default data
  const getScheduleDetailForId = async () => {
    try {
      let reqData: gameSchedulePayload = {
        game_schedule_id: gameScheduleId,
        limit: 1,
        query_type: Constants.queryType.detailView
      }
      const res = await getGameSchedules({ reqData });
      setDefaultData(res.game_schedule_list[0])
      setLink(res.game_schedule_list[0]?.join_link)
      const players = res.game_schedule_list[0].players
      if (players?.length > 0)
        setSelectedPlayers({
          player1: players[0] && players[0].player_id,
          player2: players[1] && players[1].player_id,
          player3: players[2] && players[2].player_id,
          player4: players[3] && players[3].player_id
        })
      setHostId(res.game_schedule_list[0].host_id)
      handleTimezone(res.game_schedule_list[0])
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  const getTimezones = async ({ id = 0 }) => {
    try {
      let reqData: timezonePayload = {};
      if (id !== 0) reqData.timezone_id = id
      const res = await geTimezoneList({ reqData });
      setTimezoneList(res.timezone_list)

    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  const formattedCommunityOptionList = CommunityListforFilter.map(function (option) {
    return { label: option.community_name, value: option.community_id, timezoneId: option.time_zone_id };
  })

  const FormattedGameList = gameforFilter.map(({ game_id, game_name }) => {
    return { label: game_name, value: game_id };
  });

  const gameLevelOptionList = gameLevel.map(function (option) {
    return { label: option.game_level_name, value: option.game_level };
  });

  const playerOptionList = playerDataforFilter.map(function (option) {
    return {
      label: option.first_name + " " + option.last_name,
      value: option.user_id,
    };
  });

  const hostIdOptionList = hostIdList.map(function (option) {
    return {
      label: option.first_name + " " + option.last_name + "," + " " + option.email_id,
      value: option.user_id,
    };
  });

  const formattedCustomOptionList = customSpinnerList.map(function (option) {
    return { label: option.custom_spinner_space_name, value: option.custom_spinner_space };
  });

  const handleCommunityScroll = () => {
    // if (totalCommunity.current > CommunityListforFilter.length) getCommunityListForFilter() //TODO:Lazy loading removed
  };

  const handleCommunitySearch = (value) => {
    commSearchText.current = value;
    getCommunityListForFilter()
  };

  const handleCommunityChange = async (comm) => {
    (initalRender.current) ? initalRender.current = false : (setResetPlayerSelection(true), setResetHostSelection(true), setResetGameSelection(true));
    setCommId(comm.value)
    let reqData: timezonePayload = {};
    const { timezone_list: timeistData }: any = await geTimezoneList({ reqData });
    setTimezone(timeistData.find(item => item.timezone_id === (comm.timezone_id ? comm.timezone_id : comm.timezoneId)))
  }

  const handleTimezone = async (comm) => {
    let reqData: timezonePayload = {};
    const { timezone_list: timeistData }: any = await geTimezoneList({ reqData });
    setTimezone(timeistData.find(item => item.timezone_id === (comm.timezone_id ? comm.timezone_id : comm.timezoneId)))
  }

  const handleCommunityToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening && commSearchText.current.length) {
      commSearchText.current = "";
      getCommunityListForFilter()
    }
  }

  const handleGameScroll = () => {
    // if (totalGame.current > gameforFilter.length) getGameFilterList(); //TODO:Lazy loading removed
  };

  const handleGameSearch = (value) => {
    gameSearchText.current = value;
    if(commId) getGameFilterList();
  };

  const handleGameToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening && gameSearchText.current.length) {
      gameSearchText.current = "";
      if(commId) getGameFilterList();
    }
  }

  const handleLevelSearch = (value) => {
    levelSearchText.current = value;
    getGameLevelOptions();
  }

  const handleLevelToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening && levelSearchText.current.length) {
      levelSearchText.current = "";
      getGameLevelOptions();
    }
  }

  const handleHostIdScroll = () => {
    // if (totalHost.current > hostIdList.length) getHostIdListForFilter();  //TODO:Lazy loading removed
  };

  const handleHostIdSearch = (value) => {
    hostIdSearchText.current = value;
    if(commId) getHostIdListForFilter();
  };

  const handleHostChange = (value) => {  
    value ? setHostId(value.value) : setHostId("")
  }


  const handleJoinLink = (value) => {
    value ? setLink(value) : setLink("")
  }

  const handleHostIdToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening && hostIdSearchText.current.length) {
      hostIdSearchText.current = "";
      if(commId) getHostIdListForFilter();
    }
  }

  const handlePlayerScroll = () => {
    // if(totalPlayers.current > playerDataforFilter.length) getpersonListForFilter({}); //TODO:Lazy loading removed
  };

  const handlePlayerSearch = (value) => {
    playerSearchText.current = value;
   if(commId) getpersonListForFilter();

  }

  const handlePlayerToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening && playerSearchText.current.length) {
      playerSearchText.current = "";
      if(commId) getpersonListForFilter();

    }
  }

  const onSelectPlayer1 = (value) => {
    if (value)
      setSelectedPlayers({...selectedPlayers,player1: value.value})
  };

  const onSelectPlayer2 = (value) => {
    if (value)
      setSelectedPlayers({ ...selectedPlayers, player2: value.value})
      
  };

  const onSelectPlayer3 = (value) => {
    if (value)
      setSelectedPlayers({...selectedPlayers, player3: value.value})

  };

  const onSelectPlayer4 = (value) => {
    if (value)
      setSelectedPlayers({...selectedPlayers, player4: value.value})

  };

  const changePlayerResetflag = () => {
    setResetPlayerSelection(false);
  }

  const changeHostResetflag = () => {
    setResetHostSelection(false)
  }
  const changeGameResetflag = () => {
    setResetGameSelection(false)
  }


  const handleCheckBoxChange = (value) => {
     !initalRender.current && setResetHostSelection(true); //avoid clearing value of host id filter on initial render
      setIsZoomGame(value)  
      console.log(isZoomGame);
      
  }


  const handleSave = async (data) => {
    try {
      const res = await handleFormData(data)
      if(res){ 
        setErrorData({ state: true, message: "Game Data saved", headerText:"", alertType:1 });
        scheduleId.current =  res.game_schedule_id;
        communityId.current = res.community_id;
      }
      isDirty.current = false;
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message, alertType: 1 });
    }
  }

  const handleSaveAndExit = async (data) => {
    try {
      const res = await handleFormData(data)
      res && (from === 'calendar' ? router.push("/game-schedules") : router.push("/game-schedules/add-schedule"))
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message, alertType: 1 });
    }
  }

  // submit form
  const handleFormData = async (data) => { 
    
       
    let mandatoryFieldMsg = [];
    let fieldIndex = [4, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    Object.entries(data).forEach(([key, value], index) => {      
      if ((typeof value === 'undefined' || value === '' || value === null) && !(fieldIndex.includes(index))) { //show mandatory field messege except the index which is defined above
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
      let reqData: gameScheduleAddOrEditPayload = {
        community_id: (data.community) ? data.community.value : "",
        is_zoom_game: +isZoomGame,
        game_id: (data.game) ? data.game.value : "",
        schedule_start_at: (data.schedule_start_at) ?
          // ? (new Date(new Date(data.schedule_start_at).toUTCString())).getTime()
          // ? getGMTTimeStamp({ date: data.schedule_start_at }) // Sending GMT time stamp

          // Sending to local timestamp as per requirement
          new Date(data.schedule_start_at).toLocaleDateString('en-CA') + " " + new Date(data.schedule_start_at).toLocaleTimeString('en-GB') : "",
        host_id: (data.host_id) ? data.host_id.value : "",
        custom_spinner_space: (data.custom_spinner_space) ? data.custom_spinner_space.value : "",
        game_level: (data.game_level) ? data.game_level.value : "",
        join_link: link
      };
      if (typeof gameScheduleId !== "undefined") reqData.game_schedule_id = gameScheduleId;
      if (data.meeting_id) reqData.meeting_id = data.meeting_id;
      // if (data.zoom_link) reqData.zoom_link = data.zoom_link;
      if (data.player_1 && data.player_1 !== null) reqData.player_one_id = data.player_1.value;
      if (data.custom_player_name_1) reqData.player_one_name = data.custom_player_name_1;
      if (data.player_2 && data.player_2 !== null) reqData.player_two_id = data.player_2.value;
      if (data.custom_player_name_2) reqData.player_two_name = data.custom_player_name_2;
      if (data.player_3 && data.player_3 !== null) reqData.player_three_id = data.player_3.value;
      if (data.custom_player_name_3) reqData.player_three_name = data.custom_player_name_3;
      if (data.player_4 && data.player_4 !== null) reqData.player_four_id = data.player_4.value;
      if (data.custom_player_name_4) reqData.player_four_name = data.custom_player_name_4;

      const res = await addOrEditSchedule({ reqData }, gameScheduleId);
      isDataSaved.current = true;
      return res;
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  const handleBookHost = () => {
    window.open(Constants.bookHostLink, '_blank');

  };

  const handleAddPerson = () => {    
    if (isDirty.current) {
      setErrorData({ state: true, message: Constants.pageExitAlert.message, headerText: "Alert" })
      saveAndContinue.current = true;
    }
    else
      scheduleId.current ? router.push(`/persons-data/add?gameScheduleId=${scheduleId.current}&from=${from}&community_id=${communityId.current}`) : router.push(`/persons-data/add?from=schedule`);
  };



  const handleShowPlayer = () => {
    if(isDirty.current){
      setErrorData({ state: true, message: Constants.pageExitAlert.message, headerText: "Alert" })
    }
    else
      setPopupOpen(true);
  };

  const isFormDirty = (isChange) => {    
    if (isChange !== dataChange) setDataChange(isChange)
    isDirty.current = isDataSaved.current ? false : isChange // checking if form field has changed
  }

  const handleCancel = () => {
    if (isDirty.current) {
      const {
        SaveFormAlertMsgData: { message, subMessage },
      } = Constants;
      setOpenPopup({
        state: true,
        message,
        subMessage,
      });
    }
    else{                  
      from === 'calendar' ? router.push("/game-schedules") : router.push("/game-schedules/add-schedule")  
    };
  }

  const handlePopupConfirm = () => {
    from === 'calendar' ? router.push("/game-schedules") : router.push("/game-schedules/add-schedule")  
  }


  let buttonList = [
    {
      name: "Book Host",
      handleButtonClick: handleBookHost,
      isDisabled: allowToEdit === 'true' || (isGameHost && isGameHostRoleId === 5) || isFamilyOrResident,

    },
    {
      name: "Add Person",
      handleButtonClick: handleAddPerson,
      isDisabled: allowToEdit === 'true' || (isGameHost && isGameHostRoleId === 5) || isFamilyOrResident,

    },
  ];

  return (
    <div className={`container`}>
      <FormControl
        heading={heading}
        subHeading={(typeof gameScheduleId !== "undefined" && isAdd !== "true") && subHeading}
        showBackButton={true}
        handleBackButton={handleCancel}
        buttonList={buttonList}
      />

      <div className={`row`}>
        {((pageType === 'Add' && isApiLoaded) || (pageType === 'Edit' && isApiLoaded && timezone)) &&
          <AddSchedule
            handleCommunityScroll={handleCommunityScroll}
            handleCommunitySearch={handleCommunitySearch}
            handleCommunityChange={handleCommunityChange}
            handleCommunityToggle={handleCommunityToggle}
            formattedCommunityOptionList={formattedCommunityOptionList}
            handleGameScroll={handleGameScroll}
            handleGameSearch={handleGameSearch}
            handleGameToggle={handleGameToggle}
            optionsForGame={FormattedGameList}
            optionsForGameLevel={gameLevelOptionList}
            handleLevelSearch={handleLevelSearch}
            handleLevelToggle={handleLevelToggle}
            handleHostIdSearch={handleHostIdSearch}
            handleHostIdScroll={handleHostIdScroll}
            handleHostChange={handleHostChange}
            handleJoinLink={handleJoinLink}
            link={link}
            handleHostIdToggle={handleHostIdToggle}
            hostIdOptionList={hostIdOptionList}
            handlePlayerScroll={handlePlayerScroll}
            handlePlayerSearch={handlePlayerSearch}
            handlePlayerToggle={handlePlayerToggle}
            optionsForPersonList={playerOptionList}
            onSelectPlayer1={onSelectPlayer1}
            onSelectPlayer2={onSelectPlayer2}
            onSelectPlayer3={onSelectPlayer3}
            onSelectPlayer4={onSelectPlayer4}
            optionsForCustomList={formattedCustomOptionList}
            handleCancel={handleCancel}
            handleButtonClick={handleShowPlayer}
            handleSaveAndExit={handleSaveAndExit}
            handleSave={handleSave}
            defaultData={defaultData}
            timezoneData={timezone}
            hostId={hostId}
            resetPlayerSelection={resetPlayerSelection}   
            changePlayerResetflag={changePlayerResetflag}
            resetHostSelection = {resetHostSelection}
            changeHostResetflag = {changeHostResetflag}
            resetGameSelection ={resetGameSelection}
            changeGameResetflag = {changeGameResetflag}
            handleCheckBoxChange = {handleCheckBoxChange}
            isFormDirty={isFormDirty}
            allowToEdit={allowToEdit ? (allowToEdit === "false" ? false : true) : false}
            allowToView={allowToView ? (allowToView === "false" ? false : true) : false}
            hostCommId={hostCommId}
            isZoomGame={isZoomGame}
          />}
      </div>
      {isPopupOpen && (
       
        <ShowPlayerDetailPopup
          from = {from}
          scheduleId = {scheduleId.current}
          playerIds={[selectedPlayers.player1,
          selectedPlayers.player2,
          selectedPlayers.player3,
          selectedPlayers.player4]}
          toggle={() => setPopupOpen(!isPopupOpen)}
        />)}
      {openPopup.state &&
        <FullScreenPopup
          bodyText={openPopup.message}
          subText={openPopup.subMessage}
          onCancel={() => setOpenPopup({ ...openPopup, state: false })}
          onConfirm={() => handlePopupConfirm()}
          cancelBtnText={typeof openPopup.message === 'string' ? 'No' : 'Okay'}
          confirmBtn={typeof openPopup.message === 'string' ? true : false} //dont show confirm btn for mandatory field check
        />}
      {errorData.state && (
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "", headerText: "Error" })}
          bodyText={errorData.message}
          headerText={errorData.headerText}
        />)}
    </div>
  );
};

export default React.memo(AddScheduleForm);
