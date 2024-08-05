import { MongoClient,ObjectId } from "mongodb";
import { Tourist } from "./tourist.type";


const DB_INFO = {
    host: process.env.CONNECTION_STRING as string,
    db: process.env.DB_NAME,
    collection: 'tourists'
}



export async function getTourists(query = {}, projection = {}) {
    let mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).find(query, { projection }).toArray();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        console.error('Error details:', error);
        throw error;
    }
    finally {
        mongo.close();
    }
}

export async function addTourist(tourist: Tourist) {
    let mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).insertOne(tourist);
    } catch (error) {
        throw error;
    }
    finally {
        mongo.close();
    }
}


export async function updateDoc(id: string, tourist: Tourist) {
    let mongo = new MongoClient(DB_INFO.host)
    try{
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).updateOne(
            {_id: new ObjectId(id) },
            { $set: tourist}
        );
    } catch (error){
        throw error
    }
    finally{
        mongo.close();
    }
    
}


export async function findTouristDB(query = {}, projection = {}){

    let mongo = new MongoClient(DB_INFO.host);
    try{
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).findOne(query, { projection });
    } catch (error) {
        throw error;
      }
      finally {
        await mongo.close();
      }
    } 