import React, { useState, useRef, useEffect, useContext } from "react";
import router from "next/router";
import Table from "../../../components/table/table";
import PageControl from "../../../components/pageControl/PageControl";
import Loading from "../../../components/text/loading"
import NoDataFound from "../../../components/text/noDataFound";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import getTableRow from "../../../services/tableRow";
import { getOrganization } from "../../../services/organizationService";
import { getCommunityList } from "../../../services/communityService";
import { addOrEditSchedule, getGameSchedules, getGameURL, getZoomLink } from "../../../services/gameSchedule";
import { formatScheduleData } from "../../../helper/tableData";
import { gameScheduleTableHeader } from "../../../lib/tableHeader";
import Constants from "../../../lib/Constants";
import { useCookies } from "react-cookie";
import { getGMTTimeStamp, subtractTimezoneOffset} from "../../../helper/dateTime";
import { RoleContext } from "../../../context/roleContext";
import { getTopUserRole } from "../../../helper/roles";
import { basePath, domain } from "../../../../next.config";

const GameScheduleTable = () => {

  const roleDetails = useContext(RoleContext);
  const { rolePermissions : { rolesNotAllowedToAddNewSchedules }} = Constants;

  let pageType = "gameSchedule"
  let pageHeading = "Scheduled Games";
  let showBackButton = true;
  let showTopButtonList = true;

  const [organizationforFilter, setOrganizationforFilter] = useState([])
  const [communityforFilter, setCommunityforFilter] = useState([])

  const [selectedOrganization, setSelectedOrganization] = useState([])
  const [selectedCommunity, setSlectedCommunity] = useState([])


  const [startDate, setStartDate] = useState(0)
  const [endDate, setEndDate] = useState(0)

  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const [scheduleList, setScheduleList] = useState([])

  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = React.useState(false)

  const [cookies, setCookie] = useCookies(["gameScheduleId", "gameScheduleRoundId"]);
  const [errorData, setErrorData] = useState<errorData>({
    state: false,
    message: "",
    alertType:1,
  });

  let totalOrganization = useRef(0);
  let totalCommunity = useRef(0);
  let dropDownPage = useRef(1)
  let commDropDownPage = useRef(1)
  let orgSearchText = useRef("")
  let commSearchText = useRef("")
  let scheduleID = useRef()


  useEffect(() => {
    getOrganizationFilterList();
    getCommunityListForFilter();
  }, [])

  useEffect(() => {
    getScheduleList({ orgIds: !isSelected ? selectedOrganization : [],
      commIds: !isSelected ? selectedCommunity : [],
      fromDate: !isSelected ? startDate : 0,
      toDate:!isSelected  ? endDate:0})

  }, [pageNumber])


  // api call to get game schedule list
  const getScheduleList = async ({ fromDate = 0, toDate = 0, orgIds = [], commIds = [], page = pageNumber }) => {
    try {
      let reqData: gameSchedulePayload = {
        page_number: page,
        limit: getTableRow(pageType),
        query_type: Constants.queryType.tableView
      }
      if (fromDate !== 0){ reqData.from_date = fromDate; }
      if (toDate !== 0) reqData.to_date = toDate ;
      if (orgIds.length > 0) reqData.organization_ids = orgIds;
      if (commIds.length > 0) reqData.community_ids = commIds;

      const res = await getGameSchedules({ reqData })
      setScheduleList(res.game_schedule_list)
      if (page === 1) {
        res.total_count && setPageCount(Math.ceil(res.total_count / getTableRow(pageType)));
      }
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
    setLoading(false);
  }


  // api call to get organization filter list
  const getOrganizationFilterList = async () => {
    try {
      let reqData: OrgReqHeaders = {
        limit: Constants.filterDropDownLimit,
        page_number:dropDownPage.current,
        query_type:Constants.queryType.dropDown
      };
      
      if (orgSearchText.current !== "") { reqData.organization_name =  orgSearchText.current }
        const res = await getOrganization({ reqData });
        
        setOrganizationforFilter( dropDownPage.current !== 1 ? [
           ...organizationforFilter,
          ...res.organization_list] : [...res.organization_list]);
        if (typeof res.total_count !== 'undefined') totalOrganization.current = res.total_count;
        
      
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };


  //api call to get community filter list
  const getCommunityListForFilter = async () => {
    try {
      let reqData: communityReqheaders = {
        limit: Constants.filterDropDownLimit,
        page_number:commDropDownPage.current,
        query_type: Constants.queryType.dropDown
      };
      if (commSearchText.current !== "") { reqData.community_name = commSearchText.current;}
        const res = await getCommunityList({ reqData });
        setCommunityforFilter(commDropDownPage.current !== 1 ? [...communityforFilter, ...res.community_list] : [...res.community_list]);
        if (typeof res.total_count !== 'undefined') totalCommunity.current = res.total_count    
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  const organizationOptionList = organizationforFilter.map(function (option) {
    return { label: option.organization_name, value: option.organization_id };
  });

  const communityOptionList = communityforFilter.map(function (option) {
    return { label: option.community_name, value: option.community_id };
  });

  const handleDropDownPageIncreament = () => {
    dropDownPage.current = dropDownPage.current+1
   getOrganizationFilterList();
  }
  

  const handleCommDropDownPageIncreament = () => {
    commDropDownPage.current = commDropDownPage.current+1
    getCommunityListForFilter();  
  }


  const handleOrganizationSearch = (org) => {
    orgSearchText.current = org
    dropDownPage.current = 1;
    getOrganizationFilterList();
  };

  const handleOrganizationScroll = () => {    
    if (totalOrganization.current > organizationforFilter.length)
       handleDropDownPageIncreament()
    };

  const handleOrganizationChange = (org) => {
    setSelectedOrganization(org)
    setIsSelected(true)
  };

  const handleCommunitySearch = (comm) => {
    commSearchText.current = comm;
    commDropDownPage.current = 1;
    getCommunityListForFilter()
  };

  const handleCommunityScroll = () => {
    if (totalCommunity.current > communityforFilter.length){
      handleCommDropDownPageIncreament()
    }
  };

  const handleCommunityChange = (comm) => {
    setSlectedCommunity(comm)
    setIsSelected(true)
  };

  const handleFromDateChange = (date) => {    
    // setStartDate((new Date(new Date(date).toUTCString())).getTime())
    (date === null) ? setStartDate(0) : setStartDate(subtractTimezoneOffset(getGMTTimeStamp({ date }),date))
    setIsSelected(true)
  };
  
  const handleToDateChange= (date) => {
    // setEndDate((new Date(new Date(date).toUTCString())).getTime())
    // Adding timestamp to take to last min of the day and subtracting offset
    (date === null) ? setEndDate(0) : setEndDate(subtractTimezoneOffset(((((60 *23) + 59 ) * 60000) + getGMTTimeStamp({ date })), date))
    setIsSelected(true)
  };

 

  const handleOrganizationToggle = (isOpen) => { // function to get initial list when dropdown opens with non empty search text
    const isOpening = !isOpen;
     if(isOpening && orgSearchText.current.length) {
      orgSearchText.current = "";
      dropDownPage.current = 1;
      getOrganizationFilterList()
    }
  }

  const handleCommunityToggle = (isOpen) => {
    const isOpening = !isOpen;
    if(isOpening && commSearchText.current.length) {
      commSearchText.current = "";
      commDropDownPage.current = 1;
      getCommunityListForFilter();
    }
  }


  const handleAddButtonClick = () => {
    router.push(`/game-schedules/add-schedule/add?from=schedule`)
  };


  // delete row data from schedule table
  const handleButtonClick = async (scheduleId, accessor) => {
    // Await calls if loading needs to be shown here
    if(accessor === "Delete") { 
        deleteSchedule({ scheduleId });
    } else if(accessor === "Start Game") {
        launchGame({ scheduleId });
    } else if(accessor === "Start Zoom") {
        startZoomMeeting({ scheduleId });
    }
  }

  const deleteSchedule = ({ scheduleId }) => {
    setErrorData({ state: true, message: Constants.deleteAlertMsg.message, alertType:4 }); 
    scheduleID.current = scheduleId;
  }

  const handleDelete = async() => {
    setErrorData({ state: false, message: "" })
    try{
      const ScheduledListForcommId = scheduleList.find(item => item.game_schedule_id === scheduleID.current) 
      await addOrEditSchedule({ reqData : {game_schedule_id : scheduleID.current, community_id:ScheduledListForcommId.community_id, schedule_start_at:ScheduledListForcommId.schedule_start_at, status : 5 } }, scheduleID.current);
      const newScheduledList = scheduleList.filter(item => item.game_schedule_id !== scheduleID.current)  
      setScheduleList(newScheduledList )  
    }
    catch(err){
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  const launchGame = async({ scheduleId }) => {
    try {
      const reqData = {
        game_schedule_id: scheduleId
      }
      const response = await getGameURL({ reqData });
      setCookie("gameScheduleId", response.game_schedule_id, {
        domain: domain, // Disable domain field while working locally
        path: basePath
       });
       setCookie("gameScheduleRoundId", response.game_schedule_round_id, {
        domain: domain, // Disable domain field while working locally
        path: basePath
       });

      // Game URL is been opened here
      window.open(response.game_url, '_blank');
    } catch(err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  const startZoomMeeting = async({ scheduleId }) => {
    try {
      const reqData = {
        game_schedule_id: scheduleId
      }
      const response = await getZoomLink({ reqData });
      window.open(response.zoom_start_link, '_blank');
    } catch(err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  const handlePageClick = (page) => {
    setPageNumber(page.selected + 1);
  };

  const handleBackbutton = () => {
    router.push("/game-schedules")
  }

  const handleAplyButton = () => {
    if ((selectedOrganization.length > 0 ||
      selectedCommunity.length > 0 ||
      (startDate !== 0 || endDate !== 0)
      || isSelected) && isSelected) {
      getScheduleList({ page: 1, orgIds: selectedOrganization, commIds: selectedCommunity, fromDate: startDate, toDate: endDate });
      setIsSelected(false)
    }
  }

  let filterList = [
    {
      label: "From Date",
      type: "date",
      name: "from_date",
      handleChange: handleFromDateChange,
      isDateRange:true
    },
    {
      label: "To Date",
      type: "date",
      name: "to_date",
      handleChange: handleToDateChange,
      isDateRange:true

    },
    {
      label: "Organizations",
      type: "MultiSelectDropDown",
      optionsList: organizationOptionList,
      name: "organization",
      title: "Search for Organization",
      searchText: "Search for Organization",
      handleChange: handleOrganizationChange,
      noOptionText: "No data found",
      handleSearch: handleOrganizationSearch,
      handleScroll: handleOrganizationScroll,
      handleToggle:handleOrganizationToggle
    },
    {
      label: "Communities",
      type: "MultiSelectDropDown",
      optionsList: communityOptionList,
      name: "Community",
      title: "Search for Community",
      searchText: "Search for Community",
      handleChange: handleCommunityChange,
      noOptionText: "No data found",
      handleSearch: handleCommunitySearch,
      handleScroll: handleCommunityScroll,
      handleToggle:handleCommunityToggle
    },
  ];

  let topButtonList = [
    {
      name: "Add Game",
      isDisabled: rolesNotAllowedToAddNewSchedules.includes(getTopUserRole(roleDetails)),
      handleButtonClick: handleAddButtonClick,
    },
  ];


  return (
    <div className={`container`}>
      <PageControl
        pageHeading={pageHeading}
        filterList={filterList}
        topButtonList={topButtonList}
        showBackButton={showBackButton}
        handleBackButton={handleBackbutton}
        showTopButtonList={showTopButtonList}
        handleAplyButton={handleAplyButton}
      />
      <section className="page-content">
        {loading && <Loading />}
        {!loading && scheduleList.length === 0 && <NoDataFound />}
        {scheduleList.length !== 0 &&
          <Table
            tableData={formatScheduleData({ data: scheduleList })}
            tabelHeader={gameScheduleTableHeader}
            pagination={true}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            handleButtonClick = {handleButtonClick}
          />
        }
        {errorData.state && (
          <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={errorData.alertType === 4 ? "Alert" : "Error"}
          handleDeleteRecord={handleDelete}
          cancelBtn = {errorData.alertType === 4 && true}
          alertType = {errorData.alertType}
          confirmBtnText ={errorData.alertType === 4 && "Yes"}
        />
        )}
      </section>
    </div>
  );
};

export default React.memo(GameScheduleTable);
