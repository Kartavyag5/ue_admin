import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import Table from "../../components/table/table";
import PageControl from "../../components/pageControl/PageControl";
import Loading from "../../components/text/loading"
import NoDataFound from "../../components/text/noDataFound";
import ErrorPopup from "../../components/popup/ErrorPopup";
import getTableRow from "../../services/tableRow";
import { getUserList } from "../../services/personService";
import { formatPersonsData } from "../../helper/tableData";
import { personTableHeader } from "../../lib/tableHeader";
import { getOrganization } from "../../services/organizationService";
import { getCommunityList } from "../../services/communityService";
import Constants from "../../lib/Constants";


export default function Person() {
  const router = useRouter()
  
  let pageType = "other"
  let pageHeading = "Person Data Maintenance";
  let showBackButton = false;
  let showTopButtonList = false;
  let showbottomButtonList = true;

  let commIDs = router.query.commIds;
  let orgId = router.query.orgId
  
  const [loading, setLoading] = React.useState(true);
  const [personsData, setPersonsData] = React.useState([])
  const [personsDataforFilter, setPersonsDataforFilter] = React.useState([])
  const [organizationforFilter, setOrganizationforFilter] = React.useState([])
  const [communityforFilter, setCommunityforFilter] = React.useState([])
  const [page, setPage] = React.useState(1)
  const [pageCount, setPageCount] = React.useState(0)
  const [selectedPerson, setSelectedPerson] = React.useState([])
  const [selectedOrganization, setSelectedOrganization] = React.useState([])
  const [selectedCommunity, setSelectedCommunity] = React.useState([])

  const [isSelected, setIsSelected] = React.useState(false)


  let totalusers = useRef(0)
  let totalOrganization = useRef(0);
  let totalCommunity = useRef(0);
  let orgDropDownPage = useRef(1);
  let commDropDownPage = useRef(1);
  let userDropDownPage = useRef(1);
  let userSearchText = useRef("");
  let orgSearchText = useRef("");
  let commSearchText = useRef("");


  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });


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
        query_type: Constants.queryType.tableView
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
      if(userSearchText.current !== "") { reqData.name = userSearchText.current;  }
        const res = await getUserList({ reqData });
        setPersonsDataforFilter(userDropDownPage.current !== 1 ? [...personsDataforFilter, ...res.user_list] : [...res.user_list]);
      if (typeof res.total_count !== 'undefined')
        totalusers.current = res.total_count;
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  // api call to fetch organization list for name filter
  const getOrganizationListForFilter = async () => {

    try {
      let reqData: OrgReqHeaders = {
        // limit:Constants.filterDropDownLimit, // TODO: removed for default fetching
        // page_number: orgDropDownPage.current,
        query_type:Constants.queryType.dropDown
      };
      if (orgSearchText.current !== "") { reqData.organization_name = orgSearchText.current}
        const res = await getOrganization({ reqData });
        setOrganizationforFilter(orgDropDownPage.current !== 1 ? [...organizationforFilter, ...res.organization_list] : [...res.organization_list] );
        if (typeof res.total_count !== 'undefined') totalOrganization.current = res.total_count
      
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  // api call to fetch community list for name filter
  const getCommunityListForFilter = async () => {

    try {
      let reqData: communityReqheaders = {
        // limit: Constants.filterDropDownLimit,// TODO: removed for default fetching
        // page_number:commDropDownPage.current,
        query_type: Constants.queryType.dropDown
      };
      if (commSearchText.current !== "") { reqData.community_name = commSearchText.current;}
       
      const res = await getCommunityList({ reqData });
       
      setCommunityforFilter(commDropDownPage.current !== 1 ? [...communityforFilter, ...res.community_list] : [...res.community_list]);
       
      if (typeof res.total_count !== 'undefined') 
        totalCommunity.current = res.total_count
      
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }


  const personOptionList = personsDataforFilter.map(function (option) {
    return { label: option.first_name + ' ' + option.last_name, value: option.user_id };
  });

  const OrganizationOptionList = organizationforFilter.map(function (option) {
    return { label: option.organization_name, value: option.organization_id };
  });

  const communityOptionList = communityforFilter.map(function (option) {
    return { label: option.community_name, value: option.community_id };
  });



  const handleUserDropDownPageIncreament = () => {
    userDropDownPage.current = userDropDownPage.current+1
    getpersonListForFilter();  
  }

  const handleDropDownPageIncreament = () => {
    orgDropDownPage.current = orgDropDownPage.current+1
    getOrganizationListForFilter();  
  }


  const handleCommDropDownPageIncreament = () => {
    commDropDownPage.current = commDropDownPage.current+1
    getCommunityListForFilter();  
  }


  const onSelectPerson = (value) => {
    setSelectedPerson(value)
    setIsSelected(true)
  };

  const handlePersonScroll = () => {
    if (totalusers.current > personsDataforFilter.length) {
      handleUserDropDownPageIncreament()
    }
  };

  const handlePersonSearch = (value) => {
    userSearchText.current = value;
    userDropDownPage.current = 1;
    getpersonListForFilter();
  };



  const onSelectOrganization = (value) => {
    setSelectedOrganization(value)
    setIsSelected(true)

  };

  const handleOrganizationScroll = () => {
    if (totalOrganization.current > organizationforFilter.length ) {
      handleDropDownPageIncreament()
    }
  };

  const handleOrganizationSearch = (value) => {
    orgDropDownPage.current = 1;
    orgSearchText.current = value;
    getOrganizationListForFilter();
  };



  const onSelectCommunity = (value) => {
    setSelectedCommunity(value)
    setIsSelected(true)

  };

  const handleCommunitySearch = (value) => {
    commDropDownPage.current = 1;
    commSearchText.current = value;
    getCommunityListForFilter();
  };

  const handleCommunityScroll = () => {
    if (totalCommunity.current > communityforFilter.length){
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

  const handleAplyButton = () => {
    if ((selectedPerson.length > 0 || selectedOrganization.length > 0 || selectedCommunity.length > 0 || isSelected) && isSelected) {
      getPersonsTableList({ pageNumber: 1, userIds: selectedPerson, orgIds: selectedOrganization, commIds: selectedCommunity });
      setIsSelected(false)
    }
  }

  const handleAddButtonClick = () => {
    router.push('/persons-data/add')
  }

  let filterList = [
    {
      label: "Name",
      type: "MultiSelectDropDown",
      optionsList: personOptionList,
      name: "name",
      title: "Search for Person",
      searchText: "Search for Person",
      handleChange: onSelectPerson,
      noOptionText: "No data found",
      handleSearch: handlePersonSearch,
      handleScroll: handlePersonScroll,
      handleToggle:handlePersonToggle
    },
    {
      label: "Organization",
      type: "MultiSelectDropDown",
      optionsList: OrganizationOptionList,
      name: "Organization",
      title: "Search for Organization",
      searchText: "Search for Organization",
      handleChange: onSelectOrganization,
      noOptionText: "No data found",
      handleSearch: handleOrganizationSearch,
      handleScroll: handleOrganizationScroll,
      defaultValues: typeof orgId !== "undefined" ? [parseInt(orgId.toString())] : [],
      handleToggle:handleOrganizationToggle
    },
    {
      label: "Community",
      type: "MultiSelectDropDown",
      optionsList: communityOptionList,
      name: "community",
      title: "Search for Community",
      searchText: "Search for Community",
      handleChange: onSelectCommunity,
      noOptionText: "No data found",
      handleSearch: handleCommunitySearch,
      handleScroll: handleCommunityScroll,
      defaultValues: typeof commIDs !== "undefined" ? (commIDs.toString()).split(",").map(Number) : [],
      handleToggle:handleCommunityToggle
    },
  ];

  let bottomButtonList = [
    {
      name: "Add Person",
      handleButtonClick: handleAddButtonClick,
    }
  ];

  const handlePageClick = (page) => {
    setPage(page.selected + 1);
    setIsSelected(false) // to make api call with  default value  when page changes
    getPersonsTableList({
      userIds: !isSelected ? selectedPerson : [],
      orgIds: !isSelected ? selectedOrganization : [],
      commIds: !isSelected ? selectedCommunity : [],
      pageNumber:page.selected+1
    });
  };
  
  React.useEffect(() => {
    getOrganizationListForFilter();
    getCommunityListForFilter()
    getpersonListForFilter()
    getPersonsTableList({                            // initial api call on default value  fetch 
        userIds: !isSelected ? selectedPerson : [],
        orgIds: !isSelected ? (orgId  ? [orgId] : []) : [],
        commIds: !isSelected ? (commIDs ? (commIDs.toString()).split(",").map(Number) : []) : [],
        pageNumber: 1
      });
  }, [])

  return (
    <div className={"container"}>
      <PageControl
        pageHeading={pageHeading}
        filterList={filterList}
        bottomButtonList={bottomButtonList}
        showBottomButtonList={showbottomButtonList}
        showBackButton={showBackButton}
        showTopButtonList={showTopButtonList}
        handleAplyButton={handleAplyButton}
      />
      <section className="page-content">
        {loading && <Loading />}
        {!loading && personsData.length === 0 && <NoDataFound />}
        {personsData.length !== 0 &&
          <Table
            tableData={formatPersonsData({ data: personsData })}
            tabelHeader={personTableHeader}
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
