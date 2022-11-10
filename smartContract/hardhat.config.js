require("@nomicfoundation/hardhat-toolbox");

require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
 module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "rinkeby",
  networks: {
    hardhat: {},
    rinkeby: {
      //url: "http://127.0.0.1:8545",
       url:  "https://eth-rinkeby.alchemyapi.io/v2/JLIJLHocrp221BrAycVPi8DSgHAgUyZp",
       accounts: ["ab5157e54fe0892079bb2799f0705e2960dbd49e9c94600b14a2ce2eea36134a"]
    }
   },

   solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
   },
  
};


