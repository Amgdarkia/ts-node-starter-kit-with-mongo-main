import { ObjectId } from "mongodb";



export type Tourist = {

    _id?: ObjectId;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    password: string;
}