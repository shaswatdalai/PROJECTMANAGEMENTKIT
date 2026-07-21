import {ApiResponse} from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";

/** 
const healthCheck = async (req, res,next) => {
    try{
        const user = await getUserFromDB();  // Assuming this function retrieves user data from the database
       res.status(200).json(//bhejega in json format. status 200 means everything is fine
        new ApiResponse(200, {message:  "Server is up and running"}, "Health check successful")
       )
    }catch(error){
       next(error) // pass the error to the next middleware (error handler). ye express ka built feature hai. agar error aata hai to next(error) call hoga aur error handler middleware ko call karega
    } 
};
*/
const healthCheck = asyncHandler(async(req,res) => {//here the anonymous function is passed to asyncHandler which will handle the error if any occurs in the function. This way we don't have to write try-catch block in every controller function. It will automatically catch the error and pass it to the next middleware (error handler). this is the controller here , not the asyncHandler. asyncHandler is just a wrapper function which will handle the error if any occurs in the controller function. This way we don't have to write try-catch block in every controller function. It will automatically catch the error and pass it to the next middleware (error handler).
    res.status(200).json(
        new ApiResponse(200, {message:  "Server is up and running"}, "Health check successful")
    )})
export {healthCheck};