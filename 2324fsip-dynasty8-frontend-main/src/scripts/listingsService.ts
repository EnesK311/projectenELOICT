import { Land, Property } from "./types.ts"
import { deleteDataFromBackend, myFetch } from "./backendHelper.ts"
import { handleFailure, handleSuccess } from "./responseHandlers.ts"
import { isLoggedIn } from "./auth.ts"

const apiUrl: string = import.meta.env.VITE_API_BASE_URL as string
const picUrl: string = import.meta.env.VITE_PICTURES_URL as string
const listingsContainer = document.querySelector(".listings") as HTMLElement

const generatePropertyCard = (property: Property): string => {
  const moneyFormatter = new Intl.NumberFormat()
  return `<div class="listing">
                <img src="${picUrl}/${
                  property.thumbnail_name
                }" alt="House Image">
                <div class="favorite">
                    <svg id='heart' height="0" width="0">
                        <defs>
                            <clipPath id="svgPath">
                                <path d="M20,35.09,4.55,19.64a8.5,8.5,0,0,1-.13-12l.13-.13a8.72,8.72,0,0,1,12.14,0L20,10.79l3.3-3.3a8.09,8.09,0,0,1,5.83-2.58,8.89,8.89,0,0,1,6.31,2.58,8.5,8.5,0,0,1,.13,12l-.13.13Z"/>
                            </clipPath>
                        </defs>
                    </svg>

                    <div class="heart-container">
                        <svg width="40" height="40" viewBox="0 0 40 40" class='heart-stroke'>
                            <path d="M20,35.07,4.55,19.62a8.5,8.5,0,0,1-.12-12l.12-.12a8.72,8.72,0,0,1,12.14,0L20,10.77l3.3-3.3A8.09,8.09,0,0,1,29.13,4.9a8.89,8.89,0,0,1,6.31,2.58,8.5,8.5,0,0,1,.12,12l-.12.12ZM10.64,7.13A6.44,6.44,0,0,0,6.07,18.19L20,32.06,33.94,18.12A6.44,6.44,0,0,0,34,9l0,0a6.44,6.44,0,0,0-4.77-1.85A6,6,0,0,0,24.83,9L20,13.78,15.21,9A6.44,6.44,0,0,0,10.64,7.13Z"/>
                        </svg>

                        <button class='heart-clip' id="${
                          property.id
                        }" aria-label="Toggle favorite"></button>
                    </div>
                </div>
                <div class="details">
                <span class="type">${
                  property.type === "house" ? "Huis" : "Appartement"
                }</span>
                    <h3 class="price">${
                      property.price == 0
                        ? "Prijs op aanvraag"
                        : `Prijs: €${moneyFormatter.format(
                            property.price as number,
                          )}`
                    } </h3>
                    <p class="bedrooms">Slaapkamers: ${
                      property.bedrooms !== null ? property.bedrooms : "N/A"
                    }</p>
                    <p class="area">Bewoonbare opppervlakte: ${
                      property.living_area
                    } m²</p>
                </div>
                <a href="./detail/?ID=${
                  property.id
                }&type=property" class="overlay-link"></a>
            </div>`
}

