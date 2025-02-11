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
                description: "To deploy a Safe smart account on any EVM chain, you need to specify the chainId (type number), owners (type: list of 20 bytes addresses) and the threshold (type: number). The threshold should be always less than or equal to the number of owners.",
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
        prompt: "Deploy a new Safe"
    })

    console.log(response.toolResults);
};

main().catch(console.error);

