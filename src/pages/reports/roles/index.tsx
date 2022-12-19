import Table from "../../../components/table/table";
import PageControl from "../../../components/pageControl/PageControl";
import React, { useEffect, useRef, useState } from "react";
import getTableRow from "../../../services/tableRow";
import { getOrganization } from "../../../services/organizationService";
import { getCommunityList } from "../../../services/communityService";
import { getRoleList, getRoleReport } from "../../../services/roleService";
import { formatRoleReport } from "../../../helper/tableData";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import Loading from "../../../components/text/loading";
import NoDataFound from "../../../components/text/noDataFound";
import {
  formatCommunityOptionsList,
  formatOrganizationOptionsList,
  formatRolelList,
} from "../../../helper/formatFilterList";
import Constants from "../../../lib/Constants";
import { generatePDF, exportDataToSupportCSVFormat } from "../../../helper/reportGenerator";
import { CSVLink } from "react-csv";
import { roleReportTableHeader } from "../../../lib/tableHeader";

export default function Role() {
  let pageHeading = "Role Report";
  let showTopButtonList = true;
  let showbottomButtonList = true;
  let pageType = "adminstrative";

  const [organizationforFilter, setOrganizationforFilter] = useState([]);

  const [communityforFilter, setCommunityforFilter] = useState([]);

  const [roleforFilter, setRoleforFilter] = useState([]);
  const [roleLastIndex, setRoleLastIndex] = useState(0);

  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [roleReportList, setRoleReportList] = useState([]);

  const [isSelected, setIsSelected] = useState(false);
  const [loading, setLoading] = useState(true);

  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });
  const [csvExportData, setCsvExportData] = useState([])
  let csvLink: any = useRef();

  let totalOrganization = useRef(0);
  let filterOrgIds = useRef([]);

  let totalCommunity = useRef(0);
  let filterCommIds = useRef([]);

  let totalRole = useRef(0);
  let filterRoleIds = useRef([]);

  let orgDropDownPage = useRef(1)
  let commDropDownPage = useRef(1)

  let orgSearchText = useRef("");
  let commSearchText = useRef("");

  let roleDropDownPage = useRef(1);
  let roleSearchText = useRef("");



  useEffect(() => {
    getOrganizationListForFilter();
    getCommunityListForFilter();
    getRoleFilterList();
  }, []);

  useEffect(() => {
    getRoleReportList({commIds:!isSelected ?filterCommIds.current:[], orgIds:!isSelected ? filterOrgIds.current : [], roleIds:!isSelected? filterRoleIds.current : [] });
  }, [pageNumber]);

  //api to get organization filter list
  const getOrganizationListForFilter = async () => {
    try {
      let reqData: OrgReqHeaders = {
        limit:Constants.filterDropDownLimit,
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
      if (commSearchText.current !== "") reqData.community_name = commSearchText.current;

      const res = await getCommunityList({ reqData });
      setCommunityforFilter(commDropDownPage.current !== 1 ? [...communityforFilter, ...res.community_list] : [...res.community_list]);
      if (typeof res.total_count !== "undefined")
        totalCommunity.current = res.total_count;
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  //api call to get role filter list
  const getRoleFilterList = async () => {
    try {
      let reqData: roleListPayload = {
        limit: Constants.filterDropDownLimit,
        page_number:roleDropDownPage.current
      };
      if (roleSearchText.current !== "") reqData.role_name = roleSearchText.current;
      const res = await getRoleList({ reqData });
      setRoleforFilter(roleDropDownPage.current !== 1 ? [...roleforFilter, ...res.role_list] : [...res.role_list]);
      if (typeof res.total_count !== "undefined") totalRole.current = res.total_count;
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  //api call to get role report list
  const getRoleReportList = async ({
    page = pageNumber,
    orgIds = [],
    commIds = [],
    roleIds = [],
  }) => {
    try {
      let reqData: roleReportPayload = {
        limit: getTableRow(pageType),
        page_number: page,
      };
      if (orgIds.length > 0) reqData.organization_ids = filterOrgIds.current;
      if (commIds.length > 0) reqData.community_ids = filterCommIds.current;
      if (roleIds.length > 0) reqData.role_ids = filterRoleIds.current;

      const res = await getRoleReport({ reqData });

      const formatedTableData = formatRoleReport({ data: res.role_list });
      setRoleReportList(formatedTableData);

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

  //format option list for organization, community and role filter
  const OrganizationOptionList = formatOrganizationOptionsList(organizationforFilter);
  const communityOptionList = formatCommunityOptionsList(communityforFilter);
  const RoleOptionList = formatRolelList(roleforFilter);



  const handleDropDownPageIncreament = () => {
    orgDropDownPage.current += 1;
    getOrganizationListForFilter();  
  }

  const handleCommDropDownPageIncreament = () => {
    commDropDownPage.current += 1;
    getCommunityListForFilter();  
  }

  const handleRoleDropDownPageIncreament = () => {
    roleDropDownPage.current += 1;
    getRoleFilterList()  }

  //handle search, scroll and onchange of organization,community and role filter
  const handleOrgSearch = (organization) => {
    orgSearchText.current = organization;
    orgDropDownPage.current = 1;
    getOrganizationListForFilter();
  };

  const handleOrgScroll = () => {
    if (totalOrganization.current > organizationforFilter.length) {
      handleDropDownPageIncreament()    }
  };

  const handleOrgChange = (orgIds) => {
    filterOrgIds.current = orgIds;
    setIsSelected(true);
  };

  const handleCommSearch = (community) => {
    commSearchText.current = community;
    commDropDownPage.current = 1;
    getCommunityListForFilter();
  };

  const handleCommScroll = () => {
    if (totalCommunity.current > communityforFilter.length) {
      handleCommDropDownPageIncreament()    }
  };

  const handleCommChange = (orgIds) => {
    filterCommIds.current = orgIds;
    setIsSelected(true);
  };

  const handleRoleSearch = (role) => {
    roleDropDownPage.current = 1;
    roleSearchText.current = role;
    getRoleFilterList();
  };

  const handleRoleScroll = () => {
    if (totalRole.current > roleforFilter.length) handleRoleDropDownPageIncreament()
  };

  const handleRoleChange = (roleIds) => {
    filterRoleIds.current = roleIds;
    setIsSelected(true);
  };


  const handleOrganizationToggle = (isOpen) => { // function to get initial list when dropdown opens with non empty search text
    const isOpening = !isOpen;
     if(isOpening && orgSearchText.current.length) {
      orgSearchText.current = "";
      orgDropDownPage.current = 1;
      getOrganizationListForFilter();
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

  const handleRoleToggle = (isOpen) => {
    const isOpening = !isOpen;
    if(isOpening && roleSearchText.current.length) {
      roleSearchText.current = "";
      roleDropDownPage.current = 1;
      getRoleFilterList();
    }
  }

  const handlePageClick = (page) => {
    setPageNumber(page.selected + 1);
  };

  //handle Apply button
  const handleAplyButton = () => {
    if (
      (filterRoleIds.current.length > 0 ||
        filterOrgIds.current.length > 0 ||
        filterCommIds.current.length > 0 ||
        isSelected) &&
      isSelected
    ) {
      // condition to avoid unnecessary -
      //api call on apply button
      getRoleReportList({
        orgIds: filterOrgIds.current,
        commIds: filterCommIds.current,
        roleIds: filterRoleIds.current,
        page: 1,
      }); //passing page 1 to get total count to decide page count on dropdown filter
      setIsSelected(false);
    }
  };

  let filterList = [
    {
      label: "Organizations",
      type: "MultiSelectDropDown",
      optionsList: OrganizationOptionList,
      name: "Organization",
      title: "Search for Organization",
      searchText: "Search for Organization",
      handleChange: handleOrgChange,
      noOptionText: "No data found",
      handleSearch: handleOrgSearch,
      handleScroll: handleOrgScroll,
      handleToggle:handleOrganizationToggle
    },
    {
      label: "Communities",
      type: "MultiSelectDropDown",
      optionsList: communityOptionList,
      name: "Community",
      title: "Search for Community",
      searchText: "Search for Community",
      handleChange: handleCommChange,
      noOptionText: "No data found",
      handleSearch: handleCommSearch,
      handleScroll: handleCommScroll,
      handleToggle:handleCommunityToggle
    },
    {
      label: "Roles",
      type: "MultiSelectDropDown",
      optionsList: RoleOptionList,
      name: "Role",
      title: "Search for Role",
      searchText: "Search for Role",
      handleChange: handleRoleChange,
      noOptionText: "No data found",
      handleSearch: handleRoleSearch,
      handleScroll: handleRoleScroll,
      handleToggle: handleRoleToggle
    },
  ];

  const exportAsCSV = async () => {
    const res = await getRoleReport({ reqData: {} });
    const csvFileData = exportDataToSupportCSVFormat({ 
      tableHeader:roleReportTableHeader, 
      formatedTablData: formatRoleReport({ data: res.role_list })
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
    const res = await getRoleReport({ reqData: {} });
    generatePDF({
      reportName: pageHeading, 
      headers: roleReportTableHeader, 
      data: formatRoleReport({ data: res.role_list })
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
  ];

  let bottomButtonList = [
    {
      name: "Export to PDF",
      handleButtonClick: exportAsPDF,
    },
  ];

  return (
    <div className="container">
      <PageControl
        pageHeading={pageHeading}
        filterList={filterList}
        topButtonList={topButtonList}
        bottomButtonList={bottomButtonList}
        showBottomButtonList={showbottomButtonList}
        showTopButtonList={showTopButtonList}
        handleAplyButton={handleAplyButton}
      />
      <section className="page-content">
        {loading && <Loading />}
        {!loading && roleReportList.length === 0 && <NoDataFound />}
        {roleReportList.length > 0 && (
          <Table
            tableData={roleReportList}
            tabelHeader={roleReportTableHeader}
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
