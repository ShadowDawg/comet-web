"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { UserModel } from "@/lib/types/user";
import { database } from "@/app/firebase-config";
import { ref, onValue, set, push } from "firebase/database";

const apiUrl = "https://comet-api.vercel.app";

const ChatPage = () => {
  const searchParams = useSearchParams();
  const userUid = searchParams.get("userUid");
  const matchUid = searchParams.get("matchUid");

  const [user, setUser] = useState<UserModel | null>(null);
  const [match, setMatch] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<
    { id: string; message: string; sendBy: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const fetchUserData = async (uid: string): Promise<UserModel> => {
    const response = await fetch(`${apiUrl}/getUserData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userUid: uid }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data for user ${uid}`);
    }

    return response.json();
  };

  const fetchData = async () => {
    try {
      if (userUid && matchUid) {
        const [userData, matchData] = await Promise.all([
          fetchUserData(userUid),
          fetchUserData(matchUid),
        ]);

        setUser(userData);
        setMatch(matchData);

        if (userData.astroData.chatRoomId) {
          const chatRoomRef = ref(
            database,
            `/chats/${userData.astroData.chatRoomId}/messages`
          );
          onValue(chatRoomRef, (snapshot) => {
            const data = snapshot.val();
            const messagesList = data
              ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
              : [];
            setMessages(messagesList);
          });
        }
      }
    } catch (error) {
      console.error("Error fetching user and match data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userUid, matchUid]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && user && user.astroData.chatRoomId) {
      const chatRoomRef = ref(database, `/chats/${user.astroData.chatRoomId}/messages`);
      const newMessageRef = push(chatRoomRef);

      // Get current time in the requested format
      const now = new Date();
      const formattedDate = now.toISOString().replace('T', ' ').replace('Z', '');

      await set(newMessageRef, {
        message: newMessage.trim(),
        sendBy: userUid,
        messageType: "MessageType.text",
        createdAt: formattedDate,
        id: formattedDate,
        replyMessage: {
          id: "",
          message: "",
          message_type: "MessageType.text",
          replyBy: matchUid,
          replyTo: matchUid,
          voiceMessageDuration: "null"
        }
      });
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user || !match) {
    return <p>Error: Could not load user or match data.</p>;
  }

  return (
    <div className="flex flex-col h-screen bg-black-100">
      {/* App Bar */}
      <div className="bg-black text-white">
        <div className="p-4 flex items-center">
          <img
            src={match.photoUrl || "/api/placeholder/40/40"}
            alt={match.name}
            className="w-10 h-10 rounded-full mr-4"
          />
          <div>
            <h2 className="font-semibold text-lg">{match.name}</h2>
            <p className="text-sm text-gray-300">@{match.handle}</p>
          </div>
        </div>
        <div className="h-1 bg-yellow-400"></div>
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sendBy === userUid ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-full ${
                msg.sendBy === userUid
                  ? "bg-dark-grey text-white"
                  : "bg-yellow-400 text-black"
              }`}
            >
              <span className="break-words">{msg.message}</span>
              {msg.sendBy === userUid && (
                <span className="inline-block w-2 h-2 bg-dark-grey rounded-full ml-1 mb-1"></span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-bg p-4">
        <div className="flex items-end">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 rounded-l-lg focus:outline-none resize-none"
            placeholder="Type a message"
            rows={1}
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />
          <button
            onClick={handleSendMessage}
            className="bg-yellow-400 text-bg p-2 rounded-r-lg h-[40px] w-[40px] flex items-center justify-center"
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
