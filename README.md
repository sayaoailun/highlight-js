# Highlight Custom - 自定义关键词高亮脚本

一个用于在任意网站上高亮自定义关键词的用户脚本。

## 功能特性

- ✅ **关键词高亮**：在网页中高亮显示自定义关键词
- ✅ **精准匹配**：只高亮关键词本身，不影响周围文本
- ✅ **多网站支持**：支持按网站域名配置不同的关键词
- ✅ **动态内容处理**：自动处理滚动加载的内容
- ✅ **鼠标提示**：悬停显示关键词描述信息
- ✅ **自定义颜色**：每个关键词可设置独立的高亮颜色

## 安装方法

### 方法一：直接安装

1. 安装浏览器扩展：
   - Chrome/Firefox：[Tampermonkey](https://www.tampermonkey.net/)
   - Edge：[Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. 点击浏览器扩展图标，选择「创建新脚本」

3. 将 `highlight-custom.user.js` 的内容复制粘贴进去

4. 按 `Ctrl+S` 保存

### 方法二：本地安装

```bash
# 克隆或下载此脚本
git clone <repository-url>

# 在 Tampermonkey 中导入脚本
# 扩展菜单 → 实用工具 → 导入文件
```

## 使用说明

### 默认关键词

脚本内置了以下关键词：

| 关键词 | 描述 | 高亮颜色 |
|--------|------|----------|
| react | React框架 | 天蓝色 (#61DAFB) |
| vue | Vue框架 | 绿色 (#488d6e) |
| javascript | JavaScript | 黄色 (#F7DF1E) |
| python | Python | 蓝色 (#3776AB) |
| 数据 | 数据相关 | 红色 (#FF6B6B) |
| AI | 人工智能 | 紫色 (#A855F7) |
| 爬虫 | 爬虫技术 | 绿色 (#22C55E) |
| 限免 | 限时免费 | 橙色 (#F97316) |

### 自定义配置

编辑 `highlight-custom.user.js` 中的 `DEFAULT_CONFIG` 来自定义关键词：

```javascript
const DEFAULT_CONFIG = {
    sites: {
        // 匹配所有网站
        '.*': [
            { str: '关键词', title: '描述信息', color: '#颜色代码' },
            // 添加更多关键词...
        ],
        // 针对特定网站配置
        'github\\.com': [
            { str: 'pull request', title: 'PR', color: '#22C55E' },
        ]
    },
    defaultColor: '#FFDA5E',      // 默认高亮颜色
    defaultTextColor: 'black'      // 默认文本颜色
};
```

### 配置说明

| 参数 | 类型 | 说明 |
|------|------|------|
| `sites` | Object | 网站配置对象，key为正则表达式 |
| `str` | String | 要匹配的关键词 |
| `title` | String | 鼠标悬停时显示的提示信息 |
| `color` | String | 高亮背景颜色（可选） |
| `defaultColor` | String | 默认高亮颜色 |
| `defaultTextColor` | String | 默认文本颜色 |

## 支持的标签

脚本会在以下 HTML 标签中搜索关键词：

- 标题：`h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- 段落：`p`, `div`
- 链接：`a`
- 代码：`pre`, `blockquote`
- 摘要：`summary`

## 工作原理

```
┌─────────────────────────────────────────────┐
│              页面加载完成                    │
└───────────────────┬─────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│  初始化关键词服务（根据URL匹配关键词）         │
└───────────────────┬─────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│  遍历目标标签，查找文本节点中的关键词          │
└───────────────────┬─────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│  将匹配的关键词用 <mark> 标签包裹并高亮       │
└───────────────────┬─────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│  监听滚动事件，处理动态加载内容               │
└─────────────────────────────────────────────┘
```

## 示例

**输入**：
```html
<p>React 和 Vue 都是优秀的 JavaScript 框架</p>
```

**输出**：
```html
<p>
  <mark style="background-color: #61DAFB; color: black;" title="React框架">React</mark>
  和
  <mark style="background-color: #488d6e; color: black;" title="Vue框架">Vue</mark>
  都是优秀的
  <mark style="background-color: #F7DF1E; color: black;" title="JavaScript">JavaScript</mark>
  框架
</p>
```

## 注意事项

1. 脚本只匹配文本节点，不会修改 HTML 标签
2. 关键词匹配不区分大小写（使用 `gi` 标志）
3. 已高亮的元素不会重复处理（通过 `data-highlighted` 属性标记）
4. 建议避免设置过于通用的关键词，以免影响阅读体验

## 许可证

MIT License
