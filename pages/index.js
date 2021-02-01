import React from "react";
import { useRouter } from "next/router";
import { signIn, signOut, useSession, getSession } from "next-auth/client";
import Link from "next/link";

export default function Page() {
  const [session, loading] = useSession();
  const router = useRouter();
  //if user is signed in redirect to processing page
  if (session) {
    router.push("process");
  }
  return (
    <>
      <p>sign in to use</p>
      <button onClick={signIn}>Sign in</button>
    </>
  );
}
