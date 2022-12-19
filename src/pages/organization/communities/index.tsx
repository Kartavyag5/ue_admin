import React, { useContext, useRef, useState } from "react";
import router, { useRouter } from "next/router";
import Table from "../../../components/table/table";
import PageControl from "../../../components/pageControl/PageControl";
import Loading from "../../../components/text/loading"
import NoDataFound from "../../../components/text/noDataFound";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import getTableRow from "../../../services/tableRow";
import { getCommunityList } from "../../../services/communityService";
import { formatCommunityData } from "../../../helper/tableData";
import { communityTableHeader } from "../../../lib/tableHeader";
import { RoleContext } from "../../../context/roleContext";

import Constants from "../../../lib/Constants";
import { getTopUserRole } from "../../../helper/roles";

export default function Community() {

  const router = useRouter();

  const roleDetails = useContext(RoleContext);
  const addNewCommAllowedRoles = ["SUPER_ADMIN", "UE_CORP_ADMIN", "ORGANIZATION_ADMIN"];

  const [pageCount, setPageCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [communityList, setCommunityList] = useState([])
  const [CommunityListforFilter, setCommunityListforFilter] = useState([])
  const [page, setPage] = useState(1)
  const [lastIndex, setLastIndex] = useState(0)
  const [isSelected, setIsSelected] = useState(false)


  let totalRows = useRef(0);
  let selectedCommunityIds = useRef([]);

  let pageType = "adminstrative";
  let organizationId = router.query.organizationId;
  let organizationName = router.query.organizationName;

  let pageHeading = "Community Maintenance";
  let subHeading = typeof organizationName !== 'undefined' ? organizationName.toString() : '';
  let showBackButton = true;
  let backBtnPath = "/organization";
  let showTopButtonList = false;
  let showbottomButtonList = true;

  let commDropDownPage = useRef(1)
  let commSearchText = useRef("")



  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });

  React.useEffect(() => {
    if(router.query.organizationId) getCommunity({commIds:!isSelected ? selectedCommunityIds.current : []});
  }, [router.query])

  React.useEffect(() => {
    if (typeof router.query.organizationId !== 'undefined') localStorage.setItem('organizationId', organizationId.toString());
    if (typeof router.query.organizationName !== 'undefined') localStorage.setItem('organizationName', organizationName.toString());
  }, [])


  const getCommunity = async ({commIds=[], pageNumber=page}) => {

    try {
      let reqData: communityReqheaders = { 
        organization_id: router.query.organizationId, 
        limit: getTableRow(pageType),
        page_number : pageNumber, 
        community_ids : commIds,
        query_type: Constants.queryType.tableView
      };
      if (commIds.length === 0) delete reqData.community_ids
      

      const res = await getCommunityList({ reqData });

      setCommunityList(res.community_list);


      //ON FIRST LOAD , FILTER DATA FROM TABLE VIEW API
      if (CommunityListforFilter.length === 0) {
        setCommunityListforFilter(res.community_list);
        res.community_list.length > 0 && setLastIndex(res.community_list[res.community_list.length - 1].community_id)
      }

      if (pageNumber === 1) {
        totalRows.current = res.total_count;
        typeof res.total_count !== 'undefined' && setPageCount(Math.ceil(res.total_count / getTableRow(pageType)))
      }

    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }

    setLoading(false);
  }

  const getCommunityListForFilter = async () => {

    try {
      let reqData: communityReqheaders = { 
        organization_id: organizationId,
        limit: Constants.filterDropDownLimit,
        page_number:commDropDownPage.current,
        query_type: Constants.queryType.dropDown
        };

      if (commSearchText.current !== "") {reqData.community_name = commSearchText.current };

      const res = await getCommunityList({ reqData });

      setCommunityListforFilter(commDropDownPage.current !== 1 ? [...CommunityListforFilter, ...res.community_list] : [...res.community_list]);

      if(typeof res.total_count !== 'undefined')
           totalRows.current = res.total_count;  
    }
     catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  const formattedCommunityOptionList =CommunityListforFilter.map(function (option) {
    return { label: option.community_name, value: option.community_id };
  })

  const handleCommDropDownPageIncreament = () => {
    commDropDownPage.current = commDropDownPage.current+1
    getCommunityListForFilter();  
  }

  const handleSearch = (value) => {
    commSearchText.current = value;
    commDropDownPage.current = 1;
    getCommunityListForFilter();
  };

  const handleScroll = () => {
    if (totalRows.current > CommunityListforFilter.length){
      handleCommDropDownPageIncreament()
    } 
  };

  const handleChange = (value) => {
    selectedCommunityIds.current = value
    setIsSelected(true)

  };

  const handleCommunityToggle = (isOpen) => { // function to get initial list when dropdown opens with non empty search text
    const isOpening = !isOpen;
    if(isOpening && commSearchText.current.length) {
      commSearchText.current = "";
      commDropDownPage.current = 1;
      getCommunityListForFilter();
    }
  }


  let filterList = [
    {
      label: "Communities",
      type: "MultiSelectDropDown",
      optionsList: formattedCommunityOptionList,
      name: "Communities",
      title: "Search for Community",
      searchText: "Search for Community",
      handleChange: handleChange,
      noOptionText: "No data found",
      handleSearch: handleSearch,
      handleScroll: handleScroll,
      handleToggle: handleCommunityToggle
    },
  ];

  const handleAddPersonClick = (evt) => {
    router.push(`/persons-data/?commIds=${selectedCommunityIds.current}&orgId=${router.query.organizationId}`);
  };

  const handleAddButtonClick = () => {
    router.push(`/organization/communities/add?organizationId=${organizationId}&organizationName=${organizationName}`)
  }

  const handleAddLicenseClick =() => {
    router.push("/organization/license/add")
  }

  let bottomButtonList = [
    {
      name: "Add License",
      handleButtonClick: handleAddLicenseClick,
      isDisabled: Constants.rolePermissions.rolesNotAllowedToAddOrEditLicense.includes(getTopUserRole(roleDetails)),

    },
    {
      name: "View/Edit/Add Person",
      handleButtonClick: handleAddPersonClick,
    },
    {
      name: "Add Community",
      isDisabled: ! addNewCommAllowedRoles.includes(getTopUserRole(roleDetails)),
      handleButtonClick: handleAddButtonClick,
    },
  ];

  const handlePageClick = (page) => {
    setPage(page.selected + 1);
    getCommunity({commIds:!isSelected ? selectedCommunityIds.current : [], pageNumber:page.selected+1});

  };

  const handleAplyButton = () => {
    if ((selectedCommunityIds.current.length > 0 || isSelected) && isSelected)
    {      
      getCommunity({commIds:selectedCommunityIds.current, pageNumber:1});
    }    
    setIsSelected(false)

  }

  const handleBackbutton = () => {
    router.push(backBtnPath)
  }

  return (
    <div className={"container"}>
      <PageControl
        pageHeading={pageHeading}
        subHeading={subHeading}
        filterList={filterList}
        bottomButtonList={bottomButtonList}
        showBottomButtonList={showbottomButtonList}
        showBackButton={showBackButton}
        handleBackButton={handleBackbutton}
        showTopButtonList={showTopButtonList}
        handleAplyButton={handleAplyButton}
      />

      <section className="page-content">
        {loading && <Loading />}
        {!loading && communityList.length === 0 && <NoDataFound />}
        {communityList.length !== 0 &&
          <Table
            tableData={formatCommunityData({ data: communityList })}
            tabelHeader={communityTableHeader}
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
    </div>
  );
}

