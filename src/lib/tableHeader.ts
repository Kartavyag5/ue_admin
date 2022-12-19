const OrganizationTableHeader = [
  {
    Header: "Organization Name",
    accessor: "Organization Name",
  },
  {
    Header: "",
    accessor: "Edit",
  },
  {
    Header: "",
    accessor: "Communities",
  },
];

const OrganizationReportTableHeader = [
  {
    Header: "Parent Organization",
    accessor: "ParentOrganization",
  },
  {
    Header: "Organization Name",
    accessor: "OrganizationName",
  },
  {
    Header: "Community Name",
    accessor: "CommunityName",
  },
  {
    Header: "City",
    accessor: "City",
  },
  {
    Header: "State/Province",
    accessor: "StateOrProvince",
  },
  {
    Header: "Zip Postal",
    accessor: "ZipPostal",
  },
  {
    Header: "",
    accessor: "View",
  },
];

const organizationExportTableHeader = [
  {
    Header: "Parent Organization",
    accessor: "ParentOrganization",
  },
  {
    Header: "Organization Name",
    accessor: "OrganizationName",
  },
  {
    Header: "Community Name",
    accessor: "CommunityName",
  },
  {
    Header: "City",
    accessor: "City",
  },
  {
    Header: "State/Province",
    accessor: "StateOrProvince",
  },
  {
    Header: "Zip Postal",
    accessor: "ZipPostal",
  },
  {
    Header: "Address",
    accessor: "Address",
  },
  {
    Header: "County",
    accessor: "County",
  },
  {
    Header: "SalesForce Account ID ",
    accessor: "SalesForceAccountID ",
  },
  {
    Header: "Time Zone",
    accessor: "TimeZone",
  },
];

const communityTableHeader = [
  {
    Header: "Community Name",
    accessor: "Community Name",
  },
  {
    Header: "",
    accessor: "Edit",
  },
  {
    Header: "",
    accessor: "License",
  },
];

const LicenseTableHeader = [
  {
    Header: "License#",
    accessor: "License",
  },
  {
    Header: "Game Licensed",
    accessor: "GameLicensed",
  },
  {
    Header: "Plan Name",
    accessor: "PlanName",
  },
  {
    Header: "Effective Date",
    accessor: "EffectiveDate",
  },
  {
    Header: "",
    accessor: "EditOrView",
  },
];

const personTableHeader = [
  {
    Header: "Community",
    accessor: "Community",
  },
  {
    Header: "First Name",
    accessor: "First Name",
  },
  {
    Header: "Last Name",
    accessor: "Last Name",
  },
  {
    Header: "Role",
    accessor: "Role",
  },
  {
    Header: "Agreement",
    accessor: "Agreement",
  },
  {
    Header: "",
    accessor: "Edit",
  },
];

const personReportTableHeader = [
  {
    Header: "First Name",
    accessor: "FirstName",
  },
  {
    Header: "Last Name",
    accessor: "LastName",
  },
  {
    Header: "Organization",
    accessor: "Organization",
  },
  {
    Header: "Community",
    accessor: "Community",
  },
  {
    Header: "Role",
    accessor: "Role",
  },
  {
    Header: "Agreement",
    accessor: "Agreement",
  },
  {
    Header: "",
    accessor: "View",
  },
];

const personExportTableHeader = [
  {
    Header: "First Name",
    accessor: "FirstName",
  },
  {
    Header: "Last Name",
    accessor: "LastName",
  },
  {
    Header: "Phone",
    accessor: "Phone",
  },
  {
    Header: "Email",
    accessor: "Email",
  },
  {
    Header: "Organization",
    accessor: "Organization",
  },
  {
    Header: "Community",
    accessor: "Community",
  },
  {
    Header: "Role",
    accessor: "Role",
  },
  {
    Header: "Agreement",
    accessor: "Agreement",
  },

];

const gameScheduleTableHeader = [
  {
    Header: "Host Name",
    accessor: "Host Name",
  },
  {
    Header: "Game",
    accessor: "Game",
  },
  {
    Header: "Community",
    accessor: "Community",
  },
  {
    Header: "Date",
    accessor: "Date",
  },
  {
    Header: "Scheduled start time",
    accessor: "Scheduled start time",
  },

  {
    Header: "",
    accessor: "Puzzle",
  },
  {
    Header: "",
    accessor: "Edit",
  },
  {
    Header: "",
    accessor: "Delete",
  },
  {
    Header: "",
    accessor: "Record Attendance",
  },
  {
    Header: "",
    accessor: "Start Zoom",
  },
  {
    Header: "",
    accessor: "Start Game",
  },
];

