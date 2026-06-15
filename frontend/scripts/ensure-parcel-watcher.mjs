import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { arch, platform } from 'node:os';

const require = createRequire(import.meta.url);

const PACKAGES = {
  'linux-x64': '@parcel/watcher-linux-x64-glibc',
  'linux-arm64': '@parcel/watcher-linux-arm64-glibc',
  'darwin-x64': '@parcel/watcher-darwin-x64',
  'darwin-arm64': '@parcel/watcher-darwin-arm64',
};

const pkg = PACKAGES[`${platform()}-${arch()}`];

if (!pkg) {
  process.exit(0);
}

try {
  require.resolve(pkg);
} catch {
  execSync(`npm install ${pkg} --no-save --legacy-peer-deps --ignore-scripts`, {
    stdio: 'inherit',
  });
}
