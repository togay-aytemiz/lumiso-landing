<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Connect the blog to Strapi Cloud

1. Create a Strapi API token with `read` access to your blog collection.
2. Copy the public URL of your Strapi project (for example `https://your-workspace.strapiapp.com`).
3. Create or update `.env.local` with:

```bash
VITE_STRAPI_URL=https://your-workspace.strapiapp.com
VITE_STRAPI_TOKEN=YOUR_PUBLIC_API_TOKEN
VITE_STRAPI_BLOG_COLLECTION=blog-posts
VITE_STRAPI_PUBLICATION_STATE=preview
```

4. Restart the dev server so Vite picks up the new environment variables. Set `VITE_STRAPI_PUBLICATION_STATE=live` to show only published entries.
