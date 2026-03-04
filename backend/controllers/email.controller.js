import { sendBulkEmails } from "../utils/email.utils.js";
import { createEmailAttachments } from "../utils/email.utils.js";
import { parseCsvBuffer } from "../utils/csv.utils.js";

export const sendEmail = async (req, res) => {
  const { sender, subject, template } = req.body;
  const { csv, attachments } = req.files;
  const csvFileBuffer = csv?.[0]?.buffer;
  const csvMimeType = csv?.[0]?.mimetype;

  // check for missing input fields
  if (!sender || !subject || !template)
    return res.status(400).json({ message: "Incomplete input" });

  // check if no csv file is uploaded
  if (!csv || !csvFileBuffer)
    return res.status(400).json({ message: "CSV file is required" });

  if (csvMimeType !== "text/csv") {
    return res.status(400).json({ message: "Please upload a CSV file" });
  }

  // parse csv buffer into javascript array of objects
  const recipients = await parseCsvBuffer(csvFileBuffer);

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
