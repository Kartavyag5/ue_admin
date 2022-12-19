import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FormControl from "../../../../components/form-control/FormControl";
import FormController from "../../../../components/form/FormController";
import ErrorPopup from "../../../../components/popup/ErrorPopup";
import { formatDate, formatTime } from "../../../../helper/formatDate";
import Constants from "../../../../lib/Constants";
import { getGameSchedules } from "../../../../services/gameSchedule";

const Index = () => {

  const router = useRouter();

  const { scheduleId } = router.query;
  let heading = "Game Scheduling Report";
  const [gameScheduleData, setGameScheduleData] = useState<any>();

  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });

  
  useEffect(() => {
    getScheduleDetailForId()
  }, [])

  const handleCancel = () => {
    router.back();
  };

  const field_set_1 = [
    {
      label: "Community",
      column: [
        {
          name: "community",
          inputType: "Text",
          readOnly: true,
          defaultValue:
            typeof gameScheduleData !== "undefined"
              ? gameScheduleData.community_name
              : "",
        },
      ],
    },
    {
      label: "Difficulty",
      column: [
        {
          name: "game_level",
          inputType: "Text",
          readOnly: true,
          defaultValue:
            typeof gameScheduleData !== "undefined"
              ? gameScheduleData.game_level_name
              : "",
        },
      ],
    },
    {
      label: "Game Name",
      column: [
        {
          name: "game_id",
          inputType: "Text",
          readOnly: true,
          defaultValue:
            typeof gameScheduleData !== "undefined"
              ? gameScheduleData.game_name
              : "",
        },
      ],
    },
    {
      label: "Date of Game",
      column: [
        {
          name: "schedule_start_at",
          inputType: "Text",
          readOnly: true,
          defaultValue:
            typeof gameScheduleData !== "undefined"
              ? `${formatDate(gameScheduleData.schedule_start_at)}   ${formatTime(new Date(`${gameScheduleData.schedule_start_at}.000Z`))}`
              : "",
        },
      ],
    },
    {
      label: "Host Email",
      column: [
        {
          name: "host_email_id",
          inputType: "Text",
          readOnly: true,
          defaultValue:
            typeof gameScheduleData !== "undefined"
              ? gameScheduleData.host_email_id
              : "",
        },
      ],
    },
    {
      label: "Host ID",
      column: [
        {
          name: "host_id",
          inputType: "Text",
          readOnly: true,
          defaultValue:
            typeof gameScheduleData !== "undefined"
              ? gameScheduleData.host_id
              : "",
        },
      ],
    },
    {
      label: "Meeting ID",
      column: [
        {
          name: "meeting_id",
          inputType: "Text",
          readOnly: true,
          defaultValue:
            typeof gameScheduleData !== "undefined"
              ? gameScheduleData.meeting_id
              : "",
        },
      ],
    },
    {
      label: "Zoom Link",
      column: [
        {
          name: "zoom_link",
          inputType: "Text",
          readOnly: true,
          defaultValue:
            typeof gameScheduleData !== "undefined"
              ? gameScheduleData.zoom_link
              : "",
        },
      ],
    },
    {
      label: "Join Link",
      column: [
        {
          name: "join_link",
          inputType: "Text",
          readOnly: true,
          defaultValue:
            typeof gameScheduleData !== "undefined"
              ? gameScheduleData.join_link
              : "",
        },
      ],
    },
    {
      label: "Custom Spinner Space",
      column: [
        {
          name: "custom_spinner_space",
          inputType: "Text",
          readOnly: true,
          defaultValue:
            typeof gameScheduleData !== "undefined"
              ? gameScheduleData.custom_spinner_space
              : "",
        },
      ],
    },
  ];

  const field_set_2 = [
    {
      label: "Player 1",
      column: [
        {
          name: "player_1",
          inputType: "Text",
          readOnly: true,
          defaultValue:
          (typeof gameScheduleData !== "undefined" && gameScheduleData.players?.length > 0 && typeof gameScheduleData.players[0] !== "undefined")
              ? `${gameScheduleData.players[0].first_name} ${gameScheduleData.players[0].last_name}` : ""
        },
      ],
    },
    {
      label: "Display",
      column: [
        {
          name: "playerName1",
          inputType: "Text",
          readOnly: true,
          defaultValue:
          (typeof gameScheduleData !== "undefined" && gameScheduleData.players?.length > 0 && typeof gameScheduleData.players[0] !== "undefined")
              ? gameScheduleData.players[0].player_display_name
              : "",
        },
      ],
    },
    {
      label: "Player 2",
      column: [
        {
          name: "player_2",
          inputType: "Text",
          readOnly: true,
          defaultValue:
          (typeof gameScheduleData !== "undefined" && gameScheduleData.players?.length > 0 && typeof gameScheduleData.players[1] !== "undefined")
              ? `${gameScheduleData.players[1].first_name} ${gameScheduleData.players[1].last_name}`
              : "",
        },
      ],
    },
    {
      label: "Display",
      column: [
        {
          name: "playerName2",
          inputType: "Text",
          readOnly: true,
          defaultValue:
          (typeof gameScheduleData !== "undefined" && gameScheduleData.players?.length > 0 && typeof gameScheduleData.players[1] !== "undefined")
              ? gameScheduleData.players[1].player_display_name
              : "",
        },
      ],
    },
    {
      label: "Player 3",
      column: [
        {
          name: "player_3",
          inputType: "Text",
          readOnly: true,
          defaultValue:
          (typeof gameScheduleData !== "undefined" && gameScheduleData.players?.length > 0 && typeof gameScheduleData.players[2] !== "undefined")
              ? `${gameScheduleData.players[2].first_name} ${gameScheduleData.players[2].last_name}`
              : "",
        },
      ],
    },
    {
      label: "Display",
      column: [
        {
          name: "playerName3",
          inputType: "Text",
          readOnly: true,
          defaultValue:
          (typeof gameScheduleData !== "undefined" && gameScheduleData.players?.length > 0 && typeof gameScheduleData.players[2] !== "undefined")
              ? gameScheduleData.players[2].player_display_name
              : "",
        },
      ],
    },
    {
      label: "Player 4",
      column: [
        {
          name: "player_4",
          inputType: "Text",
          readOnly: true,
          defaultValue:
          (typeof gameScheduleData !== "undefined" && gameScheduleData.players?.length > 0 && typeof gameScheduleData.players[3] !== "undefined")
              ? `${gameScheduleData.players[3].first_name} ${gameScheduleData.players[3].last_name}`
              : "",
        },
      ],
    },
    {
      label: "Display",
      column: [
        {
          name: "playerName4",
          inputType: "text",
          readOnly: true,
          defaultValue:
          (typeof gameScheduleData !== "undefined" && gameScheduleData.players?.length > 0 && typeof gameScheduleData.players[3] !== "undefined")
              ? gameScheduleData.players[3].player_display_name
              : "",
        },
      ],
    },
  ];

  //api call to get schedule list to fetch default data
  const getScheduleDetailForId = async () => {
    try {
      let reqData: gameSchedulePayload = {
        game_schedule_id: scheduleId,
        limit: 1,
        query_type: Constants.queryType.detailView
      };
      const res = await getGameSchedules({ reqData });
      setGameScheduleData(res.game_schedule_list[0]);
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  return (
    <div className={`container`}>
      <FormControl
        heading={heading}
        showBackButton={true}
        handleBackButton={handleCancel}
      />

      <div className={`row`}>
        <FormController
          layout={2}
          column1={field_set_1}
          column2={field_set_2}
        />
      </div>
      {errorData.state && (
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={"Error"}
        />
      )}
    </div>
  );
};

export default React.memo(Index);
