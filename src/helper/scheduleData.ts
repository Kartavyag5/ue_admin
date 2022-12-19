export const formatGameScheduleData = ({ scheduleList }) => {
  const formatedData = scheduleList.map((schedule) => {    
    const { game_schedule_id,game_name, community_name, host_name, schedule_start_at, game_id, allow_to_edit, community_id, is_zoom_game } =
      schedule;
    let endDate = new Date(`${schedule_start_at.replace(/ /g, "T")}.000+00:00`);
    ;
    return {
      gameName: game_name,
      communityName: community_name,
      hostName: host_name,
      allowToEdit : !allow_to_edit,
      scheduleId: game_schedule_id,
      startDate:new Date(`${schedule_start_at.replace(/ /g, "T")}.000+00:00`),
      endDate:  new Date(endDate.setHours(endDate.getHours()+ 1)),
      id: game_id,
      community_id: community_id,
      is_zoom_game: is_zoom_game
    };
  });
  return formatedData;
};
