import axios from "axios";

export default axios.create({
  baseURL: import.meta.env.VITE_XMTP_SERVER_URL || "http://localhost:3001/api/v1",
});
