import router from "next/router";
import PageControl from "../../components/pageControl/PageControl";
import Constants from "../../lib/Constants";
import ScheduleView from "../../components/scheduler";
import { getGameSchedules } from "../../services/gameSchedule";
import React, { useContext, useEffect, useState } from "react";
import { formatGameScheduleData } from "../../helper/scheduleData";
import Loading from "../../components/text/loading";
import { RoleContext } from "../../context/roleContext";
import { getTopUserRole } from "../../helper/roles";
import { formatDate } from "../../helper/dateTime";

export default function GameSchedule() {

  const roleDetails = useContext(RoleContext);
  const { rolePermissions : { rolesNotAllowedToAddNewSchedules }} = Constants;


  let pageHeading = "Game Scheduling";
  let showTopButtonList = true;
  const [gameSchedules, setGameSchedules] = useState([]);
  const [isLoading, setLoadingStatus]  = useState(true);

  useEffect(() => {
    fetchGameSchedules();
  }, []);

  const fetchGameSchedules = async () => {
    try {
      setLoadingStatus(true);
      const reqData = {query_type: Constants.queryType.tableView};
      const gameList = await getGameSchedules({ reqData });
      setGameSchedules(
        formatGameScheduleData({ scheduleList: gameList.game_schedule_list })
      );
      setLoadingStatus(false);
    } catch (err) {}
  };

  const handleDateClick = () => {
    router.push("/game-schedules/add-schedule/add?from=calendar");
  };

  const handleScheduleClick = (scheduleData) => {    
    router.push(`/game-schedules/add-schedule/add?gameScheduleId=${scheduleData.scheduleId}&gameName=${scheduleData.gameName}&commName=${scheduleData.communityName}&date=${formatDate(scheduleData.startDate)}&allowToEdit=${scheduleData.allowToEdit}&from=calendar&community_id=${scheduleData.community_id}&is_zoom_game=${scheduleData.is_zoom_game}`);
  };

  const  handleViewScheduleClick = () => {
    router.push("/game-schedules/add-schedule");
  };

  let topButtonList = [
    {
      name:"View Scheduled Games",
      handleButtonClick: handleViewScheduleClick,
    },
    {
      name: "Add Game",
      isDisabled: rolesNotAllowedToAddNewSchedules.includes(getTopUserRole(roleDetails)),
      handleButtonClick: handleDateClick,
    },
  ];

  return (
    <div className="container">
      <PageControl
        pageHeading={pageHeading}
        showTopButtonList={showTopButtonList}
        topButtonList={topButtonList}
      />
      {!isLoading && (
        <ScheduleView
          scheduleClickFunction={handleScheduleClick}
          gameSchedules={gameSchedules}
        ></ScheduleView>
      )}
      {isLoading && <Loading />}
    </div>
  );
}
