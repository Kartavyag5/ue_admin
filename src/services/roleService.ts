import APIService from "./apiService";
import APIPaths from "../lib/apiPaths";
import Constants from "../lib/Constants";

async function getRoleList({reqData}): Promise<any> {  
 
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.roleList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

export { getRoleList };

async function addOrEditRole({reqData}, roleId): Promise<any> {

  try {
    const { ResponseCodes } = Constants;
    const payload = {...reqData};
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};

    const response = await APIService.makePostRequest({
      path:  (typeof roleId !== "undefined")  ? APIPaths.roleEdit: APIPaths.roleAdd,
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

export { addOrEditRole};


async function getRoleReport({reqData}): Promise<any> {  
 
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};


    const response = await APIService.makeGetRequest({
      path: APIPaths.roleReport,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

export {getRoleReport};
