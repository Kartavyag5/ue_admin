import router from "next/router";
import { formatDate, formatTime } from "./dateTime";
import { getOrgCommRoleData } from "./getOrgCommRoleData";

const formatOrganizationData = ({ data }) => {
  const formatedTableData = data.map((organization) => {
    const { organization_name, organization_id, parent_organization_id } =
      organization;
    return [
      {
        accessor: "Organization Name",
        data: organization_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Edit",
        data: "Edit",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/organization/add?organizationId=${organization_id}&organizationName=${organization_name}&parentOrganizationId=${parent_organization_id}`,
          isExternalLink: false,
        },
      },
      {
        accessor: "Communities",
        data: "Communities",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/organization/communities?organizationId=${organization_id}&organizationName=${organization_name}`,
          isExternalLink: false,
        },
      },
    ];
  });
  return formatedTableData;
};

const formatCommunityData = ({ data }) => {
  let organizationId = router.query.organizationId;

  const formatedTableData = data.map((community) => {
    const {
      community_name,
      community_id,
      address_id,
      sales_force_id,
      street_address,
      city,
      zip_postal,
      time_zone,
      state,
      country,
    } = community;

    return [
      {
        accessor: "Community Name",
        data: community_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Edit",
        data: "Edit/View",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/organization/communities/add?communityId=${community_id}&organizationId=${organizationId}&organizationName=${router.query.organizationName}`,
          isExternalLink: false,
        },
      },
      {
        accessor: "License",
        data: "License",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/organization/license?communityId=${community_id}&communityName=${community_name}&organizationId=${organizationId}`,
          isExternalLink: false,
        },
      },
    ];
  });
  return formatedTableData;
};

const formatLicenseData = ({ data }) => {
  let organizationId = router.query.organizationId;

  const formatedTableData = data.map((license) => {
    const {
      license_id,
      license_number,
      game_id,
      game_name,
      pricing_plan_id,
      plan_name,
      community_id,
      community_name,
      effective_date,
      expire_date,
      renewal_as_of_date,
      org_community_pay,
    } = license;

    return [
      {
        accessor: "License",
        data: license_number,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "GameLicensed",
        data: game_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "PlanName",
        data: plan_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "EffectiveDate",
        data: formatDate(effective_date),
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "EditOrView",
        data: "Edit/View",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/organization/license/add?communityId=${community_id}&communityName=${community_name}&licenseId=${license_id}`,
          isExternalLink: false,
        },
      },
    ];
  });
  return formatedTableData;
};

const formatPersonsData = ({ data }) => {
  let organizationId = router.query.organizationId;

  const formatedTableData = data.map((user) => {
    const {
      user_id,
      first_name,
      last_name,    
      agreement,
      user_comm_role = { community_name: "" , role_name: ""}, 
    } = user;

    let orgCommRoleData = getOrgCommRoleData(user_comm_role)

    return [
      {
        accessor: "Community",
        data: orgCommRoleData.comm_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "First Name",
        data: first_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Last Name",
        data: last_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Role",
        data: orgCommRoleData.role,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Agreement",
        data: agreement === 1 ? "Yes" : "No",
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Edit",
        data: "Edit",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/persons-data/add?userId=${user_id}`,
          isExternalLink: false,
        },
      },
    ];
  });
  return formatedTableData;
};

export {
  formatOrganizationData,
  formatCommunityData,
  formatLicenseData,
  formatPersonsData,
};

const formatPersonData = ({ data }) => {
  const formatedTableData = data.map((person) => {
    const { user_id, first_name, last_name, agreement } = person;
    return [
      {
        accessor: "Community",
        data: "XXX",
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "First Name",
        data: first_name,
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "Last Name",
        data: last_name,
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "Agreement",
        data: agreement === 1 ? "Yes" : "No",
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "Edit",
        data: "Edit",
        type: "LINK",
        readOnly: true,
        redirectTo: {
          path: `/persons-data/add?userId=${user_id}`,
          isExternalLink: false,
        },
      },
    ];
  });
  return formatedTableData;
};

