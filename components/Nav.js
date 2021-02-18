import React from "react";
import { signIn, signOut, useSession, getSession } from "next-auth/client";
import { Box, Heading, Flex, Text, Button } from "@chakra-ui/react";

export default function Nav() {
  const [session, loading] = useSession();
  //try to check out how to use the twitter
  return (
    <>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg="teal.500"
        color="white"
      >
        {!session && (
          <>
            Not signed in <br />
            <button onClick={signIn}>Sign in</button>
          </>
        )}
        {session && (
          <>
            {session.user.name} <br />
            <button onClick={signOut}>Sign out</button>
          </>
        )}
      </Flex>
    </>
  );
}
