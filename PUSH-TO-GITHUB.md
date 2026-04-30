# Why the push failed & how to fix it

The push failed with **"No credentials are available"** — Windows doesn’t have your GitHub login saved for Git.

---

## Option A: Push from terminal (recommended)

### 1. Open a terminal in this folder
- In Cursor: **Terminal → New Terminal**
- Or: open PowerShell and run:
  ```powershell
  cd "c:\Users\Heba\Downloads\New folder (19)"
  ```

### 2. Push (this will ask for login)
```powershell
git push -u origin main
```

### 3. When Windows asks for credentials
- **Username:** your GitHub username (e.g. `trustroof901-svg`)
- **Password:** use a **Personal Access Token**, not your GitHub password  
  - Create one: https://github.com/settings/tokens  
  - Click **Generate new token (classic)**  
  - Name it (e.g. "landing push"), check **repo**, then generate  
  - Copy the token and paste it when Git asks for "password"

After the first successful push, Windows usually remembers the token.

---

## Option B: Use GitHub Desktop

1. Install **GitHub Desktop**: https://desktop.github.com/
2. **File → Add Local Repository** → choose `c:\Users\Heba\Downloads\New folder (19)`
3. Sign in to GitHub when it asks
4. Click **Push origin** to push to https://github.com/trustroof901-svg/landing

---

## Option C: Use GitHub’s “upload” (no Git needed)

If you only need the code on GitHub once:

1. Open https://github.com/trustroof901-svg/landing
2. Click **“uploading an existing file”** or **“Add file” → “Upload files”**
3. Drag and drop all project files (except `node_modules` and `.env.local`)
4. Commit

Then in Vercel you can **Import** this repo and deploy. For future updates, Option A or B is better.

---

## After the first successful push

- Your code will be at: https://github.com/trustroof901-svg/landing  
- Deploy: go to https://vercel.com → **Add New Project** → Import **trustroof901-svg/landing** → add env vars → Deploy
