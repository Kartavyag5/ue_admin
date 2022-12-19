import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import AddRole from "../../../../components/adminstrative-data/addrole";
import FormControl from "../../../../components/form-control/FormControl";
import ErrorPopup from "../../../../components/popup/ErrorPopup";
import FullScreenPopup from "../../../../components/popup/FullScreenPopup";
import Constants from "../../../../lib/Constants";
import { addOrEditRole, getRoleList } from "../../../../services/roleService";

const AddRoleForm = () => {
  
  const router = useRouter();
  const roleId = router.query.roleId;
  let heading = (typeof roleId !== "undefined" ? "Edit" : "Add ") + " role";

  const [defaultFormDataForEdit, setDefaultFormDataForEdit] = useState([])
  const [isApiLoaded, setIsAPiLoaded] = useState(false)
  const [dataChange, setDataChange] = useState(false)

  const [openPopup, setOpenPopup] = useState<popup>({
    state: false,
    message: "",
    subMessage: "",
  });
  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });

 
  useEffect(() => {
    let roleId = router.query.roleId
    if(typeof roleId !== "undefined"){
      (async () => {
        try {
          let reqData: roleListPayload = {
            role_ids: roleId,
            limit: 1
          }
          const roleListRes = await getRoleList({ reqData })
          setDefaultFormDataForEdit(roleListRes.role_list[0])
        }
        catch (err) {
          console.error(err);
          setErrorData({ state: true, message: err.message });
        }
        setIsAPiLoaded(true)
      })()
    }
    else
      setIsAPiLoaded(true)

  }, [])

  //handle form data
  const handleFormData = async (data) => {
      
    let mandatoryFieldMsg = [];
    for (let [key, value] of Object.entries(data)) {
      if (typeof value === 'undefined' || value === '') {
        mandatoryFieldMsg.push(key)
      }
    }
    if (mandatoryFieldMsg.length > 0) {
      const {
        MandatoryFieldAlertMsgData: { errorMessageOne, errorMessageTwo },
      } = Constants;
      setOpenPopup({ ...openPopup, state: true, message: mandatoryFieldMsg, subMessage: mandatoryFieldMsg.length === 1 ? errorMessageOne : errorMessageTwo })
      return false;
    }
    try {
      let reqData = {
        role_name: typeof data.role_name !== "undefined" ? data.role_name : "",
        role_description:
          typeof data.role_description !== "undefined"
            ? data.role_description
            : "",

        role_id: typeof roleId !== "undefined" ? roleId : "",
      };
      if (typeof roleId === undefined) delete reqData.role_id;

      await addOrEditRole({ reqData }, roleId);
      router.back();
    } catch (err) {
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

  return (
    <div className={`container`}>
      <FormControl
        heading={heading}
        showBackButton={true}
        handleBackButton={handleCancel}
      />
      <div className={`row`}>
        {isApiLoaded &&
        <AddRole
          editData={defaultFormDataForEdit}
          handleCancel={handleCancel}
          handleFormData={handleFormData}
          isFormDirty={isFormDirty}

        />
        }
        {openPopup.state && (
          <FullScreenPopup
            bodyText={openPopup.message}
            subText={openPopup.subMessage}
            onCancel={() => setOpenPopup({ ...openPopup, state: false })}
            onConfirm={() => handlePopupConfirm()}
            cancelBtnText={typeof openPopup.message === "string" ? "No" : "Okay"}
            confirmBtn={typeof openPopup.message === "string" ? true : false}
          />
        )}
       {errorData.state && (
          <ErrorPopup
            toggle={() => setErrorData({ state: false, message: "" })}
            bodyText={errorData.message}
            headerText={"Error"}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(AddRoleForm);
