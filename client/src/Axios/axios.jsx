import axios from "axios"

const BASE_URL = 'http://localhost:5000';

//Create an Axios instance with a default base url and withCredentials set to true, to send refresh tokens to the server
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

/**
 * Interceptor for request sent using the axios instance
 * Retrieves the access token from session storage
 * Include the token on the header for every request made using the axios instance
 */
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = sessionStorage.getItem("accessToken");
        console.log("Interceptor");
        //console.log("Access Token: ", accessToken);
        if (accessToken) {
            //console.log("I have Access Token");
            config.headers['Authorization'] = `Bearer ${accessToken}`;
            //console.log("Config Headers: ", config.headers);
            //console.log("Authorization: ", config.headers.Authorization.split(' ')[1]);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Interceptor for the response received by using the axios instance
 * Check if error received is a 403 for expired access token
 * Send a request to the refresh access token endpoint to refresh access token
 * Store new access token into session storage
 * Resend the original request along with the new access token in the header
 */
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log("Error Response: ", error.response);
            //console.log("ACCESS TOKEN EXPIRED!");
            try {
                //console.log("Refresh Token");
                const response = await axios.post(`${BASE_URL}/user/refreshToken`, {}, {withCredentials: true});
                const {accessToken} = response.data;
                //console.log("INTERCEPTOR ACCESS TOKEN: ", accessToken);
                if (response) {
                    //Update access token
                    sessionStorage.setItem("accessToken", accessToken);
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch(error) {
                //console.log(error)
                //Return error if unable to refresh access token (Refresh token is expired, invalid, or not found)
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;