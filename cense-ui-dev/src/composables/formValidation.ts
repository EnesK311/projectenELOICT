import type { Speciality } from '@/types/type'
import { ref, watch, type Ref } from 'vue'

type StringRule = (value: string) => string | null
type ArrayStringRule = (value: string[]) => string | null
type FileRule = (value: File | null) => string | null
type NumberRule = (value: number) => string | null

interface StringField {
  value: string
  rules: StringRule[]
}

interface ArrayObjectField<T> {
  value: T[]
  rules: ((value: T[]) => string | null)[]
}

interface ArrayStringField {
  value: string[]
  rules: ArrayStringRule[]
}

interface FileField {
  value: File | null
  rules: FileRule[]
}

interface NumberField {
  value: number | null
  rules: NumberRule[]
}

export interface FormValidation {
  [key: string]:
    | StringField
    | ArrayStringField
    | FileField
    | NumberField
    | ArrayObjectField<Speciality>
}

export const useFormValidation = (
  form: Ref<FormValidation>,
  submitted: Ref<boolean>,
) => {
  const errors = ref<{ [key: string]: string | null }>({})

  const validateField = (
    field:
      | StringField
      | ArrayStringField
      | FileField
      | NumberField
      | ArrayObjectField<Speciality>,
  ): string | null => {
    if ('value' in field) {
      if (Array.isArray(field.value)) {
        // Altijd de regels uitvoeren, ongeacht de array-lengte
        for (const rule of field.rules as unknown as ((
          value: unknown[],
        ) => string | null)[]) {
          const error = rule(field.value)
          if (error) {
            return error
          }
        }
      } else if (typeof field.value === 'string') {
        // Field is een StringField
        for (const rule of field.rules as StringRule[]) {
          const error = rule(field.value)
          if (error) {
            return error
          }
        }
      } else if (typeof field.value === 'number') {
        // Field is een NumberField
        for (const rule of field.rules as NumberRule[]) {
          const error = rule(field.value)
          if (error) {
            return error
          }
        }
      } else {
        // Field is een FileField
        for (const rule of field.rules as FileRule[]) {
          const error = rule(field.value)
          if (error) {
            return error
          }
        }
      }
    }
    return null
  }

  const validate = () => {
    if (!submitted.value) return
    errors.value = {}

    for (const key in form.value) {
      const field = form.value[key]
      const error = validateField(field)
      if (error) {
        errors.value[key] = error
      }
    }
  }

  watch(form, validate, { deep: true })

  return {
    errors,
    validate,
  }
}
