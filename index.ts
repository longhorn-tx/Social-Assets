import { config as loadEnv } from 'dotenv';
import { higgsfield, config } from '@higgsfield/client/v2';

loadEnv({ path: '.env.local', quiet: true });

const credentials = process.env.HF_CREDENTIALS;
if (!credentials) {
  console.error('HF_CREDENTIALS is not set. Add it to .env.local as key-id:key-secret.');
  process.exit(1);
}
config({ credentials });

async function main() {
  const jobSet = await higgsfield.subscribe('bytedance/seedance-2.5/text-to-video', {
    input: {
      prompt: 'A cinematic scene at sunset',
      duration: 5,
      resolution: '720p',
      aspect_ratio: '16:9',
    },
    withPolling: true,
  });

  if (jobSet.isNsfw) throw new Error('Request was rejected by content moderation.');
  if (jobSet.isFailed) throw new Error('Generation failed.');
  if (!jobSet.isCompleted) throw new Error('Generation did not complete (it may have been canceled).');

  const url = jobSet.jobs[0]?.results?.raw?.url;
  if (!url) throw new Error('Generation completed but no video URL was returned.');
  console.log('Video URL:', url);
}

main().catch((err) => {
  console.error('Error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
