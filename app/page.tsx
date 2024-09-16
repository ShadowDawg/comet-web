"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import app from "./firebase-config"
import { useState } from "react"

const whitelistedEmails = [
  'shadowpenguin2004@gmail.com',
  'shadowdawg2004@gmail.com',
  'erplp7@gmail.com'
]

export default function LandingPage() {
  const router = useRouter()
  const auth = getAuth(app)
  const db = getFirestore(app)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        hd: 'smail.iitm.ac.in',
        prompt: 'select_account'
      })

      const result = await signInWithPopup(auth, provider)
      const user = result.user

      console.log("Firebase user:", user);

      if (!user.email || (!user.email.endsWith('@smail.iitm.ac.in') && !whitelistedEmails.includes(user.email))) {
        throw new Error('Invalid email domain or email not whitelisted')
      }

      const idToken = await user.getIdToken()
      console.log("ID Token obtained");
      
      const signInResult = await signIn("firebase", { 
        idToken,
        redirect: false,
      })

      console.log("NextAuth signIn result:", signInResult);

      if (signInResult?.error) {
        throw new Error(signInResult.error)
      }

      const userDocRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          name: user.displayName,
          createdAt: new Date(),
        })
        router.push('/signup')
      } else {
        router.push(`/comet/${user.uid}`)
      }
    } catch (error) {
      console.error('Error signing in:', error)
      setError('An error occurred during sign-in. Please try again.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Button onClick={handleSignIn}>Sign in with Google</Button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  )
}