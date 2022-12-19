import React from "react";
import { getCommunityTimeZone } from "../../helper/dateTime";
import FormController from "../form/FormController";

export default function AddSchedule({ ...props }) {

  let data = props.defaultData;  
  
    const field_set_1 = [
    {
      label: "Community*",
      column: [
        {
          name: "community",
          title: "Select Community",
          inputType: "select",
          options: props.formattedCommunityOptionList,
          handleScroll: props.handleCommunityScroll,
          searchable: ["Select community"],
          setSearchText: props.handleCommunitySearch,
          handleChange:props.handleCommunityChange,
          defaultValue: typeof data !== "undefined" ? data.community_id : "",
          handleToggle:props.handleCommunityToggle
        },
      ],
    },
    {
      label: "Game Name*",
      column: [
        {
          name: "game",
          title: "Select Game",
          inputType: "select",
          options: props.optionsForGame,
          handleScroll: props.handleGameScroll,
          searchable: ["Select Game"],
          setSearchText: props.handleGameSearch,
          defaultValue: typeof data !== "undefined" ? data.game_id : "",
          handleToggle:props.handleGameToggle,
          resetSelection : props.resetGameSelection,
          changeResetflag : props.changeGameResetflag,
        },
      ],
    },
    {
      label: "Difficulty*",
      column: [
        {
          name: "game_level",
          title: "Select Difficulty",
          inputType: "select",
          searchable: ["Select Difficulty"],
          options: props.optionsForGameLevel,
          defaultValue: typeof data !== "undefined" ? data.game_level : "",
          setSearchText:props.handleLevelSearch,
          handleToggle:props.handleLevelToggle
        },
      ],
    },
    {
      label: "Date of Game*",
      column: [
        {
          name: "schedule_start_at",
          inputType: "date",
          handleChange: (val) => {},
          defaultValue:( data && props.timezoneData) ? getCommunityTimeZone({date:data.schedule_start_at, offset: props.timezoneData.timezone_offset}): '',
          showTime:true
        },
      ],
    },
    {
      label: "Time Zone",
      column: [
        {
          name: "timezone",
          inputType: "text",
          handleChange: (val) => {},
          defaultValue: typeof  props.timezoneData !== 'undefined' ? props.timezoneData.timezone_value : '',
          readOnly:true        
        },
      ],
    },
    
    {
      label: "Host Email*",
      column: [
        {
          name: "host_id",
          title: "Select Host ",
          inputType: "select",
          options: props.hostIdOptionList,
          handleScroll: props.handleHostIdScroll,
          handleChange:props.handleHostChange,
          searchable: ["Select Host "],
          setSearchText: props.handleHostIdSearch,
          defaultValue: typeof data !== "undefined" ? data.host_id : "",
          handleToggle:props.handleHostIdToggle,
          resetSelection : props.resetHostSelection,
          changeResetflag : props.changeHostResetflag,
        },
      ],
    },
    {
      label: "Host ID",
      column: [
        {
          name: "host",
          inputType: "text",
          readOnly:true,
          defaultValue: props.hostId
        },
      ],
    },
    {
      label: "Meeting ID",
      isGrayOut : data ? data.is_zoom_game === 1 ? false : true : false,

      column: [
        {
          name: "meeting_id",
          inputType: "text",
          defaultValue: typeof data !== "undefined" ? data.meeting_id : "",
          readOnly:true,

           

        },
      ],
    },
    {
      label: "Zoom Link",
      isGrayOut : data ? data.is_zoom_game === 1 ? false : true : false,

      column: [
        {
          name: "zoom_link",
          inputType: "text",
          defaultValue: typeof data !== "undefined" ? data.zoom_link : "",
          readOnly:true,

        },
      ],
    },
    {
      label: "Join Link",
      isGrayOut : data ? data.is_zoom_game === 1 ? false : true : false,

      column: [
        {
          name: "join_link",
          inputType: "link",
          defaultValue: typeof data !== "undefined" ? data.join_link : "",
          readOnly:true,

        },
      ],
    },
    {
      label: "Custom Spinner Space*",
      column: [
        {
          name: "custom_spinner_space",
          inputType: "select",
          title: "Select Custom Spinner Space",
          options: props.optionsForCustomList,
          defaultValue: typeof data  !== "undefined" ? data.custom_spinner_space : ""
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
          title: "Select Player 1",
          inputType: props.allowToEdit ?  "text" : "select",
          options: props.optionsForPersonList,
          handleChange: props.onSelectPlayer1,
          handleScroll: props.handlePlayerScroll,
          searchable: ["Select Player 1"],
          setSearchText: props.handlePlayerSearch,
          defaultValue:data?.players?.find((el=>el.player_order==1))?.[props.allowToEdit?"player_name":"player_id"]||"",
          resetSelection : props.resetPlayerSelection,
          changeResetflag : props.changePlayerResetflag,
          handleToggle:props.handlePlayerToggle
        },
      ],
    },
    {
      label: "Display",
      column: [
        {
          name: "custom_player_name_1",
          inputType: "text",
          defaultValue:  data?.players?.find((el=>el.player_order==1))?.["player_display_name"]||""
        },
      ],
    },
    {
      label: "Player 2",
      column: [
        {
          name: "player_2",
          title: "Select Player 2",
          inputType: props.allowToEdit ?  "text" : "select",
          options: props.optionsForPersonList,
          handleScroll: props.handlePlayerScroll,
          handleChange: props.onSelectPlayer2,
          searchable: ["Select Player 2"],
          setSearchText: props.handlePlayerSearch,
          defaultValue:  data?.players?.find((el=>el.player_order==2))?.[props.allowToEdit?"player_name":"player_id"]||"",
          resetSelection : props.resetPlayerSelection,
          changeResetflag : props.changePlayerResetflag,
          handleToggle:props.handlePlayerToggle
        },
      ],
    },
    {
      label: "Display",
      column: [
        {
          name: "custom_player_name_2",
          inputType: "text",
          defaultValue: data?.players?.find((el=>el.player_order==2))?.["player_display_name"]||""
        },
      ],
    },
    {
      label: "Player 3",
      column: [
        {
          name: "player_3",
          title: "Select Player 3",
          inputType: props.allowToEdit ?  "text" : "select",
          options: props.optionsForPersonList,
          handleChange: props.onSelectPlayer3,
          handleScroll: props.handlePlayerScroll,
          searchable: ["Select Player 3"],
          setSearchText: props.handlePlayerSearch,
          defaultValue:  data?.players?.find((el=>el.player_order==3))?.[props.allowToEdit?"player_name":"player_id"]||"",
          resetSelection : props.resetPlayerSelection,
          changeResetflag : props.changePlayerResetflag,
          handleToggle:props.handlePlayerToggle
        },
      ],
    },
    {
      label: "Display",
      column: [
        {
          name: "custom_player_name_3",
          inputType: "text",
          defaultValue: data?.players?.find((el=>el.player_order==3))?.["player_display_name"]||""
        },
      ],
    },
    {
      label: "Player 4",
      column: [
        {
          name: "player_4",
          title: "Select Player 4",
          inputType: props.allowToEdit ?  "text" : "select",
          options: props.optionsForPersonList,
          handleChange: props.onSelectPlayer4,
          handleScroll: props.handlePlayerScroll,
          searchable: ["Select Player 4"],
          setSearchText: props.handlePlayerSearch,
          defaultValue:  data?.players?.find((el=>el.player_order==4))?.[props.allowToEdit?"player_name":"player_id"]||"",
          resetSelection : props.resetPlayerSelection,
          changeResetflag : props.changePlayerResetflag,
          handleToggle:props.handlePlayerToggle
        },
      ],
    },
    {
      label: "Display",
      column: [
        {
          name: "custom_player_name_4",
          inputType: "text",
          defaultValue: data?.players?.find((el=>el.player_order==4))?.["player_display_name"]||""
        },
      ],
    },
    {
      label: "",
      column: [
        {
          name: "Show Player Details",
          inputType: "button",
          handleButtonClick: props.handleButtonClick,
          isDisabled:props.allowToView        },
      ],
    },
  ];



  const buttonProps = [
    {
      type: "submit",
      value: "Save and Exit",
      handleButtonClick: props.handleSaveAndExit,
      isDisabled:props.allowToEdit,
      isJoiningWords: true
    },
    {
      type: "submit",
      value: "Save",
      handleButtonClick: props.handleSave,
      isDisabled:props.allowToEdit
    },
    {
      type: "button",
      value: "Cancel",
      handleButtonClick: props.handleCancel,
    },
  ];

  return (
    <FormController
      layout={2}
      column1={field_set_1}
      column2={field_set_2}
      buttonProps={buttonProps}
      isFormDirty={props.isFormDirty}
    />
  );
}
