import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Table from "../../../components/table/table";
import PageControl from "../../../components/pageControl/PageControl";
import { editGameSchedule, gameSchPuzzlecategoryList } from "../../../services/gameSchedule";
import { puzzlecategoryList } from "../../../services/gameDataMaintanance";
import { formatPuzzleCategoryData, formatPuzzleCategoryDataForExport } from "../../../helper/tableData";
import { puzzleExportTableHeader, puzzleTableHeader } from "../../../lib/tableHeader";
import ViewPuzzle from "../../../components/popup/ViewPuzzle";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import Loading from "../../../components/text/loading"
import NoDataFound from "../../../components/text/noDataFound";
import { generatePDF } from "../../../helper/reportGenerator";
import FullScreenPopup from "../../../components/popup/FullScreenPopup";
import Constants from "../../../lib/Constants";

const Puzzle = () => {

  const router = useRouter();


  const { gameScheduleId, gameName, date, commName, communityId } = router.query;

  let pageHeading = `${gameName} - ${date} - ${commName}`;
  let showBackButton = true;
  let backBtnPath = "/game-schedules/add-schedule";
  let showbottomButtonList = true;

  const [loading, setLoading] = React.useState(true);
  const [data, setData] = useState([])
  const [puzzleCategory, setPuzzleCategory] = useState([])
  const [category, setCategory] = useState([]);
  const [editData, setEditData] = useState([]);
  const [openPuzzlePopup, setOpenPuzzlePopup] = useState(false)
  const [viewPuzzleData, setViewPuzzleData] = useState({})


  const isDataSaved = useRef(false)

  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });

  const [openPopup, setOpenPopup] = useState<popup>({
    state: false,
    message: '',
    subMessage: ''
  });

  useEffect(() => {
    getGameSchedulePuzzlecategory();
    getPuzzlecategoryData()
  }, [router.query])

  // api call to fetch game schedule puzzle data list
  const getGameSchedulePuzzlecategory = async () => {
    try {
      let reqData: gameSchPuzzleCategoryPayload = {
        game_schedule_id: router.query.gameScheduleId
      };
      const res = await gameSchPuzzlecategoryList({ reqData });
      setPuzzleCategory(res.puzzle_category_list);
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
    setLoading(false);

  };

  // useEffect(() => {
  //   setLoading(false);
  // }, [puzzleCategory])

  // api call to fetch puzzle category list
  const getPuzzlecategoryData = async () => {
    try {
      const res = await puzzlecategoryList({ reqData: {} });
      setCategory(res.puzzle_category_list);
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  const puzzlecategoryOptions = category.map(function (option) {
    return { label: option.category_name, value: option.puzzle_category_id };
  });


  puzzleCategory.map(function (item) {
    return data[item.puzzle_id] = { puzzle_category_id: item.puzzle_category_id, round: item.round }
  });



  const handlePuzzleData = (item, type, id) => {
    // TODO: Change approach here

    // const updatedPuzzle = puzzleCategory.find(({round}) => round === id );
    // const { puzzle_id: puzzleUpdated } = updatedPuzzle
    // const newList = updatedEntry.current.filter(({puzzle_id}) => puzzle_id !== puzzleUpdated);
    // updatedEntry.current = [...newList, {puzzle_id: puzzleUpdated, round: updatedPuzzle.round, puzzle_category_id: item.value  }]

    // if (type === 2) {
    //   // TODO: Not sure if this is needed!!
    //   data[id] = {...data[id], ...{puzzle_category_id : item.value}};
    // }
    let OriginalPuzzleList = puzzleCategory.map(({ round, puzzle_category_id }) => { return { round, puzzle_category_id } });
    let UpdatingPuzzleList = puzzleCategory.map(({ round, puzzle_category_id }) => { return { round, puzzle_category_id } });
    if (UpdatingPuzzleList.length) {
      let updatedPuzzle = UpdatingPuzzleList.find(({ round }) => round === id);
      if (updatedPuzzle) {
        updatedPuzzle.round = id;
        updatedPuzzle.puzzle_category_id = item.value;
        const existingData = OriginalPuzzleList.find(({ round, puzzle_category_id }) => round === id && puzzle_category_id === item.value) //check if updating puzzle exists in original list
        if (existingData) { // avoid setting data from initial onchange while component render and remove the updatedpuzzle while setting back to original value.
          (editData.find(({ round }) => round === id)) ? setEditData([...editData.filter(({ round }) => round !== id)]) : setEditData([...editData])
          isDataSaved.current = false;

        }
        else {
          setEditData([...editData.filter(({ round }) => round !== id), updatedPuzzle]) //copy the updated puzzle and avoid appending puzzle with same round
          isDataSaved.current = true;
        }
      }
    }
  }

  const handleSave = async () => {

    //call api to update puzzle category data
    if (editData.length) {
      try {
        let reqData = {
          game_schedule_id: gameScheduleId,
          community_id: communityId,
          game_level: puzzleCategory[0].game_level,
          round_category: editData.length ? JSON.stringify(editData) : [],
        }
        await editGameSchedule({ reqData });
        setEditData([])
        isDataSaved.current = false;
        router.back()
      } catch (err) {
        console.log(err);
        setErrorData({ state: true, message: err.message });
      }
    }
  };

  const exportAsPdf = async () => {
    const res = await gameSchPuzzlecategoryList({ reqData: { game_schedule_id: router.query.gameScheduleId } });
    generatePDF({
      reportName: pageHeading,
      headers: puzzleExportTableHeader,
      data: formatPuzzleCategoryDataForExport({ data: res.puzzle_category_list })
    });
  }


  let bottomButtonList = [
    {
      name: "Save",
      handleButtonClick: handleSave,
    },
    {
      name: "Export to PDF",
      handleButtonClick: exportAsPdf,
    },
  ];



  const handleBackbutton = () => {
    const { SaveFormAlertMsgData: { message, subMessage } } = Constants;
    isDataSaved.current ? setOpenPopup({
      state: true,
      message,
      subMessage,
    }) : router.push(backBtnPath)

  }

  const handlePopupConfirm = () => {
    router.back();
  }

  const handlePuzzleButtonClick = (id) => {
    let data = puzzleCategory.find(({ round }) => round === id)
    setViewPuzzleData(data)
    setOpenPuzzlePopup(true)
  }

  return (
    <div className={`container`}>
      <PageControl
        pageHeading={pageHeading}
        bottomButtonList={bottomButtonList}
        showBottomButtonList={showbottomButtonList}
        showBackButton={showBackButton}
        handleBackButton={handleBackbutton}
      />
      <section className="page-content">
        {loading && <Loading />}
        {!loading && puzzleCategory.length === 0 && <NoDataFound />}
        {puzzleCategory.length !== 0 &&
          <Table
            tableData={formatPuzzleCategoryData({ data: puzzleCategory, puzzle_category_list: puzzlecategoryOptions })}
            tabelHeader={puzzleTableHeader}
            handleChangeData={handlePuzzleData}
            handleButtonClick={handlePuzzleButtonClick}
          />}
        {errorData.state && (
          <ErrorPopup
            toggle={() => setErrorData({ state: false, message: "" })}
            bodyText={errorData.message}
            headerText={"Error"}
          />
        )}
      </section>
      {openPuzzlePopup &&
        <ViewPuzzle
          toggle={() => setOpenPuzzlePopup(false)}
          data={viewPuzzleData}
        />
      }
      {openPopup.state &&
        <FullScreenPopup
          bodyText={openPopup.message}
          subText={openPopup.subMessage}
          onCancel={() => setOpenPopup({ ...openPopup, state: false })}
          onConfirm={() => handlePopupConfirm()}
          cancelBtnText={typeof openPopup.message === 'string' ? 'No' : 'Okay'}
          confirmBtn={typeof openPopup.message === 'string' ? true : false}
        />
      }
    </div>
  );
};

export default Puzzle;
