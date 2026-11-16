const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../src/app/lab/lab-network-policy.ts'), 'utf8');
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {}, URL };
vm.runInNewContext(output, context);
const allowed = context.exports.isAllowedLabRequest;
const app = 'http://127.0.0.1:4200';
const api = 'http://127.0.0.1:8084';
for (const url of ['/assets/logo.png', 'assets/fonts/font.woff2', `${api}/api/auth/login`, `${api}/app/services/last/positions`, `${app}/assets/logo.png`]) {
  assert.equal(allowed(url, app, api), true, `Expected allowed request: ${url}`);
}
for (const url of ['https://example.com/api', '//example.com/api', 'http://127.0.0.1:8085/api', 'http://localhost:8084/api', 'http://127.0.0.1:8084.example.com/api', 'http://127.0.0.1:8084@example.com/api', 'http://user:password@127.0.0.1:8084/api', 'https://127.0.0.1:8084/api', 'file:///tmp/a', 'data:text/plain,hello', 'javascript:alert(1)', 'http://[', 'ws://127.0.0.1:8084/api']) {
  assert.equal(allowed(url, app, api), false, `Expected blocked request: ${url}`);
}
assert.equal(allowed('/api', 'https://example.com', api), false, 'Public hosting must fail closed');
assert.equal(allowed('/api', app, 'https://example.com'), false, 'Changing configuration must fail closed');
console.log('LAB network policy: 20 isolation cases passed.');
