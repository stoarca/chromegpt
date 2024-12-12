// Background script communicates with native host and enforces directory limits

function normalizePath(path) {
  // Normalize the file path to prevent escaping allowed directories via '../'
  const parts = path.split('/');
  const stack = [];
  for (const part of parts) {
    if (part === '' || part === '.') {
      continue;
    } else if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  return '/' + stack.join('/');
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'writeFile') {
    let { filePath, content } = message;

    // Normalize the file path before checking allowed directories
    filePath = normalizePath(filePath);

    // Check if filePath is in allowed directories
    chrome.storage.sync.get('allowedDirectories', ({ allowedDirectories }) => {
      if (!allowedDirectories || allowedDirectories.length === 0) {
        sendResponse({ error: "No allowed directories configured." });
        return;
      }

      const allowed = allowedDirectories.some(dir => {
        const normalizedDir = normalizePath(dir);
        return filePath.startsWith(normalizedDir);
      });
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