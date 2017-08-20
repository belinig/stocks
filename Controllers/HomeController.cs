// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using stocks.Models;
using Newtonsoft.Json;
using njson=Newtonsoft.Json;
using System.Collections.Generic;

namespace stocks.Controllers
{
    public class HomeController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHostingEnvironment _env;

        public HomeController(UserManager<ApplicationUser> userManager, IHostingEnvironment env)
        {
            _userManager = userManager;
            _env = env;
        }

        public async Task<IActionResult> IndexSPA()
        {
            ViewBag.MainDotJs = await GetMainDotJs();

            if (Request.Query.ContainsKey("emailConfirmCode") &&
                Request.Query.ContainsKey("userId"))
            {
                var userId = Request.Query["userId"].ToString();
                var code = Request.Query["emailConfirmCode"].ToString();
                code = code.Replace(" ", "+");

                var applicationUser = await _userManager.FindByIdAsync(userId);
                if (applicationUser != null && !applicationUser.EmailConfirmed)
                {
                    var valid = await _userManager.ConfirmEmailAsync(applicationUser, code);
                    if (valid.Succeeded)
                    {
                        ViewBag.emailConfirmed = true;
                    }
                }
            }

            await BagUser();


            return View("Index");
        }


        public async Task<IActionResult> Index(int? externalLoginStatus)
        {
            //ViewBag.MainDotJs = await GetMainDotJs();
            await BagUser();
            return View();
        }

        private async Task BagUser ()
        {
            ApplicationUser user = null;
            IList<string> roles = null;
            if (!string.IsNullOrEmpty(User?.Identity?.Name))
            {
                user = await _userManager.FindByNameAsync(User?.Identity?.Name);
                roles = await _userManager.GetRolesAsync(user);
            }
            var userResult = new { User = new { DisplayName = user?.UserName, Roles = roles?.ToList(), Email = user?.Email, Id = user?.Id } };
            string userJson = JsonConvert.SerializeObject(userResult);
            ViewBag.user = userJson;
        }

        // Becasue for production this is hashed chunk so has changes on each production build
        public async Task<string> GetMainDotJs()
        {
            var basePath = _env.WebRootPath + "//dist//";

            if (_env.IsDevelopment() && !System.IO.File.Exists(basePath + "main-client.js"))
            {
                // Just a .js request to make it wait to finish webpack dev middleware finish creating bundles:
                // More info here: https://github.com/aspnet/JavaScriptServices/issues/578#issuecomment-272039541
                using (var client = new HttpClient())
                {
                    var requestUri = Request.Scheme + "://" + Request.Host + "/dist/main-client.js";
                    await client.GetAsync(requestUri);
                }
            }

            var info = new System.IO.DirectoryInfo(basePath);
            var file = info.GetFiles()
                .Where(f => _env.IsDevelopment() ? f.Name == "main-client.js" : f.Name.StartsWith("main-client.") && !f.Name.EndsWith("bundle.map"));
            return file.FirstOrDefault().Name;
        }

    }
}
