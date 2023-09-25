import { IAdmin } from "./admin"
import { IUser } from "./user"

export interface IWebsite {
  id: number
  name: string
  url: string
  adminId?: IAdmin["id"]
  users?: IUser[]
}
