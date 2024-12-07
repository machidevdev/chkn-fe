#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

declare_id!("H2y6Xj5vhG3qBS9rRgjGCLZ1zv5ERSLZvU9dyDvCL2jH");

#[program]
pub mod chkn {
    use super::*;

    const INDIVIDUAL_MONTHLY_PRICE: u64 = 1 * LAMPORTS_PER_SOL;
    const INDIVIDUAL_YEARLY_PRICE: u64 = 10 * LAMPORTS_PER_SOL;
    const GROUP_MONTHLY_PRICE: u64 = 5 * LAMPORTS_PER_SOL;
    const GROUP_YEARLY_PRICE: u64 = 40 * LAMPORTS_PER_SOL;
    const OWNER: Pubkey = pubkey!("88Va6RQojZNHx8VpurUz1tL6Ccaf5VpKZffATLFWRJBp");




    pub fn process_payment(
        ctx: Context<ProcessPayment>,
        amount: u64,
    ) -> Result<()> {
        //check if the payer has enough balance
        let payer_balance = ctx.accounts.payer.lamports();
        require!(payer_balance >= amount, ErrorCode::InsufficientFunds);



        // Validate payment amount
        require!(
            amount == INDIVIDUAL_MONTHLY_PRICE ||
            amount == INDIVIDUAL_YEARLY_PRICE ||
            amount == GROUP_MONTHLY_PRICE ||
            amount == GROUP_YEARLY_PRICE,
            ErrorCode::InvalidAmount
        );

        require!(
            ctx.accounts.receiver.key() == OWNER,
            ErrorCode::NotOwner
        );

        //transfer the amount from the payer to the owner
        let cpi = CpiContext::new(ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.payer.to_account_info(),
                to: ctx.accounts.receiver.to_account_info()
            }
        );

        system_program::transfer(cpi, amount)?;
        emit!(PaymentEvent {
            amount,
            payer: ctx.accounts.payer.key(),
            receiver: ctx.accounts.receiver.key(),
        });
        Ok(())
    }


 
}

#[derive(Accounts)]
pub struct ProcessPayment<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    /// CHECK: This is the receiver account. will always be the owner
    #[account(mut)]
    receiver: AccountInfo<'info>,

    system_program: Program<'info, System>,
}


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

#[event]
pub struct PaymentEvent {
    amount: u64,
    payer: Pubkey,
    receiver: Pubkey,
}