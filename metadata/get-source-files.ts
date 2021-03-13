import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
const Bottleneck = require('bottleneck');

export interface DownloadSourceFilesConfig {
  outputFolder?: string;
  owner?: string;
  repo?: string;
  github_token?: string;
}

const defaults: DownloadSourceFilesConfig = {
  outputFolder: './metadata/build',
  owner: 'Dash-Industry-Forum',
  repo: 'dash.js',
};

const cacheFileName = 'DELETEMETORELOAD';

function rateLimitedClient(octokit: Octokit) {
  const limiter = new Bottleneck({
    minTime: 333, // Three requests per second
    reservoir: 5000, // inital limit of github api
    reservoirRefreshAmount: 5000,
    reservoirRefreshInterval: 60 * 1000,
  });
  const oldHandler = octokit.handler;
  octokit.handler = (msg, block, callback) => {
    limiter.submit(oldHandler.bind(octokit), msg, block, callback);
  };
  return octokit;
}

export async function downloadSourceFiles(config: DownloadSourceFilesConfig) {
  config = { ...defaults, ...config };

  if (fs.existsSync(cacheFileName)) {
    console.log(`Attention: You are using local files for generation. Delete "${cacheFileName}" to load the newest files from github. `);
    return;
  } else {
    fs.writeFileSync(cacheFileName, '');
  }

  const octokit = rateLimitedClient(
    new Octokit({
      auth: process.env.GITHUB_TOKEN,
    }),
  );
  octokit.rateLimit.get().then(rateLimit => console.info(rateLimit.data.rate));

  for await (const response of octokit.paginate.iterator(octokit.repos.listReleases, {
    owner: config.owner,
    repo: config.repo,
  })) {
    await Promise.all(
      response.data.map(async release => {
        console.info(release.tag_name);
        if (!fs.existsSync(config.outputFolder)) {
          fs.mkdirSync(config.outputFolder, { recursive: true });
        }
        const folder = `${config.outputFolder}/${release.tag_name}`;
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
        await fetchFile(config, octokit, release.tag_name, 'src/core/Settings.js', `${folder}/settings.js`);
        await fetchFile(config, octokit, release.tag_name, 'src/streaming/MediaPlayer.js', `${folder}/MediaPlayer.js`);
        await fetchFile(config, octokit, release.tag_name, 'index.d.ts', `${folder}/index.d.ts`);
      }),
    );
  }
  console.log('FINISHED DOWNLOAD');
  return await octokit.rateLimit.get().then(rateLimit => console.info(rateLimit.data.rate));
}

async function fetchFile(config: DownloadSourceFilesConfig, octokit: Octokit, ref: string, filepath: string, out: string) {
  return await octokit.repos
    .getContent({
      owner: config.owner,
      repo: config.repo,
      path: filepath,
      ref: ref,
    })
    .then(
      result => {
        const content = Buffer.from((result.data as any).content, 'base64').toString();
        fs.writeFileSync(out, content);
      },
      error => {
        console.warn(`${ref}: ${filepath} not found!`);
      },
    );
}
