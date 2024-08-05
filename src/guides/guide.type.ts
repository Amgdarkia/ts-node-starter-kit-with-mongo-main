import { ObjectId } from "mongodb";

export type Language = {
    language: string;
    proficiency_level: string;
};

export type Route = {
    route_id: number;
    description: string;
    duration: number;
    difficulty_level: string;
    start_point: string;
    end_point: string;
    route_type: string;
};

export type Availability = {
    date: Date;
    is_available: boolean;
    notes?: string;
};

export type Guide = {
    _id?: ObjectId;
    first_name: string;
    last_name: string;
    bio: string;
    country: string;
    hasCar: boolean;
    average_rating: number;
    password: string;
    phone_number: string;
    email: string;
    languages: Language[];
    routes?: Route[];
    availability?: Availability[];
};
