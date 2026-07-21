import mongoose, { Schema } from "mongoose"; //schema are the rules of mongo db
import bcrypt from "bcryptjs"; //bcrypt is used to hash the password. it is a one way hashing algorithm. it is used to hash the password before saving it to the database. it is also used to compare the password entered by the user with the hashed password stored in the database.
import crypto from "crypto"
const userSchema = new Schema(//first object is all the fields and their types and second object is the options
    {
      avatar:{//this is for profile picture of the user. it will have two fields url and localPath. url is the url of the image and localPath is the path of the image in the server. if the user uploads an image then we will save the image in the server and save the path in localPath and save the url in url. if the user does not upload an image then we will save the default image url in url and leave localPath empty.
        type: {
            url:String,
            localPath:String,

        },
        default:{
            url:`https://placehold.co/200x200`,
            localPath:""

        }
      },
      username:{
        type:String,
        required:true,//must exist
        unique:true,
        lowercase:true,
        trim:true,
        index:true
      },
      email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
      },
      fullName:{
        type:String,
        trim:true
      },
      password:{
        type:String,
        required:[true,"Password is required"]
      },
      isEmailVerified:{
        type:Boolean,
        default:false
      },
      refreshToken:{
        type:String
      },
      forgotPasswordToken:{
        type:String
      },
      forgotPasswordTokenExpiry:{
        type:Date
      },
      emailVerificationToken:{
        type:String

      },
      emailVerificationExpiry:{
        type:Date
      },

   },{
    timestamps:true //this will automatically add createdAt and updatedAt fields to the schema
   }

)
userSchema.pre("save",async function(next){//this function means before saving the user to the database, we will hash the password. this function is called a pre hook. it is called before saving the user to the database. it is used to perform some operations before saving the user to the database. in this case we are hashing the password before saving the user to the database.
    //every save hashes the password automatically   
    if(!this.isModified("password")) return next()//this is needed because if the user updates the user details without changing the password then we don't want to hash the password again. this will cause the password to be hashed again and the user will not be able to login with the old password. so we check if the password is modified or not. if it is not modified then we just call next() and return. if it is modified then we hash the password and then call next().
    this.password = await bcrypt.hash(this.password,10)
    next()// this just means continue to the next middleware. in this case it will save the user to the database.
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){//to send token
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email
        },
        process.env.ACCESSS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESSS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email

    },
    process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateTemporaryToken = function(){
    const  unHashedToken = crypto.randomBytes(20).toString("hex")//this will generate a random string of 20 bytes and convert it to hex format. this will be used as a token for email verification and forgot password. this token will be sent to the user via email and the user will use this token to verify their email or reset their password. this token will expire after 1 hour.
    
   const hashedToken = crypto
          .createHash("sha256")//this will create a hash of the token using sha256 algorithm. this is done to ensure that the token is not stored in plain text in the database. this way even if the database is compromised, the attacker will not be able to use the token to reset the password or verify the email.
          .update(unHashedToken)
          .digest("hex")//this will convert the hash to hex format. this is done to ensure that the hash is not stored in plain text in the database. this way even if the database is compromised, the attacker will not be able to use the hash to reset the password or verify the email.

    const tokenExpiry = Date.now() + (20*60*1000)//this will set the expiry time of the token to 20 minutes from now. this is done to ensure that the token is not valid for a long time. this way even if the attacker gets hold of the token, they will not be able to use it after 20 minutes.
    return {unHashedToken,hashedToken,tokenExpiry}//this will return the unHashedToken, hashedToken and tokenExpiry. the unHashedToken will be sent to the user via email and the hashedToken and tokenExpiry will be stored in the database. this way when the user clicks on the link in the email, we can compare the unHashedToken with the hashedToken in the database and check if the token is valid or not. if it is valid then we can reset the password or verify the email. if it is not valid then we can show an error message to the user.
}


export const User = mongoose.model("User", userSchema) //model is used to write and read data from the database. it is a class which we can use to create instances of the model. it is used to create, read, update and delete data from the database. it is used to interact with the database.