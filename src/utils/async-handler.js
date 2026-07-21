//we use this file because we dont want to use catch and etc so many times
const asyncHandler = (requestHandler) => {
      return (req,res,next) => {//the function returned by asyncHandler(this piece of code) is the wrapped controller. this wrapped controller will be sent to routes
        Promise
        .resolve(requestHandler(req,res,next))
        .catch((err) => next(err))//error is caught by this line and the next(err) will pass the error to the next middleware (error handler). ye express ka built feature hai. agar error aata hai to next(error) call hoga aur error handler middleware ko call karega
      }
}

export {asyncHandler}