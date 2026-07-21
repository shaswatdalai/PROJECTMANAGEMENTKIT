//ye yaad karlo 
class ApiError extends Error{//aisa he likho hmesha. also we use inheritence cuz we have so many stuff to add to constructor makes it easier
    constructor(
        statusCode,
        message = " Something went wrong",
        errors = [],
        stack = ""//developer debugging information
    ){
        super(message)//refering the Error class using super. inheritence
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){

            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}; // this is called named export because this file has so many things