export const OpenxAINonCirculatingSupplyVestingContract = {
  abi: [
    {
      type: "constructor",
      inputs: [
        { name: "token", type: "address", internalType: "address" },
        { name: "amount", type: "uint128", internalType: "uint128" },
        { name: "duration", type: "uint64", internalType: "uint64" },
        { name: "receiver", type: "address", internalType: "address" },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "amount",
      inputs: [],
      outputs: [{ name: "", type: "uint128", internalType: "uint128" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "beneficiary",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "duration",
      inputs: [],
      outputs: [{ name: "", type: "uint64", internalType: "uint64" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "releasable",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "release",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "released",
      inputs: [],
      outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "start",
      inputs: [],
      outputs: [{ name: "", type: "uint64", internalType: "uint64" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "token",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
      stateMutability: "view",
    },
    {
      type: "event",
      name: "BeneficiaryCreated",
      inputs: [
        {
          name: "beneficiary",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "ERC20Released",
      inputs: [
        {
          name: "beneficiary",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "amount",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "LinearVestingCreated",
      inputs: [
        {
          name: "amount",
          type: "uint128",
          indexed: false,
          internalType: "uint128",
        },
        {
          name: "start",
          type: "uint64",
          indexed: false,
          internalType: "uint64",
        },
        {
          name: "duration",
          type: "uint64",
          indexed: false,
          internalType: "uint64",
        },
      ],
      anonymous: false,
    },
    {
      type: "error",
      name: "AddressEmptyCode",
      inputs: [{ name: "target", type: "address", internalType: "address" }],
    },
    {
      type: "error",
      name: "AddressInsufficientBalance",
      inputs: [{ name: "account", type: "address", internalType: "address" }],
    },
    { type: "error", name: "FailedInnerCall", inputs: [] },
    {
      type: "error",
      name: "SafeERC20FailedOperation",
      inputs: [{ name: "token", type: "address", internalType: "address" }],
    },
    { type: "error", name: "Unimplemented", inputs: [] },
  ],
} as const
