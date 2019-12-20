// Wrapper around fetch() to make it nicer
import fetch from "isomorphic-unfetch";
import Cookies from "js-cookie";
import qs from "qs";
import { USER_COOKIE } from "lib/useLoggedIn";

interface RequestParams {
  body?: object;
  method?: string;
}

let API = process.env.MATHIS_API;

// Override API if on the development domain
if (!API && process.browser) {
  if (/(?:dev\.bkk\.bar|bkk-.*\.now.sh)/.test(location.origin)) {
    API = "https://mathis-development.herokuapp.com/api/v1";
  } else if (!API) {
    API = "https://mathis-prod.herokuapp.com/api/v1"
  }
}

async function request(
  endpoint: string,
  params: RequestParams = {}
): Promise<Response> {
  const token = Cookies.get(USER_COOKIE);
  const apiRequest = `${API}/${endpoint}`;

  const response = await fetch(apiRequest, {
    body: params.body ? JSON.stringify(params.body) : undefined,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      "Content-Type": "application/json"
    },
    method: params.method
  });

  return response;
}

export default request;
