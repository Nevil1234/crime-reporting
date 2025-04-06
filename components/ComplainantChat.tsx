// "use client";
// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { COMETCHAT_CONSTANTS, initializeCometChat } from '@/lib/cometChatConfig';
// import { CometChat } from '@cometchat-pro/chat';

// const REPORT_ID = "5ab03973-4246-4509-a679-81ee21f8727c";
// const ASSIGNED_OFFICER_ID = "02fed0e2-777b-449d-ace2-3b392884753e";

// export default function ComplainantChat() {
//   const [message, setMessage] = useState('');
//   const [chatMessages, setChatMessages] = useState<any[]>([]);
//   const [chatInitialized, setChatInitialized] = useState(false);
//   const [cometChatInstance, setCometChatInstance] = useState<any>(null);
//   const params = useSearchParams();

//   useEffect(() => {
//     const initChat = async () => {
//       try {
//         // Initialize CometChat and store the instance.
//         const instance = await initializeCometChat();
//         if (!instance) {
//           console.error("Failed to initialize CometChat");
//           return;
//         }
//         setCometChatInstance(instance);

//         // Login as the complainant.
//         const complainantId = "USER_" + params.get('userId');
//         await instance.login(complainantId, COMETCHAT_CONSTANTS.AUTH_KEY);

//         // Set up a message listener.
//         instance.addMessageListener(
//           REPORT_ID,
//           new CometChat.MessageListener({
//             onTextMessageReceived: (msg: any) => {
//               setChatMessages(prev => [...prev, msg]);
//             },
//           })
//         );

//         // Fetch message history.
//         const conversationID = `REPORT_${REPORT_ID}`;
//         const messagesRequest = new CometChat.MessagesRequestBuilder()
//           .setLimit(50)
//           .setConversationId(conversationID)
//           .build();
//         const messages = await messagesRequest.fetchPrevious();
//         setChatMessages(messages);
//         setChatInitialized(true);
//       } catch (error) {
//         console.error("CometChat initialization error:", error);
//       }
//     };

//     initChat();
//   }, [params]);

//   const sendMessage = async () => {
//     if (!message.trim()) return;
//     if (!chatInitialized || !cometChatInstance) {
//       console.error("CometChat is not initialized");
//       return;
//     }

//     // Construct the message destined for the officer.
//     const officerUID = COMETCHAT_CONSTANTS.UID_PREFIX.OFFICER + ASSIGNED_OFFICER_ID;
//     const textMessage = new CometChat.TextMessage(
//       officerUID,
//       message,
//       CometChat.RECEIVER_TYPE.USER
//     );
//     textMessage.setMetadata({
//       conversationId: `REPORT_${REPORT_ID}`,
//       reportId: REPORT_ID,
//       officerId: ASSIGNED_OFFICER_ID,
//     });

//     try {
//       const sentMessage = await cometChatInstance.sendMessage(textMessage);
//       setChatMessages(prev => [...prev, sentMessage]);
//       setMessage('');
//     } catch (err) {
//       console.error("Message send failed:", err);
//     }
//   };

//   return (
//     <div className="chat-container p-4">
//       <div className="chat-header bg-white p-4 rounded-lg shadow">
//         <h2 className="text-xl font-bold">Report #{REPORT_ID.slice(0, 8)}</h2>
//         <p>Chatting with Officer {ASSIGNED_OFFICER_ID.slice(0, 8)}</p>
//       </div>

//       <div className="chat-messages h-96 overflow-y-auto my-4">
//         {chatMessages.map((msg, index) => (
//           <div
//             key={index}
//             className={`message ${msg.sender.uid.includes('OFFICER') ? 'officer' : 'user'}`}
//           >
//             <p>{msg.text}</p>
//             <span className="text-xs text-gray-500">
//               {new Date(msg.sentAt * 1000).toLocaleTimeString()}
//             </span>
//           </div>
//         ))}
//       </div>

//       <div className="chat-input flex gap-2">
//         <input
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           className="flex-1 p-2 border rounded"
//           placeholder={chatInitialized ? "Type your message..." : "Initializing chat..."}
//           disabled={!chatInitialized}
//         />
//         <button 
//           onClick={sendMessage}
//           disabled={!chatInitialized}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }