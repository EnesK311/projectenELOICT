export function getQueryStringParameters(url: string): Record<string, string> {
  const queryString = url.split("?")[1]
  if (!queryString) {
    return {}
  }

  const parameterPairs = queryString.split("&")
  const parameters: Record<string, string> = {}

  parameterPairs.forEach((pair) => {
    const [key, value] = pair.split("=")
    parameters[key] = decodeURIComponent(value || "")
  })

  return parameters
}
