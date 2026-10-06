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
  const result = await higgsfield.subscribe('bytedance/seedance-2.5/text-to-video', {
    input: {
      prompt: 'A cinematic scene at sunset',
      duration: 5,
      resolution: '720p',
      aspect_ratio: '16:9',
    },
    withPolling: true,
  });

  const status: string = result.status;
  if (status !== 'completed') {
    const reason: Record<string, string> = {
      nsfw: 'rejected by content moderation',
      failed: 'generation failed',
      canceled: 'request was canceled',
      cancelled: 'request was canceled',
    };
    throw new Error(`Request ${result.request_id} did not succeed: ${reason[status] ?? `status "${status}"`}.`);
  }

  const url = result.video?.url;
  if (!url) throw new Error(`Request ${result.request_id} completed but returned no video URL.`);
  console.log('Video URL:', url);
}

main().catch((err) => {
  console.error('Error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
