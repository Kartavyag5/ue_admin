import Tabs from "../../components/tab/Tabs";
import React from "react";
import License from './license/index'
import Games from './games/index'
import Roles from './roles/index'
import PricingPlan from './pricing-plan'
import { useRouter } from "next/dist/client/router";

export default function Index() {

  let router = useRouter();
  const tab_id = router.query.tab_id;
  
  const tabContent = [
    {
      id: 1,
      heading: 'Games',
      content: <Games/>,
    },
    {
      id: 2,
      heading: 'Pricing Plans',
      content: <PricingPlan/>
    },
    {
      id: 3,
      heading: 'Licenses',
      content: <License/>
    },
    {
      id: 4,
      heading: 'Roles',
      content: <Roles/>
    }
  ];

  return (
    <div>
      <h3 className="text_start bold color_navy">Administrative Data Maintenance</h3>
      <Tabs currentTab={tab_id} tabContent={tabContent} />
    </div>
  );
}
