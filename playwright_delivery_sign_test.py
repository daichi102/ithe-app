from pathlib import Path

from playwright.sync_api import expect, sync_playwright


BASE_URL = "http://127.0.0.1:8000/"
CASE_ID = "AIZA-TEST-001"
SCREENSHOT = Path("playwright-delivery-sign-result.png")
VIDEO_DIR = Path("playwright-videos")


def inject_click_indicator(page):
    page.evaluate(
        """
        () => {
          const style = document.createElement("style");
          style.textContent = `
            .pw-click-ring {
              position: fixed;
              width: 44px;
              height: 44px;
              margin: -22px 0 0 -22px;
              border: 4px solid #ef4444;
              border-radius: 999px;
              background: rgba(239, 68, 68, 0.18);
              pointer-events: none;
              z-index: 2147483647;
              animation: pw-click-pulse 1.1s ease-out forwards;
            }

            .pw-click-label {
              position: fixed;
              margin: 22px 0 0 14px;
              padding: 4px 8px;
              border-radius: 999px;
              background: #ef4444;
              color: #fff;
              font: 800 12px system-ui, sans-serif;
              pointer-events: none;
              z-index: 2147483647;
              animation: pw-click-label 1.1s ease-out forwards;
            }

            @keyframes pw-click-pulse {
              0% { opacity: 1; transform: scale(0.55); }
              60% { opacity: 1; transform: scale(1.25); }
              100% { opacity: 0; transform: scale(1.45); }
            }

            @keyframes pw-click-label {
              0%, 70% { opacity: 1; }
              100% { opacity: 0; }
            }
          `;
          document.head.appendChild(style);
          window.addEventListener("pointerdown", (event) => {
            const ring = document.createElement("div");
            ring.className = "pw-click-ring";
            ring.style.left = `${event.clientX}px`;
            ring.style.top = `${event.clientY}px`;
            const label = document.createElement("div");
            label.className = "pw-click-label";
            label.textContent = "CLICK";
            label.style.left = `${event.clientX}px`;
            label.style.top = `${event.clientY}px`;
            document.body.append(ring, label);
            setTimeout(() => {
              ring.remove();
              label.remove();
            }, 1200);
          }, true);
        }
        """
    )


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, slow_mo=500)
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            record_video_dir=str(VIDEO_DIR),
            record_video_size={"width": 1440, "height": 900},
        )
        page = context.new_page()
        page.goto(BASE_URL)
        page.wait_for_load_state("networkidle")
        inject_click_indicator(page)
        page.wait_for_timeout(1000)

        page.get_by_role("button", name="ログイン").click()
        expect(page.get_by_role("heading", name="ダッシュボード")).to_be_visible()
        page.wait_for_timeout(1200)

        page.locator('[data-view="deliveryCases"]').click()
        expect(page.locator("#pageTitle")).to_have_text("配送案件一覧")
        page.wait_for_timeout(1200)

        row = page.locator("tr", has_text=CASE_ID)
        expect(row).to_be_visible()
        row.scroll_into_view_if_needed()
        page.wait_for_timeout(1000)
        expect(row).to_contain_text("取り込み済み")
        row.get_by_role("button", name="案件確定").click()
        expect(row).to_contain_text("作業確定")
        page.wait_for_timeout(1000)

        row.get_by_role("button", name="作業開始").click()
        expect(row).to_contain_text("作業中")
        page.wait_for_timeout(1000)

        row.get_by_role("button", name="チェック表").click()

        expect(page.get_by_role("heading", name="配送 作業確認チェック表")).to_be_visible()
        expect(page.locator("#deliveryChecklistForm #checklistCaseSelect")).to_have_value(CASE_ID)
        page.wait_for_timeout(1200)

        canvas = page.locator("#deliveryChecklistForm #signaturePad")
        canvas.scroll_into_view_if_needed()
        page.wait_for_timeout(2000)
        box = canvas.bounding_box()
        if not box:
            raise AssertionError("signature canvas was not visible")
        page.mouse.move(box["x"] + 35, box["y"] + 95, steps=20)
        page.wait_for_timeout(400)
        page.mouse.down()
        page.mouse.move(box["x"] + 115, box["y"] + 45, steps=28)
        page.mouse.move(box["x"] + 205, box["y"] + 130, steps=28)
        page.mouse.move(box["x"] + 305, box["y"] + 55, steps=28)
        page.mouse.move(box["x"] + 380, box["y"] + 110, steps=28)
        page.mouse.up()
        page.wait_for_timeout(2500)

        page.locator("#deliveryChecklistForm #lockSignature").click()
        expect(page.locator("#checklistSaveStatus")).to_contain_text("保存済")
        expect(page.get_by_text("サインを保存しました。")).to_be_visible()
        page.wait_for_timeout(1000)

        page.get_by_role("button", name="はい").click()
        expect(page.locator("#pageTitle")).to_have_text("作業完了報告書")
        expect(page.locator("#reportQueue")).to_contain_text(CASE_ID)
        expect(page.locator("#reportCaseId")).to_have_value(CASE_ID)
        expect(page.locator("#reportQueue")).to_contain_text("完了報告書作成")
        page.wait_for_timeout(1200)

        page.locator("#salesSyncButton").click()
        expect(page.locator("#salesSyncStatus")).to_contain_text("連携できました")
        expect(page.locator("#reportQueue")).not_to_contain_text(CASE_ID)
        page.locator('[data-view="deliveryCases"]').click()
        expect(page.locator("tr", has_text=CASE_ID)).to_contain_text("連携済み")
        page.wait_for_timeout(2500)

        page.screenshot(path=str(SCREENSHOT), full_page=True)
        video = page.video
        context.close()
        video_path = video.path() if video else ""
        browser.close()

        print(f"PASS case={CASE_ID} screenshot={SCREENSHOT} video={video_path}")


if __name__ == "__main__":
    main()
