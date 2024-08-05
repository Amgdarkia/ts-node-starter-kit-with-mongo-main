import { MongoClient, ObjectId } from "mongodb";
import { Guide } from "./guide.type";


const DB_INFO = {
    host: process.env.CONNECTION_STRING as string,
    db: process.env.DB_NAME,
    collection: 'guides'
}

export async function getGuides(query = {}, projection = {}) {
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


export async function addGuide(guide: Guide) {
    let mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).insertOne(guide);
    } catch (error) {
        throw error;
    }
    finally {
        mongo.close();
    }
}

export async function updateDoc(id: string, guide: Guide) {
    let mongo = new MongoClient(DB_INFO.host)
    try{
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).updateOne(
            {_id: new ObjectId(id) },
            { $set: guide}
        );
    } catch (error){
        throw error
    }
    finally{
        mongo.close();
    }
    
}

export async function findGuideDB(query = {}, projection = {}){

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