const gameScheduleReportHeader = [
  {
    Header: "Host Name", // Display text can be anything
    accessor: "HostName",
  },
  {
    Header: "Game",
    accessor: "Game",
  },
  {
    Header: "Difficulty",
    accessor: "Difficulty",
  },
  {
    Header: "Date",
    accessor: "Date",
  },
  {
    Header: "Scheduled start time",
    accessor: "Scheduledstarttime",
  },

  {
    Header: "Community",
    accessor: "Community",
  },
  {
    Header: "",
    accessor: "View",
  }
];

const gameScheduleExportHeader = [
  {
    Header: "Game Schedule Id",
    accessor: "GameScheduleId",
  },
  {
    Header: "Community",
    accessor: "Community",
  },
  {
    Header: "Game",
    accessor: "Game",
  },
  {
    Header: "Date",
    accessor: "Date",
  },
  {
    Header: "Scheduled start time",
    accessor: "Scheduledstarttime",
  },
  {
    Header: "Difficulty",
    accessor: "Difficulty",
  },
  {
    Header: "Host Id",
    accessor: "HostId",
  },
  {
    Header: "Host Email",
    accessor: "HostEmail",
  },
  {
    Header: "Host Engagement Rating",
    accessor: "HostEngagementRating",
  },
  {
    Header: "Host CompetenceRating",
    accessor: "HostCompetenceRating",
  },
  {
    Header: "Recommend Host",
    accessor: "RecommendHost",
  },
  {
    Header: "Host Rating Comment",
    accessor: "HostRatingComment",
  },
  {
    Header: "Meeting ID",
    accessor: "MeetingID",
  },
  {
    Header: "ZoomAccountUserId",
    accessor: "Zoom Account User Id",
  },
  {
    Header: "Custom Spinner Space",
    accessor: "CustomSpinnerSpace",
  },
  {
    Header: "Player 1",
    accessor: "Player1",
  },
  {
    Header: "Player Display 1",
    accessor: "PlayerDisplay1",
  },
  {
    Header: "Player 2",
    accessor: "Player2",
  },
  {
    Header: "Player Display 2",
    accessor: "PlayerDisplay2",
  },
  {
    Header: "Player 3",
    accessor: "Player3",
  },
  {
    Header: "Player Display 3",
    accessor: "PlayerDisplay3",
  },
  {
    Header: "Player 4",
    accessor: "Player4",
  },
  {
    Header: "Player Display 4",
    accessor: "PlayerDisplay4",
  },
  {
    Header: "Started By",
    accessor: "StartedBy",
  },
];

const attendanceTableHeader = [
  {
    Header: "Person ID",
    accessor: "Person ID",
  },
  {
    Header: "First Name",
    accessor: "First Name",
  },
  {
    Header: "Last Name",
    accessor: "Last Name",
  },
  {
    Header: "Person Email",
    accessor: "Person Email",
  },
  {
    Header: "Person Type",
    accessor: "Person Type",
  },
  {
    Header: "Join At",
    accessor: "JoinAt",
  },
  {
    Header: "Leave At",
    accessor: "LeaveAt",
  },
  {
    Header: "",
    accessor: "Delete",
  },
];

const puzzleTableHeader = [
  {
    Header: "Puzzle Category", // Display text can be anything
    accessor: "Puzzle Category",
  },
  {
    Header: "Round",
    accessor: "Round",
  },
  {
    Header: "",
    accessor: "Puzzles",
  }
];

const puzzleExportTableHeader = [
  {
    Header: "Game",
    accessor: "Game",
  },
  {
    Header: "Game Level",
    accessor: "Game Level",
  },
  {
    Header: "Puzzle Category",
    accessor: "Puzzle Category",
  },
  {
    Header: "Round",
    accessor: "Round",
  },
  {
    Header: "Word1",
    accessor: "Word1",
  },
  {
    Header: "Word2",
    accessor: "Word2",
  },
  {
    Header: "Word3",
    accessor: "Word3",
  },
  {
    Header: "Word4",
    accessor: "Word4",
  },
  {
    Header: "Word5",
    accessor: "Word5",
  },
  {
    Header: "Word6",
    accessor: "Word6",
  },
  {
    Header: "Word7",
    accessor: "Word7",
  },
  {
    Header: "Word8",
    accessor: "Word8",
  },
];


