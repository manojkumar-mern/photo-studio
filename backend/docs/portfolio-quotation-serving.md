# Portfolio and Quotation Asset Serving Documentation

The Photo Studio backend is configured to serve static assets (such as portfolio and quotation PDF files) directly from the `backend/public` folder.

## Asset Directory Structure

Place your PDF assets inside the corresponding subdirectories within `backend/public/`:

```text
backend/
├── public/
│   ├── portfolios/
│   │   ├── general.pdf
│   │   ├── wedding-standard.pdf
│   │   ├── wedding-premium.pdf
│   │   └── ...
│   └── quotations/
│       ├── general.pdf
│       ├── wedding-standard.pdf
│       └── ...
```

## Public URL Configurations

By default, the assets will be accessible at:
- `http://localhost:5000/portfolios/general.pdf`
- `http://localhost:5000/quotations/general.pdf`

In production, these URLs should map to your Render or domain deployment. You can override specific asset mappings by setting the following environment variables in your `.env` file:

```ini
PORTFOLIO_WEDDING_STANDARD=https://photo-studio-1-7fjw.onrender.com/portfolios/wedding-standard.pdf
QUOTE_WEDDING_STANDARD=https://photo-studio-1-7fjw.onrender.com/quotations/wedding-standard.pdf
```

If these environment variables are not defined, the system resolves resources dynamically based on the patterns defined in `resources.config.js`.
