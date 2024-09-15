import React, { useState, useEffect, useRef, useCallback } from "react";
import { logInfo, logError } from '../utils/logger';
import {
  Card,
  Button,
  Form,
  Image,
} from "react-bootstrap";
import chatLogo from '../LOGO.gif';
import { sendMessageToAI } from "../services/api";
import "../components/Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [sizeMode, setSizeMode] = useState('standard'); // 'standard', 'quarter', 'half'
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

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const changeSize = () => {
    switch(sizeMode) {
      case 'standard':
        setSizeMode('quarter');
        break;
      case 'quarter':
        setSizeMode('half');
        break;
      case 'half':
        setSizeMode('standard');
        break;
      default:
        setSizeMode('standard');
    }
  };

  const getChatSize = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    switch(sizeMode) {
      case 'standard':
        return { width: windowWidth * 0.2, height: windowHeight * 0.5 };
      case 'quarter':
        return { width: windowWidth * 0.4, height: windowHeight * 0.6 };
      case 'half':
        return { width: windowWidth * 0.6, height: windowHeight * 0.7 };
      default:
        return { width: windowWidth * 0.2, height: windowHeight * 0.5 };
    }
  };

  const chatSize = getChatSize();

  return (
    <div className="chat-plugin-container">
      <iframe src="https://asmo-solutions.pl/" className="background-iframe" title="ASMO Solutions"></iframe>
      <div className="chat-plugin">
        {isMinimized ? (
          <div className="chat-icon" onClick={toggleMinimize}>
            <img src={chatLogo} alt="Chat" className="chat-icon-image" />
          </div>
        ) : (
          <Card 
            className={`chat-window ${sizeMode}`} 
            style={{ 
              width: isMinimized ? 'auto' : `${chatSize.width}px`, 
              height: isMinimized ? 'auto' : `${chatSize.height}px`,
            }}
          >
            <Card.Header className="d-flex justify-content-between align-items-center p-3">
              <h5 className="mb-0">Chat</h5>
              <div className="d-flex">
                <Button variant="outline-secondary" size="sm" onClick={changeSize} className="me-2">
                  <i className="fas fa-expand-arrows-alt"></i>
                </Button>
                <Button variant="outline-secondary" size="sm" onClick={toggleMinimize}>
                  <i className="fas fa-compress"></i>
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="chat-messages" style={{ height: `${chatSize.height - 130}px` }}>
              {messages.map((message, index) => (
                <div key={index} className={`d-flex flex-row justify-content-${message.role === 'user' ? 'end' : 'start'} mb-4`}>
                  {message.role !== 'user' && (
                    <Image
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                      alt="avatar"
                      roundedCircle
                      className="chat-avatar me-2"
                    />
                  )}
                  <div className="message-content">
                    <p className={`small p-2 ${message.role === 'user' ? 'ms-3' : 'me-3'} mb-1 rounded-3 ${message.role === 'user' ? 'bg-primary text-white' : 'bg-light'}`}>
                      {message.content}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <Image
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                      alt="avatar"
                      roundedCircle
                      className="chat-avatar ms-2"
                    />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </Card.Body>
            <Card.Footer className="chat-input">
              <Form.Control
                as="textarea"
                placeholder="Type message"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              />
              <Button
                variant="info"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                {isLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-paper-plane"></i>
                )}
              </Button>
            </Card.Footer>
          </Card>
        )}
      </div>
    </div>
  );
}