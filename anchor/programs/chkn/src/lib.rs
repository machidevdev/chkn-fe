use anchor_lang::prelude::*;

use crate::instructions::*;
use crate::state::*;

mod errors;
mod instructions;
mod state;
mod events;

declare_id!("H2y6Xj5vhG3qBS9rRgjGCLZ1zv5ERSLZvU9dyDvCL2jH");

#[program]
pub mod chkn {
    use super::*;

    pub fn process_payment(ctx: Context<ProcessPayment>, amount: u64) -> Result<()> {
        instructions::process_payment::process_payment(ctx, amount)
    }

    pub fn initializing_settings(ctx: Context<InitializingSettings>) -> Result<()> {
        instructions::initializing_settings::initializing_settings(ctx)
    }

    pub fn update_settings(ctx: Context<UpdateSettings>, new_settings: Settings) -> Result<()> {
        instructions::update_settings::update_settings(ctx, new_settings)
    }
}
