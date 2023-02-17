import axios from "axios";

const DEV_URL = "http://localhost:8088/api";

const PRODUCTION_URL = "https://trackiha.my.p4d.click/api";

export default axios.create({ baseURL: DEV_URL });

export const BASE_PATH = "http://localhost:8088";
export const PRODUCUTION_BASE_PATh = "https://trackiha.my.p4d.click";
