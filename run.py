"""
7 ART TAILORS - PRODUCTION SERVER AUTO-LAUNCHER
Detects server.py across root, subfolders, or Render cloud paths.
"""
import os
import sys

def main():
    base = os.path.dirname(os.path.abspath(__file__))
    port = int(os.environ.get("PORT", 5000))
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])

    # Candidate paths for server.py
    candidates = [
        os.path.join(base, "backend", "server.py"),
        os.path.join(base, "7art_studio_suite", "backend", "server.py"),
        os.path.join(os.path.dirname(base), "backend", "server.py"),
        os.path.join(base, "server.py")
    ]

    target = None
    for c in candidates:
        if os.path.exists(c):
            target = c
            break

    if not target:
        # Fallback recursive search
        for root, dirs, files in os.walk(base):
            if "server.py" in files and "backend" in root:
                target = os.path.join(root, "server.py")
                break

    if not target:
        print("[Launcher Error] Could not find server.py in workspace!")
        print(f"Current base: {base}")
        print(f"Files found: {os.listdir(base)}")
        sys.exit(1)

    proj_root = os.path.dirname(os.path.dirname(target)) if os.path.basename(os.path.dirname(target)) == "backend" else os.path.dirname(target)
    if proj_root not in sys.path:
        sys.path.insert(0, proj_root)
    os.chdir(proj_root)

    print(f"[Launcher] Found server at: {target}")
    print(f"[Launcher] Running from project root: {proj_root} on port {port}")

    from backend.server import run_server
    run_server(port)

if __name__ == "__main__":
    main()

