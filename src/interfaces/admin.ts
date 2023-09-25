import { IWebsite } from "./website"

export interface IAdmin {
  id: number
  email: string
  firstName?: string
  lastName?: string
  password: string
  websites?: IWebsite[]
  createdAt?: Date
  updatedAt?: Date
}
