import APIService from "./apiService";
import APIPaths from "../lib/apiPaths";
import Constants from "../lib/Constants";

let AmazonCognitoIdentity = require("amazon-cognito-identity-js");
// import AmazonCognitoIdentity from "amazon-cognito-identity-js";
import Constant from "../lib/Constants";

// TODO: Use standard import here

async function cognitoLogin({ emailId, password }): Promise<any> {
  try {
    let authenticationData = {
      Username: emailId,
      Password: password,
      // Password: "Test@123",
    };
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    let poolData = {
      UserPoolId: Constant.UserPoolId,
      ClientId: Constant.ClientId,
      // UserPoolId: "ap-south-1_cigt0qhmn",
      // ClientId: "4bj3atu4kmdkupplu05qhbova4",
    };
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    let userData = {
      Username: emailId,
      Pool: userPool,
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          
          const cognitoAccessDetails = result.getAccessToken();          
          const accessToken = cognitoAccessDetails.getJwtToken();
          const tokenExpiryTime = cognitoAccessDetails.payload.exp;          
          
          const cognitoIdDetails = result.getIdToken();
          const idToken = cognitoIdDetails.getJwtToken();
        
          resolve({ accessToken, tokenExpiryTime, idToken,  });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  } catch (err) {
    throw err;
  }
}

async function setUserPassword({
  userName,
  tempPassword,
  newUserPassowrd,
}): Promise<any> {
  try {
    let authenticationData = {
      Username: userName,
      Password: tempPassword,
    };
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    let poolData = {
      UserPoolId: Constant.UserPoolId,
      ClientId: Constant.ClientId,
      // UserPoolId: "ap-south-1_cigt0qhmn",
      // ClientId: "4bj3atu4kmdkupplu05qhbova4",
    };
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    let userData = {
      Username: userName,
      Pool: userPool,
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          console.log("On verification success");
          // let accessToken = result.getAccessToken().getJwtToken();
          resolve(true);
        },
        onFailure: (err) => {
          console.log("On verification failure");
          reject(err);
        },
        newPasswordRequired: function (userAttributes, requiredAttributes) {
          // Used plain JS function to access "this"
          console.log("newPasswordRequired call back called");
          delete userAttributes.email_verified;
          cognitoUser.completeNewPasswordChallenge(
            newUserPassowrd,
            userAttributes,
            this
          );
        },
      });
    });
  } catch (err) {
    throw err;
  }
}

async function forgotPassword({ email }): Promise<any> {
  try {
    let poolData = {
      UserPoolId: Constant.UserPoolId,
      ClientId: Constant.ClientId,
    };
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    let userData = {
      Username: email,
      Pool: userPool,
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword(
        {
          onSuccess: function (data) {
            console.log("successfully initiated reset password request");
            resolve(true);
          },
          onFailure: function (err) {
            console.log("Password reset request failed");
            reject(err);
          },
        },
        {
          email: email,
        }
      );
    });
  } catch (err) {
    throw err;
  }
}

async function resetPassword({
  email,
  verificationCode,
  newPassword,
}): Promise<any> {
  try {
    let poolData = {
      UserPoolId: Constant.UserPoolId,
      ClientId: Constant.ClientId,
    };
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    let userData = {
      Username: email,
      Pool: userPool,
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess() {
          console.log("Password confirmed!");
          resolve(true);
        },
        onFailure(err) {
          console.log("Password not confirmed!");
          reject(err);
        },
      });
    });
  } catch (err) {
    throw err;
  }
}

async function getDetail(): Promise<any> {

  try {
    const { ResponseCodes } = Constants;
    const payload = {};
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};
    const response = await APIService.makeGetRequest({
      path: APIPaths.getDetail,
      payload,
      headers
    });

    if (response.responseCode === ResponseCodes.Success) { 
      localStorage.setItem("permissionToken", response.responseData.permission_token);
      return response.responseData;
    }
    else throw new Error(response.responseMessage);
  } catch (err) {
    throw err;
  }
}


export { cognitoLogin, setUserPassword, forgotPassword, resetPassword,getDetail };
