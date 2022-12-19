import Constants from "../../lib/Constants";

const SidebarData = [
  {
    page: "SCHEDULE",
    to: "/game-schedules",
    name: "Game Schedule",
    exact: false,
    subNav: [],
    isExternal: false

  },
  {
    page: "ORGANIZATION",
    to: "/organization",
    name: "Organization/Community Maintenance",
    exact: false,
    subNav: [],
    isExternal: false

  },
  {
    page: "PERSONS",
    to: "/persons-data",
    name: "Person Data Maintenance",
    exact: false,
    subNav: [],
    isExternal: false

  },
  {
    page: "ADMIN",
    to: "/administrative-data",
    name: "Administrative Data Maintenance",
    exact: false,
    subNav: [],
    isExternal: false

  },
  {
    page: "GAME",
    to: "/game-data",
    name: "Game Data Maintenance",
    exact: false,
    subNav: [],
    isExternal: false

  },
  {
    page: "UEBUSINESS",
    to: Constants.UE_Business_Path,
    name: "UE Business",
    exact: false,
    subNav: [],
    isExternal: false

  },
  {
    page: "USERTRAINING",
    to: Constants.User_Training_Path,
    name: "User Training",
    exact: false,
    subNav: [],
    isExternal: false

  },
  {
    page: "REPORTS",
    to: "/reports/organization",
    name: "Reports",
    exact: false,
    subNav: [
      {
        page: "ORGANIZATION_REPORT",
        to: "/reports/organization",
        name: "Organization/Community Reports",
        exact: false,
      },
      {
        page: "PERSONS_REPORT",
        to: "/reports/persons",
        name: "Person Reports",
        exact: false,
      },

      {
        page: "LICENSE_REPORT",
        to: "/reports/license",
        name: "License Reports",
        exact: false,
      },
      {
        page: "PUZZLES_REPORT",
        to: "/reports/puzzles",
        name: "Puzzle Reports",
        exact: false,
      },
      {
        page: "GAMES_REPORT",
        to: "/reports/games",
        name: "Game Reports",
        exact: false,
      },
      {
        page: "PRICING_REPORT",
        to: "/reports/pricing-plans",
        name: "Pricing Plan Reports",
        exact: false,
      },
      {
        page: "ROLES_REPORT",
        to: "/reports/roles",
        name: "Role Reports",
        exact: false,
      },
      {
        page: "SCHEDULE_REPORT",
        to: "/reports/schedule",
        name: "Game Scheduling Reports",
        exact: false,
      },
    ],
  },
  {
    page: "CONTACT_SUPPORT",
    to: "/contact-support",
    name: "Contact Support",
    exact: false,
    subNav: [],
  },
];

const rolePermissions = {
  SUPER_ADMIN: {
    mainPages: ["ORGANIZATION", "PERSONS", "ADMIN", "GAME", "SCHEDULE", "UEBUSINESS","USERTRAINING", "REPORTS", "CONTACT_SUPPORT"],
    reports: ["ORGANIZATION_REPORT","PERSONS_REPORT","LICENSE_REPORT","PUZZLES_REPORT","GAMES_REPORT","PRICING_REPORT","ROLES_REPORT","SCHEDULE_REPORT"]
  },
  UE_CORP_ADMIN: {
    mainPages: ["ORGANIZATION", "PERSONS", "ADMIN", "GAME", "SCHEDULE", "UEBUSINESS","USERTRAINING", "REPORTS", "CONTACT_SUPPORT"],
    reports: ["ORGANIZATION_REPORT","PERSONS_REPORT","LICENSE_REPORT","PUZZLES_REPORT","GAMES_REPORT","PRICING_REPORT","ROLES_REPORT","SCHEDULE_REPORT"]
  },
  ORGANIZATION_ADMIN: {
    mainPages: ["ORGANIZATION", "PERSONS", "SCHEDULE","USERTRAINING", "REPORTS", "CONTACT_SUPPORT"],
    reports: ["ORGANIZATION_REPORT","PERSONS_REPORT","ROLES_REPORT","SCHEDULE_REPORT"]
  },
  COMMUNITY_ADMIN: {
    mainPages: ["ORGANIZATION", "PERSONS", "SCHEDULE","USERTRAINING", "REPORTS", "CONTACT_SUPPORT"],
    reports: ["ORGANIZATION_REPORT","PERSONS_REPORT","ROLES_REPORT","SCHEDULE_REPORT"]
  },
  GAME_HOST: {
    mainPages: ["SCHEDULE", "USERTRAINING", "REPORTS", "CONTACT_SUPPORT"],
    reports: ["SCHEDULE_REPORT"]
  },
  FAMILY_OR_FRIEND: {
    mainPages: ["SCHEDULE","USERTRAINING", "REPORTS", "CONTACT_SUPPORT"],
    reports: ["SCHEDULE_REPORT"]
  },
  RESIDENT: {
    mainPages: ["SCHEDULE","USERTRAINING", "REPORTS", "CONTACT_SUPPORT"],
    reports: ["SCHEDULE_REPORT"]
  },
};

const getRoleAuthorizedPages = (role) => {
  const rolePermissionDetails = rolePermissions[role]
  if (rolePermissionDetails) {
    const SideBarDataForFilter = SidebarData.map((item) => {
      const subNav = item.subNav.map((sub) => ({...sub}))
      return {...item, subNav}
    } )
    const filteredSideBarData = SideBarDataForFilter.filter((pageDetails) => rolePermissionDetails.mainPages.includes(pageDetails.page))
    filteredSideBarData.forEach((pageDetails) => pageDetails.subNav = pageDetails.subNav.filter(report => rolePermissionDetails.reports.includes(report.page))) // filtering reports
    return filteredSideBarData
  } else {
    // Invalid role permission
  }
};

export { getRoleAuthorizedPages, SidebarData }
