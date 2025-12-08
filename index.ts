console.log('Hello')
import concurrently from 'concurrently'
// run indext.ts fron root directory

concurrently([
  {
    name: 'server',
    command: 'bun run dev',
    cwd: 'packages/server',
    prefixColor: 'cyan',
  },
  {
    name: 'client',
    command: 'bun run dev',
    cwd: 'packages/client',
    prefixColor: 'green',
  },
])