const generateLandCard = (land: Land) => {
  const moneyFormatter = new Intl.NumberFormat()
  return `<div class="listing">
                <img src="${picUrl}/${land.thumbnail_name}" alt="Land Image">
                <div class="favorite">
                    <svg id='heart' height="0" width="0">
                        <defs>
                            <clipPath id="svgPath">
                                <path d="M20,35.09,4.55,19.64a8.5,8.5,0,0,1-.13-12l.13-.13a8.72,8.72,0,0,1,12.14,0L20,10.79l3.3-3.3a8.09,8.09,0,0,1,5.83-2.58,8.89,8.89,0,0,1,6.31,2.58,8.5,8.5,0,0,1,.13,12l-.13.13Z"/>
                            </clipPath>
                        </defs>
                    </svg>

                    <div class="heart-container">
                        <svg width="40" height="40" viewBox="0 0 40 40" class='heart-stroke'>
                            <path d="M20,35.07,4.55,19.62a8.5,8.5,0,0,1-.12-12l.12-.12a8.72,8.72,0,0,1,12.14,0L20,10.77l3.3-3.3A8.09,8.09,0,0,1,29.13,4.9a8.89,8.89,0,0,1,6.31,2.58,8.5,8.5,0,0,1,.12,12l-.12.12ZM10.64,7.13A6.44,6.44,0,0,0,6.07,18.19L20,32.06,33.94,18.12A6.44,6.44,0,0,0,34,9l0,0a6.44,6.44,0,0,0-4.77-1.85A6,6,0,0,0,24.83,9L20,13.78,15.21,9A6.44,6.44,0,0,0,10.64,7.13Z"/>
                        </svg>

                        <button class='heart-clip' id="${
                          land.id
                        }" aria-label="Toggle favorite"></button>
                    </div>
                </div>
                <div class="details">
                <span class="type">${
                  land.type === "buildland" ? "bouwgrond" : "landbouwgrond"
                }</span>
                    <h3 class="price">${
                      land.price == 0
                        ? "Prijs op aanvraag"
                        : `Prijs: €${moneyFormatter.format(
                            land.price as number,
                          )}`
                    } </h3>
                    <p class="area">Opppervlakte: ${land.area} m² (€ ${
                      land.price ? land.price / land.area : ""
                    }/m²)</p>
                </div>
                <a href="./detail/?ID=${
                  land.id
                }&type=land" class="overlay-link"></a>
               
            </div>`
}
export const getListingDetailsByID = (id: number, type: string): void => {
  const listingDetail = document.querySelector(".listingdetail") as HTMLElement
  if (type === "property") {
    fetch(`${apiUrl}/listings/properties/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((property: Property | undefined) => {
        if (!property) {
          console.error("Data is undefined")
          return
        }
        const image_names = (property.image_names as string).split(",")
        const imageTags = [] as string[]
        image_names.forEach((name) => {
          imageTags.push(`
              <img src="${picUrl}/${name}" alt="foto">
              `)
        })
        const totalLand =
          Math.floor(property.building_area) + Math.floor(property.garden_area)
        const imagesHTML = imageTags.join("")
        const moneyFormatter = new Intl.NumberFormat()
        listingDetail.innerHTML = `
        <div class="listing-info">
            <div>
                <h1>${property.type === "house" ? "Huis" : "Appartement"}${
                  property.contract === "sale" ? " te koop" : " te huur"
                }</h1>
                <h2>${property.bedrooms} slaapkamers | ${Math.floor(
                  property.living_area,
                )}m²</h2>
                <p>${property.streetname} ${property.number} ${
                  property.bus ? " Bus " + property.bus : ""
                } | ${property.zip} ${property.city}</p>
            </div>
            <p id="price">${
              property.price == 0
                ? "Prijs op aanvraag"
                : `Prijs: € ${moneyFormatter.format(property.price as number)}`
            }</p>
        </div>
        <div class="listingdetail-wrapper">
            <div class="container">
                <div class="listingimages-wrapper">
                    <div class="mainimage">
                        <img src="${picUrl}/${
                          property.thumbnail_name
                        }" alt="house image">
                    </div>
                    <div class="detail-images">
                    ${imagesHTML}
                      
                    </div>
                </div>
                <div class="line"></div>
                <section class="listing-overview info-card">
                    <h1>Overzicht</h1>
                    <ul>
                        <li><img src="../img/bed.svg" alt="bed pictogram">
                            <p>${property.bedrooms} slaapkamers</p></li>
                        <li><img src="../img/bath.svg" alt="bad pictogram">
                            <p>${property.bathrooms} Badkamer</p></li>
                        <li><img src="../img/house.svg" alt="huis pictogram">
                            <p>${Math.floor(
                              property.living_area,
                            )} m² bewoonbare ruimte</p></li>
                        <li><img src="../img/area.svg" alt="grond pictogram">
                            <p>${totalLand} m² grond</p></li>
                    </ul>
                </section>
                <div class="line"></div>
                <section class="listing-description info-card">
                    <h1>Omschrijving</h1>
                    <p id="description">
                        ${property.description}
                    </p>
                    <p id="readmore">Lees meer V</p>
                </section>
                <div class="line"></div>
                <section class="all-info">
                    <h1>Info</h1>
                    <table>
                        <tr>
                            <th>Bewoonbare oppervlakte:</th>
                            <td>${Math.floor(property.living_area)}m²</td>
                        </tr>
                        <tr>
                            <th>Bouwgrond:</th>
                            <td>${Math.floor(property.building_area)}m²</td>
                        </tr>
                        <tr>
                            <th>Tuinoppervlakte:</th>
                            <td>${Math.floor(property.garden_area)}m²</td>
                        </tr>
                        <tr>
                            <th>Bouwjaar:</th>
                            <td>${property.building_year}</td>
                        </tr>
                        <tr>
                            <th>Garage:</th>
                            <td>${
                              property.garagesize
                                ? property.garagesize === 1
                                  ? property.garagesize + " plaats"
                                  : property.garagesize + " plaatsen"
                                : " geen garage"
                            } </td>
                        </tr>
                        <tr>
                            <th>EPC waarde:</th>
                            <td>${property.epc}</td>
                        </tr>
                        <tr>
                            <th>Slaapkamers:</th>
                            <td>${property.bedrooms}</td>
                        </tr>
                        <tr>
                            <th>Badkamers:</th>
                            <td>${property.bathrooms}</td>
                        </tr>
                    </table>
                </section>
            </div>
        </div>
        `
      })
      .catch((error) => console.error("Error fetching property:", error))
  } else {
    fetch(`${apiUrl}/listings/land/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((land: Land | undefined) => {
        if (!land) {
          console.error("Data is undefined")
          return
        }
        const image_names = (land.image_names as string).split(",")
        const imageTags = [] as string[]
        image_names.forEach((name) => {
          imageTags.push(`
              <img src="${picUrl}/${name}" alt="foto">
              `)
        })
        const imagesHTML = imageTags.join("")
        const moneyFormatter = new Intl.NumberFormat()
        listingDetail.innerHTML = `
        <div class="listing-info">
            <div>
                <h1>${
                  land.type === "buildland" ? "Bouwgrond" : "Landbouwgrond"
                }${land.contract === "sale" ? " te koop" : " te huur"}</h1>
                <h2>${Math.floor(land.area)}m²</h2>
                <p>${land.streetname} ${land.number} ${
                  land.bus ? " Bus " + land.bus : ""
                } | ${land.zip} ${land.city}</p>
            </div>
            <p id="price">${
              land.price == 0
                ? "Prijs op aanvraag"
                : `Prijs: € ${moneyFormatter.format(land.price as number)}`
            }</p>
        </div>
        <div class="listingdetail-wrapper">
            <div class="container">
                <div class="listingimages-wrapper">
                    <div class="mainimage">
                        <img src="${picUrl}/${
                          land.thumbnail_name
                        }" alt="house image">
                    </div>
                    <div class="detail-images">
                    ${imagesHTML}
                     
                    </div>
                </div>
                <div class="line"></div>
                <section class="listing-overview info-card">
                    <h1>Overzicht</h1>
                    <ul>
                       
                        <li><img src="../img/area.svg" alt="grond pictogram">
                            <p>${Math.floor(land.area)} m² grond</p></li>
                    </ul>
                </section>
                <div class="line"></div>
                <section class="listing-description info-card">
                    <h1>Omschrijving</h1>
                    <p id="description">
                        ${land.description}
                    </p>
                    <p id="readmore">Lees meer V</p>
                </section>
                <div class="line"></div>
                <section class="all-info">
                    <h1>Info</h1>
                    <table>
                        <tr>
                            <th>Oppervlakte:</th>
                            <td>${Math.floor(land.area)}m²</td>
                        </tr>
                    </table>
                </section>
            </div>
        </div>
        `
      })
      .catch((error) => console.error("Error fetching land:", error))
  }
}

