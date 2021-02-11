import React, { useState, useEffect } from "react";
import { Box, Heading, Flex, Text, Button } from "@chakra-ui/react";

export default function Card({ thread }) {
  //try to check out how to use the twitter
  const [processedText, setProcessedText] = useState("a");

  useEffect(() => {
    if (thread != null) {
      console.log("thread is");
      let text = thread.map((tweet) => tweet.text).join(" ");
      console.log(text);
      setProcessedText(text);
    }
  }, [thread]);

  console.log(processedText);
  return (
    <>
      <Box w="100%" p={4} color="white" border="1px" borderColor="gray.200">
        <Text color="gray.500">{processedText}</Text>
      </Box>
    </>
  );
}
