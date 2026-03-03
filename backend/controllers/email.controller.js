import { sendBulkEmails } from "../utils/email.utils.js";
import { createEmailAttachments } from "../utils/email.utils.js";

export const sendEmail = async (req, res) => {
  const { sender, recipients, subject, body } = req.body;
  const files = req.files;
  let parsedRecipients;

  // check for missing input fields
  if (!sender || !recipients || !subject || !body) {
    return res.status(400).json({ message: "Incomplete input" });
  }

  // parse recipients field
  try {
    parsedRecipients =
      typeof recipients === "string" ? JSON.parse(recipients) : recipients;
  } catch (error) {
    console.error("Error parsing recipients", error);
    return res.status(400).json({
      message: "Invalid recipients format",
    });
  }

  // check each recipients for their name and email (must have both)
  const invalidRecipient = parsedRecipients.find(
    (recipient) => !recipient.name || !recipient.email,
  );
  if (invalidRecipient)
    return res
      .status(400)
      .json({ message: "Each recipient must have their name and email" });

  //set up arguments for sending the email
  const emailAttachments = files && createEmailAttachments(files);
  const email = {
    sender,
    recipients: parsedRecipients,
    subject,
    body,
    attachments: emailAttachments || [],
  };

  // send email
  try {
    await sendBulkEmails(email);
    res.status(200).json({ message: "Emails sent" });
  } catch (error) {
    console.error("Error sending email", error);
    res.status(500).json({
      message: "Server error. A problem occured while trying to send email",
    });
  }
};
