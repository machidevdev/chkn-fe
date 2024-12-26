use anchor_lang::prelude::*;

#[event]
pub struct PaymentEvent {
    pub amount: u64,
    pub payer: Pubkey,
    pub receiver: Pubkey,
}
