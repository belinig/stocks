using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using stocks.Models;

namespace stocks.Data
{
    public class TradeHistoryDBContext : DbContext
    {
        public DbSet<TradeHistoryItem> TradeHistory { get; set; }

        public TradeHistoryDBContext(DbContextOptions<TradeHistoryDBContext> options) : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }
    }
}
