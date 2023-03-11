const BLOCK_WALLET_DOMAIN = '.blockwallet.io';

export const isAExzoWalletNode = (rpcUrl: string): boolean => {
    return rpcUrl.endsWith(BLOCK_WALLET_DOMAIN);
};

export const customHeadersForExzoWalletNode = { wallet: 'BlockWallet' };
