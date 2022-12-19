import React, { useEffect, useRef, useState } from "react";
import router from "next/router";
import styles from "./style.module.css";
import { AiFillCloseCircle } from "react-icons/ai";
import { getRoleList } from "../../services/roleService";
import { getOrganization } from "../../services/organizationService";
import { getCommunityList } from "../../services/communityService";
import { getUserList } from "../../services/personService";
import FullScreenPopup from "./FullScreenPopup";
import Button from "../button/Button";
import SingleSelect from "../select/SingleSelect";
import ErrorPopup from "./ErrorPopup";
import Constants from "../../lib/Constants";

interface props {
  bodyText?: string;
  headerText?: string;
  toggle: () => void;
  confirmBtnText?: string;
  handleRoleData: (data) => void;
}

const AddRolePopup = (props: props) => {


  const [organizationFilterData, setOrganizationFilterData] = React.useState([]);

  const [communityFilterData, setCommunityFilterData] = React.useState([]);
  const [personsDataforFilter, setPersonsDataforFilter] = React.useState([]);
  const [roleList, setRoleList] = React.useState([])
  const [selectedItems, setSelectedItems] = React.useState({ organization_id: '', community_id: '', community_name: '', organization_name: '', role_id: '', role_name: '', related_to_user_id: '' })
  const [resetCommSelection, setResetCommSelection] = useState(false);

  const [errorData, setErrorData] = React.useState({
    state: false,
    message: "",
  });

  const [openPopup, setOpenPopup] = React.useState<popup>(
    {
      state: false,
      message: '',
      subMessage: ''
    });


  let selectedOrgId = useRef(0)
  let selectedCommIds = useRef(0)
  let totalOrgEntries = useRef(0)
  let totalCommEntries = useRef(0)
  let totalUserEntries = useRef(0)
  let dropDownPage = useRef(1)
  let commDropDownPage = useRef(1)
  let userDropDownPage = useRef(1)
  let userSearchText = useRef("");
  let orgSearchText = useRef("");
  let commSearchText = useRef("");




  useEffect(() => {
    if (document.getElementById("cr-sidebar"))
      document.getElementById("cr-sidebar").style.zIndex = "1";
    
    getOrganizationFilterList();
    getRoleListData();
  }, []);


 //api call to get Organization list 
  const getOrganizationFilterList = async () => {
    try {
      let reqData:OrgReqHeaders = {
        limit: Constants.filterDropDownLimit,
        page_number: dropDownPage.current,
        query_type: Constants.queryType.dropDown
      };
      if (orgSearchText.current !== "") { reqData.organization_name = orgSearchText.current}

      const res = await getOrganization({ reqData });

      setOrganizationFilterData(dropDownPage.current !== 1 ?[...organizationFilterData, ...res.organization_list] : [...res.organization_list])
      if (res.total_count) totalOrgEntries.current = res.total_count;

    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };


  //api call to get Community list
  const getCommunityListForFilter = async ({orgId = 0 }) => {
    try {
      let reqData:communityReqheaders = {
        limit: Constants.filterDropDownLimit,
        page_number:commDropDownPage.current,
        query_type: Constants.queryType.dropDown
      };

      if (commSearchText.current !== "") { reqData.community_name = commSearchText.current;}
      if(orgId !== 0) reqData.organization_id = orgId

      const res = await getCommunityList({ reqData });

      setCommunityFilterData(commDropDownPage.current !== 1 ? [...communityFilterData, ...res.community_list]: [...res.community_list])    

      if (typeof res.total_count !== 'undefined') totalCommEntries.current = res.total_count
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });    }
  };



  //api call to get role list
  const getRoleListData = async () => {
    try {
      const reqData = {};
      const res = await getRoleList({ reqData });
      setRoleList(res.role_list)
    }
    catch (err) {
      // Show error popup here with err.message
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
  };


 // api call to get user list
  const getpersonListForFilter = async ({commIds = 0}) => {
    try {
      let reqData:userListPayload = {
        list_type:Constants.userListType.dropDown,
        limit: Constants.filterDropDownLimit,
        page_number: userDropDownPage.current,
        query_type: Constants.queryType.dropDown
       };
       if(userSearchText.current !== "") { reqData.name = userSearchText.current;  }
       if(commIds !== 0) reqData.community_ids = commIds;

      const res = await getUserList({ reqData });

      setPersonsDataforFilter(userDropDownPage.current !== 1 ?[...personsDataforFilter, ...res.user_list] : [...res.user_list])
      if (typeof res.total_count !== 'undefined') totalUserEntries.current = res.total_count
      
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });    }
  }



  const organizationOptionList = organizationFilterData.map(function (option) {
    return { label: option.organization_name, value: option.organization_id };
  });
  const communityOptionList = communityFilterData.map(function (option) {
    return { label: option.community_name, value: option.community_id };
  });
  const personOptionList = personsDataforFilter.map(function (option) {
    return {
      label: option.first_name + " " + option.last_name,
      value: option.user_id,
    };
  });

  const handleDropDownPageIncreament = () => {
    dropDownPage.current += 1;
    getOrganizationFilterList();  
  }

  const handleCommDropDownPageIncreament = () => {
    commDropDownPage.current += 1;
    getCommunityListForFilter({});  
  }

  const handleUserDropDownPageIncreament = () => {
    userDropDownPage.current += 1;
    getpersonListForFilter({});  
  }

  const handleOrganizationSearch = (org) => {
    dropDownPage.current = 1;
    orgSearchText.current = org;
    getOrganizationFilterList();
  };

  const handleOrganizationScroll = () => {
    if(totalOrgEntries.current > organizationFilterData.length) handleDropDownPageIncreament()  
  };

  const handleOrganizationChange = (org) => {
    setResetCommSelection(true);
    setSelectedItems({ ...selectedItems, organization_id: org.value, organization_name: org.label })
    commDropDownPage.current = 1;
    selectedOrgId.current = org.value;
    getCommunityListForFilter({orgId:org.value});
  };


  const handleCommunitySearch = (comm) => {
    commDropDownPage.current = 1;
    commSearchText.current = comm;
    getCommunityListForFilter({orgId:selectedOrgId.current});
  };

  const handleCommunityScroll = () => {
    if (totalCommEntries.current > communityFilterData.length)  handleCommDropDownPageIncreament()
  };

  const handleCommunityChange = (comm) => {
    if(comm) {
      selectedCommIds.current = comm.value
      setSelectedItems({ ...selectedItems, community_id: comm.value, community_name: comm.label });
      getpersonListForFilter({commIds:comm.value})
    }

  };

  const changeCommunityResetflag = () => {
    setResetCommSelection(false);
  }

  const handlePersonSearch = (person) => {
    userSearchText.current = person;
    userDropDownPage.current = 1;
    getpersonListForFilter({});
  }

  const handlePersonScroll = () => {
    if (totalUserEntries.current > personsDataforFilter.length) handleUserDropDownPageIncreament()

  }

  const handlePersonChange = (person) => {
    setSelectedItems({ ...selectedItems, related_to_user_id: person.value })
  }


  const handleRoleChange = (item) => {
    setSelectedItems({ ...selectedItems, role_id: item.role_id, role_name: item.role_name })
  }

  const handlePersonToggle = (isOpen) => { // function to get initial list when dropdown opens with non empty search text
    const isOpening = !isOpen;
    if(isOpening && userSearchText.current.length){
      userSearchText.current = "";
      userDropDownPage.current = 1;
      getpersonListForFilter({commIds:selectedCommIds.current});
    }  
  }

  const handleOrganizationToggle = (isOpen) => {
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
      getCommunityListForFilter({orgId:selectedOrgId.current});
    }
  }


  //submit the form data
  const handleSubmit = (e) => {
    e.preventDefault();

    let mandatoryFieldMsg = [];

    if (selectedItems.organization_id === "" || typeof selectedItems.organization_id === "undefined") mandatoryFieldMsg.push("Organization")
    if (selectedItems.community_id === "" || typeof selectedItems.community_id === "undefined") mandatoryFieldMsg.push("Community")
    if (selectedItems.role_id === "" || typeof selectedItems.role_id === "undefined") mandatoryFieldMsg.push("Role")

    if (mandatoryFieldMsg.length > 0) {
      const {
        MandatoryFieldAlertMsgData: { errorMessageOne, errorMessageTwo },
      } = Constants;
      setOpenPopup({ ...openPopup, state: true, message: mandatoryFieldMsg, subMessage: mandatoryFieldMsg.length === 1 ? errorMessageOne : errorMessageTwo })
      return false;
    }
    props.handleRoleData(selectedItems)
    props.toggle();

  }


  const handlePopupConfirm = () => {
    router.back();
  }


  return (
    <form >
      <div className={styles.modal}>
        <div className={styles.overlay}>
          <div className={`${styles.modal_content} ${styles.role_modal_content}`}>
            <div className={styles.top_header}>
              <span className={styles.popup_content_h1}>
                <AiFillCloseCircle
                  onClick={() => props.toggle()}
                  className={styles.closeicon}
                />
              </span>
            </div>
            <div className={styles.modal_flex}>
              <div className={`${styles.flex_item} ${styles.align_center}`}>
                <label className={`${styles.align_center} ${styles.label}`}>
                  Organization
                </label>
                <div className={`${styles.width_60}`}>
                  <SingleSelect
                    name={"Organization"}
                    title={"Select Organization"}
                    searchable={["Search for Organization"]}
                    list={organizationOptionList}
                    setSearchText={handleOrganizationSearch}
                    loadOptionListOnScroll={handleOrganizationScroll}
                    noOptionText={"No data found"}
                    onChange={handleOrganizationChange}
                    handleToggle={handleOrganizationToggle}
                  />
                </div>
              </div>
              <div className={`${styles.flex_item} ${styles.align_center}`}>
                <label className={`${styles.align_center} ${styles.label}`}>
                  Community
                </label>
                <div className={`${styles.width_60}`}>
                  <SingleSelect
                    name={"Community"}
                    title={"Select Community"}
                    searchable={["Search for Community"]}
                    list={communityOptionList}
                    setSearchText={handleCommunitySearch}
                    loadOptionListOnScroll={handleCommunityScroll}
                    noOptionText={"No data found"}
                    onChange={handleCommunityChange}
                    resetSelection = {resetCommSelection}
                    changeResetflag = {changeCommunityResetflag}
                    handleToggle={handleCommunityToggle}
                  />
                </div>
              </div>
              <div className={`${styles.flex_item}`}>

                {typeof roleList !== "undefined" && roleList.map((item, index) => (

                  <div onChange={() => handleRoleChange(item)} key={index} className={`${styles.flex_inner_item} ${styles.justify_around} ${styles.align_center}`}>
                    <label className={`${styles.align_center} ${styles.radio_label} ${styles.align_start}`}>{item.role_name}</label>
                    <input className={styles.align_center} id={item.role_id} type="radio" name="role" value={item.role_name} />
                  </div>

                ))}
              </div>

              {parseInt(selectedItems.role_id) === 7 &&

                <div className={`${styles.flex_item} ${styles.align_center}`}>
                  <label className={`${styles.align_center} ${styles.label}`}>Related to</label>
                  <div className={`${styles.width_60}`}>
                    <SingleSelect
                      name={"Related to"}
                      title={"Select Relation"}
                      searchable={["Search for Relation"]}
                      list={personOptionList}
                      setSearchText={handlePersonSearch}
                      loadOptionListOnScroll={handlePersonScroll}
                      noOptionText={"No data found"}
                      onChange={handlePersonChange}
                      handleToggle={handlePersonToggle}
                    />
                  </div>
                </div>}

              <div className={`${styles.flex_item} ${styles.align_center} ${styles.justify_center}`}>
                <Button
                  ButtonText={props.confirmBtnText}
                  handleButtonClick={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {openPopup.state &&
        <FullScreenPopup
          bodyText={openPopup.message}
          subText={openPopup.subMessage}
          onCancel={() => setOpenPopup({ ...openPopup, state: false })}
          onConfirm={() => handlePopupConfirm()}
          cancelBtnText={typeof openPopup.message === 'string' ? 'No' : 'Okay'}
          confirmBtn={typeof openPopup.message === 'string' ? true : false} //dont show confirm btn for mandatory field check
        />
      }
      {errorData.state && (
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={"Error"}
        />
      )}
    </form>
  );
}

export default AddRolePopup
