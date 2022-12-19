import React from "react";
import FormController from "../form/FormController";

 function AddCommunityForm({editData, handleStateSearch, handleFormData, handleCancel,isFormDirty,handleDelete,  ...props}) {

  let data = typeof editData !== 'undefined' && (editData);
  
  const column1 = [
    {
      label:'Organization Name*',
      column : [
        {
          name:'organization_id',
          title:'Select Organization',
          inputType:'select',
          options:  props.organizationOptionList,
          handleScroll: props.handleOrganizationScroll,
          defaultValue: typeof data.organization_id !== 'undefined' ? data.organization_id : '',
          onChange:(val)=>{},
          searchable:["Select Organization"],
          setSearchText: props.handleOrganizationSearch,
          handleToggle:props.handleOrganizationToggle
        }
      ]
    },
    {
      label:'Community Name*',
      column: [
        {
          name:'community_name',
          inputType:'text',
          defaultValue: typeof data !== 'undefined' ? data.community_name : '',
        }
      ]
    },
    {
      label:'Community ID',
      column: [
        {
          name:'community_id',
          inputType:'text',
          defaultValue: typeof data.community_id !== 'undefined' ? data.community_id : 'AUTO GENERATED',
          readOnly:true
        }
      ]
    },
    {
      label:'SalesForce Account ID(SFID)*',
      column: [
        {
          name:'sales_force_id',
          inputType:'text',
          defaultValue: typeof data !== 'undefined' ? data.sales_force_id : '',
        }
      ]
    },
    
  ];

  const column2 = [
    {
      label:'Country*',
      column: [
        {
          name:'country',
          inputType:'select',
          title:'Select Country',
          options: props.countryOptionList,
          defaultValue: typeof data.country_id !== 'undefined' ? data.country_id : '',
          handleScroll: props.handleCountryScroll,
          onChange:(val)=>{},
          handleChange: props.handleCountryChange


        }
      ]
    },
    {
      label:'Street Address*',
      column: [
        {
          name:'street_address',
          id:"street",
          inputType:'text',
          defaultValue: typeof data.street_address !== 'undefined' ? data.street_address : '',
        }
      ]
    },
    {
      label:'City*',
      column: [
        {
          name:'city',
          inputType:'text',
          defaultValue: typeof data.city !== 'undefined' ? data.city : '',
        }
      ]
    },
    {
      label:'State Province*',
      column: [
        {
          name:'state_id',
          inputType:'select',
          title:'State Province',
          options: props.stateOptionList,
          searchable:["Select State Province"],
          setSearchText: handleStateSearch,
          handleScroll: props.handleStateScroll,
          defaultValue:  typeof data.state_id !== 'undefined' ? data.state_id : '',
          onChange:(val)=>{},
          handleToggle:props.handleStateToggle,
          resetSelection : props.resetStateSelection,
          changeResetflag : props.changeStateResetflag,
        }
      ]
    },
    {
      label:'County*',
      column: [
        {
          name:'county',
          inputType:'text',
          defaultValue:  typeof data.county !== 'undefined' ? data.county : '',
        }
      ]
    },
    {
      label:'Zip Postal*',
      column: [
        {
          name:'zip_postal',
          inputType:'text',
          defaultValue: typeof data.zip_postal !== 'undefined' ? data.zip_postal : '',      

        }
      ]
    }, 
    {
      label:'Time Zone*',
      column: [
        {
          name:'time_zone',
          inputType:'select',
          title:'Time Zone',
          options: props.timezoneOptionList,
          defaultValue:  typeof data.time_zone_id !== 'undefined' ? data.time_zone_id : '',
          onChange:(val)=>{},
          handleScroll: ()=>{},
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

  const buttonProps = data.community_id ? [ ...deleteButton, ...mainButtons] : [...mainButtons]
  

  return <FormController
    layout={2}
    column1={column1}
    column2={column2}
    buttonProps={buttonProps}
    isFormDirty={isFormDirty}
  />
}

export default AddCommunityForm
