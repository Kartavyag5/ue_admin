import PageControl from "../../../components/pageControl/PageControl";
import Table from "../../../components/table/table";
import React, {useEffect, useRef, useState } from "react";
import getTableRow from "../../../services/tableRow";
import {formatExportLicenseData, formatReportLicenseData } from "../../../helper/tableData";
import { getLicenseListReport} from "../../../services/licenseService";
import Loading from "../../../components/text/loading";
import NoDataFound from "../../../components/text/noDataFound";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import { formatCommunityOptionsList,formatOrganizationOptionsList } from "../../../helper/formatFilterList";
import Constants from "../../../lib/Constants";
import { generatePDF, exportDataToSupportCSVFormat } from "../../../helper/reportGenerator";
import { CSVLink } from "react-csv";
import { licenseExportTableHeader, licenseReportTableHeader } from "../../../lib/tableHeader";
import { getOrganization } from "../../../services/organizationService";
import { getCommunityList } from "../../../services/communityService";

export default function License() {
  const [loading, setLoading] = useState(true);
  const [licenseData, setLicenseData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [organizationList, setOrganizationList] = useState([]);  
  const [communityList, setCommunityList] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });
  const [csvExportData, setCsvExportData] = useState([])

  let csvLink: any = useRef();
  
  let pageType = "other";
  let pageHeading = "License Report";

  let totalOrgEntry = useRef(0)
  let orgSearchText = useRef("")
  let orgDropDownPage =  useRef(1)
  let filterOrgIds = useRef([])


  let totalCommEntry = useRef(0)
  let commSearchText = useRef("")
  let commDropDownPage =  useRef(1)
  let filterCommIds = useRef([])

  
  const handleDropDownPageIncreament = () => {
    orgDropDownPage.current += 1;
    getOrganizationList();
  }

  const handleSearch = (value) => {
    orgSearchText.current = value;
    orgDropDownPage.current = 1;
    getOrganizationList()
  };

  const handleScroll = () => {
    if(totalOrgEntry.current > organizationList.length) handleDropDownPageIncreament();
  };

  const handleChange = (value) => {
    filterOrgIds.current = value;
    setIsSelected(true);
  };

  const handleOrgToggle = (isOpen) => {
    const isOpening = !isOpen;
     if(isOpening && orgSearchText.current.length) {
      orgSearchText.current = "";
      orgDropDownPage.current = 1;
      getOrganizationList();
    }
  }


  const handleCommDropDownPageIncreament = () => {
    commDropDownPage.current += 1;
    getCommuntyFilterList();
  }

  const handleCommSearch = (value) => {
    commSearchText.current = value;
    commDropDownPage.current = 1;
    getCommuntyFilterList();
  };

  const handleCommScroll = () => {
    if(totalCommEntry.current > communityList.length) handleCommDropDownPageIncreament();
  };

  const handleCommChange = (value) => {
    filterCommIds.current = value;
    setIsSelected(true);
  };


  const handleCommToggle = (isOpen) => {
    const isOpening = !isOpen;
     if(isOpening && commSearchText.current.length) {
      commSearchText.current = "";
      commDropDownPage.current = 1;
      getCommuntyFilterList();
    }
  }

  const exportAsCSV = async () => {
    const res = await getLicenseListReport({ reqData: {} });
    const csvFileData = exportDataToSupportCSVFormat({ 
      tableHeader:licenseExportTableHeader, 
      formatedTablData: formatExportLicenseData({ data: res.license_list })
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
    const res = await getLicenseListReport({ reqData: {} });
    generatePDF({
      reportName: pageHeading, 
      headers: licenseReportTableHeader, 
      data: formatReportLicenseData({ data: res.license_list, isPdf:true})
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

  const FormattedOptionList = formatOrganizationOptionsList(organizationList)
  const FormattedCommOptionList = formatCommunityOptionsList(communityList)


  // api call to fetch licence list
  const getLicense = async ({
    pageNumber = page,
    orgIds = [],
    commIds = []
  }) => {
    try {
      let reqData: licenseListPayload = {
        limit: getTableRow(pageType),
        page_number: pageNumber,
        list_type:Constants.userListType.table
      };

      if(orgIds.length) reqData.organization_ids = orgIds;
      if(commIds.length) reqData.community_ids = commIds;

      const res = await getLicenseListReport({ reqData });
      setLicenseData(res.license_list);
      typeof res.total_count !== "undefined" &&
        setPageCount(Math.ceil(res.total_count / getTableRow(pageType)));
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
    setLoading(false);
  };

  //api call for organization filter list
  const getOrganizationList = async () => {
    try {
      let reqData: OrgReqHeaders = {
        limit: Constants.filterDropDownLimit,
        page_number:orgDropDownPage.current,
        query_type:Constants.queryType.dropDown
      };
      if(orgSearchText.current !== "")  reqData.organization_name = orgSearchText.current
      const res = await getOrganization({ reqData });
      setOrganizationList(orgDropDownPage.current !== 1 ? [...organizationList, ...res.organization_list] : [...res.organization_list])
      if (res.total_count) totalOrgEntry.current = res.total_count;
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };


  //api call for community filter list
  const getCommuntyFilterList = async () => {
    try {
      let reqData: communityReqheaders = {
        limit: Constants.filterDropDownLimit,
        page_number:commDropDownPage.current,
        query_type: Constants.queryType.dropDown
      };
      if(commSearchText.current !== "")  reqData.community_name = commSearchText.current
      const res = await getCommunityList({ reqData });
      setCommunityList(commDropDownPage.current !== 1 ? [...communityList, ...res.community_list] : [...res.community_list])
      if (res.total_count) totalCommEntry.current = res.total_count;
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  let filterList = [
    {
      label: "Organizations",
      type: "MultiSelectDropDown",
      optionsList: FormattedOptionList,
      name: "Organization",
      title: "Search for Organization",
      searchText: "Search for Organization",
      handleChange: handleChange,
      noOptionText: "No data found",
      handleSearch: handleSearch,
      handleScroll: handleScroll,
      handleToggle: handleOrgToggle 
    },
    {
      label: "Communities",
      type: "MultiSelectDropDown",
      optionsList: FormattedCommOptionList,
      name: "Community",
      title: "Search for Community",
      searchText: "Search for Community",
      handleChange: handleCommChange,
      noOptionText: "No data found",
      handleSearch: handleCommSearch,
      handleScroll: handleCommScroll,
      handleToggle: handleCommToggle 
    },
  ];

  const handlePageClick = (page) => {
    setPage(page.selected + 1);
  };

  const handleAplyButton = () => {
    if (( filterOrgIds.current.length > 0 || filterCommIds.current.length > 0 || isSelected) && isSelected) {
      getLicense({ pageNumber: 1, orgIds: filterOrgIds.current, commIds: filterCommIds.current});
      setIsSelected(false);
    }
  };

 useEffect(() => {
    getLicense({orgIds: !isSelected ? filterOrgIds.current : [], commIds : !isSelected ? filterCommIds.current : []});
  }, [page]);

 useEffect(() => {
  getOrganizationList();
  getCommuntyFilterList();
  }, []);

  return (
    <div className={"container"}>
      <PageControl
        pageHeading={"License Report"}
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
        {!loading && licenseData.length === 0 && <NoDataFound />}

        {licenseData.length !== 0 && (
          <Table
            tableData={formatReportLicenseData({ data: licenseData, isPdf:false })}
            tabelHeader={licenseReportTableHeader}
            pagination={true}
            pageCount={pageCount}
            onPageChange={handlePageClick}
          />
        )}
      </section>
      {errorData.state && (
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={"Error"}
        />
      )}
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
