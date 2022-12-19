const Constants = Object.freeze({
  AppTitle: "Utopia Experiences Care Community",
  UserPoolId: "us-east-2_H3rUfcn9E",
  ClientId: "882q77pu733tc2nup6jvvv8hh",
  GameURL: "",
  rootPath: "/",
  ZoomDummyUrl:
    "",
  BuildID: "00.04.14",
  // API_BASE_PATH: "https://api.juegogames.com/SPINTOPIA_DEV/",
  API_BASE_PATH: "https://api.utopiaexperiences.cloud/PROD-V1/",
  ResponseCodes: {
    Success: 200,
    UserExist:210,
    userNotExists: 1004
  },
  UE_Business_Path: "https://business.utopiaexperiences.cloud", //TODO : change url to https://business.utopiaexperiences.cloud in production
  User_Training_Path: "https://www.training.utopiaexperiences.cloud/",
  contactUsLink: 'https://www.utopiaexperiences.net/contact',
  helpLink: 'https://ue-help-documentation.s3.us-east-2.amazonaws.com/Admin+User+Manual.pdf',
  bookHostLink: 'https://hostapp.utopiaexperiences.cloud/',
  SaveFormAlertMsgData: {
    message: `You left the "Add/Edit data" screen without saving. Is that what you wish to do?`,
    subMessage: `To return to the data screen and save changes, click "No". To exit without saving, click "Yes"`,
  },
  MandatoryFieldAlertMsgData: {
    errorMessageOne: `Mentioned field is mandatory. Please fill before saving`,
    errorMessageTwo: `Mentioned fields are mandatory. Please fill before saving`,
  },
  rateHostAlertMsg: {
    message1: `You have not yet rated the host of this game. Would you like to rate the host before saving your input?`,
    message2: `You have already rated the host!`,
  },
  contactSupportSuccess: {
    message: "Thank you for contacting Utopia Experiences Support. We truly appreciate the opportunity to serve you. A member from our team will review your message and get back to you within 48 hours."
  },
  deleteAlertMsg: {
    message: "Are you sure you want to delete the data?"
  },
  invalidDateAlert: {
    message: "Please fill the date in MM/DD/YYYY format"
  },
  pageExitAlert: {
    message: "You must save game data before you leave the page"
  },
  filterDropDownLimit: 10,
  tokenExpiryErrorCodes: [202, 2002, 2003, 2004],
  userListType: {
    dropDown: 1,
    table: 2
  },
  queryType: {
    dropDown: 1,
    tableView: 2,
    detailView: 3,
    reportTableView: 4,
    reportDetailView: 5
  },
  rolePermissions: {
    rolesNotAllowedToAddNewSchedules: ["FAMILY_OR_FRIEND", "RESIDENT", "GAME_HOST"],
    rolesNotAllowedToAddOrEditLicense: ["ORGANIZATION_ADMIN", "COMMUNITY_ADMIN"]
  }
});

export default Constants;
