// FILE: README.md
# ChromeGPT

ChromeGPT is a Chrome extension that allows you to apply code blocks directly to your local filesystem from web pages like ChatGPT. When you encounter a code block with a top-line comment specifying a file path (e.g. `// FILE: /path/to/file.ext`), the extension provides a floating button to write that code to your local filesystem (subject to configured directory permissions).

## Features
- **Inline Application of Code Blocks:** Quickly write code snippets from supported websites directly to allowed directories on your local machine.
- **Directory Restrictions:** Configure which directories are allowed targets for file writes, ensuring greater control and security.
- **Native Messaging Host:** Utilizes a native host application to securely write files to your system, avoiding potential security pitfalls of direct filesystem access from the browser.

## Setup
1. **Install the Native Host Application:**
   - Navigate to the `native_host_application` directory.
   - Run `install.sh` to install the Python-based native host script and the JSON manifest:
     ```bash
     cd native_host_application
     ./install.sh
     ```
   
   This will place the `dev.chromegpt.nativehost.json` manifest in the appropriate directory and the `chromegpt.py` script in `/opt/chromegpt`.

2. **Load the Extension in Chrome:**
   - Go to `chrome://extensions` in your Chrome browser.
   - Enable **Developer mode** (toggle in the top right).
   - Click **Load unpacked** and select the directory containing this project's `manifest.json`.

3. **Configure Allowed Directories:**
   - After the extension is loaded, open its options page (found through the extension’s details page or by clicking the extension icon and selecting "Options").
   - Add the paths of directories where you want to allow file writes.
   - Click **Save**.

Once configured, browse websites like ChatGPT, and for any recognized code block, a floating button will appear. Clicking it will write the code directly to the specified file path within your allowed directories.

## Verifying the Scripts Are Safe
Before using this extension in a production environment or on sensitive data, you should verify that the scripts are not malicious:

1. **Review the Source Code:**  
   Inspect `background.js`, `content-script.js`, and `native_host_application/chromegpt.py` for any suspicious code.  
   - Ensure that file writes are only occurring in user-configured directories.  
   - Confirm that no external network requests or unexpected operations occur.

2. **Check the `manifest.json`:**  
   Verify the requested permissions. This extension primarily needs storage, scripting, and nativeMessaging permissions. It should not require suspicious permissions like full browsing history access or arbitrary remote code execution.

3. **Code Integrity:**  
   - Compare the provided source files against the repository or a trusted source to ensure no unexpected modifications.  
   - Check that the native host manifest (`dev.chromegpt.nativehost.json`) points to the correct script path and does not allow unauthorized origins.

4. **Run in a Controlled Environment:**  
   Test the extension in a controlled environment (e.g., a sandbox or a VM) with dummy directories and files before applying it to your main system.

By taking these steps, you can be confident that the extension is trustworthy and functions as intended without malicious behavior.


