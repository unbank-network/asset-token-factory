import hre from "hardhat";
import { readFileSync, writeFileSync } from "fs";
import { verifyContract } from "./common/verify-contract";

const outputFilePath = `./deployments/${hre.network.name}.json`;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`>>>>>>>>>>>> Deployer: ${deployer.address} <<<<<<<<<<<<\n`);

  const deployments = JSON.parse(readFileSync(outputFilePath, "utf-8"));
  const ContractName = "Master";

  const Master = await hre.ethers.getContractFactory(ContractName);
  const master = await Master.deploy();
  console.log(`${ContractName} deployed to:`, master.address);

  if (!deployments[ContractName]) deployments[ContractName] = [];
  deployments[ContractName].push(master.address);
  writeFileSync(outputFilePath, JSON.stringify(deployments, null, 2));

  await master.deployTransaction.wait(30);
  await verifyContract(master.address, []);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
