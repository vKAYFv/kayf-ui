import { defineConfig } from 'chromatic/config';

export default defineConfig({
  // Your project token (also set as GitHub secret CHROMATIC_PROJECT_TOKEN)
  // projectId is set automatically after first publish
  onlyChanged: true,       // TurboSnap — only test stories affected by code changes
  externals: ['*.svg', '*.png'],
  skip: 'dependabot/**',  // Skip Dependabot PRs
});
