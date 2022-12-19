import React from "react";
import FormController from "../form/FormController";

export default function ContactForm(props) {
  const handleScroll = () => {};

  const fields = [
    {
      label: "Full Name",
      column: [
        {
          name: "name",
          inputType: "text",
        },
      ],
    },
    {
      label: "Email Address",
      column: [
        {
          name: "email_id",
          inputType: "text",
          handleOnBlur: props.handleEmailValidation
        },
      ],
    },
    {
      label: "Category",
      column: [
        {
          name: "category",
          title: "Select Category",
          inputType: "select",
          options: props.options,
          handleScroll: handleScroll,
        },
      ],
    },
    {
      label: "Subject",
      column: [
        {
          name: "subject",
          inputType: "text",
        },
      ],
    },
    {
      label: "Message",
      column: [
        {
          name: "message",
          inputType: "textarea",
          textarea:true
        },
      ],
    },
  ];

  const buttonProps = [
    {
      type: "submit",
      value: "Send",
      handleButtonClick: props.onSendButtonClick,
    },
    {
      type: "button",
      value: "Cancel",
      handleButtonClick: props.onCancelClick,
    },
  ];

  return <FormController column1={fields} buttonProps={buttonProps} />;
}
