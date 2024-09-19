import React from 'react';
import { getUserData } from "@/lib/utils";
import ClientLovePage from './ClientLovePage';
import { Card, CardContent } from '@/components/ui/card';

export default async function LovePage({ params }: { params: { uid: string } }) {
  const user = await getUserData(params.uid);
  const { matchUid, matchApproved } = user.astroData;

  if (!matchUid) {
    return (
      <div className="text-center p-8">
      <h2 className="text-2xl font-bold mb-4 font-playwrite text-yellow-400">Love will be in the air next Week.</h2>
      <p className="text-lg mb-6">The stars indicate that you&apos;ll enjoy your own company this week. Defy the stars at the speed-dating booth at the AfterParty this Saturday.</p>
      <Card className="inline-block bg-yellow-300 shadow-md">
        <CardContent className="p-3 flex items-center justify-center h-20 w-48">
          <p className="text-sm font-semibold text-black">The AfterParty</p>
          <p className="text-sm text-gray-600 mt-1">Saturday, 21st September</p>
          <p className="text-sm text-gray-600 mt-1">CLT, 8 to 10PM</p>

        </CardContent>
      </Card>
    </div>
    );
  }

  const match = await getUserData(matchUid);

  return <ClientLovePage user={user} match={match} initialMatchApproved={matchApproved} />;
}