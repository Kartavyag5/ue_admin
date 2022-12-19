import React from "react";
import FormController from "../form/FormController";

export default function AddPerson({
  editData,
  genderOptions,
  agreementOptions,
  handleFormData,
  handleCancel,
  handleEmailvalidation,
  isFormDirty,
  handleDelete
}) 
{
  let data = typeof editData !== "undefined" && editData;  

  const field_set_1 = [
    {
      label: "First Name*",
      column: [
        {
          name: "first_name",
          inputType: "text",
          defaultValue: typeof data !== "undefined" ? data.first_name : "",
        },
      ],
    },
    {
      label: "Last Name*",
      column: [
        {
          name: "last_name",
          inputType: "text",
          defaultValue: typeof data !== "undefined" ? data.last_name : "",
        },
      ],
    },
    {
      label: "Email",
      column: [
        {
          name: "email_id",
          inputType: "email",
          defaultValue:  data.email_id ? data.email_id : "",
          handleOnBlur : handleEmailvalidation,
          handleChange : (val) => {}
        },
      ],
    },
    {
      label: "Birth Year*",
      column: [
        {
          name: "birth_year",
          inputType: "number",
          defaultValue: typeof data !== "undefined" ? data.birth_year : "",
        },
      ],
    },
  ];

  const field_set_2 = [
    {
      label: "Gender*",
      column: [
        {
          name: "gender",
          title: "Select Gender",
          inputType: "select",
          options: genderOptions,
          defaultValue: typeof data !== "undefined" ? data.gender : "",
        },
      ],
    },
    {
      label: "Phone",
      column: [
        {
          name: "phone",
          inputType: "number",
          defaultValue: data.phone_number ? (data.phone_number).slice(1,11) : "",
        },
      ],
    },
    {
      label: "Agreement*",
      column: [
        {
          name: "agreement",
          inputType: "select",
          title: "Select Agreement",
          options:agreementOptions,
          defaultValue: typeof data !== "undefined" ? data.agreement : ""
        },
      ],
    },
    {
      label: "Salesforce ID",
      column: [
        {
          name: "sales_force_id",
          inputType: "text",
          defaultValue: Number.isInteger(data.sales_force_id) ? data.sales_force_id : "",
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

  const buttonProps = data.user_id ? [ ...deleteButton, ...mainButtons] : [...mainButtons]

  return (

    <FormController
      layout={2}
      isAddRole={true}
      column1={field_set_1}
      column2={field_set_2}
      buttonProps={buttonProps}
      defaultRoleData={data.user_comm_role}
      isFormDirty={ isFormDirty}

    />
  );
}
