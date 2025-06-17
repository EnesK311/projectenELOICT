import { FormValidator } from "./formValidator"

import { handleSuccess } from "./responseHandlers"

import { myFetch } from "./backendHelper"

export function initializeRegisterValidation(): void {
  const form = document.querySelector<HTMLFormElement>("#registerForm")
  const apiUrl: string = import.meta.env.VITE_API_BASE_URL as string
  if (!(form instanceof HTMLFormElement)) {
    throw new Error("Form element not found or not of type HTMLFormElement")
  }
  //const errorDiv = document.getElementById("errorbackend")
  const validator = new FormValidator(form)

  validator.addValidator({
    name: "Email",
    method: (field) => {
      const regex =
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      return regex.test(field.value.trim())
    },
    message: "Email is niet geldig",
  })

  validator.addValidator({
    name: "Wachtwoord",
    method: (field) => field.value.trim().length > 0,
    message: "Gelieve een wachtwoord in te geven.",
  })

  validator.addValidator({
    name: "Wachtwoord",
    method: (field) => field.value.trim().length > 5,
    message: "Gelieve een wachtwoord van minstens 5 karakters in te geven",
  })

  validator.addValidator({
    name: "Wachtwoord",
    method: (field) =>
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!#$%&’*+/=?^_`{|}~-]+$/.test(
        field.value.trim(),
      ),
    message: "Het wachtwoord moet minstens één letter en één cijfer bevatten",
  })

  validator.addValidator({
    name: "Gebruikersnaam",
    method: (field) => field.value.trim().length > 0,
    message: "Gelieve een gebruikersnaam in te geven.",
  })

  validator.addValidator({
    name: "Gebruikersnaam",
    method: (field) => field.value.trim().length > 5,
    message: "Gelieve een gebruikersnaam van minstens 5 karakters in te geven",
  })

  form.addEventListener("submit", (event) => {
    event.preventDefault()

    if (validator.validate()) {
      const formData = {
        email:
          (
            document.querySelector<HTMLInputElement>(
              "#email",
            ) as HTMLInputElement
          )?.value.trim() || "",

        username:
          (
            document.querySelector<HTMLInputElement>(
              "#username",
            ) as HTMLInputElement
          )?.value.trim() || "",

        password:
          (
            document.querySelector<HTMLInputElement>(
              "#password",
            ) as HTMLInputElement
          )?.value.trim() || "",
      }

      void sendRegisterToBackend(formData, apiUrl).then(
        () => (window.location.href = "../login/"),
      )
    } else {
      // validators passen niet en errors tonen uiteraard.
      validator.setFocusOnFirstError()
    }
  })
}

async function sendRegisterToBackend(
  formData: { email: string; username: string; password: string },
  apiUrl: string,
) {
  try {
    const response = await myFetch(`${apiUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    if (!response.ok) {
      console.log("register not succesful")
    } else {
      handleSuccess(response)
    }
  } catch (error) {
    console.error("Error submitting form: ", error)
  }
}