const formatGamesListData = ({ data }) => {
  const formatedTableData = data.map((person) => {
    const { game_id, game_name, game_description } = person;
    return [
      {
        accessor: "GameName",
        data: game_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "GameDescription",
        data: game_description,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Edit",
        data: "Edit",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/administrative-data/games/add?gameId=${game_id}&gameName=${game_name}&gameDescription=${game_description}`,
          isExternalLink: false,
        },
      },
    ];
  });
  return formatedTableData;
};

const formatAdminLicenseData = ({ data }) => {
  let organizationId = router.query.organizationId;

  const formatedTableData = data.map((license) => {
    const {
      license_id,
      license_number,
      game_id,
      game_name,
      pricing_plan_id,
      plan_name,
      community_id,
      community_name,
      effective_date,
      expire_date,
      renewal_as_of_date,
      org_community_pay,
      organization_name,
    } = license;

    return [
      {
        accessor: "Organization",
        data: organization_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Community",
        data: community_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "License",
        data: license_number,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "GameLicensed",
        data: game_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "GamePricingPlan",
        data: plan_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "EditOrView",
        data: "Edit/View",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/administrative-data/license/add?communityId=${community_id}&communityName=${community_name}&licenseId=${license_id}`,
          isExternalLink: false,
        },
      },
    ];
  });
  return formatedTableData;
};

const formatGameData = ({ data }) => {
  const formatedTableData = data.map((game) => {
    const {
      puzzle_category_id,
      category_name,
      game_id,
      game_name,
      category_description,
    } = game;
    return [
      {
        accessor: "Game",
        data: game_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Category Name",
        data: category_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Edit",
        data: "Edit",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/game-data/add?puzzleCategoryId=${puzzle_category_id}`,
          isExternalLink: false,
        },
      },
      {
        accessor: "Puzzles",
        data: "Puzzles",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/game-data/puzzel?puzzleCategoryId=${puzzle_category_id}&gameName=${game_name}`,
          isExternalLink: false,
        },
      },
    ];
  });
  return formatedTableData;
};

