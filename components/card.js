import React, { useState, useEffect } from "react";
import { Box, Heading, Flex, Text, Button } from "@chakra-ui/react";

export default function Card({ thread }) {
  //try to check out how to use the twitter
  const [processedText, setProcessedText] = useState("a");

  useEffect(() => {
    if (thread != null) {
      let text = thread.map((tweet) => tweet.text).join(" ");
      setProcessedText(text);
    }
  }, [thread]);

  return (
    <>
      <Box w="100%" p={4} color="white" border="1px" borderColor="gray.200">
        {processedText.split("\n").map((text, i) => {
          return (
            <Text color="gray.500" key={text + i.toString()}>
              {text}
            </Text>
          );
        })}
      </Box>
    </>
  );
}
