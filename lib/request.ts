// Wrapper around fetch() to make it nicer
import fetch from "isomorphic-unfetch";
import Cookies from "js-cookie";
import qs from "qs";

import { USER_COOKIE } from "@/lib/types";

interface RequestParams {
  body?: Record<string, unknown>;
  method?: string;
}

interface RequestOptions {
  token?: string;
}

const API =
  process.env.MATHIS_API ?? "https://mathis-prod.herokuapp.com/api/v1";

async function request<T>(
  endpoint: string,
  params: RequestParams = {},
  options: RequestOptions = {}
): Promise<T> {
  const token = options.token || Cookies.get(USER_COOKIE);

  const apiRequest = `${API}${endpoint}`;

  const response = await fetch(apiRequest, {
    body: params.body ? JSON.stringify(params.body) : undefined,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      "Content-Type": "application/json"
    },
    method: params.method
  });

  if (!response.ok) {
    throw response.statusText;
  }

  return await response.json();
}

export async function fetcher<T>(endpoint: string): Promise<T> {
  return (await request(endpoint)) as T;
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
