const dailyReportTemplate = ({
  logoBase64,
  location,
  date,
  morningInspector,
  eveningInspector,
  morningChecks,
  eveningChecks,
  completion,
}) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Daily Toilet Report - ${location}</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        margin: 0;
        padding: 40px 20px;
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: #f1f5f9;
        color: #0f172a;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .container {
        width: 900px;
        margin: 0 auto;
        background: white;
        padding: 48px;
        border-radius: 24px;
        box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.08);
        border: 1px solid #e2e8f0;
        position: relative;
        overflow: hidden;
      }

      /* Premium Top Caterpillar Decorative Stripe */
      .container::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 8px;
        background: linear-gradient(to right, #ffc72c 0%, #ffc72c 65%, #0f172a 65%, #0f172a 100%);
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #f1f5f9;
        padding-bottom: 24px;
        margin-bottom: 32px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .logo-icon {
        width: 90px;
        height: 42px;
        background: transparent;
        border-radius: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        box-shadow: none;
      }

      .brand-text {
        display: flex;
        flex-direction: column;
      }

      .company {
        font-size: 24px;
        font-weight: 850;
        letter-spacing: -0.03em;
        color: #0f172a;
        line-height: 1;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .cat-badge {
        background: #ffc72c;
        font-size: 10px;
        font-weight: 900;
        color: #0f172a;
        padding: 2px 6px;
        border-radius: 4px;
        letter-spacing: 0.05em;
        line-height: 1;
      }

      .division {
        font-size: 10px;
        font-weight: 700;
        color: #64748b;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        margin-top: 5px;
      }

      .doc-meta {
        text-align: right;
      }

      .doc-serial {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        font-weight: 700;
        color: #0f172a;
        background: #f8fafc;
        padding: 6px 12px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        display: inline-block;
      }

      .doc-label {
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0em;
        color: #94a3b8;
        text-transform: uppercase;
        margin-top: 6px;
      }

      /* Title block */
      .report-title-section {
        margin-bottom: 28px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }

      .title {
        font-size: 32px;
        font-weight: 850;
        color: #0f172a;
        letter-spacing: -0.03em;
        text-transform: uppercase;
        line-height: 1;
      }

      .subtitle {
        margin-top: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #64748b;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .status-pill-head {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        color: #166534;
        font-size: 11px;
        font-weight: 800;
        padding: 6px 14px;
        border-radius: 99px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .location-indicator {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ffc72c;
      }

      /* Two Column Info and Score section */
      .summary-layout {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 24px;
        margin-bottom: 36px;
      }

      .info-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 16px;
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 12px;
        border-bottom: 1px dashed #e2e8f0;
      }

      .info-row:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .info-label {
        font-size: 11px;
        font-weight: 700;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .info-value {
        font-size: 14px;
        font-weight: 700;
        color: #0f172a;
      }

      .completion {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: white;
        border-radius: 20px;
        padding: 24px;
        position: relative;
        overflow: hidden;
        border-left: 6px solid #ffc72c;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.15);
      }

      .completion::after {
        content: "";
        position: absolute;
        width: 130px;
        height: 130px;
        background: rgba(255, 199, 44, 0.04);
        border-radius: 50%;
        bottom: -30px;
        right: -30px;
        pointer-events: none;
      }

      .completion-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .completion-title {
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #94a3b8;
      }

      .completion-status-text {
        font-size: 9px;
        font-weight: 800;
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        padding: 2px 8px;
        border-radius: 99px;
        letter-spacing: 0.05em;
      }

      .completion-value {
        font-size: 44px;
        font-weight: 900;
        letter-spacing: -0.04em;
        line-height: 1;
        margin-top: 14px;
        display: flex;
        align-items: baseline;
      }

      .completion-value span {
        font-size: 20px;
        font-weight: 600;
        color: #94a3b8;
        margin-left: 2px;
      }

      .progress-container {
        margin-top: 14px;
      }

      .progress-bar-bg {
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 99px;
        overflow: hidden;
      }

      .progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #ffc72c 0%, #f59e0b 100%);
        border-radius: 99px;
      }

      /* Grid of Checklists */
      .section {
        margin-top: 36px;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #0f172a;
        padding-bottom: 8px;
        margin-bottom: 18px;
      }

      .section-title {
        font-size: 14px;
        font-weight: 900;
        text-transform: uppercase;
        color: #0f172a;
        letter-spacing: 0.08em;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .shift-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }

      .shift-dot.morning {
        background: #f59e0b;
        box-shadow: 0 0 8px #f59e0b;
      }

      .shift-dot.evening {
        background: #4f46e5;
        box-shadow: 0 0 8px #4f46e5;
      }

      .inspector-badge {
        font-size: 11px;
        font-weight: 700;
        color: #475569;
        background: #f1f5f9;
        padding: 4px 12px;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
      }

      .check-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 14px;
      }

      .check-item {
        background: white;
        border: 1.5px solid #e2e8f0;
        border-radius: 14px;
        padding: 18px 12px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 110px;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .check-item.success {
        border-color: #a7f3d0;
        background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%);
      }

      .check-item.danger {
        border-color: #fecaca;
        background: linear-gradient(180deg, #ffffff 0%, #fef2f2 100%);
      }

      .indicator-icon-wrap {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .check-item.success .indicator-icon-wrap {
        background: #d1fae5;
        color: #10b981;
      }

      .check-item.danger .indicator-icon-wrap {
        background: #fee2e2;
        color: #ef4444;
      }

      .check-label {
        font-size: 11px;
        font-weight: 800;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 8px;
      }

      .status-pill {
        font-size: 9px;
        font-weight: 900;
        padding: 2px 10px;
        border-radius: 99px;
        text-transform: uppercase;
        letter-spacing: 0.02em;
        margin-top: 6px;
      }

      .check-item.success .status-pill {
        background: rgba(16, 185, 129, 0.1);
        color: #059669;
      }

      .check-item.danger .status-pill {
        background: rgba(239, 68, 68, 0.1);
        color: #dc2626;
      }

      /* Verification stamp & Signatures */
      .sign-section {
        margin-top: 48px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
        align-items: flex-end;
        border-top: 1px dashed #e2e8f0;
        padding-top: 32px;
      }

      .sign-box {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 120px;
      }

      .sign-box.right {
        text-align: right;
        align-items: flex-end;
      }

      .sign-title {
        font-size: 11px;
        font-weight: 700;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .sign-name {
        font-size: 13px;
        font-weight: 800;
        color: #0f172a;
        border-bottom: 1px solid #0f172a;
        padding-bottom: 2px;
        display: inline-block;
        min-width: 160px;
      }

      .sign-role {
        font-size: 9px;
        font-weight: 700;
        color: #94a3b8;
        text-transform: uppercase;
        margin-top: 4px;
        letter-spacing: 0.05em;
      }

      .stamp-center {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .official-stamp {
        border: 2px solid rgba(245, 158, 11, 0.35);
        color: #d97706;
        font-family: 'JetBrains Mono', monospace;
        font-size: 8.5px;
        font-weight: 800;
        text-align: center;
        padding: 4px 12px;
        border-radius: 8px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        transform: rotate(-5deg);
        line-height: 1.3;
        background: rgba(245, 158, 11, 0.02);
      }

      .official-stamp span {
        font-size: 10px;
        font-weight: 900;
        color: #b45309;
      }

      .stamp-meta {
        font-size: 8px;
        font-weight: 600;
        color: #94a3b8;
        margin-top: 8px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      /* Modern footer */
      .footer {
        margin-top: 40px;
        text-align: center;
        font-size: 10px;
        font-weight: 600;
        color: #94a3b8;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }

      .footer::before, .footer::after {
        content: "";
        flex: 1;
        height: 1px;
        background: #e2e8f0;
      }

      .footer-sub {
        text-align: center;
        font-size: 10px;
        font-weight: 700;
        color: #64748b;
        margin-top: 6px;
      }

      @media print {
        body {
          background: white !important;
          padding: 0 !important;
        }
        .container {
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          width: 100% !important;
        }
      }
    </style>
  </head>
  <body>

    <div class="container">

      <header class="header">
        <div class="brand">
          <div class="logo-icon">
            <img
              src="${logoBase64}"
              alt="Trakindo Logo"
              style="
                width: 100%;
                height: 100%;
                object-fit: contain;
              "
            />
          </div>
          <div class="brand-text">
            <div class="company">
              TRAKINDO
              <span class="cat-badge">CAT</span>
            </div>
            <div class="division">
              Facility Management System
            </div>
          </div>
        </div>

        <div class="doc-meta">
          <span class="doc-serial">TRK-FM-DTR-2026</span>
          <div class="doc-label">Lembar Inspeksi Harian</div>
        </div>
      </header>

      <div class="report-title-section">
        <div>
          <h1 class="title">Daily Toilet Report</h1>
          <div class="subtitle">
            <span class="location-indicator"></span>
            <span>${location}</span>
          </div>
        </div>
        <div class="status-pill-head">
          ${completion === 100 ? "SEMPURNA" : "TERVERIFIKASI"}
        </div>
      </div>

      <div class="summary-layout">

        <div class="info-card">
          <div class="info-row">
            <span class="info-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Tanggal Inspeksi
            </span>
            <span class="info-value" style="font-family: 'JetBrains Mono', monospace;">${date}</span>
          </div>

          <div class="info-row">
            <span class="info-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a5 5 0 1 0 0 10 5 5 0 1 0 0-10z"></path><path d="M12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"></path></svg>
              Pemeriksa Pagi
            </span>
            <span class="info-value">${morningInspector || "-"}</span>
          </div>

          <div class="info-row">
            <span class="info-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              Pemeriksa Sore
            </span>
            <span class="info-value">${eveningInspector || "-"}</span>
          </div>
        </div>

        <div class="completion">
          <div class="completion-header">
            <div class="completion-title">DAILY COMPLETION RATE</div>
            <div class="completion-status-text">${completion === 100 ? "OPTIMAL" : "OK"}</div>
          </div>

          <div class="completion-value">
            ${completion}<span>%</span>
          </div>

          <div class="progress-container">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${completion}%;"></div>
            </div>
          </div>
        </div>

      </div>

      <div class="section">
        <div class="section-header">
          <div class="section-title">
            <span class="shift-dot morning"></span>
            Morning Shift (Inspeksi Pagi)
          </div>
          <div class="inspector-badge">Pemeriksa: ${morningInspector || "-"}</div>
        </div>

        <div class="check-grid">
          ${morningChecks
            .map(
              (item) => `
            <div class="check-item ${item.checked ? "success" : "danger"}">
              <div class="indicator-icon-wrap">
                ${
                  item.checked
                    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
                    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`
                }
              </div>

              <div class="check-label">
                ${item.label}
              </div>

              <div class="status-pill">
                ${item.checked ? "BERSIH" : "KOTOR / REFILL"}
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="section-title">
            <span class="shift-dot evening"></span>
            Evening Shift (Inspeksi Sore)
          </div>
          <div class="inspector-badge">Pemeriksa: ${eveningInspector || "-"}</div>
        </div>

        <div class="check-grid">
          ${eveningChecks
            .map(
              (item) => `
            <div class="check-item ${item.checked ? "success" : "danger"}">
              <div class="indicator-icon-wrap">
                ${
                  item.checked
                    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
                    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`
                }
              </div>

              <div class="check-label">
                ${item.label}
              </div>

              <div class="status-pill">
                ${item.checked ? "BERSIH" : "KOTOR / REFILL"}
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- Verification stamp & Signatures -->
      <div class="sign-section">
        <div class="sign-box">
          <span class="sign-title">Dibuat Oleh,</span>
          <div>
            <div class="sign-name">FAJAR SAPUTRO</div>
            <div class="sign-role">Facility Management Officer</div>
          </div>
        </div>

        <div class="stamp-center">
          <div class="official-stamp">
            APPROVED<br />
            <span>TRAKINDO</span><br />
            FACILITY DEPT
          </div>
          <div class="stamp-meta">Verified Digital CAT Audit</div>
        </div>

        <div class="sign-box right">
          <span class="sign-title">Disetujui Oleh,</span>
          <div>
            <div class="sign-name">SURYADI WIBOWO</div>
            <div class="sign-role">Building Operations Manager</div>
          </div>
        </div>
      </div>

      <div class="footer">
        FACILITY OPERATIONS DIGITAL AUDIT TRAIL
      </div>
      <div class="footer-sub">
        PT Trakindo Utama • Building Operations & Corporative Services Division
      </div>

    </div>

  </body>
  </html>
  `;
};

export default dailyReportTemplate;