export const refreshProperties = async (): Promise<void> => {
  try {
    const response = await myFetch(`${apiUrl}/listings/properties`)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data: Property[] = (await response.json()) as Property[]

    if (!data || !Array.isArray(data)) {
      console.error("Data is undefined or not an array")
      return
    }

    const listingsHTML: string[] = []
    data.forEach((propertyData) => {
      listingsHTML.push(generatePropertyCard(propertyData))
    })

    listingsContainer.innerHTML = listingsHTML.join("")
  } catch (error) {
    console.error("Error fetching listings:", error)
  }
}

export const refreshLand = async (): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}/listings/land`)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data: Land[] = (await response.json()) as Land[]

    if (!data || !Array.isArray(data)) {
      console.error("Data is undefined or not an array")
      return
    }

    const listingsHTML: string[] = []
    data.forEach((landData) => {
      listingsHTML.push(generateLandCard(landData))
    })

    listingsContainer.innerHTML = listingsHTML.join("")
  } catch (error) {
    console.error("Error fetching land listings:", error)
  }
}

export const addListingToFavorites = (listingId: number): void => {
  const data = {
    listingId: listingId,
  }

  myFetch(`${apiUrl}/listings/favorite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch((e) => {
    console.error(e)
  })
}

export const deleteListingFromFavorites = (listingId: number): void => {
  const data = {
    listingId: listingId,
  }

  deleteDataFromBackend(
    data,
    "/listings/favorite",
    handleSuccess,
    handleFailure,
    apiUrl,
  ).catch((error) => {
    handleFailure(error as Error)
  })
}

export const getAllFavorites = async (): Promise<number[]> => {
  if (!isLoggedIn()) {
    return []
  }
  const response = await myFetch(`${apiUrl}/listings/favorite`)
  if (!response.ok) {
    throw response.statusText
    return []
  }
  return (await response.json()) as number[]
}

export const getListingsFromIds = async (
  listingIds: number[],
): Promise<string[]> => {
  const response = await myFetch(`${apiUrl}/listings/favorite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listingIds),
  })
  if (!response.ok) {
    throw response.statusText
  }
  return (await response.json()) as string[]
}
