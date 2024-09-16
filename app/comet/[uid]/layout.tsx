// app/layout.tsx
import React from 'react';
import { NavBar } from '../../../components/NavBar';
import { UserModel, createUserModel } from '../../../lib/types/user';
import { getUserData } from '@/lib/utils';

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { uid: string }
}) {
  const user = await getUserData(params.uid);
  const currentHour = new Date().getHours();
  const greeting = getGreeting(currentHour);

  return (
    <div className="container mx-auto p-4 text-center max-w-4xl">
      <h1 className="text-6xl mb-4 text-yellow-400 font-playwrite">comet.</h1>
      <hr className="border-t-2 border-yellow-400 w-full md:w-1/4 mx-auto my-4" />
      
      <NavBar uid={params.uid} />

      {children}
    </div>
  );
}