import PageControl from "../../../components/pageControl/PageControl";
import Table from "../../../components/table/table";
import React, { useState, useRef } from "react";
import getTableRow from "../../../services/tableRow";
import router from "next/router";
import { formatAdminLicenseData } from "../../../helper/tableData";
import { remove_duplicates_from_list } from "../../../helper/removeDuplicates"
import { licenseList } from "../../../services/licenseService";
import { getOrganization } from "../../../services/organizationService";
import { getCommunityList } from "../../../services/communityService";
import Loading from "../../../components/text/loading"
import NoDataFound from "../../../components/text/noDataFound";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import Constants from "../../../lib/Constants";
import { licenseDataTableHeader } from "../../../lib/tableHeader";


export default function License() {
  let pageType = "adminstrative"
  let showBottomButtonList = true;


  const [loading, setLoading] = React.useState(true);
  const [licenseData, setLicenseData] = React.useState([])

  const [organizationData, setOrganizationData] = useState([])
  const [selectedOrganization, setSelectedOrganization] = useState([])

  const [communityData, setCommunityData] = useState([])
  const [commlastIndex, setCommLastIndex] = useState(0)
  const [selectedCommunity, setSelectedCommunity] = useState([])

  const [page, setPage] = React.useState(1)
  const [pageCount, setPageCount] = React.useState(0)

  const [isSelected, setIsSelected] = useState(false)


  let totalOrganization = useRef(0)
  let totalCommunity = useRef(0)
  let orgDropDownPage = useRef(1)
  let commDropDownPage = useRef(1)
  let orgSearchText = useRef("")
  let commSearchText = useRef("")


  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });

  // api call to fetch licence list
  const getLicense = async ({ pageNumber = page, commIds = [], orgIds = [] }) => {

    try {
      let reqData: licenseListPayload = {
        limit: getTableRow(pageType),
        page_number: pageNumber,
        community_ids: commIds,
        organization_ids: orgIds,
        list_type:Constants.userListType.table
      };
      if (commIds.length === 0) delete reqData.community_ids;
      if (orgIds.length === 0) delete reqData.organization_ids;

      const res = await licenseList({ reqData });

      setLicenseData(res.license_list);
      typeof res.total_count !== 'undefined' && setPageCount(Math.ceil(res.total_count / getTableRow(pageType)))

    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
    setLoading(false);
  }

  //api call to fetch org data for filter 
  const getOrganizationData = async () => {
    try {
      let reqData: OrgReqHeaders = { 
        limit: Constants.filterDropDownLimit,
        page_number:orgDropDownPage.current,
        query_type: Constants.queryType.dropDown
        };

      if (orgSearchText.current !== "") { reqData.organization_name = orgSearchText.current;}

        const res = await getOrganization({ reqData });

        setOrganizationData(orgDropDownPage.current !== 1 ? [...organizationData, ...res.organization_list] : [...res.organization_list])

        if (typeof res.total_count !== 'undefined') totalOrganization.current = res.total_count
      

    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
  };


  //api call to fetch community data for filter
  const getCommunityData = async () => {
    try {
      let reqData: communityReqheaders = { 
        limit: Constants.filterDropDownLimit,
        page_number:commDropDownPage.current,
        query_type: Constants.queryType.dropDown
        };

      if (commSearchText.current !== "") { reqData.community_name = commSearchText.current; }
      const res = await getCommunityList({ reqData });

      setCommunityData(commDropDownPage.current !== 1 ? [...communityData, ...res.community_list] : [...res.community_list]);

      if (typeof res.total_count !== 'undefined') totalCommunity.current = res.total_count  
    }
     catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
  };


  const FormattedOrganizationList = organizationData.map(function (option) {
    return { label: option.organization_name, value: option.organization_id };
  });

  const FormattedCommunityList = communityData.map(function (option) {
    return { label: option.community_name, value: option.community_id };
  });

  const handleDropDownPageIncreament = () => {
    orgDropDownPage.current = orgDropDownPage.current+1
    getOrganizationData();  
  }

  const handleCommDropDownPageIncreament = () => {
    commDropDownPage.current = commDropDownPage.current+1
    getCommunityData();  
  }

  const handleCommunitySearch = (value) => {
    commSearchText.current = value;
    commDropDownPage.current = 1;
    getCommunityData();
  };

  const handleCommunityScroll = () => {
    if (totalCommunity.current > communityData.length){
      handleCommDropDownPageIncreament()
    } 
  };

  const handleCommunityChange = (value) => {
    setSelectedCommunity(value)
    setIsSelected(true)
  };

  const handleOrganizationSearch = (value) => {
    orgSearchText.current = value;
    orgDropDownPage.current = 1;
    getOrganizationData();
  };

  const handleOrganizationScroll = () => {
    if (totalOrganization.current > organizationData.length) {
      handleDropDownPageIncreament();
    }
  };

  const handleOrganizationChange = (value) => {
    setSelectedOrganization(value)
    setIsSelected(true)
  };

  const handleOrganizationToggle = (isOpen) => { // function to get initial list when dropdown opens with non empty search text
    const isOpening = !isOpen;
     if(isOpening && orgSearchText.current.length) {
      orgSearchText.current = "";
      orgDropDownPage.current = 1;
      getOrganizationData();
    }
  }
  
  const handleCommunityToggle = (isOpen) => {
    const isOpening = !isOpen;
    if(isOpening && commSearchText.current.length) {
      commSearchText.current = "";
      commDropDownPage.current = 1;
      getCommunityData();  
    }
  }


  const handleButtonClick = () => {
    router.push("/organization/license/add")
  }

  let bottomButtonList = [
    {
      name: "Add License",
      handleButtonClick: handleButtonClick,
    },
  ];

  let filterList = [
    {
      label: "Organization",
      type: "MultiSelectDropDown",
      optionsList: FormattedOrganizationList,
      name: "organization",
      title: "Search for Organization",
      searchText: "Search for  Organization",
      handleChange: handleOrganizationChange,
      noOptionText: "No data found",
      handleSearch: handleOrganizationSearch,
      handleScroll: handleOrganizationScroll,
      handleToggle:handleOrganizationToggle
    },
    {
      label: "Community",
      type: "MultiSelectDropDown",
      optionsList: FormattedCommunityList,
      name: "community",
      title: "Search for Community",
      searchText: "Search for  Community",
      handleChange: handleCommunityChange,
      noOptionText: "No data found",
      handleSearch: handleCommunitySearch,
      handleScroll: handleCommunityScroll,
      handleToggle: handleCommunityToggle
    },
  ];

  const handlePageClick = (page) => {
    setPage(page.selected + 1);
  };

  const filterTableData = (data) => {
    return data.slice(1, getTableRow(pageType));
  };

  const handleAplyButton = () => {
    if ((selectedCommunity.length > 0 || selectedOrganization.length > 0 || isSelected) && isSelected) {
      getLicense({ pageNumber: 1, orgIds: selectedOrganization, commIds: selectedCommunity });
      setIsSelected(false)
    }
  }

  React.useEffect(() => {
    getLicense({
      orgIds: !isSelected ? selectedOrganization : [],
      commIds: !isSelected ? selectedCommunity : []
    });
  }, [page])

  React.useEffect(() => {
    // shallow page load to push tab_id to url
    router.push({
      pathname: '/administrative-data',
      query: { tab_id: '3' }
    }, undefined, { shallow: true }
    )

    getOrganizationData();
    getCommunityData();
  }, [])

  return (
    <div className={"container"}>
      <PageControl
        filterList={filterList}
        handleAplyButton={handleAplyButton}
        bottomButtonList={bottomButtonList}
        showBottomButtonList={showBottomButtonList}
      />
      <section className="page-content">
        {loading && <Loading />}
        {!loading && licenseData.length === 0 && <NoDataFound />}
        {licenseData.length !== 0 &&
          <Table
            tableData={formatAdminLicenseData({ data: licenseData })}
            tabelHeader={licenseDataTableHeader}
            pagination={true}
            pageCount={pageCount}
            onPageChange={handlePageClick}
          />}
      </section>
      {errorData.state && (
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={"Error"}
        />
      )}
    </div>
  );
}
