import {
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

import { useFarm, useERC20Utils } from "hooks/useContracts";
import { useState, useEffect, useCallback } from "react";

const Whitelisted = () => {
  const [whitelisted, setWithlisted] = useState([]);
  const [tokenAddress, setTokenAddress] = useState();
  const Farm = useFarm();
  const ERC20Utils = useERC20Utils();

  const getWhitelisted = useCallback(async () => {
    const _whitelisted = await Farm.methods.getWhitelisted().call();
    setWithlisted(_whitelisted);
  }, [Farm.methods]);

  useEffect(() => {
    getWhitelisted();
  }, [getWhitelisted]);

  const handleChangeAddress = (e) => {
    setTokenAddress(e.target.value);
  };

  const handleAddWhitelist = async () => {
    try {
      const _symbol = await ERC20Utils.methods.symbol(tokenAddress).call();
      console.log("symbol => " + _symbol);
    } catch {
      console.log("not a valid token");
    }
  };

  return (
    <>
      <Text fontSize="xl" mt={3} style={{ textAlign: "center" }}>
        <b>Whitelisted Management</b>
      </Text>
      <Text mt={5}>
        <b> + Add Whitelist</b>
      </Text>
      <FormControl>
        <Grid
          templateRows="repeat(1, 1fr)"
          templateColumns="repeat(10, 1fr)"
          gap={4}
        >
          <GridItem rowSpan={1} colSpan={8}>
            <FormLabel htmlFor="whitelist_address">Token Address</FormLabel>
            <Input
              id="whitelist_address"
              onChange={handleChangeAddress}
              type="text"
              placeholder="0x000..."
            />
          </GridItem>
          <GridItem rowSpan={1} colSpan={2}>
            <Button
              w={"100%"}
              onClick={handleAddWhitelist}
              colorScheme="telegram"
              mt={8}
            >
              Add
            </Button>
          </GridItem>
        </Grid>
      </FormControl>

      <Text mt={5}>
        <b> {">"} Whitelisted</b>
      </Text>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Token Address</Th>
              <Th>Symbol</Th>
              <Th>Manage</Th>
            </Tr>
          </Thead>
          <Tbody>
            {whitelisted &&
              whitelisted.map((token, i) => {
                return (
                  <Tr key={i}>
                    <Td>{token}</Td>
                    <Td>getsymbol</Td>
                    <Td>
                      <Button colorScheme="pink">X</Button>
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Whitelisted;
