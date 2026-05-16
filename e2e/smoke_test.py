import os
import sys
from datetime import datetime, timezone
from playwright.sync_api import sync_playwright


def _now_slug() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")


def main() -> int:
    base_url = os.environ.get("BASE_URL", "http://localhost:3000").rstrip("/")
    out_dir = os.environ.get("OUT_DIR", "/workspace/test-artifacts").rstrip("/")
    run_id = os.environ.get("RUN_ID", _now_slug())

    os.makedirs(out_dir, exist_ok=True)

    console_errors: list[str] = []
    page_errors: list[str] = []

    def expect(condition: bool, message: str) -> None:
        if not condition:
            raise AssertionError(message)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.on("console", lambda msg: console_errors.append(f"{msg.type}: {msg.text}") if msg.type in {"error"} else None)
        page.on("pageerror", lambda err: page_errors.append(str(err)))

        page.goto(f"{base_url}/", wait_until="domcontentloaded")
        try:
            page.wait_for_load_state("networkidle", timeout=5000)
        except Exception:
            pass
        page.wait_for_timeout(500)
        expect("/login" in page.url, f"Expected redirect to /login when unauthenticated. Got url={page.url}")

        page.get_by_text("غيابي - Ghiyabi").wait_for()
        page.locator("#email").wait_for()
        page.locator("#password").wait_for()
        page.get_by_role("button", name="الدخول السريع عبر حساب جوجل").wait_for()
        page.get_by_role("button", name="تسجيل الدخول").wait_for()

        page.screenshot(path=f"{out_dir}/login_{run_id}.png", full_page=True)

        page.get_by_role("button", name="نسيت كلمة المرور؟").click()
        page.locator("#resetEmail").wait_for()
        page.screenshot(path=f"{out_dir}/reset_dialog_{run_id}.png", full_page=True)
        page.get_by_role("button", name="إلغاء").click()

        for route in ["/attendance", "/students", "/classes", "/staff", "/logs", "/reports"]:
            page.goto(f"{base_url}{route}", wait_until="domcontentloaded")
            try:
                page.wait_for_load_state("networkidle", timeout=5000)
            except Exception:
                pass
            page.wait_for_timeout(250)
            expect("/login" in page.url, f"Expected {route} to redirect to /login when unauthenticated. Got url={page.url}")

        context.close()
        browser.close()

    if page_errors or console_errors:
        print("Detected browser errors:", file=sys.stderr)
        for err in page_errors:
            print(f"pageerror: {err}", file=sys.stderr)
        for err in console_errors:
            print(err, file=sys.stderr)
        return 2

    print(f"OK: Smoke checks passed. Screenshots in {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
