import APIService from "./apiService";
import APIPaths from "../lib/apiPaths";
import Constants from "../lib/Constants";

async function getGameList({ reqData }): Promise<any> {
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

async function addEditGameData({ reqData, actionType }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = { ...reqData };
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    const response = await APIService.makePostRequest({
      path: actionType === "ADD" ? APIPaths.gameAdd : APIPaths.gameEdit,
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

async function getPricingPlanList({ reqData }): Promise<any> {
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

async function addEditPricingPlanData({ reqData, actionType }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = { ...reqData };
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    const response = await APIService.makePostRequest({
      path:
        actionType === "ADD"
          ? APIPaths.pricingPlanAdd
          : APIPaths.pricingPlanEdit,
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

export {
  getGameList,
  addEditGameData,
  getPricingPlanList,
  addEditPricingPlanData,
};
