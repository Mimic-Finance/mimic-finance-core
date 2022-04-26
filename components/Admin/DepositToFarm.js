import {
  Text,
  Grid,
  GridItem,
  Select,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Spinner,
  Box,
  Center,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import Web3 from "web3";

import { useAutoCompound } from "hooks/useContracts";
import { useJUSD } from "hooks/useToken";
import useAccount from "hooks/useAccount";

const DepositToFarm = () => {
  const account = useAccount();
  const JUSD = useJUSD();
  const AutoCompound = useAutoCompound();
  const [depositAmount, setDepositAmount] = useState(0);

  const toast = useToast();

  const [send_tx_status, setSendTxStatus] = useState(false);
  const [wait_tx, setWaitTx] = useState(false);

  const txStatus = async (hash) => {
    const web3 = window.web3;
    const status = await web3.eth.getTransactionReceipt(hash);
    return status;
  };

  const handleChangedepositAmount = (e) => {
    setDepositAmount(e.target.value);
  };

  const setDepositAmountMax = async () => {
    const balance = await JUSD.methods.balanceOf(AutoCompound.address).call();
    setDepositAmount(Web3.utils.fromWei(balance.toString()));
  };

  const deposit = async () => {
    setSendTxStatus(true);
    setWaitTx(true);
    await AutoCompound.methods
      .depositToFarm(depositAmount)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        const depositCheck = setInterval(async () => {
          const tx_status = await txStatus(hash);
          if (tx_status && tx_status.status) {
            setWaitTx(false);
            setSendTxStatus(false);
            clearInterval(depositCheck);
            toast({
              title: "Success",
              description: "Deposit success!",
              status: "success",
              duration: 1500,
              isClosable: true,
            });
            setDepositAmount(0);
          }
        }, 1500);
      });
  };

  return (
    <>
      <Text fontSize="xl" mt={3} style={{ textAlign: "center" }}>
        <b>Deposit JUSD to Farm</b>
      </Text>

      <Text style={{ textAlign: "center" }}>
        JUSD Balance from AutoCompound Contract
      </Text>

      <Center>
        <Box width={"50%"}>
          <Grid pt={10} templateColumns="repeat(10, 1fr)" gap={0}>
            <GridItem colSpan={3}>
              <Select style={{ borderRadius: "10px 0px 0px 10px" }}>
                <option>JUSD</option>
              </Select>
            </GridItem>
            <GridItem colSpan={7}>
              <FormControl id="email">
                <InputGroup size="md">
                  <Input
                    type="number"
                    style={{ borderRadius: "0px 10px 10px 0px" }}
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={handleChangedepositAmount}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={setDepositAmountMax}>
                      Max
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </GridItem>
          </Grid>

          <Button
            style={{
              color: "#FFFFFF",
              background: "linear-gradient(90deg ,#576cea 0%, #da65d1 100%)",
            }}
            disabled={depositAmount == 0 || (wait_tx && send_tx_status)}
            mt={2}
            mb={5}
            w={"100%"}
            onClick={() => {
              deposit();
            }}
          >
            {wait_tx && send_tx_status ? (
              <>
                <Spinner size={"sm"} mr={2} /> Waiting the transaction ...
              </>
            ) : (
              "Deposit"
            )}
          </Button>
        </Box>
      </Center>

      <Divider mt={20} />
    </>
  );
};

export default DepositToFarm;
