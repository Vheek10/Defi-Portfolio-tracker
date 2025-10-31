/** @format */

// lib/covalent.ts
export class CovalentClient {
	private apiKey = process.env.COVALENT_API_KEY;
	private baseURL = "https://api.covalenthq.com/v1";

	async getPortfolioValue(address: string) {
		const response = await axios.get(
			`${this.baseURL}/1/address/${address}/portfolio_v2/?key=${this.apiKey}`,
		);
		return response.data;
	}
}
