import React, { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/dist/client/router";
import Table from "../../components/table/table";
import PageControl from "../../components/pageControl/PageControl";
import NoDataFound from "../../components/text/noDataFound";
import ErrorPopup from "../../components/popup/ErrorPopup";
import Loading from "../../components/text/loading"
import getTableRow from "../../services/tableRow";
import { getOrganization } from "../../services/organizationService";
import { formatOrganizationData } from "../../helper/tableData";
import { OrganizationTableHeader } from "../../lib/tableHeader";
import { RoleContext } from "../../context/roleContext";
import { getTopUserRole } from "../../helper/roles";
import Constants from "../../lib/Constants";


export default function Organization() {

  const roleDetails = useContext(RoleContext);
  const addNewOrgAllowedRoles = ["SUPER_ADMIN", "UE_CORP_ADMIN", "ORGANIZATION_ADMIN"];
  
  let router = useRouter();
  let pageType = "other";
  let pageHeading = "Organization Maintenance";
  let showbottomButtonList = true;

  const [loading, setLoading] = useState(true); 

  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const [formatedTableData, setFormatedTableData] = useState([]);

  const [organizationFilterData, setOrganizationFilterData] = useState([]);

  const [selectedOrganization, setSelectedOrganization] = useState([]);
  const [isSelected, setIsSelected] = useState(false)


  let totalEntries = useRef(0);
  let dropDownPage = useRef(1)
  let searchText = useRef("")

  const [errorData, setErrorData] = React.useState({
    state: false,
    message: "",
  }); 

  useEffect(() => {
    getOrganizationList({orgIds:!isSelected ? selectedOrganization : []});  
  }, [pageNumber]);

  useEffect(() =>{ // added useeffect to call filter list (same orgnization ids were getting in the response)
    getOrganizationFilterList()
  }, [])

  // api call to get table data
  const getOrganizationList = async ({orgIds=[], page = pageNumber}) => {
    try {
      const reqData = {
        page_number: page, // Initially load page 1
        limit: getTableRow(pageType),
        organization_ids: orgIds,
        query_type: Constants.queryType.detailView
      };
        
      if(orgIds.length === 0) delete reqData.organization_ids;

      const res = await getOrganization({ reqData });

      const formatedTableData = formatOrganizationData({data: res.organization_list});
      setFormatedTableData(formatedTableData);

      if(page === 1) {
          totalEntries.current = res.total_count;
          res.total_count && setPageCount(Math.ceil(res.total_count / getTableRow(pageType)));
        }        
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });        }

    setLoading(false);
  };


  // api call to get filter list
  const getOrganizationFilterList = async () => {
    try {
      let reqData:OrgReqHeaders = {
        limit: Constants.filterDropDownLimit,
        page_number:dropDownPage.current,
        query_type:Constants.queryType.dropDown
      };

      if(searchText.current !== "") reqData.organization_name = searchText.current;

      const res = await getOrganization({ reqData });

      setOrganizationFilterData(dropDownPage.current !==1 ? [...organizationFilterData,...res.organization_list] : [...res.organization_list]);

      if (typeof res.total_count !== 'undefined') totalEntries.current = res.total_count;
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });        }
  };


  const FormattedOptionList = organizationFilterData.map(function (option) {
    return { label: option.organization_name, value: option.organization_id };
  });

  const handleDropDownPageIncreament = () => {
      dropDownPage.current = dropDownPage.current+1
      getOrganizationFilterList();
  }

  const handleSearch = (value) => {  
    dropDownPage.current = 1;
    searchText.current = value;
    getOrganizationFilterList();
  };

  const handleScroll = () => {
    if(totalEntries.current > organizationFilterData.length) { 
      handleDropDownPageIncreament()
    }
  };

  const handleChange = (value) => {
    setSelectedOrganization(value);
    setIsSelected(true)
    
  };

  const handleAddButtonClick = (evt) => {
    router.push("/organization/add");
  };

  const handlePageClick = (page) => {
    setPageNumber(page.selected+1);
  };

  const handleAplyButton = () => {
    if((selectedOrganization.length > 0 || isSelected) && isSelected)
    {
      getOrganizationList({orgIds:selectedOrganization, page :1});
      setIsSelected(false)
    }
  }

  const handleOrganizationToggle = (isOpen) => {
    const isOpening = !isOpen;
     if(isOpening && searchText.current.length) {
      searchText.current = "";
      dropDownPage.current = 1;
      getOrganizationFilterList()
    }
  }

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
      handleToggle : handleOrganizationToggle
    },
  ];

  let bottomButtonList = [
    {
      name: "Add Organization",
      isDisabled: !addNewOrgAllowedRoles.includes(getTopUserRole(roleDetails)),
      handleButtonClick: handleAddButtonClick,
    },
  ];

  return (
    <div className={"container"}>
      <PageControl
        pageHeading={pageHeading}
        filterList={filterList}
        bottomButtonList={bottomButtonList}
        showBottomButtonList={showbottomButtonList}
        handleAplyButton={handleAplyButton}
      />

      <section className="page-content">
      {loading && <Loading/>}
        {!loading  && formatedTableData.length === 0 &&  <NoDataFound />}
        {formatedTableData.length !== 0 &&
          <Table
            tableData={formatedTableData}
            tabelHeader={OrganizationTableHeader}
            pagination={true}
            pageCount={pageCount}
            onPageChange={handlePageClick}
          />
        }
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
