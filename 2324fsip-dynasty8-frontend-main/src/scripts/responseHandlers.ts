export function handleSuccess(response?: Response): void {
  if (response && response.status === 201) {
    console.log("Success")
  } else if (response && response.status === 400) {
    console.error("Bad request")
  }
}

export function handleSuccessLogin(response?: Response): void {
  if (response && response.status === 201) {
    console.log("Login completed successfully")
  } else if (response && response.status === 400) {
    console.error("Bad request")
  }
}

export function handleFailure(error: Error): void {
  console.error("Error occurred:", error.message)
}
