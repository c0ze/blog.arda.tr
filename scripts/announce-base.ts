#!/usr/bin/env node

/**
 * Picks the commit the announce scripts diff from (announceBase() in
 * lib/announce.ts) and writes it as the `before` step output (or prints it
 * when run outside GitHub Actions). It gathers the inputs with `gh`: the
 * push runs of deploy.yml on main, then the jobs of each earlier run,
 * newest first, until one shows a posting step that ran. Env: GH_TOKEN,
 * GITHUB_REPOSITORY, RUN_ID (this run), EVENT_BEFORE and AFTER_SHA (the
 * push). Any failed lookup exits non-zero, so the workflow skips the posting
 * steps and the next push retries the whole range. Posts nothing.
 */
import { appendFileSync } from 'fs';
import { execFileSync } from 'child_process';
import { announceBase, BASE_RUN_LIMIT } from './lib/announce.ts';

const after = process.env.AFTER_SHA ?? '';
const repo = process.env.GITHUB_REPOSITORY;
if (!repo) throw new Error('GITHUB_REPOSITORY is not set');
if (!/^\d+$/.test(process.env.RUN_ID ?? '')) throw new Error('RUN_ID is not set');
const currentRunId = Number(process.env.RUN_ID);

const gh = (args: string[]) => execFileSync('gh', args, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'inherit'] });

const runsJson = gh([
    'run', 'list', '--repo', repo, '--workflow', 'deploy.yml', '--branch', 'main', '--event', 'push',
    '--limit', String(BASE_RUN_LIMIT + 10), '--json', 'databaseId,headSha,createdAt',
]);

const base = announceBase({
    runsJson,
    currentRunId,
    eventBefore: process.env.EVENT_BEFORE ?? '',
    jobsOf: (id) => JSON.parse(gh(['api', `repos/${repo}/actions/runs/${id}/jobs?per_page=100`])).jobs,
    // exit 0: an ancestor; 1: not one; 128: an unknown commit (both false)
    isAncestor: (sha) => {
        try {
            execFileSync('git', ['merge-base', '--is-ancestor', sha, after], { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
});

if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `before=${base}\n`);
else console.log(base);
