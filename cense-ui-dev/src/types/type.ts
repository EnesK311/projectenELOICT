export type ValidationErrors = {
  [K in keyof RegisterPayload]?: string | undefined
}

export interface RegisterPayload {
  email: string
  password: string
  firstname?: string
  lastname?: string
  street_and_housenumber?: string
  city?: string
  zip?: number | null
  confirmPassword?: string
}

export interface ForgotPasswordRequest {
  email?: string | null
}

export interface HttpValidationProblemDetails {
  type?: string | null
  title?: string | null
  status?: number | null
  detail?: string | null
  instance?: string | null
  errors?: Record<string, string[]> | null
}

export interface InfoRequest {
  newEmail?: string | null
  newPassword?: string | null
  oldPassword?: string | null
}

export interface InfoResponse {
  email?: string | null
  isEmailConfirmed: boolean
}

export interface LoginRequest {
  email: string
  password: string
  twoFactorCode?: string | null
  twoFactorRecoveryCode?: string | null
}

export interface RefreshRequest {
  refreshToken?: string | null
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface ResendConfirmationEmailRequest {
  email?: string | null
}

export interface ResetPasswordRequest {
  email?: string | null
  resetCode?: string | null
  newPassword?: string | null
}

export interface TwoFactorRequest {
  enable?: boolean | null
  twoFactorCode?: string | null
  resetSharedKey?: boolean
  resetRecoveryCodes?: boolean
  forgetMachine?: boolean
}

export interface TwoFactorResponse {
  sharedKey?: string | null
  recoveryCodesLeft: number
  recoveryCodes?: string[] | null
  isTwoFactorEnabled: boolean
  isMachineRemembered: boolean
}

export interface APIResponse<> {
  success?: boolean
  message?: string
  errors?: { [key: string]: string[] }
  data?: [] | object
  status?: number
  tokenType?: string
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
}

export interface Message {
  userId: string
  recipientId: string
  content: string
  timeStamp: string
  chatId: string
  isRead: boolean
}

export interface MessageDto {
  UserId: string
  RecipientId: string
  Content: string
  TimeStamp: string
  ChatId: string
  IsRead: boolean
}

export interface StatusDto {
  UserId: string
  IsOnline: boolean
}

export interface ChatUser {
  userId: string
  firstname?: string
  lastname?: string
  profilePicture?: string
  isOnline?: boolean
  color?: string
}

export interface Chat {
  chatId: string
  chatName?: string
  users: ChatUser[]
  lastMessage?: { content: string; timeStamp: string; user: ChatUser }
  unreadMessageCount?: number
}

export interface UnreadMessageCount {
  chatId: string
  unreadCount: number
}

export interface User {
  id?: string
  email: string
  firstname: string
  lastname: string
  bio?: string | null
  age?: number | null
  profilePicture?: string | null
  color?: string | null
  functionTitle?: string | null
  company?: Company
  isOnline?: boolean
  projects?: Project[]
  specialities?: Specialities
  experience?: string
}
export interface SpecialityInput {
  name: string
  category: number
}
export interface Specialities {
  known?: SpecialityInput[]
  needed?: SpecialityInput[]
}
export interface Company {
  id: string
  name: string
  street: string
  houseNumber: string
  city: string
  postalcode: string
  country: string
  latitude: number
  longitude: number
}

export interface GetFilters {
  term?: string
  distance?: number
  knowledge?: string[]
  functionTitle?: string
  sort?: string
}

export interface Speciality {
  id?: string
  category: number
  specialityType: string
  userSpecialities?: User[]
  name?: string
}

export interface PutPayload {
  firstname?: string
  lastname?: string
  bio?: string
  age?: number
  functionTitle?: string
  profilePicture?: File | null
  profilePictureLink?: string
  color?: string
  company?: PutCompany
  // specialities?: Specialities
  specialitiesJson?: {
    Known: { Name: string; Category: number }[]
    Needed: { Name: string; Category: number }[]
  }
}

export interface PutCompany {
  name: string
  street: string
  houseNumber: string
  city: string
  postalcode: string
}

export interface SocketEvent {
  Type: string
  Payload: object
}

export interface Project {
  id: number
  name: string
  year?: number
  month?: number
  userId?: string
}

export interface NewProject {
  name: string
  year?: number
  month?: number
  userId?: string
}

export interface ProjectResponse {
data: Project[]
}
