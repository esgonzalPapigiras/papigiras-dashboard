const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const rx = require('rxjs');
const root = path.resolve(__dirname, '..');
let passed = 0;
const check = (name, fn) => { fn(); passed++; console.log('PASS', name); };
function load(file, dependencies = {}, globals = {}) {
  const output = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, experimentalDecorators: true, target: ts.ScriptTarget.ES2020 }
  }).outputText;
  const context = { exports: {}, Date, Number, String, Set, ArrayBuffer, console, ...globals,
    require: name => {
      if (name in dependencies) return dependencies[name];
      if (name === 'rxjs') return rx;
      if (name === '@angular/core') return { Injectable: () => v => v, Component: () => v => v, Input: () => () => {} };
      return {};
    }
  };
  vm.runInNewContext(output, context);
  return context.exports;
}
const model = load('src/app/models/internal-document.ts');
const uuid = '00000000-0000-0000-0000-000000000001';
const source = { id: uuid, tourId: 910001, category: 'GENERAL', name: 'Documento ficticio', originalName: 'prueba.pdf',
  storedName: 'documento_20261105_giraLAB.pdf', contentType: 'application/pdf', sizeBytes: 5, createdAt: '2026-11-05T15:00:00Z' };
check('metadata accepts a private document belonging to this tour', () => assert.equal(model.internalDocumentList([source], 910001)[0].id, uuid));
check('metadata rejects cross-tour records and duplicate IDs', () => {
  assert.throws(() => model.internalDocumentList([source], 910002));
  assert.throws(() => model.internalDocumentList([source, source], 910001));
});
check('metadata rejects path traversal, active content and files over10MiB', () => {
  for (const patch of [{ storedName: '../archivo.pdf' }, { storedName: 'archivo.html' }, { contentType: 'text/html' },
    { sizeBytes: model.INTERNAL_DOCUMENT_MAX_BYTES + 1 }, { sizeBytes: 0 }, { category: 'PUBLIC' }, { createdAt: 'sin fecha' }]) {
    assert.throws(() => model.internalDocumentList([{ ...source, ...patch }], 910001));
  }
});
check('voucher accepts written name without association and preserves legacy activity', () => {
  assert.equal(model.internalDocumentList([{ ...source, category: 'VOUCHER' }], 910001).length, 1);
  assert.equal(model.internalDocumentList([{ ...source, category: 'VOUCHER', activityId: null, activityName: null }], 910001).length, 1);
  for (const activityId of [0, -1, '910050', 1.5]) assert.throws(() => model.internalDocumentList([{ ...source, category: 'VOUCHER', activityId }], 910001));
  assert.equal(model.internalDocumentList([{ ...source, category: 'VOUCHER', activityId: 910050 }], 910001).length, 1);
});
check('invalid tour IDs never become a request', () => {
  for (const value of [null, undefined, '', 0, -1, 'demo', '1.5']) assert.throws(() => model.validInternalTourId(value));
});
class Headers { constructor(value) { this.value = value; } }
class Blob { constructor(parts, options) { this.parts = parts; this.type = options.type; this.size = parts.reduce((total, part) => total + part.byteLength, 0); } }
let transport;
const http = { get(url, options) { transport = { url, options, response: new rx.Subject() }; return transport.response; } };
const Service = load('src/app/services/internal-documents.service.ts', {
  '@angular/common/http': { HttpHeaders: Headers },
  '../../environments/environment': { environment: { apiUrl: 'http://127.0.0.1:8084' } },
  '../models/internal-document': model
}, { Blob, localStorage: { getItem: () => 'fixture-token' } }).InternalDocumentsService;
const service = new Service(http);
check('list uses authenticated private endpoint and the selected tour', () => {
  let result;
  service.list(910001).subscribe(value => result = value);
  assert.equal(transport.url, 'http://127.0.0.1:8084/app/services/internal-documents');
  assert.equal(transport.options.params.tourId, '910001');
  assert.equal(transport.options.headers.value.Authorization, 'fixture-token');
  transport.response.next([source]); assert.equal(result[0].id, uuid);
});
check('download uses UUID and verifies bytes before producing a Blob', () => {
  let result, error;
  service.download(910001, source).subscribe({ next: value => result = value, error: value => error = value });
  assert.equal(transport.url, 'http://127.0.0.1:8084/app/services/internal-documents/' + uuid);
  transport.response.next(new ArrayBuffer(4)); assert.ok(error); assert.equal(result, undefined);
  service.download(910001, source).subscribe(value => result = value);
  transport.response.next(new ArrayBuffer(5)); assert.equal(result.size, 5); assert.equal(result.type, 'application/pdf');
});
const saved = [];
const Component = load('src/app/tours/tour-internal-documents/tour-internal-documents.component.ts', {
  '../../models/internal-document': model, 'file-saver': { saveAs: (blob, name) => saved.push({ blob, name }) }
}).TourInternalDocumentsComponent;
let request, fileRequest;
const fake = { list() { request = new rx.Subject(); return request; }, download() { fileRequest = new rx.Subject(); return fileRequest; } };
check('initial error is distinct from an empty successful list', () => {
  const component = new Component(fake); component.tourId = 910001; component.ngOnChanges();
  request.error(new Error('payload que no debe mostrarse')); assert.ok(component.error); assert.equal(component.loaded, false);
  assert.ok(!component.error.includes('payload')); component.refresh(); request.next([]); assert.equal(component.loaded, true); assert.equal(component.error, ''); component.ngOnDestroy();
});
check('categories remain separate and failed refresh retains existing data', () => {
  const component = new Component(fake); component.tourId = 910001; component.ngOnChanges();
  request.next([source, { ...source, id: '00000000-0000-0000-0000-000000000002', category: 'VOUCHER', activityId: 910050 }]);
  assert.equal(component.visibleDocuments.length, 1); component.select('VOUCHER'); assert.equal(component.visibleDocuments[0].category, 'VOUCHER');
  component.refresh(); request.error(new Error('offline')); assert.equal(component.documents.length, 2); assert.ok(component.error); component.ngOnDestroy();
});
check('changing tour cancels stale replies and cannot show the previous list', () => {
  const component = new Component(fake); component.tourId = 910001; component.ngOnChanges(); const old = request;
  component.tourId = 910002; component.ngOnChanges(); old.next([source]); assert.equal(component.documents.length, 0); assert.equal(component.loaded, false); component.ngOnDestroy();
});
check('download is explicit, single and uses the server generated filename', () => {
  saved.length = 0;
  const component = new Component(fake); component.tourId = 910001; component.ngOnChanges(); request.next([source]);
  assert.equal(saved.length, 0); component.download(source); const pending = fileRequest; component.download(source); assert.equal(fileRequest, pending);
  pending.next(new Blob([new ArrayBuffer(5)], { type: 'application/pdf' })); assert.equal(saved.length, 1); assert.equal(saved[0].name, source.storedName); assert.equal(component.busy.size, 0); component.ngOnDestroy();
});
check('leaving the tour cancels pending downloads rather than saving old data', () => {
  saved.length = 0;
  const component = new Component(fake); component.tourId = 910001; component.ngOnChanges(); request.next([source]); component.download(source); const old = fileRequest;
  component.tourId = 910002; component.ngOnChanges(); old.next(new Blob([new ArrayBuffer(5)], { type: 'application/pdf' })); assert.equal(saved.length, 0); component.ngOnDestroy();
});
check('private section has no public visibility toggle or upload controls', () => {
  const template = fs.readFileSync(path.join(root, 'src/app/tours/tour-internal-documents/tour-internal-documents.component.html'), 'utf8');
  assert.ok(!/visibleToAll|toggleVisible|type="file"/.test(template));
  const existing = fs.readFileSync(path.join(root, 'src/app/tours/tour-download-document-modal/tour-download-document-modal.component.html'), 'utf8');
  assert.ok(existing.includes('toggleVisibleLocal(row)')); assert.ok(existing.includes('<app-tour-internal-documents'));
});
console.log(`Internal document rules and state: ${passed} checks passed.`);
