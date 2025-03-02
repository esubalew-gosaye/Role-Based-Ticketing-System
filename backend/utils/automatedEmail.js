import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import transporter from '../utils/sendMail.js';
// import User from '../models/userModel.js';
import logger from '../utils/logger.js'; // Ensure you have a logger configured

const sendEmailForInactive = () => {
  logger.debug("sending email for inactive users every day.");

  cron.schedule('*/25 * * * * *', async () => {  
    try {
      const inactiveUsers = await User.find({ verified: false });
      const templatePath = path.join(process.cwd(), 'templates', 'email', 'activateAccount.html');

      for (const user of inactiveUsers) {
        let emailTemplate = fs.readFileSync(templatePath, 'utf8');

        // Replace placeholders with actual data
        emailTemplate = emailTemplate
          .replace('{USER_NAME}', user.email)
          .replace('{ACTIVATION_LINK}', `http://localhost:${process.env.PORT}/api/auth/${user._id}`);

        const sentEmail = await transporter.sendMail({
          from: process.env.NODEMAILER_EMAIL || 'mesaye2010@gmail.com',
          to: user.email,
          subject: 'Activate Your Account',
          html: emailTemplate,
        });

        if (sentEmail.accepted.length === 1) {
          logger.info(`Email sent to ${user.email} to activate its account.`);
        }
      }
    } catch (error) {
      logger.error("Error sending inactive user emails:", error);
    }
  });
};

export default sendEmailForInactive;
