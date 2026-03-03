import transporter from "../config/email.config.js";

export const sendBulkEmails = async ({
  sender,
  recipients = [],
  subject,
  template,
  attachments,
}) => {
  for (const recipient of recipients) { 

    const emailMessage = {
      from: `${sender} <${process.env.EMAIL}>`,
      to: recipient.email,
      subject: `${subject}`,
      html: interpolateTemplate(template, recipient),
      attachments,
    };

    await transporter.sendMail(emailMessage);
    console.log(`Email sent to ${recipient.email}`);
  }
};

const interpolateTemplate = (template, recipients) => {
  return template.replace(/{{(.*?)}}/g, (_, captured) => {
    return recipients[captured] || "";
  });
};

export const createEmailAttachments = (files) => {
  return files.map((file) => ({
    filename: file.originalname,
    content: file.buffer,
    contentType: file.mimetype,
  }));
};
