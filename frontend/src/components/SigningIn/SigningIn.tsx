import { SignedOut, SignInButton, UserButton, SignedIn } from "@clerk/clerk-react"

export default function SigningIn() {
    return (
        <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
    )
}