import {
  Grid,
  GridItem,
  Select,
  FormControl,
  Input,
  Button,
  InputGroup,
  Text,
  Spinner,
  InputRightElement,
} from "@chakra-ui/react";

import { useState } from "react";

import Portfolio from "./Portfolio";

import Web3 from "web3";
import useAppSelector from "../../hooks/useAppSelector";
import Toast from "../Utils/Toast/Toast";

const Stake = () => {
  const { account } = useAppSelector((state) => state.account);
  const { AutoContract, JUSDContract, JUSDBalance } = useAppSelector(
    (state) => state.contracts
  );

  const [send_tx_status, setSendTxStatus] = useState(false);
  const [wait_tx, setWaitTx] = useState(false);

  const txStatus = async (hash) => {
    const web3 = window.web3;
    const status = await web3.eth.getTransactionReceipt(hash);
    return status;
  };

  //Stake Value
  const [stakeValue, setStakeValue] = useState(0);

  //Deposit function
  const stakeTokens = async (amount) => {
    setSendTxStatus(true);
    setWaitTx(true);
    await JUSDContract.methods
      .approve(AutoContract._address, amount)
      .send({ from: account })
      .on("transactionHash", async (hash) => {
        const refreshId = setInterval(async () => {
          const tx_status = await txStatus(hash);
          if (tx_status && tx_status.status) {
            setWaitTx(false);
            setSendTxStatus(false);
            clearInterval(refreshId);
            Toast.fire({
              icon: "success",
              title: "Approved Success!",
            });
            setSendTxStatus(true);
            setWaitTx(true);
            AutoContract.methods
              .deposit(amount)
              .send({ from: account })
              .on("transactionHash", async (hash) => {
                const depositCheck = setInterval(async () => {
                  const tx_status = await txStatus(hash);
                  if (tx_status && tx_status.status) {
                    setWaitTx(false);
                    setSendTxStatus(false);
                    clearInterval(depositCheck);
                    Toast.fire({
                      icon: "success",
                      title: "Deposit Success!",
                    });
                    setStakeValue(0);
                  }
                }, 1500);
              });
          }
        }, 1500);
      });
  };

  const setStakeValueMax = () => {
    setStakeValue(Web3.utils.fromWei(JUSDBalance.toString()));
  };

  const handleChangeStakeValue = (e) => {
    setStakeValue(e.target.value);
  };

  return (
    <>
      <Grid templateColumns="repeat(10, 1fr)" gap={0}>
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
                value={stakeValue}
                onChange={handleChangeStakeValue}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={setStakeValueMax}>
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
        disabled={stakeValue == 0 || (wait_tx && send_tx_status)}
        mt={2}
        mb={5}
        w={"100%"}
        onClick={() => {
          stakeTokens(Web3.utils.toWei(stakeValue.toString()));
        }}
      >
        {wait_tx && send_tx_status ? (
          <>
            <Spinner size={"sm"} mr={2} /> Waiting the transaction ...
          </>
        ) : (
          "Stake"
        )}
      </Button>

      {/* <Portfolio
        balance={Web3.utils.fromWei(StableCoinAutoCompoundStakingBalance.toString())}
        reward={Web3.utils.fromWei(RewardBalance.toString())}
        total={
          parseInt(Web3.utils.fromWei(RewardBalance.toString())) +
          parseInt(Web3.utils.fromWei(StableCoinAutoCompoundStakingBalance.toString()))
        }
      /> */}
    </>
  );
};

export default Stake;
