#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod chkn {
    use super::*;

  pub fn close(_ctx: Context<CloseChkn>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.chkn.count = ctx.accounts.chkn.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.chkn.count = ctx.accounts.chkn.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeChkn>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.chkn.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeChkn<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Chkn::INIT_SPACE,
  payer = payer
  )]
  pub chkn: Account<'info, Chkn>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseChkn<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub chkn: Account<'info, Chkn>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub chkn: Account<'info, Chkn>,
}

#[account]
#[derive(InitSpace)]
pub struct Chkn {
  count: u8,
}
