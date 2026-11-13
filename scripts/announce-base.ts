#!/usr/bin/env node

/**
 * Picks the commit the announce scripts diff from (announceBase() in
 * lib/announce.ts) and writes it as the `before` step output (or prints it
 * when run outside GitHub Actions). The workflow step gathers the inputs:
 * RUNS_FILE holds `gh run list --json headSha,databaseId,createdAt` output
 * for successful pushes to main (missing or empty when the lookup failed),
 * RUN_ID is this run, EVENT_BEFORE and AFTER_SHA the push. Posts nothing.
 */
import { appendFileSync, readFileSync } from 'fs';
import { execFileSync } from 'child_process';
import { announceBase } from './lib/announce.ts';

const after = process.env.AFTER_SHA ?? '';

function readRuns(): string {
    try {
        return readFileSync(process.env.RUNS_FILE ?? '', 'utf-8');
    } catch {
        return '';
    }
}

const base = announceBase({
    runsJson: readRuns(),
    currentRunId: Number(process.env.RUN_ID),
    eventBefore: process.env.EVENT_BEFORE ?? '',
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
