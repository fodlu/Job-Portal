import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_BASEURL || "https://job-portal-server-eta-sage.vercel.app"
})

API.interceptors.request.use((req) => {
    const user = JSON.parse(localStorage.getItem("jobportal_user"))

    if(user?.token) {
        req.headers.Authorization = `Bearer ${user.token}`
    }
    return req;

})

export default API