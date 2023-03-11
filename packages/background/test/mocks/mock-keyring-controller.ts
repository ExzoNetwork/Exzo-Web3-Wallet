import initialState from '../../src/utils/constants/initialState';
import mockEncryptor from './mock-encryptor';
import KeyringControllerDerivated from '@exzo-wallet/background/controllers/KeyringControllerDerivated';

const mockKeyringController = new KeyringControllerDerivated({
    initState: initialState.KeyringController,
    encryptor: mockEncryptor,
});

export { mockKeyringController };
