import React, { useState } from "react";
import "./CSS/ChatBot.css";

const faqData = [
  { question: "How do I register as a student?", answer: "You can register by signing up on the Quick Learning Classroom platform." },
  { question: "How can I join a classroom?", answer: "After login, enter the Join Code provided by your faculty to access the classroom. Once approved by admin." },
  { question: "Where can I find my study materials?", answer: "All classroom materials, assignments, and recorded lectures are available in your Student Dashboard." },
  { question: "How do I submit my assignments?", answer: "Assignments can be uploaded through the student panel under the Assignments section." },
  { question: "What happens if I miss a live class?", answer: "Don't worry! You can access recorded sessions anytime in your dashboard." },
  { question: "How can I ask doubts to my faculty?", answer: "You can ask doubts through the Chat section, or directly message your faculty." },
  { question: "Can I join multiple classrooms?", answer: "Yes, you can join multiple classrooms using different Join Codes, as long as the admin approves them." },
  { question: "How can I check my performance?", answer: "Your progress, test scores, and feedback are available in the Performance Reports section." },
  { question: "Is there any student support available?", answer: "Yes, you can contact your faculty/admin for further assistance." },
  { question: "Can I change my classroom after enrollment?", answer: "Classroom changes depend on admin approval. Contact support for assistance." }
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chatbot-wrapper">
      <button className="chat-toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Close FAQ" : "Open FAQ"}
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <h2 className="faq-text">Frequently Asked Questions</h2>
          <div className="faq-container">
            {faqData.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
