import PageControl from "../../../components/pageControl/PageControl";
import Table from "../../../components/table/table";
import React, { useEffect, useRef, useState } from "react";
import getTableRow from "../../../services/tableRow";
import {
  gameLevelList,
  getReportPuzzleList,
} from "../../../services/gameDataMaintanance";
import { formatPuzzleReportList } from "../../../helper/tableData";
import { getGameList } from "../../../services/adminDataMaintenance";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import Loading from "../../../components/text/loading";
import NoDataFound from "../../../components/text/noDataFound";
import { formatCatagorylList, formatGameLevelList, formatGameList } from "../../../helper/formatFilterList";
import Constants from "../../../lib/Constants";
import { generatePDF, exportDataToSupportCSVFormat } from "../../../helper/reportGenerator";
import { CSVLink } from "react-csv";
import { puzzlecategoryList } from "../../../services/gameDataMaintanance";
import { puzzleReportTableHeader } from "../../../lib/tableHeader";

export default function Puzzle() {
  let pageHeading = "Puzzle Report";
  let showBackButton = false;
  let showTopButtonList = true;
  let showbottomButtonList = false;
  let pageType = "other";
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [puzzleData, setPuzzleData] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });

  const [gameList, setGameList] = useState([]);
  const [gameLevel, setGameLevelList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [csvExportData, setCsvExportData] = useState([]);

  let totalGame = useRef(0);
  let selectedGameID = useRef([]);
  let gameDropDownPage = useRef(1);
  let gameSearchText = useRef("");

  let selectedGameLevelID = useRef([]);
  let levelSearchText = useRef("");

  let totalPuzzlecategory = useRef(0);
  let categorySearchText = useRef("");
  let categoryDropDownPage = useRef(1);
  let selectedCategoryID = useRef([]);

  let csvLink: any = useRef();
 

  useEffect(() => {
    getPuzzleData({
      gameID: !isSelected ? selectedGameID.current : [],
      gameLevel: !isSelected ? selectedGameLevelID.current : [],
      puzzleCategoryId : !isSelected ? selectedCategoryID.current : [],
    });
  }, [pageNumber]);

  useEffect(() => {
    getGameFilterList();
    getGameLevelOptions();
    getPuzzlecategoryData()

  }, []);

  const FormatedGameList = formatGameList(gameList)
  const FormattedOptionList = formatGameLevelList(gameLevel)
  const FormattedCategoryOptions = formatCatagorylList(categoryList)

  const handleDropDownPageIncreament = () => {
    gameDropDownPage.current += 1;
    getGameFilterList();
  }

  const handleGameSearch = (value) => {
    gameSearchText.current = value;
    gameDropDownPage.current = 1;
    getGameFilterList();
  };
  const handleGameScroll = () => {
    if (totalGame.current > gameList.length) handleDropDownPageIncreament()
  };
  const handleGameChange = (value) => {
    selectedGameID.current = value;
    setIsSelected(true);
  };

  const handleGameToggle = (isOpen) => {
    const isOpening = !isOpen;
     if(isOpening &&   gameSearchText.current.length) {
      gameSearchText.current = "";
      gameDropDownPage.current = 1;
      getGameFilterList();
    }
  }

  const handleGameLevelSearch = (value) => {
    levelSearchText.current = value;
    getGameLevelOptions();
  };

  const handleGameLevelScroll = () => {};

  const handleGameLevelChange = (value) => {
    selectedGameLevelID.current = value;
    setIsSelected(true);
  };

  const handleLevelToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening && levelSearchText.current.length) {
      levelSearchText.current = "";
      getGameLevelOptions();
    }
  }

  const handleCategoryDropDownPageIncreament = () => {
    categoryDropDownPage.current += 1;
    getPuzzlecategoryData()
  }

  const handleCategorySearch = (value) => {
    categorySearchText.current = value;
    categoryDropDownPage.current = 1;
    getPuzzlecategoryData()
  };

  const handleCategoryScroll = () => {
    if (totalPuzzlecategory.current > categoryList.length) handleCategoryDropDownPageIncreament();
  };

  const handleCategoryChange = (value) => {    
    selectedCategoryID.current = value;
    setIsSelected(true);
  };

  const handleCategoryToggle = (isOpen) => {
    const isOpening = !isOpen;
     if(isOpening &&  categorySearchText.current.length) {
      categorySearchText.current = "";
      categoryDropDownPage.current = 1;
      getPuzzlecategoryData()
    }
  }
  
  const handleAplyButton = () => {
    if (
      ( selectedGameID.current.length > 0 ||
        selectedGameLevelID.current.length > 0 ||
        selectedCategoryID.current.length > 0 ||
        isSelected) &&
      isSelected
    ) {
      getPuzzleData({
        page: 1,
        gameID: selectedGameID.current,
        gameLevel: selectedGameLevelID.current,
        puzzleCategoryId:selectedCategoryID.current
      });
      setIsSelected(false);
    }
  };

  let filterList = [
    {
      label: "Category Name",
      type: "MultiSelectDropDown",
      optionsList: FormattedCategoryOptions,
      name: "category name",
      title: "Search for Category Name",
      searchText: "Search for Category Name",
      handleChange: handleCategoryChange,
      noOptionText: "No data found",
      handleSearch: handleCategorySearch,
      handleScroll: handleCategoryScroll,
      handleToggle: handleCategoryToggle
    },
    {
      label: "Game",
      type: "MultiSelectDropDown",
      optionsList: FormatedGameList,
      name: "game",
      title: "Search for Game",
      searchText: "Search for Game",
      handleChange: handleGameChange,
      noOptionText: "No data found",
      handleSearch: handleGameSearch,
      handleScroll: handleGameScroll,
      handleToggle:handleGameToggle
    },
    {
      label: "Game Level",
      type: "MultiSelectDropDown",
      optionsList: FormattedOptionList,
      name: "game level",
      title: "Search for Game Level",
      searchText: "Search for Game Level",
      handleChange: handleGameLevelChange,
      noOptionText: "No data found",
      handleSearch: handleGameLevelSearch,
      handleScroll: handleGameLevelScroll,
      handleToggle: handleLevelToggle
    },
  ];

  const exportAsCSV = async () => {
    const res = await getReportPuzzleList({ reqData: {} });
    const csvFileData = exportDataToSupportCSVFormat({ 
      tableHeader:puzzleReportTableHeader, 
      formatedTablData: formatPuzzleReportList({ data: res.puzzle_list })
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
    const res = await getReportPuzzleList({ reqData: {} });
    generatePDF({
      reportName: pageHeading, 
      headers: puzzleReportTableHeader, 
      data: formatPuzzleReportList({ data: res.puzzle_list })
    });
  };

  const printPageAction = () => {
    window.print();
  };


  let topButtonList = [
    {
      name: "Print",
      handleButtonClick: printPageAction,
    },

    {
      name: "Export to PDF",
      handleButtonClick: exportAsPDF,
    },
    {
      name: "Export to CSV",
      handleButtonClick: exportAsCSV,
    },
  ];

  const handlePageClick = (page) => {
    setPageNumber(page.selected + 1);
  };

  // api call to fetch puzzle list
  const getPuzzleData = async ({
    page = pageNumber,
    puzzleCategoryId = [],
    gameID = [],
    gameLevel = [],
  }) => {
    
    try {
      let reqData: puzzleReportPayload = {
        puzzle_category_ids: puzzleCategoryId,
        game_ids: gameID,
        page_number: page,
        limit: getTableRow(pageType),
        game_levels: gameLevel,
      };
      if (gameLevel.length === 0) delete reqData.game_levels;
      if (puzzleCategoryId.length === 0) delete reqData.puzzle_category_ids;
      if (gameID.length === 0) delete reqData.game_ids;

      const res = await getReportPuzzleList({ reqData });
      setPuzzleData(res.puzzle_list);
      typeof res.total_count !== "undefined" &&
        setPageCount(Math.ceil(res.total_count / getTableRow(pageType)));
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
    setLoading(false);
  };

  //api call to get game filter list
  const getGameFilterList = async () => {
    try {
      let reqData: gameListPayload = {
        limit: Constants.filterDropDownLimit,
        page_number:gameDropDownPage.current
      };
      if (gameSearchText.current !== "")  reqData.game_name = gameSearchText.current;
      const res = await getGameList({ reqData });
      setGameList(gameDropDownPage.current !== 1 ? [...gameList, ...res.game_list] : [...res.game_list]);
      if (typeof res.total_count !== "undefined") totalGame.current = res.total_count;
    }
    catch (err) {
      setErrorData({ state: true, message: err.message });
    }
  };

  //api call to get gameLevel list
  const getGameLevelOptions = async () => {
    try {
      let reqData:gameLevelPayload = {};
      if(levelSearchText.current !== "") reqData.game_level_name = levelSearchText.current;
      const res = await gameLevelList({ reqData });
      setGameLevelList(res);
    } catch (err) {
      setErrorData({ state: true, message: err.message });
    }
  };
  const getPuzzlecategoryData = async () => {
    try {
      let reqData:puzzleCategoryPayload = {
        page_number: categoryDropDownPage.current,
        limit:Constants.filterDropDownLimit
       };

      if (categorySearchText.current !== "")  reqData.category_name = categorySearchText.current; 
      const res = await puzzlecategoryList({ reqData });
      setCategoryList(categoryDropDownPage.current !== 1 ? [...categoryList, ...res.puzzle_category_list] : [...res.puzzle_category_list]);
      if (typeof res.total_count !== 'undefined') totalPuzzlecategory.current = res.total_count    
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });    }
  };

  return (
    <div className="container">
      <PageControl
        pageHeading={pageHeading}
        filterList={filterList}
        topButtonList={topButtonList}
        showBottomButtonList={showbottomButtonList}
        showBackButton={showBackButton}
        showTopButtonList={showTopButtonList}
        handleAplyButton={handleAplyButton}
      />
      <section className="page-content">
        {loading && <Loading />}
        {!loading && puzzleData.length === 0 && <NoDataFound />}
        {puzzleData.length !== 0 && (
          <Table
            tableData={formatPuzzleReportList({ data: puzzleData })}
            tabelHeader={puzzleReportTableHeader}
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
