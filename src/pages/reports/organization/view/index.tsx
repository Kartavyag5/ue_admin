import { useRouter }  from "next/router";
import React, { useEffect, useState } from "react";
import FormControl from "../../../../components/form-control/FormControl";
import FormController from "../../../../components/form/FormController";
import ErrorPopup from "../../../../components/popup/ErrorPopup";
import Constants from "../../../../lib/Constants";
import { getOrganizationReport } from "../../../../services/organizationReportService";

const Index = () => {

  const router = useRouter();

  let heading = 'Organization/Community Report';
  const communityId = router.query.communityId;

  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });

  const [organizationData, setOrganizationData] = useState<any>({});

  const handleCancel = () => {
    router.back();
  };

  const getOrganizationDetailForId = async (id) => {
    try {
      let reqData = { limit: 1, community_id: [id], query_type: Constants.queryType.detailView };
      const res = await getOrganizationReport({ reqData });
      setOrganizationData({ ...organizationData, ...res.organization_list[0] });
    } catch (err) {
      setErrorData({ state: true, message: err.message });
    }
  };

  useEffect(() => {
    if(typeof communityId !== 'undefined')
    getOrganizationDetailForId(communityId);
  }, [])

  const fields = [
    {
      label: "Parent Organization",
      column: [
        {
          name: "ParentOrganization",
          inputType: "text",
          readOnly: true,
          defaultValue:organizationData.parent_organization_name,
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
          defaultValue:organizationData.organization_name,
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
          defaultValue: organizationData.community_name,
        },
      ],
    },
    {
      label: "Address",
      column: [
        {
          name: "adress",
          inputType: "text",
          readOnly: true,
          defaultValue:organizationData.street_address,
        },
      ],
    },
    {
      label: "City",
      column: [
        {
          name: "city",
          inputType: "text",
          readOnly: true,
          defaultValue: organizationData.city,
        },
      ],
    },
    {
      label: "State Province",
      column: [
        {
          name: "stateProvince",
          inputType: "text",
          readOnly: true,
          defaultValue: organizationData.state_name,
        },
      ],
    },
    {
      label: "County",
      column: [
        {
          name: "county",
          inputType: "text",
          readOnly: true,
          defaultValue: organizationData.county,
        },
      ],
    },
    {
      label: "Zip Postal",
      column: [
        {
          name: "zipPostal",
          inputType: "text",
          readOnly: true,
          defaultValue:organizationData.zip_postal,
        },
      ],
    },
    {
      label: "SalesForce Account ID (SFID)",
      column: [
        {
          name: "SFID",
          inputType: "text",
          readOnly: true,
          defaultValue:organizationData.sales_force_id,
        },
      ],
    }
  ];

  return (
    <div className={`container`}>
      <FormControl  heading={heading} showBackButton={true} handleBackButton={handleCancel} />

    <FormController column1={fields} />;
      {errorData.state && (
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={"Error"}
        />
      )}

    </div>
  )

}

export default React.memo(Index);