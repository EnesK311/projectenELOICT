const propertyImgsInput = document.querySelector(
  ".imguploads",
) as HTMLInputElement
const propertyThumbnailInput = document.querySelector(
  ".propertythumbnail",
) as HTMLInputElement

const landImgsInput = document.querySelector(".landimgs") as HTMLInputElement
const landThumbnailInput = document.querySelector(
  ".landthumbnail",
) as HTMLInputElement

const targetSelector = (event: Event): string => {
  switch (event.target) {
    case propertyImgsInput:
      return "propertyimgsresult"
    case propertyThumbnailInput:
      return "propertythumbnailresult"
    case landImgsInput:
      return "landimgsresult"
    case landThumbnailInput:
      return "landthumbnailresult"
    default:
      return ""
  }
}

export const imageDisplay: (e: Event) => void = (e: Event) => {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    if (e.target != null) {
      const files = (e.target as HTMLInputElement).files as FileList
      const outputId = targetSelector(e)
      //const outputId = e.target === inputMultiple ? "result" : "thumbnailresult" // Kies de juiste output div
      const output = document.querySelector(`#${outputId}`) as HTMLElement
      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.match("image")) continue
        const picReader = new FileReader()
        console.log(picReader)
        picReader.addEventListener("load", function (event) {
          const picFile = event.target as FileReader
          const div = document.createElement("div")
          div.innerHTML = `<img class="thumbnail" src = "${
            picFile.result as string
          }" alt="thumbnail"/>`
          output.appendChild(div)
        })
        picReader.readAsDataURL(files[i])
      }
      console.log(files)
    }
  } else {
    alert("Je browser ondersteunt de file API niet")
  }
}

propertyImgsInput.addEventListener("change", imageDisplay)
propertyThumbnailInput.addEventListener("change", imageDisplay)

landThumbnailInput.addEventListener("change", imageDisplay)
landImgsInput.addEventListener("change", imageDisplay)

//
//const imagesArray: HTMLElement = []
