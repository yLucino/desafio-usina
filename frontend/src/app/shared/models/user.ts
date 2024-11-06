export class UserModel {
  id?: number;
  username!: string;
  password!: string;
  name!: string;
  city!: string;
  state!: string;
  country!: string;
  phone!: string;
  reviews?: string;
}