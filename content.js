// 监听来自popup的扫描请求
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scanPage') {
    // 这里是基础扫描逻辑（实际安全处理需扩展）
    const scanResult = basicSecurityCheck();
    sendResponse({ result: scanResult });
  }
});

// 基础安全检查示例（仅框架）
function basicSecurityCheck() {
  // 1. 检查是否使用HTTPS
  const isHttps = window.location.protocol === 'https:';
  // 2. 检查是否有可疑脚本（示例）
  const suspiciousScripts = document.querySelectorAll('script[src*="unknown-domain"]');
  
  let result = [];
  if (!isHttps) result.push('非HTTPS连接');
  if (suspiciousScripts.length > 0) result.push(`发现${suspiciousScripts.length}个可疑脚本`);
  
  return result.length > 0 ? result.join('; ') : '未发现明显问题';
}

// 自动扫描（根据设置）
chrome.storage.sync.get('autoScan', (data) => {
  if (data.autoScan) {
    const issues = basicSecurityCheck();
    if (issues !== '未发现明显问题') {
      // 向background发送问题通知
      chrome.runtime.sendMessage({
        action: 'securityIssue',
        details: issues
      });
    }
  }
});

// 监听DOM变化，实时扫描新增内容
function observeDOMChanges() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // 检查新增的元素
      if (mutation.addedNodes.length > 0) {
        const newIssues = basicSecurityCheck(); // 复用现有检查逻辑
        if (newIssues !== '未发现明显问题') {
          chrome.runtime.sendMessage({
            action: 'securityIssue',
            details: `动态内容发现问题: ${newIssues}`
          });
        }
      }
    });
  });

  // 监听整个文档的DOM变化
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  });
}

// 在页面加载时启动监听
observeDOMChanges();