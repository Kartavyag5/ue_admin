import React, { useEffect, useRef, useState } from "react";
import PageControl from "../../../components/pageControl/PageControl";
import Table from "../../../components/table/table";
import { formatPricingPlanExport, formatPricingPlanReport } from "../../../helper/tableData";
import { getGameList, getPricingPlanList} from "../../../services/adminDataMaintenance";
import getTableRow from "../../../services/tableRow";
import Loading from "../../../components/text/loading"
import NoDataFound from "../../../components/text/noDataFound";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import { formatGameList } from "../../../helper/formatFilterList";
import Constants from "../../../lib/Constants";
import { generatePDF, exportDataToSupportCSVFormat } from "../../../helper/reportGenerator";
import { CSVLink } from "react-csv";
import { pricingPlanExportHeader, pricingPlanReportHeader } from "../../../lib/tableHeader";

export default function PricingPlan() {
  
  let pageType = "other"
  let pageHeading = "Pricing Plans Report";
  let showTopButtonList = true;
  let showbottomButtonList = true;

  const[gameForFilter, setGameForFilter] = useState([])

  const [pageCount, setPageCount] = React.useState(0);
  const [pageNumber, setPageNumber] = useState(1)
  const [pricingPlanReport, setPricingPlanReport] = useState([])

  const [isSelected, setIsSelected] = useState(false)
  const [loading, setLoading] = useState(true)

  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });
  const [csvExportData, setCsvExportData] = useState([]);
  let csvLink: any = useRef();

  let totalGame = useRef(0)
  let filterGameIds = useRef([])
  let gameDropDownPage = useRef(1);
  let gameSearchText = useRef("");

  useEffect(() => {
    gameDataForFilter()
  }, [])


  useEffect(() => {
    getPricingPlanReportList({gameIds: !isSelected ? filterGameIds.current : []})
  }, [pageNumber])


  //api call to get game filter list
  const gameDataForFilter = async() => {
    try{
      let reqData:gameListPayload = {
        limit:Constants.filterDropDownLimit,
        page_number:gameDropDownPage.current
      }
      if (gameSearchText.current !== "")  reqData.game_name = gameSearchText.current;
     
      const res = await getGameList({reqData})
      setGameForFilter(gameDropDownPage.current !== 1 ? [...gameForFilter, ...res.game_list] : [...res.game_list]);
      if (typeof res.total_count !== 'undefined') totalGame.current = res.total_count
    }
    catch(err){
        console.error(err);   
        setErrorData({ state: true, message: err.message });
    }   
  }


  //api call to get pricing plan report list
  const getPricingPlanReportList = async({page=pageNumber, gameIds = []}) => {
    try{
        let reqData:planlistPayload = {
          limit: getTableRow(pageType),
          page_number: page
        }
        if(gameIds.length > 0) reqData.game_ids = gameIds;

        const res  = await getPricingPlanList({reqData})

        const formatedTableData = formatPricingPlanReport({data:res.pricing_plan_list, isPdf:false})
        setPricingPlanReport(formatedTableData);

        if (page === 1) {
          res.total_count && setPageCount(Math.ceil(res.total_count / getTableRow(pageType)));
        }
    }
    catch(err){
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
    setLoading(false)
  }


  const FormattedOptionList = formatGameList(gameForFilter)

  const handleDropDownPageIncreament = () => {
    gameDropDownPage.current += 1;
    gameDataForFilter () 
  }


  const handleGameSearch = (game) => {
    gameSearchText.current = game;
    gameDropDownPage.current = 1;
    gameDataForFilter () 
   };

  const handleGameScroll = () => {
    if(totalGame.current > gameForFilter.length) handleDropDownPageIncreament()
   };

  const handleGameChange = (game) => {
    filterGameIds.current = game;
    setIsSelected(true)
  };

  const handleGameToggle = (isOpen) => {
    const isOpening = !isOpen;
    if(isOpening && gameSearchText.current.length) {
      gameSearchText.current = "";
      gameDropDownPage.current = 1;
      gameDataForFilter () 
    }
  }

  const handlePageClick = (page) => {
    setPageNumber(page.selected + 1) 
   };

  // filter table list on dropdown data 
  const handleAplyButton = () => {
    if((filterGameIds.current.length > 0 || isSelected) && isSelected){
      getPricingPlanReportList({gameIds: filterGameIds.current, page:1})
    }
    setIsSelected(false)
  }

  
  let filterList = [
    {
      label: "Games",
      type: "MultiSelectDropDown",
      optionsList: FormattedOptionList,
      name: "game",
      title: "Search for Game",
      searchText: "Search for Game",
      handleChange: handleGameChange,
      noOptionText: "No data found",
      handleSearch: handleGameSearch,
      handleScroll: handleGameScroll,
      handleToggle: handleGameToggle
    },
  ];

  const exportAsCSV = async () => {
    const res  = await getPricingPlanList({reqData : {}})
    const csvFileData = exportDataToSupportCSVFormat({ 
      tableHeader: pricingPlanExportHeader, 
      formatedTablData: formatPricingPlanExport({ data: res.pricing_plan_list })
    });
    setCsvExportData(csvFileData);
    // Use effect with "csvExportData" as dependecy gets executed
  }

  useEffect(()=> {
    if(csvExportData.length) {
      // TODO: Find different approcah to handle asyc data
      // Issue: https://github.com/react-csv/react-csv/issues/72
      setTimeout(() => {
        csvLink.current.link.click();
     }, 1000);
    };
  }, [csvExportData])

  const exportAsPDF = async() => {
    const res  = await getPricingPlanList({reqData : {}})
    generatePDF({
      reportName: pageHeading, 
      headers: pricingPlanReportHeader, 
      data: formatPricingPlanReport({ data: res.pricing_plan_list, isPdf:true })
    });
  };

  const printPageAction = () => {
    window.print();
  };

  let topButtonList = [
    {
      name: "Export to CSV",
      handleButtonClick: exportAsCSV,
    },
  ];

  let bottomButtonList = [
    {
      name: "Print",
      handleButtonClick: printPageAction,
    },

    {
      name: "Export to PDF",
      handleButtonClick: exportAsPDF,
    },
  ];

 
 
  return (
    <div className="container">
      <PageControl
        pageHeading={pageHeading}
        filterList={filterList}
        topButtonList={topButtonList}
        bottomButtonList={bottomButtonList}
        showBottomButtonList={showbottomButtonList}
        showTopButtonList={showTopButtonList}
        handleAplyButton={handleAplyButton}
      />
      <section className="page-content">
      {loading && <Loading/>}
      {!loading && pricingPlanReport.length === 0 && <NoDataFound/>}
      {pricingPlanReport.length > 0 &&
        <Table
          tableData={pricingPlanReport}
          tabelHeader={pricingPlanReportHeader}
          pagination={true}
          pageCount={pageCount}
          onPageChange={handlePageClick}
        />}
      </section>
      {errorData.state && 
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={"Error"}
        />
        }

      <CSVLink
         data={csvExportData}
         filename= {`${pageHeading}.csv`}
         className='hidden'
         ref={csvLink}
         target='_blank'
      />
    </div>
  );
}
