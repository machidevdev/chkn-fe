use anchor_lang::prelude::*;

use crate::errors::ErrorCode;
use crate::state::Settings;

pub fn update_settings(ctx: Context<UpdateSettings>, new_settings: Settings) -> Result<()> {
    let settings = &mut ctx.accounts.settings;

    settings.price_individual_monthly = new_settings.price_individual_monthly;
    settings.price_individual_yearly = new_settings.price_individual_yearly;
    settings.price_group_monthly = new_settings.price_group_monthly;
    settings.price_group_yearly = new_settings.price_group_yearly;

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateSettings<'info> {
    #[account(mut, seeds = [b"settings"], bump)]
    settings: Account<'info, Settings>,

    #[account(mut, constraint = payer.key() == settings.owner @ ErrorCode::NotOwner)]
    payer: Signer<'info>,

    system_program: Program<'info, System>,
}
