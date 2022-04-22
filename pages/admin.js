import { Box, Center, Text } from "@chakra-ui/react";
import { AdminContextProvider } from "../contexts/AdminContext";
import useAccount from "hooks/useAccount";

const Admin = () => {
  const account = useAccount();
  return (
    <>
      <Center>
        <Box>
          <AdminContextProvider>
            <Box style={{ textAlign: "center" }}>
              <Text fontSize="4xl">Admin Panel</Text>
              <Text>{account}</Text>
            </Box>
          </AdminContextProvider>
        </Box>
      </Center>
    </>
  );
};

export default Admin;
