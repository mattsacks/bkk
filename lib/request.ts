// Wrapper around fetch() to make it nicer
import fetch from "isomorphic-unfetch";
import Cookies from "js-cookie";
import qs from "qs";
import { USER_COOKIE } from "lib/types";

interface RequestParams {
  body?: object;
  method?: string;
}

let API = process.env.MATHIS_API;

// Override API if on the development domain
if (process.browser) {
  if (
    /(?:dev\.bkk\.bar|bkk-.*\.now.sh)/.test(location.origin) ||
    process.env.NODE_ENV !== "production"
  ) {
    API = "https://mathis-development.herokuapp.com/api/v1";
  } else if (!API) {
    API = "https://mathis-prod.herokuapp.com/api/v1";
  }
}

async function request(
  endpoint: string,
  params: RequestParams = {}
): Promise<unknown> {
  const token = Cookies.get(USER_COOKIE);
  const apiRequest = `${API}${endpoint}`;

  const response = await fetch(apiRequest, {
    body: params.body ? JSON.stringify(params.body) : undefined,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Accepts: "application/json",
      "Content-Type": "application/json"
    },
    method: params.method
  });

  if (!response.ok) {
    throw response.statusText;
  }

  return await response.json();
}

export async function fetcher(endpoint: string): Promise<unknown> {
  return await request(endpoint);
}

export async function fetchGenius(
  endpoint: string,
  params: object = {}
): Promise<unknown> {
  const queryParams = qs.stringify({
    access_token: process.env.GENIUS_API_KEY,
    ...params
  });

  const response = await fetch(
    `https://api.genius.com${endpoint}?${queryParams}`,
    {
      headers: {
        Accept: "application/json"
      }
    }
  );

  if (!response.ok) {
    throw response.statusText;
  }

  return await response.json();
}

export default request;
