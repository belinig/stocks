using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Net.Http.Server;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Server.WebListener;


namespace stocks
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //var config = new ConfigurationBuilder()
            //            .AddCommandLine(args)
            //            .Build();

            var host = new WebHostBuilder()
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>()
                //.UseWebListener(options => options.ListenerSettings.Authentication.Schemes = AuthenticationSchemes.NTLM)
                .Build();

            host.Run();
        }
    }
}
