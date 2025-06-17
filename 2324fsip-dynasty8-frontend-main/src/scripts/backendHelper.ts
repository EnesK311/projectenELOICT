import {
  getAccessToken,
  logout,
  refreshAccessToken,
  verifyAccessToken,
} from "./auth.ts"

export function deleteDataFromBackend<T>(
  data: T, // alle data dus fields en nummers.
  endpoint: string, // naar welke endpoint , dus bv /listings/
  onSuccess: (response: Response) => void, // de handle success codes uit responseHandlers.ts
  onError: (error: Error) => void, // de errorcode uit responseHandlers.ts
  apiUrl: string, // onze .env variabele import.meta.env.VITE_API_BASE_URL
): Promise<void> {
  return fetch(apiUrl + endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Authorization": `Bearer ${getAccessToken().accessToken}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        onSuccess(response)
      } else {
        onError(new Error(`Error occurred: ${response.status}`))
        if (response.status === 404) {
          //window.location.href = "/404/"
        } else if (response.status === 401) {
          //window.location.href = "/401/"
        }
      }
    })
    .catch((error) => {
      onError(new Error(`Error occurred: ${String(error)}`))
    })
}

export const myFetch = async (
  url: RequestInfo | string,
  init: RequestInit = {},
): Promise<Response> => {
  // add the Authorization header,
  // keep the rest
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const decodedToken = verifyAccessToken()
  const currentTimeInSeconds = Math.floor(Date.now() / 1000)

  if (decodedToken !== null) {
    if (decodedToken?.exp - 60 < currentTimeInSeconds) {
      await refreshAccessToken().catch(() => {
        logout()
      })
    }
  }

  init.headers = {
    ...init.headers,
    "X-Authorization": `Bearer ${getAccessToken().accessToken}`,
  }
  init.credentials = "include"

  return fetch(url, init)
}
