namespace FacilityConnect.Services
{
    using FacilityConnect.Model;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Identity.UI.Services;
    using SendGrid;
    using SendGrid.Helpers.Mail;
    using System;
    using System.Net.Mail;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;
    using System.Web;

    public class EmailService: IEmailSender
    {


        public async Task SendEmailAsync(string toEmail, string subject, string content)
        {
            var client = new SendGridClient(Environment.GetEnvironmentVariable("SENDGRID_API_KEY"));
            var from = new EmailAddress("brentbauwens1@gmail.com", "NO REPLY");
            var to = new EmailAddress(toEmail);

            string urlPattern = @"<a\s+href='(.*?)'>"; // Pattern to extract URL
            string codePattern = @"code:\s([A-Za-z0-9+/=]+)"; // Pattern to extract code

            Match urlMatch = Regex.Match(content, urlPattern);
            if (urlMatch.Success)
            {
                string extractedUrl = urlMatch.Groups[1].Value;
                string url = HttpUtility.HtmlDecode(extractedUrl);

                var uri = new Uri(url);
                var queryParams = HttpUtility.ParseQueryString(uri.Query);

                string userId = queryParams["userId"];
                string code = queryParams["code"];

                string customVerificationUrl = Environment.GetEnvironmentVariable("EMAIL_URL") + $"/verify-email?userId={userId}&code={code}&email={toEmail}";

                var dynamicTemplateData = new Dictionary<string, object>
                {
                    { "h1", "Bedankt om te registreren" },
                    { "h2", "Verifieer je e-mailadres om volledige toegang te krijgen tot ons platform!" },
                    { "button", "Verifieer e-mailadres" },
                    { "url", customVerificationUrl }
                };

                var msg = MailHelper.CreateSingleTemplateEmail(from, to, "d-9a24770e4c004e60bcf17125d3c902d3", dynamicTemplateData);
                await client.SendEmailAsync(msg);

                Console.WriteLine("Verification email sent with custom URL: " + customVerificationUrl);
                return;
            }


            Match codeMatch = Regex.Match(content, codePattern);
            if (codeMatch.Success)
            {
                string extractedCode = codeMatch.Groups[1].Value;
                string customVerificationUrl = Environment.GetEnvironmentVariable("EMAIL_URL") + $"/forgot-password?code={extractedCode}&email={toEmail}";

                var dynamicTemplateData = new Dictionary<string, object>
                {
                    { "h1", "Reset jouw wachtwoord!" },
                    { "h2", "Wachtwoord vergeten? Reset jouw wachtwoord door te klikken op onderstaande knop!" },
                    { "button", "Reset wachtwoord" },
                    { "url", customVerificationUrl }
                };

                var msg = MailHelper.CreateSingleTemplateEmail(from, to, "d-0ae84a54736948dfa418715780e747a1", dynamicTemplateData);
                await client.SendEmailAsync(msg);

                Console.WriteLine("Password reset email sent with code: " + extractedCode);
                return;
            }

        }

    }

}
