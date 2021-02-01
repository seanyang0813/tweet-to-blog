import React from "react";
import { signIn, signOut, useSession, getSession } from "next-auth/client";
import { Box, Heading, Flex, Text, Button } from "@chakra-ui/react";

export default function Card({ tweet }) {
  const [session, loading] = useSession();
  //try to check out how to use the twitter
  return (
    <>
      <Box bg="tomato" w="100%" p={4} color="white">
        This is the Box
      </Box>
    </>
  );
}
