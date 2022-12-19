import router from "next/router";
import React from "react";
import { formatDate } from "../../helper/dateTime";
import FormController from "../form/FormController";

 function LicencesForm({editData, handleFormData, handleCancel,isFormDirty,allowEditLicense,  ...props}) {
  
  let data = typeof editData !== 'undefined' && (editData);

  
  
  const column1 = [
    {
      label:'License#',
      column: [
        {
          name:'license_number',
          inputType:'text',
          defaultValue:  typeof data.license_number !== 'undefined' ? data.license_number : 'AUTO GENERATED',
          readOnly:true
        }
      ]
    },
    {
      label:'Game Licensed*',
      column: [
        {
          name: 'game_licensed',
          inputType: allowEditLicense ? 'text' : 'select',
          title: 'Select Game',
          options: props.gameOptionList,
          handleChange: (val)=>{console.log(val)},
          defaultValue:allowEditLicense ? data.game_name :  typeof data !== 'undefined' ? data.game_id : '',
          handleScroll: props.handleGameScroll,
          searchable: ["Select Game"],
          setSearchText: props.handleGameSearch,
          handleToggle: props.handleGameToggle,
          readOnly: allowEditLicense && true
        }
      ]
    },
    {
      label:'Plan Name*',
      column: [
        {
          name:'game_pricing_plan',
          inputType: allowEditLicense ? 'text' : 'select',
          title:'Select Plan',
          handleChange:(val)=>{},
          options: props.planOptionList,
          defaultValue: allowEditLicense ? data.plan_name : typeof data !== 'undefined' ? data.pricing_plan_id : '',
          handleScroll: props.handlePlanScroll,
          searchable: ["Select Pricing Plan"],
          setSearchText: props.handlePlanSearch,
          handleToggle: props.handlePlanToggle,
          readOnly: allowEditLicense && true


        }
      ]
    },
    {
      label:'Community Name*',
      column: [
        {
          name:'community',
          inputType:allowEditLicense ? 'text' : 'select',
          title: 'Select Community',
          handleChange:(val)=>{},
          options: props.communityOptions,
          defaultValue: allowEditLicense ? data.community_name : typeof data.community_id !== 'undefined' ? data.community_id : '',
          handleScroll :props.handleCommunityScroll,
          searchable:["Select Community"],
          setSearchText: props.handleCommunitySearch,
          handleToggle:props.handleCommunityToggle,
          readOnly: allowEditLicense && true

        }
      ]
    },
    {
      label:'Effective Date*',
      column: [
        {
          name:'effective_date',
          inputType: allowEditLicense ? 'text' :'date', 
          handleChange:(val)=>{},
          defaultValue:  typeof data.effective_date !== 'undefined' && data.effective_date !== null ? (allowEditLicense ? formatDate(data.effective_date) : data.effective_date ) : '',
          readOnly: allowEditLicense && true

        }
      ]
    },
    {
      label:'Renewal Date*',
      column: [
        {
          name:'renewal__date',
          inputType: allowEditLicense ? 'text' : 'date', 
          handleChange:(val)=>{},
          defaultValue: typeof data.renewal_date !== 'undefined' && data.renewal_date !== null? (allowEditLicense ? formatDate( data.renewal_date) : data.renewal_date)  : '',
          readOnly: allowEditLicense && true,
          isDateRange:true

        }
      ]
    },
    {
      label:'Expired as of Date',
      column: [
        {
          name:'expire_date',
          inputType: allowEditLicense ? 'text' : 'date', 
          handleChange:(val)=>{},
          defaultValue: typeof data.expire_as_of_date !== 'undefined' && data.expire_as_of_date !== null ? (allowEditLicense ? formatDate(data.expire_as_of_date) : data.expire_as_of_date)  : '',
          readOnly: allowEditLicense && true
        }
      ]
    },
    {
      label:'OrgCommunity Pay*',
      column: [
        {
          name:'organization_community_pay',
          inputType: allowEditLicense ? 'text' : 'select',
          title:'Select OrgCommunity Pay',
          options: props.orgComPayOptionList,
          handleChange:(val)=>{},
          defaultValue: allowEditLicense ? data.org_comm_pay_name : typeof data !== 'undefined' ? data.org_community_pay : '',
          readOnly: allowEditLicense && true
        }
      ]
    },
  ];

  const buttonProps = [
    {
      type:'submit',
      value:'save',
      handleButtonClick:handleFormData
    },
    {
      type:'button',
      value:'cancel',
      handleButtonClick:handleCancel

    }
  ]

  return  <FormController  layout={1} column1={column1} buttonProps={buttonProps}  isFormDirty={isFormDirty}
  />;
}

export default LicencesForm
