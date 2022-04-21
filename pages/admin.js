import { useState, useEffect, useCallback } from "react";
import { useFarm } from "../hooks/useContracts";
import useAccount from "../hooks/useAccount";
import { Box, Center } from "@chakra-ui/react";

const Admin = () => {
  const account = useAccount();
  const [role, setRole] = useState(false);
  const Farm = useFarm();

  const checkOwner = useCallback(async () => {
    const owner = await Farm.methods.owner().call();
    setRole(owner === account);
  }, [account, Farm]);

  useEffect(() => {
    checkOwner();
  }, [checkOwner]);

  console.log(account);
  return (
    <>
      <Center>
        <Box>
          <h1>
            Hi <b>{account} </b>
            <br />
            Role:===<b>{role ? "Owner" : "Not Owner"}</b>
          </h1>
        </Box>
      </Center>
    </>
  );
};

export default Admin;
