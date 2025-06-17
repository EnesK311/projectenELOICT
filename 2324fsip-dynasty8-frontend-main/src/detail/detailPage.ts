import { getListingDetailsByID } from "../scripts/listingsService.ts"

const description = document.getElementById("description") as HTMLElement
const toggleBtn = document.getElementById("readmore") as HTMLElement
const maxLength = 500

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const listingId = urlParams.get("ID") as string
const listingType = urlParams.get("type") as string

getListingDetailsByID(parseInt(listingId), listingType)

if (description.innerText.length > maxLength) {
  // Beschrijving is te lang, beperk de hoogte en toon de knop
  description.style.height = "7em"
} else {
  // Beschrijving is kort genoeg, verberg de knop
  toggleBtn.style.display = "none"
}

toggleBtn.addEventListener("click", () => {
  const description = document.getElementById("description") as HTMLElement

  if (description.style.height === "7em") {
    // Beschrijving is ingekort, toon volledige beschrijving en pas de knop aan
    description.style.height = "auto"
  } else {
    // Beschrijving is volledig, beperk de hoogte en pas de knop aan
    description.style.height = "7em"
  }
})
