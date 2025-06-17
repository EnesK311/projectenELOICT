import type { PutCompany, PutPayload } from '@/types/type'
import defaultProfilePicture from '@/assets/images/blankprofilepic.png'

export const fillFormData = (payload: PutPayload): FormData => {
  const formData = new FormData()
  fillInfoFormData(formData, payload)
  fillCompanyFormData(formData, payload.company)
  fillSpecialitiesFormData(formData, payload)

  return formData
}

export const fillInfoFormData = (
  formData: FormData,
  info: {
    firstname?: string
    lastname?: string
    functionTitle?: string
    bio?: string
    age?: number
    profilePicture?: File | null
    profilePictureLink?: string
    yearsOfExperience?: string
  },
): FormData => {
  formData.append('Firstname', info.firstname || '')
  formData.append('Lastname', info.lastname || '')
  formData.append('Bio', info.bio || '')
  formData.append('Age', String(info.age || ''))
  formData.append('FunctionTitle', info.functionTitle || '')
  formData.append('Experience', info.yearsOfExperience || '')
  return formData
}

export const fillCompanyFormData = (
  formData: FormData,
  company: PutCompany | undefined,
): FormData => {
  if (company) {
    formData.append('Company[Name]', company.name || '')
    formData.append('Company[Street]', company.street || '')
    formData.append('Company[HouseNumber]', String(company.houseNumber || ''))
    formData.append('Company[City]', company.city || '')
    formData.append('Company[PostalCode]', String(company.postalcode || ''))
    formData.append('Company[Country]', 'Belgium')
  }

  return formData
}

export const fillSpecialitiesFormData = (
  formData: FormData,
  payload: PutPayload,
): FormData => {
  if (payload.specialitiesJson) {
    formData.append(
      'SpecialitiesJson',
      JSON.stringify(payload.specialitiesJson || ''),
    )
  }

  if (payload.profilePicture) {
    formData.append('profilePicture', payload.profilePicture)
  }

  if (payload.profilePictureLink) {
    formData.append('profilePictureLink', payload.profilePictureLink)
  }

  if (payload.color) formData.append('Color', payload.color)

  return formData
}

export const formatTime = (date: string | Date) => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date
  if (isNaN(parsedDate.getTime())) return 'Ongeldige datum'

  const today = new Date()
  const isToday =
    parsedDate.getDate() === today.getDate() &&
    parsedDate.getMonth() === today.getMonth() &&
    parsedDate.getFullYear() === today.getFullYear()

  return isToday
    ? parsedDate.toLocaleTimeString('nl-BE', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : parsedDate
        .toLocaleDateString('nl-BE', {
          weekday: 'short',
        })
        .slice(0, 2)
}

export const handleProfilePicture = (
  img: string | null | undefined,
  isOnline?: boolean,
): string => {
  const animated = getAnimatedEmoji(img, isOnline || true)
  return img ? (animated ? animated : img) : defaultProfilePicture
}

export const emojis = [
  {
    normal:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736425814/woman_3d_default_v6v57f.png',
    animated:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736431013/Woman_zli1cx.png',
  },
  {
    animated:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736431011/Woman_Teacher_w4fi88.png',
    normal:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736432436/woman_teacher_3d_default_fzhuyk.png',
  },
  {
    animated:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736431011/Woman_Technologist_px6ax4.png',
    normal:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736425814/woman_technologist_3d_default_amoqct.png',
  },
  {
    animated:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736431009/Woman_Office_Worker_lhcyxk.png',
    normal:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736431802/woman_office_worker_3d_default_xmlcaz.png',
  },
  {
    animated:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736430940/Woman_Mechanic_jap4zj.png',
    normal:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736425814/woman_mechanic_3d_default_gpde8z.png',
  },
  {
    animated:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736430883/Person_nytkta.png',

    normal:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736425813/person_3d_default_x5fgkc.png',
  },
  {
    animated:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736430882/Person_Gesturing_OK_oq8mco.png',
    normal:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736431909/person_gesturing_ok_3d_default_xxs7xm.png',
  },
  {
    animated:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736430882/Woman_Construction_Worker_iuj4qx.png',
    normal:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736425813/woman_construction_worker_3d_default_gw26jk.png',
  },
  {
    animated:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736430882/Woman_Factory_Worker_hsjvm5.png',
    normal:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736425813/woman_factory_worker_3d_default_vy0l8b.png',
  },
  {
    animated:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736430881/Person_Raising_Hand_yy9tdx.png',
    normal:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736432037/person_raising_hand_3d_default_nq4s7s.png',
  },
  {
    animated:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736430880/Office_Worker_dqcdck.png',

    normal:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736431802/office_worker_3d_default_qemz3n.png',
  },
  {
    animated:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736430880/Mechanic_sahwzn.png',
    normal:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736425813/mechanic_3d_default_qu38yi.png',
  },
  {
    animated:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736430879/Man_Raising_Hand_i8ngsi.png',
    normal:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736425813/man_raising_hand_3d_default_d2xvob.png',
  },
  {
    animated:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736430392/Construction_Worker_wcp7sh.png',
    normal:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736432215/construction_worker_3d_default_dpub1c.png',
  },
  {
    animated:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736430882/Man_Technologist_iwroxv.png',
    normal:
      'https://res.cloudinary.com/dvcbrtb9j/image/upload/v1736425813/technologist_3d_default_w3tvgy.png',
  },
]

export const getAnimatedEmoji = (
  url: string | null | undefined,
  isOnline: boolean,
): string => {
  if (!isOnline) return ''
  const emoji = emojis.find(emoji => emoji.normal === url)
  return emoji ? emoji.animated : ''
}

export const getNormalEmoji = (url: string | null | undefined): string => {
  const emoji = emojis.find(emoji => emoji.normal === url)
  return emoji ? emoji.normal : ''
}
