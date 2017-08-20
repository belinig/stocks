using System;
using Microsoft.EntityFrameworkCore;
using ef=Microsoft.EntityFrameworkCore;



namespace stocks.Models
{
    public class TradeHistoryItem : Stock
    {
        public DateTime Date { get; set; }
        public decimal Open { get; set; }
        public decimal High { get; set; }
        public decimal Low { get; set; }
        public decimal Close { get; set; }
        public UInt64 Volume { get; set; }
    }
}
