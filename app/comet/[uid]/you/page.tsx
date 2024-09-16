import React from "react";
import { getUserData } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default async function YouPage({ params }: { params: { uid: string } }) {
  const user = await getUserData(params.uid);
  const birthDate = new Date(user.dateOfBirth);
  const birthMonth = birthDate.getMonth() + 1; // JavaScript months are 0-indexed
  const formattedBirthDate = birthDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const description =
    birthMonth % 2 === 0
      ? "ngl your signs say you're cooked"
      : "Your stars are aligned for greatness.";

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <Link href={`you/settings`} passHref>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="mb-4 bg-zinc-800 p-1 rounded-lg py-6">
          <TabsTrigger
            value="today"
            className="px-4 py-2 rounded-md transition-colors data-[state=active]:bg-bg data-[state=active]:text-white text-gray-300 hover:text-white"
          >
            Today
          </TabsTrigger>
          <TabsTrigger
            value="signs"
            className="px-4 py-2 rounded-md transition-colors data-[state=active]:bg-bg data-[state=active]:text-white text-gray-300 hover:text-white"
          >
            Signs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <div className="bg-bg rounded-lg p-4 inline-flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.photoUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white">{user.name}</h3>
              <p className="text-gray-400">@{user.handle}</p>
              <div className="flex justify-center mt-2 space-x-4">
                <div>
                  <p className="text-sm font-medium text-gray-300">Sun</p>
                  <p className="text-xs text-yellow-400">
                    {user.astroData.planetSigns.sun}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Moon</p>
                  <p className="text-xs text-yellow-400">
                    {user.astroData.planetSigns.moon}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Ascendant</p>
                  <p className="text-xs text-yellow-400">
                    {user.astroData.planetSigns.ascendant}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Daily Horoscope</h4>
            <p>{user.astroData.dailyHoroscope}</p>
          </div>
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Detailed Reading</h4>
            <p>{user.astroData.detailedReading}</p>
          </div>
        </TabsContent>

        <TabsContent value="signs">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-playwrite">{user.name}</h2>
        <p className="text-lg">{formattedBirthDate}</p>
        <p className="text-lg text-greyyy">{description}</p>

        <table className="w-full">
          <tbody>
            {Object.entries(user.astroData.planetSigns).map(
              ([planet, sign]) => (
                <tr key={planet} className="items-center">
                  <td className="p-2 w-1/3">{planet}</td>
                  <td className="p-2 w-1/3 text-center">
                    <Image
                    //   src={`/icons/${sign.toLowerCase()}-icon.png`}
                      src={`/icons/${sign.toLowerCase()}-icon.png`}
                      alt={`${sign} icon`}
                      width={24}
                      height={24}
                      className="inline-block"
                      style={{ filter: 'invert(1) sepia(1) saturate(5) hue-rotate(1deg)' }}

                      />
                  </td>
                  <td className="p-2 w-1/3">{sign}</td>
                </tr>
              )
            )}
          </tbody>
        </table>    
      </div>
    </TabsContent>
      </Tabs>
    </div>
  );
}
