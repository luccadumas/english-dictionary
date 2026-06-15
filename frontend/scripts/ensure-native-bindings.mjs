import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { arch, platform } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const frontendRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

const PACKAGES = {
  'linux-x64': [
    '@parcel/watcher-linux-x64-glibc',
    '@swc/core-linux-x64-gnu',
    '@rollup/rollup-linux-x64-gnu',
    '@esbuild/linux-x64',
  ],
  'linux-arm64': [
    '@parcel/watcher-linux-arm64-glibc',
    '@swc/core-linux-arm64-gnu',
    '@rollup/rollup-linux-arm64-gnu',
    '@esbuild/linux-arm64',
  ],
  'darwin-x64': [
    '@parcel/watcher-darwin-x64',
    '@swc/core-darwin-x64',
    '@rollup/rollup-darwin-x64',
    '@esbuild/darwin-x64',
  ],
  'darwin-arm64': [
    '@parcel/watcher-darwin-arm64',
    '@swc/core-darwin-arm64',
    '@rollup/rollup-darwin-arm64',
    '@esbuild/darwin-arm64',
  ],
};

const packages = PACKAGES[`${platform()}-${arch()}`] ?? [];

for (const pkg of packages) {
  try {
    require.resolve(pkg);
  } catch {
    execSync(
      `npm install ${pkg} --no-save --legacy-peer-deps --ignore-scripts --workspaces=false`,
      {
        stdio: 'inherit',
        cwd: frontendRoot,
      },
    );
  }
}
