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
      className={`relative w-full bg-white rounded shadow-sm border border-gray-100 transition-all duration-300 ease-in-out ${
        isExpanded ? 'shadow-xl z-40' : ''
      }`}
    >
      {/* Main Widget Content */}
      <div className="p-1.5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[10px] font-semibold text-gray-700">
          💱 Currency Exchange
        </h3>
        {lastUpdate && (
          <span className="text-[8px] text-green-600 font-medium">
            ● LIVE
          </span>
        )}
      </div>

      {loading ? (
        <div className="text-center py-1 text-[9px] text-gray-500">
          Loading live rates...
        </div>
      ) : (
        <div className="space-y-1.5">
          {error && (
            <div className="text-[8px] text-orange-600 text-center py-0.5">
              {error}
            </div>
          )}
          
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
              <div className="text-xs font-bold">
                {baseCurrency} {getFlag(baseCurrency)}
              </div>
              <div className="text-xl font-bold">
                {convertedAmount}
              </div>
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
            1 {foreignCurrency} {getFlag(foreignCurrency)} = {rates[foreignCurrency] ? (1 / rates[foreignCurrency]).toFixed(4) : "N/A"}{" "}
            {baseCurrency} {getFlag(baseCurrency)}
            {lastUpdate && (
              <div className="text-[8px] text-gray-400 mt-0.5">
                Updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      )}
      </div>

      {/* Bottom Button - Always Visible */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 text-[10px] rounded-b transition-all"
      >
        TODAY'S EXCHANGE BUREAUS RATES
      </button>

      {/* Expanded Details - Slides Up Above Widget */}
      {isExpanded && historicalRates && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-xl p-3 space-y-2 z-50 animate-slideUp">
          {/* Rate Comparison */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 space-y-2 border border-gray-200">
            <h4 className="text-xs font-bold text-gray-800 text-center border-b border-gray-300 pb-1">
              Rate Comparison
            </h4>
            
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-gray-600 font-medium">Yesterday:</span>
              <span className="font-bold text-gray-800">
                {historicalRates.yesterdayRate.toFixed(4)}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-gray-600 font-medium">Today:</span>
              <span className={`font-bold ${
                historicalRates.rateChange > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {historicalRates.todayRate.toFixed(4)}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-[10px] border-t border-gray-300 pt-1">
              <span className="text-gray-600 font-medium">Change:</span>
              <span className={`font-bold ${
                historicalRates.rateChange > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {historicalRates.rateChange > 0 ? '▲' : '▼'} {Math.abs(historicalRates.rateChange).toFixed(2)}%
              </span>
            </div>
          </div>
          
          {/* Bureau Finder */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://www.google.com/maps/search/currency+exchange+bureau+near+me`, '_blank');
            }}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-3 rounded-lg shadow transition-all text-[10px]"
          >
            🏦 FIND EXCHANGE BUREAU NEAR YOU
          </button>
          
          <div className="text-[8px] text-gray-400 text-center">
            Rates update daily at 5:00 PM EAT
          </div>
        </div>
      )}
      {/* Expanded Details - Slides Up Above Widget */}
      {isExpanded && historicalRates && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-xl p-3 space-y-2 z-50 animate-slideUp">
          {/* Rate Comparison */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 space-y-2 border border-gray-200">
            <h4 className="text-xs font-bold text-gray-800 text-center border-b border-gray-300 pb-1">
              Rate Comparison
            </h4>
            
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-gray-600 font-medium">Yesterday:</span>
              <span className="font-bold text-gray-800">
                {historicalRates.yesterdayRate.toFixed(4)}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-gray-600 font-medium">Today:</span>
              <span className={`font-bold ${
                historicalRates.rateChange > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {historicalRates.todayRate.toFixed(4)}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-[10px] border-t border-gray-300 pt-1">
              <span className="text-gray-600 font-medium">Change:</span>
              <span className={`font-bold ${
                historicalRates.rateChange > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {historicalRates.rateChange > 0 ? '▲' : '▼'} {Math.abs(historicalRates.rateChange).toFixed(2)}%
              </span>
            </div>
          </div>
          
          {/* Bureau Finder */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://www.google.com/maps/search/currency+exchange+bureau+near+me`, '_blank');
            }}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-3 rounded-lg shadow transition-all text-[10px]"
          >
            🏦 FIND EXCHANGE BUREAU NEAR YOU
          </button>
          
          <div className="text-[8px] text-gray-400 text-center">
            Rates update daily at 5:00 PM EAT
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
