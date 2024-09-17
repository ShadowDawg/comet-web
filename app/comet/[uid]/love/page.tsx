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
      <h2 className="text-2xl font-bold mb-4 font-playwrite text-yellow-400">Love is in the air.</h2>
      <p className="text-lg mb-6">Every week, we consult the cosmos (and our algorithms) to find your celestial soulmate in insti. Or at least someone who won&apos;t ghost you immediately.</p>
      <Card className="inline-block bg-yellow-300 shadow-md">
        <CardContent className="p-3 flex items-center justify-center h-20 w-48">
          <p className="text-sm font-semibold text-black">Every Thursday 4:20PM</p>
        </CardContent>
      </Card>
    </div>
    );
  }

  const match = await getUserData(matchUid);

  return <ClientLovePage user={user} match={match} initialMatchApproved={matchApproved} />;
}