import { FormValidator } from "./formValidator"
import { handleFailure } from "./responseHandlers"
import { myFetch } from "./backendHelper"
import { logout, refreshAccessToken } from "./auth.ts"

export function initializeImmoRegisterValidation(): void {
  const apiUrl: string = import.meta.env.VITE_API_BASE_URL as string
  const form = document.querySelector<HTMLFormElement>("#registerimmo")
  if (!(form instanceof HTMLFormElement)) {
    throw new Error("Form element not found or not of type HTMLFormElement")
  }
  const errorDiv = document.getElementById("errorbackend")

  const validator = new FormValidator(form)

  validator.addValidator({
    name: "naamImmo",
    method: (field) => field.value.trim().length > 0,
    message: "Naam is verplicht",
  })

  validator.addValidator({
    name: "website",
    method: (field) => {
      const websiteValue = field.value.trim()
      const urlPattern =
        /^(https?:\/\/)?([\w-]+(\.[\w-]+)+|localhost)(:\d{1,5})?(\/[^\s]*)?$/

      return urlPattern.test(websiteValue)
    },
    message: "Please enter a valid website URL",
  })

  validator.addValidator({
    name: "city",
    method: (field) => {
      const fieldValue = field.value.trim()
      return fieldValue !== ""
    },
    message: "Vul de gemeente of stad in",
  })

  validator.addValidator({
    name: "zip",
    method: (field) => {
      const fieldValue = field.value.trim()
      const zipRegex = /^\d{4}$/
      return zipRegex.test(fieldValue)
    },
    message: "Geef een geldige postcode in bestaande uit vier cijfers",
  })

  validator.addValidator({
    name: "streetname",
    method: (field) => {
      const fieldValue = field.value.trim()
      return fieldValue !== ""
    },
    message: "Vul de straatnaam in",
  })

  validator.addValidator({
    name: "number",
    method: (field) => {
      const fieldValue = field.value.trim()
      return fieldValue !== ""
    },
    message: "Vul het huisnummer in",
  })

  validator.addValidator({
    name: "bus",
    method: (field) => {
      const fieldValue = field.value.trim()
      if (fieldValue === "") {
        return true // bus mag dus leeg zijn
      } else {
        // valideer als er maximum één letter is en geen cijfers
        const letters = fieldValue.match(/[a-zA-Z]/g)
        const digits = fieldValue.match(/\d/g)

        return (
          !!letters && (!digits || digits.length === 0) && letters.length <= 1
        )
      }
    },
    message: "Laat leeg of vul maximaal één letter in voor busnummer",
  })

  form.addEventListener("submit", (event) => {
    event.preventDefault()

    if (validator.validate()) {
      // Begin formdata
      const formData = {
        name:
          (
            document.querySelector<HTMLInputElement>(
              "#naamImmo",
            ) as HTMLInputElement
          )?.value.trim() || "",
        link:
          (
            document.querySelector<HTMLInputElement>(
              "#website",
            ) as HTMLInputElement
          )?.value.trim() || "",
        city:
          (
            document.querySelector<HTMLInputElement>(
              "#city",
            ) as HTMLInputElement
          )?.value.trim() || "",
        zip: parseInt(
          (
            document.querySelector<HTMLInputElement>("#zip") as HTMLInputElement
          )?.value.trim() || "0",
          10,
        ),
        streetname:
          (
            document.querySelector<HTMLInputElement>(
              "#streetname",
            ) as HTMLInputElement
          )?.value.trim() || "",
        number: parseInt(
          (
            document.querySelector<HTMLInputElement>(
              "#housenumber",
            ) as HTMLInputElement
          )?.value.trim() || "0",
          10,
        ),
        bus:
          (
            document.querySelector<HTMLInputElement>("#bus") as HTMLInputElement
          )?.value.trim() || "",
        immologo: "",
      }
      //end formdata

      handleImages(formData)
    } else {
      // validators passen niet en errors tonen uiteraard.
      validator.setFocusOnFirstError()
    }
  })
  function handleImages(formData: { immologo: string }) {
    // We halen de thumbnail en afbeeldingsinputs hier op
    const thumbnailInput = document.querySelector<HTMLInputElement>("#immologo")
    const thumbnailFiles = thumbnailInput?.files

    // Array voor het opslaan van (promises) om afbeeldingen naar base64 om te zetten.
    // Elke afbeelding wordt verwerkt als promise en toegevoegd aan de array.
    // Promise.all() wacht erna dan eerst op de oplossing van alle beloften dan pas passen we gegevens naar de backend.
    const promises: Promise<string | void>[] = []

    // Verwerk de thumbnailafbeelding als er een is
    if (thumbnailFiles && thumbnailFiles.length > 0) {
      const thumbnailFile = thumbnailFiles[0]
      if (thumbnailFile.type.match("image")) {
        promises.push(convertToBase64(thumbnailFile))
      }
    }
    // Verwerk alle andere afbeeldingen

    // Wacht tot alle afbeeldingen zijn omgezet naar base64
    Promise.all(promises)
      .then((results) => {
        results.forEach((result, index) => {
          // Als resultaat eerste in de lijst is is dat de tumbnailimg. We geven ook maar een thumbnail door (ook eerste promise dus)
          if (index === 0 && typeof result === "string") {
            formData.immologo = result
          }
        })
        myFetch(`${apiUrl}/immos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then(() => {
            refreshAccessToken()
              .then(() => {
                window.location.href = "../editimmo/"
              })
              .catch(() => {
                logout()
              })
          })

          .catch((e) => {
            if (errorDiv instanceof HTMLElement) {
              // div eerst weer leegmaken
              errorDiv.innerHTML = ""
              const pElement = document.createElement("p")

              const errorMessage = e instanceof Error ? e.message || "" : ""

              pElement.textContent = errorMessage.replace(/^Login failed: /, "")
              errorDiv.appendChild(pElement)
              errorDiv.style.display = "block"
            }
            console.error(e)
          })
      })
      .catch((error) => {
        console.error("Error processing images:", error)
        handleFailure(error as Error)
      })
  }

  // de functie om de foto's te converteren naar Base64
  function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result)
        } else {
          reject(new Error("Failed to convert file to base64"))
        }
      }
      reader.onerror = (error) => {
        reject(error)
      }
      reader.readAsDataURL(file)
    })
  }
}
