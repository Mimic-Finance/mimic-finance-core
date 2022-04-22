import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import ClaimAndSwap from "./ClaimAndSwap";
import DepositToFarm from "./DepositToFarm";
import Whitelisted from "./Whitelisted";

const Panel = () => {
  const _menu = [
    {
      name: "Whitelisted",
      component: <Whitelisted />,
    },
    {
      name: "Deposit to Farm",
      component: <DepositToFarm />,
    },
    {
      name: "Claim & Swap",
      component: <ClaimAndSwap />,
    },
  ];
  const MenuList = _menu.map((menu, i) => <Tab key={i}>{menu.name}</Tab>);
  const ComponentMenuList = _menu.map((menu, i) => {
    return <TabPanel key={i}>{menu.component}</TabPanel>;
  });

  return (
    <>
      <Tabs variant="enclosed">
        <TabList>{MenuList}</TabList>
        <TabPanels>{ComponentMenuList}</TabPanels>
      </Tabs>
    </>
  );
};

export default Panel;
