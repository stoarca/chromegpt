// Background script communicates with native host and enforces directory limits

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'writeFile') {
    const { filePath, content } = message;

    // Check if filePath is in allowed directories
    chrome.storage.sync.get('allowedDirectories', ({ allowedDirectories }) => {
      if (!allowedDirectories || allowedDirectories.length === 0) {
        sendResponse({ error: "No allowed directories configured." });
        return;
      }

      const allowed = allowedDirectories.some(dir => filePath.startsWith(dir));
      if (!allowed) {
        sendResponse({ error: "The file path is not within the allowed directories. Go to the extension options to configure." });
        return;
      }

      // Communicate with the native host to write the file
      writeFileViaNativeHost(filePath, content, result => {
        if (result.error) {
          sendResponse({ error: result.error });
        } else {
          sendResponse({ success: true });
        }
      });
    });

    // Return true to keep the message channel open for async response
    return true;
  }
});

function writeFileViaNativeHost(filePath, content, callback) {
  const port = chrome.runtime.connectNative('dev.chromegpt.nativehost');
  let responseHandled = false;

  port.onMessage.addListener((msg) => {
    if (!responseHandled) {
      responseHandled = true;
      callback(msg);
      port.disconnect();
    }
  });

  port.onDisconnect.addListener(() => {
    if (!responseHandled) {
      callback({ error: 'Failed to connect or no response from native host.' });
    }
  });

  port.postMessage({ action: 'writeFile', path: filePath, content: content });
}

