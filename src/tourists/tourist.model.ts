import { ObjectId } from "mongodb";
import { Tourist } from "./tourist.type";
import { getTourists, addTourist,updateDoc, findTouristDB } from "./tourist.db";
import bcrypt from "bcrypt";
import { error } from "console";


export async function getAll(){
    return await getTourists();
}

export async function getById(id: string) {
    let query = { _id: new ObjectId(id) }
    let [tourist] = await getTourists(query);
    return tourist;
}


export async function insertTourist(
    first_name: string,
    last_name: string,
    phone_number: string,
    email: string,
    password: string
) {
    let newTourist: Tourist = {
        first_name,
        last_name,
        phone_number,
        email,
        password
    };
    return await addTourist(newTourist);

}


export async function update(id: string,
    first_name: string,
    last_name: string,
    phone_number: string,
    email: string,
    password: string
) {
    let tourist: Tourist = { first_name,
        last_name,
        phone_number,
        email,
        password: bcrypt.hashSync(password, 10)}

    return await updateDoc(id, tourist)
}

export async function createTourist(
    first_name: string,
    last_name: string,
    phone_number: string,
    email: string,
    password: string
) {
    let newTourist: Tourist = {
        first_name,
        last_name,
        phone_number,
        email,
        password: bcrypt.hashSync(password, 10)
    };
    return await addTourist(newTourist);

}


export async function findTourist(email: string, password: string) 
{
    let query = {email};
    let tourist = await findTouristDB(query)

    if(!tourist) {
        return { error: 'Tourist not found' }
    }
    if(!bcrypt.compareSync(password, tourist.password)) {
        return { error: 'Incorrect password' }
    }

    return { __firstname__: tourist.first_name, __lastname__: tourist.last_name, __email__: tourist.email }
}