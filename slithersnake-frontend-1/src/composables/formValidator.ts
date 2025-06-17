import type { RegisterPayload } from "@/types";
import { watch } from "vue";
import { ref } from "vue";

export function useFormValidator(payload: RegisterPayload) {
    const valid = ref<boolean>(false)
    const errs = ref<string[]>([])

    !payload.username ? errs.value.push('Fill in a username') : ''
    !payload.email ? errs.value.push('Fill in an email') : ''
    !payload.password ? errs.value.push('Fill in a password') : ''
    !payload.passwordRepeat ? errs.value.push('Fill in a password repeat') : ''
    
    if (errs.value.length == 0 && payload.password === payload.passwordRepeat) {
        valid.value = true
    } else {
        errs.value.push('Password and password repeat must be the same')
    }

    return { valid, errs }
}