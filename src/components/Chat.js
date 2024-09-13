import React, { useState, useEffect, useRef } from "react";
import { logInfo, logError } from '../utils/logger';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardFooter,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";
import { sendMessageToAI } from "../services/api";
import "../components/Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const newMessage = { role: "user", content: inputMessage };
    setMessages([...messages, newMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToAI([...messages, newMessage]);
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      logInfo('Received AI response', { response: aiResponse });
    } catch (error) {
      logError('Error sending message:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
      <MDBRow className="d-flex justify-content-center">
        <MDBCol md="10" lg="8" xl="6">
          <MDBCard id="chat2" style={{ borderRadius: "15px" }}>
            <MDBCardHeader className="d-flex justify-content-between align-items-center p-3">
              <h5 className="mb-0">Chat</h5>
              <MDBBtn color="primary" size="sm" rippleColor="dark">
                Let's Chat App
              </MDBBtn>
            </MDBCardHeader>
            <div
              ref={chatBodyRef}
              style={{
                position: "relative",
                height: "400px",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <MDBCardBody>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`d-flex flex-row ${
                      msg.role === "user" ? "justify-content-end" : "justify-content-start"
                    } mb-4 ${msg.role === "user" ? "pt-1" : ""}`}
                  >
                    {msg.role !== "user" && (
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                        alt="avatar 1"
                        style={{ width: "45px", height: "100%" }}
                      />
                    )}
                    <div>
                      <p
                        className={`small p-2 ${
                          msg.role === "user" ? "me-3" : "ms-3"
                        } mb-1 rounded-3 ${
                          msg.role === "user"
                            ? "text-white bg-primary"
                            : "bg-light"
                        }`}
                      >
                        {msg.content}
                      </p>
                    </div>
                    {msg.role === "user" && (
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                        alt="avatar 1"
                        style={{ width: "45px", height: "100%" }}
                      />
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
              </MDBCardBody>
            </div>
            <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                alt="avatar 3"
                style={{ width: "45px", height: "100%" }}
              />
              <input
                type="text"
                className="form-control form-control-lg"
                id="exampleFormControlInput1"
                placeholder="Type message"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <a className="ms-1 text-muted" href="#!">
                <MDBIcon fas icon="paperclip" />
              </a>
              <a className="ms-3 text-muted" href="#!">
                <MDBIcon fas icon="smile" />
              </a>
              <a className="ms-3" href="#!" onClick={sendMessage}>
                <MDBIcon fas icon="paper-plane" />
              </a>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}