const { MailtrapClient } = require("mailtrap");

// Async function to send email
const sendEmail = async (options) => {
    const TOKEN = process.env.MAILTRAP_TOKEN;
    const SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL || "hello@demomailtrap.co";
    const SENDER_NAME = process.env.MAILTRAP_SENDER_NAME || "Mailtrap Test";

    // Initialize Mailtrap Client
    const client = new MailtrapClient({
        token: TOKEN,
    });

    const sender = {
        email: SENDER_EMAIL,
        name: SENDER_NAME,
    };

    // Recipients must be an array of objects with email property
    const recipients = [
        {
            email: options.email,
        }
    ];

    try {
        // Send email using Mailtrap
        const response = await client.send({
            from: sender,
            to: recipients,
            subject: options.subject,
            text: options.message,
            category: "Notification",
        });

        console.log('Message sent successfully. ID:', response.success ? 'Success' : 'Failed');
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Rethrow to be handled by controller
    }
};

module.exports = sendEmail;
