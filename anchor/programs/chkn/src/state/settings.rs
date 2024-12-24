use anchor_lang::prelude::*;

#[account]
pub struct Settings {
    pub owner: Pubkey,
    pub price_individual_monthly: u64,
    pub price_individual_yearly: u64,
    pub price_group_monthly: u64,
    pub price_group_yearly: u64,
}

impl Settings {
    pub const LEN: usize = 8 + std::mem::size_of::<Settings>();
}
