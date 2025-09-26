# Healthcare Compliance AI Reviewer

This is an AI-powered tool to analyze healthcare-related content (like marketing materials or user manuals) against industry regulations (FDA, HIPAA, FTC) to identify and correct compliance issues. It can also generate new, compliant content based on a prompt.

This project is built with React, TypeScript, and Google Gemini, and is designed to run entirely in the browser, making it easy to deploy as a static website.

## Features

- **Multiple Workflows**: Review existing content, generate new content, or generate and then immediately review content.
- **Selectable Standards**: Check content against FDA, HIPAA, or FTC guidelines.
- **Regional Context**: Tailors analysis and language style for USA, EU, JPAC, and Middle East regions.
- **File Uploads**: Supports `.txt`, `.docx`, and `.pdf` file uploads for analysis.
- **Dark Mode**: A sleek, user-friendly interface with a dark mode toggle.
- **Export Results**: Download the AI's analysis or generated content as `.docx`, `.pdf`, `.txt`, or `.json` files.
- **Zero Build-Step Deployment**: Uses Babel Standalone to transpile code in the browser, allowing for simple static hosting.

## How to Deploy on GitHub Pages

You can deploy this application for free using GitHub Pages.

### Step 1: Create a GitHub Repository

Create a new, public repository on your GitHub account.

### Step 2: Upload Files

Upload all the files from this project into your new repository. This includes:
- `index.html`
- `index.tsx`
- `metadata.json`
- `README.md`
- `.nojekyll` (this is an empty file, but it's important)
- The `components/` directory and all its contents.
- The `services/` directory and all its contents.
- The `types.ts` and `constants.ts` files.

### Step 3: Configure GitHub Pages

1. In your repository on GitHub, go to the **Settings** tab.
2. In the left sidebar, click on **Pages**.
3. Under the "Build and deployment" section, select the **Source** as **Deploy from a branch**.
4. Under "Branch", select `main` (or whichever branch you uploaded the files to) and `/ (root)` for the folder, then click **Save**.

### Step 4: Launch Your Website

GitHub will start a process to build and deploy your site. Wait a minute or two, and then refresh the GitHub Pages settings page. You will see a message saying "Your site is live at `https://<your-username>.github.io/<your-repository-name>/`".

Click the link to visit your live application!
