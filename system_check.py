
import sys
import os
import requests
from core.config import settings

def check_system():
    print(">>> BRANDCRAFT PRO DIAGNOSTICS")
    
    # 1. Env Variables
    print(f"[1] API_KEY: {'LOADED' if settings.API_KEY else 'MISSING'}")
    
    # 2. Directory Checks
    dirs = [settings.STATIC_DIR, settings.LOG_DIR]
    for d in dirs:
        if not os.path.exists(d):
            print(f"[!] Warning: Directory {d} missing. Creating...")
            os.makedirs(d)
        else:
            print(f"[2] Directory {d}: OK")

    # 3. DB Check
    from database.connection import engine
    try:
        engine.connect()
        print("[3] Database Connectivity: OK")
    except Exception as e:
        print(f"[!] Database Connection Failed: {e}")

    # 4. Permissions
    try:
        with open(os.path.join(settings.LOG_DIR, "test.tmp"), "w") as f:
            f.write("test")
        os.remove(os.path.join(settings.LOG_DIR, "test.tmp"))
        print("[4] Write Permissions: OK")
    except:
        print("[!] Critical: No write permissions for logs/static")

    print(">>> DIAGNOSTICS COMPLETE")

if __name__ == "__main__":
    check_system()
