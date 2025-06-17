import { hasRole } from "../scripts/auth.ts"

console.log(hasRole("user"))

if (
  !hasRole("user") &&
  !hasRole("admin") &&
  !hasRole("employee") &&
  !hasRole("immo")
) {
  location.assign(`../redirect/401`)
}
