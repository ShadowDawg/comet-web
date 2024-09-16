"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFriendsData, addFriend, getUserData } from "@/lib/utils";
import { ChevronRight, Loader2, UserPlus } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { UserModel } from "@/lib/types/user";

interface FriendData {
  name: string;
  handle: string;
  phoneNumber: string;
  photoUrl: string;
  uid: string;
}

interface FriendsListProps {
  uid: string;
}

export function FriendsList({ uid }: FriendsListProps) {
  const [friends, setFriends] = useState<FriendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<FriendData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [friendDetails, setFriendDetails] = useState<UserModel | null>(null);
  const [matchData, setMatchData] = useState<UserModel | null>(null);
  const [isLoadingMatch, setIsLoadingMatch] = useState(false);

  useEffect(() => {
    const loadFriends = async () => {
      const loadedFriends = await getFriendsData(uid);
      setFriends(loadedFriends);
      setIsLoading(false);
    };
    loadFriends();
  }, [uid]);

  const handleAddFriend = async () => {
    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsAddingFriend(true);
    setErrorMessage("");

    try {
      const newFriend = await addFriend(uid, phoneNumber);
      if (newFriend) {
        setFriends([...friends, newFriend]);
        setIsDialogOpen(false);
        setPhoneNumber("");
      } else {
        setErrorMessage("Your friend isn't on comet yet.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding the friend.");
    } finally {
      setIsAddingFriend(false);
    }
  };

  const handleOpenDrawer = async (friend: FriendData) => {
    setSelectedFriend(friend);
    setIsDrawerOpen(true);
    setIsLoadingMatch(true);
    try {
      const details = await getUserData(friend.uid);
      setFriendDetails(details);

      if (details.astroData.matchUid && details.astroData.matchUid !== "") {
        const matchDetails = await getUserData(details.astroData.matchUid);
        setMatchData(matchDetails);
      } else {
        setMatchData(null);
      }
    } catch (error) {
      console.error("Error fetching friend or match details:", error);
    } finally {
      setIsLoadingMatch(false);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center max-w-md mx-auto space-y-6">
        <div className="w-full flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-bold">My Friends</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Friend
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-bg">
              <DialogHeader>
                <DialogTitle>Add a Friend</DialogTitle>
                <DialogDescription>
                  Enter your friend&apos;s phone number to add them to your friends
                  list.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="Enter 10-digit number"
                    className="col-span-3"
                  />
                </div>
                {errorMessage && (
                  <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleAddFriend} disabled={isAddingFriend}>
                  {isAddingFriend ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Friend"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {friends.length > 0 ? (
          <div className="w-full space-y-4">
            {friends.map((friend: FriendData) => (
              <div
                key={friend.uid}
                className="bg-dark-grey shadow-md rounded-lg p-4 flex items-center w-full"
              >
                <div className="flex-shrink-0 mr-4">
                  <Image
                    src={friend.photoUrl || "/default-avatar.png"}
                    alt={friend.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </div>
                <div className="flex-grow">
                  <h2 className="font-semibold">{friend.name}</h2>
                  <p className="text-gray-400">@{friend.handle}</p>
                </div>
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-yellow-500 hover:bg-yellow-600"
                      onClick={() => handleOpenDrawer(friend)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerHeader className="text-center">
                        <div className="flex justify-center mb-4">
                          <Image
                            src={
                              selectedFriend?.photoUrl || "/default-avatar.png"
                            }
                            alt={selectedFriend?.name || "Friend"}
                            width={100}
                            height={100}
                            className="rounded-full"
                          />
                        </div>
                        <DrawerTitle className="text-2xl font-bold text-center">
                          {selectedFriend?.name}
                        </DrawerTitle>
                        <DrawerDescription className="text-gray-400 text-center">
                          @{selectedFriend?.handle}
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4">
                        {friendDetails ? (
                          <div className="space-y-6">
                            <div className="flex justify-center space-x-4">
                              {["sun", "moon", "ascendant"].map((sign) => (
                                <div key={sign} className="text-center">
                                  <div className="text-lg font-semibold capitalize">
                                    {sign}
                                  </div>
                                  <div className="text-sm">
                                    {friendDetails.astroData.planetSigns[
                                      sign
                                    ] || "N/A"}
                                  </div>
                                </div>
                              ))}
                            </div>
                            {/* <div className="text-center">
                              <p>Email: {friendDetails.email}</p>
                              <p>Phone: {friendDetails.phone}</p>
                            </div> */}
                            <div className="text-center">
                              {isLoadingMatch ? (
                                <p>Loading match information...</p>
                              ) : matchData ? (
                                <div>
                                  <h3 className="text-xl font-semibold mb-2 font-playwrite">
                                    {`${friend.name}'s match for the week`}
                                  </h3>
                                  <div className="bg-yellow-400 rounded-lg p-4 shadow-md">
                                    <div className="flex items-center">
                                      <Image
                                        src={
                                          matchData.photoUrl ||
                                          "/default-avatar.png"
                                        }
                                        alt={matchData.name || "Match"}
                                        width={60}
                                        height={60}
                                        className="rounded-full mr-4"
                                      />
                                      <div className="text-left">
                                        <p className="font-semibold text-lg">
                                          {matchData.name}
                                        </p>
                                        <p className="text-gray-600">
                                          @{matchData.handle}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <p className="italic text-gray-500">
                                  {`${friend.name} hasn't been matched yet.`}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-center">
                            Loading match details...
                          </p>
                        )}
                      </div>
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button variant="outline" className="w-full">
                            Close
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center w-full">
            <p className="text-gray-500">You haven&apos;t added any friends yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
