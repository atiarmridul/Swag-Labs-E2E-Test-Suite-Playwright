#!/usr/bin/env node

/**
 * @file local-mcp-server.js
 * @description A zero-dependency Model Context Protocol (MCP) server running over stdio.
 * This server provides tools to interact with the local workspace, such as greeting
 * users and retrieving file information. It follows the JSON-RPC 2.0 specification.
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Constants for workspace navigation and security
const WORKSPACE_ROOT = path.resolve(__dirname, '..');

/**
 * Setup readline interface to read from stdin and write to stdout.
 * 'terminal: false' ensures we don't get terminal-specific escape sequences.
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

/**
 * Sends a successful JSON-RPC response to stdout.
 * @param {string|number} id - The request ID being responded to.
 * @param {Object} result - The result payload to send back.
 */
function sendResponse(id, result) {
  const response = {
    jsonrpc: '2.0',
    id,
    result,
  };
  process.stdout.write(JSON.stringify(response) + '\n');
}

/**
 * Sends a JSON-RPC error response to stdout.
 * @param {string|number|null} id - The request ID (can be null for parsing errors).
 * @param {number} code - The JSON-RPC error code.
 * @param {string} message - A short description of the error.
 * @param {any} [data] - Optional additional error details.
 */
function sendError(id, code, message, data = null) {
  const response = {
    jsonrpc: '2.0',
    id: id || null,
    error: {
      code,
      message,
      ...(data && { data }),
    },
  };
  process.stdout.write(JSON.stringify(response) + '\n');
}

/**
 * Logs debug information to stderr.
 * Stderr is used so that logs do not interfere with the JSON-RPC communication on stdout.
 * @param {string} msg - The message to log.
 */
function log(msg) {
  process.stderr.write(`[Local MCP Log] ${msg}\n`);
}

/**
 * Main request loop: processes each line from stdin as a JSON-RPC request.
 */
rl.on('line', (line) => {
  // Skip empty lines
  if (!line.trim()) return;

  let requestId = null;
  try {
    // Parse the incoming JSON-RPC request
    const request = JSON.parse(line);
    requestId = request.id;
    const { method, params } = request;

    log(`Received JSON-RPC request: method = ${method}, id = ${requestId}`);

    // --- MCP Lifecycle Methods ---

    /**
     * 'initialize': First request sent by a client to negotiate protocol version and capabilities.
     */
    if (method === 'initialize') {
      sendResponse(requestId, {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}, // Tools capability is supported
        },
        serverInfo: {
          name: 'local-mcp-server',
          version: '1.0.1',
        },
      });
    } else if (method === 'tools/list') {
    /**
     * 'tools/list': Returns a list of available tools and their input schemas.
     */
      sendResponse(requestId, {
        tools: [
          {
            name: 'say_hello',
            description: 'Returns a friendly greeting from the local MCP server.',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'The name of the person to greet.',
                },
              },
              required: ['name'],
            },
          },
          {
            name: 'get_file_info',
            description: 'Returns size and line count of a specific file in the workspace.',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: {
                  type: 'string',
                  description: 'Relative path of the file to inspect.',
                },
              },
              required: ['filePath'],
            },
          },
        ],
      });
    } else if (method === 'tools/call') {
    /**
     * 'tools/call': Executes a specific tool with the provided arguments.
     */
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      log(`Calling tool: ${toolName}`);

      // Implementation of 'say_hello' tool
      if (toolName === 'say_hello') {
        const targetName = toolArgs.name || 'World';
        sendResponse(requestId, {
          content: [
            {
              type: 'text',
              text: `Hello, ${targetName}! Greetings from your local MCP server.`,
            },
          ],
        });
      }
      // Implementation of 'get_file_info' tool
      else if (toolName === 'get_file_info') {
        const requestedPath = toolArgs.filePath;

        // Basic validation: filePath must be provided
        if (!requestedPath) {
          return sendResponse(requestId, {
            content: [{ type: 'text', text: 'Error: filePath is required' }],
            isError: true,
          });
        }

        /**
         * Security: Prevent path traversal.
         * We resolve the path and verify it starts with our WORKSPACE_ROOT.
         */
        const resolvedPath = path.resolve(WORKSPACE_ROOT, requestedPath);
        if (!resolvedPath.startsWith(WORKSPACE_ROOT)) {
          return sendResponse(requestId, {
            content: [{ type: 'text', text: 'Error: Path is outside of workspace' }],
            isError: true,
          });
        }

        try {
          if (fs.existsSync(resolvedPath)) {
            const stats = fs.statSync(resolvedPath);

            // Ensure we are only reading files, not directories
            if (!stats.isFile()) {
              return sendResponse(requestId, {
                content: [{ type: 'text', text: `Error: ${requestedPath} is not a file` }],
                isError: true,
              });
            }

            /**
             * Safety: Memory management.
             * Do not attempt to count lines for files larger than 10MB to avoid memory pressure.
             */
            if (stats.size > 10 * 1024 * 1024) {
              return sendResponse(requestId, {
                content: [
                  {
                    type: 'text',
                    text: `File: ${requestedPath}\n- Size: ${stats.size} bytes\n- Lines: Too large to count efficiently (>10MB)`,
                  },
                ],
              });
            }

            // Read file content and calculate line count
            const content = fs.readFileSync(resolvedPath, 'utf8');
            const lines = content.split('\n').length;
            sendResponse(requestId, {
              content: [
                {
                  type: 'text',
                  text: `File: ${requestedPath}\n- Size: ${stats.size} bytes\n- Lines: ${lines} lines`,
                },
              ],
            });
          } else {
            sendResponse(requestId, {
              content: [{ type: 'text', text: `Error: File not found at path ${requestedPath}` }],
              isError: true,
            });
          }
        } catch (err) {
          sendResponse(requestId, {
            content: [{ type: 'text', text: `Error: ${err.message}` }],
            isError: true,
          });
        }
      }
      // Unknown tool error
      else {
        sendError(requestId, -32601, `Tool not found: ${toolName}`);
      }
    } else if (method === 'notifications/initialized' || method.startsWith('notifications/')) {
    /**
     * Handle MCP notifications (which don't require responses).
     */
      log(`Received notification: ${method}`);
    } else {
    /**
     * Handle unknown methods (Method not found).
     */
      if (requestId !== undefined) {
        sendError(requestId, -32601, `Method not found: ${method}`);
      }
    }
  } catch (err) {
    /**
     * Global error handler to ensure we always send a JSON-RPC error response
     * and prevent the client from hanging.
     */
    log(`Internal Error: ${err.message}`);
    sendError(requestId, -32603, 'Internal error', err.message);
  }
});
