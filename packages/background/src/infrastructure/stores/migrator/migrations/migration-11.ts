import { BlankAppState } from '@exzo-wallet/background/utils/constants/initialState';
import { IMigration } from '../IMigration';

/**
 * This migration adds the showWelcomeMessage flag
 */
export default {
    migrate: async (persistedState: BlankAppState) => {
        return {
            ...persistedState,
            PreferencesController: {
                ...persistedState.PreferencesController,
                showWelcomeMessage: false,
            },
        };
    },
    version: '0.1.18',
} as IMigration;
