/** @format */

// types/swap.ts
export interface Token {
	address: string;
	symbol: string;
	name: string;
	decimals: number;
	logoURI?: string;
	balance?: string;
}

export interface SwapQuote {
	fromToken: Token;
	toToken: Token;
	fromTokenAmount: string;
	toTokenAmount: string;
	estimatedGas: string;
	gasPrice: string;
}

export interface SwapParams {
	fromToken: Token;
	toToken: Token;
	amount: string;
	slippage: number;
	fromAddress: string;
}
