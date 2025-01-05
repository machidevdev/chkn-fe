use anchor_lang::prelude::*;

use crate::errors::ErrorCode;
use crate::state::Settings;

pub fn update_settings(ctx: Context<UpdateSettings>, new_settings: Settings) -> Result<()> {
    ctx.accounts.settings.owner = new_settings.owner;
    Ok(())
}

#[derive(Accounts)]
pub struct UpdateSettings<'info> {
    #[account(mut)]
    pub settings: Account<'info, Settings>,
    #[account(constraint = settings.owner == owner.key() @ ErrorCode::NotOwner)]
    pub owner: Signer<'info>,
}