const formatRoleData = ({ data }) => {
  const formatedTableData = data.map((role) => {
    const { role_id, role_name, role_description } = role;

    return [
      {
        accessor: "RoleName",
        data: role_name,
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "RoleDescription",
        data: role_description,
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "EditOrView",
        data: "Edit/View",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/administrative-data/roles/add?roleId=${role_id}&data=${JSON.stringify(
            role
          )}`,
          isExternalLink: false,
        },
      },
    ];
  });
  return formatedTableData;
};

const formatPuzzleData = ({ data, game_level_list }) => {
  const formatedTableData = data.map((puzzle) => {
    const { puzzle_id, game_level, game_level_name, words } = puzzle;
  
    return [
      {
        accessor: "level",
        data: game_level,
        type: "DROPDOWN",
        readOnly: true,
        DropDownContent: game_level_list,
        id: puzzle_id,
      },
      {
        accessor: "wordOne",
        data:
          words.length && words.some((ele) => ele.order === 1)
            ? words[words.findIndex((ele) => ele.order === 1)].word
            : "",
        type: "INPUT",
        readOnly: true,
        DropDownContent: [],
        id: puzzle_id,
        order:
          words.length && words.some((ele) => ele.order === 1)
            ? words[words.findIndex((ele) => ele.order === 1)].order
            : 1,
      },
      {
        accessor: "wordTwo",
        data:
          words.length && words.some((ele) => ele.order === 2)
            ? words[words.findIndex((ele) => ele.order === 2)].word
            : "",
        type: "INPUT",
        readOnly: true,
        DropDownContent: [],
        id: puzzle_id,
        order:
          words.length && words.some((ele) => ele.order === 2)
            ? words[words.findIndex((ele) => ele.order === 2)].order
            : 2,
      },
      {
        accessor: "wordThree",
        data:
          words.length && words.some((ele) => ele.order === 3)
            ? words[words.findIndex((ele) => ele.order === 3)].word
            : "",
        type: "INPUT",
        readOnly: true,
        DropDownContent: [],
        id: puzzle_id,
        order:
          words.length && words.some((ele) => ele.order === 3)
            ? words[words.findIndex((ele) => ele.order === 3)].order
            : 3,
      },
      {
        accessor: "wordFour",
        data:
          words.length && words.some((ele) => ele.order === 4)
            ? words[words.findIndex((ele) => ele.order === 4)].word
            : "",
        type: "INPUT",
        readOnly: true,
        DropDownContent: [],
        id: puzzle_id,
        order:
          words.length && words.some((ele) => ele.order === 4)
            ? words[words.findIndex((ele) => ele.order === 4)].order
            : 4,
      },
      {
        accessor: "wordFive",
        data:
          words.length && words.some((ele) => ele.order === 5)
            ? words[words.findIndex((ele) => ele.order === 5)].word
            : "",
        type: "INPUT",
        readOnly: true,
        DropDownContent: [],
        id: puzzle_id,
        order:
          words.length && words.some((ele) => ele.order === 5)
            ? words[words.findIndex((ele) => ele.order === 5)].order
            : 5,
      },
      {
        accessor: "wordSix",
        data:
          words.length && words.some((ele) => ele.order === 6)
            ? words[words.findIndex((ele) => ele.order === 6)].word
            : "",
        type: "INPUT",
        readOnly: true,
        DropDownContent: [],
        id: puzzle_id,
        order:
          words.length && words.some((ele) => ele.order === 6)
            ? words[words.findIndex((ele) => ele.order === 6)].order
            : 6,
      },
      {
        accessor: "wordSeven",
        data:
          words.length && words.some((ele) => ele.order === 7)
            ? words[words.findIndex((ele) => ele.order === 7)].word
            : "",
        type: "INPUT",
        readOnly: true,
        DropDownContent: [],
        id: puzzle_id,
        order:
          words.length && words.some((ele) => ele.order === 7)
            ? words[words.findIndex((ele) => ele.order === 7)].order
            : 7,
      },
      {
        accessor: "wordEight",
        data:
          words.length && words.some((ele) => ele.order === 8)
            ? words[words.findIndex((ele) => ele.order === 8)].word
            : "",
        type: "INPUT",
        readOnly: true,
        DropDownContent: [],
        id: puzzle_id,
        order:
          words.length && words.some((ele) => ele.order === 8)
            ? words[words.findIndex((ele) => ele.order === 8)].order
            : 8,
      },
      {
        accessor: "Delete",
        data: "Delete",
        type: "BUTTON", // INPUT DROPDOWN LINK
        readOnly: true,
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
        id: puzzle_id,
        // isDisabled: !allow_to_delete,
      },

    ];
  });
  return formatedTableData;
};

const formatPricingPlanData = ({ data }) => {
  const formatedTableData = data.map((role) => {
    const {
      plan_name,
      game_id,
      game_name,
      plan_description,
      hosted_games,
      xtra_hosted_games,
      price_per_month,
      price_per_year,
      pricing_plan_id,
    } = role;
    return [
      {
        accessor: "PlanName",
        data: plan_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Game",
        data: game_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "HostedGames",
        data: hosted_games,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "ExtraHosted",
        data: xtra_hosted_games,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "PricePerYear",
        data: price_per_year,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "PricePerMonth",
        data: price_per_month,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "EditOrView",
        data: "Edit/View",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/administrative-data/pricing-plan/add?planId=${pricing_plan_id}&planName=${plan_name}&gameName=${game_name}&gameId=${game_id}&hostedGames=${hosted_games}&extraHostedGames=${xtra_hosted_games}&pricePerMonth=${price_per_month}&pricePerYear=${price_per_year}&planDescription=${plan_description}`,
          isExternalLink: false,
        },
      },
    ];
  });
  return formatedTableData;
};

const formatPuzzleCategoryData = ({ data, puzzle_category_list }) => {
  const formatedTableData = data.map((category) => {
    const {
      puzzle_category_id,
      category_name,
      round,
      puzzle_id,
      game_level,
      game_level_name,
      words,
    } = category;
    return [
      {
        accessor: "Puzzle Category",
        data: puzzle_category_list.some(
          (item) => item.value === puzzle_category_id
        )
          ? puzzle_category_id
          : category_name,
        type: "DROPDOWN",
        readOnly: true,
        DropDownContent: puzzle_category_list,
        id: round,
      },
      {
        accessor: "Round",
        data: round,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Puzzles",
        data: "Puzzles",
        type: "BUTTON",
        readOnly: true,
        id: round,
        DropDownContent: [],
      },
    ];
  });
  return formatedTableData;
};

