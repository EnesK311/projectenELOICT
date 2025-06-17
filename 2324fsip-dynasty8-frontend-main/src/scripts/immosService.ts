import { immo } from "./types.ts"

const apiUrl: string = import.meta.env.VITE_API_BASE_URL as string
const picUrl: string = import.meta.env.VITE_PICTURES_URL as string
const immoContainer = document.querySelector(".immos") as HTMLElement

const generateImmoCard = (immo: immo): string => {
  return `<div class="immo">
                <h1>${immo.name}</h1>
                <img src="${picUrl}/${immo.logo}" alt="Immo Image">
                <div class="details">
                <a href="${immo.link}" class="link">Ga naar website</a>
                </div>
            </div>`
}

export const refreshImmos = async (): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}/immos`)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data: immo[] = (await response.json()) as immo[]

    if (!data || !Array.isArray(data)) {
      console.error("Data is undefined or not an array")
      return
    }

    const listingsHTML: string[] = []
    data.forEach((propertyData) => {
      listingsHTML.push(generateImmoCard(propertyData))
    })

    immoContainer.innerHTML = listingsHTML.join("")
  } catch (error) {
    console.error("Error fetching listings:", error)
  }
}
