import cron from 'node-cron';
import express from 'express';
import http from 'http';
import nodemailer from 'nodemailer';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Create express App
const app = express();

// Setup nodemailer transport
const mailOPtions = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
};

const transporter = nodemailer.createTransport(mailOPtions);

// Create server
const server = http.createServer(app);

// Run cron job every day @ 11:59
cron.schedule('59 23 * * *', async () => {
    // Send Email
    const mailData = {
        from: 'support@example.com',
        to: 'testuser@example.com',
        subject: 'Test Mail',
        text: 'Oh year, this is a test mail',
        priority: 'high',
    };
    await transporter.sendMail(mailData, (err, data) => {
        if (err) throw new Error(err.message);
        console.log('Test Mail Sent!');
    });

    // Clear Log file
    // fs.truncate('./error.log', 0, err => {
    //     if (err) throw new Error(err.message);
    //     console.log('Log cleared');
    // });
});

// Start Server
const port = process.env.PORT || 4000;
server.listen(port, () => console.log('Server started on port: ', port));
