import APIService from "./apiService";
import APIPaths from "../lib/apiPaths";
import Constants from "../lib/Constants";



async function gameSchPuzzlecategoryList({ reqData }): Promise<any> {

  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.gameSchedulePuzzleCategoryList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function gamesPlayedList({ reqData }): Promise<any> {

  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.getPuzzlePlayedList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}


async function getPlayerDetails({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };
    const response = await APIService.makeGetRequest({
      path: APIPaths.gamePlayerDetails,
      payload,
    });
    if (response.responseCode === ResponseCodes.Success)

      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}


async function addOrEditSchedule({ reqData }, scheduleId): Promise<any> {

  try {
    const { ResponseCodes } = Constants;
    const payload = { ...reqData };
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };

    const response = await APIService.makePostRequest({
      path: (typeof scheduleId !== "undefined") ? APIPaths.gameSCheduleEdit : APIPaths.gameScheduleAdd,
      payload,
      headers
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else if(response.responseCode === ResponseCodes.UserExist)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}



async function getCustomSpinnerSpace({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };
    const response = await APIService.makeGetRequest({
      path: APIPaths.customSpinnerList,
      payload,
    });
    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}


async function editGameSchedule({ reqData }): Promise<any> {

  try {
    const { ResponseCodes } = Constants;
    const payload = { ...reqData };
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };

    const response = await APIService.makePostRequest({
      path: APIPaths.gameSCheduleEdit,
      payload,
      headers
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function getGameSchedules({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };
    const response = await APIService.makeGetRequest({
      path: APIPaths.gameScheduleList,
      payload,
    });
    if (response.responseCode === ResponseCodes.Success)

      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function getAttendancelist({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };
    const response = await APIService.makeGetRequest({
      path: APIPaths.attendanceList,
      payload,
    });
    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function recordAttendance({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };
    const response = await APIService.makePostRequest({
      path: APIPaths.recordAttendance,
      payload,
    });
    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function rateHost({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };
    const response = await APIService.makePostRequest({
      path: APIPaths.rateHost,
      payload,
    });
    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}


async function getGameURL({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };
    const response = await APIService.makePostRequest({
      path: APIPaths.startGame,
      payload,
    });
    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function getZoomLink({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };
    const response = await APIService.makeGetRequest({
      path: APIPaths.startMeeting,
      payload,
    });
    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function getParticipantType({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };
    const response = await APIService.makeGetRequest({
      path: APIPaths.participantTypeList,
      payload,
    });
    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function getRateHostDetails({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };
    const response = await APIService.makeGetRequest({
      path: APIPaths.rateHostDetails,
      payload,
    });
    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

export { editGameSchedule, 
        gameSchPuzzlecategoryList,
        getGameSchedules,
        addOrEditSchedule, 
        gamesPlayedList, 
        getPlayerDetails, 
        getCustomSpinnerSpace,
        getAttendancelist,
        recordAttendance,
        rateHost,
        getGameURL,
        getZoomLink,
        getParticipantType,
        getRateHostDetails
       };


