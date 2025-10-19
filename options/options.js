document.addEventListener('DOMContentLoaded', loadSettings);
document.getElementById('saveBtn').addEventListener('click', saveSettings);
document.getElementById('resetBtn').addEventListener('click', resetSettings);

function loadSettings() {
  chrome.storage.sync.get({
    autoScan: false,
    notifications: true,
    sensitivity: 'medium',
    ignoredSites: []
  }, (settings) => {
    document.getElementById('autoScan').checked = settings.autoScan;
    document.getElementById('notifications').checked = settings.notifications;
    document.getElementById('sensitivity').value = settings.sensitivity;
    document.getElementById('ignoredSites').value = settings.ignoredSites.join('\n');
  });
}

function saveSettings() {
  const settings = {
    autoScan: document.getElementById('autoScan').checked,
    notifications: document.getElementById('notifications').checked,
    sensitivity: document.getElementById('sensitivity').value,
    ignoredSites: document.getElementById('ignoredSites').value.split('\n')
      .map(site => site.trim())
      .filter(site => site && !site.startsWith('#')) // 忽略注释行
  };

  chrome.storage.sync.set(settings, () => {
    // 创建更美观的保存提示
    const status = document.createElement('div');
    status.textContent = '✓ 设置已保存！';
    status.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #27ae60;
      color: white;
      padding: 10px 15px;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 1000;
    `;
    document.body.appendChild(status);
    setTimeout(() => status.remove(), 2000);
  });
}

function resetSettings() {
  if (confirm('确定要恢复默认设置吗？所有自定义设置将会丢失。')) {
    chrome.storage.sync.set({
      autoScan: false,
      notifications: true,
      sensitivity: 'medium',
      ignoredSites: []
    }, () => {
      loadSettings();
      // 显示重置成功提示
      alert('设置已重置为默认值');
    });
  }
}