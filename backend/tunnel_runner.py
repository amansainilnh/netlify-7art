import subprocess
import sys
import re
import os
import time
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def run():
    print("=" * 65)
    print("  7 ART TAILORS - ZERO-PASSWORD WORLDWIDE SECURE TUNNEL")
    print("=" * 65)
    cmd = [
        "ssh",
        "-o", "StrictHostKeyChecking=no",
        "-o", "ServerAliveInterval=30",
        "-o", "TCPKeepAlive=yes",
        "-R", "80:127.0.0.1:5000",
        "nokey@localhost.run"
    ]
    while True:
        print("\n[*] Connecting to worldwide secure tunnel...")
        try:
            proc = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            for line in iter(proc.stdout.readline, ''):
                sys.stdout.write(line)
                sys.stdout.flush()
                if "admin.localhost.run" in line:
                    continue
                m = re.search(r'https://[a-zA-Z0-9-]+\.lhr\.(?:life|pro|rocks)', line)
                if not m and "https://" in line and "localhost.run" not in line:
                    m = re.search(r'https://[^\s<>"\'\)]+', line)
                if m:
                    url = m.group(0).rstrip('.')
                    if "admin.localhost.run" not in url and "localhost.run" not in url:
                        print("\n" + "=" * 65)
                        print(f"  >>> LIVE WORLDWIDE HTTPS URL: {url} <<<")
                        print("=" * 65 + "\n")
                        targets = [
                            os.path.join(BASE_DIR, "tunnel_url.txt"),
                            os.path.join(os.path.dirname(BASE_DIR), "tunnel_url.txt"),
                            os.path.join(BASE_DIR, "public", "tunnel_info.json")
                        ]
                        for path in targets:
                            try:
                                if path.endswith(".json"):
                                    with open(path, "w") as f:
                                        json.dump({"url": url, "status": "online", "time": time.time()}, f)
                                else:
                                    with open(path, "w") as f:
                                        f.write(url)
                            except Exception:
                                pass
            proc.wait()
        except Exception as e:
            print(f"[Tunnel Error] {e}")
        print("[*] Reconnecting in 5 seconds...")
        time.sleep(5)

if __name__ == "__main__":
    run()