const puzzleReportTableHeader = [
  {
    Header: "Category",
    accessor: "CategoryName",
  },
  {
    Header: "Game",
    accessor: "GameName",
  },
  {
    Header: "Game Level",
    accessor: "GameLevel",
  },
  {
    Header: "Word 1",
    accessor: "wordOne",
  },
  {
    Header: "Word 2",
    accessor: "wordTwo",
  },
  {
    Header: "Word 3",
    accessor: "wordThree",
  },
  {
    Header: "Word 4",
    accessor: "wordFour",
  },
  {
    Header: "Word 5",
    accessor: "wordFive",
  },
  {
    Header: "Word 6",
    accessor: "wordSix",
  },
  {
    Header: "Word 7",
    accessor: "wordSeven",
  },
  {
    Header: "Word 8",
    accessor: "wordEight",
  },
];

const showPlayerTableHeader = [
  {
    Header: "Level", // Display text can be anything
    accessor: "Level",
  },
  {
    Header: "Date Played",
    accessor: "DatePlayed",
  },
  {
    Header: "Word 1",
    accessor: "Word1",
  },
  {
    Header: "Word 2",
    accessor: "Word2",
  },
  {
    Header: "Word 3",
    accessor: "Word3",
  },
  {
    Header: "Word 4",
    accessor: "Word4",
  },
  {
    Header: "Word 5",
    accessor: "Word5",
  },
  {
    Header: "Word 6",
    accessor: "Word6",
  },
  {
    Header: "Word 7",
    accessor: "Word7",
  },
  {
    Header: "Word 8",
    accessor: "Word8",
  },
];

const gameDataTableHeader = [
  {
    Header: "Game",
    accessor: "Game",
  },
  {
    Header: "Category Name",
    accessor: "Category Name",
  },
  {
    Header: "",
    accessor: "Edit",
  },
  {
    Header: "",
    accessor: "Puzzles",
  },
];

const puzzleGameTableHeader = [
  {
    Header: "level",
    accessor: "level",
  },
  {
    Header: "word 1",
    accessor: "wordOne",
  },
  {
    Header: "word 2",
    accessor: "wordTwo",
  },
  {
    Header: "word 3",
    accessor: "wordThree",
  },
  {
    Header: "word 4",
    accessor: "wordFour",
  },
  {
    Header: "word 5",
    accessor: "wordFive",
  },
  {
    Header: "word 6",
    accessor: "wordSix",
  },
  {
    Header: "word 7",
    accessor: "wordSeven",
  },
  {
    Header: "word 8",
    accessor: "wordEight",
  },
  {
    Header: "",
    accessor: "Delete"
  }
];

const gameTableHeader = [
  {
    Header: "Game Name",
    accessor: "GameName",
  },
  {
    Header: "Game Description",
    accessor: "GameDescription",
  },
  {
    Header: "",
    accessor: "Edit",
  },
];

const playerDetailTableHeader = [
  {
    Header: "First Name", // Display text can be anything
    accessor: "first_name",
  },
  {
    Header: "Last Name",
    accessor: "last_name",
  },
  {
    Header: "Games Played",
    accessor: "games_played",
  },
  {
    Header: "Last Game Date",
    accessor: "last_game_date",
  },
  {
    Header: "Game Name",
    accessor: "games_name",
  },
  {
    Header: "Game Level",
    accessor: "game_level"
  },
  {
    Header: "Puzzles Played",
    accessor: "Puzzles_played"
  },
];

const licenseDataTableHeader = [
  {
    Header: "Organization",
    accessor: "Organization",
  },
  {
    Header: "Community",
    accessor: "Community",
  },
  {
    Header: "License#",
    accessor: "License",
  },
  {
    Header: "Game licensed",
    accessor: "GameLicensed",
  },
  {
    Header: "Game Pricing Plan",
    accessor: "GamePricingPlan",
  },
  {
    Header: "",
    accessor: "EditOrView",
  },
];

