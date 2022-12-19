import React, { useRef, useState } from "react";
import PageControl from "../../../components/pageControl/PageControl";
import Table from "../../../components/table/table"
import router, { useRouter } from "next/router";
import { gameLevelList, puzzleEdit, puzzleList } from "../../../services/gameDataMaintanance";
import { formatPuzzleData } from "../../../helper/tableData";
import { find_difference } from "../../../helper/removeDuplicates";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import getTableRow from "../../../services/tableRow";
import { puzzleGameTableHeader } from "../../../lib/tableHeader";
import Loading from "../../../components/text/loading"
import NoDataFound from "../../../components/text/noDataFound";
import Constants from "../../../lib/Constants";

const Puzzle = () => {

  const router = useRouter();

  let puzzleCategoryId = router.query.puzzleCategoryId;
  let gameName = router.query.gameName;
  let pageHeading = `Puzzles ${gameName}`;
  let showBackButton = true;
  let showBottomButtonList = true;
  let pageType = "gameSchedule";



  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const [puzzleData, setPuzzleData] = useState([])
  const [data, setData] = useState([])
  const [gameLevel, setGameLevel] = useState([])
  const [selectedGameLevel, setSelectedGameLevel] = useState([])

  const [isSelected, setIsSelected] = useState(false)
  const [loading, setLoading] = React.useState(true);

  const [errorData, setErrorData] = useState<errorData>({
    state: false,
    message: "",
    alertType:1,
  });

  let levelSearchText = useRef("");
  let puzzleID = useRef()

  // api call to fetch puzzle list
  const getPuzzleData = async ({ gameLevel = [], page = pageNumber }) => {
    try {
      let reqData: puzzlePayload = {
        puzzle_category_id: router.query.puzzleCategoryId,
        page_number: page,
        limit: getTableRow(pageType),
        game_level: gameLevel
      };

      if (gameLevel.length === 0) delete reqData.game_level;

      const res = await puzzleList({ reqData });
      setPuzzleData(res.puzzle_list);
      setData(res.puzzle_list)

      if (page === 1) {
        res.total_count && setPageCount(Math.ceil(res.total_count / getTableRow(pageType)));
      }
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
    setLoading(false)
  }

  //api call to fetch game level for filter
  const getGameLevelOptions = async () => {
    try {
      let reqData: gameLevelPayload = {};
      if (levelSearchText.current !== "") reqData.game_level_name = levelSearchText.current;
      const res = await gameLevelList({ reqData });
      setGameLevel(res);
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  const gameLevelOptionList = gameLevel.map(function (option) {
    return { label: option.game_level_name, value: option.game_level };
  });

  const handleSearch = (value) => {
    levelSearchText.current = value;
    getGameLevelOptions();

  };

  const handleScroll = () => { };

  const handleChange = (value) => {
    setSelectedGameLevel(value);
    setIsSelected(true)
  };

  const handleGameToggle = (isOpen) => {
    const isOpening = !isOpen;
    if (isOpening && levelSearchText.current.length) {
      levelSearchText.current = "";
      getGameLevelOptions();
    }
  }

  const handleAddPuzzleButtonClick = () => {
    router.push(`/game-data/puzzel/add?puzzleCategoryId=${puzzleCategoryId}`)
  };


  //on change puzzle data from table
  const handlePuzzleData = (item, type, puzzleId, wordId) => {
    let clonedData = JSON.parse(JSON.stringify(data)); //make a shallow copy


    if (clonedData.length > 0) {
      let element = clonedData.find(obj => obj.puzzle_id == puzzleId);

      if (typeof element !== "undefined") {
        if (type === 1) {
          let wordElem = { word: item, order: wordId }

          if (element.words.some(ele => ele.order === wordId)) {
            let i = element.words.findIndex(ele => ele.order === wordId)
            element.words[i] = wordElem;
          } else {
            element.words.push(wordElem)
          }

          // element.words[wordId - 1]['word'] = item
          // element.words[wordId - 1]['order'] = wordId
        }

        if (type === 2) {
          element.game_level = item.value;
          element.game_level_name = item.label;
        }

        let index = clonedData.findIndex((obj => obj.puzzle_id == puzzleId));
        clonedData[index] = element;

        setData(clonedData)
      }
    }
  }

  const handleSaveButtonClick = async () => {
    //get the updated list
    let newarr = find_difference(puzzleData, data, 'game_level')
    //remove empty string or null|undefined values from word list
    newarr.forEach(puzzle => puzzle.words = puzzle.words.filter(word => Boolean(word.word)));


    //call api to update puzzle data
    try {
      let reqData = {
        puzzle_data: (typeof newarr.length) ? JSON.stringify(newarr) : '',
      }
      let response = await puzzleEdit({ reqData });
      router.back()
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
  }

  const deletePuzzle = (puzzleId, accessor ) => {
    setErrorData({ state: true, message: Constants.deleteAlertMsg.message, alertType:4 }); 
    puzzleID.current = puzzleId;

    
  }

  const handleDelete = async() => {
    setErrorData({ state: false, message: "" })
    try{
      let data = puzzleData.find(item => item.puzzle_id ===  puzzleID.current) 
      await puzzleEdit({ reqData:{puzzle_category_id: puzzleID.current, puzzle_data:JSON.stringify([{...data, status:5}])}});    
      var newPuzzleList = puzzleData.filter(item => item.puzzle_id !==  puzzleID.current)  
      setPuzzleData(newPuzzleList)  
    }
    catch(err){
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }

  }

  const handleAddcategoryButtonClick = () => {
    router.push('/game-data/add')
  }

  let filterList = [
    {
      label: "Level",
      type: "MultiSelectDropDown",
      optionsList: gameLevelOptionList,
      name: "level",
      title: "Search for Level",
      searchText: "Search for Level",
      handleChange: handleChange,
      noOptionText: "No data found",
      handleSearch: handleSearch,
      handleScroll: handleScroll,
      handleToggle: handleGameToggle
    },
  ];

  let bottomButtonList = [
    {
      name: "Save",
      handleButtonClick: handleSaveButtonClick,
    },
    {
      name: "Add Category",
      handleButtonClick: handleAddcategoryButtonClick,
    },
    {
      name: "Add Puzzle",
      handleButtonClick: handleAddPuzzleButtonClick,
    },
  ];

  const handleBackbutton = () => {
    router.back()
  }
  const handlePageClick = (page) => {
    setPageNumber(page.selected + 1);
    getPuzzleData({ gameLevel: !isSelected ? selectedGameLevel : [], page:page.selected + 1 });

  };

  const handleAplyButton = () => {
    if ((selectedGameLevel.length > 0 || isSelected) && isSelected) {
      getPuzzleData({ page: 1, gameLevel: selectedGameLevel });
      setIsSelected(false)
    }
  }

  React.useEffect(() => {
    if(router.query.puzzleCategoryId) getPuzzleData({ gameLevel: !isSelected ? selectedGameLevel : [] });
  }, [router.query])

  React.useEffect(() => {
    getGameLevelOptions();
  }, [])

  return (
    <div className="container">
      <PageControl
        pageHeading={pageHeading}
        filterList={filterList}
        bottomButtonList={bottomButtonList}
        showBottomButtonList={showBottomButtonList}
        handleBackButton={handleBackbutton}
        handleAplyButton={handleAplyButton}
        showBackButton={showBackButton}
      />
      <section className="page-content">
        {loading && <Loading />}
        {!loading && puzzleData.length === 0 && <NoDataFound />}
        {puzzleData.length !== 0 &&
          <Table
            tableData={formatPuzzleData({ data: puzzleData, game_level_list: gameLevelOptionList })}
            handleChangeData={handlePuzzleData}
            tabelHeader={puzzleGameTableHeader}
            pagination={true}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            handleButtonClick={deletePuzzle}
          />
        }
        {errorData.state && (
          <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={errorData.alertType === 4 ? "Alert" : "Error"}
          handleDeleteRecord={handleDelete}
          cancelBtn = {errorData.alertType === 4 && true}
          alertType = {errorData.alertType}
          confirmBtnText ={errorData.alertType === 4 && "Yes"}
        />
        )}
      </section>
    </div>
  );
};

export default React.memo(Puzzle);
