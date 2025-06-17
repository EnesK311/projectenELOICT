import { initializeLoginValidation } from "./loginValidator"
import { initializeListingValidation } from "./listingValidator"
import { initializeLandValidation } from "./landValidator"
import { initializeImmoRegisterValidation } from "./immoRegisterValidator"
import { isLoggedIn, logout, hasRole } from "./auth"

import { getAllFavorites, refreshProperties } from "./listingsService.ts"
import { refreshImmos } from "./immosService"
import { selectAllFavorites, toggleHeart } from "./favoritesHandler.ts"
import { initializeRegisterValidation } from "./registerValidator"

function loginFormExists(): boolean {
  return !!document.querySelector<HTMLFormElement>("#loginForm")
}

function registerFormExists(): boolean {
  return !!document.querySelector<HTMLFormElement>("#registerForm")
}

function mainPageFormExists(): boolean {
  return !!document.querySelector<HTMLFormElement>("#mainpageForm")
}

function isLogoutPage(): boolean {
  return !!document.querySelector<HTMLFormElement>("#logout")
}

function propertyFormExists(): boolean {
  return !!document.querySelector<HTMLFormElement>("#propertyForm")
}

function propertySearchExists(): boolean {
  return !!document.querySelector<HTMLFormElement>("#propertySearchForm")
}

function isDisplaySearchPage(): boolean {
  return !!document.querySelector<HTMLElement>("#searchFilters")
}

function isFavoritesPage(): boolean {
  return !!document.querySelector<HTMLFormElement>("#wishlist-items")
}

function registerImmoFormExists(): boolean {
  return !!document.querySelector<HTMLFormElement>("#registerimmo")
}

function isImmoPage(): boolean {
  return !!document.querySelector<HTMLElement>("#registerImmoDiv")
}

function isEditImmoPage(): boolean {
  return !!document.querySelector<HTMLElement>("#editimmo")
}

const myBtn = document.querySelector(".hamburger") as HTMLElement
const menuItems = document.querySelector("header nav") as HTMLElement
const icon1 = document.querySelector(".icon span:nth-child(1)") as HTMLElement
const icon2 = document.querySelector(".icon span:nth-child(2)") as HTMLElement
const icon3 = document.querySelector(".icon span:nth-child(3)") as HTMLElement

myBtn.addEventListener("click", () => {
  menuItems.classList.toggle("show")
  icon1.classList.toggle("rotate-down")
  icon2.classList.toggle("hide")
  icon3.classList.toggle("rotate-up")
})

const loginLink = document.getElementById("loginLink") as HTMLElement
const logoutLink = document.getElementById("logoutLink") as HTMLElement
const wishlistLink = document.getElementById("wishlistLink") as HTMLElement
const immoEditLink = document.getElementById("immoEditLink") as HTMLElement

if (isLogoutPage()) {
  logout()
}

if (loginLink && logoutLink && wishlistLink) {
  if (isLoggedIn()) {
    wishlistLink.style.display = "flex"
    loginLink.style.display = "none"
    logoutLink.style.display = "block"
    console.log("Ingelogd")
  } else {
    wishlistLink.style.display = "none"
    loginLink.style.display = "block"
    logoutLink.style.display = "none"
    console.log("niet Ingelogd")
  }
}

if (immoEditLink) {
  if (hasRole("immo")) {
    immoEditLink.style.display = "flex"
  } else {
    immoEditLink.style.display = "none"
  }
}

