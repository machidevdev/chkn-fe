use anchor_lang::prelude::*;
use crate::state::TelegramPda;

pub fn initialize_pda(ctx: Context<InitializePda>, telegram_id: i64) -> Result<()> {
    msg!("initialize_pda, {:?}", telegram_id);
    let _pda = &mut ctx.accounts.pda;
    Ok(())
}

#[derive(Accounts)]
#[instruction(telegram_id: i64)]
pub struct InitializePda<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = TelegramPda::LEN,
        seeds = [
            telegram_id.to_le_bytes().as_ref(),
        ],
        bump
    )]
    pub pda: Account<'info, TelegramPda>,
    pub system_program: Program<'info, System>,
}

