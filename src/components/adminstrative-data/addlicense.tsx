import router from "next/router";
import React from "react";
import FormController from "../form/FormController";

 function EditLicences({editData, handleFormData, handleCancel,isFormDirty,handleDelete,  ...props}) {
  
  let data = typeof editData !== 'undefined' && (editData);

  
  const column1 = [
    {
      label:'Game Licensed*',
      column: [
        {
          name:'game_licensed',
          inputType:'select',
          title:'Select Game',
          options: props.gameOptionList,
          handleChange:(val)=>{console.log(val)},
          defaultValue: typeof data !== 'undefined' ? data.game_id : '',
          handleScroll :props.handleGameScroll,
          searchable:["Select Game"],
          setSearchText: props.handleGameSearch
        }
      ]
    },
    {
      label:'Game pricing plan*',
      column: [
        {
          name:'game_pricing_plan',
          inputType:'select',
          title:'Select Plan',
          handleChange:(val)=>{},
          options: props.planOptionList,
          defaultValue: typeof data !== 'undefined' ? data.pricing_plan_id : '',
          handleScroll :props.handlePlanScroll,
          searchable:["Select Pricing Plan"],
          setSearchText: props.handlePlanSearch,
        }
      ]
    },
    {
      label:'Effective Date*',
      column: [
        {
          name:'effective_date',
          inputType:'date', 
          handleChange:(val)=>{},
          defaultValue: typeof data.effective_date !== 'undefined' && data.effective_date !== null ? data.effective_date : '',
        }
      ]
    },
    {
      label:'Renewal Date*',
      column: [
        {
          name:'renewal_as_of_date',
          inputType:'date', 
          handleChange:(val)=>{},
          defaultValue: typeof data.renewal_date !== 'undefined' && data.renewal_date !== null ? data.renewal_date  : '',
          isDateRange:true
        }
      ]
    },
    {
      label:'Expired as of Date',
      column: [
        {
          name:'expire_date',
          inputType:'date', 
          handleChange:(val)=>{},
          defaultValue: typeof data.expire_as_of_date !== 'undefined' && data.expire_as_of_date !== null ? data.expire_as_of_date : '',
        }
      ]
    },
    {
      label:'OrgCommunity Pays*',
      column: [
        {
          name:'org_community_pay',
          inputType:'select',
          title:'Select OrgCommunity Pay',
          options: props.orgComPayOptionList,
          handleChange:(val)=>{},
          defaultValue:  typeof data !== 'undefined' ? data.org_community_pay : '',
        }
      ]
    },
  ];

  const mainButtons = [  
    {
      type: "submit",
      value: "save",
      handleButtonClick: handleFormData,
    },
    {
      type: "button",
      value: "cancel",
      handleButtonClick: handleCancel,
    },
  ];

  const deleteButton = [ {
    type: "button",
    value: "Delete",
    handleButtonClick: handleDelete,
  }]

  const buttonProps = data.license_id ? [ ...deleteButton, ...mainButtons] : [...mainButtons]

  return  <FormController  
              layout={1} 
              column1={column1} 
              buttonProps={buttonProps} 
              isFormDirty={isFormDirty} />;
}

export default EditLicences
