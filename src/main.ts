import 'dotenv/config';
import express from 'express';
import GuideRouter from './guides/guide.routes';
import TouristRouter from './tourists/tourist.routes';


const PORT = process.env.PORT || 7777; 

//create the server 
const server = express();

//config JSON support
server.use(express.json());

//using routes
server.use('/api/guides', GuideRouter);
server.use('/api/tourists', TouristRouter);
//run the server
server.listen(PORT, () => console.log(`[Server] http://localhost:${PORT}`));