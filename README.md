# Xiaozhi Chatroom MCP

小智AI聊天室MCP服务器，让小智AI可以向您的聊天室发送消息。

## 安装

### 通过npx运行（推荐）

```bash
npx -y xiaozhi-chatroom-mcp
```

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/LWX2026-git/xiaozhi-mcp.git
cd xiaozhi-mcp

# 安装依赖
npm install

# 运行
npm start
```

## 配置

### 环境变量

| 变量名 | 说明 | 默认值 |
|---|---|---|
| `CHATROOM_API_BASE` | API基础地址 | `https://liuwenxuan3dp.ct.ws/chat/xzapi.php` |
| `CHATROOM_TOKEN` | API令牌 | （内置） |
| `CHATROOM_USERNAME` | 用户名 | `刘文轩的3D打印` |
| `CHATROOM_PASSWORD` | 密码 | （内置） |
| `CHATROOM_ROOM` | 房间号 | `00f736cc` |

### MCP客户端配置

#### Cursor / Claude Desktop

```json
{
  "mcpServers": {
    "xiaozhi-chatroom": {
      "command": "npx",
      "args": ["-y", "xiaozhi-chatroom-mcp"]
    }
  }
}
```

## 工具

- `send_chat_message` - 向聊天室发送消息
  - 参数: `message` (string) - 消息内容

## 使用示例

对小智AI说："帮我在聊天室发一条消息：大家好！"

## License

MIT
