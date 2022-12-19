import APIService from "./apiService";
import APIPaths from "../lib/apiPaths";
import Constants from "../lib/Constants";

async function licenseList({reqData}): Promise<any> {  
 
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.licenseList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function addLicense({reqData}): Promise<any> {

  try {
    const { ResponseCodes } = Constants;
    const payload = {...reqData};
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};

    const response = await APIService.makePostRequest({
      path: APIPaths.licenseAdd,
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

async function editLicense({reqData}): Promise<any> {

  try {
    const { ResponseCodes } = Constants;
    const payload = {...reqData};
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};

    const response = await APIService.makePostRequest({
      path: APIPaths.licenseEdit,
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

async function getGameList({reqData}): Promise<any> {  
 
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.gameList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function getPricingPlanList({reqData}): Promise<any> {  
 
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.pricingPlanList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function getOrgCommPayList({reqData}): Promise<any> {  
 
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.orgCommunityPay,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function getLicenseListReport({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.getLicenseList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

export { licenseList, addLicense, editLicense, getGameList, getPricingPlanList, getOrgCommPayList,getLicenseListReport };
