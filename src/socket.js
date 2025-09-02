import { io } from "socket.io-client";
import { apiBaseUrl } from "../src/settings/index";

const socket = io(apiBaseUrl);

export default socket;
