import { redirect } from 'next/navigation';
import { Avatar } from '@/components/ui/avatar';
import { getUserData } from '@/lib/utils';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { Suspense } from 'react';

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

async function CometPageContent({ uid }: { uid: string }) {
  const user = await getUserData(uid);
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  const currentHour = new Date().getHours();
  const greeting = getGreeting(currentHour);

  return (
    <>
      <h2 className="text-2xl mb-2 font-playwrite">{greeting}, {user.name}.</h2>
      <p className="text-sm text-gray-500 mb-4">It&apos;s {currentDate}. Today&apos;s vibe:</p>
      <Avatar className="mx-auto mb-4 w-24 h-24">
        <img src={user.photoUrl || '/api/placeholder/100/100'} alt={user.name} />
      </Avatar>
      <div className="p-4 rounded shadow max-w-2xl mx-auto mb-8">
        <p className="font-lora">{user.astroData.dailyHoroscope}</p>
      </div>

      <div className="bg-yellow-400 rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2 text-black">Do</h4>
            <ul className="list-disc list-inside text-black">
              {user.astroData.actionTable.yes.map((action, index) => (
                <li key={index} className="mb-1">{action}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-black">Don&apos;t</h4>
            <ul className="list-disc list-inside text-black">
              {user.astroData.actionTable.no.map((action, index) => (
                <li key={index} className="mb-1">{action}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default async function HomePage({ params }: { params: { uid: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    console.log("No session or user");
    redirect('/');
  }

  if (session.user.id !== params.uid) {
    console.log("Session user ID:", session.user.id);
    console.log("Params UID:", params.uid);
    redirect('/');
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CometPageContent uid={params.uid} />
    </Suspense>
  );
}