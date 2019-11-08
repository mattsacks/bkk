// Wrapper around fetch() to make it nicer
import fetch from "isomorphic-unfetch";

interface RequestParams {
  body?: object;
  method?: string;
}

const API = process.env.MATHIS_API || "https://mathis-prod.herokuapp.com/api/v1";

async function request(
  endpoint: string,
  params: RequestParams = {}
): Promise<Response> {
  const apiRequest = `${API}/${endpoint}`;

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
