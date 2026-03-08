import { parseCsvBuffer } from "../utils/csv.utils.js";

export const uploadCsv = async (req, res) => {
  const csv = req.file;
  try {
    // check if no csv is uploaded
    if (!csv) return res.status(400).json({ message: "No CSV file uploaded" });

    // make sure uploaded file is CSV
    if (csv.mimetype !== "text/csv")
      return res.status(400).json({ message: "Upload CSV file only" });

    // parse csv buffer
    const csvContent = await parseCsvBuffer(csv.buffer);

    res.status(200).json({ message: "CSV File uploaded", csvContent });
  } catch (error) {
    console.error("Error while uploading csv file", error);
    res.status(500).json({
      message:
        "Server error. A problem occured while trying to upload the CSV file",
    });
  }
};
