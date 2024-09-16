"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation"; // For redirection in Next.js 13+
import { Avatar } from "@/components/ui/avatar";
import { UserModel } from "@/lib/types/user";

interface ClientLovePageProps {
  user: UserModel;
  match: UserModel;
  initialMatchApproved: boolean;
}

const apiUrl = "https://comet-api.vercel.app";

export default function ClientLovePage({
  user,
  match,
  initialMatchApproved,
}: ClientLovePageProps) {
  const router = useRouter();
  const [isApproved, setIsApproved] = useState(initialMatchApproved);
  const [isLoading, setIsLoading] = useState(false);

  const handleApproveMatch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/updateMatchApproved`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userUid: user.uid,
          changeTo: true,
        }),
      });

      if (response.ok) {
        setIsApproved(true);
      } else {
        console.error("Failed to approve match");
      }
    } catch (error) {
      console.error("Error approving match:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user.uid]);

  // Redirect to chat page if approved and matchUid exists
  useEffect(() => {
    if (isApproved && match.uid) {
      const currentPath = window.location.pathname; // Get the current path from window.location

      // Create a new query string, keeping existing query params if necessary
      const newQueryString = new URLSearchParams({
        userUid: user.uid,
        matchUid: match.uid,
        // Add other existing query params if needed
      }).toString();

      // Push the new URL with the appended query string
      router.push(`${currentPath}/chat?${newQueryString}`);
    }
  }, [isApproved, match.uid, user.uid, router]);

  if (!isApproved) {
    return (
      <div className="max-w-4xl mx-auto bg-yellow-400 rounded-xl shadow-lg overflow-hidden m-4">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-black font-playwrite">
            The stars have aligned.
          </h2>

          <div className="flex justify-between">
            {/* User's data */}
            <div className="flex flex-col items-center w-1/2 px-4">
              <Avatar className="w-32 h-32 mb-6">
                <img
                  src={user.photoUrl || "/api/placeholder/200/200"}
                  alt={user.name}
                  className="rounded-full object-cover w-full h-full"
                />
              </Avatar>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-black">
                  {user.name}
                </h3>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{`@${user.handle}`}</h3>
                <p className="text-black">{user.astroData.planetSigns.sun}</p>
                <p className="text-black mb-4">Born in {user.placeOfBirth}</p>
              </div>
            </div>

            {/* Match's data */}
            <div className="flex flex-col items-center w-1/2 px-4">
              <Avatar className="w-32 h-32 mb-6">
                <img
                  src={match.photoUrl || "/api/placeholder/200/200"}
                  alt={match.name}
                  className="rounded-full object-cover w-full h-full"
                />
              </Avatar>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-black">
                  {match.name}
                </h3>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{`@${match.handle}`}</h3>
                <p className="text-black">{match.astroData.planetSigns.sun}</p>
                <p className="text-black mb-4">Born in {match.placeOfBirth}</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              className="bg-black text-yellow-400 font-bold py-2 px-6 rounded-full hover:bg-yellow-600 hover:text-black transition duration-300"
              onClick={handleApproveMatch}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Take the Leap >"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Chat messages */}
        <p className="text-center text-gray-500">
          ...
        </p>
      </div>
      <div className="bg-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border rounded-full py-2 px-4"
          />
          <button className="bg-blue-500 text-white rounded-full px-4 py-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
