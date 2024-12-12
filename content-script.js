function createFloatingButtonForBlock(block) {
  const codeText = block.innerText.trim();
  const firstLine = codeText.split('\n')[0];
  const filePattern = /^\/\/\s*FILE:\s*(.+)$/;
  const match = firstLine.match(filePattern);
  if (!match) {
    return;
  }

  const applyBtn = document.createElement('button');
  applyBtn.innerText = "Apply to local filesystem";
  applyBtn.className = "apply-to-fs-btn";
  applyBtn.style.position = 'fixed';
  applyBtn.style.zIndex = '9999';
  applyBtn.style.background = '#007aff';

  function updateButtonPosition() {
    const codeRect = block.getBoundingClientRect();
    applyBtn.style.top = (codeRect.top - 50) + 'px';
    applyBtn.style.left = (codeRect.left + 100) + 'px';
    requestAnimationFrame(updateButtonPosition);
  }

  applyBtn.onclick = () => {
    const codeWithoutFileComment = codeText.split('\n').slice(1).join('\n');
    const filePath = match[1].trim();

    chrome.runtime.sendMessage(
      { action: 'writeFile', filePath: filePath, content: codeWithoutFileComment },
      response => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          alert("An error occurred, check console.");
        } else if (response && response.error) {
          alert(response.error);
        } else {
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

const observer = new MutationObserver(observeCodeBlocks);
observer.observe(document.body, { childList: true, subtree: true });
observeCodeBlocks();
