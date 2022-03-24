import { Text, TextProps } from "@chakra-ui/layout";

export const Copyright = (props) => (
  <Text fontSize="sm" {...props}>
    &copy; {new Date().getFullYear()} Mimic Finance, Inc. All rights reserved.
  </Text>
);
