
export const CURRENT_STATE_VERSION = 5;

export const AuraConfig = {
    HORMONE_DECAY_RATE: 0.01,
    BOREDOM_DECAY_RATE: 0.005,
    LOAD_DECAY_RATE: 0.05,
    NOVELTY_BOOST: 0.2,
};

// --- Geometric Knowledge Graph Constants ---
export const MDNA_DIMENSIONS = 80;
export const HEBBIAN_LEARNING_RATE = 0.05;
export const CONNECTION_DECAY_RATE = 0.998;
export const PRUNING_THRESHOLD = 0.01;

// --- Economic Attention Network (ECAN) Constants ---
export const ECAN_CONSTANTS = {
    STARTING_STI: 100,
    STARTING_LTI: 50,
    MAX_STI: 200,
    MAX_LTI: 200,
    // Rent: How much STI is lost per tick.
    RENT_RATE: 0.5,
    // Forget: STI threshold below which an atom is removed/archived.
    FORGET_THRESHOLD: 0,
    // Attention: STI threshold to be considered in "Working Memory" (Conscious Focus).
    ATTENTION_THRESHOLD: 80,
    // Boosts
    ACCESS_BOOST_STI: 20,
    ACCESS_BOOST_LTI: 2,
};
