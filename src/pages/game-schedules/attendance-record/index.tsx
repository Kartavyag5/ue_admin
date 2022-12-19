import React, { useEffect, useRef, useState } from "react";
import router from "next/router";
import Table from "../../../components/table/table";
import PageControl from "../../../components/pageControl/PageControl";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import Loading from "../../../components/text/loading"
import NoDataFound from "../../../components/text/noDataFound";
import getTableRow from "../../../services/tableRow";
import RateHost from "../../../components/popup/RateHost";
import { getAttendancelist, getParticipantType, getRateHostDetails, recordAttendance } from "../../../services/gameSchedule";
import { formatAttendanceData } from "../../../helper/tableData";
import { attendanceTableHeader } from "../../../lib/tableHeader";
import Constants from "../../../lib/Constants";
import { isMatch } from "date-fns";
import FullScreenPopup from "../../../components/popup/FullScreenPopup";



const RecordAttendance = () => {

  const { gameName, date, commName, scheduleId, commId, hostName, is_zoom_game } = router.query

  let pageType = "gameSchedule"
  let pageHeading = "Record Attendance";
  let subHeading = `${gameName} - ${date} - ${commName}`

  let showBackButton = true;
  let showTopButtonList = true;

  const [isRatePopupOpen, setRatePopup] = useState(false)

  const [pageCount, setPageCount] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);

  const [loading, setLoading] = useState(true);
  const [attendanceList, setAttendanceList] = useState([])
  const [editData, setEditData] = useState([]);
  const [participantTypeList, setParticipantTypeList] = useState([])

  const [errorData, setErrorData] = useState<errorData>({
    state: false,
    message: "",
    alertType: 1
  });

  const [openPopup, setOpenPopup] = useState<popup>({
    state: false,
    message: '',
    subMessage: ''
  });
  const [isRateHost,setRateHost]=useState(false)
  let gameUserId = useRef();
  let leaveAt = useRef("");
  const isDataSaved = useRef(false);


  useEffect(() => {
    if (router.query.scheduleId)
    {  getRecommendHost()
       getAttendanceForList({})
    }
    getParticipantTypeList()
  }, [router.query])


  const getRecommendHost = async () => {
    try {
      const reqData = {
        game_schedule_id: router.query.scheduleId,
      };
      const res = await getRateHostDetails({ reqData })
      setRateHost(res.recommend_host==1 ? true:false );
    } catch (err) {
      setErrorData({ state: true, message: err.message });
    }
    setLoading(false);
  };


  //api call to get attendance list
  const getAttendanceForList = async ({ page = pageNumber }) => {
    try {
      const reqData = {
        page_number: page, // Initially load page 1
        limit: getTableRow(pageType),
        game_schedule_id: router.query.scheduleId,
        community_id: commId
      };
      const res = await getAttendancelist({ reqData })
      setAttendanceList(res.schedule_user_list);
      if (page === 1) {
        res.total_count && setPageCount(Math.ceil(res.total_count / getTableRow(pageType)));
      }
    } catch (err) {
      setErrorData({ state: true, message: err.message });
    }
    setLoading(false);
  };


  const getParticipantTypeList = async () => {
    try {
      const res = await getParticipantType({ reqData: {} });
      setParticipantTypeList(res.participant_type_list);
    } catch (err) {
      setErrorData({ state: true, message: err.message });
    }
  }

  const formattedParticipantTypeList = participantTypeList.map(({ id, name }) => {
    return { label: name, value: id };
  });


  const handlePageClick = (page) => {
    setPageNumber(page.selected + 1)
    getAttendanceForList({ page: page.selected + 1 })
  };

  //handle person type change
  const handlePersonType = (item, type, userId) => {
    let clonedData = JSON.parse(JSON.stringify(attendanceList)); //make a shallow copy
    let DataToCompare = JSON.parse(JSON.stringify(attendanceList));
    if (clonedData.length) {
      let element = clonedData.find(obj => obj.game_user_id == userId);
      if (element) {
        if (type === 2) {
          element.user_type = item.value;
          element.user_type_name = item.label;
        }
        if (type === 1) {
          leaveAt.current = item;
          if (isMatch(item, 'MM/dd/yyyy h:mm aa') && item.slice(-1) === "M") element.leave_at = item;
        }
        let index = clonedData.findIndex((obj => obj.game_user_id == userId));
        const existingData = DataToCompare.find(({ game_user_id, user_type }) => game_user_id === userId && user_type === item.value)
        clonedData[index] = element;
        // editData.filter(({game_user_id}) => game_user_id !== userId)
        if (existingData) {
          setEditData([...editData])
          isDataSaved.current = false;
        }
        else {
          setEditData([...editData.filter(({ game_user_id }) => game_user_id !== userId), element])
          isDataSaved.current = true;
        }

        setAttendanceList(clonedData)
      }
    }
  }

  const handleSaveButtonClick = async () => {
    if (!isRateHost && is_zoom_game === '1') { // rate the host if havent rated before saving data.
      setErrorData({ state: true, message: Constants.rateHostAlertMsg.message1, alertType: 2 }); // set alertType 2 to show rate host popup
    setRateHost(true)
  }
    else {
      handleSaveData()  // save the data directly if host is already rated. 
    }
  };

  const handleSaveData = async () => {
    if (leaveAt.current) {
      if (!(isMatch(leaveAt.current, 'MM/dd/yyyy h:mm aa') && leaveAt.current.slice(-1) === "M")) {
        setErrorData({ state: true, message: "Please enter valid date", alertType: 1 });
        return;
      }
    }
    let filterData = editData.map(data => {
      return { game_user_id: data.game_user_id, user_type: data.user_type, status: data.status, user_id: data.user_id, leave_at: new Date(data.leave_at).getTime() } //filter only required property to be sent to api
    })

    if (filterData.length) {
      try {
        let reqData = {
          game_schedule_id: scheduleId,
          community_id: commId,
          attendance: JSON.stringify(filterData)
        }
        await recordAttendance({ reqData });
        setEditData([])
        isDataSaved.current = false;
        router.push('/game-schedules/add-schedule/')
      } catch (err) {
        setErrorData({ state: true, message: err.message });
      }
    }
  }

  const handleDeleteButtonClick = (game_user_id, accessor) => {
    gameUserId.current = game_user_id;
    setErrorData({ state: true, message: Constants.deleteAlertMsg.message, alertType: 4 });
  }

  const handleDelete = async () => {
    setErrorData({ state: false, message: "" })
    try {
      let reqData = {
        game_schedule_id: scheduleId,
        community_id: commId,
        attendance: JSON.stringify([{ game_user_id: gameUserId.current, status: 5 }])
      }
      await recordAttendance({ reqData });
      //  setAttendanceList(attendanceList.filter(item => item.game_user_id !== gameUserId.current))  
      getAttendanceForList({ page: 1 })
    }
    catch (err) {
      setErrorData({ state: true, message: err.message });
    }
  }

  const handleRateButtonClick = () => { // open rate host popup
    if (isRateHost) {
      setErrorData({ state: true, message: Constants.rateHostAlertMsg.message2, alertType: 5 })
    }
    else
      setRatePopup(true)
  };


  const handleBackbutton = () => {
  
    const { SaveFormAlertMsgData: { message, subMessage } } = Constants;
    isDataSaved.current ? setOpenPopup({
      state: true,
      message,
      subMessage,
    }) : router.back()
  }

  const handleRateHostAlert = () => { // open alert popup before rate host
    setErrorData({ state: false, message: "", alertType: 1 })
    setRatePopup(true)
  }

  const handleAddButtonClick = () => {
    router.push(`/game-schedules/attendance-record/add?commId=${commId}&scheduleId=${scheduleId}`);
  };

  const handleIsHostRated = () => {
    if (!isRateHost) 
    setRateHost(true);
  }

  const handlePopupConfirm = () => {
    router.back();
  }



  let topButtonList = [
    {
      name: "Add Entry",
      handleButtonClick: handleAddButtonClick,
    },
    {
      name: "Rate Host",
      handleButtonClick: handleRateButtonClick,
      isDisabled: is_zoom_game === '1' ? false : true
    },
    {
      name: "Save",
      handleButtonClick: handleSaveButtonClick,
    },
  ];


  return (
    <div className={`container`}>
      <PageControl
        pageHeading={pageHeading}
        subHeading={subHeading}
        showBackButton={showBackButton}
        handleBackButton={handleBackbutton}
        showTopButtonList={showTopButtonList}
        topButtonList={topButtonList}
      />
      <section className="page-content">
        {loading && <Loading />}
        {!loading && attendanceList.length === 0 && <NoDataFound />}
        {attendanceList.length > 0 &&
          <Table
            tableData={formatAttendanceData({ data: attendanceList, person_type_list: formattedParticipantTypeList })}
            tabelHeader={attendanceTableHeader}
            pagination={true}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            handleChangeData={handlePersonType}
            handleButtonClick={handleDeleteButtonClick}
          />}
      </section>
      {
        isRatePopupOpen &&
        <RateHost toggle={() => setRatePopup(!isRatePopupOpen)}
          gameName={gameName}
          gameDate={date}
          hostName={hostName}
          gameScheduleId={scheduleId}
          communityId={commId}
          handleSaveData={handleSaveData}
          handleIsHostRated={handleIsHostRated}
        />
      }
      {errorData.state && (
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={errorData.alertType === 1 ? "Error" : "Alert"}
          handleDeleteRecord={handleDelete}
          handleAlert={handleRateHostAlert}
          cancelBtn={errorData.alertType === 4 && true}
          alertType={errorData.alertType}
          confirmBtnText={errorData.alertType === 4 && "Yes"}
        />
      )}
      {openPopup.state &&
        <FullScreenPopup
          bodyText={openPopup.message}
          subText={openPopup.subMessage}
          onCancel={() => setOpenPopup({ ...openPopup, state: false })}
          onConfirm={() => handlePopupConfirm()}
          cancelBtnText={typeof openPopup.message === 'string' ? 'No' : 'Okay'}
          confirmBtn={typeof openPopup.message === 'string' ? true : false} //dont show confirm btn for mandatory field check
        />}
    </div>
  );
};

export default RecordAttendance;
