import Safe from "@safe-global/protocol-kit";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

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
      transport: http(),
    });
  
    await publicClient?.waitForTransactionReceipt({
      hash: transactionHash as `0x${string}`,
    });
  
    return `A new Safe multisig was successfully deployed on Sepolia. You can see it live at https://app.safe.global/home?safe=sep:${safeAddress}. The saltNonce used was ${saltNonce}.`;
  };