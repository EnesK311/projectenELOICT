import { FormValidator } from "./formValidator"
import { handleFailure } from "./responseHandlers"
import { myFetch } from "./backendHelper"

export function initializeListingValidation(): void {
  const apiUrl: string = import.meta.env.VITE_API_BASE_URL as string
  console.log(apiUrl)
  const form = document.querySelector<HTMLFormElement>("#propertyForm")
  if (!(form instanceof HTMLFormElement)) {
    throw new Error("Form element not found or not of type HTMLFormElement")
  }

  const validator = new FormValidator(form) //, "errorSummary-heading", "errorList"

  validator.addValidator({
    name: "price",
    method: (field) => {
      const fieldValue = field.value.trim()
      const priceOnRequestCheckbox = document.getElementById(
        "price-on-request",
      ) as HTMLInputElement

      if (priceOnRequestCheckbox.checked) {
        return true
      }

      return fieldValue !== "" && parseFloat(fieldValue) >= 0
    },
    message: "Geef een correcte prijs in, of selecteer 'Prijs op aanvraag'",
  })

  validator.addValidator({
    name: "saleRent",
    method: () => {
      const selectedValue = document.querySelector<HTMLInputElement>(
        'input[name="saleRent"]:checked',
      )?.value
      return selectedValue === "sale" || selectedValue === "rent"
    },
    message: "Selecteer 'Te koop' of 'Te huur'",
  })

  //validator.addValidator({
  //  name: "housetype",
  //  method: (field) => {
  //    const selectedValue = (field as HTMLSelectElement).value
  //    if (selectedValue !== "house" && selectedValue !== "appartement") {
  //      return false
  //    }
  //    return true
  //  },
  //  message: "Selecteer een geschikt type zoekertje",
  //})

  validator.addValidator({
    name: "propertytype",
    method: () => {
      const houseRadio = document.getElementById("house") as HTMLInputElement
      const appartementRadio = document.getElementById(
        "appartement",
      ) as HTMLInputElement

      return houseRadio.checked || appartementRadio.checked
    },
    message: "Selecteer een geschikt type zoekertje",
  })

  validator.addValidator({
    name: "livingarea",
    method: (field) => {
      const fieldValue = field.value.trim()
      return /\d/.test(fieldValue)
    },
    message: "Bewoonbare oppervlakte moet minstens één cijfer bevatten",
  })

  validator.addValidator({
    name: "livingarea",
    method: (field) => {
      const fieldValue = field.value.trim()
      return fieldValue.length <= 10
    },
    message: "Bewoonbare oppervlakte mag maximaal 10 cijfers bevatten",
  })

  validator.addValidator({
    name: "buildingarea",
    method: (field) => {
      const fieldValue = field.value.trim()
      return fieldValue === "" || parseFloat(fieldValue) >= 0
    },
    message: "Geef een correcte Bouwgrond",
  })

  validator.addValidator({
    name: "gardenarea",
    method: (field) => {
      const fieldValue = field.value.trim()
      return fieldValue === "" || parseFloat(fieldValue) >= 0
    },
    message: "Geef een correcte tuinoppervlakte",
  })

  validator.addValidator({
    name: "bedrooms",
    method: (field) => {
      const fieldValue = field.value.trim()
      return fieldValue === "" || parseInt(fieldValue, 10) >= 0
    },
    message: "Geef een correct aantal van slaapkamers in",
  })

  validator.addValidator({
    name: "bathrooms",
    method: (field) => {
      const fieldValue = field.value.trim()
      return fieldValue === "" || parseInt(fieldValue, 10) >= 0
    },
    message: "Geef een correct aantal van badkamers in",
  })

  validator.addValidator({
    name: "year",
    method: (field) => {
      const fieldValue = field.value.trim()
      const yearRegex = /^\d{4}$/
      return yearRegex.test(fieldValue)
    },
    message: "Geef een correct jaartal in met het formaat YYYY, zie : 🛈",
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
    name: "housenumber",
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

  //validator.addValidator({
  //  name: "epc",
  //  method: (field) => {
  //    const selectedValue = (field as HTMLSelectElement).value
  //    const validOptions = ["X", "A+", "A", "B", "C", "D", "E", "F"]
  //    if (!validOptions.includes(selectedValue)) {
  //      return false
  //    }
  //    return true
  //  },
  //  message: "Geef een correcte EPC waarde: (A+, A, B, C, D, E, F) of onbekend",
  //})

  validator.addValidator({
    name: "description",
    method: (field) => {
      const fieldValue = field.value.trim()
      return fieldValue !== ""
    },
    message: "Vul een beschrijving in",
  })

  validator.addValidator({
    name: "description",
    method: (field) => {
      const fieldValue = field.value.trim()
      return fieldValue !== "" && fieldValue.length <= 3000
    },
    message: "Vul een beschrijving in met maximaal 3000 tekens",
  })

  validator.addValidator({
    name: "garage-size",
    method: () => {
      const garageCheckbox = document.getElementById(
        "has-garage",
      ) as HTMLInputElement
      const garageSizeField = document.getElementById(
        "garage-size",
      ) as HTMLInputElement

      if (!garageCheckbox.checked) {
        return true
      }

      const garageSizeValue = garageSizeField.value.trim()
      if (!garageSizeValue) {
        return false
      }

      const parsedValue = parseInt(garageSizeValue)
      return !isNaN(parsedValue) && parsedValue >= 0
    },
    message:
      "Geef een geldig aantal garage plekken of vink 'Heeft garage' niet meer aan",
  })

  form.addEventListener("submit", (event) => {
    event.preventDefault()

    if (validator.validate()) {
      //begin formdata
      const formData = {
        price:
          (
            document.querySelector<HTMLInputElement>(
              "#propertyprice",
            ) as HTMLInputElement
          )?.value.trim() || null,

        saleRent: (
          document.querySelector<HTMLInputElement>(
            'input[name="saleRent"]:checked',
          ) as HTMLInputElement
        )?.value,
        propertytype: (
          document.querySelector<HTMLInputElement>(
            'input[name="propertytype"]:checked',
          ) as HTMLInputElement
        )?.value,
        livingarea: parseFloat(
          (
            document.querySelector<HTMLInputElement>(
              "#livingarea",
            ) as HTMLInputElement
          )?.value.trim() || "0",
        ),
        buildingarea: parseFloat(
          (
            document.querySelector<HTMLInputElement>(
              "#buildingarea",
            ) as HTMLInputElement
          )?.value.trim() || "0",
        ),
        gardenarea: parseFloat(
          (
            document.querySelector<HTMLInputElement>(
              "#gardenarea",
            ) as HTMLInputElement
          )?.value.trim() || "0",
        ),
        bedrooms: parseInt(
          (
            document.querySelector<HTMLInputElement>(
              "#bedrooms",
            ) as HTMLInputElement
          )?.value.trim() || "0",
          10,
        ),
        bathrooms: parseInt(
          (
            document.querySelector<HTMLInputElement>(
              "#bathrooms",
            ) as HTMLInputElement
          )?.value.trim() || "0",
          10,
        ),
        year: parseInt(
          (
            document.querySelector<HTMLInputElement>(
              "#buildingyear",
            ) as HTMLInputElement
          )?.value.trim() || "0",
          10,
        ),
        city:
          (
            document.querySelector<HTMLInputElement>(
              "#propertycity",
            ) as HTMLInputElement
          )?.value.trim() || "",
        zip: parseInt(
          (
            document.querySelector<HTMLInputElement>(
              "#propertyZIP",
            ) as HTMLInputElement
          )?.value.trim() || "0",
          10,
        ),
        streetname:
          (
            document.querySelector<HTMLInputElement>(
              "#propertystreetname",
            ) as HTMLInputElement
          )?.value.trim() || "",
        housenumber: parseInt(
          (
            document.querySelector<HTMLInputElement>(
              "#propertyhousenumber",
            ) as HTMLInputElement
          )?.value.trim() || "0",
          10,
        ),
        bus:
          (
            document.querySelector<HTMLInputElement>(
              "#propertybus",
            ) as HTMLInputElement
          )?.value.trim() || "",
        epc:
          (
            document.querySelector<HTMLInputElement>("#epc") as HTMLInputElement
          )?.value.trim() || "",
        description:
          (
            document.querySelector<HTMLInputElement>(
              "#description",
            ) as HTMLInputElement
          )?.value.trim() || "",
        thumbnailImg: "",
        imgs: [] as string[],
        garagesize: parseInt(
          (
            document.querySelector<HTMLInputElement>(
              "#garage-size",
            ) as HTMLInputElement
          )?.value.trim() || "0",
          10,
        ),
      }
      //einde formdata

      handleImages(formData) // alle formdata meegeven naar de handleImages
      //window.location.href = "/editimmo/"
    } else {
      // validators passen niet en errors tonen uiteraard.
      validator.setFocusOnFirstError()
    }
  })

  function handleImages(formData: { thumbnailImg: string; imgs: string[] }) {
    // We halen de thumbnail en afbeeldingsinputs hier op
    const thumbnailInput =
      document.querySelector<HTMLInputElement>("#propertythumbnail")
    const thumbnailFiles = thumbnailInput?.files
    const imgInputs =
      document.querySelectorAll<HTMLInputElement>("#propertyimgs")

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
    imgInputs.forEach((imgInput) => {
      const files = imgInput.files
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          if (file.type.match("image")) {
            promises.push(convertToBase64(file))
          }
        }
      }
    })

    // Wacht tot alle afbeeldingen zijn omgezet naar base64
    Promise.all(promises)
      .then((results) => {
        results.forEach((result, index) => {
          // Als resultaat eerste in de lijst is is dat de tumbnailimg. We geven ook maar een thumbnail door (ook eerste promise dus)
          if (index === 0 && typeof result === "string") {
            formData.thumbnailImg = result
          } else if (typeof result === "string") {
            // Rest gewoon checken of ze base64 zijn en die bij images zetten
            formData.imgs.push(result)
          }
        })

        myFetch(`${apiUrl}/listings/properties`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }).catch((e) => {
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
