import api from "./index"
import * as validator from 'validator'
import axios, { AxiosError, AxiosResponse } from "axios";
const { isEmail, isJWT } = validator.default

interface ILoginRequest {
  username: string
  password: string
}
interface ITokenResponse {
  token: string
  status: number
}
interface IRegisterRequest {
  username: string
  password: string
  email: string
}
export const authHeader = () => {
  const token = window.localStorage.getItem("token")

  if (token) {
    return { Authorization: token }
  } else {
    return {}
  }
}

class AuthSearvice {
  setToken(newToken: string) {
    const token = `Bearer ${newToken}`
    if (window.localStorage) {
      window.localStorage.setItem("token", token)
    }
  }

  async login(content: ILoginRequest) {
    const response: AxiosResponse<ITokenResponse> = await api.post("/auth/login", content)
    const token = response.data.token
    this.setToken(JSON.stringify(token))
    if (response.status === 200) return token
  }

  logout() {
    window.localStorage.removeItem("token")
  }

  async register(content: IRegisterRequest) {
    try {
      const response: AxiosResponse<ITokenResponse> = await api.post("/auth/register", content)
      if (response.status === 200) return response.data
    } catch (e) {
      if (axios.isAxiosError(e) && e.response && e.response.status === 400) {
        return {
          status: 400,
          message: e.message
        }
      }
    }
  }
}

export default new AuthSearvice