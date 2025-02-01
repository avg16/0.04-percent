export const ORGANISATION_MARKETPLACE_ADDRESS = "0xaB005162e3801A33Be4Ab0B23a7cbf951605AD0E";
export const ORGANISATION_MARKETPLACE_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_claimId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_eligibleTokens",
				"type": "uint256"
			}
		],
		"name": "approveClaim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_carbonToken",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "initialOwner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "claimId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum CarbonMarketplace.ClaimStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "eligibleTokens",
				"type": "uint256"
			}
		],
		"name": "ClaimStatusUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "claimId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			}
		],
		"name": "ClaimSubmitted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "CreditsPurchased",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_claimId",
				"type": "uint256"
			}
		],
		"name": "declineClaim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "orgAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "OrganizationRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_seller",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "purchaseCredits",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_netEmission",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_photoIpfsHash",
				"type": "string"
			}
		],
		"name": "registerOrganization",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "_coordinatesX",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "_coordinatesY",
				"type": "int256"
			},
			{
				"internalType": "uint256",
				"name": "_acres",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_demandedTokens",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_projectDetails",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_projectName",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "_photoIpfsHashes",
				"type": "string[]"
			},
			{
				"internalType": "uint256",
				"name": "startYear",
				"type": "uint256"
			}
		],
		"name": "submitClaim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "carbonToken",
		"outputs": [
			{
				"internalType": "contract CarbonToken",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "claims",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"internalType": "int256",
				"name": "coordinatesX",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "coordinatesY",
				"type": "int256"
			},
			{
				"internalType": "uint256",
				"name": "acres",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "demandedTokens",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "eligibleTokens",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "projectDetails",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "projectName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "startYear",
				"type": "uint256"
			},
			{
				"internalType": "enum CarbonMarketplace.ClaimStatus",
				"name": "status",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_claimId",
				"type": "uint256"
			}
		],
		"name": "getClaim",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "int256",
						"name": "coordinatesX",
						"type": "int256"
					},
					{
						"internalType": "int256",
						"name": "coordinatesY",
						"type": "int256"
					},
					{
						"internalType": "uint256",
						"name": "acres",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "demandedTokens",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "eligibleTokens",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "projectDetails",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "projectName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "string[]",
						"name": "photoIpfsHashes",
						"type": "string[]"
					},
					{
						"internalType": "uint256",
						"name": "startYear",
						"type": "uint256"
					},
					{
						"internalType": "enum CarbonMarketplace.ClaimStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct CarbonMarketplace.Claim",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_org",
				"type": "address"
			}
		],
		"name": "getOrganization",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "netEmission",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "photoIpfsHash",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isRegistered",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "balance",
						"type": "uint256"
					}
				],
				"internalType": "struct CarbonMarketplace.Organization",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "organizations",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "netEmission",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "photoIpfsHash",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]