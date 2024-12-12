document.getElementById('saveBtn').addEventListener('click', () => {
  const dirs = document.getElementById('allowedDirs').value.split('\n').map(s => s.trim()).filter(Boolean);
  chrome.storage.sync.set({ allowedDirectories: dirs }, () => {
    alert('Allowed directories saved.');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('allowedDirectories', (data) => {
    if (data.allowedDirectories) {
      document.getElementById('allowedDirs').value = data.allowedDirectories.join('\n');
    }
  });
});
