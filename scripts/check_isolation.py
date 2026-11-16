from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess

root = Path(__file__).resolve().parents[1]
errors = []
for file in (root / 'src').rglob('*'):
    if file.is_file() and file.suffix in ['.ts', '.html', '.css', '.scss', '.js', '.json']:
        source = file.read_text(errors='replace')
        if ('.ondigitalocean.app' in source or '167.71.250.26' in source or
                re.search(r'AIza[0-9A-Za-z_-]{30,}', source) or
                re.search(r'eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+', source)):
            errors.append(f'Host o credencial heredada: {file.relative_to(root)}')

class CspParser(HTMLParser):
    policies = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'meta' and attrs.get('http-equiv', '').lower() == 'content-security-policy':
            self.policies.append(attrs.get('content', ''))

parser = CspParser()
parser.feed((root / 'src/index.html').read_text())
if len(parser.policies) != 1:
    errors.append('Debe existir exactamente una política CSP')
else:
    directives = dict((parts[0], set(parts[1:])) for part in parser.policies[0].split(';') if (parts := part.split()))
    expected = {
        'default-src': {"'self'"},
        'connect-src': {"'self'", 'http://127.0.0.1:8084', 'ws://127.0.0.1:4200'},
        'img-src': {"'self'", 'data:', 'blob:'},
        'font-src': {"'self'", 'data:'},
        'style-src': {"'self'", "'unsafe-inline'"},
        'script-src': {"'self'", "'unsafe-inline'"},
        'object-src': {"'none'"},
        'base-uri': {"'self'"},
        'form-action': {"'self'"},
    }
    if directives != expected:
        errors.append('La CSP debe mantener únicamente los destinos locales autorizados')

for name in ['environment.ts', 'environment.prod.ts']:
    source = (root / 'src/environments' / name).read_text()
    if (re.findall(r"apiUrl:\s*['\"]([^'\"]+)", source) != ['http://127.0.0.1:8084'] or
            not re.search(r'lab:\s*true', source) or not re.search(r'production:\s*false', source) or
            not re.search(r"googleMapsApiKey:\s*['\"]['\"]", source)):
        errors.append(f'Configuración aislada inválida: {name}')
for service in (root / 'src/app/services').glob('*.ts'):
    source = service.read_text()
    if 'HttpClient' in source and 'readonly url = environment.apiUrl;' not in source:
        errors.append(f'El servicio debe usar la API central: {service.name}')
    if re.search(r'https?://', source):
        errors.append(f'URL directa en servicio: {service.name}')
module = (root / 'src/app/app.module.ts').read_text()
if 'provide: HTTP_INTERCEPTORS, useClass: LabNetworkInterceptor, multi: true' not in module:
    errors.append('Falta el interceptor de aislamiento')
remotes = subprocess.run(['git', '-C', str(root), 'remote'], capture_output=True, text=True)
origin = subprocess.run(['git', '-C', str(root), 'remote', 'get-url', 'origin'], capture_output=True, text=True)
branch = subprocess.run(['git', '-C', str(root), 'branch', '--show-current'], capture_output=True, text=True)
review_remote = remotes.stdout.strip() == 'origin' and origin.stdout.strip() == 'https://github.com/esgonzalPapigiras/papigiras-dashboard.git' and branch.stdout.strip() == 'revision/pilo-2026-11-16'
if remotes.returncode != 0 or (remotes.stdout.strip() and not review_remote):
    errors.append('La copia LAB debe conservar su repositorio local sin remotos')
if errors:
    raise SystemExit('LAB BLOQUEADO:\n- ' + '\n- '.join(errors))
print('Plataforma LAB: configuración local, CSP, interceptor y ausencia de credenciales verificadas.')
