export function renderErrorPage(message?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Error — HeatSatAI</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: #0a0f1e;
        color: #e2e8f0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 1rem;
      }
      .card {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 2rem;
        max-width: 480px;
        text-align: center;
      }
      h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; }
      p { font-size: 0.875rem; color: #94a3b8; margin-bottom: 1.5rem; line-height: 1.6; }
      a {
        display: inline-block;
        background: #3b82f6;
        color: #fff;
        border-radius: 6px;
        padding: 0.5rem 1.25rem;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Something went wrong</h1>
      <p>${message ?? "An unexpected server error occurred. Please try refreshing the page."}</p>
      <a href="/">Go Home</a>
    </div>
  </body>
</html>`;
}
