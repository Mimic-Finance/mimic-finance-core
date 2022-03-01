import {
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  FormControl,
  Text,
  Input,
  Grid,
  GridItem,
  Select,
  Center,
} from "@chakra-ui/react";

import Stake from "./Stake";
import WithDraw from "./Withdraw";

export const Panel = (props) => {
  return (
    <Tabs variant="enclosed">
      <TabList>
        <Tab>Stake</Tab>
        <Tab>Withdraw</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Stake />
        </TabPanel>
        <TabPanel>
          <WithDraw />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
