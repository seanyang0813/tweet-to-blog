import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Input,
  HStack,
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
import FilterItem from "../components/FilterItem";

export default function FilterAccordion({ regexFilters, setRegexFilters }) {
  const [regexInputValue, setRegexInputValue] = useState("");

  // function for removing the item with
  function removeItem(itemValue) {
    const removed = regexFilters.filter((filterText) => {
      //filter out the inputs that are the same as the removed item
      return filterText !== itemValue;
    });
    // set the the filter to the removed value
    setRegexFilters(removed);
  }

  function addItem(itemValue) {
    if (!regexFilters.includes(itemValue) && itemValue !== " ") {
      const added = [...regexFilters, itemValue];
      setRegexFilters(added);
    }
  }

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
                Regex filter format
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              regular expression for removing starting character default:
            </Text>
            <Text>^\d+\/ removes 1/ 2/ etc</Text>
            <Text>\(\d+\/\d+\)$ removes (1/10) (2/10) etc</Text>
            <InputGroup size="sm" mb={5}>
              <InputLeftAddon children="/" />
              <Input
                value={regexInputValue}
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    addItem(regexInputValue);
                    setRegexInputValue("");
                  }
                }}
                onChange={(event) => setRegexInputValue(event.target.value)}
              ></Input>
              <InputRightAddon children="/" />
            </InputGroup>
            <HStack spacing={2}>
              {regexFilters.map((filter) => {
                return (
                  <FilterItem
                    removeItem={removeItem}
                    regexValue={filter}
                    key={filter}
                  ></FilterItem>
                );
              })}
            </HStack>
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
