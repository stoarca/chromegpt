function createFloatingButtonForBlock(block) {
  const applyBtn = document.createElement('button');
  applyBtn.innerText = "Apply to local filesystem";
  applyBtn.className = "apply-to-fs-btn";
  applyBtn.style.position = 'fixed';
  applyBtn.style.zIndex = '9999';
  applyBtn.style.background = '#007aff';

  // This function updates the button position each frame
  function updateButtonPosition() {
    const codeRect = block.getBoundingClientRect();
    applyBtn.style.top = (codeRect.top - 50) + 'px';
    applyBtn.style.left = (codeRect.left + 100) + 'px';
    requestAnimationFrame(updateButtonPosition);
  }

  applyBtn.onclick = () => {
    const codeText = block.innerText.trim();
    const firstLine = codeText.split('\n')[0];
    const filePattern = /^\/\/\s*FILE:\s*(.+)$/;
    const match = firstLine.match(filePattern);

    if (!match) {
      alert("Error: The top comment must specify FILE path like `// FILE: /path/to/file.ext`");
      return;
    }

    const filePath = match[1].trim();
    chrome.runtime.sendMessage(
      { action: 'writeFile', filePath: filePath, content: codeText },
      response => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          alert("An error occurred, check console.");
        } else if (response && response.error) {
          alert(response.error);
        } else {
          alert("File applied successfully!");
        }
      }
    );
  };

  document.body.appendChild(applyBtn);

  // Start continuously updating the button position
  requestAnimationFrame(updateButtonPosition);
}

function observeCodeBlocks() {
  const codeBlocks = document.querySelectorAll('code.hljs');
  codeBlocks.forEach(block => {
    if (block.dataset.hasFsButton) return;
    block.dataset.hasFsButton = 'true';
    createFloatingButtonForBlock(block);
  });
}

// Observe for new code blocks
const observer = new MutationObserver(observeCodeBlocks);
observer.observe(document.body, { childList: true, subtree: true });
observeCodeBlocks();

