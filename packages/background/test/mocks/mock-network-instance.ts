import NetworkController, {
    NetworkControllerState,
} from '@exzo-wallet/background/controllers/NetworkController';
import { INITIAL_NETWORKS } from '@exzo-wallet/background/utils/constants/networks';

const initialNetworkControllerState: NetworkControllerState = {
    selectedNetwork: 'goerli',
    availableNetworks: INITIAL_NETWORKS,
    isNetworkChanging: false,
    isUserNetworkOnline: true,
    isProviderNetworkOnline: true,
    isEIP1559Compatible: {},
};

const getNetworkControllerInstance = (selectedNetwork: string = 'goerli') =>
    new NetworkController({
        ...initialNetworkControllerState,
        selectedNetwork,
    });

export { getNetworkControllerInstance, initialNetworkControllerState };
