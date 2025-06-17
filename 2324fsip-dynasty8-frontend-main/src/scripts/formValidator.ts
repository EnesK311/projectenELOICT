export class FormValidator {
  private form: HTMLFormElement
  private validators: {
    name: string
    method: (field: HTMLInputElement | HTMLTextAreaElement) => boolean
    message: string
    field: HTMLInputElement | HTMLTextAreaElement | NodeList
  }[]
  private errors: {
    name: string
    message: string
    field: HTMLInputElement | HTMLTextAreaElement | NodeList
  }[]
  //// voor als je verschillende firms hebt en wilt aanduiden waar de errors moeten komen
  //private errorSummaryHeadingId: string
  //private errorListId: string

  constructor(
    form: HTMLFormElement,
    //errorSummaryHeadingId: string,
    //errorListId: string,
  ) {
    this.form = form
    this.validators = []
    this.errors = []
    //this.errorSummaryHeadingId = errorSummaryHeadingId
    //this.errorListId = errorListId
    this.form.addEventListener("submit", (event) => this.onSubmit(event))
    this.setupFormValidation()
  }

  public showInlineErrors(): void {
    this.errors.forEach((error) => {
      const container = this.getFieldContainer(error.field)

      if (container) {
        const message = document.createElement("span")
        message.className = "error-message summary-error"
        message.textContent = error.message

        const errorContainer = document.createElement("div")
        errorContainer.className = "error-container"
        errorContainer.appendChild(message)

        if (
          error.field instanceof HTMLInputElement ||
          error.field instanceof HTMLTextAreaElement
        ) {
          const fieldContainer = container.closest(".form-section")
          if (fieldContainer) {
            fieldContainer.insertAdjacentElement("afterbegin", errorContainer)
          }
        } else {
          container.appendChild(errorContainer)
        }
      }
    })
  }

  private getFieldContainer(
    field: HTMLInputElement | HTMLTextAreaElement | NodeList,
  ): HTMLElement | null {
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement
    ) {
      const parentContainer = field.closest(".form-section")
      return parentContainer as HTMLElement | null
    } else if (field instanceof NodeList && field.length > 0) {
      const firstElement = field[0] as HTMLInputElement | HTMLTextAreaElement
      const parentContainer = firstElement.closest(".form-section")
      return parentContainer as HTMLElement | null
    }
    return field instanceof HTMLElement ? field : null
  }

  //private displayError(container: HTMLElement, errorMessage: string): void {
  //  const errorContainer = container.querySelector(".error-container")
  //  if (errorContainer) {
  //    errorContainer.innerHTML = `<span class="error-message summary-error">${errorMessage}</span>`
  //  }
  //}

  private removeInlineErrors(): void {
    const errorContainers = this.form.querySelectorAll(".error-container")
    errorContainers.forEach((errorContainer) => errorContainer.remove())
  }

  //private createErrorElement(message: string): HTMLElement {
  //  const errorElement = document.createElement("span")
  //  errorElement.className = "error-message"
  //  errorElement.textContent = message

  //  return errorElement
  //}

  private setupFormValidation(): void {
    if (!this.form) {
      throw new Error("Form element niet gevonden!")
    }

    this.form.addEventListener("submit", (event) => this.onSubmit(event))
  }

  public resetSummary(): void {
    this.form
      .querySelectorAll(".summary-error")
      .forEach((element) => element.remove())
    this.form.querySelectorAll(".invalid").forEach((element) => {
      ;(element as HTMLElement).removeAttribute("aria-invalid")
      ;(element as HTMLElement).removeAttribute("aria-describedby")
      ;(element as HTMLElement).classList.remove("invalid")
    })
    this.errors = []
  }

  //private showSummary(): void {
  //  const summary = document.getElementById(this.errorListId) as HTMLElement
  //  const summaryHeading = document.getElementById(
  //    this.errorSummaryHeadingId,
  //  ) as HTMLElement
  //
  //  if (!summary || !summaryHeading) return
  //
  //  summary.innerHTML = ""
  //
  //  this.errors.forEach((el) => {
  //    const error = this.createSummaryError(el)
  //    if (el.field instanceof NodeList) {
  //      el.field.forEach((node) => {
  //        if (node instanceof HTMLElement) {
  //          summary.appendChild(error)
  //        }
  //      })
  //    } else {
  //      summary.appendChild(error)
  //    }
  //  })
  //
  //  if (this.errors.length === 1) {
  //    summaryHeading.innerText = "Er is een probleem"
  //    summaryHeading.style.display = "block"
  //    summary.style.display = "block"
  //  } else if (this.errors.length > 1) {
  //    summaryHeading.innerText = "Er zijn meerdere problemen"
  //    summaryHeading.style.display = "block"
  //    summary.style.display = "block"
  //  } else {
  //    summaryHeading.style.display = "none"
  //    summary.style.display = "none"
  //  }
  //}

  //private createSummaryError(error: {
  //  name: string
  //  message: string
  //  field: HTMLInputElement | HTMLTextAreaElement | NodeList
  //}): HTMLLIElement {
  //  const li = document.createElement("li")
  //  li.className = "summary-error"
  //
  //  if (error.field instanceof HTMLElement && error.field.id) {
  //    const a = document.createElement("a")
  //    a.href = "#" + error.field.id
  //    a.innerText = error.message
  //    li.id = `${error.name}-error`
  //    li.appendChild(a)
  //  } else {
  //    li.innerText = error.message
  //  }
  //
  //  return li
  //}

  //probeersel voor te linken

  //private createSummaryError(error: {
  //  name: string
  //  message: string
  //  field: HTMLInputElement | HTMLTextAreaElement | NodeList
  //}): HTMLLIElement {
  //  const li = document.createElement("li")
  //  li.className = "summary-error"
  //  li.innerText = error.message

  //  return li
  //}

  public addValidator(validator: {
    name: string
    method: (field: HTMLInputElement | HTMLTextAreaElement) => boolean
    message: string
  }): void {
    const field = this.form.elements.namedItem(validator.name) as
      | HTMLInputElement
      | HTMLTextAreaElement
    if (field) {
      this.validators.push({
        ...validator,
        field,
      })
    } else {
      console.error(`Element '${validator.name}' niet gevonden in de form.`)
    }
  }

  public validate(): boolean {
    this.validators.forEach((el) => {
      let isValid = false
      if (
        el.field instanceof HTMLInputElement ||
        el.field instanceof HTMLTextAreaElement
      ) {
        isValid = el.method(el.field)
      } else if (el.field instanceof NodeList) {
        for (let i = 0; i < el.field.length; i++) {
          const field = el.field[i] as HTMLInputElement | HTMLTextAreaElement
          if (el.method(field)) {
            isValid = true
            break
          }
        }
      }

      if (!isValid) {
        const foundIndex = this.errors.findIndex((x) => x.name === el.name)
        if (foundIndex === -1) {
          this.errors.push(el)
        }
      }
    })

    return this.errors.length === 0
  }

  private onSubmit(event: Event): void {
    this.resetSummary()
    this.removeInlineErrors()
    if (!this.validate()) {
      event.preventDefault()
      this.showInlineErrors()
      //this.showSummary()
      this.setFocusOnFirstError()
    }
  }

  public setFocusOnFirstError(): void {
    const firstError = document.querySelector(".field-error, .summary-error")
    if (firstError instanceof HTMLElement) {
      firstError.focus()
      const boundingBox = firstError.getBoundingClientRect()
      window.scrollTo({
        top: window.scrollY + boundingBox.top - 100, // dit kan je als offset gebruiken
        behavior: "smooth",
      })
    }
  }

  //Login validator code

  //public static initializeValidation(): void {
  //  const form = document.querySelector("#loginForm")
  //  if (!(form instanceof HTMLFormElement)) {
  //    throw new Error("Form element not found or not of type HTMLFormElement")
  //  }
  //
  //  const validator = new FormValidator(form)
  //  validator.addValidator({
  //    name: "Email",
  //    method: (field) => field.value.trim().length > 0,
  //    message: "Email is een verplicht veld en werd niet ingevuld",
  //  })
  //
  //  validator.addValidator({
  //    name: "Email",
  //    method: (field: HTMLInputElement | HTMLTextAreaElement) => {
  //      const regex =
  //        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  //      return regex.test(field.value.trim())
  //    },
  //    message: "Email is niet geldig",
  //  })
  //
  //  validator.addValidator({
  //    name: "Wachtwoord",
  //    method: (field) => field.value.trim().length > 0,
  //    message: "Gelieve een wachtwoord in te geven.",
  //  })
  //  validator.addValidator({
  //    name: "Wachtwoord",
  //    method: (field) => field.value.trim().length > 5,
  //    message: "Gelieve een wachtwoord van minstens 5 karakters in te geven",
  //  })
  //  validator.addValidator({
  //    name: "Wachtwoord",
  //    method: (field) =>
  //      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!#$%&’*+/=?^_`{|}~-]+$/.test(
  //        field.value.trim(),
  //      ),
  //    message: "Het wachtwoord moet minstens één letter en één cijfer bevatten",
  //  })
  //}
}
