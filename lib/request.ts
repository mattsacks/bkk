// Wrapper around fetch() to make it nicer
import fetch from "isomorphic-unfetch";
import Cookies from "js-cookie";
import qs from "qs";
import { USER_COOKIE } from "lib/useLoggedIn";

interface RequestParams {
  body?: object;
  method?: string;
}

let userQueryString = undefined;

let API = process.env.MATHIS_API;

// Override API if on the development domain
if (location.origin.includes("dev.bkk.bar")) {
  API = "https://mathis-development.herokuapp.com/api/v1";
} else if (!API) {
  API = "https://mathis-prod.herokuapp.com/api/v1"
}

async function request(
  endpoint: string,
  params: RequestParams = {}
): Promise<Response> {
  // FIXME this is gross and bad
  if (userQueryString == undefined) {
    const usercookie = Cookies.get(USER_COOKIE);

    if (usercookie !== undefined) {
      userQueryString = qs.stringify(JSON.parse(usercookie));
    }
  }

  const apiRequest = `${API}/${endpoint}?${userQueryString || ""}`;

  const response = await fetch(apiRequest, {
    body: params.body ? JSON.stringify(params.body) : undefined,
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    method: params.method
  });

  return response;
}

export default request;
