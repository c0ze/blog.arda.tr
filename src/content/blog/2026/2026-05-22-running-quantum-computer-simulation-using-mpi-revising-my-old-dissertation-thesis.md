---
title: "running a quantum simulator on a cluster, 22 years later"
date: "2026-05-22"
excerpt: "I dug up my 2004 dissertation thesis on parallel quantum computer simulation, dusted it off, and finally wrote the library I always wanted to ship with it — plus two siblings in Go and Python."
tags: ["dev", "quantum", "mpi", "c", "go", "python", "dissertation"]
keywords: "quantum computer simulation, MPI, OpenMPI, state vector simulator, sparse gate, dissertation revision, Shor factoring, Grover, QFT, PyTorch quantum, goroutine quantum"
description: "Reviving a 2004 bachelor's dissertation on parallel quantum computer simulation: modernising the original C/LAM-MPI artifact, writing the sparse-gate library the paper always implied but never quite delivered, and porting it to Go and PyTorch as sibling implementations."
author: "Arda Karaduman"
image: "/images/2026-05-22-quantum-simulator-og.jpg"
draft: false
---

I was sifting through some old archives this week and tripped over my own bachelor's dissertation from 2004. *Quantum Computation: Implementation of Quantum Gates on Linux Clusters.* Twenty-two years old. LaTeX source, a PDF, a tar.bz2 of some C code, a LAM-MPI host file with a single line in it that just said `iridium` — the hostname of a Linux box I think I was the only person on the planet still pinging.

It was a novel concept for an undergrad project at the time, in the sense that "let's simulate a quantum computer on a Linux cluster" was not the kind of thing anyone in my year was doing. It was also, frankly, half-finished. I had ideas in the paper that I never had time, hardware, or experience to actually implement, and I knew it then — the conclusion literally says *"many functions to provide basic Quantum Computer operations (ie Quantum Fourier Transform) was unfinished."*

In 2026 I have a lot more of all three. So I decided to give the thing the love it deserved the first time around.

This ended up being three jobs stacked on top of each other:

1. Make the original paper and source code compile and render on a modern Mac or Linux box, without rewriting anything.
2. Rewrite the parts the paper describes but never delivered — a real state-vector simulator with QFT, Grover, and Shor — and revise the chapters to match.
3. Write two alternate implementations using parallelism models that didn't exist (or weren't accessible) in 2004: a Go version using goroutines, and a Python version that talks to PyTorch and uses your GPU when one is available.

