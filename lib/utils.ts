import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createUserModel, UserModel } from "./types/user";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import app, { db } from "@/app/firebase-config";
import { FriendData } from "./types/friendData";
import { getAuth, deleteUser as firebaseDeleteUser } from "firebase/auth";

const apiUrl = "https://comet-api.vercel.app";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getUserData(uid: string): Promise<UserModel> {
  const response = await fetch(`${apiUrl}/getUserData`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userUid: uid }),
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    throw new Error("Failed to fetch user data");
  }

  const userData = await response.json();
  return createUserModel(userData);
}

export async function getFriendsData(userId: string): Promise<FriendData[]> {
  const db = getFirestore(app);
  const friendsDoc = await getDoc(doc(db, "friends", userId));

  if (friendsDoc.exists()) {
    return friendsDoc.data().friends || [];
  } else {
    return [];
  }
}

import { FirebaseError } from 'firebase/app';

export async function addFriend(uid: string, phoneNumber: string) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("phoneNumber", "==", `+91${phoneNumber}`));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const friendDoc = querySnapshot.docs[0];
  const friendData = friendDoc.data();
  const friendInfo = {
    uid: friendDoc.id,
    name: friendData.name,
    handle: friendData.handle,
    phoneNumber: friendData.phoneNumber,
    photoUrl: friendData.photoUrl,
  };

  const userRef = doc(db, "friends", uid);
  
  try {
    // Try to update the existing document
    await updateDoc(userRef, {
      friends: arrayUnion(friendInfo),
    });
  } catch (error: unknown) {
    // Check if the error is a FirebaseError and has a 'code' property
    if (error instanceof FirebaseError && error.code === 'not-found') {
      // If the document doesn't exist, create it
      await setDoc(userRef, {
        friends: [friendInfo],
      });
    } else {
      // If it's a different error, rethrow it
      throw error;
    }
  }

  return friendInfo;
}

export async function deleteUser(uid: string): Promise<void> {
  const auth = getAuth(app);
  const db = getFirestore(app);

  if (!auth.currentUser) {
    throw new Error("No authenticated user found");
  }

  // Delete user data from Firestore
  await deleteDoc(doc(db, "users", uid));
  await deleteDoc(doc(db, "friends", uid));
  // Add any other collections that contain user data

  // Delete the user's authentication account
  await firebaseDeleteUser(auth.currentUser);
}
