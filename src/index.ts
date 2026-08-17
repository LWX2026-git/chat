#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE = 'https://liuwenxuan3dp.ct.ws/chat/xzapi.php';
const TOKEN = '1ee0c4cd550d539fdeb46135a30f38d6ea93e1615b3ff8f9781cfb297b7ca824';
const USERNAME = '刘文轩的3D打印';
const PASSWORD = 'liuwenxuan3dp-2026@Lwx';
const ROOM = '00f736cc';

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

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "send_chat_message") {
    const message = request.params.arguments.message as string;
    
    try {
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
      
      return {
        content: [
          {
            type: "text",
            text: data.result || JSON.stringify(data),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `错误: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
  
  throw new Error(`未知工具: ${request.params.name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);

