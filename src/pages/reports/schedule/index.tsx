import React, { useEffect, useRef, useState } from "react";
import PageControl from "../../../components/pageControl/PageControl";
import Table from "../../../components/table/table";
import { getCommunityList } from "../../../services/communityService";
import { getGameSchedules } from "../../../services/gameSchedule";
import { getOrganization } from "../../../services/organizationService";
import getTableRow from "../../../services/tableRow";
import Loading from "../../../components/text/loading";
import NoDataFound from "../../../components/text/noDataFound";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import { formatGameScheduleExport, formatGameScheduleReport } from "../../../helper/tableData";
import { formatCommunityOptionsList, formatOrganizationOptionsList } from "../../../helper/formatFilterList";
import Constants from "../../../lib/Constants";
import { generatePDF, exportDataToSupportCSVFormat } from "../../../helper/reportGenerator";
import { CSVLink } from "react-csv";
import { getGMTTimeStamp, subtractTimezoneOffset } from "../../../helper/dateTime";
import { gameScheduleExportHeader, gameScheduleReportHeader } from "../../../lib/tableHeader";


const Schedule = () => {
  let pageHeading = "Game Schedule Report";
  let showTopButtonList = true;
  let pageType = "gameSchedule";

  const [organizationforFilter, setOrganizationforFilter] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState([]);

  const [communityforFilter, setCommunityforFilter] = useState([]);
  const [selectedCommunity, setSlectedCommunity] = useState([]);

  const [startDate, setStartDate] = useState(0);
  const [endDate, setEndDate] = useState(0);

  const [scheduleList, setScheduleList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isSelected, setIsSelected] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(5);

  let totalOrganization = useRef(0);
  let totalCommunity = useRef(0);
  let orgDropDownPage = useRef(1)
  let commDropDownPage = useRef(1)
  let orgSearchText = useRef("");
  let commSearchText = useRef("");



  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });

  const [csvExportData, setCsvExportData] = useState([])
  let csvLink: any = useRef();

  useEffect(() => {
    getScheduleList({
      orgIds: !isSelected ? selectedOrganization : [],
      commIds: !isSelected ? selectedCommunity : [],
      fromDate: !isSelected ? startDate : 0,
      toDate:!isSelected  ? endDate:0 
    });
  }, [pageNumber]);

  useEffect(() => {
    getOrganizationFilterList();
    getCommunityListForFilter();
  }, []);

  const FormattedOrganizationList = formatOrganizationOptionsList(organizationforFilter)
  const FormattedCommunityOptionList = formatCommunityOptionsList(communityforFilter)

  // api call to get game schedule list
  const getScheduleList = async ({
    fromDate = 0,
    toDate = 0,
    orgIds = [],
    commIds = [],
    page = pageNumber,
  }) => {
    try {
      
      let reqData: gameSchedulePayload = {
        page_number: page,
        limit: getTableRow(pageType),
        query_type: Constants.queryType.reportTableView
      };
      if (fromDate !== 0 ) {reqData.from_date = fromDate; }
      if( toDate !== 0) reqData.to_date = toDate;
      if (orgIds.length > 0) reqData.organization_ids = orgIds;
      if (commIds.length > 0) reqData.community_ids = commIds;

      const res = await getGameSchedules({ reqData });

      // const formatedTableData = formatScheduleData({ data: res.game_schedule_list })
      setScheduleList(res.game_schedule_list);

      if (page === 1) {
        res.total_count &&
          setPageCount(Math.ceil(res.total_count / getTableRow(pageType)));
      }
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
    setLoading(false);
  };

  // api call to get organization filter list
  const getOrganizationFilterList = async () => {
    try {
      let reqData: OrgReqHeaders = {
        limit: Constants.filterDropDownLimit,
        page_number:orgDropDownPage.current,
        query_type:Constants.queryType.dropDown
      };
      if (orgSearchText.current !== "") {
        reqData.organization_name = orgSearchText.current;
      }

      const res = await getOrganization({ reqData });

       setOrganizationforFilter(orgDropDownPage.current !== 1 ? [...organizationforFilter, ...res.organization_list] : [...res.organization_list]);      

      if (typeof res.total_count !== "undefined")
        totalOrganization.current = res.total_count;
      
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
      if (commSearchText.current !== "") {
        reqData.community_name = commSearchText.current;
      }

      const res = await getCommunityList({ reqData });
      setCommunityforFilter(commDropDownPage.current !== 1 ? [...communityforFilter, ...res.community_list] : [...res.community_list]);
      
      if (typeof res.total_count !== "undefined")
        totalCommunity.current = res.total_count;
      
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  const handleDropDownPageIncreament = () => {
    orgDropDownPage.current = orgDropDownPage.current+1
    getOrganizationFilterList();  
  }

  const handleCommDropDownPageIncreament = () => {
    commDropDownPage.current = commDropDownPage.current+1
    getCommunityListForFilter();  
  }
  

  const handleCommunitySearch = (value) => {
    commSearchText.current = value;
    commDropDownPage.current = 1;
    getCommunityListForFilter();
  };

  const handleCommunityScroll = () => {
    if (totalCommunity.current > communityforFilter.length) {
      handleCommDropDownPageIncreament()
    }
  };

  const handleCommunityChange = (value) => {
    setSlectedCommunity(value);
    setIsSelected(true);
  };

  const handleOrganizationSearch = (value) => {
    orgDropDownPage.current = 1;
    orgSearchText.current = value;
    getOrganizationFilterList();
  };

  const handleOrganizationScroll = () => {
    if (totalOrganization.current > organizationforFilter.length) {
      handleDropDownPageIncreament()
    }
  };

  const handleOrganizationChange = (value) => {
    setSelectedOrganization(value);
    setIsSelected(true);
  };

  const handleFromDateChange = (date) => {
    // setStartDate((new Date(new Date(date).toUTCString())).getTime());

    (date === null) ? setStartDate(0) : setStartDate(subtractTimezoneOffset(getGMTTimeStamp({ date }),date))
    setIsSelected(true)
  };

  const handleToDateChange = (date) => {
    // setEndDate((new Date(new Date(date).toUTCString())).getTime());

    (date === null) ? setEndDate(0) : setEndDate(subtractTimezoneOffset(((((60 *23) + 59 ) * 60000) + getGMTTimeStamp({ date })), date))
    setIsSelected(true)
  };

  const handleOrganizationToggle = (isOpen) => { // function to get initial list when dropdown opens with non empty search text
    const isOpening = !isOpen;
     if(isOpening && orgSearchText.current.length) {
      orgSearchText.current = "";
      orgDropDownPage.current = 1;
      getOrganizationFilterList();
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

  const handleAplyButton = () => {

    if (
      (selectedOrganization.length > 0 ||
        selectedCommunity.length > 0 ||
        (startDate !== 0 || endDate !== 0) ||
        isSelected) &&
      isSelected
    ) {
      getScheduleList({
        page: 1,
        orgIds: selectedOrganization,
        commIds: selectedCommunity,
        fromDate: startDate,
        toDate: endDate,
      });
      setIsSelected(false);

    }

  };

  let filterList = [
    {
      label: "From Date",
      type: "date",
      name: "from_date",
      handleChange: handleFromDateChange,
      isDateRange : true
    },
    {
      label: "To Date",
      type: "date",
      name: "to_date",
      handleChange: handleToDateChange,
      isDateRange : true
    },
    {
      label: "Organizations",
      type: "MultiSelectDropDown",
      optionsList: FormattedOrganizationList,
      name: "organization",
      title: "Search for Organization",
      searchText: "Search for Organization",
      handleChange: handleOrganizationChange,
      noOptionText: "No data found",
      handleSearch: handleOrganizationSearch,
      handleScroll: handleOrganizationScroll,
      handleToggle: handleOrganizationToggle
    },
    {
      label: "Communities",
      type: "MultiSelectDropDown",
      optionsList: FormattedCommunityOptionList,
      name: "Community",
      title: "Search for Community",
      searchText: "Search for Community",
      handleChange: handleCommunityChange,
      noOptionText: "No data found",
      handleSearch: handleCommunitySearch,
      handleScroll: handleCommunityScroll,
      handleToggle: handleCommunityToggle
    },
  ];

  const exportAsCSV = async () => {
    const res = await getGameSchedules({ reqData: {query_type: Constants.queryType.detailView} });
    const csvFileData = exportDataToSupportCSVFormat({ 
      tableHeader: gameScheduleExportHeader, 
      formatedTablData: formatGameScheduleExport({ data: res.game_schedule_list })
    });
    setCsvExportData(csvFileData);
    // Use effect with "csvExportData" as dependecy gets executed
  }

  useEffect(()=> {
    if(csvExportData.length) {
      // TODO: Find different approcah to handle asyc data
      // Issue: https://github.com/react-csv/react-csv/issues/72
      setTimeout(() => {
        csvLink.current.link.click();
     }, 1000);
    };
  }, [csvExportData])

  const exportAsPDF = async() => {
    const res = await getGameSchedules({ reqData: {query_type: Constants.queryType.reportTableView} });
    generatePDF({
      reportName: pageHeading, 
      headers: gameScheduleReportHeader, 
      data: formatGameScheduleReport({ data: res.game_schedule_list, isPdf:true })
    });
  };

  const printPageAction = () => {
    window.print();
  };

  let topButtonList = [
    {
      name: "Print",
      handleButtonClick: printPageAction,
    },
    {
      name: "Export to CSV",
      handleButtonClick: exportAsCSV,
    },
    {
      name: "Export to PDF",
      handleButtonClick: exportAsPDF,
    },
  ];

  const handlePageClick = (page) => {
    setPageNumber(page.selected + 1);
  };

  return (
    <div className={`container`}>
      <PageControl
        pageHeading={pageHeading}
        filterList={filterList}
        topButtonList={topButtonList}
        showTopButtonList={showTopButtonList}
        handleAplyButton={handleAplyButton}
      />
      <section className="page-content">
        {loading && <Loading />}
        {!loading && scheduleList.length === 0 && <NoDataFound />}
        {scheduleList.length !== 0 && (
          <Table
            tableData={formatGameScheduleReport({ data: scheduleList, isPdf:false })}
            tabelHeader={gameScheduleReportHeader}
            pagination={true}
            pageCount={pageCount}
            onPageChange={handlePageClick}
          />
        )}
        {errorData.state && (
          <ErrorPopup
            toggle={() => setErrorData({ state: false, message: "" })}
            bodyText={errorData.message}
            headerText={"Error"}
          />
        )}
      </section>

      <CSVLink
         data={csvExportData}
         filename= {`${pageHeading}.csv`}
         className='hidden'
         ref={csvLink}
         target='_blank'
      />

    </div>
  );
};

export default React.memo(Schedule);
