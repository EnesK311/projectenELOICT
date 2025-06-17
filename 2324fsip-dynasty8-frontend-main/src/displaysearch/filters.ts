import { getQueryStringParameters } from "./querystringParameters"

const currentURL = window.location.href
const parameters = getQueryStringParameters(currentURL)
console.log(parameters)

const filtersContainer = document.querySelector(".filterscontainer")

if (filtersContainer) {
  filtersContainer.innerHTML = ""

  for (const key in parameters) {
    if (Object.prototype.hasOwnProperty.call(parameters, key)) {
      let readableKey = createReadableFilters([key])[0]
      let value = parameters[key]

      switch (key) {
        case "KoopHuur":
          value =
            value === "teKoop" ? "Te koop" : value === "teHuur" ? "Te huur" : ""
          break
        case "epc":
          if (value === "X") continue
          break
        case "garage":
          if (value === "0") continue
          readableKey = "Grootte garage"
          break
        case "maxBuildPrice":
        case "minBuildPrice":
        case "landMaxPrice":
        case "landMinPrice":
          value = value !== "" ? `€${value}` : ""
          break
        case "maxBuildArea":
        case "minBuildArea":
        case "maxGardenArea":
        case "minGardenArea":
        case "minLandArea":
        case "maxLandArea":
          value = value !== "" ? `${value} m²` : ""
          break
        case "minLivingArea":
        case "maxLivingArea":
          value = value !== "" ? `${value} m²` : ""
          break
        case "landType":
          value =
            value === "farmland"
              ? "Landbouwgrond"
              : value === "buildland"
                ? "Bouwgrond"
                : ""
          break
      }

      if (value !== undefined && value !== "") {
        const filterDiv = document.createElement("div")
        filterDiv.className = "filter"

        const filterText = document.createElement("p")
        filterText.textContent = `${readableKey}: ${value}`

        filterDiv.appendChild(filterText)
        filtersContainer.appendChild(filterDiv)
      }
    }
  }
}

function createReadableFilters(keys: string[]): string[] {
  return keys.map((key) => {
    switch (key) {
      case "KoopHuur":
        return "Te koop of te huur"
      case "garage":
        return "Grootte garage"
      case "maxBathrooms":
        return "Max aantal badkamers"
      case "maxBedrooms":
        return "Max aantal slaapkamers"
      case "maxBuildArea":
        return "Max oppervlakte bouwgrond"
      case "maxBuildPrice":
        return "Max prijs"
      case "maxBuildYear":
        return "Max bouwjaar"
      case "maxGardenArea":
        return "Max oppervlakte tuin"
      case "maxLivingArea":
        return "Max bewoonbare oppervlakte"
      case "minBathrooms":
        return "Min aantal badkamers"
      case "minBedrooms":
        return "Min aantal slaapkamers"
      case "minBuildArea":
        return "Min oppervlakte bouwgrond"
      case "minBuildPrice":
        return "Min prijs"
      case "minBuildYear":
        return "Min bouwjaar"
      case "minGardenArea":
        return "Min oppervlakte tuin"
      case "minLivingArea":
        return "Min bewoonbare oppervlakte"
      case "search":
        return "Plaats"
      case "type":
        return "Type zoekertje"
      case "landMaxPrice":
        return "Max prijs"
      case "landMinPrice":
        return "Min prijs"
      case "landSearch":
        return "Plaats"
      case "landType":
        return "Type land"
      case "minLandArea":
        return "Min oppervlakte"
      case "maxLandArea":
        return "Max oppervlakte"
      case "epc":
        return "Energieprestatiecertificaat"
      default:
        return key
    }
  })
}
