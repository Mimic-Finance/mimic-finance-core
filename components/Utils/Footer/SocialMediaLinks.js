import { ButtonGroup, ButtonGroupProps, IconButton } from "@chakra-ui/react";
import * as React from "react";
import { FaGithub, FaTwitter, FaBook, FaTelegram } from "react-icons/fa";

export const SocialMediaLinks = (props) => (
  <ButtonGroup variant="ghost" color="gray.600" {...props}>
    <IconButton
      as="a"
      href="#"
      aria-label="GitBook"
      icon={<FaBook fontSize="20px" />}
    />
    <IconButton
      as="a"
      href="https://github.com/mimic-finance"
      target="_blank"
      aria-label="GitHub"
      icon={<FaGithub fontSize="20px" />}
    />
    <IconButton
      as="a"
      href="#"
      aria-label="Twitter"
      icon={<FaTwitter fontSize="20px" />}
    />
    <IconButton
      as="a"
      href="#"
      aria-label="Telegram"
      icon={<FaTelegram fontSize="20px" />}
    />
  </ButtonGroup>
);
