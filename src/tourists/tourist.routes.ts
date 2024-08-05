import { Router } from "express";
import { getAllTourists,getTouristById,addTourist,updateTourist,registerTourist,loginTourist,addReview,addBooking,cancelBooking } from "./tourist.controller";

const TouristRouter = Router();


TouristRouter 
    .get('/', getAllTourists)
    .get('/:id', getTouristById)
    .post('/', addTourist)
    .put('/:id',updateTourist )
    .post('/register', registerTourist)
    .post('/login', loginTourist)
    .post('/review', addReview)
    .post('/booking', addBooking)
    .post('/cancel', cancelBooking)






export default TouristRouter