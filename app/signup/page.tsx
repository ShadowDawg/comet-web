// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../firebase-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const signupSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(12)
    .regex(/^[a-zA-Z]+$/, "Must contain only letters"),
  handle: z
    .string()
    .min(3)
    .max(12)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Must contain only letters, numbers, and underscores"
    ),
  phoneNumber: z
    .string()
    .length(10)
    .regex(/^\d+$/, "Must contain only numbers"),
  gender: z.enum(["male", "female"]),
  dateOfBirth: z.date(),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  notificationsEnabled: z.boolean(),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const auth = getAuth();
  const storage = getStorage(app);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      handle: "",
      phoneNumber: "",
      gender: "female",
      placeOfBirth: "",
      notificationsEnabled: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    if (!auth.currentUser) {
      console.error("No authenticated user");
      return;
    }
    setIsLoading(true);
    try {
      let photoUrl = "";
      if (profilePhoto) {
        // Upload photo to Firebase Storage and get URL
        const storageRef = ref(
          storage,
          `profile_images/${auth.currentUser.uid}`
        );
        await uploadBytes(storageRef, profilePhoto);
        photoUrl = await getDownloadURL(storageRef);
      }

      const userData = {
        ...data,
        email: auth.currentUser.email,
        photoUrl,
        dateOfBirth: data.dateOfBirth.toISOString(),
        fcmToken: null, // You might want to implement FCM later
      };

      const response = await fetch("/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const result = await response.json();
      console.log("User created:", result);

      router.push(`/comet/${result.userData.uid}`);
    } catch (error) {
      console.error("Error signing up:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="text-5xl font-bold text-center font-playwrite">
            Take the Leap.
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="handle">Username</Label>
              <Controller
                name="handle"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.handle && (
                <p className="text-red-500">{errors.handle.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.phoneNumber && (
                <p className="text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>
            <div>
              <Label>Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            <div>
              <Label htmlFor="profilePhoto">Profile Photo</Label>
              <Input
                id="profilePhoto"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            {previewUrl && (
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    <Image
                      src={previewUrl}
                      alt="Profile preview"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            <div>
              <Label>Date of Birth</Label>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
            <div>
              <Label htmlFor="placeOfBirth">Place of Birth</Label>
              <Controller
                name="placeOfBirth"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.placeOfBirth && (
                <p className="text-red-500">{errors.placeOfBirth.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing Up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
