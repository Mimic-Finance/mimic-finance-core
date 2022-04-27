import { createContext, useEffect, useState, useCallback } from "react";
import { useWhitelisted } from "hooks/useFunctions";
import { Text, Center, Box, Spinner } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

export const PoolContext = createContext(false);

export const PoolContextProvider = ({ children, address }) => {
  const getWhitelisted = useWhitelisted();
  const [whitelist, setWhitelisted] = useState([]);
  const [accessible, setAccessible] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkOpenPool = useCallback(async () => {
    const open = whitelist.filter((whitelist) => address === whitelist.address);
    if (open.length > 0) {
      setAccessible(true);
    }
    setLoading(false);
  }, [whitelist, address]);

  useEffect(() => {
    setWhitelisted(getWhitelisted);
  }, [getWhitelisted]);

  useEffect(() => {
    if (whitelist.length > 0) {
      checkOpenPool();
    }
  }, [checkOpenPool, whitelist.length]);

  if (accessible && !loading) {
    return <PoolContext.Provider>{children}</PoolContext.Provider>;
  } else if (loading) {
    return (
      <PoolContext.Provider>
        <Center>
          <Spinner size="xl" />
        </Center>
        <Center>
          <Text fontSize="2xl" mt={3}>
            Verifying Open Pool
          </Text>
        </Center>
      </PoolContext.Provider>
    );
  } else {
    return (
      <PoolContext.Provider>
        <>
          <Center>
            <WarningIcon w={20} h={20} mt={10} mb={5} />
          </Center>
          <Box style={{ textAlign: "center" }}>
            <Text fontSize="4xl">The time has not come yet</Text>
            <Text>Please contact admin to vote open this pool</Text>
          </Box>
        </>
      </PoolContext.Provider>
    );
  }
};
