# Vercel AI SDK + Safe

This example repo shows how to create an AI agent with capabilities to interact with your Safe using [Vercel AI SDK](https://sdk.vercel.ai/docs/introduction).

## What you’ll need

**Prerequisite knowledge:** You will need some basic familiarity with [Node.js](https://nodejs.org/en).

Before progressing with the tutorial, please make sure you have:

- Installed and opened `ollama`. This tutorial will run [`llama3.2`](https://ollama.com/library/llama3.2), but feel free to explore [other models](https://ollama.com/library);
- Set up a wallet for your agent with some Sepolia test funds to pay for the transactions, for example with [Metamask](https://metamask.io/);
- (Optional) If you wish to use OpenAI models instead (or another provider), you will need to create an account on their website and get an API key

## Setup

### Install ollama

See: https://github.com/ollama/ollama

```bash
ollama run llama3.2
```

### Create .env file

create a file named .env at the root of your project, and add your private key and address key to it:

```bash
cp .env.example .env
```

### Exeucte script

```bash
npx tsx src/index.ts
```

## Help

Please post any questions on [Stack Exchange](https://ethereum.stackexchange.com/questions/tagged/safe-core) with the `safe-core` tag.

## License

MIT, see [LICENSE](LICENSE).