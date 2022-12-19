import APIService from "./apiService";
import APIPaths from "../lib/apiPaths";
import Constants from "../lib/Constants";

async function getCommunityList({reqData}): Promise<any> {  
 
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.communityList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function addCommunity({reqData}): Promise<any> {

  try {
    const { ResponseCodes } = Constants;
    const payload = {...reqData};
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};

    const response = await APIService.makePostRequest({
      path: APIPaths.communityAdd,
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

async function editCommunity({reqData}): Promise<any> {

  try {
    const { ResponseCodes } = Constants;
    const payload = {...reqData};
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};

    const response = await APIService.makePostRequest({
      path: APIPaths.communityEdit,
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

async function getAddressList({reqData}): Promise<any> {  
 
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.addressList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function addAddress({reqData}): Promise<any> {

  try {
    const { ResponseCodes } = Constants;
    const payload = {...reqData};
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};

    const response = await APIService.makePostRequest({
      path: APIPaths.addressAdd,
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

async function getCountryList({reqData}): Promise<any> {  
 
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.countryList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function getStateList({reqData}): Promise<any> {  
 
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.stateList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function geTimezoneList({reqData}): Promise<any> {  
 
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.timezoneList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}



export { getCommunityList, addCommunity, editCommunity, getAddressList, getCountryList, getStateList, geTimezoneList, addAddress };
