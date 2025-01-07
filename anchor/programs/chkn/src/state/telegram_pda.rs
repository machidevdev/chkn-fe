use anchor_lang::prelude::*;
#[account]
pub struct TelegramPda {
}

impl TelegramPda {
    pub const LEN: usize = 8 + std::mem::size_of::<TelegramPda>();
}
