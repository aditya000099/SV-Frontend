import { io } from "socket.io-client";

const URL = `${process.env.REACT_APP_BACKEND_URL}`;
// const URL = "https://video-call-server-gm7i.onrender.com";

export const socket = io(URL);
export const navbarBrand = "StudyVerse";
