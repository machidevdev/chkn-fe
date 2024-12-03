/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/chkn.json`.
 */
export type Chkn = {
  "address": "H2y6Xj5vhG3qBS9rRgjGCLZ1zv5ERSLZvU9dyDvCL2jH",
  "metadata": {
    "name": "chkn",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "processPayment",
      "discriminator": [
        189,
        81,
        30,
        198,
        139,
        186,
        115,
        23
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "receiver",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "events": [
    {
      "name": "paymentEvent",
      "discriminator": [
        132,
        136,
        157,
        119,
        91,
        254,
        225,
        20
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "insufficientFunds",
      "msg": "Insufficient funds for transaction"
    },
    {
      "code": 6001,
      "name": "invalidAmount",
      "msg": "Invalid payment amount"
    },
    {
      "code": 6002,
      "name": "transferFailed",
      "msg": "Transfer failed"
    },
    {
      "code": 6003,
      "name": "notOwner",
      "msg": "Not owner"
    }
  ],
  "types": [
    {
      "name": "paymentEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "payer",
            "type": "pubkey"
          },
          {
            "name": "receiver",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
