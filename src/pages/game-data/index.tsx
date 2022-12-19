import PageControl from "../../components/pageControl/PageControl";
import Table from "../../components/table/table";
import React, { useRef, useState } from "react";
import getTableRow from "../../services/tableRow";
import router from "next/router";
import { puzzlecategoryList } from "../../services/gameDataMaintanance";
import { formatGameData } from "../../helper/tableData";
import { remove_duplicates_from_list } from "../../helper/removeDuplicates";
import Loading from "../../components/text/loading";
import NoDataFound from "../../components/text/noDataFound";
import { getGameList } from "../../services/licenseService";
import ErrorPopup from "../../components/popup/ErrorPopup";
import Constants from "../../lib/Constants";
import { gameDataTableHeader } from "../../lib/tableHeader";

export default function Index() {
  let pageHeading = "Game Data Maintenance";
  let showBottomButtonList = true;
  let pageType = "other";

  const [puzzleCategoryData, setPuzzleCategoryData] = useState([]);

  const [selectedGame, setSelectedGame] = useState([]);
  const [gameList, setGameList] = useState([]);

  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [isSelected, setIsSelected] = useState(false)

  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });  

  let totalPuzzlecategory = useRef(0);
  let gameDropDownPage = useRef(1);
  let gameSearchText =  useRef("");
  


  // api call to fetch game data list
  const getPuzzlecategoryData = async ({pageNumber = page, gameIds = []}) => {
    try {
      let reqData:puzzleCategoryPayload = {
        limit: getTableRow(pageType),
        page_number: pageNumber,
        game_ids:gameIds
      };

      if (gameIds.length === 0) {delete reqData.game_ids;}

      const res = await puzzlecategoryList({ reqData });

      setPuzzleCategoryData(res.puzzle_category_list);
      typeof res.total_count !== "undefined" &&
        setPageCount(Math.ceil(res.total_count / getTableRow(pageType)));
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
    setLoading(false);
  };

  //api call to fetch game  data for filter
  const getGameOptions = async () => {
    try {
      let reqData:gameListPayload = {
        limit: Constants.filterDropDownLimit,
        page_number:gameDropDownPage.current
      };
      if (gameSearchText.current !== "") reqData.game_name = gameSearchText.current;

      const res = await getGameList({ reqData });

      setGameList(gameDropDownPage.current !== 1 ? [...gameList, ...res.game_list] : [...res.game_list]);
      if (typeof res.total_count !== 'undefined') totalPuzzlecategory.current = res.total_count     
    } 
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
  };

  const FormattedGameList = gameList.map(function (option) {
    return { label: option.game_name, value: option.game_id };
  });

  const handleDropDownPageIncreament = () => {
    gameDropDownPage.current += 1;
    getGameOptions();
}

  const handleSearch = (value) => {
    gameSearchText.current = value;
    gameDropDownPage.current = 1;
    getGameOptions();
  };

  const handleScroll = () => {
    if (totalPuzzlecategory.current > gameList.length) handleDropDownPageIncreament()
  };

  const handleChange = (value) => {
    setSelectedGame(value);
    setIsSelected(true)
  };

  const handleGameToggle = (isOpen) => {
    const isOpening = !isOpen;
     if(isOpening && gameSearchText.current.length) {
      gameSearchText.current = "";
      gameDropDownPage.current = 1;
      getGameOptions();
    }
  }

  const handleAddPuzzleButtonClick = () => {
    router.push("/game-data/puzzel/add");
  };

  const handleAddcategoryButtonClick = () => {
    router.push("/game-data/add");
  };

  let filterList = [
    {
      label: "Games",
      type: "MultiSelectDropDown",
      optionsList: FormattedGameList,
      name: "game",
      title: "Search for Game",
      searchText: "Search for Game",
      handleChange: handleChange,
      noOptionText: "No data found",
      handleSearch: handleSearch,
      handleScroll: handleScroll,
      handleToggle:handleGameToggle
    },
  ];

  let bottomButtonList = [
    {
      name: "Add Category",
      handleButtonClick: handleAddcategoryButtonClick,
    },
    {
      name: "Add Puzzle",
      handleButtonClick: handleAddPuzzleButtonClick,
    },
  ];
  const handlePageClick = (page) => {
    setPage(page.selected + 1);
  };

  const handleAplyButton = () => {
    if((selectedGame.length > 0 || isSelected) && isSelected)
    {
    getPuzzlecategoryData({pageNumber:1, gameIds:selectedGame});
    setIsSelected(false)
    }}

  React.useEffect(() => {
    getPuzzlecategoryData({gameIds : !isSelected ? selectedGame : []});
  }, [page]);

  React.useEffect(() =>{
    getGameOptions()
  },[])

  

  return (
    <div className="container">
      <PageControl
        pageHeading={pageHeading}
        filterList={filterList}
        bottomButtonList={bottomButtonList}
        showBottomButtonList={showBottomButtonList}
        handleAplyButton={handleAplyButton}
      />
      <section className="page-content">
        {loading && <Loading />}
        {!loading  && puzzleCategoryData.length === 0 &&  <NoDataFound />}

        {puzzleCategoryData.length !== 0 &&

          <Table
            tableData={formatGameData({ data: puzzleCategoryData })}
            tabelHeader={gameDataTableHeader}
            pagination={true}
            pageCount={pageCount}
            onPageChange={handlePageClick}
          />
        }

        {errorData.state && (
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={"Error"}
        />
      )}
      </section>
    </div>
  );
}
