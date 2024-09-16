"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import app from "./firebase-config"
import { useState } from "react"
import { Loader2 } from "lucide-react"

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
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    setError(null)
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
        // throw new Error('Invalid email domain or email not whitelisted')
        setError('Please sign in with your IIT Madras smail to continue :)')
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
        router.push('/signup')
      } else {
        router.push(`/comet/${user.uid}`)
      }
    } catch (error) {
      console.error('Error signing in:', error)
      setError('An error occurred during sign-in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/land.jpg"
          alt="Landing page image"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="w-full md:w-1/2 bg-black flex flex-col items-center justify-center p-8">
        <h1 className="text-6xl md:text-8xl font-bold text-yellow-400 mb-4 font-playwrite">comet.</h1>
        <p className="text-white text-lg md:text-xl mb-8 text-center max-w-md">
          Blame the stars and match with someone special at insti every week.
        </p>
        <Button 
          onClick={handleSignIn} 
          className="bg-white text-black hover:bg-gray-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign in with Google'
          )}
        </Button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  )
}