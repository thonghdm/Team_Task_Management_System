import axios from "axios";

export const apiGetOne = (accesstoken) =>
  new Promise(async (resolve, reject) => {
    try {
      console.log("AccessToken:", accesstoken); // Log để kiểm tra
      let response = await axios({
        method: "get",
        url: "http://localhost:5000/api/user/get-one",
        headers: {
          authorization: `Bearer ${accesstoken}`,
        },
        withCredentials: true,
      });
      resolve(response);
    } catch (error) {
      console.log("API Error:", error); // Log để kiểm tra
      reject(error);
    }
  });
export const apiupdateUser = (accesstoken, data) =>
  new Promise(async (resolve, reject) => {
    try {
      let response = await axios({
        method: "put",
        url: "http://localhost:5000/api/user/update-user",
        headers: {
          authorization: `Bearer ${accesstoken}`,
        },
        data: data,
        withCredentials: true, // Set withCredentials here
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
