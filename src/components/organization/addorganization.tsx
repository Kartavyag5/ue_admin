import React from "react";
import FormController from "../form/FormController";

export default function AddOrganizationForm(props) {
  const {
    handleFormData,
    handleCancel,
    handleScroll,
    handleSearch,
    handleDelete,
    handleOrganizationToggle,
    options,
    isFormDirty,
    defaultData: { organizationName, parentOrganizationId },
  } = props;

  

  const fields = [
    {
      label: "Parent Organization",
      column: [
        {
          name: "parent_organization_id",
          title: "Select Parent Organization",
          inputType: "select",
          options: options,
          handleScroll: handleScroll,
          defaultValue: parentOrganizationId ? parentOrganizationId : "",
          searchable: ["Select Organization"],
          setSearchText: handleSearch,
          handleToggle:handleOrganizationToggle
        },
      ],
    },
    {
      label: "Organization Name*",
      column: [
        {
          name: "organization_name",
          inputType: "text",
          defaultValue: organizationName ? organizationName : "",
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

  const buttonProps = parentOrganizationId ? [ ...deleteButton, ...mainButtons] : [...mainButtons]
  

  return (
    <FormController
      layout={1}
      column1={fields}
      buttonProps={buttonProps}
      isFormDirty={isFormDirty}

    />
  );
}
