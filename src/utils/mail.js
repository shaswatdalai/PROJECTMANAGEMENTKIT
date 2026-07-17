import mailgen from 'mailgen';//this is for generating beautiful email templates
import nodemailer from 'nodemailer';//this is for sending emails

const sendEmail = async (options) => {//options is an object which will have the following properties : to, subject, text, html. to is the email address of the recipient, subject is the subject of the email, text is the plain text version of the email and html is the html version of the email. we will use nodemailer to send the email and mailgen to generate beautiful email templates.
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name:"Task Manager",//this is the name of the product which will be displayed in the email template
            link:"https://taskmanagelink.com"//this is the link of the product which will be displayed in the email template
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)//this will generate the plain text version of the email template. we will use this to send the email in plain text format. this is optional but it is a good practice to send the email in plain text format as well. because some email clients do not support html emails and they will display the email in plain text format. so it is a good practice to send the email in plain text format as well.
    const emailHtml = mailGenerator.generate(options.mailgenContent)//this will generate the html version of the email template. we will use this to send the email in html format. this is optional but it is a good practice to send the email in html format as well. because some email clients do not support html emails and they will display the email in plain text format. so it is a good practice to send the email in html format as well.

   const trasporter =  nodemailer.createTransport({//this is the configuration for the email transporter. we will use this to send the email. we will use mailtrap for testing purpose. mailtrap is a fake SMTP server which will catch all the emails sent to it and display them in the mailtrap dashboard. this way we can test our email sending functionality without actually sending the email to the recipient. we can also use other email services like gmail, sendgrid, etc. but for testing purpose we will use mailtrap.
        host:process.env.MAILTRAP_SMTP_HOST,
        port:process.env.MAILTRAP_SMTP_PORT,
        auth:{
            user:process.env.MAILTRAP_SMTP_USER,
            pass:process.env.MAILTRAP_SMTP_PASS
        }
    })

    const mail = {
        from: "mailtaskmanager@example.com",
        to: options.email,//option will contain the email address of the recipient. this will be passed from the controller function where we will call this sendEmail function.
        subject: options.subject,
        text: emailTextual,//browser will choose this one if the email client does not support html emails. this is optional but it is a good practice to send the email in plain text format as well. because some email clients do not support html emails and they will display the email in plain text format. so it is a good practice to send the email in plain text format as well.
        html: emailHtml//if it supports html email , then automatically this will be chosen 
    }

    try{
        await transporter.sendMail(mail)
    }
    catch(error){
        console.error("Error sending email, Make sure that you have provided your MailTrap credentials properly", error)
        throw error
    }

}




const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to our application!we are excited to have you on board .",
            action: {
                instruction: "to verify your email address , please click on the following button",
                button: {
                    color: "#22BC66",//optional action button color
                    text: "Verify your email",
                    link: verificationUrl,
                },
            },
            outro: "Need help,or have questions?just reply to this mail , we would love to help you."
        }
    }
}




const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "we got a request reset the password of your account.",
            action: {
                instruction: "to reset your password , please click on the following button",
                button: {
                    color: "#771515",//optional action button color
                    text: "Reset your password",
                    link: passwordResetUrl,
                },
            },
            outro: "Need help,or have questions?just reply to this mail , we would love to help you."
        }
    }
}

export{
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
}





