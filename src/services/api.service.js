import { API_ROUTES } from "./endpoint";

const handleTimeout = (timeout) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), timeout),
  );

const request = async (url, method, options = {}) => {
  const { headers = {}, body, timeout = API_ROUTES.TIMEOUT } = options;

  const authHeaders = {};

  const isFormData = body instanceof FormData;
  const requestHeaders = {
    ...authHeaders,
    ...headers,
  };

  if (!isFormData) {
    Object.assign(requestHeaders, API_ROUTES.HEADERS);
  }

  const fetchPromise = fetch(`${API_ROUTES.BASE_URL}${url}`, {
    method,
    headers: requestHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || res.statusText);
    }
    return res.json();
  });

  return Promise.race([fetchPromise, handleTimeout(timeout)]);
};

const rootApiService = {
  get: (url, headers) => request(url, "GET", { headers }),
  post: (url, body, headers) => request(url, "POST", { body, headers }),
  put: (url, body, headers) => request(url, "PUT", { body, headers }),
  delete: (url, headers) => request(url, "DELETE", { headers }),
};

export default rootApiService;
