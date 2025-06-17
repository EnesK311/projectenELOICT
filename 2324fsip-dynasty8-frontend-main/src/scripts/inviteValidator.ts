import { FormValidator } from "./formValidator"
import { myFetch } from "./backendHelper"

export function initializeInviteValidation(): void {
  const apiUrl: string = import.meta.env.VITE_API_BASE_URL as string
  const form = document.querySelector<HTMLFormElement>("#inviteForm")
  if (!(form instanceof HTMLFormElement)) {
    throw new Error("Form element not found or not of type HTMLFormElement")
  }

  const validator = new FormValidator(form)

  validator.addValidator({
    name: "Username",
    method: (field) => field.value.trim().length > 0,
    message: "Username is required",
  })

  validator.addValidator({
    name: "Email",
    method: (field) => {
      const emailValue = field.value.trim()
      return emailValue !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
    },
    message: "Valid email is required",
  })

  form.addEventListener("submit", (event) => {
    event.preventDefault()

    if (validator.validate()) {
      // Begin formdata
      const formData = {
        username:
          (
            document.querySelector<HTMLInputElement>(
              "#Username",
            ) as HTMLInputElement
          )?.value.trim() || "",
        email:
          (
            document.querySelector<HTMLInputElement>(
              "#Email",
            ) as HTMLInputElement
          )?.value.trim() || "",
      }
      // End formdata

      // Handle the form data as needed
      myFetch(`${apiUrl}/immos/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).catch((e) => {
        console.error(e)
      })
    } else {
      validator.setFocusOnFirstError()
    }
  })
}
