use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient funds for transaction")]
    InsufficientFunds,
    #[msg("Invalid payment amount")]
    InvalidAmount,
    #[msg("Transfer failed")]
    TransferFailed,
    #[msg("Not owner")]
    NotOwner,
}
