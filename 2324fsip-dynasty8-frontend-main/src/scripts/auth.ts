import { jwtDecode } from "jwt-decode"
import { DecodedToken, JWTResponse, Role } from "./types.ts"
import { myFetch } from "./backendHelper.ts"

// Save the received access token to local storage.
export const setAccessToken = (data: JWTResponse): void => {
  localStorage.setItem("accessToken", data.accessToken)
  console.log(data.accessToken)
  console.log("acces token set successfully")
}

// Retrieve the access token from local storage.
export const getAccessToken = (): JWTResponse => {
  const accessToken = localStorage.getItem("accessToken")
  let response: JWTResponse = { accessToken: "" }
  if (!accessToken) {
    return response
  }
  response = { accessToken: accessToken }
  return response
}

// Verify the validity of the stored access token.
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export const verifyAccessToken = (): null | DecodedToken => {
  // Retrieve the access token from local storage.
  const { accessToken } = getAccessToken()
  return accessToken ? jwtDecode<DecodedToken>(accessToken) : null

  // Decode the JWT token to obtain its payload.
  // Return the decoded token if valid; otherwise, return null.
}

export const isLoggedIn = (): boolean => {
  return verifyAccessToken() !== null
}

// Check if the user has a specific role based on the decoded token.
export const hasRole = (role: Role): boolean => {
  const decodedToken = verifyAccessToken()
  return decodedToken ? decodedToken.roles.includes(role) : false
}

// Clear the access token from local storage, effectively logging out the user.
export const logout = (): void => {
  console.log("logout function called")
  localStorage.removeItem("accessToken")
  window.location.href = "/login/"
}

// Handle the user login process.
export const login = async (
  formData: FormData,
): Promise<{ accessToken: string }> => {
  const apiUrl: string = import.meta.env.VITE_API_BASE_URL as string
  const endpoint: string = "/login"

  const response = await myFetch(apiUrl + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  })

  if (!response.ok) {
    const errorResponse = (await response.json()) as { message?: string }
    throw new Error(`Login failed: ${errorResponse.message}`)
  }

  return (await response.json()) as { accessToken: string }
}

const handleLoginSuccess = (responseData: { accessToken: string }): void => {
  setAccessToken({ accessToken: responseData.accessToken })
}

export const refreshAccessToken = async (): Promise<void> => {
  const apiUrl: string = import.meta.env.VITE_API_BASE_URL as string
  const endpoint: string = "/refresh-token"
  // 1. Make a POST request to the server's refresh token endpoint.
  try {
    const response = await fetch(apiUrl + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": `Bearer ${getAccessToken().accessToken}`,
      },
      credentials: "include",
    })
    if (!response.ok) {
      const errorResponse = (await response.json()) as { message?: string }
      throw new Error(`refresh failed: ${errorResponse.message}`)
    }
    const responseData = (await response.json()) as { accessToken: string }
    handleLoginSuccess(responseData)
  } catch (error) {
    console.error(error)
  }
  // 2. Don't forget credentials: 'include' for the request!
  // 3. Check if the response is okay; otherwise, throw an error.
  // 4. Store the new access token in the application state or local storage.
}
