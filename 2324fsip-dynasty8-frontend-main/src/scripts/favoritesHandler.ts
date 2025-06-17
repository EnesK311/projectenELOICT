import {
  addListingToFavorites,
  deleteListingFromFavorites,
} from "./listingsService.ts"

export const toggleHeart = (heartClip: HTMLElement): void => {
  heartClip.addEventListener("click", function () {
    this.classList.toggle("active")
    const listingId = parseInt(this.id)
    if (this.classList.contains("active")) {
      addListingToFavorites(listingId)
    } else {
      deleteListingFromFavorites(listingId)
    }
  })
}
export const selectAllFavorites = (
  listingIds: number[],
  heartClips: NodeListOf<Element>,
): void => {
  heartClips.forEach((heartClip) => {
    if (listingIds.includes(Number(heartClip.id))) {
      heartClip.classList.toggle("active")
    }
  })
}