const formatPlayerData = ({ data, scheduleId,from }) => {
  const formatedTableData = data.map((playerData) => {
    const {
      player_id,
      first_name,
      last_name,
      games_played,
      last_game_date,
      game_name,
      game_level,
      game_level_name,
    } = playerData;
    return [
      {
        accessor: "first_name",
        data: first_name,
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "last_name",
        data: last_name,
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "games_played",
        data: games_played,
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "last_game_date",
        data: games_played > 0 ? formatDate(last_game_date) : "Null",
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "games_name",
        data: games_played > 0 ? game_name : "Null",
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "game_level",
        data: games_played > 0 ? game_level_name : "Null",
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "Puzzles_played",
        data: "Show",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: scheduleId ? `/game-schedules/show-game/?playerName=${first_name}+${last_name}&playerId=${player_id}&scheduleId=${scheduleId}&from=${from}` : `/game-schedules/show-game/?playerName=${first_name}+${last_name}&playerId=${player_id}`,
          isExternalLink: false,
        },
      },
    ];
  });
  return formatedTableData;
};

// const formatgamesPlayedData = ({ data }) => {
//   const formatedTableData = data.map((gamesPlayed) => {
//     const { game_id, game_name, game_level, date_played, game_level_name } =
//       gamesPlayed;
//     return [
//       {
//         accessor: "Game",
//         data: game_name,
//         type: "TEXT",
//         readOnly: true,
//       },
//       {
//         accessor: "DatePlayed",
//         data: date_played,
//         type: "TEXT",
//         readOnly: true,
//       },
//     ];
//   });
//   return formatedTableData;
// };

const formatgamesPlayedData = ({ data }) => {
  const formatedTableData = data.map((gamesPlayed) => {
    const { game_level,date_played,word_one,word_two,word_three,word_four,word_five,word_six,word_seven, word_eight } =
      gamesPlayed;
    return [
      {
        accessor: "Level",
        data: game_level,
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "DatePlayed",
        data: formatDate(date_played),
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "Word1",
        data: word_one,
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "Word2",
        data: word_two,
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "Word3",
        data: word_three,
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "Word4",
        data: word_four,
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "Word5",
        data: word_five,
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "Word6",
        data: word_six,
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "Word7",
        data: word_seven,
        type: "TEXT",
        readOnly: true,
      },
      {
        accessor: "Word8",
        data: word_eight,
        type: "TEXT",
        readOnly: true,
      },

    ];
  });
  return formatedTableData;
};


const formatScheduleData = ({ data }) => {
  const formatedTableData = data.map((scheduleData) => {
    const {
      game_schedule_id,
      community_id,
      community_name,
      game_name,
      schedule_start_at,
      host_name,
      zoom_link,
      join_link,
      recommend_host,
      is_zoom_game,
      allow_to_delete,
      allow_to_edit,
      allow_to_record_attendance,
      allow_to_start,
      allow_to_view_detail,
      allow_to_view_puzzle,
      allow_to_view_attendance,
    } = scheduleData;

    
    

    let date = new Date(`${schedule_start_at.replace(/ /g, "T")}.000+00:00`)
    



    return [
      {
        accessor: "Host Name",
        data: host_name,
        type: "TEXT", // INPUT DROPDOWN LINK (Enum values)
        readOnly: true,
      },
      {
        accessor: "Game",
        data: game_name,
        type: "TEXT", // INPUT DROPDOWN LINK
        readOnly: true,
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
      },
      {
        accessor: "Community",
        data: community_name,
        type: "TEXT", 
        readOnly: true,
        DropDownContent: [], 
      },
      {
        accessor: "Date",
        data: formatDate(date),
        type: "TEXT", // INPUT DROPDOWN LINK
        readOnly: true,
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
        redirectTo: {
          path: "/game-schedules/add-schedule/",
          isExternalLink: false,
        },
      },
      {
        accessor: "Scheduled start time",
        data: formatTime(date),
        type: "TEXT", // INPUT DROPDOWN LINK
        readOnly: true,
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
      },
      {
        accessor: "Puzzle",
        data: "Puzzles",
        type: "LINK", // INPUT DROPDOWN LINK
        readOnly: true,
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
        redirectTo: {
          path: `/game-schedules/puzzle/?gameScheduleId=${game_schedule_id}&gameName=${game_name}&date=${formatDate(date)}&commName=${community_name}&communityId=${community_id}`,
          isExternalLink: false,
        },
        isDisabled: !allow_to_view_puzzle,
      },
      {
        accessor: "Edit",
        data: "Edit",
        type: "LINK", // INPUT DROPDOWN LINK
        readOnly: true,
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
        redirectTo: {
          path: `/game-schedules/add-schedule/add?gameScheduleId=${game_schedule_id}&gameName=${game_name}&date=${formatDate(date)}&commName=${community_name}&allowToEdit=${!allow_to_edit}&allowToView=${!allow_to_view_detail}&from=schedule&community_id=${community_id}&is_zoom_game=${is_zoom_game}`,
          isExternalLink: false,
        },
        isDisabled: !(allow_to_edit || allow_to_view_detail),
      },
      {
        accessor: "Delete",
        data: "Delete",
        type: "BUTTON", // INPUT DROPDOWN LINK
        readOnly: true,
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
        redirectTo: {
          path: "/game-schedules/add-schedule/",
          isExternalLink: false,
        },
        id: game_schedule_id,
        isDisabled: !allow_to_delete,
      },
      {
        accessor: "Record Attendance",
        data: "Record Attendance",
        type: "LINK", // INPUT DROPDOWN LINK
        readOnly: true,
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
        redirectTo: {
          path: `/game-schedules/attendance-record/?gameName=${game_name}&date=${formatDate(date)}&&commName=${community_name}&scheduleId=${game_schedule_id}&commId=${community_id}&hostName=${host_name}&is_zoom_game=${is_zoom_game}`,
          isExternalLink: false,
        },
        isDisabled: !allow_to_view_attendance,
      },
      {
        accessor: "Start Zoom",
        data: "Start Zoom",
        type: "BUTTON", // INPUT DROPDOWN LINK
        readOnly: true,
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
        redirectTo: { path: "", isExternalLink: true, externalPath: "" },
        id: game_schedule_id,
        isDisabled: !(allow_to_start && is_zoom_game === 1 ? true : false),
      },
      {
        accessor: "Start Game",
        data: "Start Game",
        type: "BUTTON", // INPUT DROPDOWN LINK
        readOnly: true,
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
        redirectTo: { path: "", isExternalLink: true, externalPath: "" },
        id: game_schedule_id,
        isDisabled: !allow_to_start,
      },
    ];
  });
  return formatedTableData;
};

