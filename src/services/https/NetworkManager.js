import axios from 'axios';
import apiUrl from './apiUrl';

const appAxiosInstance = axios.create({
  baseURL: apiUrl.BASE_URL,
})
//request interceptor that will add auth token to every request
appAxiosInstance.interceptors.request.use(function (config) {
  //get user token and add it to header config
  // const token = UserStore.getAccessToken();
  // if(token){
  //     config.headers.Authorization =  `Bearer ${token}`;
  // }
  return config;
});
//Any Request to Server
export function AppWebRequest(endUrl, method, config) {
  return new Promise((resolve, reject) => {
    const defaultConfig = {
      url: endUrl,
      method: method || 'get',
      baseURL: apiUrl.BASE_URL,
    };
    const finalConfig = Object.assign(defaultConfig, config || {});
    appAxiosInstance(finalConfig)
      .then((response) => {
        console.log('response', response);
        resolve(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log('error', error.response);
          if (error.response.status === 401) {
            // User session has eded so logout the user here
            // message.error("Your session is invalid. Please log in again");
            // Auth.logOut();
          }
          var errorObj = {};
          var err = error.response.data;
          if (typeof err == 'object') {
            err.message = calculateErrorMessageFromResponse(err);
            errorObj = {...err};
          } else if (typeof err == 'string') {
            errorObj = {
              message: err,
            };
          }
          reject(err);
        } else if (error.request) {
          const err = new Error('Can not make request to server!');
          reject(err);
        } else {
          error.message = 'Unexpected error occured!';
          reject(error);
        }
      });
  });
}

function calculateErrorMessageFromResponse(error) {
  var error_message;
  if (typeof error.message === 'string') {
    error_message = error.message;
  } else if (
    Array.isArray(error.message) &&
    Array.isArray(error.message[0].messages)
  ) {
    error_message = error.message[0].messages[0].message;
  } else {
    error_message = error.error || 'Unexpected error occured';
  }
  return error_message;
}
