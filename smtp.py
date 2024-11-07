import smtplib
from email.message import EmailMessage

def send_email(recipient_email):
    try:
        # Email configuration
        sender_email = 'dreamteambd0@gmail.com'
        
        # Prompt for password securely
        password = 'kolvlxbnqzgaenic' 
        
        # Create the email message
        mensaje = EmailMessage()
        mensaje['Subject'] = 'Prueba de correo desde Python'
        mensaje['From'] = sender_email
        mensaje['To'] = recipient_email
        
        # Set the email body
        mensaje.set_content('¡Hola desde Python!')
        
        
        # Connect to Gmail's SMTP server
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            # Authenticate
            smtp.login(sender_email, password)
            
            # Send the email
            smtp.send_message(mensaje)
            print("Email sent successfully!")
    
    except smtplib.SMTPAuthenticationError:
        print("Authentication failed. Check your email and app password.")
    except smtplib.SMTPException as e:
        print(f"SMTP error occurred: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    send_email()