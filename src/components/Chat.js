import React, { useState, useEffect, useRef, useCallback } from "react";
import { logInfo, logError } from '../utils/logger';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBTypography,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { sendMessageToAI } from "../services/api";
import "../components/Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newMessage = { role: 'user', content: inputMessage };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiMessage = { role: 'assistant', content: '' };
      setMessages(prevMessages => [...prevMessages, aiMessage]);

      await sendMessageToAI([...messages, newMessage], (chunk) => {
        setMessages(prevMessages => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage.role === 'assistant') {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = {
              ...lastMessage,
              content: lastMessage.content + chunk
            };
            return updatedMessages;
          }
          return prevMessages;
        });
      });

      logInfo('Received complete AI response');
    } catch (error) {
      logError('Error in handleSendMessage', error);
      setMessages(prevMessages => [...prevMessages, { role: 'error', content: 'Wystąpił błąd podczas komunikacji z AI.' }]);
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
            <MDBCardBody style={{ position: "relative", height: "400px", overflowY: "auto" }}>
              {messages.map((message, index) => (
                <div key={index} className={`d-flex flex-row justify-content-${message.role === 'user' ? 'end' : 'start'} mb-4`}>
                  <div style={{ maxWidth: "80%" }}>
                    <MDBTypography tag="p" className={`small p-2 ms-3 mb-1 rounded-3 ${message.role === 'user' ? 'bg-primary' : 'bg-light'}`} style={{ backgroundColor: message.role === 'user' ? '#A8DDFD' : '#f5f6f7', wordWrap: "break-word" }}>
                      {message.content}
                    </MDBTypography>
                  </div>
                  <img src={message.role === 'user' ? "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp" : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"} alt="avatar" style={{ width: "45px", height: "100%" }} />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </MDBCardBody>
            <MDBCardBody className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp" alt="avatar 3" style={{ width: "45px", height: "100%" }} />
              <MDBTextArea className="form-control form-control-lg" id="exampleFormControlTextarea1" rows="3" placeholder="Type message" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}></MDBTextArea>
              <MDBBtn color="info" rounded className="float-end" onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? <MDBIcon fas icon="spinner" spin /> : <MDBIcon fas icon="paper-plane" />}
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}