# Hedera Donation Widget

A React-based donation widget that enables HBAR and USDC donations on the Hedera network using HashPack wallet integration.

## Overview

This widget allows website owners to embed a donation functionality that connects to the Hedera network through HashPack wallet. Users can make donations in either HBAR or USDC tokens.

## Features

- HashPack wallet integration
- Support for HBAR and USDC donations
- Testnet compatibility
- Iframe embedding capability

## Prerequisites

- Node.js (v14 or higher)
- HashPack wallet extension installed in the browser
- A Hedera testnet account

## Installation

1. Clone the repository:
```bash
git clone https://github.com/elwachin/hedera-donation-widget.git
cd hedera-donation-widget
```

2. Install dependencies:
```bash
npm install
```

3. Configure the constants in `src/constants.js`:
```javascript
DONATION_RECIPIENT_ID: Your Hedera account ID that will receive donations
DEFAULT_NODE_ID: Hedera node ID (default is "0.0.3")
USDC_TOKEN_ID: USDC token ID on Hedera network
HASHCONNECT_PROJECT_ID: Your HashConnect project ID
```

4. Start the development server:
```bash
npm run dev
```

## Using as an Iframe Widget

To embed this donation widget in your website, use the following HTML code:

```html
<iframe
  src="[your-deployed-url]"
  width="400"
  height="600"
  frameborder="0"
  allow="clipboard-write"
></iframe>
```

### Important Notes for Iframe Integration

1. The parent website must allow iframe embedding
2. The HashPack wallet popup might require additional configuration for iframe compatibility
3. Ensure proper CSP (Content Security Policy) settings on the parent website

## Technical Details

- Built with React
- Uses HashConnect for HashPack wallet integration
- Runs on Hedera testnet (configurable for mainnet)
- Uses @hashgraph/sdk for Hedera network interactions

## Wallet Integration

This widget exclusively uses HashPack wallet for Hedera network interactions. Users will need to:

1. Install the HashPack wallet browser extension
2. Create or import a Hedera account
3. Connect their wallet when prompted by the widget

## Security Considerations

- All transactions are signed through HashPack wallet
- No private keys are stored in the application
- Network configuration is hardcoded for security (not using .env)

## Development

To modify the widget:

1. Update constants in `src/constants.js`
2. Modify the Donation component in `src/components/Donation.jsx`
3. Customize styling in respective CSS files

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the contents of the `dist` folder to your hosting service

