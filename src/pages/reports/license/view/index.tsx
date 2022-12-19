import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FormControl from "../../../../components/form-control/FormControl";
import FormController from "../../../../components/form/FormController";
import ErrorPopup from "../../../../components/popup/ErrorPopup";
import { formatDate } from "../../../../helper/formatDate";
import { getLicenseListReport } from "../../../../services/licenseService";

const Index = () => {
  const router = useRouter();

  const licenseId = router.query.licenseId;

  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });

  const [licenseData, setLicenseData] = useState<any>({});

  const handleCancel = () => {
    router.back();
  };

  const getlicenseDetailForId = async (id) => {
    try {
      let reqData = { limit: 1, license_ids: [id] };
      const res = await getLicenseListReport({ reqData });
      setLicenseData({ ...licenseData, ...res.license_list[0] });
    } catch (err) {
      setErrorData({ state: true, message: err.message });
    }
  };

  useEffect(() => {
    if(typeof licenseId !== 'undefined')
    getlicenseDetailForId(licenseId);
  }, [])

  const fields = [
    {
      label: "License#",
      column: [
        {
          name: "License",
          inputType: "text",
          readOnly: true,
          defaultValue:licenseData.license_number,
        },
      ],
    },
    {
      label: "Organization Name",
      column: [
        {
          name: "Organization",
          inputType: "text",
          readOnly: true,
          defaultValue:licenseData.organization_name,
        },
      ],
    },
    {
      label: "Community Name",
      column: [
        {
          name: "Community",
          inputType: "text",
          readOnly: true,
          defaultValue: licenseData.community_name,
        },
      ],
    },
    {
      label: "Game Licensed",
      column: [
        {
          name: "gameLicensed",
          inputType: "text",
          readOnly: true,
          defaultValue: licenseData.game_name,
        },
      ],
    },
    {
      label: "Game Pricing Plan",
      column: [
        {
          name: "gamePricing",
          inputType: "text",
          readOnly: true,
          defaultValue: licenseData.plan_name,
        },
      ],
    },
    {
      label: "License Effective date",
      column: [
        {
          name: "licenseEffectiveDate",
          inputType: "text",
          readOnly: true,
          defaultValue: licenseData.effective_date ? formatDate(licenseData.effective_date) : "",
        },
      ],
    },
    {
      label: "Renewal date",
      column: [
        {
          name: "Renewal",
          inputType: "text",
          readOnly: true,
          defaultValue: licenseData.renewal_date ? formatDate(licenseData.renewal_date) : "",
        },
      ],
    },
    {
      label: "In Effect",
      column: [
        {
          name: "InEffect",
          inputType: "text",
          readOnly: true,
          defaultValue: licenseData.in_effect==0?"N":"Y",
        },
      ],
    },
    {
      label: "Expiry as of  date",
      column: [
        {
          name: "expiry date",
          inputType: "text",
          readOnly: true,
          defaultValue: licenseData.expire_as_of_date ? formatDate(licenseData.expire_as_of_date) : "" ,
        },
      ],
    },
    {
      label: "Org Community pays",
      column: [
        {
          name: "orgcommunitypay",
          inputType: "number",
          readOnly: true,
          defaultValue: licenseData.org_community_pay,
        },
      ],
    },
  ];

  return (
    <div className={`container`}>
      <FormControl
        heading={"License Report"}
        showBackButton={true}
        handleBackButton={handleCancel}
      />
      <FormController column1={fields} />;
      {errorData.state && (
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={"Error"}
        />
      )}
    </div>
  );
};

export default React.memo(Index);