if (isDisplaySearchPage()) {
  const searchFilterBox = document.getElementById(
    "searchFilters",
  ) as HTMLElement
  const extraFilters = document.querySelector(".filtersexpanded") as HTMLElement
  const svgContainer = document.querySelector(
    ".filters div svg",
  ) as SVGSVGElement

  if (extraFilters && svgContainer) {
    extraFilters.style.display = "none"

    searchFilterBox.addEventListener("click", () => {
      if (
        extraFilters.style.display === "none" ||
        extraFilters.style.display === ""
      ) {
        extraFilters.style.display = "block"

        svgContainer.innerHTML =
          '<path fill="currentColor" d="m96 373.3l-96 96L42.7 512l96-96l74.7 74.7v-192h-192zm394.7-74.6h-192v192l74.7-74.7l96 96l42.7-42.7l-96-96zM42.7 0L0 42.7l96 96l-74.7 74.7h192v-192L138.7 96zM416 138.7l96-96L469.3 0l-96 96l-74.7-74.7v192h192z"/>'
      } else {
        extraFilters.style.display = "none"

        svgContainer.innerHTML =
          '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8.5V4m0 0h4.5M4 4l5.5 5.5m10.5-1V4m0 0h-4.5M20 4l-5.5 5.5M4 15.5V20m0 0h4.5M4 20l5.5-5.5m10.5 1V20m0 0h-4.5m4.5 0l-5.5-5.5"/>'
      }
    })
  }
}

if (registerImmoFormExists()) {
  if (isLoggedIn() && !hasRole("immo")) {
    initializeImmoRegisterValidation()
  } else {
    window.location.href = "/401/"
  }
}

if (isImmoPage()) {
  void refreshImmos().then((r) => console.log(r))
  const registerImmoDiv = document.getElementById(
    "registerImmoDiv",
  ) as HTMLElement

  if (isLoggedIn() && !hasRole("immo")) {
    registerImmoDiv.style.display = "flex"
  } else {
    registerImmoDiv.style.display = "none"
  }
}

if (loginFormExists()) {
  initializeLoginValidation()
}

if (registerFormExists()) {
  initializeRegisterValidation()
}

if (isEditImmoPage()) {
  refreshProperties()
    .then(async () => {
      let favoriteIds: number[] = []
      try {
        favoriteIds = await getAllFavorites()
      } catch (error) {
        console.error("er is een error opgetreden", error)
      }
      const heartClips = document.querySelectorAll(".heart-clip")
      selectAllFavorites(favoriteIds, heartClips)
      heartClips.forEach((heartClip) => {
        if (heartClip instanceof HTMLElement) {
          toggleHeart(heartClip)
        }
      })
    })
    .catch((error) =>
      console.error("error bij het ophalen van listings", error),
    )
}

if (mainPageFormExists()) {
  refreshProperties()
    .then(async () => {
      let favoriteIds: number[] = []
      try {
        favoriteIds = await getAllFavorites()
      } catch (error) {
        console.error("er is een error opgetreden", error)
      }
      const heartClips = document.querySelectorAll(".heart-clip")
      selectAllFavorites(favoriteIds, heartClips)
      heartClips.forEach((heartClip) => {
        if (heartClip instanceof HTMLElement) {
          toggleHeart(heartClip)
        }
      })
    })
    .catch((error) =>
      console.error("error bij het ophalen van listings", error),
    )
}

