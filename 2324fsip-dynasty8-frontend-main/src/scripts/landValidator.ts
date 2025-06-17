import { FormValidator } from "./formValidator"
import { handleFailure } from "./responseHandlers"
import { myFetch } from "./backendHelper"

export function initializeLandValidation(): void {
  const apiUrl: string = import.meta.env.VITE_API_BASE_URL as string
  const form = document.querySelector<HTMLFormElement>("#landForm")
  if (!(form instanceof HTMLFormElement)) {
    throw new Error("Form element not found or not of type HTMLFormElement")
  }

  const validator = new FormValidator(
    form,
    //"errorSummary-headingLand",
    //"errorListLand",
  )

  validator.addValidator({
    name: "price",
    method: (field) => {
      const fieldValue = field.value.trim()

      return fieldValue !== "" && parseFloat(fieldValue) >= 0
    },
    message: "Geef een correcte prijs in",
  })

  validator.addValidator({
    name: "area",
    method: (field) => field.value.trim().length > 0,
    message: "Oppervlakte is een verplicht veld en werd niet ingevuld",
  })

  validator.addValidator({
    name: "type",
    method: () => {
      const buildlandRadio = document.getElementById(
        "buildlandradio",
      ) as HTMLInputElement
      const farmlandRadio = document.getElementById(
        "farmlandradio",
      ) as HTMLInputElement

      return buildlandRadio.checked || farmlandRadio.checked
    },
    message: "Kies een geldig type grond",
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

  validator.addValidator({
    name: "description",
    method: (field) => {
      const fieldValue = field.value.trim()
      return fieldValue !== "" && fieldValue.length <= 3000
    },
    message: "Vul een beschrijving in met maximaal 3000 tekens",
  })

  form.addEventListener("submit", (event) => {
    event.preventDefault()

    if (validator.validate()) {
      // Begin formdata
      const formData = {
        price:
          (
            document.querySelector<HTMLInputElement>(
              "#landprice",
            ) as HTMLInputElement
          )?.value.trim() || null,

        saleRent: (
          document.querySelector<HTMLInputElement>(
            'input[name="saleRent"]:checked',
          ) as HTMLInputElement
        )?.value,
        area: parseFloat(
          (
            document.querySelector<HTMLInputElement>(
              "#area",
            ) as HTMLInputElement
          )?.value.trim() || "0",
        ),
        type: (
          document.querySelector<HTMLInputElement>(
            'input[name="type"]:checked',
          ) as HTMLInputElement
        )?.value,
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
        housenumber: parseInt(
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
        thumbnailImg: "",
        imgs: [] as string[],
        description:
          (
            document.querySelector<HTMLInputElement>(
              "#landdescription",
            ) as HTMLInputElement
          )?.value.trim() || "",
      }
      // End formdata

      handleImages(formData) // alle formdata meegeven naar de handleImages
    } else {
      // validators passen niet en errors tonen uiteraard.
      validator.setFocusOnFirstError()
    }
  })

  function handleImages(formData: { thumbnailImg: string; imgs: string[] }) {
    // We halen de thumbnail en afbeeldingsinputs hier op
    const thumbnailInput =
      document.querySelector<HTMLInputElement>("#landthumbnail")
    const thumbnailFiles = thumbnailInput?.files
    const imgInputs = document.querySelectorAll<HTMLInputElement>("#landimgs")

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

        //console.log("Alle fotos zijn base64:", formData)
        myFetch(`${apiUrl}/listings/land`, {
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
