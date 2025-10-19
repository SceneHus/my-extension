// 插件安装时触发
chrome.runtime.onInstalled.addListener(() => {
  console.log('安全助手插件已安装');
  // 初始化默认设置
  chrome.storage.sync.set({ autoScan: false });
});



// 监听安全问题并发送通知
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'securityIssue') {
    console.log('发现安全问题:', message.details);
    // 创建通知
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png', // 用现有图标
      title: '安全助手警告',
      message: `页面存在安全风险: ${message.details}`,
      priority: 2 // 高优先级
    });
  }
  sendResponse({ received: true });
});