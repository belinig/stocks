using stocks.Server.Services.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace stocks.SPA.Services
{
    // This class is used by the application to send Email and SMS
    // when you turn on two-factor authentication in ASP.NET Identity.
    // For more details see this link https://go.microsoft.com/fwlink/?LinkID=532713
    public class AuthMessageSender : IEmailSender, ISmsSender
    {
        //public Task SendEmailAsync(string email, string subject, string message)
        //{
        //    // Plug in your email service here to send an email.
        //    return Task.FromResult(0);
        //}

        //public Task SendSmsAsync(string number, string message)
        //{
        //    // Plug in your SMS service here to send a text message.
        //    return Task.FromResult(0);
        //}
        public bool SendEmail(EmailModel emailModel)
        {
            return true;
        }

        public Task<bool> SendEmailAsync(MailType type, EmailModel emailModel, string extraData)
        {
            return Task.FromResult(true);
        }

        public Task<bool> SendSmsFastSmsAsync(string number, string message)
        {
            return Task.FromResult(true);
        }

        public Task<bool> SendSmsTwillioAsync(string number, string message)
        {
            return Task.FromResult(true);
        }
    }
}
