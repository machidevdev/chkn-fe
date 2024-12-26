use anchor_lang::prelude::*;

use crate::state::Settings;

const LAMPORTS_PER_SOL: u64 = 1_000_000_000;

pub fn initializing_settings(ctx: Context<InitializingSettings>) -> Result<()> {
    let settings = &mut ctx.accounts.settings;

    settings.owner = ctx.accounts.payer.key();
    settings.price_individual_monthly = 1 * LAMPORTS_PER_SOL / 100;
    settings.price_individual_yearly = 10 * LAMPORTS_PER_SOL / 100;
    settings.price_group_monthly = 5 * LAMPORTS_PER_SOL / 100;
    settings.price_group_yearly = 40 * LAMPORTS_PER_SOL / 100;

    Ok(())
}

#[derive(Accounts)]
pub struct InitializingSettings<'info> {
    #[account(init, payer = payer, seeds = [b"settings"], bump, space = Settings::LEN)]
    pub settings: Account<'info, Settings>,

    #[account(mut)]
    payer: Signer<'info>,

    system_program: Program<'info, System>,
}
