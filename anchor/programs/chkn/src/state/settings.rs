use anchor_lang::prelude::*;

#[account]
pub struct Settings {
    pub owner: Pubkey,
}

impl Settings {
    pub const LEN: usize = 8 + std::mem::size_of::<Settings>();
}
