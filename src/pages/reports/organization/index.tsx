import React, { useEffect, useRef, useState } from "react";
import Table from "../../../components/table/table";
import PageControl from "../../../components/pageControl/PageControl";
import getTableRow from "../../../services/tableRow";
import {formatExportOrganizationData, formatReportOrganizationData } from "../../../helper/tableData";
import Loading from "../../../components/text/loading";
import NoDataFound from "../../../components/text/noDataFound";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import { getOrganizationCommunityFilter } from "../../../helper/organizationFilter";
import { formatCommunityOptionsList, formatOrganizationOptionsList } from "../../../helper/formatFilterList";
import { getOrganizationReport } from "../../../services/organizationReportService";
import { getOrganization } from "../../../services/organizationService";
import Constants from "../../../lib/Constants"
import { generatePDF, exportDataToSupportCSVFormat } from "../../../helper/reportGenerator";
import { CSVLink } from "react-csv";
import { getCommunityList } from "../../../services/communityService";
import { organizationExportTableHeader, OrganizationReportTableHeader } from "../../../lib/tableHeader";

export default function Organization() {
  let pageType = "other";
  let pageHeading = "Organization/Community Report";

  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [formatedTableData, setFormatedTableData] = useState([]);
  const [organizationFilterData, setOrganizationFilterData] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState([]);
  const [communityFilterData,setCommunityFilterData] = useState([])
  const [selectedCommunity, setSelectedCommunity] =  useState([])
  const [isSelected, setIsSelected] = useState(false);
  
  const [csvExportData, setCsvExportData] = useState([]);
  let csvLink: any = useRef();

  let totalEntries = useRef(0);
  let totalCommunity = useRef(0);
  let dropDownPage = useRef(1)
  let commDropDownPage = useRef(1)
  let orgSearchText = useRef("")
  let commSearchText = useRef("")



  const [errorData, setErrorData] = React.useState({
    state: false,
    message: "",
  });

  useEffect(() => {
    getOrganizationList({ orgIds: !isSelected ? selectedOrganization : [] , commIds :!isSelected ? selectedCommunity : []});
  }, [pageNumber]);

  useEffect(()=>{
    getOrganizationFilterList(),
    getCommunityFilterList()
  },[])

  // api call to get table data
  const getOrganizationList = async ({ orgIds = [], commIds = [], page = pageNumber }) => {    
    try {
      const reqData = {
        page_number: page, // Initially load page 1
        limit: getTableRow(pageType),
        organization_id: orgIds,
        community_id: commIds,
        query_type: Constants.queryType.tableView
      };
      if (orgIds.length === 0) delete reqData.organization_id;
      if (commIds.length === 0) delete reqData.community_id;
      const res = await getOrganizationReport({ reqData });
      const formatedTableData = formatReportOrganizationData({
        data: res.organization_list, isPdf:false
      });
      setFormatedTableData(formatedTableData);
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

  // api call to get  organization filter list
  const getOrganizationFilterList = async () => {
    try {
      let reqData: OrgReqHeaders = {
        limit: Constants.filterDropDownLimit,
        page_number: dropDownPage.current,
        query_type: Constants.queryType.dropDown
      };

      if (orgSearchText.current !== "") reqData.organization_name = orgSearchText.current;

      const res = await getOrganization({ reqData });

      setOrganizationFilterData(dropDownPage.current !== 1 ?[...organizationFilterData, ...res.organization_list] : [...res.organization_list])
       
      if (typeof res.total_count !== 'undefined')
        totalEntries.current = res.total_count;

    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

    
  // api call to get  organization filter list
  const getCommunityFilterList = async () => {
    try {
      let reqData:communityReqheaders = {
        limit: Constants.filterDropDownLimit,
        page_number:commDropDownPage.current,
        query_type: Constants.queryType.dropDown
      };

      if (commSearchText.current !== "") reqData.community_name = commSearchText.current;

      const res = await getCommunityList({ reqData });

      setCommunityFilterData(commDropDownPage.current !== 1 ? [...communityFilterData, ...res.community_list] : [...res.community_list])
      if (typeof res.total_count !== "undefined")
        totalCommunity.current = res.total_count;
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  const FormattedOptionList = formatOrganizationOptionsList(organizationFilterData);

  const formattedCommunityList = formatCommunityOptionsList(communityFilterData);

  const handleDropDownPageIncreament = () => {    
    dropDownPage.current = dropDownPage.current+1
    getOrganizationFilterList();  
  }

  const handleCommDropDownPageIncreament = () => {
    commDropDownPage.current = commDropDownPage.current+1
    getCommunityFilterList();  
  }

  const handleSearch = (value) => {
    dropDownPage.current = 1;
    orgSearchText.current = value;
    getOrganizationFilterList();
  };

  const handleScroll = () => {
    if (totalEntries.current > organizationFilterData.length) {      
      handleDropDownPageIncreament()
    }
  };

  const handleChange = (value) => {
    setSelectedOrganization(value);
    setIsSelected(true);
  };

  const handleCommunitySearch = (comm) => {
    commDropDownPage.current = 1;
    commSearchText.current = comm;
    getCommunityFilterList();
  };

  const handleCommuniytScroll = () => {
    if (totalCommunity.current > communityFilterData.length) {
      handleCommDropDownPageIncreament()
    }
  };

  const handleCommunityChange = (comm) => {
    setSelectedCommunity(comm);
    setIsSelected(true);
  };

  const handleOrganizationToggle = (isOpen) => { // function to get initial list when dropdown opens with non empty search text
    const isOpening = !isOpen;
     if(isOpening && orgSearchText.current.length) {
      orgSearchText.current = "";
      dropDownPage.current = 1;
      getOrganizationFilterList();
    }
  }
  
  const handleCommunityToggle = (isOpen) => {
    const isOpening = !isOpen;
    if(isOpening && commSearchText.current.length) {
      commSearchText.current = "";
      commDropDownPage.current = 1;
      getCommunityFilterList();
    }
  }

  let filterList = getOrganizationCommunityFilter(
    FormattedOptionList,
    handleChange,
    handleScroll,
    handleSearch,
    handleOrganizationToggle,
    formattedCommunityList,
    handleCommunityChange,
    handleCommunitySearch,
    handleCommuniytScroll,
    handleCommunityToggle,

  );

  const exportAsCSV = async () => {
    const res = await getOrganizationReport({ reqData: {query_type: Constants.queryType.detailView} });
    const csvFileData = exportDataToSupportCSVFormat({ 
      tableHeader:organizationExportTableHeader, 
      formatedTablData: formatExportOrganizationData({
        data: res.organization_list,
      })
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
    const res = await getOrganizationReport({ reqData: {reqData: {query_type: Constants.queryType.detailView}} });
    generatePDF({
      reportName: pageHeading, 
      headers: OrganizationReportTableHeader, 
      data: formatReportOrganizationData({ data: res.organization_list, isPdf: true })
    });
  };

  const printPageAction = () => {
    window.print();
  };

  let topButtonList = [
    {
      name: "Export to CSV",
      handleButtonClick: exportAsCSV,
    },
  ];

  let bottomButtonList = [
    {
      name: "Print",
      handleButtonClick: printPageAction,
    },

    {
      name: "Export to PDF",
      handleButtonClick: exportAsPDF,
    },
  ];

  const handlePageClick = (page) => {
    setPageNumber(page.selected + 1);
  };

  const handleAplyButton = () => {
    if ((selectedOrganization.length > 0 || selectedCommunity.length > 0 ||  isSelected) && isSelected) {
      getOrganizationList({ page: 1, orgIds: selectedOrganization, commIds: selectedCommunity });
      setIsSelected(false);
    }
   
  };

  return (
    <div className="container">
      <PageControl
        pageHeading={pageHeading}
        filterList={filterList}
        topButtonList={topButtonList}
        bottomButtonList={bottomButtonList}
        showBottomButtonList={true}
        showBackButton={false}
        showTopButtonList={true}
        handleAplyButton={handleAplyButton}
      />
      <section className="page-content">
        {loading && <Loading />}
        {!loading && formatedTableData.length === 0 && <NoDataFound />}
        {formatedTableData.length !== 0 && (
          <Table
            tableData={formatedTableData}
            tabelHeader={OrganizationReportTableHeader}
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
}
