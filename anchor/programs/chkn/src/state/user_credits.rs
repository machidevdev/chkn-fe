use anchor_lang::prelude::*;

#[account]
pub struct UserCredits {
    pub user: Pubkey,  // The user's public key
    pub credits: u64,  // Their credit balance
}