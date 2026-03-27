---
sidebar_position: 12
---

# WhatsApp Service Integration

The WhatsApp service in LeadNow enables automated, programmatic communication with users via the WhatsApp Cloud API by Meta. It is designed to support both transactional and conversational messaging, including text and template-based messages, and to integrate seamlessly with the broader platform for notifications and user engagement. The WhatsApp integration is implemented in the `whatsapp_service/whatsapp_client.py` module, which provides a `WhatsAppClient` class for interacting with the WhatsApp Cloud API.

## WhatsAppClient Class

The `WhatsAppClient` class encapsulates all logic for sending and managing WhatsApp messages.

### Initialization

```python
class WhatsAppClient:
    def __init__(self, token: str, phone_number_id: str):
        self.token = token
        self.phone_number_id = phone_number_id
        self.base_url = f"https://graph.facebook.com/v23.0/{{self.phone_number_id}}"
        if not self.token:
            raise ValueError("WhatsApp token missing!")
        if not self.phone_number_id:
            raise ValueError("WhatsApp phone number ID missing!")
```

This constructor initializes the WhatsApp client with the necessary credentials for using the WhatsApp Cloud API, which are the token and phone number ID.

### Sending Text Messages

The client provides the function to send WhatsApp messages to a given phone number.

```python
def send_text_message(self, to_number: str, message: str) -> Optional[Dict[str, Any]]:
    url = f"{{self.base_url}}/messages"
    headers = {
        "Authorization": f"Bearer {{self.token}}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to_number,
        "type": "text",
        "text": {"body": message}
    }
    response = requests.post(url, json=payload, headers=headers, timeout=10)
    response.raise_for_status()
    return response.json()
```

Given the parameters of recipient number and a text message in string format, it constructs the JSON payload according to WhatsApp Cloud API specification. It then makes a POST request to the endpoint. If the request is successful, it returns the API’s JSON response, which contains metadata about the sent message (such as message ID and status).

### Sending Template Messages

The client also supports sending template messages. While regular messages can only be sent to the user during a 24-hour window after the user initiates a chat, template messages are predefined messages which can be sent anytime but must be approved by Meta beforehand. 

```python
def send_template_message(self, to_number: str, template_name: str, language: str = "en", parameters: Optional[list] = None) -> Optional[Dict[str, Any]]:
    # ...constructs payload with template name, language, and parameters...
    response = requests.post(url, json=payload, headers=headers, timeout=10)
    response.raise_for_status()
    return response.json()
```

The send_template_message method is used to send a pre-approved template message, supporting dynamic parameters for personalisation. It takes a phone number and template name, and makes a POST request to the endpoint in a similar fashion to the previous method.

### Marking Messages as Read

This method marks a specific message as read, supporting two-way communication and message state management.

```python
def mark_message_as_read(self, message_id: str) -> bool:
    payload = {
        "messaging_product": "whatsapp",
        "status": "read",
        "message_id": message_id
    }
    response = requests.post(url, json=payload, headers=headers, timeout=10)
    response.raise_for_status()
    return True
```

### Error Handling and Logging

- All API interactions are wrapped in try/except blocks.
- Errors are logged with detailed messages, and failed requests return `None` or `False` as appropriate.
- Logging provides traceability for message delivery and troubleshooting.

## Summary

The WhatsApp service is a robust, extensible integration that enables LeadNow to communicate with users via WhatsApp for notifications, support, and interactive messaging. Its modular design and comprehensive error handling ensure reliability and ease of maintenance.