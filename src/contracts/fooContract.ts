export const fooContractAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_foo",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "foo",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_foo",
        type: "uint256",
      },
    ],
    name: "setFoo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
