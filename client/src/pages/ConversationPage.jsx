"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversationMessages, sendMessage, markMessagesAsRead, addLiveMessage, setCurrentConversation } from "../redux/slices/messageSlice";
import socket from "../utils/socket";
import { useParams, Link } from "react-router-dom";
import Loader from "../components/Loader";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";

const ConversationPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const [newMessage, setNewMessage] = useState("");
  const { messages, loading } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);

  // Use Redux state directly for messages
  const currentMessages = messages[userId] || [];


  // Effect for fetching messages and joining socket room
  useEffect(() => {
    dispatch(getConversationMessages(userId));
    dispatch(markMessagesAsRead(userId));
    dispatch(setCurrentConversation(userId));

    if (user?._id) {
      socket.connect();
      socket.emit("join", user._id);
    }

    return () => {
      socket.disconnect();
    };
  }, [dispatch, userId, user?._id]);

  // Effect for adding socket listener only once
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      // Always add every message received via socket
      dispatch(addLiveMessage(msg));
    };
    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [dispatch, user?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);


  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    // Send via socket
    socket.emit("sendMessage", {
      sender: user._id,
      receiver: userId,
      content: newMessage,
    });

    // Persist to DB
    dispatch(
      sendMessage({
        receiver: userId,
        content: newMessage,
      })
    );
    setNewMessage("");
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading && currentMessages.length === 0) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/messages"
        className="flex items-center text-green-500 hover:text-green-700 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back to Messages
      </Link>

      <div className="glass rounded-xl overflow-hidden">
        <div className="bg-green-500 text-white p-4">
          <h2 className="text-xl font-semibold">
            {currentMessages.length > 0
              ? currentMessages[0].sender._id === user._id
                ? currentMessages[0].receiver.name || "You"
                : currentMessages[0].sender.name
              : "Conversation"}
          </h2>
        </div>

        <div className="p-4 h-[60vh] overflow-y-auto bg-gray-50">
          {currentMessages.length > 0 ? (
            <div className="space-y-4">
              {currentMessages.map((message) => {
                const isSender = message.sender._id === user._id;
                return (
                  <div
                    key={message._id}
                    className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg shadow-sm text-sm
                        ${isSender
                          ? "bg-green-700 text-white rounded-tr-none"
                          : "bg-green-100 text-green-900 border border-green-200 rounded-tl-none"}
                      `}
                    >
                      <div>{message.content}</div>
                      <p className={`mt-1 text-xs ${isSender ? "text-green-200 text-right" : "text-green-700 text-left"}`}>
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="form-input flex-grow"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
              disabled={newMessage.trim() === ""}
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
