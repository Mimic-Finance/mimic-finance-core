import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import ClaimAndSwap from "./ClaimAndSwap";
import DepositToFarm from "./DepositToFarm";
import Whitelisted from "./Whitelisted";

const Panel = () => {
  const menu = ["Whitelisted", "Deposit to Farm", "Claim & Swap"];
  const MenuList = menu.map((name) => <Tab key={name}>{name}</Tab>);
  return (
    <>
      <Tabs variant="enclosed">
        <TabList>{MenuList}</TabList>
        <TabPanels>
          <TabPanel>
            <Whitelisted />
          </TabPanel>
          <TabPanel>
            <DepositToFarm />
          </TabPanel>
          <TabPanel>
            <ClaimAndSwap />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default Panel;
