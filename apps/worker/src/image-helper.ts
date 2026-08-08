import http from 'http';
import https from 'https';

export interface ImagePart {
  inlineData: {
    mimeType: string;
    data: string; // Base64 encoded image string
  };
}

/**
 * Downloads an image from a URL and converts it to a Base64 InlineData object for Gemini.
 */
export async function fetchImageAsBase64(url: string): Promise<ImagePart | null> {
  if (!url || typeof url !== 'string') return null;

  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, { timeout: 10000 }, (res) => {
        if (res.statusCode !== 200) {
          console.warn(`Failed to fetch image from ${url}, status: ${res.statusCode}`);
          resolve(null);
          return;
        }

        const mimeType = res.headers['content-type'] || 'image/jpeg';
        const chunks: Buffer[] = [];

        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          // Limit image size to 8MB max for API stability
          if (buffer.length > 8 * 1024 * 1024) {
            console.warn(`Image from ${url} exceeds size limit (8MB)`);
            resolve(null);
            return;
          }
          resolve({
            inlineData: {
              mimeType: mimeType.split(';')[0] || 'image/jpeg',
              data: buffer.toString('base64'),
            },
          });
        });
        res.on('error', (err) => {
          console.warn(`Error reading image stream from ${url}:`, err.message);
          resolve(null);
        });
      });

      req.on('error', (err) => {
        console.warn(`Request error fetching image ${url}:`, err.message);
        resolve(null);
      });

      req.on('timeout', () => {
        req.destroy();
        console.warn(`Timeout fetching image from ${url}`);
        resolve(null);
      });
    } catch (err: any) {
      console.warn(`Exception fetching image from ${url}:`, err.message);
      resolve(null);
    }
  });
}
