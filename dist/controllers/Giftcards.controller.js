"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
exports.sendSMSgiftCard = sendSMSgiftCard;
exports.sendMail = sendMail;
exports.redeemGiftcard = redeemGiftcard;
exports.createGiftcard = createGiftcard;
exports.getCardById = getCardById;
const db_1 = require("../config/db");
const nodemailer_1 = __importDefault(require("nodemailer"));
const twilio_1 = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio_1.Twilio(accountSid, authToken);
// Send SMS function using Twilio
const sendSMS = async (req, res) => {
    const { phone, message } = req.body;
    if (!phone || !message) {
        return res
            .status(400)
            .json({ message: "Phone number and message are required." });
    }
    try {
        console.log("TWILIO_PHONE_NUMBER:", process.env.TWILIO_NUMBER); // Ensure it's being read correctly
        const smsResponse = await client.messages.create({
            body: message,
            from: process.env.TWILIO_NUMBER, // Twilio phone number from environment variable
            to: phone,
        });
        res.status(200).json({
            message: "SMS sent successfully",
            sid: smsResponse.sid,
        });
    }
    catch (error) {
        const err = error; // Cast error to a more specific Error type
        console.error("Twilio error:", err.message); // Log error details
        res.status(500).json({
            message: "Failed to send SMS",
            error: err.message,
        });
    }
};
exports.sendSMS = sendSMS;
// Define the sendSMSgiftCard function with type annotations
function sendSMSgiftCard(giftCard) {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER } = process.env;
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_NUMBER) {
        console.error("Twilio credentials are missing.");
        throw new Error("Twilio credentials are not properly configured.");
    }
    const client = new twilio_1.Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    // Generate the SMS content based on whether senderName is provided or not
    const smsContent = giftCard.senderName
        ? `Hi there, great news! 🎉 Your friend, ${giftCard.senderName}, has just sent you a gift card worth ${giftCard.balance} NIS to enjoy at ${giftCard.restaurant_name}! 
    Simply present this message at ${giftCard.restaurant_name} to redeem your gift card and savor a delightful dining experience.
    View your gift card details here: https://tabit-clone-app.vercel.app/gift-cards/card-details?cardId=${giftCard.cardId}`
        : `Hi there, congratulations! 🎉 You’ve just purchased a gift card worth ${giftCard.balance} NIS to enjoy at ${giftCard.restaurant_name}!
    Get ready for a delightful dining experience. Simply present this message at ${giftCard.restaurant_name} to redeem your gift card and enjoy your meal!
    View your gift card details here: https://tabit-clone-app.vercel.app/gift-cards/card-details?cardId=${giftCard.cardId}`;
    // Send the SMS using Twilio
    client.messages
        .create({
        body: smsContent,
        to: giftCard.phoneNumber,
        from: TWILIO_NUMBER,
    })
        .then((message) => console.log(`Message sent: ${message.sid}`))
        .catch((error) => console.error(`Error sending message: ${error.message}`));
}
async function sendMail({ to, subject, text, html, }) {
    try {
        // Create a transporter using your email service provider's SMTP settings
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail", // Service provider, can be 'gmail', 'yahoo', 'outlook', etc.
            auth: {
                user: process.env.EMAIL, // Sender email address from environment variable
                pass: process.env.EMAIL_PASSWORD, // Email password or app-specific password from environment variable
            },
        });
        // Define the email options
        const mailOptions = {
            from: process.env.EMAIL, // Sender address
            to: to, // List of recipients
            subject: subject, // Subject line
            text: text, // Plain text body
            html: html, // HTML body
        };
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    }
    catch (error) {
        // Use 'any' type for error to avoid TypeScript errors
        console.error("Error sending email:", error);
        throw new Error(`Failed to send email: ${error.message}`); // Throw a new Error with a message
    }
}
async function redeemGiftcard(req, res) {
    const { cardId } = req.params;
    if (!cardId) {
        res.status(400).json({ message: "Missing card ID" });
        return;
    }
    let connection;
    try {
        const pool = await (0, db_1.connectDB)();
        connection = await pool.getConnection();
        // Execute the DELETE query to redeem the gift card
        const [result] = await connection.query(`DELETE FROM Giftcards WHERE cardId = ?`, [cardId]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Gift card not found" });
            return;
        }
        res.status(200).json({ message: "Card redeemed successfully" });
    }
    catch (error) {
        console.error("Error redeeming card:", error);
        if (error.code === "ER_CON_COUNT_ERROR") {
            console.error("Too many connections to the database.");
        }
        else if (error.code === "ECONNREFUSED") {
            console.error("Database connection was refused.");
        }
        else if (error.code === "ETIMEDOUT") {
            console.error("Connection to the database timed out.");
        }
        else if (error.code === "ER_ACCESS_DENIED_ERROR") {
            console.error("Access denied for the database user.");
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
    finally {
        if (connection)
            connection.release();
    }
}
async function createGiftcard(req, res) {
    const { restId, firstName, lastName, phoneNumber, email, balance, senderName, restaurantName = "The Restaurant", } = req.body;
    // Validate required fields
    if (!restId ||
        !firstName ||
        !lastName ||
        (!phoneNumber && !email) ||
        !balance ||
        !senderName) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    let connection;
    try {
        const pool = await (0, db_1.connectDB)();
        connection = await pool.getConnection();
        // Call the stored procedure directly to create a new gift card
        const [rows] = await connection.query(`CALL InsertGiftCard(?, ?, ?, ?, ?, ?, ?)`, [restId, firstName, lastName, phoneNumber, email, balance, senderName]);
        const insertedId = rows[0]?.[0]?.insertedId;
        if (email) {
            let emailHtmlContent = "";
            if (senderName) {
                emailHtmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You've Received a Gift Card from Tabit!</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #1a73e8;
        padding: 20px;
        border-radius: 8px 8px 0 0;
        color: #ffffff;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 20px;
        text-align: center;
      }
      .content p {
        font-size: 18px;
        line-height: 1.6;
      }
      .cta-button {
        display: inline-block;
        margin: 20px auto;
        padding: 12px 20px;
        background-color: #1a73e8;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-size: 18px;
      }
      .footer {
        margin-top: 30px;
        text-align: center;
        color: #777;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>You've Received a Gift Card!</h1>
      </div>
      <div class="content">
        <p>Hi there,</p>
        <p>Great news! 🎉 Your friend, <strong>${senderName}</strong>, has just sent you a gift card worth <strong>${balance} NIS</strong> to enjoy at <strong>${restaurantName}</strong>!</p>
        <p>Whether it's a special occasion or just a treat, we hope this gift brings a smile to your face. Simply present this email at <strong>${restaurantName}</strong> to redeem your gift card and savor a delightful dining experience.</p>
        <a href="https://tabit-clone-app.vercel.app/gift-cards/card-details?cardId=${insertedId}" class="cta-button">View Gift Card</a>
      </div>
      <div class="footer">
        <p>Happy dining!</p>
        <p>The Tabit Team</p>
      </div>
    </div>
  </body>
  </html>
  `;
            }
            else {
                emailHtmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Gift Card from Tabit is Ready!</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #1a73e8;
        padding: 20px;
        border-radius: 8px 8px 0 0;
        color: #ffffff;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 20px;
        text-align: center;
      }
      .content p {
        font-size: 18px;
        line-height: 1.6;
      }
      .cta-button {
        display: inline-block;
        margin: 20px auto;
        padding: 12px 20px;
        background-color: #1a73e8;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-size: 18px;
      }
      .footer {
        margin-top: 30px;
        text-align: center;
        color: #777;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Your Gift Card is Ready!</h1>
      </div>
      <div class="content">
        <p>Hi there,</p>
        <p>Congratulations! 🎉 You’ve just purchased a gift card worth <strong>${balance} NIS</strong> to enjoy at <strong>${restaurantName}</strong>!</p>
        <p>Get ready for a delightful dining experience. Simply present this email at <strong>${restaurantName}</strong> to redeem your gift card and enjoy your meal!</p>
        <a href="https://tabit-clone-app.vercel.app/gift-cards/card-details?cardId=${insertedId}" class="cta-button">View Gift Card</a>
      </div>
      <div class="footer">
        <p>Happy dining!</p>
        <p>The Tabit Team</p>
      </div>
    </div>
  </body>
  </html>
  `;
            }
            sendMail({
                to: email,
                subject: "Tabit Giftcard",
                html: emailHtmlContent,
            });
        }
        if (phoneNumber) {
            const giftcard = {
                cardId: insertedId,
                phoneNumber: phoneNumber,
                balance: balance,
                restaurant_name: restaurantName,
                senderName,
            };
            sendSMSgiftCard(giftcard);
        }
        res.status(201).json({
            message: "Gift card created successfully",
            cardId: insertedId,
        });
    }
    catch (error) {
        console.error("Error creating gift card:", error);
        if (error.code === "ER_CON_COUNT_ERROR") {
            console.error("Too many connections to the database.");
        }
        else if (error.code === "ECONNREFUSED") {
            console.error("Database connection was refused.");
        }
        else if (error.code === "ETIMEDOUT") {
            console.error("Connection to the database timed out.");
        }
        else if (error.code === "ER_ACCESS_DENIED_ERROR") {
            console.error("Access denied for the database user.");
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
    finally {
        if (connection)
            connection.release();
    }
}
async function getCardById(req, res) {
    const { cardId } = req.params;
    if (!cardId) {
        res.status(400).json({ message: "Missing card ID" });
        return;
    }
    let connection;
    try {
        const pool = await (0, db_1.connectDB)();
        connection = await pool.getConnection();
        // Call the stored procedure to get the card by ID
        const [rows] = await connection.query(`CALL getCardById(?)`, [cardId]);
        if (!rows[0] || rows[0].length === 0) {
            res.status(404).json({ message: "Card not found." });
            return;
        }
        res.status(200).json(rows[0][0]); // The stored procedure returns a result set in an array
    }
    catch (error) {
        console.error("Error fetching card by ID:", error);
        if (error.code === "ER_CON_COUNT_ERROR") {
            console.error("Too many connections to the database.");
        }
        else if (error.code === "ECONNREFUSED") {
            console.error("Database connection was refused.");
        }
        else if (error.code === "ETIMEDOUT") {
            console.error("Connection to the database timed out.");
        }
        else if (error.code === "ER_ACCESS_DENIED_ERROR") {
            console.error("Access denied for the database user.");
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
    finally {
        if (connection)
            connection.release();
    }
}
