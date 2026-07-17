// in order to work with auth , we need jwt
import {User} from "../models/user.models.js"
import {ApiResponse} from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js";
import { ApiError}  from "../utils/api-error.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";
const generateAccessAndRefreshToken = asyncHandler(async(user) => {
    try {
        const user = await User.findById(userId)
        const accessToken =  user.generateAccessToken()//calls the instance method of the user model to generate access token. this is done in the user model. this is done automatically by mongoose. we don't have to do anything for that.
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken//this refresh token will be saved in the database. this is done in the user model. this is done automatically by mongoose. we don't have to do anything for that.
        await user.save({validateBeforeSave:false})//this will save the refresh token to the database. this is done in the user model. this is done automatically by mongoose. we don't have to do anything for that.
        return {accessToken,refreshToken}//this will return the access token and refresh token to the controller function. this is done in the user model. this is done automatically by mongoose. we don't have to do anything for that.
    }catch(error){
        throw new ApiError(500,"something went wrong while generating access and refresh token",[])
    }
})

const registerUser = asyncHandler(async(req,res) => {
       const {email,username,password,role} = req.body
       
       const existedUser = await User.findOne({//i dont want to register the user if the username or email already exists in the database. so i will check if the username or email already exists in the database. if it exists then i will throw an error. if it does not exist then i will create a new user and save it to the database.
        $or: [{username},{email}]//to chek if the username or email already exists in the database. $or is a mongoDB operator which is used to perform logical OR operation. it will return true if any of the condition is true. in this case it will return true if either username or email already exists in the database.
          
    })
    if(existedUser){
        throw new ApiError(409,"User with this username or email already exists",[])//409 means conflict. this error will be caught by the asyncHandler and passed to the next middleware (error handler). ye express ka built feature hai. agar error aata hai to next(error) call hoga aur error handler middleware ko call karega
    }
    //the capital 'User' is the model and the small 'user' is the instance of the model. we can use the model to create a new user and save it to the database. we can also use the model to find a user in the database. we can also use the model to update a user in the database. we can also use the model to delete a user from the database. we can also use the model to perform other operations on the user collection in the database.
    const user = await User.create({//this will create a new user and save it to the database. this will also hash the password before saving it to the database. this is done in the pre hook of the user schema. this is done automatically by mongoose. we don't have to do anything for that.
        email,password,username,isEmailVerified:false
    })

    const {unHashedToken,hashedToken,tokenExpiry} = user.generateTemporaryToken()//we will recieve hashed,unhashed and token expiry in the user instance. we will use the unhashed token to send it to the user in the email. we will use the hashed token to save it to the database. we will use the token expiry to set the expiry time of the token. this is done in the user model. this is done automatically by mongoose. we don't have to do anything for that.
    
    //these bottom two lines will save the hashed token and token expiry to the database. this is done in the user model. this is done automatically by mongoose. we don't have to do anything for that.
    user.emailVerificationToken = hashedToken
    user.emailVerificationExpiry = tokenExpiry
    
    await user.save({validateBeforeSave:false})//this will save the hashed token and token expiry to the database. this is done in the user model. this is done automatically by mongoose. we don't have to do anything for that.
    //final part is to send the token to the user via email. we will use the sendEmail function to send the email to the user. we will use the emailVerificationMailgenContent function to generate the email content. we will use the unHashedToken to send it to the user in the email. we will use the hashedToken to save it to the database. we will use the tokenExpiry to set the expiry time of the token. this is done in the user model. this is done automatically by mongoose. we don't have to do anything for that.
    await sendEmail({
        email:user?.email,
        subject:"please verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`

        )
    })
    //we dont need all the data from the user . below we wrote the stuff we dont need
    await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering a user")
    }
    return res 
      .status(201)
      .json(
        new ApiResponse(
            200,
            {user:createdUser},
            "User registered successfully and verification email has been sent on your email"
        )
      )
})

export {registerUser}