import {ApiResponse} from "../utils/api-response.js";

const healthCheck = (req, res) => {
    try{
       res.status(200).json(//bhejega in json format. status 200 means everything is fine
        new ApiResponse(200, {message:  "Server is up and running"}, "Health check successful")
       )
    }catch(error){
       
    } 
};

export {healthCheck};