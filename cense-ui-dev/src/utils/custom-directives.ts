export const vShortenText = {
  mounted: (el: HTMLElement) => {
    el.innerText =
      el.innerText.length > 25
        ? el.innerText.substring(0, 25) + '...'
        : el.innerText
  },
}

export const vShortenBio = {
  mounted: (el: HTMLElement) => {
    el.innerText =
      el.innerText.length > 50
        ? el.innerText.substring(0, 50) + '...'
        : el.innerText
  },
}
