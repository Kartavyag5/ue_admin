import APIPaths from "../lib/apiPaths";
import Constants from "../lib/Constants";
import APIService from "./apiService";

async function contactSupport({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = { ...reqData };
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };

    const response = await APIService.makePostRequest({
      path: APIPaths.contactSupport,
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

async function contactCategoryList(): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {};
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };

    const response = await APIService.makeGetRequest({
      path: APIPaths.contactCategory,
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

export { contactSupport ,contactCategoryList};
