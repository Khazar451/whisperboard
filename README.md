#  WhisperBoard — Anonymous Group Feedback on Midnight

> **Speak freely. Stay anonymous.** Built for the MLH × Midnight Hackathon (August 28–30, 2026).

WhisperBoard is a privacy-preserving anonymous feedback application built on the [Midnight Network](https://midnight.network/). Users can post messages to a shared feed without revealing their identity — all powered by zero-knowledge proofs.

##  Features

- ** True Anonymity** — Your identity is never stored on-chain. Zero-knowledge proofs ensure that posts are cryptographically anonymous.
- ** ZK-Proven Ownership** — Only the original author can delete their own post, verified via zero-knowledge proof (not by revealing who they are).
- ** Anonymous Feed** — A vertical feed of whispers from anonymous users, each identified only by a deterministic pseudonym (e.g., "Anon #9a4f").
- ** Real-time State** — Posts and deletions are reflected in real-time via Midnight's indexer.
- ** Privacy-First Design** — Dark theme with purple/cyan aesthetics that embody the privacy ethos.

##  How It Works

WhisperBoard is built on top of Midnight's [Bulletin Board example](https://github.com/midnightntwrk/example-bboard). Each "whisper" is a separate smart contract deployment on Midnight:

1. **User types a message** in the compose bar
2. **A new Compact smart contract is deployed** on-chain
3. **The message is posted** to that contract via a zero-knowledge proof
4. **The proof is generated locally** on the user's device — sensitive data never leaves their machine
5. **Other users see the message** in the feed, but can never determine who posted it
6. **Only the original poster can delete** their message (proven via ZK, not by identity)

### Architecture

```
whisperboard/
├── contract/          # Compact smart contract (ZK-proven bulletin board)
│   └── src/
│       └── bboard.compact    # The Compact language contract
├── api/               # Shared API layer (deploy, join, post, takeDown)
├── bboard-cli/        # Command-line interface (for testing)
└── bboard-ui/         # React web interface (WhisperBoard UI)
    └── src/
        ├── components/
        │   ├── ComposeBar.tsx      # Message input with ZK shield indicator
        │   ├── Board.tsx           # Feed item card with anon pseudonym
        │   └── Layout/            # Header + feed layout
        ├── contexts/              # Board deployment state management
        └── config/theme.ts        # Dark privacy-themed MUI theme
```

##  Getting Started

### Prerequisites

- **Node.js** v22+ ([install](https://nodejs.org/))
- **Docker** with Docker Compose v2 ([install](https://docs.docker.com/desktop/))
- **Lace Wallet** browser extension ([Chrome](https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk) | [Edge](https://microsoftedge.microsoft.com/addons/detail/lace/efeiemlfnahiidnjglmehaihacglceia))

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the local proof server (required for ZK proof generation)
cd bboard-cli
docker compose -f proof-server-local.yml up -d
cd ..

# 3. Build and start the UI (preprod network)
cd bboard-ui
npm run build:start
```

The UI will be available at **http://127.0.0.1:8085**.

### Lace Wallet Setup

1. Install the Lace wallet extension
2. Create a new wallet — select **Midnight** as the network
3. Set **Network** to **Preprod**
4. Set **Proof server** to **Local (http://localhost:6300)**
5. Fund your wallet from the [Preprod Faucet](https://midnight-tmnight-preprod.nethermind.dev/)
6. Go to **Tokens** → **Generate tDUST** (needed for transaction fees)

##  Privacy Guarantees

| What's Public | What's Private |
|---|---|
| Message text (the whisper itself) | Author identity |
| Contract address | Secret key |
| Board state (vacant/occupied) | Ownership proof inputs |

The ZK proof verifies that the poster has a valid secret key that corresponds to the on-chain public key — without ever revealing that secret key or linking it to any identity.

##  Tech Stack

- **Midnight Network** — Privacy-focused Layer 1 blockchain with ZK proofs
- **Compact** — TypeScript-based smart contract language
- **Midnight.js** — JavaScript SDK for interacting with Midnight contracts
- **React** + **Material UI** — Frontend framework
- **Vite** — Build tool
- **Docker** — Local proof server runtime

##  Hackathon Info

- **Event:** MLH × Midnight Hackathon (August 28–30, 2026)
- **Theme:** Build privacy-preserving applications that give users control over their digital lives
- **Team:** Built during the 48-hour hackathon weekend

##  License

 Based on Midnight's [example-bboard](https://github.com/midnightntwrk/example-bboard).