if (propertySearchExists()) {
  const urlParams = new URLSearchParams(window.location.search)
  const koopHuur = urlParams.get("KoopHuur")
  const search = urlParams.get("search")
  const typeParam = urlParams.get("type")
  const minPrice = urlParams.get("minPrice")
  const maxPrice = urlParams.get("maxPrice")

  const koopHuurInput = document.getElementsByName(
    "KoopHuur",
  ) as NodeListOf<HTMLInputElement>

  const searchInput = document.getElementById("search") as HTMLInputElement
  const typeInput = document.getElementById("type") as HTMLSelectElement
  const minPriceInput = document.getElementById("min") as HTMLInputElement
  const maxPriceInput = document.getElementById("max") as HTMLInputElement

  const propertyForm = document.getElementById(
    "propertysearchwrapper",
  ) as HTMLElement
  const landForm = document.getElementById("landsearchwrapper") as HTMLElement
  const houseAndAppartementCard = document.getElementById(
    "housecard",
  ) as HTMLElement
  const landCard = document.getElementById("landcard") as HTMLElement

  let isFormDisplayed = false

  propertyForm.style.display = "none"
  landForm.style.display = "none"

  const returnArrow = document.createElement("button")
  returnArrow.innerHTML = "Ga terug"

  if (typeParam === "huis" || typeParam === "appartement") {
    propertyForm.style.display = "block"
    landForm.style.display = "none"
    houseAndAppartementCard.style.display = "none"
    landCard.style.display = "none"
    isFormDisplayed = true

    koopHuurInput.forEach((input) => (input.checked = input.value === koopHuur))
    searchInput.value = search!
    typeInput.value = typeParam!
    minPriceInput.value = minPrice!
    maxPriceInput.value = maxPrice!
  }

  houseAndAppartementCard.addEventListener("click", () => {
    propertyForm.style.display = "block"
    landForm.style.display = "none"
    houseAndAppartementCard.style.display = "none"
    landCard.style.display = "none"
    isFormDisplayed = true

    koopHuurInput.forEach((input) => (input.checked = input.value === koopHuur))
    searchInput.value = search!
    typeInput.value = typeParam!
    minPriceInput.value = minPrice!
    maxPriceInput.value = maxPrice!
    returnArrow.style.display = "block"
  })

  if (typeParam === "grond") {
    propertyForm.style.display = "none"
    landForm.style.display = "block"
    houseAndAppartementCard.style.display = "none"
    landCard.style.display = "none"
    isFormDisplayed = true

    // fill in values for landform
    const landKoopHuurInput = document.getElementsByName(
      "KoopHuur",
    ) as NodeListOf<HTMLInputElement>
    const landSearchInput = document.getElementById(
      "landsearch",
    ) as HTMLInputElement
    const landTypeInput = document.getElementById(
      "landtype",
    ) as HTMLSelectElement
    const landMinPriceInput = document.getElementById(
      "landmin",
    ) as HTMLInputElement
    const landMaxPriceInput = document.getElementById(
      "landmax",
    ) as HTMLInputElement

    landKoopHuurInput.forEach(
      (input) => (input.checked = input.value === koopHuur),
    )
    landSearchInput.value = search!
    landTypeInput.value = typeParam!
    landMinPriceInput.value = minPrice!
    landMaxPriceInput.value = maxPrice!

    returnArrow.style.display = "block"
  }

  landCard.addEventListener("click", () => {
    propertyForm.style.display = "none"
    landForm.style.display = "block"
    houseAndAppartementCard.style.display = "none"
    landCard.style.display = "none"
    isFormDisplayed = true
    returnArrow.style.display = "block"
  })

  returnArrow.addEventListener("click", () => {
    propertyForm.style.display = "none"
    landForm.style.display = "none"
    houseAndAppartementCard.style.display = "block"
    landCard.style.display = "block"
    isFormDisplayed = false
    returnArrow.style.display = "none"
  })

  const cardContainer = document.getElementById("card-container") as HTMLElement
  if (cardContainer) {
    cardContainer.appendChild(returnArrow)
  }

  if (isFormDisplayed) {
    returnArrow.style.display = "block"
  } else {
    returnArrow.style.display = "none"
  }
}

