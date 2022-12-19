import APIService from "./apiService";
import APIPaths from "../lib/apiPaths";
import Constants from "../lib/Constants";
import { remove_duplicates_from_list } from "../helper/removeDuplicates";

async function getOrganization({ reqData }): Promise<any> {
  try {
    const { ResponseCodes } = Constants;
    const payload = {
      ...reqData,
    };
    const response = await APIService.makeGetRequest({
      path: APIPaths.organizationListGet,
      payload,
    });
    if (response.responseCode === ResponseCodes.Success)
      return response.responseData;
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}

export { getOrganization };

async function addOrEditOrganization({reqData}, organizationId): Promise<any> {

  try {
    const { ResponseCodes } = Constants;
    const payload = {...reqData};
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};

    const response = await APIService.makePostRequest({
      path:  (typeof organizationId !== "undefined")  ? APIPaths.organizationEdit: APIPaths.organizationAdd,
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

export { addOrEditOrganization};
