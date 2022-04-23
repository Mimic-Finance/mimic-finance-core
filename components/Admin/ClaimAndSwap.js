import {
  Text,
  Grid,
  GridItem,
  Select,
  Button,
  Box,
  Center,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAutoCompound } from "hooks/useContracts";
import useAccount from "hooks/useAccount";
import { useWhitelisted } from "hooks/useFunctions";

import Toast from "components/Utils/Toast/Toast";

const ClaimAndSwap = () => {
  const getWhitelisted = useWhitelisted();
  const [whitelisted, setWhitelisted] = useState([]);
  const account = useAccount();
  const AutoCompound = useAutoCompound();

  useEffect(() => {
    setWhitelisted(getWhitelisted);
  }, [getWhitelisted]);

  const [claimAddress, setClaimAddress] = useState(null);

  const [send_tx_status, setSendTxStatus] = useState(false);
  const [wait_tx, setWaitTx] = useState(false);

  const txStatus = async (hash) => {
    const web3 = window.web3;
    const status = await web3.eth.getTransactionReceipt(hash);
    return status;
  };

  const handleChangeClaimAddress = (e) => {
    setClaimAddress(e.target.value);
  };

  const handleClaimAndSwap = async () => {
    setSendTxStatus(true);
    setWaitTx(true);
    await AutoCompound.methods
      .claimAndSwap(claimAddress)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        const claimCheck = setInterval(async () => {
          const tx_status = await txStatus(hash);
          if (tx_status && tx_status.status) {
            setWaitTx(false);
            setSendTxStatus(false);
            clearInterval(claimCheck);
            Toast.fire({
              icon: "success",
              title: "Claim & Swap Success!",
            });
          }
        }, 1500);
      });
  };

  return (
    <>
      <Text fontSize="xl" mt={3} style={{ textAlign: "center" }}>
        <b>Claim & Swap</b>
      </Text>

      <Text style={{ textAlign: "center" }}>
        Claim $MIM reward and Swap to any token
      </Text>

      <Center>
        <Box width={"50%"}>
          <Grid pt={10} templateColumns="repeat(10, 1fr)" gap={0}>
            <GridItem colSpan={10}>
              <Select
                onChange={handleChangeClaimAddress}
                placeholder="Choose Pool"
              >
                {whitelisted &&
                  whitelisted.map((token) => {
                    return (
                      <>
                        <option key={token.address} value={token.address}>
                          {token.symbol}
                        </option>
                      </>
                    );
                  })}
              </Select>
            </GridItem>
          </Grid>
          <Button
            style={{
              color: "#FFFFFF",
              background: "linear-gradient(90deg ,#576cea 0%, #da65d1 100%)",
            }}
            disabled={claimAddress == null || (wait_tx && send_tx_status)}
            mt={3}
            w={"100%"}
            onClick={() => {
              handleClaimAndSwap();
            }}
          >
            {wait_tx && send_tx_status ? (
              <>
                <Spinner size={"sm"} mr={2} /> Waiting ...
              </>
            ) : (
              "Claim & Swap"
            )}
          </Button>
        </Box>
      </Center>
      <Divider mt={20} />
    </>
  );
};

export default ClaimAndSwap;
