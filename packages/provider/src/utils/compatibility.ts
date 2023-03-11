import { isCompatible } from './site';
import CACHED_INCOMPATIBLE_SITES from '@exzo-wallet/remote-configs/provider/incompatible_sites.json';

interface CompatibilityCache {
    isExzoWallet: boolean;
}

const EXZOWALLET_COMPATIBLITY_KEY = '__ExzoWallet_compatibility__';

function getCompatibility(): CompatibilityCache | null {
    const cache = window.localStorage.getItem(EXZOWALLET_COMPATIBLITY_KEY);
    if (cache) {
        return JSON.parse(cache);
    }
    return null;
}

function setCompatibility(isExzoWallet: boolean) {
    return window.localStorage.setItem(
        EXZOWALLET_COMPATIBLITY_KEY,
        JSON.stringify({ isExzoWallet })
    );
}

export function getExzoWalletCompatibility(): CompatibilityCache {
    const compatibility = getCompatibility();
    if (compatibility) {
        return compatibility;
    }
    return updateExzoWalletCompatibility(CACHED_INCOMPATIBLE_SITES);
}

export function updateExzoWalletCompatibility(
    incompatibleSites: string[] = CACHED_INCOMPATIBLE_SITES
): CompatibilityCache {
    const isExzoWallet = isCompatible(incompatibleSites);
    setCompatibility(isExzoWallet);
    return { isExzoWallet };
}