if (propertyFormExists()) {
  initializeListingValidation()
  initializeLandValidation()

  //code voor toggelen van de forms, en een terugknop laten verschijnen

  const propertyForm = document.getElementById(
    "propertyformwrapper",
  ) as HTMLElement
  const landform = document.getElementById("landformwrapper") as HTMLElement
  const houseandappartementcard = document.getElementById(
    "housecard",
  ) as HTMLElement
  const landcard = document.getElementById("landcard") as HTMLElement

  let isFormDisplayed = false

  propertyForm.style.display = "none"
  landform.style.display = "none"

  houseandappartementcard.addEventListener("click", () => {
    propertyForm.style.display = "block"
    landform.style.display = "none"
    houseandappartementcard.style.display = "block"
    landcard.style.display = "none"
    isFormDisplayed = true

    if (isFormDisplayed) {
      returnArrow.style.display = "block"
    } else {
      returnArrow.style.display = "none"
    }
  })

  landcard.addEventListener("click", () => {
    propertyForm.style.display = "none"
    landform.style.display = "block"
    houseandappartementcard.style.display = "none"
    landcard.style.display = "block"
    isFormDisplayed = true

    if (isFormDisplayed) {
      returnArrow.style.display = "block"
    } else {
      returnArrow.style.display = "none"
    }
  })

  const returnArrow = document.createElement("button")
  returnArrow.innerHTML = "Ga terug"
  returnArrow.addEventListener("click", () => {
    propertyForm.style.display = "none"
    landform.style.display = "none"
    houseandappartementcard.style.display = "block"
    landcard.style.display = "block"
    isFormDisplayed = false

    if (isFormDisplayed) {
      returnArrow.style.display = "block"
    } else {
      returnArrow.style.display = "none"
    }
  })

  const cardContainer = document.getElementById("card-container") as HTMLElement
  if (cardContainer) {
    cardContainer.appendChild(returnArrow)
  }
  if (isFormDisplayed) {
    returnArrow.style.display = "block"
  } else {
    returnArrow.style.display = "none"
  }

  // code voor de prijs in euro inputfield te laten verdwijnen

  const priceInputLabel = document.querySelector(
    "label[for='propertyprice']",
  ) as HTMLElement
  const priceInput = document.getElementById(
    "propertyprice",
  ) as HTMLInputElement
  const priceOnRequestCheckbox = document.getElementById(
    "price-on-request",
  ) as HTMLInputElement
  const ofHeader = document.getElementById("of") as HTMLElement

  priceOnRequestCheckbox.addEventListener("change", () => {
    if (priceOnRequestCheckbox.checked) {
      priceInput.value = ""
      priceInputLabel.style.display = "none"
      priceInput.style.display = "none"
      ofHeader.style.display = "none"
    } else {
      priceInputLabel.style.display = "block"
      priceInput.style.display = "block"
      ofHeader.style.display = "block"
    }
  })

  const garageCheckbox = document.getElementById(
    "has-garage",
  ) as HTMLInputElement
  const garageSizeInput = document.getElementById(
    "garage-size",
  ) as HTMLInputElement
  const garageLabel = document.querySelector(
    "label[for='garage-size']",
  ) as HTMLElement

  garageCheckbox.addEventListener("change", () => {
    if (garageCheckbox.checked) {
      garageSizeInput.style.display = "block"
      garageLabel.style.display = "block"
    } else {
      garageSizeInput.style.display = "none"
      garageLabel.style.display = "none"
    }
  })
}

if (isFavoritesPage()) {
  const deleteButtons = document.querySelectorAll(".delete-button")
  const confirmationDivs = document.querySelectorAll(".delete-confirmation")

  deleteButtons.forEach((deleteButton, index) => {
    deleteButton.addEventListener("click", () => {
      // Eerst andere divs sluiten zodat je geen dubbele delete divs op je scherm kan hebben.
      confirmationDivs.forEach((div, i) => {
        if (i !== index && div.classList.contains("show-confirmation")) {
          div.classList.remove("show-confirmation")
        }
      })

      // Visibility van de geselecteerde div. toggelen.
      confirmationDivs[index].classList.toggle("show-confirmation")

      // z index van geselecteerde delete div. naar voor.
      ;(confirmationDivs[index] as HTMLElement).style.zIndex = "1"
    })
  })

  confirmationDivs.forEach((confirmationDiv) => {
    const confirmButton = confirmationDiv.querySelector(
      ".confirm-delete",
    ) as HTMLElement
    const cancelButton = confirmationDiv.querySelector(
      ".cancel-delete",
    ) as HTMLElement

    confirmButton.addEventListener("click", () => {
      // LOGICA VOOR DELETEN HIER, voorlopig console log.
      console.log("Item deleted!")
      confirmationDiv.classList.remove("show-confirmation")
    })

    cancelButton.addEventListener("click", () => {
      // Confirmation div hide.
      confirmationDiv.classList.remove("show-confirmation")
    })
  })
}