const licenseReportTableHeader = [
  {
    Header: "Organization Name",
    accessor: "OrganizationName",
  },
  {
    Header: "Community Name",
    accessor: "CommunityName",
  },
  {
    Header: "Renewal Date",
    accessor: "RenewalDate",
  },
  {
    Header: "In Effect",
    accessor: "InEffect",
  },
  {
    Header: "Game Licensed",
    accessor: "GameLicensed",
  },
  {
    Header: "Game Pricing Plan",
    accessor: "GamePricingPlan",
  },
  {
    Header: "Org/Comm Pays",
    accessor: "Org/Comm Pays",
  },
  {
    Header: "",
    accessor: "View",
  },
];
const licenseExportTableHeader = [
  {
    Header: "License#",
    accessor: "License#",
  },
  {
    Header: "Organization Name",
    accessor: "OrganizationName",
  },
  {
    Header: "Community Name",
    accessor: "CommunityName",
  },
  {
    Header: "Renewal Date",
    accessor: "RenewalDate",
  },
  {
    Header: "License Effective Date",
    accessor: "LicenseEffectiveDate",
  },
  {
    Header: "Expired as of date",
    accessor: "ExpiredAsOfDate",
  },
  {
    Header: "In Effect",
    accessor: "InEffect",
  },
  {
    Header: "Game Licensed",
    accessor: "GameLicensed",
  },
  {
    Header: "Game Pricing Plan",
    accessor: "GamePricingPlan",
  },
  {
    Header: "Org/Comm Pays",
    accessor: "Org/Comm Pays",
  },
];

const pricingPlanTableHeader = [
  {
    Header: "Plan Name",
    accessor: "PlanName",
  },
  {
    Header: "Game",
    accessor: "Game",
  },
  {
    Header: "Hosted Games",
    accessor: "HostedGames",
  },
  {
    Header: "Extra Hosted",
    accessor: "ExtraHosted",
  },
  {
    Header: "Price Per Year",
    accessor: "PricePerYear",
  },
  {
    Header: "Price Per Month",
    accessor: "PricePerMonth",
  },
  {
    Header: "",
    accessor: "EditOrView",
  },
];
const pricingPlanReportHeader = [
  {
    Header: "Game", // Display text can be anything
    accessor: "Game",
  },
  {
    Header: "Plan Name",
    accessor: "PlanName",
  },
  {
    Header: "Plan Description",
    accessor: "PlanDescription",
  },
  {
    Header: "Price Per Month",
    accessor: "PricePerMonth",
  },
  {
    Header: "Price Per Year",
    accessor: "PricePerYear",
  },
  {
    Header: "",
    accessor: "View",
  },
];
const pricingPlanExportHeader = [
  {
    Header: "Game", // Display text can be anything
    accessor: "Game",
  },
  {
    Header: "Plan Name",
    accessor: "PlanName",
  },
  {
    Header: "Plan Description",
    accessor: "PlanDescription",
  },
  {
    Header: "Hosted Games",
    accessor: "HostedGames",
  },
  {
    Header: "Extra Hosted Games",
    accessor: "ExtraHostedGames",
  },
  {
    Header: "Price Per Month",
    accessor: "PricePerMonth",
  },
  {
    Header: "Price Per Year",
    accessor: "PricePerYear",
  },
];

const roleTableHeader = [
  {
    Header: "Role Name",
    accessor: "RoleName",
  },
  {
    Header: "Role  Description",
    accessor: "RoleDescription",
  },
  {
    Header: "",
    accessor: "EditOrView",
  },
];

const roleReportTableHeader = [
  {
    Header: "Organization",
    accessor: "Organization",
  },
  {
    Header: "Community",
    accessor: "Community",
  },
  {
    Header: "Role Name",
    accessor: "RoleName",
  },
  {
    Header: "First Name",
    accessor: "FirstName",
  },
  {
    Header: "Last Name",
    accessor: "LastName",
  },
];

const gameReportTableHeader = [
  {
    Header: "Game Name", // Display text can be anything
    accessor: "Name",
  },
  {
    Header: "Game Description",
    accessor: "Description",
  },
];
export {
  OrganizationTableHeader,
  OrganizationReportTableHeader,
  organizationExportTableHeader,
  communityTableHeader,
  LicenseTableHeader,
  licenseReportTableHeader,
  licenseExportTableHeader,
  personTableHeader,
  personReportTableHeader,
  personExportTableHeader,
  gameScheduleTableHeader,
  gameScheduleReportHeader,
  gameScheduleExportHeader,
  attendanceTableHeader,
  puzzleTableHeader,
  puzzleExportTableHeader,
  puzzleReportTableHeader,
  showPlayerTableHeader,
  gameDataTableHeader,
  puzzleGameTableHeader,
  gameTableHeader,
  licenseDataTableHeader,
  pricingPlanTableHeader,
  pricingPlanReportHeader,
  pricingPlanExportHeader,
  roleTableHeader,
  roleReportTableHeader,
  gameReportTableHeader,
  playerDetailTableHeader
}