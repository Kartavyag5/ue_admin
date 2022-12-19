import React from "react";
import FormController from "../form/FormController";

export default function AddRole({ editData, handleCancel, handleFormData,isFormDirty}) {
  let data = typeof editData !== "undefined" && editData;
  

  const fields = [
    {
      label: "Role Name*",
      column: [
        {
          name: "role_name",
          inputType: "text",
          defaultValue: data.role_name,
        },
      ],
    },
    {
      label: "Role Description*",
      column: [
        {
          name: "role_description",
          inputType: "textarea",
          defaultValue: data.role_description,
          textarea:true
        },
      ],
    },
  ];

  const buttonProps = [
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

  return (
    <FormController layout={1} column1={fields} buttonProps={buttonProps} isFormDirty={isFormDirty}/>
  );
}
