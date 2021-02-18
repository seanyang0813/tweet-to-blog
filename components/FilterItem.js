import React, { useEffect, useState } from "react";
import { Box, Input, Text, HStack, CloseButton } from "@chakra-ui/react";

export default function FilterItem({ removeItem, regexValue }) {
  return (
    <>
      <HStack bg="blue.100" p={2} borderRadius="md">
        <Text>{regexValue}</Text>
        <CloseButton
          size="sm"
          onClick={() => {
            removeItem(regexValue);
          }}
          display="inline-block"
        />
      </HStack>
    </>
  );
}
