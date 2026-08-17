#!/usr/bin/env node
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");

// 配置 - 从环境变量读取，也可写死
const API_BASE = process.env.CHATROOM_API_BASE || 'https://liuwenxuan3dp.ct.ws/chat/xzapi.php';
const TOKEN = process.env.CHATROOM_TOKEN || '1ee0c4cd550d539fdeb46135a30f38d6ea93e1615b3ff8f9781cfb297b7ca824';
const USERNAME = process.env.CHATROOM_USERNAME || '刘文轩的3D打印';
const PASSWORD = process.env.CHATROOM_PASSWORD || 'liuwenxuan3dp-2026@Lwx';
const ROOM = process.env.CHATROOM_ROOM || '00f736cc';

const server = new Server(
  {
    name: "xiaozhi-chatroom-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "send_chat_message",
        description: "向聊天室发送消息，可以让小智AI在聊天室中发言",
        inputSchema: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "要发送到聊天室的消息内容",
            },
          },
          required: ["message"],
        },
      },
    ],
  };
});

// 工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "send_chat_message") {
    const message = request.params.arguments.message;

    try {
      // 构建URL（GET请求）
      const params = new URLSearchParams({
        action: 'ai_chat',
        message: message,
        token: TOKEN,
        username: USERNAME,
        password: PASSWORD,
        room: ROOM
      });

      const url = `${API_BASE}?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();

      const resultText = data.result || data.message || JSON.stringify(data);

      return {
        content: [
          {
            type: "text",
            text: `消息已发送: ${resultText}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `发送失败: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`未知工具: ${request.params.name}`);
});

// 启动
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
