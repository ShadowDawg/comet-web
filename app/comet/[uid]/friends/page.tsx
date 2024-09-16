import React from 'react';
import { FriendsList } from './FriendsList';

export default function FriendsPage({ params }: { params: { uid: string } }) {
  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-4">My Friends</h1> */}
      <FriendsList uid={params.uid} />
    </div>
  );
}