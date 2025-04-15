use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::state::Settings;
use crate::state::user_credits::UserCredits;
use crate::errors::ErrorCode;


pub fn load_credits(ctx: Context<LoadCredits>, amount: u64) -> Result<()> {
    let settings = &ctx.accounts.settings;
    let user_credits = &mut ctx.accounts.user_credits;
    let user = &ctx.accounts.user;

    // Ensure price_per_credit isn’t zero
    require!(settings.price_per_credit > 0, ErrorCode::PricePerCreditZero);

    // Transfer lamports from user to owner
    let cpi = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.owner.to_account_info(),
        },
    );
    system_program::transfer(cpi, amount)?;

    // Calculate credits (integer division rounds down)
    let credits_to_add = amount / settings.price_per_credit;

    // Initialize or verify UserCredits account
    if user_credits.user == Pubkey::default() {
        user_credits.user = *user.key;  // Set user pubkey if newly created
        user_credits.credits = 0;       // Start with zero credits
    } else {
        require!(user_credits.user == *user.key, ErrorCode::InvalidUser); // Verify ownership
    }

    // Add new credits
    user_credits.credits += credits_to_add;

    Ok(())
}

#[derive(Accounts)]
pub struct LoadCredits<'info> {
    #[account(mut)]
    pub user: Signer<'info>,  // The user paying and signing

    /// CHECK: Receiver must match settings.owner
    #[account(mut, constraint = owner.key() == settings.owner @ ErrorCode::NotOwner)]
    pub owner: AccountInfo<'info>,  // Receives the payment

    #[account(seeds = [b"settings"], bump)]
    pub settings: Account<'info, Settings>,  // For price_per_credit

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 32 + 8,  // Discriminator + Pubkey + u64
        seeds = [b"user_credits", user.key().as_ref()],
        bump
    )]
    pub user_credits: Account<'info, UserCredits>,  // User’s credit account

    pub system_program: Program<'info, System>,  // For transfers and account init
}