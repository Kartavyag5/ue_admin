import APIService from "./apiService";
import APIPaths from "../lib/apiPaths";
import Constants from "../lib/Constants";

async function getUserList({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.userList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success){
      response.responseData.user_list.sort((a, b) => a.last_name+a.first_name > b.last_name+b.first_name && 1 || -1)

      return response.responseData;}
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function userSearch({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.userSearch,
      payload,
      isUserSearch : true
    });

    if (response.responseCode === ResponseCodes.userNotExists)
      return response.responseCode;
    // else throw new Error(response.responseCode === ResponseCodes.userNotExists ? "User Does not exists" : response.responseMessage);
  } catch (err) {
    throw err;
  }
}
async function getHostList({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.hostList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success){

      return response.responseData;}
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function getPersonsReportList({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.getPersonsList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

export { getUserList, getPersonsReportList, userSearch, getHostList };

async function addOrEditUser({ reqData }, userId): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = { ...reqData };
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };

    const response = await APIService.makePostRequest({
      path:
        typeof userId !== "undefined" ? APIPaths.userEdit : APIPaths.userAdd,
      payload,
      headers,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

export { addOrEditUser };
