import { hasRole } from "../scripts/auth.ts"

console.log(hasRole)

if (!hasRole("immo") || !hasRole("admin")) {
  location.assign(`/401/`)
}
