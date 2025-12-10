
import { KnowledgeFact, Episode } from '../types';
import { ECAN_CONSTANTS } from '../constants';

export const ECAN = {
    /**
     * Initializes attention parameters for a new memory item.
     * @param baseSTI Optional initial STI. Defaults to ECAN_CONSTANTS.STARTING_STI.
     * @param baseLTI Optional initial LTI. Defaults to ECAN_CONSTANTS.STARTING_LTI.
     */
    initialize: (baseSTI?: number, baseLTI?: number) => ({
        STI: baseSTI !== undefined ? baseSTI : ECAN_CONSTANTS.STARTING_STI,
        LTI: baseLTI !== undefined ? baseLTI : ECAN_CONSTANTS.STARTING_LTI,
    }),

    /**
     * Applies rent (decay) to a memory item's STI.
     * LTI decays much slower (or not at all for rent, depending on design, here we just decay STI).
     * @param item The memory item (Fact or Episode).
     * @returns The item with updated STI.
     */
    applyRent: <T extends { STI?: number; LTI?: number }>(item: T): T => {
        const currentSTI = item.STI || 0;
        // Rent is fixed per tick, but could be dynamic based on system load
        const newSTI = Math.max(0, currentSTI - ECAN_CONSTANTS.RENT_RATE);
        
        return {
            ...item,
            STI: newSTI,
        };
    },

    /**
     * Boosts the STI and LTI of an item when accessed.
     * @param item The memory item.
     * @returns The item with updated attention values.
     */
    boostAttention: <T extends { STI?: number; LTI?: number }>(item: T): T => {
        const currentSTI = item.STI || 0;
        const currentLTI = item.LTI || 0;

        const newSTI = Math.min(ECAN_CONSTANTS.MAX_STI, currentSTI + ECAN_CONSTANTS.ACCESS_BOOST_STI);
        const newLTI = Math.min(ECAN_CONSTANTS.MAX_LTI, currentLTI + ECAN_CONSTANTS.ACCESS_BOOST_LTI);

        return {
            ...item,
            STI: newSTI,
            LTI: newLTI,
        };
    },

    /**
     * Determines if an item should be forgotten based on its STI/LTI.
     * For now, we use a simple threshold on STI. LTI protects items from being fully deleted in a real system,
     * but here we just check STI for "active" memory. 
     * Note: "Forgetting" in Aura might just mean moving to cold storage, but for this simulation, 
     * we might just filter them out of the active working set view.
     */
    shouldForget: (item: { STI?: number }): boolean => {
        return (item.STI || 0) <= ECAN_CONSTANTS.FORGET_THRESHOLD;
    },

    /**
     * Performs a "Hebbian Boost" on two items that were activated together.
     * Boosts the LTI of both, representing a strengthening connection.
     */
    hebbianBoost: <T extends { LTI?: number }>(item1: T, item2: T): [T, T] => {
        const boost = ECAN_CONSTANTS.ACCESS_BOOST_LTI; // Small permanent boost
        
        const updated1 = {
            ...item1,
            LTI: Math.min(ECAN_CONSTANTS.MAX_LTI, (item1.LTI || 0) + boost)
        };
        const updated2 = {
            ...item2,
            LTI: Math.min(ECAN_CONSTANTS.MAX_LTI, (item2.LTI || 0) + boost)
        };

        return [updated1, updated2];
    }
};
