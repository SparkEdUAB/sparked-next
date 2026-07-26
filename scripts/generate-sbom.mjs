import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const [root] = JSON.parse(
  execFileSync(pnpm, ['list', '--prod', '--depth', 'Infinity', '--json'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  }),
);

const components = new Map();
const dependencies = new Map();

function packageUrl(name, version) {
  return `pkg:npm/${encodeURIComponent(name).replace(/%2F/g, '/')}@${version}`;
}

function addPackage(name, node) {
  const ref = packageUrl(name, node.version);

  if (!components.has(ref)) {
    components.set(ref, {
      type: 'library',
      name,
      version: node.version,
      purl: ref,
    });
  }

  const childRefs = Object.entries(node.dependencies ?? {}).map(([childName, childNode]) => addPackage(childName, childNode));
  dependencies.set(ref, new Set([...(dependencies.get(ref) ?? []), ...childRefs]));
  return ref;
}

const rootRef = packageUrl(root.name, root.version);
const rootDependencies = Object.entries(root.dependencies ?? {}).map(([name, node]) => addPackage(name, node));
dependencies.set(rootRef, new Set(rootDependencies));

const bom = {
  bomFormat: 'CycloneDX',
  specVersion: '1.6',
  serialNumber: `urn:uuid:${crypto.randomUUID()}`,
  version: 1,
  metadata: {
    timestamp: new Date().toISOString(),
    component: {
      type: 'application',
      name: root.name,
      version: root.version,
      purl: rootRef,
    },
  },
  components: [...components.values()].sort((left, right) => left.purl.localeCompare(right.purl)),
  dependencies: [...dependencies.entries()]
    .map(([ref, dependsOn]) => ({ ref, dependsOn: [...dependsOn].sort() }))
    .sort((left, right) => left.ref.localeCompare(right.ref)),
};

writeFileSync('sbom.cdx.json', `${JSON.stringify(bom, null, 2)}\n`);