The whole thing now lives at [github.com/c0ze/dissertation-thesis](https://github.com/c0ze/dissertation-thesis).

![A retro Linux workstation and modern GPU machine connected by glowing quantum state-vector amplitudes](/images/2026-05-22-quantum-simulator-og.webp)

## What the 2004 version actually was

The bundled `main()` in the original code is a single hardcoded demo: build an 8×8 dense Hadamard-cubed operator, broadcast a state vector for `|010⟩` to a few MPI ranks, partition the rows of the operator across workers, have each worker print its slice of the result.

This is a perfectly reasonable proof of concept for the *distribution strategy* the paper proposes. It is *not* a quantum simulator. There's no algorithm. There's no measurement. There's no way to chain a second gate. With certain rank counts the master never computes its own rows and the first few amplitudes are silently dropped. With non-power-of-two rank counts the workers post `MPI_Recv` against sends that never come, and the whole thing deadlocks.

The 2004 conclusion was honest about a lot of this. The thesis was less honest, in retrospect, about the strategy itself.

## The thing the 2004 paper got wrong about its own strategy

Here is the part that took me a while to admit to myself in 2026.

If you have an `n`-qubit register, the state vector is `2^n` complex numbers. At 16 bytes per amplitude that's `2^(n+4)` bytes. For `n = 25` it's 512 MB, large but tractable. For `n = 30` it's 16 GB, fine across a small cluster.

The operator matrix, on the other hand, is `2^n × 2^n`. That's `2^(2n)` complex entries, or `2^(2n+4)` bytes. For `n = 25`, that's about 16 PB. For `n = 30`, 16 EB. You can't store it. You can't distribute it. You can't bandwidth your way out of running out of memory, because there is no amount of bandwidth that helps when the per-node share is bigger than the per-node RAM.

The 2004 paper distributes *rows* of this operator across MPI nodes. The chosen primitive scales as `Θ(2^(2n))` in both memory and runtime per gate, which is exactly the asymptotic any useful simulator has to defeat. The dense matrix is the bottleneck. Parallelising it is parallelising the wrong thing.

The fix, which I now understand much better than I did in 2004, is to never materialise the operator at all. A single-qubit gate `U` acting on qubit `k` of an `n`-qubit register only touches two amplitudes per pair — the ones whose global indices differ in bit `k`. You don't need a `2^n × 2^n` matrix to express that. You need a tiny `2 × 2` matrix and a loop:

```c
void apply_single_qubit_gate(complex double *amp, int n,
                             complex double u[2][2], int k) {
    size_t stride = 1ULL << k;
    size_t step   = stride << 1;
    for (size_t base = 0; base < (1ULL << n); base += step) {
        for (size_t off = 0; off < stride; off++) {
            size_t i0 = base + off;          /* bit k = 0 */
            size_t i1 = i0 + stride;         /* bit k = 1 */
            complex double a0 = amp[i0];
            complex double a1 = amp[i1];
            amp[i0] = u[0][0]*a0 + u[0][1]*a1;
            amp[i1] = u[1][0]*a0 + u[1][1]*a1;
        }
    }
}
```

That's `Θ(2^n)`, not `Θ(2^(2n))`. The matrix never exists. This is the primitive that real state-vector simulators (QC-lib, QuEST, Intel-QS, Qiskit Aer) all converge on, for the same reason: you can't afford anything denser.

Distributing this across MPI ranks turns out to be straightforward. You give the top `log2(P)` bits of the global index to the rank ID; the remaining bits are the local offset within that rank. Gates on low qubits are entirely local — no communication. Gates on high qubits induce one pairwise `MPI_Sendrecv` with the partner rank whose index differs in that bit. Once amplitudes are exchanged, every rank again applies a local `2 × 2` multiplication. This pattern is well-known by now; it was not, to me, in 2004.

So the corrigendum in the revised paper says, in slightly more careful prose: the original chosen strategy was the wrong primitive, here is the right one, and here is what it looks like in code.

## Step 1: get the old stuff to build again

Before any of that, I had to get the 2004 source to build on a 2026 Mac. The original wrapper was a single `mpicc` line targeting LAM-MPI on a Linux box I no longer own. LAM-MPI is end-of-life. ISO C99 made the original code's "implicit function declaration" pattern an error rather than a warning. There was a `malloc` call without `#include <stdlib.h>`. There were 25 latent warnings that the 2004 compiler had quietly tolerated.

I deliberately *did not* fix any of the actual source code. The whole point of preserving the original is that it's the original. So instead I wrote a more careful build wrapper that turns the two unavoidable strictness errors back into warnings (`-Wno-implicit-function-declaration`, `-Wno-implicit-int`), a Makefile that refuses to launch with non-power-of-two `NP` so you get a clean error instead of a hung `mpirun`, and a `make check` target that asserts the per-rank amplitude output is what the analytical `H⊗H⊗H |010⟩` should be at NP=4.

The original 32-bit Linux ELF binary from 2004 is still in the repo, untouched. It will not run on modern macOS or modern 64-bit Linux without multilib gymnastics. That's not the point. The point is that the source compiles, the demo runs, the math is right on the rows it does compute, and the 25 warnings are catalogued honestly in the README so nobody has to wonder what's wrong with their box.

This is the boring half of the project. It's also the half that the average person attempting to "revive" 22-year-old academic code never quite finishes, because there's no glory in it.

## Step 2: the library that should have shipped in 2004

The new sparse-gate library lives at `implementation/c/`. C11, OpenMPI 5.x, no LAM in sight. The public surface is small:

- A `qreg` struct that owns a local slice of the distributed state vector and the MPI bookkeeping that says which slice this is.
- Single-qubit gates: `H`, `X`, `Y`, `Z`, `S`, `T`, phase, `Rx`, `Ry`, `Rz`. One workhorse `apply_u` that every named gate dispatches to.
- Controlled-`U`, `CNOT`, `CZ`, controlled phase, `SWAP`. One four-case dispatcher that handles every combination of local-vs-global control and target.
- Multi-controlled `Z` (used by Grover's diffusion) and multi-controlled `X` (generalised Toffoli, currently local-only — distributed version is on the future-work list).
- Measurement: single-qubit, full-register, and `sample_distribution` (snapshot-restore so the original state isn't mutated).
- QFT, with the bit-reversal swaps it actually needs; and its true inverse.
- Grover, with a user-supplied phase oracle.
- Shor, end to end: modular exponentiation as an in-place permutation (`MPI_Alltoallv` under the hood), period finding with continued-fraction recovery, factor extraction with the classical post-processing.

The Shor implementation in particular is where I leaned into a shortcut that the bundled libraries all share and that I make explicit in the revised §11: instead of unrolling modular exponentiation into an honest `O(n^3)` quantum-arithmetic circuit (Beauregard adders and friends), we treat `|x⟩|y⟩ → |x⟩|a^x · y mod N⟩` as a bulk permutation of the amplitude array, computed classically and applied via `torch.gather` / `MPI_Alltoallv` / a Go index-table. That gets you to about `3n+1` qubits for factoring an `n`-bit number, instead of the textbook `~5n`. Factoring `N=15` fits in 13 qubits in the bundled libraries (`n=4` target bits plus `t=9` counting bits). Factoring `N=21` fits in 16, which is the gated Shor-21 test you can run with `RUN_SHOR_21=1`.

The library is tested at NP = 1, 2, 4 on every push, and at NP up to 8 in a larger gated suite. 76 unique test cases per NP, so 228 invocations in the default loop. End-to-end Shor reliably factors 15 within 8 attempts at all tested rank counts. The full coverage matrix lives at `implementation/c/assessment.md` and maps every claim in the thesis (the chapters on QFT, Grover, Shor, the library API) to the file and line where it's implemented and tested.

## Step 3: doing it again in two more languages

Once the C version was up, I couldn't resist doing it twice more. Not because the world needs three quantum simulators — it doesn't — but because the parallelism story is genuinely different in each language, and writing the same library three times turned out to be a great way to interrogate the design.

**Go** ([`implementation/go/`](https://github.com/c0ze/dissertation-thesis/tree/main/implementation/go)) is the simplest of the three. State is shared memory; the parallel dispatcher spawns per-call goroutines and joins them with a `sync.WaitGroup`. No MPI, no partner ranks, no `Destroy()` because the GC handles it. The API is idiomatic Go — panic for programmer errors, `error` for construction, functional options for seed and worker count. Each method parallelises internally and is race-clean under `go test -race`; callers should not invoke methods concurrently on the same `Qreg`. Different `Qreg`s are independent. 75 tests pass without complaint.

The Go version caps at 26 qubits, not because of any shift-overflow concern but because a 26-qubit state vector is already 1 GiB of complex128 and the modular-exp permutation peaks at twice that. The C version goes up to 60 because its limit is a `1ULL << k` arithmetic ceiling, not an allocation ceiling. The Go cap is honest about what it actually fits in shared memory.

**Python + PyTorch** ([`implementation/python/`](https://github.com/c0ze/dissertation-thesis/tree/main/implementation/python)) is where things get more interesting. State is a flat `(2**n,)` complex tensor. Gates reshape into the `(2,) * n` view and `tensordot` the unitary against the target axis. No per-amplitude loops anywhere. The "parallel dispatch" is whatever PyTorch can reach: NVIDIA CUDA, AMD ROCm, Apple Metal / MPS, or CPU fallback. The simulator never sees the device. PyTorch dispatches.

This isn't quite the same as the C/MPI port. It can't span machines. But on a single box with a GPU it does things the MPI version can't, because the kernel scheduler is doing the work that pairwise `MPI_Sendrecv` does in the C version. On Apple Silicon, the device-parametrised tests run on both CPU and MPS. There's a dtype wrinkle — MPS doesn't have `float64`, so the Python register uses `complex64` on MPS and `complex128` everywhere else. The test suite has looser tolerances on MPS to match. Same algorithm, same answers, half the precision.

There's a satisfying symmetry once all three are up. The same `apply_modular_exp` operation is:

- C: `MPI_Alltoallv` of `(local_offset, amplitude)` pairs after a classical permutation
- Go: write into a freshly-allocated `[]complex128` since it's a permutation and writes never collide
- Python: a `torch.gather` against a CPU-built index tensor, then transfer to device

Three different parallelism models, one mathematical operation, three independent realisations that all factor 15 the same way.

This is adjacent to some of the GPU/compute themes from [made a web app to test edge ai](/blog/2026-04-23-made-a-web-app-to-test-edge-ai), but pointed in a very different direction. That was about whether a browser can run an LLM. This is about whether a 22-year-old algorithmic strategy can be retrofitted to a modern accelerator stack. The answer in both cases is "yes, with caveats."

## What actually scales

Honest numbers, on the machines I have at home:

- The C/MPI library runs the full default test suite (76 cases per NP across NP=1,2,4) in well under a second on Apple Silicon. The gated Shor-21 test, which is a 16-qubit period-finding circuit, finishes in tens of milliseconds. At NP=8 (with `--oversubscribe`) it stays under a second.
- The Go version's 75 tests pass under the race detector in about half a second. No GPU. No MPI. Honest goroutines on a single machine.
- The Python version's 416 tests pass in about half a second on the CPU device, and the MPS-parametrised subset runs in similar time. The dtype-tolerance plumbing is the only thing that has to be different.

A modern cluster — say, 64 nodes at 256 GiB RAM each — has 16 TiB of aggregate memory, which is exactly the size of a 40-qubit complex-double state vector. That's the kind of scale where the C/MPI port theoretically earns its keep. I cannot actually verify this from my apartment. The revised paper says so honestly: the raw aggregate fits, but there is no headroom for OS overhead, MPI buffers, the transient second slice that pairwise exchange allocates during a global-qubit gate, allocator slack, or any of the other things that turn theoretical fits into practical OOMs. Real 40-qubit runs require either fewer qubits, more memory per node, single precision, careful chunking, or out-of-core techniques.

The fundamental scaling story hasn't changed since 2004. The state vector grows as `2^n`. Every doubling in qubit count doubles your RAM. No clever distribution scheme rescues you from that. What's changed is that we no longer make it worse by an extra factor of `2^n` by materialising the operator.

## What this whole exercise actually says

Revisiting a 22-year-old project is a strange experience. It is not just looking at old code. It is looking at the things you knew you didn't understand at the time, and finding out that some of them are still hard, some of them are now easy, and a few of them you got more wrong than you thought.

The 2004 paper was honest enough to admit the implementation was incomplete. It was less honest about whether the chosen strategy could have *been* completed. Twenty years later I can finally write that part down: the dense-matrix approach was the wrong primitive, and no amount of effort on the parallelisation layer would have rescued it. The revised paper now says so explicitly, and the three new implementations are what it looks like when you do the sparse-gate version instead.

I also relied heavily on modern tooling for the revival. Most of the work — modernising the build, writing the new library three times, porting the test suite, drafting the corrigendum — happened in long iterative sessions with an AI coding assistant pair-programming alongside me. This is a kind of revival work that would have taken months as a side project in 2004 and that I would frankly never have finished as a one-person job in 2026 either, between everything else I have going on. The AI assistant did not invent the strategy or the math. It did make the difference between "I will get to this someday" and "this is done and in a repo with CI on it."

If you want to look around:

- The repo is at [github.com/c0ze/dissertation-thesis](https://github.com/c0ze/dissertation-thesis). It has the original 2004 paper PDF, the 2026 revised PDF, the original 2004 source verbatim, and the three new implementations.
- Each new implementation has its own README and assessment matrix mapping thesis claims to file and line. Start with [`implementation/c/`](https://github.com/c0ze/dissertation-thesis/tree/main/implementation/c) if you want the canonical sparse-gate MPI library, [`implementation/go/`](https://github.com/c0ze/dissertation-thesis/tree/main/implementation/go) if you want shared-memory goroutines, and [`implementation/python/`](https://github.com/c0ze/dissertation-thesis/tree/main/implementation/python) if you want PyTorch tensor ops with GPU offload.
- CI runs all three implementations on every push. The MPI port at NP=1,2,4 (and NP=8 in a larger job), the Go port with and without the race detector, the Python port under `ruff` + `mypy --strict` + pytest, and the Shor-21 gated test in all three.

This is the project I always meant to ship with the thesis. It just took 22 years.
