import { UserModel } from '@/lib/types/user';
import { NextResponse } from 'next/server'

const apiUrl = "https://comet-api.vercel.app";

export async function POST(req: Request) {
  try {
    const userData: UserModel = await req.json();
    userData.phoneNumber = `+91${userData.phoneNumber}`;
    console.log(userData);

    const backendResponse = await fetch(`${apiUrl}/createUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!backendResponse.ok) {
      throw new Error('Backend request failed');
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}