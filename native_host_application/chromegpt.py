#!/usr/bin/env python3
import sys, json, struct

def send_message(msg):
    # Encode message to UTF-8
    encoded = json.dumps(msg).encode('utf-8')
    # Write message length (4 bytes, little endian)
    sys.stdout.buffer.write(struct.pack('<I', len(encoded)))
    # Write the actual JSON message bytes
    sys.stdout.buffer.write(encoded)
    sys.stdout.flush()

def read_message():
    # Read the message length (4 bytes)
    raw_length = sys.stdin.buffer.read(4)
    if len(raw_length) == 0:
        return None
    message_length = struct.unpack('<I', raw_length)[0]

    # Read the message data
    message_bytes = sys.stdin.buffer.read(message_length)
    if len(message_bytes) == 0:
        return None

    # Decode the message
    return json.loads(message_bytes.decode('utf-8'))

while True:
    request = read_message()
    if request is None:
        break
    action = request.get('action')
    if action == 'writeFile':
        path = request.get('path')
        content = request.get('content')
        try:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            send_message({"success": True})
        except Exception as e:
            send_message({"error": str(e)})
    else:
        send_message({"error": "Unknown action"})

