import { baseService } from 'astro/assets';
import { spawnSync } from 'node:child_process';

const qualityTable: Record<string, number> = {
  low: 25,
  mid: 50,
  high: 80,
  max: 100
};

export default {
  getURL: baseService.getURL,
  parseURL: baseService.parseURL,
  getHTMLAttributes: baseService.getHTMLAttributes,
  getSrcSet: baseService.getSrcSet,
  validateOptions: baseService.validateOptions,

  async transform(inputBuffer: Uint8Array, transformOptions: any, config: any) {
    const transform = transformOptions;
    if (transform.format === 'svg') return { data: inputBuffer, format: 'svg' };

    const args = ['-', '-auto-orient'];

    let resizeStr = '';
    if (transform.width && transform.height) {
      if (transform.fit === 'cover') resizeStr = `${Math.round(transform.width)}x${Math.round(transform.height)}^`;
      else if (transform.fit === 'fill') resizeStr = `${Math.round(transform.width)}x${Math.round(transform.height)}!`;
      else resizeStr = `${Math.round(transform.width)}x${Math.round(transform.height)}`;
    } else if (transform.width) {
      resizeStr = `${Math.round(transform.width)}x`;
    } else if (transform.height) {
      resizeStr = `x${Math.round(transform.height)}`;
    }

    if (resizeStr) {
      args.push('-resize', resizeStr);
      if (transform.fit === 'cover' && transform.width && transform.height) {
         args.push('-gravity', 'center', '-crop', `${Math.round(transform.width)}x${Math.round(transform.height)}+0+0`, '+repage');
      }
    }

    if (transform.quality) {
      let quality = 80;
      const numQuality = parseInt(transform.quality, 10);
      if (!isNaN(numQuality)) {
        quality = numQuality;
      } else if (qualityTable[transform.quality]) {
        quality = qualityTable[transform.quality];
      }
      args.push('-quality', quality.toString());
    }

    const outFormat = transform.format || 'webp';
    args.push(`${outFormat}:-`);

    const child = spawnSync('magick', args, {
      input: inputBuffer,
      maxBuffer: 1024 * 1024 * 50
    });

    if (child.error) {
       throw child.error;
    }
    if (child.status !== 0) {
       throw new Error(`magick exited with code ${child.status}: ${child.stderr.toString()}`);
    }

    return {
      data: new Uint8Array(child.stdout),
      format: outFormat
    };
  }
};
