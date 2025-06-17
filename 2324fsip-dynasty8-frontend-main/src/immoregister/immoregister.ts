import { hasRole } from "../scripts/auth.ts"

if (!hasRole("user") && !hasRole("admin")) {
  location.assign(`../401/`)
}
