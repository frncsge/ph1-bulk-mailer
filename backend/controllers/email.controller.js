import { sendBulkEmails } from "../utils/email.utils.js";
import {
  createEmailAttachments
} from "../utils/email.utils.js";

export const sendEmail = async (req, res) => {
  const { sender, recipients, subject, template } = req.body;
  const files = req.files;
  let parsedRecipients;

  // check for missing input fields
  if (!sender || !recipients || !subject || !template) {
    return res.status(400).json({ message: "Incomplete input" });
  }

  // parse recipients field back into an array
  try {
    parsedRecipients =
      typeof recipients === "string" ? JSON.parse(recipients) : recipients;
  } catch (error) {
    console.error("Error parsing recipients", error);
    return res.status(400).json({
      message: "Invalid recipients format",
    });
  }

  // find recipients that does not have an email
  const invalidRecipient = parsedRecipients.find(
    (recipient) => !recipient.email,
  );
  if (invalidRecipient)
    return res
      .status(400)
      .json({ message: "Each recipient must have their email" });

  // convert uploaded files into a format compatible with nodemailer attachments
  const emailAttachments = files && createEmailAttachments(files);

  // send email
  try {
    await sendBulkEmails({
      sender,
      recipients: parsedRecipients,
      subject,
      template,
      attachments: emailAttachments || [],
    });

    res.status(200).json({ message: "Emails sent" });
  } catch (error) {
    console.error("Error sending email", error);
    res.status(500).json({
      message: "Server error. A problem occured while trying to send email",
    });
  }
};
