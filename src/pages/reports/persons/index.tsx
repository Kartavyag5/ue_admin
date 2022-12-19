import React, { useEffect, useRef, useState } from "react";
import Table from "../../../components/table/table";
import PageControl from "../../../components/pageControl/PageControl";
import getTableRow from "../../../services/tableRow";
import {getUserList} from "../../../services/personService";
import { formatPersonDataforExport, formatReportPersonData } from "../../../helper/tableData";
import { getOrganization,  } from "../../../services/organizationService";
import Loading from "../../../components/text/loading"
import NoDataFound from "../../../components/text/noDataFound";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import {  getCommunityList} from "../../../services/communityService";
import { getPersonFilterList } from "../../../helper/personFilter";
import { formatCommunityOptionsList, formatOrganizationOptionsList, formatPersonOptionList } from "../../../helper/formatFilterList";
import Constants from "../../../lib/Constants";
import { generatePDF, exportDataToSupportCSVFormat } from "../../../helper/reportGenerator";
import { CSVLink } from "react-csv";
import { personExportTableHeader, personReportTableHeader } from "../../../lib/tableHeader";

export default function Person() {
  let pageType = "other"
  let pageHeading = "Person Report";
 
  const [loading, setLoading] = React.useState(true);

  const [personsData, setPersonsData] = React.useState([])
  const [personsDataforFilter, setPersonsDataforFilter] = React.useState([])

  const [organizationforFilter, setOrganizationforFilter] = React.useState([])

  const [communityforFilter, setCommunityforFilter] = React.useState([])

  const [page, setPage] = React.useState(1)
  const [pageCount, setPageCount] = React.useState(0)

  const [selectedPerson, setSelectedPerson] = React.useState([])
  const [selectedOrganization, setSelectedOrganization] = React.useState([])
  const [selectedCommunity, setSlectedCommunity] = React.useState([])
  const [isSelected, setIsSelected] = React.useState(false)
  const [csvExportData, setCsvExportData] = useState([]);
  let csvLink: any = useRef();

  let totalusers = useRef(0)
  let totalOrganization = useRef(0);
  let totalCommunity = useRef(0);
  let dropDownPage = useRef(1)
  let commDropDownPage = useRef(1)
  let userDropDownPage = useRef(1)
  let userSearchText = useRef("");
  let orgSearchText = useRef("");
  let commSearchText = useRef("");




  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });

  const OrganizationOptionList =formatOrganizationOptionsList(organizationforFilter)
  const communityOptionList =formatCommunityOptionsList(communityforFilter)
  const personOptionList =formatPersonOptionList( personsDataforFilter)

  // api call to fetch persons list
  const getPersonsTableList = async ({ pageNumber = page, userIds = [], orgIds = [], commIds = [] }) => {

    try {
      let reqData: userListPayload = {
        list_type:Constants.userListType.table,
        limit: getTableRow(pageType),
        page_number: pageNumber,
        user_ids: userIds,
        organization_ids: orgIds,
        community_ids: commIds,
        query_type: Constants.queryType.reportTableView

      };

      if (userIds.length === 0) delete reqData.user_ids;
      if (orgIds.length === 0) delete reqData.organization_ids;
      if (commIds.length === 0) delete reqData.community_ids;

      const res = await getUserList({ reqData });
      setPersonsData(res.user_list);
      if (typeof res.total_count !== 'undefined') {
        setPageCount(Math.ceil(res.total_count / getTableRow(pageType)));
      }

    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }

    setLoading(false);
  }


  // api call to fetch person list for name filter
  const getpersonListForFilter = async () => {

    try {
      let reqData: userListPayload = {
        list_type:Constants.userListType.dropDown, 
        limit: Constants.filterDropDownLimit,
        page_number:userDropDownPage.current,
        query_type: Constants.queryType.dropDown

       };
      if (userSearchText.current !== "") { reqData.name = userSearchText.current;}

      const res = await getUserList({ reqData });
      setPersonsDataforFilter(userDropDownPage.current !== 1 ? [...personsDataforFilter, ...res.user_list]: [...res.user_list]);

      if (typeof res.total_count !== 'undefined')
        totalusers.current = res.total_count;
    

    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  // api call to fetch organization list for name filter
  const getOrganizationListForFilter = async () => {

    try {
      let reqData: OrgReqHeaders = { 
        limit: Constants.filterDropDownLimit,
        page_number:dropDownPage.current,
        query_type: Constants.queryType.dropDown
       };
      if (orgSearchText.current !== "") { reqData.organization_name = orgSearchText.current;}

      const res = await getOrganization({ reqData });

      setOrganizationforFilter(dropDownPage.current !== 1 ? [...organizationforFilter, ...res.organization_list] : [...res.organization_list]);
      if (typeof res.total_count !== 'undefined') totalOrganization.current = res.total_count
      
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }


  const getCommunityListsForFilter = async () => {
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
    dropDownPage.current = dropDownPage.current+1
    getOrganizationListForFilter();  
  }

  const handleCommDropDownPageIncreament = () => {
    commDropDownPage.current = commDropDownPage.current+1
    getCommunityListsForFilter();  
  }

  const handleUserDropDownPageIncreament = () => {
    userDropDownPage.current = userDropDownPage.current+1
    getpersonListForFilter();  
  }

  
  const onSelectPerson = (value) => {
    setSelectedPerson(value)
    setIsSelected(true)
  };

  const onSelectOrganization = (value) => {
    setSelectedOrganization(value)
    setIsSelected(true)

  };

  const onSelectCommunity = (value) => {
    setSlectedCommunity(value)
    setIsSelected(true)

  };

  const handlePersonSearch = (value) => {
    userSearchText.current = value;
    userDropDownPage.current = 1;
    getpersonListForFilter();
  };

  const handleOrganizationSearch = (value) => {
    dropDownPage.current = 1;
    orgSearchText.current = value;
    getOrganizationListForFilter();
  };

  const handleCommunitySearch = (value) => {
    commSearchText.current = value;
    commDropDownPage.current = 1;
    getCommunityListsForFilter();
  };

  const handlePersonScroll = () => {
    if (totalusers.current > personsDataforFilter.length) {
      handleUserDropDownPageIncreament()
    }
  };

  const handleOrganizationScroll = () => {
    if (totalOrganization.current > organizationforFilter.length){
      handleDropDownPageIncreament()
    }
  };

  const handleCommunityScroll = () => {
    if(totalCommunity.current > communityforFilter.length){
      handleCommDropDownPageIncreament()  
    }
  };
  
  const handlePersonToggle = (isOpen) => { // function to get initial list when dropdown opens with non empty search text
    const isOpening = !isOpen;
    if(isOpening && userSearchText.current.length){
      userSearchText.current = "";
      userDropDownPage.current = 1;
      getpersonListForFilter();
    }  
  }

  const handleOrganizationToggle = (isOpen) => { 
    const isOpening = !isOpen;
     if(isOpening && orgSearchText.current.length) {
      orgSearchText.current = "";
      dropDownPage.current = 1;
      getOrganizationListForFilter();
    }
  }
  
  const handleCommunityToggle = (isOpen) => {
    const isOpening = !isOpen;
    if(isOpening && commSearchText.current.length) {
      commSearchText.current = "";
      commDropDownPage.current = 1;
      getCommunityListsForFilter();
    }
  }

  const handleAplyButton = () => {
    if ((selectedPerson.length > 0 || selectedOrganization.length > 0 || selectedCommunity.length > 0 || isSelected) && isSelected) {
      getPersonsTableList({ pageNumber: 1, userIds:selectedPerson, orgIds:selectedOrganization, commIds:selectedCommunity });
      setIsSelected(false)
    }
  }

  let filterList = getPersonFilterList(
    personOptionList,
    onSelectPerson,
    handlePersonSearch,
    handlePersonScroll,
    handlePersonToggle,
    OrganizationOptionList,
    onSelectOrganization,
    handleOrganizationScroll,
    handleOrganizationSearch,
    handleOrganizationToggle,
    communityOptionList,
    onSelectCommunity,
    handleCommunitySearch,
    handleCommunityScroll,
    handleCommunityToggle
  );
  
  const exportAsCSV = async () => {
    try {
      const res = await getUserList({ reqData: { list_type:Constants.userListType.dropDown, 
        query_type: Constants.queryType.reportDetailView
      } });
      const csvFileData = exportDataToSupportCSVFormat({ 
        tableHeader: personExportTableHeader, 
        formatedTablData: formatPersonDataforExport({ data: res.user_list  })
      });
      setCsvExportData(csvFileData);
      // Use effect with "csvExportData" as dependecy gets executed
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
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
    try { 
      const res = await getUserList({ reqData: { list_type:Constants.userListType.table, query_type: Constants.queryType.tableView
      } });      
      generatePDF({
        reportName: pageHeading, 
        headers: personReportTableHeader, 
        data:  formatReportPersonData({ data: res.user_list, isPdf:true })
      });      
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  const printPageAction = () => {
    window.print();
  };

  let bottomButtonList = [
    {
      name: "Export to PDF",
      handleButtonClick: exportAsPDF,
    }
  ];

  let topButtonList = [
    {
      name: "Print",
      handleButtonClick: printPageAction,
    },
    {
      name: "Export to CSV",
      handleButtonClick: exportAsCSV,
    }
  ];

  const handlePageClick = (page) => {
    setPage(page.selected + 1);
  };

  

 useEffect(() => {
    getPersonsTableList({
       userIds: !isSelected ? selectedPerson : [], 
       orgIds: !isSelected ? selectedOrganization : [], 
       commIds: !isSelected ? selectedCommunity : [] });
  }, [page])

  useEffect(() => {
    getpersonListForFilter()
    getOrganizationListForFilter();
    getCommunityListsForFilter();
  }, []);


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

        {!loading && personsData.length === 0 && <NoDataFound />}
        {personsData.length !== 0 &&
          <Table
            tableData={formatReportPersonData({ data: personsData, isPdf:false })}
            tabelHeader={personReportTableHeader}
            pagination={true}
            pageCount={pageCount}
            onPageChange={handlePageClick}
          />}
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
