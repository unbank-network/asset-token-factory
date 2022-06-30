import hre from "hardhat";
import { readFileSync, writeFileSync } from "fs";
import { verifyContract } from "./common/verify-contract";
import { numToWei } from "../utils/utils";

const outputFilePath = `./deployments/${hre.network.name}.json`;

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`>>>>>>>>>>>> Deployer: ${deployer.address} <<<<<<<<<<<<\n`);

  const deployments = JSON.parse(readFileSync(outputFilePath, "utf-8"));
  const masterAddress = "0x6940eae0aa3744972E4d87d4c500085940D0dC08";

  const params = {
    name: "",
    symbol: "",
    initialSupply: numToWei(1000, 18), // Enter no of tokens to be minted initially
    positiveSBTAddress: "",
    negativeSBTAddress: "",
    documentURL: ""
  };

  const master = await hre.ethers.getContractAt("Master", masterAddress);

  console.log("Calling addAsset() with params:", params);
  await master.addAsset(
    params.name,
    params.symbol,
    params.initialSupply,
    params.positiveSBTAddress,
    params.negativeSBTAddress,
    params.documentURL
  );

  const assets: any[] = await master.getAllAssets();
  const deployedAssetAddress = await assets[assets.length - 1];
  console.log("Deployed new asset:", deployedAssetAddress);

  if (!deployments.Assets) deployments.Assets = [];
  deployments.Assets.push(deployedAssetAddress);
  writeFileSync(outputFilePath, JSON.stringify(deployments, null, 2));

  await master.deployTransaction.wait(30);
  await verifyContract(deployedAssetAddress, [
    params.name,
    params.symbol,
    params.initialSupply,
    params.positiveSBTAddress,
    params.negativeSBTAddress,
    params.documentURL,
    deployer.address
  ]);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
