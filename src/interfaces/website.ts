import { IAddress } from "./address"
import { IAdmin } from "./admin"
import { IService } from "./service"
import { IUser } from "./user"

export interface IWebsite {
  id: number
  name: string
  url: string
  adminId?: IAdmin["id"]
  services?: IService[]
  admin?: IAdmin
  address?: IAddress[]
  users?: IUser[]
  createdAt?: Date
  updatedAt?: Date
}
