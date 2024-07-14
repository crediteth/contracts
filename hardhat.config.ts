import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import './tasks/deploy';

const INFURA_API_KEY = vars.get("INFURA_API_KEY");
const TEST_PK = vars.get("TEST_PK");

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: 'base-sepolia',
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [TEST_PK],
    },
    basesepolia: {
      url: `https://base-sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [TEST_PK],
    },
  },
};

export default config;