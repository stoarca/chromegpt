// FILE: /home/serge/projects/chromegpt/content-script.js
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
    const codeWithoutFileComment = codeText.split('\n').slice(1).join('\n');

    chrome.runtime.sendMessage(
      { action: 'writeFile', filePath: filePath, content: codeWithoutFileComment },
      response => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          alert("An error occurred, check console.");
        } else if (response && response.error) {
          alert(response.error);
        } else {
          // Success: Glow button green for 1 second
          applyBtn.style.transition = 'background-color 0.3s ease';
          applyBtn.style.backgroundColor = 'green';
          setTimeout(() => {
            applyBtn.style.backgroundColor = '#007aff';
          }, 1000);
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