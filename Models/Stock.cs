using System;

namespace stocks.Models
{
    public class Stock
    {
        public string Symbol { get; set; }
        public string ExchangeAbbr { get; set; }

        public new string ToString()
        {
            return string.Concat(Symbol, ".", ExchangeAbbr);
        }
    }
}