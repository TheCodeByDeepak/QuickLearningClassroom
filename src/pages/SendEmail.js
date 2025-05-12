import React, { useState } from "react";
import axios from "axios";
import './CSS/SendEmail.css'

const SendEmailForm = () => {
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData({ ...emailData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(""); // Reset status before sending

    try {
      const response = await axios.post("http://localhost:5000/api/test-email", emailData);
      if (response.data.success) {
        setStatus("Email sent successfully!");
      } else {
        setStatus("Failed to send email. Please try again.");
      }
    } catch (error) {
      setStatus("Error occurred: " + error.message);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setEmailData({ ...emailData, to: clipboardText });

      // Show the message for 3 seconds
      setStatus("Pasted successfully!");
      setTimeout(() => setStatus(""), 3000); // Clear the status message after 3 seconds
    } catch (error) {
      setStatus("Failed to paste from clipboard: " + error.message);
    }
  };

  return (
    <div className='sendemail-container'>
      <h2 className="sendemail-title">Send Email</h2>
      <form onSubmit={handleSubmit}>
        <div>
        <div>
          <label htmlFor="to" className="sendemail-label">To:</label>
         <div>
            <input
              type="email"
              id="to"
              name="to"
              value={emailData.to}
              onChange={handleChange}
              required
               className="sendemail-input"
            />

            <button
              type="button"
              onClick={handlePaste}
              style={{
                marginLeft: "10px",
                padding: "7px 12px",
                cursor: "pointer",
                backgroundColor: "#1e90ff",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Paste
            </button></div>
          </div>
        </div>
        <div>
          <label htmlFor="subject" className="sendemail-label">Subject:</label><div>
          <input
            type="text"
            id="subject"
            name="subject"
            value={emailData.subject}
            onChange={handleChange}
            required
              className="sendemail-input"
          /></div>
        </div>
        <div>
          <label htmlFor="message" className="sendemail-label">Message:</label><div>
          <textarea
            id="message"
            name="message"
            value={emailData.message}
            onChange={handleChange}
            required
              className="sendemail-input"
          ></textarea></div>
        </div>
        <button type="submit" className="sendemail-submit">Send Email</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default SendEmailForm;
