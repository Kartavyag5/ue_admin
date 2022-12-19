import React, { useEffect, useRef, useState } from "react";
import PageControl from "../../../components/pageControl/PageControl";
import Table from "../../../components/table/table";
import getTableRow from "../../../services/tableRow";
import Loading from "../../../components/text/loading";
import NoDataFound from "../../../components/text/noDataFound";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import { formatGameReportData } from "../../../helper/tableData";
import { getGameList } from "../../../services/adminDataMaintenance";
import { formatGameList } from "../../../helper/formatFilterList";
import { generatePDF, exportDataToSupportCSVFormat } from "../../../helper/reportGenerator";
import { CSVLink } from "react-csv";
import Constants from "../../../lib/Constants";
import { gameReportTableHeader } from "../../../lib/tableHeader";

interface gamesListReqBody {
  page_number?: number;
  limit?: number;
  last_id?: number;
  name?: string;
  game_ids?: Array<number>;
}

export default function Games() {
  const [pageCount, setPageCount] = useState(5);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [gameReportData, setGameReportData] = useState([]);
  const [gamesListFilterData, setGamesListFilterData] = useState([]);
  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });
  const [isSelected, setIsSelected] = useState(false);
  const [csvExportData, setCsvExportData] = useState([])
  let pageType = "other";
  let pageHeading = "Game Report";
  let showBackButton = false;
  let showTopButtonList = true;
  let showbottomButtonList = true;
  let filterGameIds = useRef([]);
  let csvLink: any = useRef();

  let gameDropDownPage = useRef(1);
  let gameSearchText = useRef("");
  let totalGame = useRef(0);

  useEffect(() => {
    getGameData({gameId:!isSelected ? filterGameIds.current : []});
  }, []);

  // const componentRef = useRef();

  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  // });
  // api call to fetch gameList list
  const getGameData = async ({ pageNumber = page, gameId = [] }) => {
    try {
      let reqData: gamesListReqBody = {
        limit: getTableRow(pageType),
        page_number: pageNumber,
        game_ids: gameId,
      };

      const res = await getGameList({ reqData });
      setGameReportData(res.game_list);
      if(typeof res.total_count !== "undefined"){
        setPageCount(Math.ceil(res.total_count / getTableRow(pageType)));
        totalGame.current = res.total_count;
      }
      if (gamesListFilterData.length == 0) setGamesListFilterData([...res.game_list])
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }

    setLoading(false);
  };

  //API call for filterList
  const getFilterData = async () => {
    try {
      let reqData:gameListPayload = {
        limit: Constants.filterDropDownLimit,
        page_number:gameDropDownPage.current
      };
      if (gameSearchText.current !== "")  reqData.game_name = gameSearchText.current;
      const gamesListRes = await getGameList({ reqData });
      setGamesListFilterData(gameDropDownPage.current !== 1 ? [...gamesListFilterData,...gamesListRes.game_list] : [...gamesListRes.game_list]);
      if(gamesListRes.total_count) totalGame.current = gamesListRes.total_count;
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  const FormattedOptionList =formatGameList(gamesListFilterData)


  const handleDropDownPageIncreament = () => {
    gameDropDownPage.current += 1;
    getFilterData();
  }

  const handleSearch = (value) => {
    gameSearchText.current = value;
    gameDropDownPage.current = 1;
    getFilterData();
  };

  const handleScroll = () => {
    if(totalGame.current > gamesListFilterData.length ) handleDropDownPageIncreament()
  };

  const handleChange = (value) => {
    filterGameIds.current = value;
    setIsSelected(true);
  };

  const handleGameToggle = (isOpen) => {
    const isOpening = !isOpen;
     if(isOpening &&   gameSearchText.current.length) {
      gameSearchText.current = "";
      gameDropDownPage.current = 1;
      getFilterData();
    }
  }


  const printPageAction = () => {
    window.print();
  };

  const exportAsCSV = async () => {
    const res = await getGameList({ reqData: {} });
    const csvFileData = exportDataToSupportCSVFormat({ 
      tableHeader:gameReportTableHeader, 
      formatedTablData: formatGameReportData({ data: res.game_list })
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
    const res = await getGameList({ reqData: {} });
    generatePDF({
      reportName: pageHeading, 
      headers: gameReportTableHeader, 
      data: formatGameReportData({ data: res.game_list })
    });
  };
  

  let filterList = [
    {
      label: "Games",
      type: "MultiSelectDropDown",
      optionsList: FormattedOptionList,
      name: "game",
      title: "Search for Game",
      searchText: ["Search for Game"],
      handleChange: handleChange,
      noOptionText: "No data found",
      handleSearch: handleSearch,
      handleScroll: handleScroll,
      handleToggle:handleGameToggle
    },
  ];

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

  const handlePageClick = (page) => {
    setPage(page.selected + 1);
  };
  const handleAplyButton = () => {
    if ((filterGameIds.current.length > 0 || isSelected) && isSelected) {
      getGameData({ pageNumber: 1, gameId: filterGameIds.current });
      setIsSelected(false);
    }
  };

  return (
    <div className="container">
      <PageControl
        pageHeading={pageHeading}
        filterList={filterList}
        topButtonList={topButtonList}
        bottomButtonList={bottomButtonList}
        showBottomButtonList={showbottomButtonList}
        showBackButton={showBackButton}
        showTopButtonList={showTopButtonList}
        handleAplyButton={handleAplyButton}
      />
      <section className="page-content">
        {loading && <Loading />}
        {!loading && gameReportData.length === 0 && <NoDataFound />}
        {gameReportData.length !== 0 && (
          <Table
            tableData={formatGameReportData({ data: gameReportData })}
            tabelHeader={gameReportTableHeader}
            pagination={true}
            pageCount={pageCount}
            onPageChange={handlePageClick}
          />
        )}
      </section>
      {errorData.state && (
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={"Error"}
        />
      )}

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
