import { Request, Response } from 'express';
import { findGuide, getAll, getById, insertGuide, update } from './guide.model';

export async function getAllGuides(req: Request, res: Response) {
    try {
        let Guides = await getAll();
        res.status(200).json({ Guides });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error getting guides:', error);
            res.status(500).json({ error: error.message });
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({ error: 'Unknown error' });
        }
    }
}

export async function getGuideById(req: Request, res: Response) {
    try {
        let { id } = req.params;

        if (id.length != 24)
            return res.status(403).json({ message: 'invalid id' });

        let guide = await getById(id);

        if (!guide)
            res.status(404).json({ message: 'guide not found' });
        else
            res.status(200).json({ guide });
    } catch (error) {
        res.status(500).json({ error });
    }
}

export async function registerGuide(req: Request, res: Response) {
    try {
        const {
            first_name,
            last_name,
            bio,
            country,
            hasCar,
            average_rating,
            password,
            phone_number,
            email,
            languages
        } = req.body;

        // Validate required fields
        if (
            !first_name ||
            !last_name ||
            !bio ||
            !country ||
            hasCar === undefined ||
            average_rating === undefined ||
            !password ||
            !phone_number ||
            !email ||
            !languages || !Array.isArray(languages) || languages.length === 0
        ) {
            return res.status(400).json({ message: 'All fields are required, and languages must be an array with at least one entry' });
        }

        // Insert the guide
        let result = await insertGuide(
            first_name,
            last_name,
            bio,
            country,
            hasCar,
            average_rating,
            password,
            phone_number,
            email,
            languages
        );

        if (!result.acknowledged) {
            res.status(500).json({ message: 'Internal server error. Please try again' });
        } else {
            res.status(200).json({ result });
        }
    } catch (error) {
        console.error('Error adding guide:', error);
        res.status(500).json({ error });
    }
}


export async function updateGuide(req: Request, res: Response) {
    try {
        let {id} = req.params;
        let{first_name,
            last_name,
            bio,
            country,
            hasCar,
            average_rating,
            password,
            phone_number,
            email,
            languages} = req.body;
            if (
                !first_name ||
                !last_name ||
                !bio ||
                !country ||
                hasCar === undefined ||
                average_rating === undefined ||
                !password ||
                !phone_number ||
                !email ||
                !languages || !Array.isArray(languages) || languages.length === 0
            ) {
                return res.status(400).json({ message: 'All fields are required, and languages must be an array with at least one entry' });
            }
        
        let result  = await update(id,first_name,
            last_name,
            bio,
            country,
            hasCar,
            average_rating,
            password,
            phone_number,
            email,
            languages)
        
        if(result.modifiedCount == 0)
            res.status(404).json({message: 'guide not found'})
        else
            res.status(200).json({ result })
    }   catch(error){
        res.status(500).json({ error })
    }
    
}

export async function loginGuide(req: Request, res: Response) {
    try {
        let{email, password} = req.body;
        let result = await findGuide(email, password);
        if(result.error)
            return res.status(400).json([result])
        res.status(200).json({ success: 'OK', guide: result })
    } catch (error) {
        console.error('Error adding guide:', error);
        res.status(500).json({ error });
    }
}

