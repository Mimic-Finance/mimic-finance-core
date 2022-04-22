import { createContext, useEffect, useState, useCallback } from "react";
import { useFarm } from "../hooks/useContracts";
import useAccount from "../hooks/useAccount";
import { Text, Center, Box } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

export const AdminContext = createContext(false);

export const AdminContextProvider = ({ children }) => {
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

  if (role) {
    return <AdminContext.Provider>{children}</AdminContext.Provider>;
  } else {
    return (
      <AdminContext.Provider>
        <Center>
          <WarningIcon w={20} h={20} mt={10} mb={5} />
        </Center>
        <Box style={{ textAlign: "center" }}>
          <Text fontSize="4xl">Permission Denied</Text>
          <Text>Please connect wallet with deployer account.</Text>
        </Box>
      </AdminContext.Provider>
    );
  }
};
