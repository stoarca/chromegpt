import sys, json, os

def send_message(msg):
    sys.stdout.write(json.dumps(msg) + "\n")
    sys.stdout.flush()

for line in sys.stdin:
    request = json.loads(line)
    action = request.get('action')
    if action == 'writeFile':
        path = request.get('path')
        content = request.get('content')
        try:
            # Write the file (ensure that the directory checks are done in extension)
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            send_message({"success": True})
        except Exception as e:
            send_message({"error": str(e)})
    else:
        send_message({"error": "Unknown action"})

