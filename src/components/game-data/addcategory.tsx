import React from "react";
import FormController from "../form/FormController";

export default function AddCategory({editData, handleFormData, handleCancel,isFormDirty,handleDelete,  ...props}) {

  let data = typeof editData !== 'undefined' && (editData);
  
  const fields = [
    {
      label:'Game*',
      column : [
        {
          name:'game',
          title:'Select game',
          inputType:'select',
          handleChange:(val)=>{},
          options: props.gameOptionList,
          defaultValue: typeof data !== 'undefined' ? data.game_id : '',
          handleScroll :props.handleGameScroll,
          searchable:["Select Game"],
          setSearchText: props.handleGameSearch,
          handleToggle:props.handleGameToggle
        }
      ]
    },
   
    {
      label:'Category Name*',
      column: [
        {
          name:'category_name',
          inputType:'text',
          defaultValue: typeof data !== 'undefined' ? data.category_name : '',
        }
      ]
    },
    {
      label:'Category Description*',
      column: [
        {
          name:'category_description',
          inputType: "text",
          textarea:true,
          defaultValue: typeof data !== 'undefined' ? data.category_description : '',
        }
      ]
    },
  ]

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

  const buttonProps = data.puzzle_category_id ? [ ...deleteButton, ...mainButtons] : [...mainButtons]

  return (
      <FormController
        layout={1}
        column1={fields}
        buttonProps={buttonProps}
        isFormDirty={isFormDirty}
      />
      
  );}
