export function paginate(
  items: string[],
  itemsPerPage: number,
  paginationContainer: string,
  maxVisiblePages: number = 5,
): void {
  let currentPage: number = 1
  const totalPages: number = Math.ceil(items.length / itemsPerPage)
  const itemsContainer = document.querySelector("#items") as HTMLElement

  function showItems(page: number): void {
    const startIndex: number = (page - 1) * itemsPerPage
    const endIndex: number = startIndex + itemsPerPage
    const pageItems: string[] = items.slice(startIndex, endIndex)

    const itemsContainer: HTMLElement | null = document.querySelector("#items")
    if (itemsContainer) {
      itemsContainer.innerHTML = ""

      pageItems.forEach((item: string) => {
        const li: HTMLLIElement = document.createElement("li")
        li.innerText = item
        itemsContainer.appendChild(li)
      })
    }
  }

  function setupPagination(): void {
    const pagination: HTMLElement | null =
      document.querySelector(paginationContainer)
    if (pagination) {
      pagination.innerHTML = ""

      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2),
      )
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

      for (let i: number = startPage; i <= endPage; i++) {
        const link: HTMLAnchorElement = document.createElement("a")
        link.href = "#"
        link.innerText = i.toString()

        if (i === currentPage) {
          link.classList.add("active")
        }

        link.addEventListener("click", (event: Event) => {
          event.preventDefault()
          currentPage = i
          showItems(currentPage)

          const currentActive: HTMLElement | null =
            pagination.querySelector(".active")
          if (currentActive) {
            currentActive.classList.remove("active")
          }
          link.classList.add("active")
          const offset = 32 // kies hoeveel hoger dat je wil scrollen
          //scroll naar boven bij het klikken van een nieuwe pagina.
          window.scrollTo({
            top:
              itemsContainer?.getBoundingClientRect().top +
              window.scrollY -
              offset,
            behavior: "smooth",
          })
        })

        pagination.appendChild(link)
      }

      // previous btn
      if (startPage > 1) {
        const prevLink: HTMLAnchorElement = document.createElement("a")
        prevLink.href = "#"
        prevLink.innerText = "Vorige"

        prevLink.addEventListener("click", (event: Event) => {
          event.preventDefault()
          currentPage = Math.max(1, currentPage - 1)
          showItems(currentPage)
          setupPagination() // Update de links
        })

        pagination.insertBefore(prevLink, pagination.firstChild)
      }

      // next btn
      if (endPage < totalPages) {
        const nextLink: HTMLAnchorElement = document.createElement("a")
        nextLink.href = "#"
        nextLink.innerText = "Volgende"

        nextLink.addEventListener("click", (event: Event) => {
          event.preventDefault()
          currentPage = Math.min(totalPages, currentPage + 1)
          showItems(currentPage)
          setupPagination() // Update de links
        })

        pagination.appendChild(nextLink)
      }
    }
  }

  showItems(currentPage)
  setupPagination()
}
