import { hasRole } from "../scripts/auth.ts"
import { refreshImmos } from "../scripts/immosService"

if (!hasRole("admin")) {
  location.assign(`/401/`)
}

void refreshImmos().then((r) => console.log(r))
