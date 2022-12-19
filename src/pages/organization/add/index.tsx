import React, { useState, useRef } from "react";
import router, { useRouter } from "next/router";
import AddOrganizationForm from "../../../components/organization/addorganization";
import FormControl from "../../../components/form-control/FormControl";
import { addOrEditOrganization, getOrganization } from "../../../services/organizationService";
import FullScreenPopup from "../../../components/popup/FullScreenPopup";
import Constants from "../../../lib/Constants";
import ErrorPopup from "../../../components/popup/ErrorPopup";

const OrganizationAddForm = () => {

  const router = useRouter();


  const { organizationId, organizationName, parentOrganizationId } = router.query;
  let heading = (typeof organizationId !== "undefined" ? "Edit" : "Add") + " Organization";

  const [organizationFilterData, setOrganizationFilterData] = React.useState([]);
  const [isApiLoaded, setIsApiLoaded] = React.useState(false)
  const [dataChange, setDataChange] = useState(false)

  const defaultFormDataForEdit = {
    organizationName,
    parentOrganizationId,
  };
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
  let searchText = useRef("")


  React.useEffect(() => {
    getOrganizationFilterList();
  }, []);

  //api call for filter list
  const getOrganizationFilterList = async () => {
    try {
      let reqData: OrgReqHeaders = {  // TODO: removed limit for MS2 
        // limit: Constants.filterDropDownLimit, 
        query_type:Constants.queryType.dropDown
      };
      if (searchText.current !== "") reqData.organization_name = searchText.current;
      const res = await getOrganization({ reqData });
      setOrganizationFilterData([...res.organization_list,{organization_id:0, organization_name:"None"}]);
      if (typeof res.total_count !== 'undefined') totalOrgCount.current = res.total_count;
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
    setIsApiLoaded(true)
  };

  const FormattedOptionList = organizationFilterData.map(function (option) {
    return { label: option.organization_name, value: option.organization_id };
  });


  const handleScroll = () => {
    // if (totalOrgCount.current > organizationFilterData.length) getOrganizationFilterList(); TODO:lazy loading removed
  };

  const handleSearch = (value) => {
    searchText.current = value;
    getOrganizationFilterList();
  };

  const handleOrganizationToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening && searchText.current.length) {
      searchText.current = "";
      getOrganizationFilterList()
    }
  }


  // submit form
  const handleFormData = async (data) => {
    let message1 = [];
    if (typeof data.organization_name === "undefined" || data.organization_name === '') message1.push(' Organization Name');
    if (message1.length > 0) {
      const {
        MandatoryFieldAlertMsgData: { errorMessageOne, errorMessageTwo },
      } = Constants;
      setOpenPopup({ ...openPopup, state: true, message: message1, subMessage: message1.length === 1 ? errorMessageOne : errorMessageTwo })
      return false;
    }
    try {
      let reqData:orgEditPayload = {
        organization_name: data.organization_name ? data.organization_name : "",
      };
      if(data.parent_organization_id) reqData.parent_organization_id = data.parent_organization_id.value;
      if(organizationId) reqData.organization_id = organizationId;
      const response = await addOrEditOrganization({ reqData }, organizationId);
      typeof organizationId === "undefined" ? router.push(`/organization/communities/add?organizationId=${response.organization_id}&communityId=${response.community_id}&communityName=${response.community_name}&type=2`) : router.back()
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

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
      router.back();
  };

  const handlePopupConfirm = () => {
    router.back();
  }

  const deleteOrganization = async () => { //delete functionality
    try{
      let reqData:orgEditPayload = {
         organization_id:organizationId,
         status:5
      }
      await addOrEditOrganization({ reqData }, organizationId);
      router.back()    }
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
          <AddOrganizationForm
            defaultData={defaultFormDataForEdit}
            options={FormattedOptionList}
            handleFormData={handleFormData}
            handleCancel={handleCancel}
            handleScroll={handleScroll}
            handleSearch={handleSearch}
            handleDelete={handleDelete}
            handleOrganizationToggle={handleOrganizationToggle}
            isFormDirty={isFormDirty}
          />
        }
        {openPopup.state &&
          <FullScreenPopup
            bodyText={openPopup.message}
            subText={openPopup.subMessage}
            onCancel={() => setOpenPopup({ ...openPopup, state: false })}
            onConfirm={() => handlePopupConfirm()}
            cancelBtnText={typeof openPopup.message === 'string' ? 'No' : 'Okay'}
            confirmBtn={typeof openPopup.message === 'string' ? true : false}
          />
        }
        {errorData.state && (
          <ErrorPopup
            toggle={() => setErrorData({ state: false, message: "" })}
            bodyText={errorData.message}
            headerText={errorData.alertType === 4 ? "Alert" : "Error"}
            handleDeleteRecord={deleteOrganization}
            cancelBtn = {errorData.alertType === 4 && true}
            alertType = {errorData.alertType}
            confirmBtnText ={errorData.alertType === 4 && "Yes"}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(OrganizationAddForm);
