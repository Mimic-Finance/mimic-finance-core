const MENU = [
  {
    label: "JUSD",
    children: [
      {
        label: "Mint",
        subLabel: "Mint JUSD with any Stable coin",
        href: "/mint",
      },
      {
        label: "Redeem",
        subLabel: "Redeem JUSD to any Stable coin",
        href: "/redeem",
      },
    ],
  },
  // {
  //   label: "Home",
  //   href: "/",
  // },
  {
    label: "Exchange",
    href: "https://mimic-exchange.vercel.app/",
  },
  {
    label: "Farm",
    href: "/farm",
  },
  {
    label: "Auto-compound",
    href: "/auto",
  },
  {
    label: "Rewards",
    href: "/rewards",
  },
  {
    label: "Portfolio",
    href: "/portfolio",
  },
];

export default MENU;
