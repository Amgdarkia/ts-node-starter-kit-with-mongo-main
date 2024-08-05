import { Request, Response } from "express";
import { getAll, getById, insertTourist, update,createTourist, findTourist } from "./tourist.model";
import { MongoClient, ObjectId } from "mongodb";

const DB_INFO = {
    host: process.env.CONNECTION_STRING as string,
    db: process.env.DB_NAME,
    guidesCollection: 'guides',
    touristsCollection: 'tourists',
    bookingsCollection: 'bookings',
    reviewsCollection: 'reviews'
};
export async function getAllTourists(req: Request, res: Response) {
    try {
        let tourists = await getAll();
        res.status(200).json({ tourists });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error getting tourists:', error);
            res.status(500).json({ error: error.message });
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({ error: 'Unknown error' });
        }
    }
}


export async function getTouristById(req: Request, res: Response) {
    try {
        let { id } = req.params;
        if (id.length != 24)
            return res.status(403).json({ message: 'invalid id' });
        let tourist = await getById(id);
        if (!tourist)
            res.status(404).json({ message: 'tourist not found' });
        else
            res.status(200).json({ tourist });
    } catch (error) {
        res.status(500).json({ error });
    }
}


export async function addTourist(req: Request, res: Response) {
    try {
        const {
            first_name,
            last_name,
            phone_number,
            email,
            password
        } = req.body;
        // Validate required fields
        if(
            first_name === undefined ||
            !last_name ||
            !phone_number ||
            !email ||
            !password
        ){
            return res.status(403).json({ message: 'invalid data' });
        }
        let result = await insertTourist(
            first_name,
            last_name,
            phone_number,
            email,
            password
        );
        if (!result.acknowledged) {
            res.status(500).json({ message: 'Internal server error. Please try again' });
        } else {
            res.status(200).json({ result });
        }
    } catch (error) {
        console.error('Error adding tourist:', error);
        res.status(500).json({ error });
    }
}


export async function updateTourist(req: Request, res: Response) {
    try {
        let { id } = req.params;
        let{
            first_name,
            last_name,
            phone_number,
            email,
            password
        } = req.body;
        if (id.length != 24)
            return res.status(403).json({ message: 'invalid id' });
        if (!first_name)
            return res.status(403).json({ message: 'first_name is required' });
        
        if (!last_name)
            return res.status(403).json({ message: 'last_name is required' });
        if (!password)
            return res.status(403).json({ message: 'password is required' });
        
        if (!phone_number)
            return res.status(403).json({ message: 'phone_number is required' });
        
        if (!email)
            return res.status(403).json({ message: 'email is required' });

        let result = await update(
            id,
            first_name,
            last_name,
            phone_number,
            email,
            password
        );
        if(result.modifiedCount == 0)
            res.status(404).json({message: 'tourist not found'})
        else
            res.status(200).json({ result })
    }   catch(error){
        res.status(500).json({ error })
    }
    
}


export async function registerTourist(req: Request, res: Response) {
    try {
        const {
            first_name,
            last_name,
            phone_number,
            email,
            password
        } = req.body;
        // Validate required fields
        if(
            first_name === undefined ||
            !last_name ||
            !phone_number ||
            !email ||
            !password
        ){
            return res.status(403).json({ message: 'invalid data' });
        }
        let result = await createTourist(
            first_name,
            last_name,
            phone_number,
            email,
            password
        );
       if (!result.insertedId)
      return res.status(400).json({ msg: 'db failed' });

    res.status(201).json({ success: 'OK', tourist: { _id: result.insertedId } });

  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function loginTourist(req: Request, res: Response) {
    try {
        let{email, password} = req.body;
        let result = await findTourist(email, password);

        if(result.error)
            return res.status(400).json([result])

        res.status(200).json({ success: 'OK', tourist: result });
    } catch (error) {
        
    }
}


export async function addReview(req: Request, res: Response) {
    const { guide_id, tourist_id, rating, comment, review_date } = req.body;

    // Validate required fields
    if (!guide_id || !tourist_id || rating === undefined || !comment || !review_date) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    let mongo = new MongoClient(DB_INFO.host);

    try {
        await mongo.connect();
        const db = mongo.db(DB_INFO.db);

        // Validate guide_id and tourist_id
        const guide = await db.collection(DB_INFO.guidesCollection).findOne({ _id: new ObjectId(guide_id) });
        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        const tourist = await db.collection(DB_INFO.touristsCollection).findOne({ _id: new ObjectId(tourist_id) });
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Insert the review
        const review = {
            guide_id: new ObjectId(guide_id),
            tourist_id: new ObjectId(tourist_id),
            rating,
            comment,
            review_date: new Date(review_date)
        };

        const result = await db.collection(DB_INFO.reviewsCollection).insertOne(review);

        if (!result.acknowledged) {
            return res.status(500).json({ message: 'Internal server error. Please try again' });
        }

        res.status(200).json({ message: 'Review added successfully', reviewId: result.insertedId });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error });
    } finally {
        await mongo.close();
    }
}


export async function addBooking(req: Request, res: Response) {
    const { tourist_id, guide_id, route_id, tour_date, booking_status, special_requests } = req.body;

    // Validate required fields
    if (!tourist_id || !guide_id || route_id === undefined || !tour_date || !booking_status) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    let mongo = new MongoClient(DB_INFO.host);

    try {
        await mongo.connect();
        const db = mongo.db(DB_INFO.db);

        // Validate guide_id
        const guide = await db.collection(DB_INFO.guidesCollection).findOne({ _id: new ObjectId(guide_id) });
        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        // Validate route_id
        const route = guide.routes.find((route: any) => route.route_id === route_id);
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }

        // Validate tourist_id
        const tourist = await db.collection(DB_INFO.touristsCollection).findOne({ _id: new ObjectId(tourist_id) });
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Insert the booking
        const booking = {
            tourist_id: new ObjectId(tourist_id),
            guide_id: new ObjectId(guide_id),
            route_id,
            tour_date: new Date(tour_date),
            booking_status,
            special_requests
        };

        const result = await db.collection(DB_INFO.bookingsCollection).insertOne(booking);

        if (!result.acknowledged) {
            return res.status(500).json({ message: 'Internal server error. Please try again' });
        }

        res.status(200).json({ message: 'Booking added successfully', bookingId: result.insertedId });
    } catch (error) {
        console.error('Error adding booking:', error);
        res.status(500).json({ error });
    } finally {
        await mongo.close();
    }
}



export async function cancelBooking(req: Request, res: Response) {
    const { booking_id } = req.body;

    // Validate required fields
    if (!booking_id) {
        return res.status(400).json({ message: 'Booking ID is required' });
    }

    if (booking_id.length !== 24) {
        return res.status(403).json({ message: 'Invalid Booking ID' });
    }

    let mongo = new MongoClient(DB_INFO.host);
    try {
        await mongo.connect();
        const db = mongo.db(DB_INFO.db);

        // Find the booking by ID
        const booking = await db.collection(DB_INFO.bookingsCollection).findOne({ _id: new ObjectId(booking_id) });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update the booking status to "Cancelled"
        const result = await db.collection(DB_INFO.bookingsCollection).updateOne(
            { _id: new ObjectId(booking_id) },
            { $set: { booking_status: 'Cancelled' } }
        );

        if (result.modifiedCount === 0) {
            return res.status(500).json({ message: 'Failed to cancel booking. Please try again' });
        }

        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({error });
    } finally {
        await mongo.close();
    }
}