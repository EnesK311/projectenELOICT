const immoRegisterInput = document.querySelector(
  ".immologo",
) as HTMLInputElement

const targetSelector = (event: Event): string => {
  switch (event.target) {
    case immoRegisterInput:
      return "immologoresult"
    default:
      return ""
  }
}

const imageDisplay: (e: Event) => void = (e: Event) => {
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

immoRegisterInput.addEventListener("change", imageDisplay)
