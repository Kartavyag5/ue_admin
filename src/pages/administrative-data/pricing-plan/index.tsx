import PageControl from "../../../components/pageControl/PageControl";
import Table from "../../../components/table/table";
import React, { useEffect, useRef, useState } from "react";
import getTableRow from "../../../services/tableRow";
import { formatPricingPlanData } from "../../../helper/tableData";
import { getPricingPlanList } from "../../../services/adminDataMaintenance";
import router from "next/router";
import Loading from "../../../components/text/loading"
import NoDataFound from "../../../components/text/noDataFound";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import Constants from "../../../lib/Constants";
import { pricingPlanTableHeader } from "../../../lib/tableHeader";



interface pricingPlanReqBody {
  page_number?: number;
  limit?: number;
  last_id?: number;
  plan_name?: string;
  game_ids?: Array<number>;
  pricing_plan_ids?:  Array<number>;
}

export default function PricingPlan() {

  const [loading, setLoading] = useState(true); 

  const [pageCount, setPageCount] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);

  const [formatedTableData, setFormatedTableData] = useState([]);
  const [pricingPlanListFilterData, setPricingPlanListFilterData] = useState([]);

  const [isSelected, setIsSelected] = useState(false)


  let totalEntries = useRef(0);
  let filterPlanIds = useRef([]);
  let showBottomButtonList = true;
  let pageType = "adminstrative";
  let planDropDown =  useRef(1);
  let planSearchText = useRef("");

  const [errorData, setErrorData] = React.useState({
    state: false,
    message: "",
  });

  useEffect(() => {
    (async () => {
      const pricingPlanListRes = await getPricingPlanData({
        page_number: pageNumber,
        limit: getTableRow(pageType),
        pricing_plan_ids: !isSelected ? filterPlanIds.current : []       
      });
      if (pageNumber === 1) {
        // Total count is sent only if page number is 1
        totalEntries.current = pricingPlanListRes.total_count;
        pricingPlanListRes.total_count &&
        setPageCount(Math.ceil(pricingPlanListRes.total_count / getTableRow(pageType)));
      }
      setFormatedTableData(
        formatPricingPlanData({ data: pricingPlanListRes.pricing_plan_list })
      );
      if(pricingPlanListFilterData.length === 0)
      { setPricingPlanListFilterData(pricingPlanListRes.pricing_plan_list); // TODO: Trigger on dropdown click
    }     
       setLoading(false)

    })();
  }, [pageNumber]);

  React.useEffect(() => {
    // shallow page load to push tab_id to url
    router.push({
        pathname: '/administrative-data',
        query: { tab_id: '2' }
      }, undefined, { shallow: true }
    )
  }, [])

  const getPricingPlanData = async (reqData: pricingPlanReqBody) => {
    try {
      if(reqData.plan_name === "") delete reqData.plan_name
      const pricingPlanListRes = await getPricingPlanList({ reqData });
      pricingPlanListRes.total_count &&
      setPageCount(Math.ceil(pricingPlanListRes.total_count / getTableRow(pageType)));
      return pricingPlanListRes;
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  const FormattedOptionList = pricingPlanListFilterData.map((option) => {
    return { label: option.plan_name, value: option.pricing_plan_id };
  });

  const handleSearch = async (searchString) => {
    try {
      planDropDown.current = 1;
      planSearchText.current = searchString;
      const gamesListRes = await getPricingPlanData({
        plan_name:planSearchText.current, 
        page_number:planDropDown.current, 
        limit:Constants.filterDropDownLimit
      });
      setPricingPlanListFilterData([...gamesListRes.pricing_plan_list]);
      if(gamesListRes.total_count) totalEntries.current = gamesListRes.total_count;
    }
    catch (err) {
      throw err;
    }
  };

  const handleScroll = async () => {
    try {
      if (totalEntries.current > pricingPlanListFilterData.length) {
        planDropDown.current += 1;
        // const lastPricingPlanData =
        //   pricingPlanListFilterData[pricingPlanListFilterData.length - 1];
        const pricingPlanRes = await getPricingPlanData({
          // last_id: lastPricingPlanData.pricing_plan_id,
          page_number:planDropDown.current,
          limit: Constants.filterDropDownLimit,
        });
        setPricingPlanListFilterData([
          ...pricingPlanListFilterData,
          ...pricingPlanRes.pricing_plan_list,
        ]);
      }
    } catch (err) {
      throw err;
    }
  };

  const handleChange = (pricingPlanIds) => {
    filterPlanIds.current = pricingPlanIds;
    setIsSelected(true)
  };

  const handlePlanDropDownToggle = async (isOpen) => {
    const isOpening = !isOpen;
     if(isOpening &&  planSearchText.current.length) {
      planSearchText.current = "";
      planDropDown.current = 1;
      const gamesListRes = await getPricingPlanData({
        plan_name:planSearchText.current,
        page_number:planDropDown.current, 
        limit:Constants.filterDropDownLimit });
      setPricingPlanListFilterData([
        ...gamesListRes.pricing_plan_list,
      ]);
      if(gamesListRes.total_count) totalEntries.current = gamesListRes.total_count;
    }
  }

  const handleButtonClick = () => {
    router.push("/administrative-data/pricing-plan/add");
  };

  let filterList = [
    {
      label: "Pricing Plan",
      type: "MultiSelectDropDown",
      optionsList: FormattedOptionList,
      name: "Pricing Plan",
      title: "Search for Plan",
      searchText: "Search for Plan",
      handleChange: handleChange,
      noOptionText: "No data found",
      handleSearch: handleSearch,
      handleScroll: handleScroll,
      handleToggle:handlePlanDropDownToggle
    },
  ];

  let bottomButtonList = [
    {
      name: "Add Plan",
      handleButtonClick: handleButtonClick,
    },
  ];

  const handlePageClick = (page) => {
    setPageNumber(page.selected + 1);
  };

  const handleAplyButton = async () => {
    try {
      if((filterPlanIds.current.length > 0 || isSelected) && isSelected)
       {
         const pricingPlanListData = await getPricingPlanData({
          pricing_plan_ids: filterPlanIds.current,
          page_number: 1,
          limit: getTableRow(pageType),
        });
        setFormatedTableData(
          formatPricingPlanData({ data: pricingPlanListData.pricing_plan_list })
        );
      }
      setIsSelected(false)
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
  };

  return (
    <div className="container">
      <PageControl
        filterList={filterList}
        bottomButtonList={bottomButtonList}
        showBottomButtonList={showBottomButtonList}
        handleAplyButton={handleAplyButton}
      />
      <section className="page-content">
      {loading && <Loading/>}
        {!loading  && formatedTableData.length === 0 &&  <NoDataFound />}
        {formatedTableData.length !== 0 &&
          <Table
            tableData={formatedTableData}
            tabelHeader={pricingPlanTableHeader}
            pagination={true}
            pageCount={pageCount}
            onPageChange={handlePageClick}
          />
        }
      </section>
      {errorData.state && (
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={"Error"}
        />
      )}
    </div>
  );
}
