import { Router } from "express";
import { getAllGuides,registerGuide,getGuideById,updateGuide} from "./guide.controller";

const GuideRouter = Router();


GuideRouter
        .get('/', getAllGuides)
        .get('/:id', getGuideById) 
        .post('/', registerGuide)
        .put('/:id',updateGuide )
        


export default GuideRouter  