import { useRouter } from "next/router";
import React, { useState, useRef } from "react";
import AddCommunityForm from "../../../../components/community/AddCommunityForm";
import FormControl from "../../../../components/form-control/FormControl";
import ErrorPopup from "../../../../components/popup/ErrorPopup";
import FullScreenPopup from "../../../../components/popup/FullScreenPopup";
import Constants from "../../../../lib/Constants";
import { getDetail } from "../../../../services/cognito";
import { addCommunity, editCommunity, getCommunityList, getCountryList, getStateList, geTimezoneList} from "../../../../services/communityService";
import { getOrganization } from "../../../../services/organizationService"

interface dataProps {
  // TODO: Assign proper types and avoid using type(any)
  organization_id?: any,
  community_id?: any,
  address_id?: any,
  city?: any,
  country?: any,
  county?: any,
  state_id?: any,
  street_address?: any,
  time_zone?: any,
  zip_postal?: any,
  community_name?:any
  is_default?: number
}

const CommunityAddForm = () => {
  const router = useRouter();
  let organizationId = router.query.organizationId;
  let communityId = router.query.communityId;
  let communityName = router.query.communityName;  
  let heading = (typeof communityId !== 'undefined' ? 'Edit/view' : 'Add') + ' Community';

  const [OrganizationList, setOrganizationList] = useState([])
  const [countryList, setCountryList] = useState([])
  const [stateList, setStateList] = useState([])
  const [timezoneList, setTimezoneList] = useState([])
  const [isApiLoaded, setIsApiLoaded] = useState(false)
  const [dataChange, setDataChange] = useState(false)
  const [resetStateSelection, setResetStateSelection] = useState(false);


  const [data, setData] = useState<dataProps>({ organization_id:organizationId ? parseInt(organizationId.toString()) : '', community_id: communityId , community_name:communityName});
  const [openPopup, setOpenPopup] = useState<popup>({
      state: false,
      message: '',
      subMessage: ''
  });
  const [errorData, setErrorData] = useState<errorData>({
      state: false,
      message: "",
      alertType:1
  });   

  let totalOrgCount = useRef(0);
  let totalCountryCount = useRef(0);
  let totalStateCount = useRef(0);
  let orgSearchText = useRef("");
  let stateSearchText = useRef("");
  let countryId = useRef();
  let initalRender = useRef(false);


  React.useEffect(() => {
    (async() => {
      await Promise.all([
      await getCountry(),
      await getTimezones(),
      await getOrganizationList(),
    ])
    let communityId = router.query.communityId;
    if (typeof communityId !== 'undefined')
     await  getCommunityDetailForId(communityId);
     await getStates();
     initalRender.current = true;

     setIsApiLoaded(true)
    })();
  }, [])

  //api call to get organization list
  const getOrganizationList = async () => {
    try {
      let reqData: OrgReqHeaders = {
        // limit:Constants.filterDropDownLimit,  //TODO: removed limit for MS2
        query_type:Constants.queryType.dropDown
       };
      if (orgSearchText.current !== "") reqData.organization_name = orgSearchText.current;
      const res = await getOrganization({ reqData });
      setOrganizationList([...res.organization_list]);
      if (typeof res.total_count !== 'undefined') totalOrgCount.current = res.total_count;
    } 
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });     }
  }

 
  //api call to get country list
  const getCountry = async () => {
    try {
      let reqData: countryListPayload = {
        // limit:Constants.filterDropDownLimit,  //TODO: removed limit and last id for MS2
      }; 
      const res = await getCountryList({ reqData });
      setCountryList([...res.country_list]);
      if (typeof res.total_count !== 'undefined') totalCountryCount.current = res.total_count;
    }
    catch (err) {
        console.error(err);
        setErrorData({ state: true, message: err.message }); 
    }
  }

  //api call to get state list
  const getStates = async () => {
    try {
      let reqData: stateListPayload = {
        // limit:Constants.filterDropDownLimit, //TODO: removed limit and last id for MS2
      };  
      if(countryId.current) reqData.country_id = countryId.current
      if (stateSearchText.current !== '') reqData.state_name = stateSearchText.current; 
      const res = await getStateList({ reqData });
      setStateList([...res.state_list]);
      if (typeof res.total_count !== 'undefined') totalStateCount.current = res.total_count;
    }
    catch (err) {
        console.error(err);
        setErrorData({ state: true, message: err.message }); 
    }
  }

  //api call to get timezone list
  const getTimezones = async () => {
    try {
      let reqData = {};
      const res = await geTimezoneList({ reqData });
      setTimezoneList(res.timezone_list);
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });     }
  }

  const getCommunityDetailForId = async (id) => {
    try {
      let reqData = { organization_id: organizationId, limit: 1, community_ids: [id], query_type: Constants.queryType.detailView };
      const res = await getCommunityList({ reqData });
      setData({ ...data, ...res.community_list[0] });
      countryId.current = res.community_list[0].country_id;
    } 
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });       
    }
  }

  let organizationOptionList = OrganizationList.map((option) => {
    return { label: option.organization_name, value: option.organization_id };
  })

  let countryOptionList = countryList.map((option) => {
    return { label: option.country_code, value: option.country_id };
  })

  let stateOptionList = stateList.map((option) => {
    return { label: option.state_name, value: option.state_id };
  })

  let timezoneOptionList = timezoneList.map((option) => {
    return { label: option.timezone_value, value: option.timezone_id };
  })

  const handleOrganizationSearch = (value) => {
    orgSearchText.current = value;
    getOrganizationList();
  }

  const handleOrganizationScroll = () => {
    // if (totalOrgCount.current > OrganizationList.length) getOrganizationList() // TODO: Lazy loading removed
  }

  const handleOrganizationToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening && orgSearchText.current.length) {
      orgSearchText.current = "";
      getOrganizationList();
    }
  }

  const handleStateSearch = (value) => {
    stateSearchText.current = value;
    getStates()
  }

  const handleStateToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening && stateSearchText.current.length) {
      stateSearchText.current = "";
      getStates()
    }
  }

  const handleStateScroll = () => {
    // if (totalStateCount.current > stateList.length) getStates();  // TODO: Lazy loading removed
  }

  const handleCountryChange = (item) => {
    (initalRender.current) ? initalRender.current = false :  setResetStateSelection(true);
    countryId.current = item.value;
    getStates()
  }

  const handleCountryScroll = () => {
    // if (totalCountryCount.current > countryList.length) getCountry(); // TODO: Lazy loading removed
  }


  const changeStateResetflag = () => {
    setResetStateSelection(false);
  }

  const isFormDirty = (isChange) => { 
    if(isChange !== dataChange) setDataChange(isChange) // checking if form field has changed
   }
 


  const handleCancel = () => {
    if(dataChange){
      const {
        SaveFormAlertMsgData: { message, subMessage },
      } = Constants;
      setOpenPopup({
        state: true,
        message,
        subMessage,
      });
    }
    else
      (router.query.type) ? router.push(`/organization`) : router.push(`/organization/communities/?organizationId=${data.organization_id}&organizationName=${router.query.organizationName}`) 

  }

  const handlePopupConfirm = () => {
    (router.query.type) ? router.push(`/organization`) : router.push(`/organization/communities/?organizationId=${data.organization_id}&organizationName=${router.query.organizationName}`) 
  }

  //submit form data
  const handleFormData = async (formData) => {    
    //checking mandatory fields
    let message1 = [];
    if (typeof formData.organization_id === "undefined" || formData.organization_id === '') message1.push('organization');
    if (typeof formData.community_name === "undefined" || formData.community_name === '') message1.push('community');
    if (typeof formData.sales_force_id === "undefined" || formData.sales_force_id === '') message1.push('sales force id');
    if (typeof formData.street_address === "undefined" || formData.street_address === '') message1.push('street address');
    if (typeof formData.city === "undefined" || formData.city === '') message1.push('city');
    if (typeof formData.county === "undefined" || formData.county === '') message1.push('county');
    if (typeof formData.country === "undefined" || formData.country === '' || formData.country === 0) message1.push('country');
    if (typeof formData.state_id === "undefined" || formData.state_id === '' || formData.state_id === 0) message1.push('state');
    if (typeof formData.zip_postal === "undefined" || formData.zip_postal === '') message1.push('zip postal');
    if (typeof formData.time_zone === "undefined" || formData.time_zone === '' || formData.time_zone === 0) message1.push('time zone');


    if(message1.length > 0) {
      const {
        MandatoryFieldAlertMsgData: {errorMessageOne, errorMessageTwo },
      } = Constants;      
      setOpenPopup({...openPopup, state:true, message:message1, subMessage: message1.length === 1 ? errorMessageOne : errorMessageTwo })
      return false;
    }

    try {
      let response;



      let reqData = {
        community_id: (typeof communityId !== 'undefined') ? communityId : '',
        organization_id: (typeof formData.organization_id !== 'undefined') ? (formData.organization_id.value) : '',
        community_name: (typeof formData.community_name !== 'undefined') ? formData.community_name : '',
        sales_force_id: (typeof formData.sales_force_id !== 'undefined') ? formData.sales_force_id : '',
        street_address: (typeof formData.street_address !== 'undefined') ? formData.street_address : '',
        city: (typeof formData.city !== 'undefined') ? formData.city : '',
        state_id: formData.state_id ? (formData.state_id.value) : '',
        county: (typeof formData.county !== 'undefined') ? formData.county : '',
        zip_postal: (typeof formData.zip_postal !== 'undefined') ? formData.zip_postal : '',
        time_zone: (typeof formData.time_zone !== 'undefined') ? formData.time_zone.value : '',
        address_id:data.address_id,
        is_default: data.is_default,
      }
      if(typeof reqData.address_id === "undefined") delete reqData.address_id;      
      if (typeof communityId !== 'undefined') {
        response = await editCommunity({ reqData });
      } else {
        delete reqData.community_id;
        response = await addCommunity({ reqData })
        // GetDetails called to update the permission token
        await getDetail();
      }
      (router.query.type) ? router.push(`/organization`) : router.push(`/organization/communities/?organizationId=${data.organization_id}&organizationName=${router.query.organizationName}`)   
      }
    catch (err) {
    setErrorData({ state: true, message: err.message });
    console.error(err);
    }
  }

  const deleteCommunity = async () => { //delete functionality
    try{
      let reqData = {
         community_id:communityId,
         status:5,
         address_id:data.address_id
      }
      await editCommunity({ reqData });
      (router.query.type) ? router.push(`/organization`) : router.push(`/organization/communities/?organizationId=${data.organization_id}&organizationName=${router.query.organizationName}`)   
    }
    catch(err) {
        console.error(err);
        setErrorData({ state: true, message: err.message })
    }
  }

  const handleDelete = () => { // show alert popup onclick of delete
    setErrorData({ state: true, message: Constants.deleteAlertMsg.message, alertType:4 });   
  }


  return (
    <div className={`container`}>
      <FormControl heading={heading} showBackButton={true} handleBackButton={handleCancel} />

      <div className={`row`}>
        {isApiLoaded &&
          <AddCommunityForm
            editData={data}
            organizationId={organizationId}
            organizationOptionList={organizationOptionList}
            countryOptionList={countryOptionList}
            stateOptionList={stateOptionList}
            timezoneOptionList={timezoneOptionList} //timezoneOptionList
            handleOrganizationSearch={handleOrganizationSearch}
            handleStateSearch={handleStateSearch}
            handleFormData={handleFormData}
            handleCancel={handleCancel}
            handleOrganizationScroll={handleOrganizationScroll}
            handleCountryChange={ handleCountryChange}
            handleCountryScroll={handleCountryScroll}
            handleStateScroll={handleStateScroll}
            handleOrganizationToggle={handleOrganizationToggle}
            handleStateToggle={handleStateToggle}
            isFormDirty={isFormDirty}
            handleDelete ={handleDelete}
            resetStateSelection = {resetStateSelection}
            changeStateResetflag = {changeStateResetflag}
          />
        }
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
        headerText={errorData.alertType === 4 ? "Alert" : "Error"}
        handleDeleteRecord={deleteCommunity}
        cancelBtn = {errorData.alertType === 4 && true}
        alertType = {errorData.alertType}
        confirmBtnText ={errorData.alertType === 4 && "Yes"}
      />
      )}

    </div>
  )

}

export default CommunityAddForm;