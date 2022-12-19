import React from "react";
import FormController from "../form/FormController";

export default function AddGame(props) {
  const {
    handleFormData,
    handleCancel,
    defaultData,
    isFormDirty

  } = props;

  let data = typeof defaultData !== "undefined" && defaultData;


  const fields = [
    {
      label: "Game Name*",
      column: [
        {
          name: "game_name",
          inputType: "text",
          defaultValue:  data ? data.game_name : "",
        },
      ],
    },
    {
      label: "Game Description*",
      column: [
        {
          name: "game_description",
          inputType: "text",
          textarea:true,
          defaultValue:  data ?  data.game_description : "",
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
      <FormController
        layout={1}
        column1={fields}
        buttonProps={buttonProps}
        isFormDirty={isFormDirty}
      />
  );
}
