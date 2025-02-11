import Safe from "@safe-global/protocol-kit";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { formatEther } from 'viem'

export const deployNewSafe = async () => {
    const saltNonce = Math.trunc(Math.random() * 10 ** 10).toString(); // Random 10-digit integer
    const protocolKit = await Safe.init({
      provider: process.env.RPC as string,
      signer: process.env.AGENT_PRIVATE_KEY,
      predictedSafe: {
        safeAccountConfig: {
          owners: [process.env.AGENT_ADDRESS as string],
          threshold: 1,
        },
        safeDeploymentConfig: {
          saltNonce,
        },
      },
    });
  
    const safeAddress = await protocolKit.getAddress();
  
    const deploymentTransaction =
      await protocolKit.createSafeDeploymentTransaction();
  
    const safeClient = await protocolKit.getSafeProvider().getExternalSigner();
  
    const transactionHash = await safeClient?.sendTransaction({
      to: deploymentTransaction.to,
      value: BigInt(deploymentTransaction.value),
      data: deploymentTransaction.data as `0x${string}`,
      chain: sepolia,
    });
  
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.RPC as string),
    });
  
    await publicClient?.waitForTransactionReceipt({
      hash: transactionHash as `0x${string}`,
    });
  
    return `A new Safe multisig was successfully deployed on Sepolia. You can see it live at https://app.safe.global/home?safe=sep:${safeAddress}. The saltNonce used was ${saltNonce}.`;
};

export const getEthBalance = async (address: string, chainId: number) => {
  
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.RPC as string),
  });

  const chainIdFromRPC = await publicClient.getChainId();

  if (chainId !== chainIdFromRPC) throw new Error("Chain ID not supported.");
  if (!address.startsWith("0x") || address.length !== 42) {
    throw new Error("Invalid address.");
  }

  const fetchedEthBalance = await fetch(
    `https://safe-transaction-sepolia.safe.global/api/v1/safes/${address}/balances/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).catch((error) => {
    throw new Error("Error fetching data from the tx service:" + error);
  });

  const ethBalanceData = await fetchedEthBalance.json();
  const weiBalance = ethBalanceData.find(
    (element: any) => element?.tokenAddress === null && element?.token === null
  )?.balance;

  const ethBalance = formatEther(weiBalance); // Convert from wei to eth considering fractional values

  return `The current balance of the Safe Multisig at address ${address} is ${ethBalance} ETH.`;
};