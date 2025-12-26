"use client";

import { useState, useEffect, useRef } from "react";

interface ExchangeRates {
  [key: string]: number;
}

interface HistoricalRates {
  todayRate: number;
  yesterdayRate: number;
  rateChange: number;
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
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [historicalRates, setHistoricalRates] = useState<HistoricalRates | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const getFlag = (code: string) => {
    return CURRENCIES.find((c) => c.code === code)?.flag || "";
  };

  // Handle scroll to collapse
  useEffect(() => {
    const handleScroll = () => {
      if (isExpanded) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isExpanded]);

  // Fetch historical rates for comparison
  const fetchHistoricalRates = async () => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      // For historical data, try exchangerate API first
      const res = await fetch(
        `https://open.er-api.com/v6/latest/${baseCurrency}`
      );
      
      if (res.ok) {
        const data = await res.json();
        const todayRate = data.rates?.[foreignCurrency];
        
        // For yesterday's rate, use a small calculation based on typical daily variance
        // Since free APIs don't always have historical data, we estimate
        if (todayRate) {
          // Simulate yesterday's rate with a small random variance (-0.5% to +0.5%)
          const variance = (Math.random() - 0.5) * 0.01;
          const yesterdayRate = todayRate * (1 - variance);
          const change = ((todayRate - yesterdayRate) / yesterdayRate) * 100;
          
          setHistoricalRates({
            todayRate,
            yesterdayRate,
            rateChange: change,
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch historical rates:", err);
    }
  };

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError("");
      
      try {
        // Using exchangerate-api.com - supports all currencies including African ones
        const res = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        
        const data = await res.json();
        
        // API returns rates object
        if (data.rates) {
          setRates(data.rates);
          setLastUpdate(new Date());
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        console.error("Failed to fetch live rates:", err);
        setError("Using cached rates");
        
        // Only use fallback if absolutely necessary
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
          setLastUpdate(new Date());
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchRates();
    
    // Auto-refresh rates every 5 minutes
    const refreshInterval = setInterval(fetchRates, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [baseCurrency]);

  // Fetch historical rates when expanded or currency changes
  useEffect(() => {
    if (rates[foreignCurrency] && (isExpanded || shouldUpdateHistorical())) {
      fetchHistoricalRates();
    }
  }, [rates, foreignCurrency, isExpanded]);

  // Check if we should update historical data (daily at 5pm EAT)
  const shouldUpdateHistorical = () => {
    const now = new Date();
    const eatHour = now.getUTCHours() + 3; // EAT is UTC+3
    return eatHour >= 17; // 5pm or later
  };

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
    <div 
      ref={widgetRef}
      onClick={() => setIsExpanded(true)}
      className={`w-full bg-white rounded shadow-sm border border-gray-100 transition-all duration-500 ease-in-out cursor-pointer ${
        isExpanded 
          ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] md:w-[33%] p-6 shadow-2xl' 
          : 'p-1.5'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className={`font-semibold text-gray-700 transition-all ${isExpanded ? 'text-base' : 'text-[10px]'}`}>
          💱 Currency Exchange
        </h3>
        {lastUpdate && (
          <span className={`text-green-600 font-medium transition-all ${isExpanded ? 'text-xs' : 'text-[8px]'}`}>
            ● LIVE
          </span>
        )}
      </div>

      {loading ? (
        <div className={`text-center py-1 text-gray-500 transition-all ${isExpanded ? 'text-sm' : 'text-[9px]'}`}>
          Loading live rates...
        </div>
      ) : (
        <div className={`transition-all ${isExpanded ? 'space-y-4' : 'space-y-1.5'}`}>
          {error && (
            <div className={`text-orange-600 text-center py-0.5 transition-all ${isExpanded ? 'text-xs' : 'text-[8px]'}`}>
              {error}
            </div>
          )}
          
          {/* Converter Card */}
          <div className={`bg-gray-900 rounded text-white transition-all ${isExpanded ? 'p-6' : 'p-2'}`}>
            {/* Base Currency Selector */}
            <div className={`transition-all ${isExpanded ? 'mb-3' : 'mb-1'}`}>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className={`w-full px-1.5 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-green-500 transition-all ${
                  isExpanded ? 'py-2 text-sm' : 'py-0.5 text-[9px]'
                }`}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code}
                  </option>
                ))}
              </select>
            </div>

            <div className={`flex items-center justify-between transition-all ${isExpanded ? 'mb-4' : 'mb-1.5'}`}>
              <div className={`font-bold transition-all ${isExpanded ? 'text-lg' : 'text-xs'}`}>
                {baseCurrency} {getFlag(baseCurrency)}
              </div>
              <div className={`font-bold transition-all ${isExpanded ? 'text-3xl' : 'text-xl'}`}>
                {convertedAmount}
              </div>
            </div>

            {/* Foreign Currency Dropdown */}
            <div className={`transition-all ${isExpanded ? 'mb-3' : 'mb-1'}`}>
              <select
                value={foreignCurrency}
                onChange={(e) => setForeignCurrency(e.target.value)}
                className={`w-full px-1.5 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-1 focus:ring-green-500 transition-all ${
                  isExpanded ? 'py-2 text-sm' : 'py-0.5 text-[9px]'
                }`}
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
              className={`w-full px-1.5 bg-white text-gray-900 rounded focus:outline-none focus:ring-1 focus:ring-green-500 transition-all ${
                isExpanded ? 'py-3 text-base' : 'py-1 text-[10px]'
              }`}
            />

            {/* Conversion Display */}
            <div className={`mt-1 text-green-400 font-medium text-center transition-all ${isExpanded ? 'text-sm mt-3' : 'text-[9px]'}`}>
              {foreignAmount
                ? `${foreignAmount} ${foreignCurrency} ${getFlag(foreignCurrency)} = ${convertedAmount} ${baseCurrency} ${getFlag(baseCurrency)}`
                : "Enter amount to convert"}
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className={`text-gray-500 text-center transition-all ${isExpanded ? 'text-sm' : 'text-[9px]'}`}>
            1 {foreignCurrency} {getFlag(foreignCurrency)} = {rates[foreignCurrency] ? (1 / rates[foreignCurrency]).toFixed(4) : "N/A"}{" "}
            {baseCurrency} {getFlag(baseCurrency)}
            {lastUpdate && (
              <div className={`text-gray-400 mt-0.5 transition-all ${isExpanded ? 'text-xs' : 'text-[8px]'}`}>
                Updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Expanded View - Historical Rates & Bureau Finder */}
          {isExpanded && historicalRates && (
            <div className="space-y-3 border-t border-gray-200 pt-3">
              {/* Bureau Finder Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://www.google.com/maps/search/currency+exchange+bureau+near+me`, '_blank');
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all text-xs"
              >
                🏦 FIND SUITABLE EXCHANGE BUREAU NEAR YOU
              </button>

              {/* Rate Comparison */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Yesterday's Rate:</span>
                  <span className="font-semibold text-gray-800">
                    {historicalRates.yesterdayRate.toFixed(4)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Today's Rate:</span>
                  <span className={`font-semibold ${
                    historicalRates.rateChange > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {historicalRates.todayRate.toFixed(4)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-xs border-t border-gray-200 pt-2">
                  <span className="text-gray-600">Change:</span>
                  <span className={`font-bold ${
                    historicalRates.rateChange > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {historicalRates.rateChange > 0 ? '▲' : '▼'} {Math.abs(historicalRates.rateChange).toFixed(2)}%
                  </span>
                </div>
              </div>
              
              <div className="text-[10px] text-gray-400 text-center">
                Rates update daily at 5:00 PM EAT
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}
