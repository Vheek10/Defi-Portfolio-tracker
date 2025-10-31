/** @format */

// hooks/useLivePrices.ts
export function useLivePrices(tokenAddresses: string[]) {
	const [prices, setPrices] = useState({});

	useEffect(() => {
		const ws = new WebSocket("wss://ws.coingecko.com/prices");

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			setPrices((prev) => ({ ...prev, [data.symbol]: data.price }));
		};

		return () => ws.close();
	}, [tokenAddresses]);
}
