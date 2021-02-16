import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Input,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputLeftAddon,
  InputRightAddon,
  InputGroup,
  Select,
} from "@chakra-ui/react";

export default function FilterAccordion({}) {
  return (
    <>
      <Accordion allowMultiple={true}>
        <AccordionItem>
          <h2>
            <AccordionButton
              bg="blue.200"
              _hover={{
                background: "blue.300",
              }}
            >
              <Box flex="1" textAlign="left">
                Min number of tweets in thread
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <NumberInput defaultValue={2} min={1}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton
              bg="blue.200"
              _hover={{
                background: "blue.300",
              }}
            >
              <Box flex="1" textAlign="left">
                Cleaning for starting
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              regular expression for removing starting character: default
              "\d+\/" removes 1/ 2/ etc
            </Text>
            <InputGroup size="sm">
              <InputLeftAddon children="/" />
              <Input></Input>
              <InputRightAddon children="/" />
            </InputGroup>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton
              bg="blue.200"
              _hover={{
                background: "blue.300",
              }}
            >
              <Box flex="1" textAlign="left">
                Filter for trailing
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              regular expression for removing trailing character: default
              "(\d+/d+)" removes (1/10) (2/10) etc
            </Text>
            <InputGroup size="sm">
              <InputLeftAddon children="/" />
              <Input></Input>
              <InputRightAddon children="/" />
            </InputGroup>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton
              bg="blue.200"
              _hover={{
                background: "blue.300",
              }}
            >
              <Box flex="1" textAlign="left">
                Seperated By
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>Separates tweets by the character</Text>
            <Select>
              <option value="newLine">new line</option>
              <option value="space">space</option>
            </Select>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
}
