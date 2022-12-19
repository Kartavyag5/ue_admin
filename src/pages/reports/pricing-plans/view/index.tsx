import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FormControl from "../../../../components/form-control/FormControl";
import FormController from "../../../../components/form/FormController";
import ErrorPopup from "../../../../components/popup/ErrorPopup";

const Index = () => {

  const router = useRouter();

  let heading = "Pricing Plans Report";
  const {
    planName,
    planDescription,
    gameName,
    pricePerMonth,
    pricePerYear,
    hostedGames,
    extraHostedGames,
  } = router.query;


  const fields = [
    {
      label: "Plan Name",
      column: [
        {
          name: "plan_name",
          inputType: "text",
          defaultValue: planName,
          readOnly: true, // make the field readonly for report/pricing-plan/view page
        },
      ],
    },
    {
      label: "Plan Description",
      column: [
        {
          name: "plan_description",
          inputType: "textarea",
          textarea:true,
          defaultValue:  planDescription ,
          readOnly: true,
        },
      ],
    },

    {
      label: "Game",
      column: [
        {
          name: "game",
          inputType: "text",
          defaultValue: gameName,
          readOnly: true,
        },
      ],
    },
    {
      label: "Price Per Month",
      column: [
        {
          name: "price_per_month",
          inputType: "text",
          defaultValue: pricePerMonth ,
          readOnly: true,
        },
      ],
    },
    {
      label: "Price Per Year",
      column: [
        {
          name: "price_per_year",
          inputType: "text",
          defaultValue: pricePerYear ,
          readOnly: true,
        },
      ],
    },
    {
      label: "Hosted Games",
      column: [
        {
          name: "hosted_games",
          inputType: "text",
          defaultValue: hostedGames ,
          readOnly: true,
        },
      ],
    },
    {
      label: "Extra Hosted Games",
      column: [
        {
          name: "extra_hosted_games",
          inputType: "text",
          defaultValue: extraHostedGames ,
          readOnly: true,
        },
      ],
    },
  ];

  const handleCancel=()=>{
    router.back()
  }
  return (
    <div className={`container`}>
      <FormControl
        heading={heading}
        showBackButton={true}
        handleBackButton={handleCancel}
      />
      <FormController column1={fields} />
    </div>
  );
};

export default React.memo(Index);
