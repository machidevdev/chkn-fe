use anchor_lang::prelude::*;

use crate::errors::ErrorCode;
use crate::state::Settings;

pub fn update_settings(ctx: Context<UpdateSettings>, new_settings: Settings) -> Result<()> {
    let settings = &mut ctx.accounts.settings;
    msg!("Updating settings");
    // Update owner if different
    if new_settings.owner != settings.owner {
        settings.owner = new_settings.owner;
    }

    // Update prices if different
    if new_settings.price_individual_monthly != settings.price_individual_monthly {
        settings.price_individual_monthly = new_settings.price_individual_monthly;
    }

    if new_settings.price_individual_yearly != settings.price_individual_yearly {
        settings.price_individual_yearly = new_settings.price_individual_yearly;
    }

    if new_settings.price_group_monthly != settings.price_group_monthly {
        settings.price_group_monthly = new_settings.price_group_monthly;
    }

    if new_settings.price_group_yearly != settings.price_group_yearly {
        settings.price_group_yearly = new_settings.price_group_yearly;
    }

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateSettings<'info> {
    #[account(mut)]
    pub settings: Account<'info, Settings>,
    #[account(constraint = settings.owner == owner.key() @ ErrorCode::NotOwner)]
    pub owner: Signer<'info>,
}
