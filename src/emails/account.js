const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'imilitus@gmail.com',
        subject: 'Welcome to the task manager app.',
        text: `Welcome to the app ${name}. Feedbacks on how you get along with the app would be appreciated.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'imilitus@gmail.com',
        subject: 'Account Deleted',
        text: `Sad to see you go, ${name}. Is there anything we could have done to keep you?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}