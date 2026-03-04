import transporter from "../config/email.config.js";

export const sendBulkEmails = async ({
  sender,
  recipients = [],
  subject,
  template,
  attachments,
}) => {
  const successful = [];
  const failed = [];

  for (const recipient of recipients) {
    const emailMessage = {
      from: `${sender} <${process.env.EMAIL}>`,
      to: recipient.email,
      subject: `${subject}`,
      html: interpolateTemplate(template, recipient),
      attachments,
    };

    try {
      await transporter.sendMail(emailMessage);

      // push successful emails
      successful.push(recipient.email);
      console.log(`Email sent to ${recipient.email}`);
    } catch (error) {
      // push failed emails
      failed.push(recipient.email);
      console.error(
        `Failed to send email to ${recipient.email}:`,
        error.message,
      );
    }
  }

  return { successful, failed };
};

// replace placeholders in the template with
// the recipient data to make the email message
const interpolateTemplate = (template, recipient) => {
  return template.replace(/{{(.*?)}}/g, (_, captured) => {
    return recipient[captured] || "";
  });
};

export const createEmailAttachments = (files) => {
  return files.map((file) => ({
    filename: file.originalname,
    content: file.buffer,
    contentType: file.mimetype,
  }));
};
