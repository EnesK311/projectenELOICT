<?php

namespace Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class MailerService
{
    static function send(string $from, string $to, string $subject, string $text, string $templatePath = null): void
    {
        $mailer = new PHPMailer(true);

        try {
            $smtpDetails = parse_url(MAILER_DSN);


            $mailer->isSMTP();
            $mailer->Host       = $smtpDetails['host'];
            $mailer->SMTPAuth   = true;
            $mailer->Username   = $smtpDetails['user'];
            $mailer->Password   = $smtpDetails['pass'];
            $mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mailer->Port       = $smtpDetails['port'];

            $mailer->setFrom($from);
            $mailer->addAddress($to);

            $mailer->isHTML(true);


            if ($templatePath) {
                $templateContent = file_get_contents($templatePath);
                $templateContent = str_replace('{{ subject }}', $subject, $templateContent);
                $templateContent = str_replace('{{ body }}', $text, $templateContent);
                $mailer->Subject = $subject;
                $mailer->Body = $templateContent;
            } else {
                $mailer->Subject = $subject;
                $mailer->Body = "<h1>$subject</h1><p>$text</p>";
            }

            $mailer->send();
            echo 'Email is verzonden!';
        } catch (Exception $e) {
            echo "Email kon niet verzonden worden, Mailer Error: {$mailer->ErrorInfo}";
        }
    }
}
