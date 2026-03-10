import { sendBulkEmails } from "../utils/email.utils.js";
import { createEmailAttachments } from "../utils/email.utils.js";

export const sendEmail = async (req, res) => {
  let { sender, subject, template, recipients } = req.body;
  const attachments = req.files;

  // check for missing input fields
  if (!sender || !subject || !template)
    return res.status(400).json({ message: "Incomplete input" });

  if (!recipients)
    return res
      .status(400)
      .json({ message: "No email recipient is uploaded or found" });

  // parse recipients if they are a string
  try {
    if (typeof recipients === "string") {
      recipients = JSON.parse(recipients);
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid JSON format for recipients" });
  }

  // check if recipients is an array of object
  if (
    !Array.isArray(recipients) ||
    recipients.every(
      (recipient) => typeof recipient === "object" && recipient != null,
    )
  )
    return res
      .status(400)
      .json({ message: "Recipients must be an array of objects" });

  // find recipients that does not have an email
  const invalidRecipient = recipients.find((recipient) => !recipient.email);
  if (invalidRecipient)
    return res
      .status(400)
      .json({ message: "Each recipient must have their email" });

  // convert uploaded files into a format compatible with nodemailer attachments
  const emailAttachments = attachments
    ? createEmailAttachments(attachments)
    : [];

  // send email
  try {
    const { successful, failed } = await sendBulkEmails({
      sender,
      recipients,
      subject,
      template,
      attachments: emailAttachments || [],
    });

    res
      .status(200)
      .json({ message: "Sending email process completed", successful, failed });
  } catch (error) {
    console.error("Error sending email", error);
    res.status(500).json({
      message: "Server error. A problem occured while trying to send email",
    });
  }
};
