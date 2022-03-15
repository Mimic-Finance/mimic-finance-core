import { Center, Spinner, Text, Box } from "@chakra-ui/react";

const Loading = () => {
  return (
    <>
      <Center pt="50px">
        <Spinner size="xl" />
      </Center>
      <Center pt="50px">
        <Box>
          <Text fontSize={"xl"}>Loading Contract</Text>
        </Box>
      </Center>
    </>
  );
};

export default Loading;
