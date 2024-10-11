import { Types } from "mongoose";


export interface IUser {
  name: string;
  image: string;

  email: string;
  password?: string;
  role: 'admin' | 'user';
  followers:Types.ObjectId[],
  isPremium:boolean,
  recipePublished: Types.ObjectId[],
  socialLinks:{name:'facebook' | "instagram",link:string}[]
}
