import ReactLogo from '../logo.svg';
const defaultLogo = ReactLogo;

const dummyBonds = [
  {
    id: 1,
    type: "Non-convertible",
    faceValue: "100 ETH",
    maturityDate: "2024-06-01",
    interestRate: 5,
    apr: 5.5,
    issuer: "Your Project",
    website: "https://project-a.com",
    purpose: "Fund project expansion.",
    auctionStatus: "Active",
    logo: "https://assets.coingecko.com/coins/images/13423/standard/Frax_Shares_icon.png?1696513183" || defaultLogo,
  },
  {
    id: 2,
    type: "Convertible",
    faceValue: "200 ETH",
    maturityDate: "2025-06-01",
    interestRate: 7,
    apr: 7.2,
    issuer: "Project B",
    website: "https://project-b.com",
    purpose: "Develop new product features.",
    auctionStatus: "Upcoming",
    logo: "https://assets.coingecko.com/coins/images/11939/standard/shiba.png?1696511800" || defaultLogo,
  },
  {
    id: 3,
    type: "Non-convertible",
    faceValue: "150 ETH",
    maturityDate: "2024-12-01",
    interestRate: 6,
    apr: 6.3,
    issuer: "Project C",
    website: "https://project-c.com",
    purpose: "Increase marketing efforts.",
    auctionStatus: "Past",
    logo: "https://assets.coingecko.com/coins/images/12559/standard/Avalanche_Circle_RedWhite_Trans.png?1696512369" || defaultLogo,
  },
  {
    id: 4,
    type: "Convertible",
    faceValue: "250 ETH",
    maturityDate: "2025-03-01",
    interestRate: 8,
    apr: 8.1,
    issuer: "Your Project",
    website: "https://project-d.com",
    purpose: "Upgrade infrastructure.",
    auctionStatus: "Active",
    logo: "https://assets.coingecko.com/coins/images/29850/standard/pepe-token.jpeg?1696528776" || defaultLogo,
  },
  {
    id: 5,
    type: "Non-convertible",
    faceValue: "300 ETH",
    maturityDate: "2023-08-15",
    interestRate: 4,
    apr: 4.2,
    issuer: "Project E",
    website: "https://project-e.com",
    purpose: "Expand research team.",
    auctionStatus: "Active",
    logo: "https://assets.coingecko.com/coins/images/12645/standard/AAVE.png?1696512452" || defaultLogo,
  },
  {
    id: 6,
    type: "Convertible",
    faceValue: "400 ETH",
    maturityDate: "2024-11-20",
    interestRate: 6,
    apr: 6.5,
    issuer: "Project F",
    website: "https://project-f.com",
    purpose: "Open new office.",
    auctionStatus: "Upcoming",
    logo: "https://static.coingecko.com/s/polkadot-73b0c058cae10a2f076a82dcade5cbe38601fad05d5e6211188f09eb96fa4617.gif" || defaultLogo,
  },
  {
    id: 7,
    type: "Non-convertible",
    faceValue: "250 ETH",
    maturityDate: "2025-01-10",
    interestRate: 7,
    apr: 7.4,
    issuer: "Project G",
    website: "https://project-g.com",
    purpose: "Develop new app.",
    auctionStatus: "Past",
    logo: "https://assets.coingecko.com/coins/images/12504/standard/uni.jpg?1696512319" || defaultLogo,
  },
  {
    id: 8,
    type: "Convertible",
    faceValue: "150 ETH",
    maturityDate: "2023-12-01",
    interestRate: 5,
    apr: 5.7,
    issuer: "Project H",
    website: "https://project-h.com",
    purpose: "Fund community events.",
    auctionStatus: "Active",
    logo: "https://assets.coingecko.com/coins/images/5681/standard/Fetch.jpg?1696506140" || defaultLogo,
  },
];