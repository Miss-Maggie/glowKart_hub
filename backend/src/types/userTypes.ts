export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'vendor' | 'shopper';
  password?: string;
}
