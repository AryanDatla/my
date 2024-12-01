from dotenv import load_dotenv
import os
import imaplib
import email
from bs4 import BeautifulSoup
import requests

load_dotenv()

username = os.getenv("EMAIL")
password = os.getenv("PASSWORD")

def connect_to_email():
     mail = imaplib.IMAP4_SSL("imap.gmail.com")
     if username is None or password is None:
          raise ValueError("Username and password must be set in the environment variables.")
     mail.login(username, password)
     mail.select("inbox")
     return mail

def extract_links_from_html(html_content):
     soup = BeautifulSoup(html_content, "html.parser")
     links = [link["href"] for link in soup.find_all("a", href=True) if "unsubscribe" in link["href"].lower()]
     return links

def click_link(link):
     try:
          response = requests.get(link)
          if response.status_code == 200:
               print("Successfully visited", link, end=" ")
          else:
               print("Failed to visit", link, "error code", response.status_code)
     except Exception as e:
          print("Error with", link, str(e), end=" ")



def search_for_emails():
    mail = connect_to_email()
    _, search_data = mail.search(None, '(BODY "unsubscribe")')
    data = search_data[0].split()

    links = []

    for num in data:
         _, data = mail.fetch(num, "(RFC822)")  # to fetch data from the email
         if data is not None and len(data) > 0:  # Check if data is not None and has elements
             if data[0] is not None:  # Ensure data[0] is not None
                 msg = email.message_from_bytes(data[0][1] if isinstance(data[0][1], bytes) else b'')  # convert the bytes type being returned to message type

             if msg.is_multipart():
                  for part in msg.walk():
                       if part.get_content_type() == "text/html":
                            # converting to string
                            html_content = part.get_payload(decode=True)  # Get payload as bytes
                            if isinstance(html_content, bytes):  # Check if it's bytes
                                html_content = html_content.decode()  # Decode to string
                            # storing links in a list for parsing
                            links.extend(extract_links_from_html(html_content))
             else:
                   content_type = msg.get_content_type()
                   content = msg.get_payload(decode=True)  # Get payload as bytes
                   if isinstance(content, bytes):  # Check if it's bytes
                       content = content.decode()  # Decode to string
                   if content_type == "text/html":
                        links.extend(extract_links_from_html(content))

    mail.logout()
    return links

def save_links(links):
     with open("links.txt", "w") as f:
          f.write("\n".join(links))

links = search_for_emails()
for link in links:
     click_link(link)

save_links(links)