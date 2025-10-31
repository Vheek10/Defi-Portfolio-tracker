// pages/api/portfolio/[address].ts
export default async function handler(req, res) {
  const { address } = req.query;
  
  // Fetch from multiple sources
  const [balances, prices, transactions] = await Promise.all([
    getWalletBalances(address),
    getTokenPrices(),
    getTransactionHistory(address),
  ]);

  res.json({ balances, prices, transactions });
}