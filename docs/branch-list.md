# Old branches: keep or delete (for Jacob)

Checked 2026-11-25 (thread 31) on a full clone (not shallow). This repo has 32 `claude/project-thread-*` branches besides `main`. **Nothing has been deleted.** Deleting a branch on GitHub can't be undone from here, so this list is for Jacob to decide.

## What was checked
- For each branch, whether its tip is the head of a pull request that was merged. For 31 of the 32 it is exactly that, so all of their work is on `main`.
- The remaining branch, `claude/project-thread-jmqrof`, has two commits after its last merged PR (#25). One is a merge and the other is the same change as #25, so the files are identical.
- What merging each branch into `main` would change now (`git merge-tree`). For `jmqrof` it is nothing. The earlier worry that it "would delete about 9k lines" came from a shallow clone and was wrong. For most others a merge would only conflict, because their work was squash-merged already. None holds work that is missing from `main`.

## The list
| Branch | Last merged PR | Advice |
|---|---|---|
| `claude/project-thread-3gs241` | #62 (freeze the first island test) | **Keep until after the debrief.** It holds commit 9bc0671, the exact build Jacob plays tomorrow. Main's 26744da has the same code. |
| `claude/project-thread-tn0mma` | #70 (this thread) | Keep while this thread is open, then delete. |
| `claude/project-thread-75qmya` | #68 (Solium Infernum council) | Delete once that thread is resolved. |
| `claude/project-thread-jmqrof` | #25 | Delete. Its two later commits add nothing. |
| The other 28: `0epek2`, `2fit8l`, `2lqmv9`, `31479m`, `3eatew`, `3tuv05`, `3xb1co`, `6kierc`, `9qmzdp`, `d6dqe7`, `dbaqp6`, `hnfcls`, `idrc7t`, `k180pw`, `kvzvw1`, `my9f3b`, `na3hxi`, `obv7kb`, `pi92am`, `ptz3dm`, `r1yckg`, `u50yfb`, `uf72up`, `uokpj3`, `v25d3b`, `vldezd`, `w2nsqe`, `xg636s` | each one's tip is a merged PR's head | Delete. Everything in them is on `main`. |

If Jacob says delete, he can do it on GitHub under Branches, or a thread with his go-ahead can do it.