const formatAttendanceData = ({ data, person_type_list }) => {
  const formatedTableData = data.map((data) => {
    const {
      game_user_id,
      user_id,
      user_type,
      user_type_name,
      first_name,
      last_name,
      email_id,
      status,
      join_at,
      leave_at
    } = data;

    return [
      {
        accessor: "Person ID",
        data: user_id,
        type: "TEXT", // INPUT DROPDOWN LINK (Enum values)
        readOnly: true,
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
      },
      {
        accessor: "First Name",
        data: first_name,
        type: "TEXT", // INPUT DROPDOWN LINK
        readOnly: true,
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
      },
      {
        accessor: "Last Name",
        data: last_name,
        type: "TEXT", // INPUT DROPDOWN LINK
        readOnly: true,
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
      },
      {
        accessor: "Person Email",
        data: email_id,
        type: "TEXT", // INPUT DROPDOWN LINK
        readOnly: true,
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
      },
      {
        accessor: "Person Type",
        data: person_type_list.some((item) => item.value === user_type)
          ? user_type
          : user_type_name,
        type: "DROPDOWN", // INPUT DROPDOWN LINK
        readOnly: true,
        DropDownContent: person_type_list,
        id: game_user_id, // Array of dropdwon data to be passed here. Only if type DropDown
      },
      {
        accessor: "JoinAt",
        data: join_at !== null ? `${formatDate(join_at)} ${formatTime(join_at)}` : "",
        type: "TEXT", // INPUT DROPDOWN LINK
        readOnly: true,
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
      },
      {
        accessor: "LeaveAt",
        data: leave_at !== null ? `${formatDate(leave_at)} ${formatTime(leave_at)}` : "",
        type: "INPUT",
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
        id: game_user_id,
      },
      {
        accessor: "Delete",
        data: "Delete",
        type: "BUTTON", // INPUT DROPDOWN LINK
        readOnly: true,
        DropDownContent: [], // Array of dropdwon data to be passed here. Only if type DropDown
        id:game_user_id,
        redirectTo: {
          path: "/game-schedules/attendance-record/",
          isExternalLink: false,
        },
      },
    ];
  });
  return formatedTableData;
};

