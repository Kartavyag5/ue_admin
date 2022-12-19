import React, {useContext, useRef, useState } from "react";
import router, { useRouter }  from "next/router";
import Table from "../../../components/table/table";
import PageControl from "../../../components/pageControl/PageControl";
import Loading from "../../../components/text/loading"
import NoDataFound from "../../../components/text/noDataFound";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import getTableRow from "../../../services/tableRow";
import { licenseList } from "../../../services/licenseService";
import { formatLicenseData } from "../../../helper/tableData";
import { LicenseTableHeader } from "../../../lib/tableHeader";
import Constants from "../../../lib/Constants";
import { RoleContext } from "../../../context/roleContext";
import { getTopUserRole } from "../../../helper/roles";


  
export default function License() {

  const router = useRouter();

  const roleDetails = useContext(RoleContext);

  let communityName = router.query.communityName;
  let communityId = router.query.communityId;

  let pageType = "other" 
  let pageHeading = "Licenses";
  let subHeading = communityName;
  let showBackButton = true;
  let showbottomButtonList = true;

  const [loading, setLoading] = useState(true);

  const [licenseData, setLicenseData] = useState([])
  const [licenseListforFilter, setLicenseListforFilter] = useState([])
  
  const [page, setPage] = React.useState(1)
  const [pageCount, setPageCount] = useState(0)

  const [selectedLicense, setSelectedLicense] = useState([])
  const [isSelected, setIsSelected] = useState(false)


  let totlaLicenceCount = useRef(0)
  let licenseSearchText = useRef("")
  let licenseDropDownPage =  useRef(1)


  const [errorData, setErrorData] = React.useState({
    state: false,
    message: "",
  });   


  React.useEffect(() => {    
    if(router.query.communityId) getLicense({licenseIds:!isSelected ? selectedLicense : []});
  }, [router.query])

  React.useEffect(() => {
    getLicenseListForFilter();

  }, [])

  // api call to fetch licence list
  const getLicense = async ({licenseIds = [], pageNumber=page}) => {
     
    try {
      let reqData:licenseListPayload = {
        community_ids:router.query.communityId,
        limit:getTableRow(pageType), 
        page_number: pageNumber, 
        license_ids:licenseIds,
        list_type:Constants.userListType.table
      };
     
      if(licenseIds.length === 0) delete reqData.license_ids;

      const res = await licenseList({ reqData });  

      setLicenseData(res.license_list);

      if (pageNumber === 1) {
        totlaLicenceCount.current = res.total_count;
        typeof res.total_count !== 'undefined' && setPageCount(Math.ceil(res.total_count / getTableRow(pageType)))
      }      
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });        }

    setLoading(false);
  } 

  // api call to fetch licence list for licence filter
  const getLicenseListForFilter = async () => {
     
    try {
      let reqData:licenseListPayload = {
        community_name:communityName, 
        limit:Constants.filterDropDownLimit, 
        page_number:licenseDropDownPage.current,
        list_type:Constants.userListType.dropDown
      };
      if(licenseSearchText.current !== "") reqData.license_number=licenseSearchText.current;
      
      const res = await licenseList({ reqData }); 
      
      setLicenseListforFilter(licenseDropDownPage.current !== 1 ? [...licenseListforFilter, ...res.license_list] : [...res.license_list]);  
      if(res.total_count) totlaLicenceCount.current = res.total_count;
    } 
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });        }
  } 

  const formattedLicenseOptionList = licenseListforFilter.map(function (option) {
    return { label: option.license_number, value: option.license_id };
  });

  const handleDropDownPageIncreament = () => {
    licenseDropDownPage.current += 1;
    getLicenseListForFilter();
  }

  const handleSearch = (value) => {
    licenseSearchText.current = value;
    licenseDropDownPage.current = 1;
    getLicenseListForFilter();
  };

  const handleScroll = () => {
    if (totlaLicenceCount.current > licenseListforFilter.length)  handleDropDownPageIncreament();
  };

  const handleChange = (value) => {    
    setSelectedLicense(value)
    setIsSelected(true)
  };

  const handleLicenseToggle = (isOpen) => {
    const isOpening = !isOpen;
     if(isOpening && licenseSearchText.current.length) {
      licenseSearchText.current = "";
      licenseDropDownPage.current = 1;
      getLicenseListForFilter();
    }
  }

  const handleAplyButton = () => {
    if((selectedLicense.length > 0 || isSelected) && isSelected){
      setPage(1)
      getLicense({pageNumber:1, licenseIds:selectedLicense});
      setIsSelected(false)
    }
  }


  let filterList = [
    {
      label: "Licenses",
      type: "MultiSelectDropDown",
      optionsList: formattedLicenseOptionList,
      name: "Licenses",
      title: "Search for License",
      searchText: "Search for License",
      handleChange: handleChange,
      noOptionText: "No data found",
      handleSearch: handleSearch,
      handleScroll: handleScroll,
      handleToggle:handleLicenseToggle
    },
  ];

  const handleAddButtonClick = () => {
    router.push(`/organization/license/add?communityId=${communityId}&communityName=${communityName}&organizationId=${router.query.organizationId}`);
  };

  let bottomButtonList = [
    {
      name: "Add License",
      handleButtonClick: handleAddButtonClick,
      isDisabled: Constants.rolePermissions.rolesNotAllowedToAddOrEditLicense.includes(getTopUserRole(roleDetails)),
    },
  ];

  const handlePageClick = (page) => {
    setPage(page.selected+1); 
    getLicense({licenseIds:!isSelected ? selectedLicense : [], pageNumber:page.selected+1});
  };

  const handleBackbutton =  () => {
    router.back();
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
        handleAplyButton={handleAplyButton}
      />
      <section className="page-content">
       
      {loading && <Loading/>}
        {!loading  && licenseData.length === 0 &&  <NoDataFound />}
        {licenseData.length !== 0 &&  
        <Table
          tableData={formatLicenseData({data:licenseData})}
          tabelHeader={LicenseTableHeader}
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
