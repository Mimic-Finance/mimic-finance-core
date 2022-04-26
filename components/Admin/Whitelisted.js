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
  Divider,
  useToast,
} from "@chakra-ui/react";

import useAccount from "hooks/useAccount";
import { useFarm, useERC20Utils } from "hooks/useContracts";
import { useWhitelisted } from "hooks/useFunctions";
import { useState, useEffect } from "react";

import Toast from "components/Utils/Toast/Toast";

const Whitelisted = () => {
  const getWhitelisted = useWhitelisted();
  const [whitelisted, setWhitelisted] = useState([]);
  const [tokenAddress, setTokenAddress] = useState();
  const account = useAccount();
  const Farm = useFarm();
  const ERC20Utils = useERC20Utils();
  const toast = useToast();

  useEffect(() => {
    setWhitelisted(getWhitelisted);
  }, [getWhitelisted]);

  const handleChangeAddress = (e) => {
    setTokenAddress(e.target.value);
  };

  const handleAddWhitelist = async () => {
    try {
      const _symbol = await ERC20Utils.methods.symbol(tokenAddress).call();
      if (_symbol) {
        await Farm.methods.addWhitelisted(tokenAddress).send({ from: account });
        setWhitelisted((prev) => [
          ...prev,
          { address: tokenAddress, symbol: _symbol },
        ]);
        setTokenAddress("");
        toast({
          title: "Success",
          description: "Add " + _symbol + " to whitelist successfully",
          status: "success",
          duration: 1500,
          isClosable: true,
        });
      }
    } catch {
      toast({
        title: "error",
        description: "Invalid Token!",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  const handleRemoveWhitelist = async (token) => {
    try {
      const _symbol = await ERC20Utils.methods.symbol(token).call();
      await Farm.methods.removeWhitelisted(token).send({ from: account });
      setWhitelisted((prev) => prev.filter((item) => item.address !== token));

      toast({
        title: "Success",
        description: "Remove " + _symbol + " from whitelist successfully",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    } catch {
      toast({
        title: "error",
        description: "Invalid Token!",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
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
                    <Td>{token.address}</Td>
                    <Td>{token.symbol}</Td>
                    <Td>
                      <Button
                        colorScheme="pink"
                        onClick={() => {
                          handleRemoveWhitelist(token.address);
                        }}
                      >
                        X
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>

      <Divider mt={20} />
    </>
  );
};

export default Whitelisted;
