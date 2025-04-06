"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { COMETCHAT_CONSTANTS, initializeCometChat } from '@/lib/cometChatConfig';
import { CometChat } from '@cometchat-pro/chat';

const REPORT_ID = "5ab03973-4246-4509-a679-81ee21f8727c";
const ASSIGNED_OFFICER_ID = "02fed0e2-777b-449d-ace2-3b392884753e";

export default function ComplainantChat() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInitialized, setChatInitialized] = useState(false);
  const [cometChatInstance, setCometChatInstance] = useState<typeof CometChat | null>(null);
  const params = useSearchParams();
  const userId = params.get('userId');

  useEffect(() => {
    const initChat = async () => {
      try {
        const instance = await initializeCometChat();
        setCometChatInstance(instance);

        // Login as complainant
        const complainantId = `${COMETCHAT_CONSTANTS.UID_PREFIX.COMPLAINANT}${userId}`;
        await instance.login(complainantId, COMETCHAT_CONSTANTS.AUTH_KEY);

        // Set up message listener with metadata filter
        instance.addMessageListener(
          REPORT_ID,
          new CometChat.MessageListener({
            onTextMessageReceived: (msg) => {
              if (msg.getMetadata()?.reportId === REPORT_ID) {
                setChatMessages(prev => [...prev, msg]);
              }
            },
          })
        );

        // Fetch existing messages
        const conversationID = `REPORT_${REPORT_ID}`;
        const messagesRequest = new CometChat.MessagesRequestBuilder()
          .setConversationId(conversationID)
          .setLimit(50)
          .build();
        
        const messages = await messagesRequest.fetchPrevious();
        setChatMessages(messages);
        setChatInitialized(true);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    initChat();
  }, [userId]);

  const sendMessage = async () => {
    if (!message.trim() || !chatInitialized) return;

    const officerUID = `${COMETCHAT_CONSTANTS.UID_PREFIX.OFFICER}${ASSIGNED_OFFICER_ID}`;
    const textMessage = new CometChat.TextMessage(
      officerUID,
      message,
      CometChat.RECEIVER_TYPE.USER,
      {
        conversationId: `REPORT_${REPORT_ID}`,
        metadata: { reportId: REPORT_ID }
      }
    );

    try {
      const sentMessage = await cometChatInstance.sendMessage(textMessage);
      setChatMessages(prev => [...prev, sentMessage]);
      setMessage('');
    } catch (error) {
      console.error("Send error:", error);
    }
  };

  return (
    <div className="chat-container p-4">
      <div className="chat-header bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold">Report #{REPORT_ID.slice(0, 8)}</h2>
        <p>Chatting with Officer {ASSIGNED_OFFICER_ID.slice(0, 8)}</p>
      </div>

      <div className="chat-messages h-96 overflow-y-auto my-4">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.getSender().getUid().includes('OFFICER') ? 'officer' : 'user'}`}
          >
            <p>{msg.getText()}</p>
            <span className="text-xs text-gray-500">
              {new Date(msg.getSentAt() * 1000).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      <div className="chat-input flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder={chatInitialized ? "Type your message..." : "Initializing..."}
          disabled={!chatInitialized}
        />
        <button 
          onClick={sendMessage}
          disabled={!chatInitialized}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}