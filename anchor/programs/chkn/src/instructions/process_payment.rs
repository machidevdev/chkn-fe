use anchor_lang::prelude::*;
use anchor_lang::system_program;

use crate::{errors::ErrorCode, events::PaymentEvent, state::Settings};

pub fn process_payment(ctx: Context<ProcessPayment>, amount: u64) -> Result<()> {
    // Check if the payer has enough balance
    let payer_balance = ctx.accounts.payer.lamports();
    require!(payer_balance >= amount, ErrorCode::InsufficientFunds);

    // Validate payment amount
    require!(
        amount == ctx.accounts.settings.price_individual_monthly
            || amount == ctx.accounts.settings.price_individual_yearly
            || amount == ctx.accounts.settings.price_group_monthly
            || amount == ctx.accounts.settings.price_group_yearly,
        ErrorCode::InvalidAmount
    );

    require!(
        ctx.accounts.receiver.key() == ctx.accounts.settings.owner,
        ErrorCode::NotOwner
    );

    // Transfer the amount from the payer to the owner
    let cpi = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.payer.to_account_info(),
            to: ctx.accounts.receiver.to_account_info(),
        },
    );

    system_program::transfer(cpi, amount)?;

    msg!("Amount: {}", amount);
    msg!("Payer: {}", ctx.accounts.payer.key());
    msg!("Receiver: {}", ctx.accounts.receiver.key());

    emit!(PaymentEvent {
        amount,
        payer: ctx.accounts.payer.key(),
        receiver: ctx.accounts.receiver.key(),
    });

    Ok(())
}

#[derive(Accounts)]
pub struct ProcessPayment<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    /// CHECK: This is the receiver account. will always be the owner
    #[account(mut, constraint = receiver.key() == settings.owner @ ErrorCode::NotOwner)]
    receiver: AccountInfo<'info>,

    #[account(seeds = [b"settings"], bump)]
    settings: Account<'info, Settings>,

    system_program: Program<'info, System>,
}
