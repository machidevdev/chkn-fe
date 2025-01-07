use anchor_lang::{ prelude::*};
use crate::{settings::Settings, state::TelegramPda};

pub fn process_payment(ctx: Context<ProcessPayment>, amount: u64) -> Result<()> {
    ctx.accounts.pda.sub_lamports(amount)?;
    ctx.accounts.signer.add_lamports(amount)?;
    msg!("Processed payment of {:?} lamports", amount);
    Ok(())
}

#[derive(Accounts)]
pub struct ProcessPayment<'info> {
  #[account(mut)]
  pub settings: Account<'info, Settings>,
  #[account(mut, constraint = signer.key() == settings.owner)]
  pub signer: Signer<'info>,

  #[account(mut)]
  pub pda: Account<'info, TelegramPda>,
}

