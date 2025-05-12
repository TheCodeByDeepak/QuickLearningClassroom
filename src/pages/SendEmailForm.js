import React, { useState } from "react";
import axios from "axios";
import './CSS/SendEmailForm.css'

const SendEmailForm = ({ emails }) => {
  const [emailData, setEmailData] = useState({
    to: emails.join(", "), // Pre-populate with all emails
    subject: "Notification from Quick Learning", // Default subject
    message: "",
  });

  const [status, setStatus] = useState("");

  const predefinedMessages = {
    schedule: "Schedule updated. Please confirm your session.",
    attendance: "Your attendance for today has been successfully recorded.",
    marks: "Marks updated. Review your results.",
    fee: "Your fee payment has been successfully received. Thankyou.",
    blacklist: "Blacklist data has been noted. Please check.",
    test: "Test assigned review details and start preparing.",
    video: "Video uploaded view the latest content.",
    homework: "Homework assigned. Submit it on time.",
    homeworkstatus: "Homework status updated. Review the changes.",
    form: "New Form added. Please check and submit.",
    livelecture: "Live lecture link shared. Join the session.",
    studymaterial: "New study material uploaded. Check it now.",
    joinstatus: "Classroom joining status updated. Please Confirm.",

  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setEmailData((prevState) => ({
        ...prevState,
        message: prevState.message
          ? `${prevState.message}\n${value}`
          : value,
      }));
    } else {
      setEmailData((prevState) => ({
        ...prevState,
        message: prevState.message
          .split("\n")
          .filter((msg) => msg !== value)
          .join("\n"),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(""); // Reset status before sending

    try {
      const response = await axios.post("http://localhost:5000/api/test-email", emailData);
      if (response.data.success) {
        setStatus("Emails sent successfully!");
      } else {
        setStatus("Failed to send emails. Please try again.");
      }
    } catch (error) {
      setStatus("Error occurred: " + error.message);
    }
  };

  return (
    <div className='sendemailform-container'>
      <h3>Send Email</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="to" className="sendemailform-label">To:</label><div>
          <input
            type="text"
            id="to"
            name="to"
            value={emailData.to}
            disabled// Make the recipient field uneditable
            className="sendemailform-input"
          /></div>
        </div>
        <div>
          <label htmlFor="subject" className="sendemailform-label">Subject:</label><div>
          <input
            type="text"
            id="subject"
            name="subject"
            value={emailData.subject}
            disabled
            className="sendemailform-input"
          /></div>
        </div>
        <div>
          <label className="sendemailform-label">Select Messages:</label>
          <div>
            <label>
              <input
                type="checkbox"
                value={predefinedMessages.schedule}
                onChange={handleCheckboxChange}
                className="sendemailform-checkbox"
              />
              Schedule
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value={predefinedMessages.attendance}
                onChange={handleCheckboxChange}
                className="sendemailform-checkbox"
              />
              Attendance
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value={predefinedMessages.marks}
                onChange={handleCheckboxChange}
                className="sendemailform-checkbox"
              />
              Marks Updated
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value={predefinedMessages.fee}
                onChange={handleCheckboxChange}
                className="sendemailform-checkbox"
              />
              Fees Received
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value={predefinedMessages.blacklist}
                onChange={handleCheckboxChange}
                className="sendemailform-checkbox"
              />
              Blacklist
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value={predefinedMessages.test}
                onChange={handleCheckboxChange}
                className="sendemailform-checkbox"
              />
              Test Assigned
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value={predefinedMessages.video}
                onChange={handleCheckboxChange}
                className="sendemailform-checkbox"
              />
              Video Uploaded
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value={predefinedMessages.homework}
                onChange={handleCheckboxChange}
                className="sendemailform-checkbox"
              />
              Homework Assigned
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value={predefinedMessages.homeworkstatus}
                onChange={handleCheckboxChange}
                className="sendemailform-checkbox"
              />
              Homework Status Updated
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value={predefinedMessages.form}
                onChange={handleCheckboxChange}
                className="sendemailform-checkbox"
              />
              Form Uploaded
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value={predefinedMessages.livelecture}
                onChange={handleCheckboxChange}
                className="sendemailform-checkbox"
              />
              Live Lecture Updated
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value={predefinedMessages.studymaterial}
                onChange={handleCheckboxChange}
                className="sendemailform-checkbox"
              />
              Study Material Uploaded
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                value={predefinedMessages.joinstatus}
                onChange={handleCheckboxChange}
                className="sendemailform-checkbox"
              />
              Updated Join Status
            </label>
          </div>
        </div>
        <button type="submit" className="sendemailform-submit">Send Email</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default SendEmailForm;
