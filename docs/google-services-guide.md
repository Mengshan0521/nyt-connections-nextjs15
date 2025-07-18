# Google服务集成指南

本文档介绍如何在Next.js 15国际化项目中使用Google AdSense和Google Analytics。

## 设置环境变量

首先，创建一个`.env.local`文件（如果尚未创建），添加以下环境变量：

```
# Google Analytics Measurement ID (GA4)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google AdSense Publisher ID
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

将`G-XXXXXXXXXX`替换为您的Google Analytics测量ID，将`ca-pub-XXXXXXXXXXXXXXXX`替换为您的Google AdSense发布商ID。

## Google AdSense配置

### 1. 在公共目录中创建ads.txt文件

`ads.txt`文件应该包含Google AdSense提供的信息，通常格式如下：

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

请将`pub-XXXXXXXXXXXXXXXX`替换为您的实际发布商ID。

### 2. 在页面中添加广告单元

在您希望显示广告的页面中使用`AdUnit`组件：

```tsx
import AdUnit from '@/components/AdUnit';

export default function YourPage() {
  return (
    <div>
      <h1>页面标题</h1>
      <p>页面内容...</p>
      
      {/* 添加广告单元 */}
      <AdUnit slotId="1234567890" />
      
      <p>更多内容...</p>
    </div>
  );
}
```

将`1234567890`替换为您在Google AdSense中创建的广告单元的ID。

### 3. 注意事项

- 广告单元只会在用户同意使用广告cookie后才会加载
- 广告会在路由变化时自动刷新，解决了Next.js客户端导航的问题
- 支持响应式广告单元，会自动适应容器宽度

## Google Analytics使用

### 1. 页面浏览跟踪

页面浏览会在用户同意分析cookie后自动跟踪，无需额外代码。

### 2. 事件跟踪

使用`EventTracker`组件跟踪用户交互：

```tsx
import EventTracker from '@/components/EventTracker';

export default function YourComponent() {
  return (
    <div>
      <h2>产品信息</h2>
      
      <EventTracker
        eventName="view_product"
        label="查看详情"
        data={{
          product_id: "12345",
          product_name: "示例产品"
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      />
    </div>
  );
}
```

也可以直接调用全局gtag函数（仅在客户端组件中）：

```tsx
'use client';

import { useEffect } from 'react';

export default function YourClientComponent() {
  useEffect(() => {
    // 确保gtag存在
    if (window.gtag) {
      window.gtag('event', 'custom_event', {
        event_category: '类别',
        event_label: '标签',
        value: 123
      });
    }
  }, []);
  
  return <div>客户端组件</div>;
}
```

## Cookie同意机制

本项目实现了符合GDPR等隐私法规的cookie同意机制：

1. 首次访问网站时，会显示cookie同意对话框
2. 用户可以选择接受或拒绝非必要cookie
3. 用户的选择会保存在localStorage中
4. Google Analytics和AdSense只有在用户同意后才会加载

如果需要调整cookie同意对话框的样式或文本，可以修改根布局文件中的相关代码。

## 故障排除

### Google AdSense未显示广告

1. 检查环境变量`NEXT_PUBLIC_ADSENSE_ID`是否正确设置
2. 确认`ads.txt`文件存在并且内容正确
3. 检查广告单元ID是否正确
4. 查看浏览器控制台是否有相关错误消息
5. 确保用户已同意广告cookie
6. AdSense账户可能需要几天时间审核

### Google Analytics未跟踪数据

1. 检查环境变量`NEXT_PUBLIC_GA_ID`是否正确设置
2. 确保用户已同意分析cookie
3. 在Google Analytics后台检查是否有活跃用户
4. 使用浏览器扩展如"Google Analytics Debugger"进行调试

### 客户端导航问题

如果在路由变化后广告或分析功能不正常工作：

1. 确认`AdUnit`组件中的`usePathname`钩子正在正确监听路由变化
2. 检查浏览器控制台是否有错误消息
3. 尝试增加广告重载的延迟时间

## 最佳实践

1. 仅在需要的页面添加广告，避免过多广告影响用户体验
2. 使用适当的事件跟踪，不要过度跟踪用户行为
3. 确保cookie同意机制符合运营地区的隐私法规
4. 定期检查Google Analytics和AdSense后台，监控性能和收入
5. 考虑在生产环境中使用GTM（Google Tag Manager）进行更灵活的标签管理 