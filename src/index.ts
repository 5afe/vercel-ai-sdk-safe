import { generateObject, generateText, tool } from 'ai';
import * as dotenv from "dotenv";
import { ollama } from 'ollama-ai-provider';
const model = ollama('llama3.2');
import { z } from 'zod';
import { deployNewSafe } from './safe/deploy';

dotenv.config();

const main = async () => {
    const deploySafeResponse = await generateText({
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
            })
        },
        prompt: "Please deploy a new Safe"
    })

    // messages: [
    //   {
    //     role: 'user',
    //     content: `
    //   Hi! My name is Kewin. 
    //   I'd like to deploy a new Safe on chainId 11155111. 
    //   The owners should be these addresses: 0x352365317AD7B4c04D8FEA6900C5C8F85b37CbC9, 0xE26be297Ca9a7c6e4c3B0a7C589606428A036a7b. 
    //   Threshold should be 1. 
    //   `,
    //   },
    // ],

    //     const gateResponse = await generateObject({
    //         model,
    //         system:
    //           'Based on the given json file with data to deploy a Safe, your job is to decide if a the request can be further processed.',
    //         schema: z.object({
    //           is_request_accepted: z.boolean(),
    //           denial_reason: z
    //             .string()
    //             .optional()
    //             .describe('If request is rejected, you need to give a reason.'),
    //         }),
    //         messages: [{ role: 'user', content: JSON.stringify(response.object) }],
    //       })

    // console.log(gateResponse.object)

    // const agentAction = ['deploy', 'transact', 'read', 'unknown'] as const

    // const agents = {
    //     deploy: 'You will create a new Safe Smart Account for the user based on the user input.',
    //     transact: 'Given a User Safe account address and transaction details, you will build and execute Ethereum transaction on behalf of the user.',
    //     read: 'You will read the address of Safe account from the user and execute a read-only operation on the Safe account.',
    // }

    // const routingResponse = await generateObject({
    //     model,
    //     system:
    //         'You are a first point of contact for a call center. Your job is to redirect the client to a correct agent.',
    //     schema: z.object({
    //         agent_type: z.enum(agentAction),
    //     }),
    //     messages: [
    //         {
    //             role: 'user',
    //             content: `
    //             Hi! I want to create a new Safe.
    //         `,
    //         },
    //     ],
    // })

    // if (routingResponse.object.agent_type === 'unknown') {
    //     console.log("exiting")
    //     process.exit(1)
    // }

    // const response = await generateText({
    //     model,
    //     system: agents[routingResponse.object.agent_type],
    //     // messages: [
    //     //   {
    //     //     role: 'user',
    //     //     content: ``,
    //     //   },
    //     // ],
    //     prompt: ""
    // })

    console.log(deploySafeResponse)
};

main().catch(console.error);