const formatReportLicenseData = ({ data, isPdf }) => {
  const formatedTableData = data.map((license) => {
    const {
      license_id,
      game_name,
      plan_name,
      renewal_date,
      organization_name,
      community_name,
      in_effect,
      org_community_pay
    } = license;

    return [
      {
        accessor: "OrganizationName",
        data: organization_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "CommunityName",
        data: community_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "RenewalDate",
        data: formatDate(renewal_date),
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "InEffect",
        data: in_effect==0?"N":"Y",
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "GameLicensed",
        data: game_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "GamePricingPlan",
        data: plan_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Org/Comm Pays",
        data: org_community_pay,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],    
      },
      !isPdf && {
        accessor: "View",
        data: "View",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/reports/license/view?licenseId=${license_id}`,
          isExternalLink: false,
        },
      }
    ];
  });
  return formatedTableData;
};
const formatExportLicenseData = ({ data }) => {
  const formatedTableData = data.map((license) => {
    const {
      license_id,
      game_name,
      plan_name,
      renewal_date,
      organization_name,
      community_name,
      in_effect,
      org_community_pay,
      license_number,
      effective_date,
      expire_as_of_date
    } = license;

    return [
      {
        accessor: "License#",
        data: license_number,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "OrganizationName",
        data: organization_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "CommunityName",
        data: community_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "RenewalDate",
        data: renewal_date ? formatDate(renewal_date) : "",
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "LicenseEffectiveDate",
        data: effective_date ? formatDate(effective_date) : "",
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "ExpiredAsOfDate",
        data: expire_as_of_date ? formatDate(expire_as_of_date) : "",
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "InEffect",
        data: in_effect==0?"N":"Y",
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "GameLicensed",
        data: game_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "GamePricingPlan",
        data: plan_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Org/Comm Pays",
        data: org_community_pay,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],    
      },
      
    ];
  });
  return formatedTableData;
};

//Report table data
const formatRoleReport = ({ data }) => {
  const formatedTableData = data.map((data) => {
    const {
      role_id,
      role_name,
      role_description,
      organization_id,
      organization_name,
      community_id,
      community_name,
      user_id,
      first_name,
      last_name,
    } = data;

    return [
      {
        accessor: "Organization",
        data: organization_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Community",
        data: community_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "RoleName",
        data: role_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "FirstName",
        data: first_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "LastName",
        data: last_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
    ];
  });
  return formatedTableData;
};

const formatPricingPlanReport = ({ data, isPdf }) => {
  const formatedTableData = data.map((data) => {
    const {
      plan_name,
      game_id,
      game_name,
      price_per_month,
      price_per_year,
      pricing_plan_id,
      hosted_games,
      xtra_hosted_games,
      plan_description,
    } = data;

    return [
      {
        accessor: "Game",
        data: game_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
        redirectTo: "",
      },
      {
        accessor: "PlanName",
        data: plan_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "PlanDescription",
        data: plan_description,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "PricePerMonth",
        data: price_per_month,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "PricePerYear",
        data: price_per_year,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      !isPdf && {
        accessor: "View",
        data: "View",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/reports/pricing-plans/view?planId=${pricing_plan_id}&planName=${plan_name}&gameName=${game_name}&hostedGames=${hosted_games}&extraHostedGames=${xtra_hosted_games}&pricePerMonth=${price_per_month}&pricePerYear=${price_per_year}&planDescription=${plan_description}`,
          isExternalLink: false,
        },
      },
    ];
  });
  return formatedTableData;
};

