using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using stocks.Data;
using stocks.Models;
using stocks.Services;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
//using stocks.SPA.Server.Extensions;
using stocks.Server.Services.Abstract;
using serverServices=stocks.Server.Services;
using serverFilters=stocks.Server.Filters;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Net;
using stocks.Server.Filters;

namespace stocks
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();

            if (env.IsDevelopment())
            {
                // For more details on using the user secret store see https://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets<Startup>();
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();

        }

        public static IConfigurationRoot Configuration { get; set; }

        //// This method gets called by the runtime. Use this method to add services to the container.
        //public void ConfigureServicesSPA(IServiceCollection services)
        //{
        //    services.AddDbContext<ApplicationDbContext>(options =>
        //    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

        //    //services.AddCustomIdentity();

        //    // Add framework services.
        //    services.AddMvc();

        //    // Add application services.
        //    //services.AddTransient<IEmailSender, AuthMessageSender>();
        //    //services.AddTransient<ISmsSender, AuthMessageSender>();

        //    // New instance every time, only configuration class needs so its ok
        //    //services.Configure<SmsSettings>(options => Startup.Configuration.GetSection("SmsSettingsTwillio").Bind(options));
        //    services.AddTransient<serverServices.UserResolverService>();
        //    services.AddTransient<serverServices.Abstract.IEmailSender, serverServices.EmailSender>();
        //    services.AddTransient<serverServices.Abstract.ISmsSender, serverServices.SmsSender>();
        //    services.AddScoped<serverFilters.ApiExceptionFilter>();
        //    services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");

        //    services.AddNodeServices();
        //}

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddDbContext<TradeHistory>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<TradeHistory>()
                .AddDefaultTokenProviders();

            //services.AddMvc(options =>
            //{
            //    options.SslPort = 44321;
            //    options.Filters.Add(new Microsoft.AspNetCore.Mvc.RequireHttpsAttribute());
            //});

            services.AddMvc();

            // Add application services.
            services.AddTransient<Services.IEmailSender, AuthMessageSender>();
            services.AddTransient<Services.ISmsSender, AuthMessageSender>();
            services.AddScoped<ApiExceptionFilter>();

            services.Configure<IdentityOptions>(options =>
            {
                // Password settings
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = false;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 10;

                // Cookie settings
                options.Cookies.ApplicationCookie.ExpireTimeSpan = TimeSpan.FromDays(150);
                options.Cookies.ApplicationCookie.LoginPath = "/api/Account/Login";
                options.Cookies.ApplicationCookie.LogoutPath = "/api/Account/LogOff";

                options.Cookies.ApplicationCookie.AutomaticAuthenticate = true;
                options.Cookies.ApplicationCookie.AutomaticChallenge = true;


                // User settings
                options.User.RequireUniqueEmail = true;
            });
        }

        //// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        //public void ConfigureSPA(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        //{
        //    loggerFactory.AddConsole(Configuration.GetSection("Logging"));
        //    loggerFactory.AddDebug();

        //    if (env.IsDevelopment())
        //    {
        //        app.UseDeveloperExceptionPage();
        //        app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions {
        //            HotModuleReplacement = true
        //        });
        //    }
        //    else
        //    {
        //        app.UseExceptionHandler("/Home/Error");
        //    }

        //    app.UseXsrf();

        //    app.UseStaticFiles();

        //    app.UseIdentity();

        //    // Add external authentication middleware below. To configure them please see https://go.microsoft.com/fwlink/?LinkID=532715
        //    app.UseMicrosoftAccountAuthentication(new MicrosoftAccountOptions()
        //    {
        //        ClientId = Configuration["Authentication:Microsoft:ClientId"],
        //        ClientSecret = Configuration["Authentication:Microsoft:ClientSecret"]
        //    });

        //    app.UseMvc(routes =>
        //    {
        //        //routes.MapRoute(
        //        //    name: "default",
        //        //    template: "{controller=Home}/{action=Index}/{id?}");

        //        routes.MapSpaFallbackRoute(
        //            name: "spa-fallback",
        //            defaults: new { controller = "Home", action = "Index" });
        //    });
        //}

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
                app.UseBrowserLink();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseIdentity();

            // Add external authentication middleware below. To configure them please see https://go.microsoft.com/fwlink/?LinkID=532715
            app.UseMicrosoftAccountAuthentication(new MicrosoftAccountOptions()
            {
                ClientId = Configuration["Authentication:Microsoft:ClientId"],
                ClientSecret = Configuration["Authentication:Microsoft:ClientSecret"]
            });

            app.UseMvc(routes =>
            {
                //routes.MapRoute(
                //    name: "Quote",
                //    template: "Quote/Quote/{ticker}",
                //    defaults: new { controller = "Quote", action = "Quote" },
                //    constraints: new { ticker = @"[a-zA-Z]{3}" });

                //routes.MapRoute(
                //    name: "Watchlist",
                //    template: "Quote/Watchlist/{watchlist}/{date?}",
                //    defaults: new { controller = "Quote", action = "Watchlist" });

                //routes.MapRoute(
                //    name: "WatchlistApi",
                //    template: "api/QuoteApi/Watchlist/{watchlist}/{date?}",
                //    defaults: new { controller = "QuoteApi", action = "Watchlist" });
                //routes.MapRoute(
                //    name: "default",
                //    template: "{controller=Home}/{action=Index}/{id?}");

                // http://stackoverflow.com/questions/25982095/using-googleoauth2authenticationoptions-got-a-redirect-uri-mismatch-error
                routes.MapRoute(name: "signin-google", template: "signin-google", defaults: new { controller = "Account", action = "ExternalLoginCallback" });
                routes.MapRoute(
                        name: "default",
                        template: "{controller=Home}/{action=Index}/{externalLoginStatus?}");
                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "IndexSPA" });
            });


        }
    }
}
