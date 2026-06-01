const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * @file update-docs.js
 * @description This script orchestrates the documentation update process. It:
 * 1. Runs the Playwright E2E test suite.
 * 2. Captures and cleans the test output.
 * 3. Updates docs/AGENT_PROGRESS.md with the results.
 * 4. Syncs the documentation artifacts to a local "brain" directory for agent persistence.
 */

// Project path configuration
const workspaceRoot = path.join(__dirname, '..');
const docsDir = path.join(workspaceRoot, 'docs');
const agentProgressPath = path.join(docsDir, 'AGENT_PROGRESS.md');
const agentPath = path.join(docsDir, 'AGENT.md');

/**
 * Define the local synchronization directory for agent brain artifacts.
 * This is used to persist state across different agent sessions.
 */
const brainDir =
  '/Users/atiarrahmanchowdhury/.gemini/antigravity-cli/brain/7e6e919c-4d8c-4e5f-ab6a-b5ec8c5f9d36';

console.log('🚀 Running E2E Playwright tests...');
let testOutput = '';
let testPassed = false;

try {
  /**
   * Execute E2E tests and capture standard output.
   * We use 'pipe' to capture stdout/stderr programmatically.
   */
  const outputBuffer = execSync('npx playwright test', { cwd: workspaceRoot, stdio: 'pipe' });
  testOutput = outputBuffer.toString();
  testPassed = true;
} catch (error) {
  // If tests fail, they throw an error. We capture the output from the error object.
  testOutput = error.stdout ? error.stdout.toString() : '';
  if (error.stderr) {
    testOutput += '\n' + error.stderr.toString();
  }
  console.error('❌ Playwright test execution encountered failures/errors.');
}

console.log('📝 Updating docs/AGENT_PROGRESS.md with latest run details...');

/**
 * Strip ANSI control characters and terminal styling codes from the output
 * to ensure the Markdown file remains readable.
 */
 
const cleanOutput = testOutput
  .replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
  .trim();

// Proceed only if the target progress file exists
if (fs.existsSync(agentProgressPath)) {
  let content = fs.readFileSync(agentProgressPath, 'utf8');

  // Update status metadata fields using regex replacements
  const today = new Date().toISOString().split('T')[0];
  content = content.replace(
    /- \*\*Overall Status\*\*:.*/,
    `- **Overall Status**: ${testPassed ? 'Clean & Passing' : 'Failing Tests'}`,
  );
  content = content.replace(/- \*\*Last Updated\*\*:.*/, `- **Last Updated**: ${today}`);

  /**
   * Replace the test results block inside predefined comment boundaries.
   * This allows us to keep the rest of the file structure intact.
   */
  const boundaryStart = '<!-- TEST_RESULTS_START -->';
  const boundaryEnd = '<!-- TEST_RESULTS_END -->';
  const startIndex = content.indexOf(boundaryStart);
  const endIndex = content.indexOf(boundaryEnd);

  if (startIndex !== -1 && endIndex !== -1) {
    const prefix = content.substring(0, startIndex + boundaryStart.length);
    const suffix = content.substring(endIndex);

    // Construct the new test results block
    const newBlock = `\nCommand executed:
\`\`\`bash
npx playwright test
\`\`\`

Output:
\`\`\`bash
${cleanOutput}
\`\`\`\n`;

    // Reassemble and write the file
    content = prefix + newBlock + suffix;
    fs.writeFileSync(agentProgressPath, content, 'utf8');
    console.log('✅ docs/AGENT_PROGRESS.md updated successfully.');
  } else {
    console.error('⚠️ Could not locate comment boundaries in docs/AGENT_PROGRESS.md');
  }
} else {
  console.error(`⚠️ Target file not found at: ${agentProgressPath}`);
}

/**
 * Synchronize documentation files to the active brain directory if it exists.
 * This is crucial for maintaining context for the agent in future interactions.
 */
if (fs.existsSync(brainDir)) {
  console.log('🔄 Synchronizing docs directory with active brain artifacts...');
  try {
    fs.copyFileSync(agentPath, path.join(brainDir, 'agent.md'));
    fs.copyFileSync(agentProgressPath, path.join(brainDir, 'agent_progress.md'));
    console.log('✅ Brain folder artifacts successfully synced.');
  } catch (err) {
    console.error('⚠️ Failed to sync to brain folder: ', err.message);
  }
}
