import type { AxiosResponse } from 'axios'
import { authAxios, myAxios } from '../instances/myAxios'
import type { PostUserDuelPayload, RegisterPayload } from '@/types'

// maps
const getMap = async <T>(id: number): Promise<AxiosResponse<T>> => {
    return myAxios.get<T>(`/map/${id}`)
}

const getMaps = async <T>(): Promise<AxiosResponse<T>> => {
    return myAxios.get<T>(`/maps`)
}

// gamemodes
const getGamemode = async <T>(id: number): Promise<AxiosResponse<T>> => {
    return myAxios.get<T>(`/gamemodes/${id}`)
}

const getGamemodes = async <T>(): Promise<AxiosResponse<T>> => {
    return myAxios.get<T>(`/gamemodes`)
}

// skins
const getSkins = async <T>(): Promise<AxiosResponse<T>> => {
    return myAxios.get<T>(`/skins`)
}

// Users
const getCsrfCookie = async <T>(): Promise<AxiosResponse<T>> => {
    return authAxios.get<T>('/sanctum/csrf-cookie', {baseURL: import.meta.env.VITE_BASE_URL})
}

const postLogin = async <T>(payload: {email: string, password: string}): Promise<AxiosResponse<T>> => {
    return authAxios.post<T>(`/login`, {
        email: payload.email,
        password: payload.password
    })
}

const postLogout = async <T>(): Promise<AxiosResponse<T>> => {
    return authAxios.post<T>(`/logout`)
}

const postRegister = async <T>(payload: RegisterPayload): Promise<AxiosResponse<T>> => {
    return authAxios.post<T>(`/register`, payload)
}

const getUser = async <T>(): Promise<AxiosResponse<T>> => {
    return authAxios.get<T>(`/user`)
}

const patchUser = async <T>(username: string): Promise<AxiosResponse<T>> => {
    return authAxios.patch<T>(`/user`, {
        username: username
    })
}

// Duels
const postUserDuel = async <T>(payload: PostUserDuelPayload): Promise<AxiosResponse<T>> => {
    return authAxios.post<T>(`/user/duel`, payload)
}

// Leaderboard
const getLeaderboard = async <T>(sort: string): Promise<AxiosResponse<T>> => {
    return authAxios.get<T>(`/leaderboard?sort=${sort}`)
}


export { getMap, getMaps, getGamemode, getGamemodes, getSkins, getCsrfCookie, postLogin, postLogout, postRegister, getUser, patchUser, postUserDuel, getLeaderboard }
