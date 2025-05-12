import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import SendEmailForm from "./SendEmailForm"; // Import SendEmailForm
import './CSS/Emails.css'

const Emails = ({ classroomId, studentId }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        let response;
        if (studentId) {
          response = await axios.get(
            `http://localhost:5000/api/emails/fetchEmailsByStudent?classroomId=${classroomId}&studentId=${studentId}`
          );
        } else {
          response = await axios.get(
            `http://localhost:5000/api/emails/fetchEmailsByClassroom?classroomId=${classroomId}`
          );
        }

        // Store emails with name, date, and email address
        setEmails(response.data.map((email) => ({
          name: email.name,
          date: email.date,
          email: email.email,
          studentId: email.studentId,
        })));

        setLoading(false);
      } catch (err) {
        console.error("Error fetching emails:", err);
        setError(err);
        setLoading(false);
      }
    };

    if (classroomId) {
      fetchEmails();
    }
  }, [classroomId, studentId]);

  const handleDeleteEmail = async (emailId, studentId) => {
    try {
      console.log("Sending delete request with data:", { classroomId, studentId, emailId });
      await axios.delete("http://localhost:5000/api/emails/deleteEmail", {
        data: { classroomId, studentId, emailId },
      });

      // Remove the deleted email from the UI
      setEmails((prevEmails) => prevEmails.filter((email) => email.email !== emailId));

      setSuccessMessage("Email deleted successfully!");
      setTimeout(() => {
        setSuccessMessage(""); // Clear the success message after 3 seconds
      }, 3000);
    } catch (err) {
      console.error("Error deleting email:", err);
    }
  };

  if (loading) return <p>Loading emails...</p>;
  if (error) return <p>No Email Found.</p>;

  return (
    <div>
      <h3>Emails</h3>

      {/* Success Message */}
      {successMessage && (
        <div style={{ color: "green", marginBottom: "20px" }}>
          {successMessage}
        </div>
      )}

      <table className="emailview-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {emails.length > 0 ? (
            emails.map((email, index) => (
              <tr key={index}>
                <td>{email.name}</td> {/* Display email sender's name */}
                <td>{new Date(email.date).toLocaleDateString()}</td> {/* Format date */}
                <td>{email.email}</td> {/* Display email */}
                <td>
                  <button
                    onClick={() => handleDeleteEmail(email.email, email.studentId)}
                    style={{
                      color: "red",
                      fontSize: "20px",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No emails found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pass the emails to the SendEmailForm */}
      <SendEmailForm emails={emails.map((email) => email.email)} /> {/* Only pass email addresses */}
    </div>
  );
};

export default Emails;
