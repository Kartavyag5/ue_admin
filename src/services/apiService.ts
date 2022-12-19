import Constants from "../lib/Constants";
import { Cookies } from "react-cookie";
import { domain } from "../../next.config";

class APIService {
  constructor() {}

  public static instance;
  public static cookieInstance;

  public static getAPIServiceInstance(): APIService {
    if (APIService.instance) return APIService.instance;
    APIService.instance = new APIService();
    return APIService.instance;
  }

  getItem(data) {
    return localStorage.getItem(data);
  }

  getHeader(header) {
    if (!this.getItem("permissionToken")) delete header["permission_token"];
    return header;
  }

  getCookieValue({ cookieKey }) {
    if (!APIService.cookieInstance) APIService.cookieInstance = new Cookies();
    return APIService.cookieInstance.get(cookieKey);
  }

  makePostRequest({ path, payload, headers = {} }): Promise<any> {
    const requestOption = {
      method: "POST",
      headers: {
        ...headers,
        access_token: this.getCookieValue({ cookieKey: "accesstoken" }),
        permission_token: this.getItem("permissionToken"),
      },
      body: new URLSearchParams(payload).toString(),
    };
    if(this.getCookieValue({ cookieKey: "accesstoken" })){

    return fetch(Constants.API_BASE_PATH + path, requestOption)
      .then(async(response) => {
        const jsonResponse = await response.json();
        if(Constants.tokenExpiryErrorCodes.includes(jsonResponse.responseCode)){
          new Cookies().remove("accesstoken", {domain: domain});
          new Cookies().remove("idtoken", {domain: domain});
          sessionStorage.removeItem("accesstoken");
          localStorage.clear()
        }
        return jsonResponse;
      })
      .catch((err) => {
        throw new Error(err);
      });

    }
    else throw new Error("Session Terminated. Please Login again.")

  }

   makeGetRequest({ path, payload, headers = {}, isUserSearch = false }): Promise<any> {
    let data = "";
    for (let key in payload) {
      data += key + "=" + payload[key] + "&";
    }

    let header = {
      ...headers,
      access_token: this.getCookieValue({ cookieKey: "accesstoken" }),
      permission_token: this.getItem("permissionToken"),
    };
    let requestOption = {
      method: "GET",
      headers: this.getHeader(header),
    };    

    if(header.access_token || isUserSearch){ // TODO: userSearch api does not required accessToken
      return fetch(Constants.API_BASE_PATH + path + "?" + data, requestOption)
        .then(async(response) =>  {  
          const jsonResponse = await response.json();
          if(Constants.tokenExpiryErrorCodes.includes(jsonResponse.responseCode)){
            new Cookies().remove("accesstoken", {domain: domain});
            new Cookies().remove("idtoken", {domain: domain});            
            sessionStorage.removeItem("accesstoken");
            localStorage.clear()
          }
          return jsonResponse;
        })
        .catch((err) => {
          throw new Error(err);
        });}
    else throw new Error("Session Terminated. Please Login again.")
  }
}

const apiServiceInstance = APIService.getAPIServiceInstance();
export default apiServiceInstance;

