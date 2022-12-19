import PageControl from "../../../components/pageControl/PageControl";
import Table from "../../../components/table/table";
import React, { useEffect, useRef, useState } from "react";
import { data } from "autoprefixer";
import router from "next/router";
import getTableRow from "../../../services/tableRow";
import { getGameList } from "../../../services/adminDataMaintenance";
import { formatGamesListData } from "../../../helper/tableData";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import Loading from "../../../components/text/loading"
import NoDataFound from "../../../components/text/noDataFound";
import Constants from "../../../lib/Constants";
import { gameTableHeader } from "../../../lib/tableHeader";

interface gamesListReqBody {
  page_number?: number;
  limit?: number;
  last_id?: number;
  name?: string;
  game_name?: string;
  game_ids?: Array<number>;
}

export default function Games() {

  const [loading, setLoading] = React.useState(true); 

  const [pageCount, setPageCount] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);
  const [formatedTableData, setFormatedTableData] = useState([]);

  const [gamesListFilterData, setGamesListFilterData] = useState([]);

  const [isSelected, setIsSelected] = useState(false)


  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });

  let totalEntries = useRef(0);
  let filterGameIds = useRef([]);

  let pageType = "adminstrative";
  let showBottomButtonList = true;

  let gameDropDownPage = useRef(1);
  let gameSearchText =  useRef("");

  useEffect(() => {
    (async () => {
      const gamesListRes = await getGamesData({
        page_number: pageNumber,
        limit: getTableRow(pageType),
        game_ids: !isSelected ? filterGameIds.current : []
      });
      if (pageNumber === 1) {
        // Total count is sent only if page number is 1
        totalEntries.current = gamesListRes.total_count;
        gamesListRes.total_count &&
        setPageCount(Math.ceil(gamesListRes.total_count / getTableRow(pageType)));
      }
      setFormatedTableData(
        formatGamesListData({ data: gamesListRes.game_list })
      );
      if(gamesListFilterData.length === 0)
      {setGamesListFilterData(gamesListRes.game_list); // TODO: Trigger on dropdown click
      }
      setLoading(false)
    })();
  }, [pageNumber]);


  React.useEffect(() => {
    // shallow page load to push tab_id to url
    router.push({
        pathname: '/administrative-data',
        query: { tab_id: '1' }
      }, undefined, { shallow: true }
    )
  }, [])

  const getGamesData = async (reqData: gamesListReqBody) => {
    try {
      if(reqData.game_name === "") delete reqData.game_name;
      const gamesListRes = await getGameList({ reqData });
      gamesListRes.total_count &&
      setPageCount(Math.ceil(gamesListRes.total_count / getTableRow(pageType)));
      return gamesListRes;
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  const FormattedOptionList = gamesListFilterData.map(
    ({ game_id, game_name }) => {
      return { label: game_name, value: game_id };
    }
  );

  const handleSearch = async (searchString) => {
    try {
      gameSearchText.current = searchString;
      gameDropDownPage.current = 1;
      const gamesListRes = await getGamesData({
        game_name: gameSearchText.current, 
        page_number:gameDropDownPage.current, 
        limit:Constants.filterDropDownLimit
      });
      setGamesListFilterData([...gamesListRes.game_list]);
      if(gamesListRes.total_count) totalEntries.current = gamesListRes.total_count;
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
  };

  const handleScroll = async () => {
    try {
      if (totalEntries.current > gamesListFilterData.length) {
        // const lastGameData =
        //   gamesListFilterData[gamesListFilterData.length - 1];
        gameDropDownPage.current += 1;
        const gamesListRes = await getGamesData({
          // last_id: lastGameData.game_id,
          limit: Constants.filterDropDownLimit,
          page_number:gameDropDownPage.current
        });
        setGamesListFilterData([
          ...gamesListFilterData,
          ...gamesListRes.game_list,
        ]);
      }
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
  };

  const handleChange = (gameIds) => {
    filterGameIds.current = gameIds;
    setIsSelected(true)
  };

  const handleGameDropDownToggle = async (isOpen) => {
    const isOpening = !isOpen;
     if(isOpening &&  gameSearchText.current.length) {
      gameSearchText.current = "";
      gameDropDownPage.current = 1;
      const gamesListRes = await getGamesData({
        game_name:gameSearchText.current,
        page_number:gameDropDownPage.current, 
        limit:Constants.filterDropDownLimit
      });
      setGamesListFilterData([...gamesListRes.game_list]);
      if(gamesListRes.total_count) totalEntries.current = gamesListRes.total_count;
    }
  }

  const handleButtonClick = () => {
    router.push("/administrative-data/games/add");
  };

  let filterList = [
    {
      label: "Game",
      type: "MultiSelectDropDown",
      optionsList: FormattedOptionList,
      name: "game",
      title: "Search for Game",
      searchText: "Search for Game",
      handleChange: handleChange,
      noOptionText: "No data found",
      handleSearch: handleSearch,
      handleScroll: handleScroll,
      handleToggle:handleGameDropDownToggle
    },
  ];

  let bottomButtonList = [
    {
      name: "Add Game",
      handleButtonClick: handleButtonClick,
    },
  ];

  const handlePageClick = (page) => {
    setPageNumber(page.selected + 1);
  };

  const handleAplyButton = async () => {
    
    try {
      if((filterGameIds.current.length > 0 || isSelected) && isSelected)
      {
          const gamesListRes = await getGamesData({
          game_ids: filterGameIds.current,
          page_number: 1,
          limit: getTableRow(pageType),
        });
        setFormatedTableData(
          formatGamesListData({ data: gamesListRes.game_list })
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
            tabelHeader={gameTableHeader}
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
