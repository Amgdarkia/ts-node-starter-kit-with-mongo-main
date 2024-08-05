import { ObjectId } from "mongodb";
import { addGuide, findGuideDB, getGuides, updateDoc } from "./guide.db";
import { Guide } from "./guide.type";
import bcrypt from "bcrypt";
import { error } from "console";

export async function getAll(){
    return await getGuides();
    
}
export async function getById(id: string) {
    let query = { _id: new ObjectId(id) }
    let [guide] = await getGuides(query);
    return guide;
}
export async function insertGuide(
    first_name: string,
    last_name: string,
    bio: string,
    country: string,
    hasCar: boolean,
    average_rating: number,
    password: string,
    phone_number: string,
    email: string,
    languages: { language: string; proficiency_level: string }[]
) {
    let newGuide: Guide = {
        first_name,
        last_name,
        bio,
        country,
        hasCar,
        average_rating,
        password: bcrypt.hashSync(password, 10),
        phone_number,
        email,
        languages,
        routes: [], // Routes can be initialized as an empty array
        availability: [] // Availability can be initialized as an empty array
    };

    return await addGuide(newGuide);
}
export async function update(
    id: string,
    first_name: string,
    last_name: string,
    bio: string,
    country: string,
    hasCar: boolean,
    average_rating: number,
    password: string,
    phone_number: string,
    email: string,
    languages: { language: string; proficiency_level: string }[]) {
    let guide: Guide = {first_name,
        last_name,
        bio,
        country,
        hasCar,
        average_rating,
        password: bcrypt.hashSync(password, 10),
        phone_number,
        email,
        languages}
         return await updateDoc(id, guide)

}


export async function findGuide(email: string, password: string) {
    let query = { email };
    let guide = await findGuideDB(query);

    if(!guide){
        return {error: 'Guide not found'}
    }

    if (!bcrypt.compareSync(password, guide.password)) {
        return { error: 'Incorrect password' };
    }

    return { __firstname__: guide.first_name, __lastname__: guide.last_name, __email__: guide.email };

}