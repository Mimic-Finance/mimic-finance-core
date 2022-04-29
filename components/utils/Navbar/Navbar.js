import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Center,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  useColorMode,
  Container,
} from "@chakra-ui/react";

import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";

import Image from "next/image";
import LinkNext from "next/link";
import NAV_ITEMS from "../../../constants/Menu";

import ConnectButton from "../Button/ConnectButton";
import { AdminContextProvider } from "../../../contexts/AdminContext";
import { useRouter } from "next/router";

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    // <Container maxW="container.xl">
    <Box>
      <Flex
        color={useColorModeValue("gray.600", "white")}
        minH={"100px"}
        py={{ base: 4 }}
        px={{ base: 10 }}
        borderBottom={1}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({
              base: "center",
              md: "left",
            })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
          >
            <LinkNext href="/" passHref>
              <a>
                <Image
                  src={
                    colorMode === "dark"
                      ? "/assets/images/logo.png"
                      : "/assets/images/logo-light.png"
                  }
                  width={150}
                  height={46}
                  alt="Mimic Finance Logo"
                />
              </a>
            </LinkNext>
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <IconButton
            onClick={toggleColorMode}
            aria-label="toggle theme mode"
            icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          />
          <LinkNext href="/vault" passHref>
            {/* <Button display={{ base: "none", md: "flex" }} ml={10}>
              Connect Wallet
            </Button> */}
            <ConnectButton></ConnectButton>
          </LinkNext>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
    // </Container>
  );
};

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const router = useRouter();

  return (
    <Stack direction={"row"} spacing={10} pt={3}>
      {NAV_ITEMS.map((navItem) => (
        <Box
          key={navItem.label}
          style={{ cursor: "pointer" }}
          onClick={() => {
            router.push(navItem.href ?? "#");
          }}
        >
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              {/* <LinkNext href={navItem.href ?? "#"} passHref> */}
              <Text
                fontSize={"md"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Text>
              {/* </LinkNext> */}
            </PopoverTrigger>

            {navItem.children && (
              <>
                <PopoverContent
                  border={0}
                  boxShadow={"xl"}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={"xl"}
                  minW={"sm"}
                >
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
              </>
            )}
          </Popover>
        </Box>
      ))}

      <AdminContextProvider nav={true}>
        <Box>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <LinkNext href="/admin" passHref>
                <a>
                  <Text
                    fontSize={"md"}
                    fontWeight={500}
                    color={linkColor}
                    _hover={{
                      textDecoration: "none",
                      color: linkHoverColor,
                    }}
                  >
                    Admin
                  </Text>
                </a>
              </LinkNext>
            </PopoverTrigger>
          </Popover>
        </Box>
      </AdminContextProvider>
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{
            opacity: "100%",
            transform: "translateX(0)",
          }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      // bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        pl={8}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Center>
          <ul type="square">
            <Text
              fontWeight={600}
              color={useColorModeValue("gray.600", "gray.200")}
            >
              <li> {label}</li>
            </Text>
          </ul>
        </Center>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default Navbar;
