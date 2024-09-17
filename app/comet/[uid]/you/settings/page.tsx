"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUserData, updateUserPhoto } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";
import { deleteUser } from "@/lib/utils";
import { UserModel } from "@/lib/types/user";

export default function SettingsPage({ params }: { params: { uid: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData(params.uid);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserData();
  }, [params.uid]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Error: User not found</div>;

  const birthDateTime = new Date(user.dateOfBirth);
  const formattedDate = birthDateTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = birthDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const userDetails = [
    { label: user.handle, value: user.name },
    { label: "Gender", value: "slayyy💅" },
    { label: "Phone", value: user.phoneNumber },
    { label: "Birth Date", value: formattedDate },
    { label: "Birth Time", value: formattedTime },
    { label: "Birth Place", value: user.placeOfBirth },
  ];

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeletingAccount(true);
    try {
      await deleteUser(user.uid);
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsDeletingAccount(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleChangeProfilePicture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const updatedUser = await updateUserPhoto(user.uid, file);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating profile picture:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="relative mb-6">
          <Avatar className="h-24 w-24 mx-auto">
            <AvatarImage src={user.photoUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Button
            className="mt-2 w-full"
            onClick={handleChangeProfilePicture}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Change profile picture"}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {userDetails.map((detail, index) => (
            <div key={index} className="bg-dark-grey rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500">
                {detail.label}
              </h3>
              <p className="text-lg font-semibold text-yellow-400">
                {detail.value}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4 w-full">
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            {"Logout :("}
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            {"Delete Account :(((("}
          </Button>
        </div>
      </div>

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="bg-bg">
          <DialogHeader>
            <DialogTitle>Are you sure you want to logout?</DialogTitle>
            <DialogDescription>
              You will be redirected to the login page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-bg">
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete your account?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. All of your data will be permanently
              deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeletingAccount}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
