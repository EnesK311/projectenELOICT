import { hasRole } from "../scripts/auth.ts"

if (!hasRole("immo") && !hasRole("admin") && !hasRole("employee")) {
  location.assign(`/401/`)
}
