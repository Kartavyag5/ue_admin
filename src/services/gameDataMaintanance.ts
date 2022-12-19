import APIService from "./apiService";
import APIPaths from "../lib/apiPaths";
import Constants from "../lib/Constants";

async function puzzlecategoryList({reqData}): Promise<any> {  
 
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.puzzlecategoryList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function puzzleAddCategory({reqData}): Promise<any> {

  try {
    const { ResponseCodes } = Constants;
    const payload = {...reqData};
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};

    const response = await APIService.makePostRequest({
      path: APIPaths.puzzleAddCategory,
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

async function puzzleEditCategory({reqData}): Promise<any> {

  try {
    const { ResponseCodes } = Constants;
    const payload = {...reqData};
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};

    const response = await APIService.makePostRequest({
      path: APIPaths.puzzleEditCategory,
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

async function puzzleList({reqData}): Promise<any> {  
 
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.puzzleList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function puzzleAdd({reqData}): Promise<any> {

  try {
    const { ResponseCodes } = Constants;
    const payload = {...reqData};
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};

    const response = await APIService.makePostRequest({
      path: APIPaths.puzzleAdd,
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

async function puzzleEdit({reqData}): Promise<any> {

  try {
    const { ResponseCodes } = Constants;
    const payload = {...reqData};
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};

    const response = await APIService.makePostRequest({
      path: APIPaths.puzzleEdit,
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

async function gameLevelList({reqData}): Promise<any> {  
 
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.gameLevelList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

async function getReportPuzzleList({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };

    const response = await APIService.makeGetRequest({
      path: APIPaths.getPuzzleList,
      payload,
    });

    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

export {
  puzzlecategoryList,
  puzzleAddCategory,
  puzzleEditCategory,
  puzzleList,
  puzzleAdd,
  puzzleEdit,
  gameLevelList,
  getReportPuzzleList,
};
