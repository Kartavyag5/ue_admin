import React from "react";
import FormController from "../form/FormController";

export default function AddPlan(props) {
  const {
    options,
    handleFormData,
    handleCancel,
    defaultData,
    handleDelete,
    isFormDirty
  } = props;

  let data = typeof defaultData !== "undefined" && defaultData;
  
  const fields = [
    {
      label: "Plan Name*",
      column: [
        {
          name: "plan_name",
          inputType: "text",
          defaultValue:data ? data.plan_name: "",
        },
      ],
    },
    {
      label: "Plan Description*",
      column: [
        {
          name: "plan_description",
          inputType: "text",
          defaultValue: data ? data.plan_description : "",
          textarea:true,

        },
      ],
    },

    {
      label: "Game*",
      column: [
        {
          name: "game",
          inputType: "select",
          defaultValue: data ? data.game_id : "",
          title:"Select Game",
          options: options,
          handleScroll:props.handleGameScroll,
          searchable:["Select Game"],
          setSearchText: props.handleGameSearch,
          handleToggle:props.handleGameToggle

        },
      ],
    },
    {
      label: "Price Per Month*",
      column: [
        {
          name: "price_per_month",
          inputType: "text",
          defaultValue: data ? data.price_per_month : "",

        },
      ],
    },
    {
      label: "Price Per Year*",
      column: [
        {
          name: "price_per_year",
          inputType: "text",
          defaultValue: data ? data.price_per_year : "",

        },
      ],
    },
    {
      label: "Hosted Games*",
      column: [
        {
          name: "hosted_games",
          inputType: "text",
          defaultValue: data ? data.hosted_games : "",

        },
      ],
    },
    {
      label: "Extra Hosted Games*",
      column: [
        {
          name: "extra_hosted_games",
          inputType: "text",
          defaultValue: data ? data.xtra_hosted_games : "",

        },
      ],
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

  const buttonProps = data.pricing_plan_id ? [ ...deleteButton, ...mainButtons] : [...mainButtons]

  return (
      <FormController 
        layout={1} 
        column1={fields} 
        buttonProps={buttonProps}  
        isFormDirty={isFormDirty} />
  )
}
