import { generateObject, generateText, tool } from 'ai';
import * as dotenv from "dotenv";
import { ollama } from 'ollama-ai-provider';
const model = ollama('llama3.2');
import { z } from 'zod';
import { deployNewSafe, getEthBalance } from './safe/safe';

dotenv.config();

const main = async () => {
    const response = await generateText({
        model,
        system:
            'Create a new Safe.',
        tools: {
            createSafe: tool({
                description: "Deploy a Safe smart account on any EVM chain with a random salt nonce. The Safe owner will the the agent address set from .env file with threshold of 1.",
                parameters: z.object({
                }),
                execute: async (params) => {
                    return await deployNewSafe()
                }
            }),
            getEthBalance: tool({
                description: "Call to get the balance in ETH of a Safe Multisig for a given address and chain ID.",
                parameters: z.object({
                    address: z.string(),
                    chainId: z.string()
                }),
                execute: async (params) => {
                    return await getEthBalance(params.address, parseInt(params.chainId))
                }
            }),
        },
        prompt: "Please show ETH balance of Safe Smart Account at address 0xF9D357d80D7de11b752a0D8020E82d241d889691 on chain 11155111."
    })

    console.log(response.toolResults);
};

main().catch(console.error);