const formatPricingPlanExport = ({ data }) => {
  const formatedTableData = data.map((data) => {
    const {
      plan_name,
      game_name,
      price_per_month,
      price_per_year,
      hosted_games,
      xtra_hosted_games,
      plan_description
    } = data;

    return [
      {
        accessor: "Game",
        data: game_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
        redirectTo: "",
      },
      {
        accessor: "PlanName",
        data: plan_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "PlanDescription",
        data: plan_description,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "HostedGames",
        data: hosted_games,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "ExtraHostedGames",
        data: xtra_hosted_games,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "PricePerMonth",
        data: price_per_month,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "PricePerYear",
        data: price_per_year,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
   
    ];
  });
  return formatedTableData;
};

const formatGameScheduleReport = ({ data, isPdf }) => {
  const formatedTableData = data.map((scheduleData) => {
    const {
      community_name,
      game_name,
      schedule_start_at,
      host_name,
      game_schedule_id,
      game_level_name
    } = scheduleData;

    let date = new Date(`${schedule_start_at.replace(/ /g, "T")}.000+00:00`)

    return [
      {
        accessor: "HostName",
        data: host_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Game",
        data: game_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Difficulty",
        data: game_level_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Date",
        data: formatDate(date),
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Scheduledstarttime",
        data: formatTime(date),
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Community",
        data: community_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      !isPdf && {
        accessor: "View",
        data: "View",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/reports/schedule/view?scheduleId=${game_schedule_id}`,
          isExternalLink: false,
        },
      },
    ];
  });
  return formatedTableData;
};

const formatGameScheduleExport = ({ data }) => {
  const formatedTableData = data.map((scheduleData) => {
    const {
      community_name,
      game_name,
      schedule_start_at,
      host_id,
      host_email_id,
      host_engagement_rating,
      host_competence_rating,
      host_rating_comment,
      recommend_host_value,
      zoom_account_user_id,
      custom_spinner_space_name,
      game_schedule_id,
      game_level_name,
      meeting_id,
      zoom_link,
      started_by,
      players
    } = scheduleData;

    let date = new Date(`${schedule_start_at.replace(/ /g, "T")}.000+00:00`)

    return [
      {
        accessor: "GameScheduleId",
        data:  game_schedule_id,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Community",
        data: community_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Game",
        data: game_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Date",
        data: formatDate(date),
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Scheduledstarttime",
        data: formatTime(date),
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Difficulty",
        data: game_level_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "HostId",
        data: host_id,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "HostEmail",
        data: host_email_id,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "HostEngagementRating",
        data: host_engagement_rating,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "HostCompetenceRating",
        data: host_competence_rating,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "RecommendHost",
        data: recommend_host_value,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "HostRatingComment",
        data: host_rating_comment,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "MeetingID",
        data: meeting_id,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "ZoomAccountUserId",
        data: zoom_account_user_id,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "CustomSpinnerSpace",
        data: custom_spinner_space_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Player1",
        data: (players && players[0]) ? `${players[0].first_name} ${players[0].last_name}` : "",
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "PlayerDisplay1",
        data: (players && players[0]) ? players[0].player_display_name : "",
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Player2",
        data: (players && players[1]) ? `${players[1].first_name} ${players[1].last_name}` : "",
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "PlayerDisplay2",
        data: (players && players[1]) ? players[1].player_display_name : "",
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Player3",
        data: (players && players[2]) ? `${players[2].first_name} ${players[2].last_name}` : "",
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "PlayerDisplay3",
        data: (players && players[2]) ? players[2].player_display_name : "",
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Player4",
        data: (players && players[3]) ? `${players[3].first_name} ${players[3].last_name}` : "",
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "PlayerDisplay4",
        data: (players && players[3]) ? players[3].player_display_name : "",
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "StartedBy",
        data: started_by,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
    ];
  });
  return formatedTableData;
};

const formatReportOrganizationData = ({ data, isPdf }) => {
  const formatedTableData = data.map((organization) => {
    const {
      community_id,
      organization_name,
      city,
      zip_postal,
      state_name,
      community_name,
      parent_organization_name
    } = organization;
    
    return [
      {
        accessor: "ParentOrganization",
        data: parent_organization_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "OrganizationName",
        data: organization_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "CommunityName",
        data: community_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "City",
        data: city,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "StateOrProvince",
        data: state_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "ZipPostal",
        data: zip_postal,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
     !isPdf && {
        accessor: "View",
        data: "View",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/reports/organization/view?communityId=${community_id}`,
          isExternalLink: false,
        },
      }
    ];
  });
  
  return formatedTableData;
};
const formatExportOrganizationData = ({ data }) => {
  const formatedTableData = data.map((organization) => {
    const {
      community_id,
      organization_name,
      city,
      zip_postal,
      state_name,
      community_name,
      sales_force_id,
      time_zone_name,
      county,
      street_address,
      parent_organization_name
    } = organization;

    return [
      {
        accessor: "ParentOrganization",
        data: parent_organization_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "OrganizationName",
        data: organization_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "CommunityName",
        data: community_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "City",
        data: city,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "StateOrProvince",
        data: state_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "ZipPostal",
        data: zip_postal,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Address",
        data: street_address,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "County",
        data: county,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "SalesForceAccountID",
        data: sales_force_id,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "TimeZone",
        data: time_zone_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      
    ];
  });
  return formatedTableData;
};

const formatGameReportData = ({ data }) => {
  const formatedTableData = data.map((game) => {
    const { game_description, game_name } = game;
    return [
      {
        accessor: "Name",
        data: game_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Description",
        data: game_description,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
    ];
  });
  return formatedTableData;
};

const formatPuzzleReportList = ({ data }) => {
  const formatedTableData = data.map((data) => {
    const { category_name, game_level_name, game_name, words, puzzle_id } = data;
    
    return [
      {
        accessor: "CategoryName",
        data: category_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "GameName",
        data: game_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "GameLevel",
        data: game_level_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "wordOne",
        data:(words.length && words[0]) && words[0].word,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "wordTwo",
        data:(words.length && words[1]) && words[1].word,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "wordThree",
        data:(words.length && words[2]) && words[2].word,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "wordFour",
        data:(words.length && words[3]) && words[3].word,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "wordFive",
        data:(words.length && words[4]) && words[4].word,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "wordSix",
        data:(words.length && words[5]) && words[5].word,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "wordSeven",
        data:(words.length && words[6]) && words[6].word,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "wordEight",
        data:(words.length && words[7]) && words[7].word,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },   
    ];
  });
  return formatedTableData;
};
const formatReportPersonData = ({ data, isPdf }) => {
  const formatedTableData = data.map((user) => {
    const {
      user_id,
      first_name,
      last_name,
      agreement,
      user_comm_role = { community_name: "" , role_name: ""}, 
    } = user;

    let orgCommRoleData = getOrgCommRoleData(user_comm_role);

    return [
      {
        accessor: "FirstName",
        data: first_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "LastName",
        data: last_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Organization",
        data:  orgCommRoleData.organization,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Community",
        data: orgCommRoleData.comm_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Role",
        data: orgCommRoleData.role,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Agreement",
        data: agreement === 1 ? "Yes" : "No",
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      !isPdf && {
        accessor: "View",
        data: "View",
        type: "LINK",
        readOnly: true,
        DropDownContent: [],
        redirectTo: {
          path: `/reports/persons/view?userId=${user_id}`,
          isExternalLink: false,
        },
      },
    ];
  });
  return formatedTableData;
};

const formatPersonDataforExport = ({ data }) => {
  const formatedTableData = data.map((user) => {
    const {
      first_name,
      last_name,
      agreement,
      email_id,
      phone_number,
      user_comm_role,
    } = user;

    let orgCommRoleData = getOrgCommRoleData(user_comm_role);

    return [
      {
        accessor: "FirstName",
        data: first_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "LastName",
        data: last_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Phone",
        data: phone_number,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Email",
        data: email_id,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Organization",
        data: orgCommRoleData.organization,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Community",
        data: orgCommRoleData.comm_name,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Role",
        data: orgCommRoleData.role,
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
      {
        accessor: "Agreement",
        data: agreement === 1 ? "Yes" : "No",
        type: "TEXT",
        readOnly: true,
        DropDownContent: [],
      },
    ];
  });
  return formatedTableData;
};



const formatPuzzleCategoryDataForExport = ({ data }) => {
  const formatedTableData = data.map((category) => {
    const {
      puzzle_category_id,
      category_name,
      round,
      puzzle_id,
      game_level,
      game_level_name,
      words,
    } = category;
    return [
      {
        accessor: "Game",
        data: "Spintopia", // TODO (IMP): Get data from API
      },
      {
        accessor: "Game Level",
        data: game_level_name,
      },
      {
        accessor: "Puzzle Category",
        data: category_name,
      },
      {
        accessor: "Round",
        data: round,
      },
      ...words.map(({ order, word }) => {
        const wordFormatData =       {
          accessor: `Word${order}`,
          data: word,
        }
        return wordFormatData
      })

    ];
  });
  return formatedTableData;
};



export {
  formatPersonData,
  formatGamesListData,
  formatReportOrganizationData,
  formatExportOrganizationData,
  formatAdminLicenseData,
  formatGameData,
  formatRoleData,
  formatPuzzleData,
  formatPricingPlanData,
  formatPuzzleCategoryData,
  formatPlayerData,
  formatgamesPlayedData,
  formatScheduleData,
  formatReportLicenseData,
  formatExportLicenseData,
  formatGameReportData,
  formatAttendanceData,
  formatRoleReport,
  formatPricingPlanReport,
  formatPricingPlanExport,
  formatGameScheduleReport,
  formatGameScheduleExport,
  formatPuzzleReportList,
  formatReportPersonData,
  formatPuzzleCategoryDataForExport,
  formatPersonDataforExport
};
