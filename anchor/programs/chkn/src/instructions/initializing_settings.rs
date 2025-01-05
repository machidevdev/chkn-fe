use anchor_lang::prelude::*;

use crate::state::Settings;


pub fn initializing_settings(ctx: Context<InitializingSettings>) -> Result<()> {
    let settings = &mut ctx.accounts.settings;
    settings.owner = ctx.accounts.payer.key();
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
