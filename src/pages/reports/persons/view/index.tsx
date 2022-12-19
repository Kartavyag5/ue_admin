import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FormControl from "../../../../components/form-control/FormControl";
import FormController from "../../../../components/form/FormController";
import ErrorPopup from "../../../../components/popup/ErrorPopup";
import Constants from "../../../../lib/Constants";
import { getPersonsReportList } from "../../../../services/personService";

const Index = () => {

  const router = useRouter();

  const heading="Person Report";
  const userId = router.query.userId;
  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });
  const [personsData, setPersonsData] = useState<any>({});

  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    if (typeof userId !== "undefined") getPersonsDetailForId(userId);
  }, []);

  const getPersonsDetailForId = async (id) => {
    try {
      let reqData = { limit: 1, 
        user_ids: [id], 
        query_type: Constants.queryType.reportDetailView 
      };
      const res = await getPersonsReportList({ reqData });
      setPersonsData({ ...personsData, ...res.user_list[0] });
    } catch (err) {
      setErrorData({ state: true, message: err.message });
    }
  };

  const fields = [
    {
      label: "First Name",
      column: [
        {
          name: "First Name",
          inputType: "text",
          readOnly: true,
          defaultValue: personsData.first_name,
        },
      ],
    },
    {
      label: "Last Name",
      column: [
        {
          name: "Last Name",
          inputType: "text",
          readOnly: true,
          defaultValue: personsData.last_name,
        },
      ],
    },
    {
      label: "Birth Year",
      column: [
        {
          name: "Birth Year",
          inputType: "text",
          readOnly: true,
          defaultValue: personsData.birth_year,
        },
      ],
    },
    {
      label: "Gender",
      column: [
        {
          name: "Gender",
          inputType: "text",
          readOnly: true,
          defaultValue: personsData.gender == 1 ? "Male" : "Female",
        },
      ],
    },
    {
      label: "Email",
      column: [
        {
          name: "Email",
          inputType: "text",
          readOnly: true,
          defaultValue: personsData.email_id,
        },
      ],
    },
    {
      label: "Phone",
      column: [
        {
          name: "Phone",
          inputType: "text",
          readOnly: true,
          defaultValue: personsData.phone_number,
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
          defaultValue: personsData.organization_name,
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
          defaultValue: personsData.community_name,
        },
      ],
    },
    {
      label: "Agreement",
      column: [
        {
          name: "Agreement",
          inputType: "text",
          readOnly: true,
          defaultValue: personsData.agreement == 1 ? "Yes" : "No",
        },
      ],
    },
    {
      label: "Salesforce Contact ID",
      column: [
        {
          name: "Salesforce_Contact_ID",
          inputType: "text",
          readOnly: true,
          defaultValue: personsData.sales_force_id,
        },
      ],
    },
  ];

  return (
    <div className={`container`}>
      <FormControl
        heading={heading}
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
