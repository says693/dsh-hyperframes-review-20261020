"""Verify the pinned npm tarball and the installed profile; read-only."""
import hashlib, json, os, sys, argparse

EXPECT = {
    '0.7.0': {
        'shasum': '6a0f779066fd640dff514007533a2a3942e06fe9',
        'integrity': 'sha512-xNs7A+gQW7G6peGOyozljKJg0daGvOffO4NQ4KoZevSX2LCN3p+GFS8h51hb4ifDXlsItK6LE+d3c4CNM/9zwA==',
        'fileCount': 936,
        'unpackedSize': 16541295,
    }
}

def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for block in iter(lambda: f.read(1 << 20), b''):
            h.update(block)
    return h.hexdigest()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--tarball', required=True)
    ap.add_argument('--profile-root', required=True)
    ap.add_argument('--version', default='0.7.0')
    a = ap.parse_args()
    want = EXPECT[a.version]
    out = {'version': a.version, 'expected': want}
    out['tarball_sha256'] = sha256(a.tarball)
    out['tarball_bytes'] = os.path.getsize(a.tarball)
    pkg = json.load(open(os.path.join(a.profile_root, 'node_modules/dsh-hyperframes/package.json'), encoding='utf-8'))
    out['installed_version'] = pkg.get('version')
    lib = os.path.join(a.profile_root, 'node_modules/dsh-hyperframes/lib/media-workbench.js')
    text = open(lib, encoding='utf-8').read()
    out['hardcoded_official_registry'] = '--registry=https://registry.npmjs.org' in text
    out['win_requires_headless_shell'] = 'chrome-headless-shell' in text
    ok = out['installed_version'] == a.version
    out['ok'] = ok
    print(json.dumps(out, ensure_ascii=False, indent=2))
    return 0 if ok else 1

if __name__ == '__main__':
    raise SystemExit(main())
