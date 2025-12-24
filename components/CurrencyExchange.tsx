"use client";

import { useState, useEffect } from "react";

interface ExchangeRates {
  [key: string]: number;
}

const CURRENCIES = [
  { code: "KES", flag: "🇰🇪", name: "Kenyan Shilling" },
  { code: "USD", flag: "🇺🇸", name: "US Dollar" },
  { code: "EUR", flag: "🇪🇺", name: "Euro" },
  { code: "GBP", flag: "🇬🇧", name: "British Pound" },
  { code: "JPY", flag: "🇯🇵", name: "Japanese Yen" },
  { code: "AUD", flag: "🇦🇺", name: "Australian Dollar" },
  { code: "CAD", flag: "🇨🇦", name: "Canadian Dollar" },
  { code: "CHF", flag: "🇨🇭", name: "Swiss Franc" },
  { code: "CNY", flag: "🇨🇳", name: "Chinese Yuan" },
  { code: "ZAR", flag: "🇿🇦", name: "South African Rand" },
  { code: "UGX", flag: "🇺🇬", name: "Ugandan Shilling" },
  { code: "TZS", flag: "🇹🇿", name: "Tanzanian Shilling" },
];

export default function CurrencyExchange() {
  const [baseCurrency, setBaseCurrency] = useState("KES");
  const [foreignCurrency, setForeignCurrency] = useState("USD");
  const [foreignAmount, setForeignAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("0");
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(true);

  const getFlag = (code: string) => {
    return CURRENCIES.find((c) => c.code === code)?.flag || "";
  };

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        const data = await res.json();
        setRates(data.rates);
      } catch {
        // Fallback rates for KES base
        if (baseCurrency === "KES") {
          setRates({
            USD: 0.0077,
            EUR: 0.0071,
            GBP: 0.0061,
            JPY: 1.19,
            AUD: 0.012,
            CAD: 0.011,
            CHF: 0.0069,
            CNY: 0.056,
            ZAR: 0.14,
            UGX: 28.5,
            TZS: 19.8,
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, [baseCurrency]);

  useEffect(() => {
    if (foreignAmount && rates[foreignCurrency]) {
      const rate = rates[foreignCurrency];
      const amount = parseFloat(foreignAmount);
      if (!isNaN(amount)) {
        // Convert foreign currency to base currency
        const result = amount / rate;
        setConvertedAmount(result.toFixed(2));
      }
    } else {
      setConvertedAmount("0");
    }
  }, [foreignAmount, foreignCurrency, rates]);

  return (
    <div className="w-full bg-white rounded shadow-sm border border-gray-100 p-1.5">
      <h3 className="text-[10px] font-semibold mb-1 text-gray-700">
        💱 Currency Exchange
      </h3>

      {loading ? (
        <div className="text-center py-1 text-[9px] text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-1.5">
          {/* Converter Card */}
          <div className="bg-gray-900 rounded p-2 text-white">
            {/* Base Currency Selector */}
            <div className="mb-1">
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="w-full px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-[9px] text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <div className="text-xs font-bold">{baseCurrency} {getFlag(baseCurrency)}</div>
              <div className="text-xl font-bold">{convertedAmount}</div>
            </div>

            {/* Foreign Currency Dropdown */}
            <div className="mb-1">
              <select
                value={foreignCurrency}
                onChange={(e) => setForeignCurrency(e.target.value)}
                className="w-full px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-[9px] text-white focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                {CURRENCIES.filter((c) => c.code !== baseCurrency).map(
                  (currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Foreign Amount Input */}
            <input
              type="number"
              value={foreignAmount}
              onChange={(e) => setForeignAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-1.5 py-1 bg-white text-gray-900 text-[10px] rounded focus:outline-none focus:ring-1 focus:ring-green-500"
            />

            {/* Conversion Display */}
            <div className="mt-1 text-green-400 text-[9px] font-medium text-center">
              {foreignAmount
                ? `${foreignAmount} ${foreignCurrency} ${getFlag(foreignCurrency)} = ${convertedAmount} ${baseCurrency} ${getFlag(baseCurrency)}`
                : "Enter amount to convert"}
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="text-[9px] text-gray-500 text-center">
            1 {foreignCurrency} {getFlag(foreignCurrency)} = {rates[foreignCurrency] ? (1 / rates[foreignCurrency]).toFixed(2) : "N/A"}{" "}
            {baseCurrency} {getFlag(baseCurrency)}
          </div>
        </div>
      )}
    </div>
  );
}
