# Expenses Logger - PWA

A simple, offline-first expenses logger built with vanilla JavaScript. Perfect for tracking daily expenses without needing internet or backend servers.

## Features ✨

- 📱 **PWA Ready** - Install as an app on any device (Android, iOS, Desktop)
- 🔌 **Fully Offline** - All data stored locally on your device using IndexedDB
- 💾 **No Backend** - Zero backend costs, runs entirely in your browser
- 🌓 **Light/Dark Mode** - Toggle between themes based on preference
- 📊 **Export to PDF** - Generate expense reports anytime
- 💰 **Budget Tracking** - Set budget and monitor spending in real-time
- ⚡ **Lightning Fast** - Minimal dependencies, vanilla JavaScript

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Storage**: IndexedDB (local device storage)
- **PWA**: Service Worker + Web Manifest
- **Export**: html2pdf library (CDN)
- **Hosting**: GitHub Pages (free)

## Installation & Setup

### Prerequisites
- Git
- GitHub account

### Local Development

1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/yourusername/expenses-logger.git
   cd expenses-logger
   ```

2. **Start a Local Server**
   Use any simple HTTP server. Examples:
   
   **Using Python 3:**
   ```bash
   python -m http.server 8000
   ```
   
   **Using Node.js (http-server):**
   ```bash
   npx http-server
   ```
   
   **Using VS Code Live Server:**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

3. **Open in Browser**
   - Navigate to `http://localhost:8000` (or the port shown)
   - The app will load and IndexedDB will initialize automatically

4. **Install as PWA**
   - **Desktop (Chrome/Edge)**: Click the install icon in the address bar
   - **Mobile**: Tap menu → "Add to Home Screen"

## Deploy to GitHub Pages

### Step 1: Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `expenses-logger`
3. Click "Create repository"

### Step 2: Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/expenses-logger.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to repository Settings
2. Scroll to "Pages" section
3. Under "Source", select `main` branch
4. Click "Save"
5. Your site will be published at `https://yourusername.github.io/expenses-logger/`

### Step 4: Access Your App
- Open `https://yourusername.github.io/expenses-logger/` in your browser
- Install as PWA using the browser's install prompt
- Enjoy offline expense tracking!

## File Structure

```
expenses-logger/
├── index.html           # Main HTML file
├── manifest.json        # PWA configuration
├── css/
│   └── styles.css       # Light/Dark mode styling
├── js/
│   ├── app.js           # Main application logic
│   ├── db.js            # IndexedDB wrapper
│   └── sw.js            # Service Worker
└── README.md            # This file
```

## How to Use

### 1. Set Budget
- Enter your budget amount in the "Budget" section
- Click "Set Budget"
- Your budget is saved locally

### 2. Log Expenses
- **Outing**: Name of the place/event (e.g., "Weekend trip", "Groceries")
- **Product/Item**: What you bought
- **Cost**: Amount spent
- Click "Add Expense"
- Expense is logged instantly

### 3. View Expenses
- All expenses appear below with:
  - Outing name
  - Item details
  - Cost
  - Date logged
- Grand total is calculated automatically
- Budget remaining shows how much you have left

### 4. Export Report
- Click "Export as PDF" button
- PDF downloads with all expenses, totals, and summary
- Perfect for sharing or record-keeping

### 5. Edit or Delete
- Click "Edit" to modify an expense
- Click "Delete" to remove an expense
- Changes sync immediately

### 6. Toggle Dark Mode
- Click the moon/sun icon in the header
- Theme preference is saved

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome/Edge | ✅ Full | Best experience |
| Firefox | ✅ Full | Excellent |
| Safari | ✅ Full | iOS 11.3+ |
| Samsung Internet | ✅ Full | Android phones |

## Storage & Privacy

- **All data stored locally** on your device
- **No cloud sync** - data never leaves your device
- **No tracking** - completely private
- **No accounts needed** - just use it
- Clear browser data = clear all expenses (be careful!)

## Tips & Tricks

1. **Backup Your Data**
   - Export to PDF regularly to keep records
   - Browser storage can be cleared if cache is deleted

2. **Multiple Budgets**
   - Create separate bookmarks for different budgets
   - Each browser profile keeps separate data

3. **Keyboard Shortcuts**
   - Press `Enter` to add expense quickly
   - Press `Enter` in budget field to set budget

4. **Performance**
   - Works smoothly even with 1000+ expenses
   - IndexedDB is optimized for local storage

## Troubleshooting

### App not saving data?
- Check browser's IndexedDB support (modern browsers all support it)
- Try opening in incognito mode
- Clear browser cache and refresh

### PWA not installing?
- Use Chrome, Edge, or Firefox
- Must be served over HTTPS (GitHub Pages provides this)
- Wait for "Install" prompt to appear

### Expenses disappearing?
- **Don't clear browser data** - it deletes IndexedDB storage
- Each browser/device has separate storage
- Export PDFs as backup

### Dark mode not working?
- Refresh the page
- Clear localStorage: Open DevTools → Console → `localStorage.clear()`

## Development

### To add features:
1. Edit `js/app.js` for logic
2. Edit `css/styles.css` for styling
3. Edit `index.html` for HTML structure
4. Commit and push to GitHub
5. Changes deploy automatically to GitHub Pages

### To update Service Worker:
- Increment version in `CACHE_NAME` in `js/sw.js`
- This forces browsers to update the cache

## License

Free to use and modify for personal use.

## Contributing

Found a bug? Have a suggestion?
- Open an issue on GitHub
- Submit a pull request

## Support

For issues or questions:
- Check GitHub Issues
- Review this README
- Test in an incognito window first

---

**Enjoy tracking your expenses! 💰**

Happy budgeting! 🎯