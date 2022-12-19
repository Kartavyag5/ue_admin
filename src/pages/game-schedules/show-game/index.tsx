import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import PageControl from "../../../components/pageControl/PageControl";
import Table from "../../../components/table/table";
import { formatgamesPlayedData } from "../../../helper/tableData";
import { getGameList } from "../../../services/adminDataMaintenance";
import { gamesPlayedList } from "../../../services/gameSchedule";
import getTableRow from "../../../services/tableRow";
import Loading from "../../../components/text/loading"
import NoDataFound from "../../../components/text/noDataFound";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import Constants from "../../../lib/Constants";
import { showPlayerTableHeader } from "../../../lib/tableHeader";
import { exportDataToSupportCSVFormat, generatePDF } from "../../../helper/reportGenerator";
import { CSVLink } from "react-csv";

export default function Games() {

  const router = useRouter();
  const {playerName, playerId, scheduleId, from} = router.query;

  let pageHeading="Puzzle Detail"

  let pageType = "other";
  let showBackButton = true;
  let showTopButtonList = true;
  let showbottomButtonList = true;

  const [loading, setLoading] = useState(true); 
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [gameforFilter, setGameforFilter] = useState([]);
  const [formatedTableData, setFormatedTableData] = useState([])
  const [selectedGame, setSelectedGame] = useState([])
  const [isSelected, setIsSelected] = useState(false)
  const [csvExportData, setCsvExportData] = useState([])

  let csvLink: any = useRef();

  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });

  let totalGame = useRef(0);
  let dropDownPage = useRef(1)
  let searchText = useRef("")


  useEffect(() => {
    getGameFilterList(); 
  }, []);

  useEffect(() => {
    getPuzzleList({ gameIds: !isSelected ? selectedGame : []})
  }, [pageNumber]);


//  // apli call to get game played list
//   const getGamePlayedList = async ({gameIds = [], page= pageNumber}) => {
//     try {
//       const reqData : gamePlayedPayload = {
//         player_id: playerId.toString(),
//         page_number: page, // Initially load page 1
//         limit: getTableRow(pageType),
//       };
      
//       if (gameIds.length > 0) reqData.game_ids = gameIds;

//       const res = await gamesPlayedList({ reqData });

//       const formatedTableData = formatgamesPlayedData({data: res.game_list});
//       setFormatedTableData(formatedTableData); 

//       if(page === 1) {
//           res.total_count && setPageCount(res.total_count / getTableRow(pageType));
//         }
//     } catch (err) {
//       console.error(err);
//       setErrorData({ state: true, message: err.message });        }

//     setLoading(false);
//   };

// apli call to get Puzzle list
const getPuzzleList = async ({gameIds = [], page= pageNumber}) => {
  try {    
    const reqData : gamePlayedPayload = {
      player_id: playerId.toString(),
      page_number: page, // Initially load page 1
      limit: getTableRow(pageType),
    };
    
    if (gameIds.length > 0) reqData.game_ids = gameIds;

    const res = await gamesPlayedList({ reqData });
    const formatedTableData = formatgamesPlayedData({data: res.puzzle_list});
    setFormatedTableData(formatedTableData); 

    if(page === 1) {
        res.total_count && setPageCount(res.total_count / getTableRow(pageType));
      }
  } catch (err) {
    setErrorData({ state: true, message: err.message });        }

  setLoading(false);
};

  //api call to get game filter list
  const getGameFilterList = async () => {
    try {
      let reqData: gameListPayload  = {
        limit:Constants.filterDropDownLimit,
        page_number: dropDownPage.current,
      };
      
      if (searchText.current !== "") { reqData.game_name = searchText.current;}

      const res = await getGameList({ reqData });
      setGameforFilter(dropDownPage.current !== 1 ? [...gameforFilter, ...res.game_list] : [...res.game_list]);
      if (res.total_count) totalGame.current = res.total_count;
      
    } 
    catch (err) {
      setErrorData({ state: true, message: err.message });
    }
  };






  //TODO Removed filterlist as per new client feedback

  
  // const FormattedGameList = gameforFilter.map(({ game_id, game_name }) => {
  //   return { label: game_name, value: game_id };
  // });

  // const handleDropDownPageIncreament = () => {
  //   dropDownPage.current = dropDownPage.current+1
  //   getGameFilterList();
  // }


  // const handleSearch = (game) => {
  //   searchText.current = game;
  //   dropDownPage.current = 1;
  //   getGameFilterList();
  // };
  // const handleScroll = () => {    
  //   if(totalGame.current > gameforFilter.length)
  //      handleDropDownPageIncreament()
  //   };
  // const handleChange = (value) => {
  //   setSelectedGame(value);
  //   setIsSelected(true)

  // };

  const printPageAction = () => {
    window.print();
  };

  const exportAsPDF = async() => {
    const reqData : gamePlayedPayload = {
      player_id: playerId.toString()
    }
    const res = await gamesPlayedList({ reqData});
    generatePDF({
      reportName: playerName, 
      headers: showPlayerTableHeader, 
      data: formatgamesPlayedData({data: res.puzzle_list})
    });
  };

  const exportAsCSV = async () => {
    const reqData : gamePlayedPayload = {
      player_id: playerId.toString()
    }
    const res = await gamesPlayedList({ reqData});
    const csvFileData = exportDataToSupportCSVFormat({ 
      tableHeader:showPlayerTableHeader, 
      formatedTablData: formatgamesPlayedData({data: res.puzzle_list})
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

  const handlePageClick = (page) => {    
    setPageNumber(page.selected+1);
  };

  const handleAplyButton = () => {
    if((selectedGame.length > 0 || isSelected) && isSelected) {
      getPuzzleList({ page: 1, gameIds: selectedGame});
      setIsSelected(false)
    }
  }

  // let filterList = [//TODO Removed filterlist as per  client feedback
  //   {
  //     label: "Game",
  //     type: "MultiSelectDropDown",
  //     optionsList: FormattedGameList,
  //     name: "game",
  //     title: "Search for game",
  //     searchText: ["Search for game"],
  //     handleChange: handleChange,
  //     noOptionText: "No data found",
  //     handleSearch: handleSearch,
  //     handleScroll: handleScroll,
  //   },
  // ];

  let topButtonList = [
    {
      name: "Export to Csv",
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
      handleButtonClick: exportAsPDF ,
    },
  ];

 

  const handleBackButton = () => {
    scheduleId ? router.push(`/game-schedules/add-schedule/add?gameScheduleId=${scheduleId}&isAdd=${true}&from=${from}`) : router.back()
  }

  return (
    <div className="container">
      <PageControl
        pageHeading={playerName && playerName.toString()}
        // filterList={filterList}//TODO Removed filterlist as per new client feedback
        topButtonList={topButtonList}
        bottomButtonList={bottomButtonList}
        showBottomButtonList={showbottomButtonList}
        showBackButton={showBackButton}
        showTopButtonList={showTopButtonList}
        handleBackButton={handleBackButton}
        handleAplyButton={handleAplyButton}
      />
      <section className="page-content">
      {loading && <Loading/>}
        {!loading  && formatedTableData.length === 0 &&  <NoDataFound />}
        {formatedTableData.length !== 0 &&
        <Table
          tableData={formatedTableData}
          tabelHeader={showPlayerTableHeader}
          pagination={true}
          pageCount={pageCount}
          onPageChange={handlePageClick}
        />}
         {errorData.state && (
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={"Error"}
        />
      )}
      </section>
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
