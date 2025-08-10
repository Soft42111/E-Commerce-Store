import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# This is a mock email service - replace with SendGrid when you have the API key
class MockEmailService:
    def __init__(self):
        self.sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
        self.sender_email = os.getenv('SENDER_EMAIL', 'noreply@luxuryline.com')
    
    async def send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """Mock email sending - logs email instead of sending"""
        try:
            # In development, just log the email
            print(f"\n{'='*50}")
            print(f"📧 MOCK EMAIL SERVICE")
            print(f"{'='*50}")
            print(f"To: {to_email}")
            print(f"From: {self.sender_email}")
            print(f"Subject: {subject}")
            print(f"Content:")
            print(html_content)
            print(f"{'='*50}\n")
            
            # TODO: Replace with actual SendGrid implementation
            # from sendgrid import SendGridAPIClient
            # from sendgrid.helpers.mail import Mail
            # 
            # message = Mail(
            #     from_email=self.sender_email,
            #     to_emails=to_email,
            #     subject=subject,
            #     html_content=html_content
            # )
            # sg = SendGridAPIClient(self.sendgrid_api_key)
            # response = sg.send(message)
            # return response.status_code == 202
            
            return True
            
        except Exception as e:
            logger.error(f"Error sending email: {e}")
            return False

# Create service instance
email_service = MockEmailService()

async def send_verification_email(email: str, verification_code: str) -> bool:
    """Send email verification code"""
    subject = "Verify Your LuxuryLine Account"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Verify Your Account</title>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; }}
            .header {{ background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 40px 20px; text-align: center; }}
            .logo {{ color: #FFD700; font-size: 32px; font-weight: bold; margin: 0; }}
            .tagline {{ color: #cccccc; font-size: 14px; margin: 5px 0 0 0; }}
            .content {{ padding: 40px 20px; }}
            .title {{ color: #333333; font-size: 24px; font-weight: bold; margin: 0 0 20px 0; text-align: center; }}
            .message {{ color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0; }}
            .code-container {{ background-color: #f8f9fa; border: 2px dashed #FFD700; border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0; }}
            .verification-code {{ font-size: 36px; font-weight: bold; color: #000000; letter-spacing: 8px; margin: 0; }}
            .code-label {{ color: #666666; font-size: 14px; margin: 10px 0 0 0; }}
            .footer {{ background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #eeeeee; }}
            .footer-text {{ color: #999999; font-size: 14px; margin: 0; }}
            .button {{ display: inline-block; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000000; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: bold; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="logo">LUXURYLINE</h1>
                <p class="tagline">Where Elegance Meets Function</p>
            </div>
            
            <div class="content">
                <h2 class="title">Welcome to LuxuryLine!</h2>
                
                <p class="message">
                    Thank you for creating your account with us. To complete your registration and start shopping our luxury collection, please verify your email address using the code below:
                </p>
                
                <div class="code-container">
                    <p class="verification-code">{verification_code}</p>
                    <p class="code-label">Enter this 6-digit code to verify your account</p>
                </div>
                
                <p class="message">
                    This verification code will expire in 24 hours. If you didn't create this account, please ignore this email.
                </p>
                
                <p class="message">
                    Once verified, you'll have access to:
                    <br>• Exclusive luxury sneakers and crockery
                    <br>• Personalized recommendations
                    <br>• Special member pricing
                    <br>• Priority customer support
                </p>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    LuxuryLine | Premium E-commerce Experience<br>
                    This email was sent to {email}
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return await email_service.send_email(email, subject, html_content)

async def send_order_confirmation_email(email: str, order_id: str, total: float) -> bool:
    """Send order confirmation email"""
    subject = f"Order Confirmation #{order_id} - LuxuryLine"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; }}
            .header {{ background: linear-gradient(135deg, #000000 0%, #333333 100%); padding: 40px 20px; text-align: center; }}
            .logo {{ color: #FFD700; font-size: 32px; font-weight: bold; margin: 0; }}
            .content {{ padding: 40px 20px; }}
            .order-number {{ background-color: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }}
            .total {{ font-size: 24px; font-weight: bold; color: #000000; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="logo">LUXURYLINE</h1>
            </div>
            <div class="content">
                <h2>Thank you for your order!</h2>
                <div class="order-number">
                    <p><strong>Order #{order_id}</strong></p>
                    <p class="total">Total: ${total:.2f}</p>
                </div>
                <p>We'll send you shipping updates as your order progresses.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return await email_service.send_email(email, subject, html_content)