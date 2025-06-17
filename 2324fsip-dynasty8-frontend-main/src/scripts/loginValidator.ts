import { FormValidator } from "./formValidator"

import { handleFailure } from "./responseHandlers"
import { login, setAccessToken } from "./auth"

export function initializeLoginValidation(): void {
  const form = document.querySelector<HTMLFormElement>("#loginForm")
  if (!(form instanceof HTMLFormElement)) {
    throw new Error("Form element not found or not of type HTMLFormElement")
  }
  const errorDiv = document.getElementById("errorbackend")

  const validator = new FormValidator(
    form,
    //"errorSummary-headingLand",
    //"errorListLand",
  )

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
  form.addEventListener("submit", (event) => {
    event.preventDefault()

    if (validator.validate()) {
      const formData = new FormData()
      formData.append(
        "email",
        (
          document.querySelector<HTMLInputElement>("#email") as HTMLInputElement
        )?.value.trim() || "",
      )

      formData.append(
        "password",
        (
          document.querySelector<HTMLInputElement>(
            "#password",
          ) as HTMLInputElement
        )?.value.trim() || "",
      )

      login(formData)
        .then((responseData) => {
          setAccessToken(responseData)
          window.location.href = "../"
        })
        .catch((error) => {
          if (errorDiv instanceof HTMLElement) {
            // div eerst weer leegmaken
            errorDiv.innerHTML = ""
            const pElement = document.createElement("p")

            const errorMessage =
              error instanceof Error ? error.message || "" : ""

            pElement.textContent = errorMessage.replace(/^Login failed: /, "")
            errorDiv.appendChild(pElement)
            errorDiv.style.display = "block"
          }

          handleFailure(error as Error)
        })
    } else {
      validator.setFocusOnFirstError()
    }
  })
}
