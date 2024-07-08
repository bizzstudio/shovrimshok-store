import requests from "./httpServices";

const StatusService = {
  getStatusByName: async (name) => {
    return requests.get("/status/name/" + name);
  },
};

export default StatusService;
