use anchor_lang::prelude::*;


pub fn process_payment(ctx: Context<ProcessPayment>, amount: u64) -> Result<()> {
    ctx.accounts.pda.sub_lamports(amount)?;
    ctx.accounts.signer.add_lamports(amount)?;
    Ok(())
}

#[derive(Accounts)]
pub struct ProcessPayment<'info> {
  #[account(mut)]
  pub signer: Signer<'info>,

  #[account(mut)]
  pub pda: Account<'info, Pda>,
}

#[account]
pub struct Pda {
}
