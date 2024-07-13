/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

import fs from 'fs/promises';
import path from 'node:path';

import { task } from 'hardhat/config';
import networks from '../networks';
import { ethers } from 'hardhat';

task(
  'deploy',
  'Deploys the smart contracts.'
).setAction(async (taskArgs, { network }) => {
  try {
    const source = await fs.readFile(
      path.join(__dirname, '../functions/chainlinkFunction.js'),
      { encoding: 'utf8' }
    );
    console.log(source);

    const Registry = await ethers.getContractFactory('Registry');
    const registry = await Registry.deploy();

    console.log(`Deployed Registry contract to ${await registry.getAddress()}`);

    const CreditScore = await ethers.getContractFactory('CreditScore');
    const creditScore = await CreditScore.deploy(
      networks[network.name].functionsRouter,
      networks[network.name].donId,
      source
    );

    console.log(`Deployed CreditScore contract to ${await creditScore.getAddress()}`);
  } catch (e) {
    console.log(e);
  }
});