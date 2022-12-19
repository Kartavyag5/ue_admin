import React, { useEffect, useRef } from "react";
import PageControl from "../../../components/pageControl/PageControl";
import Table from "../../../components/table/table";
import getTableRow from "../../../services/tableRow";
import router from "next/router";
import { getRoleList } from "../../../services/roleService";
import { formatRoleData } from "../../../helper/tableData";
import Loading from "../../../components/text/loading"
import NoDataFound from "../../../components/text/noDataFound";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import Constants from "../../../lib/Constants";
import { roleTableHeader } from "../../../lib/tableHeader";




export default function Roles() {

  let pageType = "adminstrative";
  let showBottomButtonList = true;

  const [loading, setLoading] = React.useState(true);

  const [pageCount, setPageCount] = React.useState(0);
  const [pageNumber, setPageNumber] = React.useState(1);

  const [formatedTableData, setFormatedTableData] = React.useState([]);

  const [roleFilterData, setRoleFilterData] = React.useState([]);
  const [selectedRole, setSelectedRole] = React.useState([]);

  const [isSelected, setIsSelected] = React.useState(false)
  const [errorData, setErrorData] = React.useState({
    state: false,
    message: "",
  });

  let totalEntries = useRef(0);
  let roleDropDownPage = useRef(1);
  let roleSearchText = useRef("");


  useEffect(() => {
    getRoleListData({roleIds: !isSelected ? selectedRole : []});
  }, [pageNumber]);

  React.useEffect(() => {
    // shallow page load to push tab_id to url
    router.push({
        pathname: '/administrative-data',
        query: { tab_id: '4' }
      }, undefined, { shallow: true }
    )
  }, [])


  //api call to get role list
  const getRoleListData = async ({page = pageNumber,roleIds = []}) => {
    try {
      const reqData = {
        page_number: page, // Initially load page 1
        limit: getTableRow(pageType),
        role_ids: roleIds,
      };

      if(roleIds.length === 0) delete reqData.role_ids;


      const res = await getRoleList({ reqData });

      const formatedTableData = formatRoleData({ data: res.role_list });
      setFormatedTableData(formatedTableData);

      if(roleFilterData.length === 0 ) setRoleFilterData(res.role_list); 
    
      if(res.total_count) {
        totalEntries.current = res.total_count;
        res.total_count && setPageCount(Math.ceil(res.total_count / getTableRow(pageType)));
      }
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
    setLoading(false);
  };


  // api call to get filter list
  const getRoleFilterList = async () => {
    try {
      let reqData:roleListPayload = {
        limit: Constants.filterDropDownLimit,
        page_number:roleDropDownPage.current
      };          
      if(roleSearchText.current !== "")  reqData.role_name = roleSearchText.current;      
      const res = await getRoleList({ reqData });

      setRoleFilterData(roleDropDownPage.current !== 1 ? [...roleFilterData, ...res.role_list] : [...res.role_list]);
      if(res.total_count) totalEntries.current = res.total_count;
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };


  const FormattedOptionList = roleFilterData.map(function (option) {
    return { label: option.role_name, value: option.role_id };
  });


  const handleRoleDropDownPageIncreament = () => {
    roleDropDownPage.current += 1;
    getRoleFilterList();
}

  const handleSearch = (value) => {
    roleDropDownPage.current = 1;
    roleSearchText.current = value;
    getRoleFilterList();
  };

  const handleScroll = () => {
    if(totalEntries.current > roleFilterData.length) handleRoleDropDownPageIncreament()   
  };

  const handleChange = (value) => {
    setSelectedRole(value);
    setIsSelected(true)
  };

  const handleRoleDropDownToggle = (isOpen) => {
    const isOpening = !isOpen;
     if(isOpening &&  roleSearchText.current.length) {
      roleSearchText.current = "";
      roleDropDownPage.current = 1;
      getRoleFilterList();
    }
  }

  const handleAddButtonClick = () => {
    router.push("/administrative-data/roles/add");
  };

  const handlePageClick = (page) => {
    setPageNumber(page.selected+1);
  };

  const handleAplyButton = () => {
    if((selectedRole.length > 0 || isSelected) && isSelected)
    {
      getRoleListData({page:1,roleIds:selectedRole});
      setIsSelected(false)
    }}

  let filterList = [
    {
      label: "Role",
      type: "MultiSelectDropDown",
      optionsList: FormattedOptionList,
      name: "Role",
      title: "Search for Role",
      searchText: "Search for Role",
      handleChange: handleChange,
      noOptionText: "No data found",
      handleSearch: handleSearch,
      handleScroll: handleScroll,
      handleToggle:handleRoleDropDownToggle
    },
  ];

  let bottomButtonList = [
    {
      name: "Add Role",
      handleButtonClick: handleAddButtonClick,
    },
  ];


  return (
    <div className="container">
      <PageControl
        filterList={filterList}
        bottomButtonList={bottomButtonList}
        showBottomButtonList={showBottomButtonList}
        handleAplyButton={handleAplyButton}

      />
      <section className="page-content">
      {loading && <Loading/>}
        {!loading  && formatedTableData.length === 0 &&  <NoDataFound />}
        {formatedTableData.length !== 0 &&
          <Table
            tableData={formatedTableData}
            tabelHeader={roleTableHeader}
            pagination={true}
            pageCount={pageCount}
            onPageChange={handlePageClick}
          />
        }
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
