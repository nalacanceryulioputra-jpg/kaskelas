const { execFileSync } = require('node:child_process');

const output = execFileSync('netstat', ['-ano', '-p', 'tcp'], { encoding: 'utf8' });
const processIds = new Set();

for (const line of output.split(/\r?\n/)) {
  const match = line.match(/^\s*TCP\s+\S+:(3000|3001)\s+\S+\s+LISTENING\s+(\d+)\s*$/);
  if (match) processIds.add(match[2]);
}

for (const processId of processIds) {
  execFileSync('taskkill', ['/PID', processId, '/F'], { stdio: 'inherit' });
}

console.log(
  processIds.size
    ? `Stopped listener PID(s): ${[...processIds].join(', ')}`
    : 'No listeners found on ports 3000 or 3001.',
);
