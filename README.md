# ChromeGPT

ChromeGPT is a Chrome extension that allows you to apply code blocks directly to your local filesystem from web pages like ChatGPT. When you encounter a code block with a top-line comment specifying a file path (e.g. `// FILE: /path/to/file.ext`), the extension provides a floating button to write that code to your local filesystem (subject to configured directory permissions).

Currently it only works on Linux.

## Features
- **Inline Application of Code Blocks:** Quickly write code snippets from supported websites directly to allowed directories on your local machine.
- **Directory Restrictions:** Configure which directories are allowed targets for file writes, ensuring greater control and security.
- **Native Messaging Host:** Utilizes a native host application to securely write files to your system, avoiding potential security pitfalls of direct filesystem access from the browser.

## Setup
1. **Verify the scripts are safe:**
   - This extension is very small but requires the ability to write to your filesystem
   - Inspect `background.js`, `content-script.js`, and `native_host_application/chromegpt.py` for any suspicious code.  
   - Ensure that file writes are only occurring in user-configured directories.  
   - Confirm that no external network requests or unexpected operations occur.
    
   This will place the `dev.chromegpt.nativehost.json` manifest in the appropriate directory and the `chromegpt.py` script in `/opt/chromegpt`.

2. **Pack and Install the Extension in Chrome:**
   - Go to `chrome://extensions` in your Chrome browser.
   - Enable **Developer mode** (toggle in the top right).
   - Click **Pack extension...** and select the directory containing this project's `manifest.json`.
   - **Very important**: When prompted for a private key, choose `extension.pem` to ensure the extension ID matches the native host app. If you don't do this, the extension will not be able to communicate with the native host app, and will not be able to write files.
   - Install the resulting `.crx` file in Chrome by going to `chrome://extensions` and dragging it in.
   - Look at the extension id, you will need it for the next step

3. **Install the Native Host Application:**
   - Navigate to the `native_host_application` directory.
   - **Very important**: Verify that the allowed-origins in dev.chromegpt.nativehost.json matches the extension id from the previous step. If it does not, the extension will not be able to communicate with the native host app.
   - Run `install.sh` to install the Python-based native host script and the JSON manifest:
     ```bash
     cd native_host_application
     ./install.sh
     ```
   
4. **Configure Allowed Directories:**
   - After the extension is loaded, open its options page (found through the extension’s details page or by clicking the extension icon and selecting "Options").
   - Add the paths of directories where you want to allow file writes.
   - Click **Save**.

4. **Verify and Run the Project to Clipboard File:**
   - Ensure that `project_files_to_clipboard.sh` is present and functional in the project root.
   - Running this script in a git directory will copy a prompt with your files to the clipboard. The prompt will have instructions to output code in the correct format.
   - If you have a big project, you can select a subset of the files by including a comment with `PROJECT ID: <my project id>` in them, and then running `project_files_to_clipboard.sh` to select just those files.
   - After verifying, run `install.sh` in the root to copy project_files_to_clipboard.sh to /usr/bin/pftc. This makes it more convenient to run from anywhere.
