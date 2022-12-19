import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import ContactForm from "../../components/contactus/contactForm";
import ErrorPopup from "../../components/popup/ErrorPopup";
import FullScreenPopup from "../../components/popup/FullScreenPopup";
import { validateEmail } from "../../helper/emailValidation";
import Constants from "../../lib/Constants";
import { contactCategoryList, contactSupport } from "../../services/contactSupportService";
import style from './index.module.css';

const OrganizationAddForm = () => {
  let router = useRouter();
  const [openPopup, setOpenPopup] = useState<popup>({
    state: false,
    message: "",
    subMessage: "",
  });
  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
    type:"error",
    alertType:1
  });
  const [categoryOption,setCategoryOptions]=useState<Array<any>>([{}])

  useEffect(() => {
    getCategoryList()
  }, [])

  const getCategoryList=async()=>{
    try{
      let res=await contactCategoryList();
      setCategoryOptions(res.contact_support_category_list)
    } catch (err) {
      setErrorData({ state: true, message: err.message, type: "error", alertType:1 });
    }
  }

  const handleSaveClick = async (formData) => {
    
    try {
      const reqData = {
        ...formData,
        category:formData.category.value,
      };      
      let missingFields = [];

      for (let [key, value] of Object.entries(formData)) {
        if (typeof value === 'undefined' || value === '') {
          missingFields.push(key)
        }
      }
      if (missingFields.length > 0) {
        const {
          MandatoryFieldAlertMsgData: { errorMessageOne, errorMessageTwo },
        } = Constants;
        setOpenPopup({ ...openPopup, state: true, message: missingFields, subMessage: missingFields.length === 1 ? errorMessageOne : errorMessageTwo })
        return false;
      }
      await contactSupport({ reqData });
      setErrorData({state: true, message: Constants.contactSupportSuccess.message, type:"success", alertType:3})
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message, type:"error" , alertType:1});
    }
  }

  const routeToLandingPage = () => {
    router.push('/')
  };

  const handleCancel = () => {
    const {
      SaveFormAlertMsgData: { message, subMessage },
    } = Constants;
    setOpenPopup({
      state: true,
      message,
      subMessage,
    });
  };

  const handleEmailValidation = (email) => {
    if(!validateEmail(email))
      setErrorData({ state: true, message: "Enter a valid Email!", type:"error" , alertType:1 })
  }

  const contactCategory=categoryOption.map(function (option) {
    return { label:option.support_category_name, value: option.support_category_id};
  });

  
  return (
    <div className={`container`} style={{ margin: "0" }}>
      <h3
        className={`${style.contact_header} text_center uppercase ${style.ml_2}`}
      >
        Contact Support
      </h3>
      <br />
      <div className={`row`}>
          <ContactForm
            options={contactCategory}
            onSendButtonClick={handleSaveClick}
            onCancelClick={handleCancel}
            handleEmailValidation={handleEmailValidation}
          />
      </div>
      {openPopup.state && (
        <FullScreenPopup
          bodyText={openPopup.message}
          subText={openPopup.subMessage}
          onCancel={() => setOpenPopup({ ...openPopup, state: false })}
          onConfirm={() => routeToLandingPage()}
          cancelBtnText={typeof openPopup.message === "string" ? "No" : "Okay"}
          confirmBtn={typeof openPopup.message === "string" ? true : false} //dont show confirm btn for mandatory field check
        />
      )}
      {errorData.state && (
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "", type:"", alertType:1 })}
          bodyText={errorData.message}
          headerText= {errorData.type === "error" ? "Error" : "Success" }
          alertType={errorData.alertType}
          handleContactSupportSucccess={routeToLandingPage}
          
        />
      )}
    </div>
  );
}

export default React.memo(OrganizationAddForm);