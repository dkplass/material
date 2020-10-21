import request from "../https";

const users = {
  detail() {
    return request("post", "/Token/GetMember");
  }
};

export default users;
