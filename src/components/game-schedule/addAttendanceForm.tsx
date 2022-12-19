import React from "react";
import FormController from "../form/FormController";

export default function AddAttendanceForm(props) {
  const {
    name,
    userOptionList,
    handleUserSearch,
    handleUserToggle,
    handleUserChange,
    userTypeOptionList,
    handleFormData,
    handleCancel,
    isFormDirty,
  } = props;



  const names = name && name.split(/(?<=^\S+)\s/)

  const formFields = [
    {
      label: "Name*",
      column: [
        {
          name: "user",
          title: "Select User",
          inputType: "select",
          options: userOptionList,
          searchable: ["Select User"],
          setSearchText: handleUserSearch,
          handleToggle: handleUserToggle,
          handleChange: handleUserChange
        },
      ],
    },
    {
      label: "First Name*",
      column: [
        {
          name: "first_name",
          inputType: "text",
          defaultValue: names && names[0],
          readOnly: (names && names[0] !== "None")
        },
      ],
    },
    {
      label: "Last Name*",
      column: [
        {
          name: "last_name",
          inputType: "text",
          defaultValue: names && names[1],
          readOnly: (names && names[1] !== "None")

        },
      ],
    },
    {
      label: "Email",
      column: [
        {
          name: "email_id",
          inputType: "text",
        },
      ],
    },
    {
      label: "Person Type*",
      column: [
        {
          name: "user_type",
          title: "Select User Type",
          inputType: "select",
          options: userTypeOptionList,
        },
      ],
    },
    {
      label: 'Join At',
      column: [
        {
          name: 'join_at',
          inputType: 'date',
          handleChange: (val) => { },
          showTime: true,
          isDateRange : true

        }
      ]
    },
    {
      label: 'Leave At',
      column: [
        {
          name: 'leave_at',
          inputType: 'date',
          handleChange: (val) => { },
          showTime: true,
          isDateRange : true


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

  return (
    <FormController
      layout={1}
      column1={formFields}
      buttonProps={mainButtons}
      isFormDirty={isFormDirty}
      isAttendance={true}
    />
  );
}
