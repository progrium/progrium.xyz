---
title: The dotfs protocol for 9P
date: "2026-11-19"
status: draft
description: A family of progressive protocol extensions for 9P
---

Nov 19, 2026 · Jeff Lindsay, h.d.a.

## Summary

The dotfs protocol (9p-dotfs in full) is four small, independent extensions a 9P server can expose as synthetic files under `.fs/`. A server implements only the ones it needs, and a client discovers each one by whether its file exists.

| Extension | File | What it gives a client | Useful alone for |
| --- | --- | --- | --- |
| Index | `.fs/index` | the whole tree's metadata in one read | caching metadata of read-only trees, the `.h9index` use case |
| Events | `.fs/events` | a stream of changes after a sequence number | inotify-style watching of any mutable server |
| Path operations | `.fs/ctl` | `mv`, `rm`, `mkdir`, `cp`, and flag changes by path, optionally conditional on a version | quick operations without walk, open, and clunk sequences, and cross-directory rename on plain 9P2000 |
| Staged commit | `.fs/stage/` plus `commit` on ctl | resumable uploads published atomically if a path is still at an expected version | conflict-safe writes |

Together, index, events, path operations, and staged commit are enough to build a Dropbox-style synced folder, with one server ordering every change (the sync profile below), but nothing in the first three depends on sync.

The protocol works over any 9P transport. 9P2000.L over a WebSocket is the expected transport for browser clients, with authentication on the HTTP upgrade. This document is separate from hyper9's mount-index proposal and does not change it.

## Conventions

These rules apply to every extension.

**Location and scope**

- `.fs/` lives at the top of an attach root. A directory may carry its own `.fs/` (see nested indexes); everything in that `.fs/` is scoped to that directory's subtree.
- `.fs/` is synthetic. It is never listed in its own index, never reported in events, and cannot be removed or renamed.
- A server that implements none of the extensions has no `.fs/`. Clients must treat `Enotfound` on any `.fs/` file as "not supported" and fall back to plain 9P.

**Discovery**

A client walks to `.fs/` and reads the directory. Each extension is present if and only if its file is: `index`, `events`, `ctl`, `stage/`. `ctl` additionally answers `caps` with the commands it accepts, so a server can offer path operations without staged commit.

**Paths**

- Paths are absolute from the scope root and use `/`. The scope root itself is `/`.
- In every line format, bytes outside printable ASCII, space, `%`, and the newline are percent-escaped (`%20`). Every valid name can be listed, so there is no `!unindexed`.

**Versions and sequence numbers**

- A scope with events or staged commit has a **seq**: an unsigned 64-bit counter that increases by one on every change in the scope.
- A path's **version** is the seq of its last change; `0` means the path does not exist.
- A server with an index but no events (a read-only tree) may report version `0` for every path and a fixed seq.
- 9P qid.vers carries the low 32 bits of the version.

**Line formats**

Index lines, event records, and ctl commands are UTF-8 text, one record per line, fields separated by single spaces, unknown trailing fields ignored. A `-` stands for an empty field. Optional `key=value` fields may follow the positional ones.

**ctl exchange**

A client writes one command per `Twrite` to an open `ctl` fid, then reads the reply from the same fid before writing again. Replies start with `ok` or with an error word (`conflict`, `missing`, `denied`, `invalid`). Different fids are independent, so a client opens one ctl fid per concurrent operation.

**Errors**

Normal 9P errors (`Rerror` or `Rlerror`) report transport and permission failures. Protocol outcomes that a client acts on, such as a version conflict, are reply words on ctl rather than 9P errors.

## Extension 1: index

`.fs/index` is a read-only snapshot of every path in the scope at one seq, so a client can answer walks, stats, and directory reads without asking the server.

**Format**

```
fsindex 1 seq <N> [<encoding>]
<path> <type> <mode> <length> <mtime> <version> <hash> <flags> [<target>] [key=value...]
...
```

```
fsindex 1 seq 48211
/ d 0755 0 1763491200 48000 - -
/.config d 0755 0 1763491100 47950 - p
/.config/git/config f 0644 212 1763400000 31002 b3:5e1a… p
/Documents/Tax%202025.pdf f 0644 284113 1763480011 46990 b3:9f2c… -
/Photos d 0755 0 1763491000 48100 - i
/bin l 0777 7 1763000000 120 - - usr/bin
```

| Field | Meaning |
| --- | --- |
| path | escaped path from the scope root; lines sorted by path in byte order |
| type | `d` directory, `f` file, `l` symlink |
| mode | permission bits, octal |
| length | bytes; 0 for directories, target length for symlinks |
| mtime | seconds since the epoch |
| version | see Conventions; `0` allowed for read-only trees |
| hash | `<algo>:<hex>` content hash for files (`b3` is BLAKE3-256), or `-` |
| flags | `-`, or a set of letters: `p` prefetch, `i` nested index |
| target | symlink target, escaped, only for type `l` |

**Reading**

- The header line is always plain text. Before reading, a client may write `accept <encoding> [...]` to the index fid; the server then may name one of them as the header's last word and send the rest of the file in that encoding. `zstd` (one frame) is the only encoding defined. With no `accept`, the body is plain, so `cat .fs/index` works.
- The snapshot is consistent at seq N: every line reflects the scope after change N and before change N+1.
- qid.vers of `.fs/index` is the low 32 bits of N, and its qid.path is stable, so a client can tell from `Tstat` whether a cached copy is current.
- Length in `Tstat` may be 0 when the server generates the file on open.

**Nested indexes (flag `i`)**

A directory flagged `i` has its own `.fs/` with its own index (and, if the server supports them, its own events and ctl). The parent's index lists the directory itself but none of its children, and versions inside are scoped to it. Use it for very large or busy subtrees, or for a different server mounted under a path. A client reads a nested index the first time it needs anything inside.

**Prefetch (flag `p`)**

A hint that a client keeping a local copy should fetch the file's content right after reading the index. On a directory it covers everything below. It is advisory and shared by all clients; per-device pinning is a client matter.

**Read-only servers**

A server with only an index (like a package cache) may use version `0`, a fixed seq, and `-` for hashes and flags. That is exactly the role `/.h9index` plays today.

## Extension 2: events

`.fs/events` streams change records for the scope, so a client can watch a tree like inotify without polling, with or without an index.

**Opening a stream**

Each open fid is its own stream. Before the first read a client may write any of:

| Write | Effect |
| --- | --- |
| `since <N>` | start with the first change after seq N |
| `path <dir>` | only report changes at or below `<dir>` (repeatable) |
| `coalesce` | allow the server to merge consecutive changes to one path into the latest |

Without `since`, the first record is `seq <current>` and only later changes follow.

**Reading**

Each `Tread` returns one or more whole records and blocks while there are none. A pending read is the push channel; `Tflush` cancels it. A record never spans two reads.

**Records**

```
<seq> put <index line>
<seq> del <path> [key=value...]
<seq> mv <from> <to> [key=value...]
<seq> flags <path> <flags> [key=value...]
<seq> reset
```

```
48212 put /Notes/todo.md f 0644 830 1763491250 48212 b3:77d0… p dev=mac-a1
48213 del /Downloads/old.zip dev=linux-b2
48214 mv /Draft.md /Posts/Final.md dev=mac-a1
48215 flags /Projects p dev=mac-a1
```

- `put` is a create or modify and carries the whole index line, so a client never needs a follow-up stat.
- `mv` of a directory moves everything below it; there is no record per child.
- `dev=<id>` names the client that made the change, when known.
- Records arrive in seq order. With `coalesce` a client may see gaps in seq; without it there are none.

**Falling behind**

A server keeps a bounded log. If `since N` names a seq it no longer has, or a reader falls too far behind, the server sends `<seq> reset` and ends the stream; the client must re-read the index (or simply rescan) and reopen with `since`.

**Bootstrapping with an index**

Two gap-free ways: read the index at seq N, then open events with `since N`; or open events first (getting `seq <current>`), read the index at some M, and drop records at or below M.

## Extension 3: path operations

`ctl` performs namespace operations by path in one round trip, optionally conditional on a version. It needs no index or events, though a server with events reports every change it makes.

**Commands**

| Command | Effect | Replies |
| --- | --- | --- |
| `caps` | lists supported commands | `ok <command>...` |
| `hello <device-id>` | names this client in events (`dev=`) | `ok` |
| `mkdir <path> [<base>]` | creates a directory | `ok <version>`, `conflict <version>` |
| `rm <path> [<base>]` | removes a file, symlink, or empty directory | `ok <seq>`, `conflict <version>`, `missing` |
| `rmtree <path> [<base>]` | removes a directory and everything below it | `ok <seq>`, `conflict <version>`, `missing` |
| `mv <from> <to> [<base>] [<tobase>]` | renames, across directories, atomically | `ok <version>`, `conflict <version>`, `missing` |
| `cp <from> <to> [<tobase>]` | copies on the server; cheap when content is deduplicated | `ok <version>`, `conflict <version>`, `missing` |
| `flags <path> <flags>` | sets the index flags (`p`, `i`) | `ok <version>` |
| `stat <path>` | returns the path's index line | `ok <index line>`, `missing` |

**Conditional operations**

- `<base>` is the version the client expects `<path>` (or `<from>`) to have; `<tobase>` is the expected version of the destination, `0` meaning it must not exist.
- If a base is given and does not match, nothing changes and the reply is `conflict <current-version>`.
- Omitted bases make the operation unconditional, as with plain 9P.
- A server without versions (no events, no staged commit) rejects any base with `invalid`.

**Why this exists**

- 9P2000 `wstat` can only rename within one directory, so a cross-directory move otherwise means copy plus delete. 9P2000.L has `Trenameat`, but it is not conditional.
- Path operations need no walk, open, and clunk sequence, which matters over high-latency WebSockets.
- A conditional `rm` or `mv` lets a client act without racing another client's change.

## Extension 4: staged commit

Staged commit lets a client upload a file's bytes over any number of connections and attempts, then publish them atomically at a path only if that path is still at the version the client expects.

**Staging**

- A client creates a file under `.fs/stage/` with any name it chooses (a UUID is recommended) and writes bytes at any offsets. Re-opening an existing stage file and writing more resumes an interrupted upload.
- Stage files are private to the attaching user and invisible in the index and events.
- A server removes stage files that have not been written for a period it chooses, at least one hour.

**Publishing**

| Command | Effect | Replies |
| --- | --- | --- |
| `commit <stage> <path> <base> <mtime> <mode> [hash=<hash>]` | publishes the stage file at `<path>` if it is at `<base>`, then removes the stage file | `ok <version> <hash>`, `conflict <version>`, `invalid` |
| `commit-hash <hash> <path> <base> <mtime> <mode>` | publishes content the server already holds, with no upload | `ok <version>`, `conflict <version>`, `missing` |
| `abort <stage>` | discards a stage file | `ok` |

- `<base>` is required, `0` for a new path. There is no unconditional commit; plain 9P writes serve that role.
- With `hash=`, the server verifies the content and replies `invalid` on a mismatch.
- The publish is atomic: other clients see either the old content or the new, never a mix.
- `commit-hash` answers `missing` when the server lacks the content; the client then stages and commits normally. A server decides how widely it searches (one scope, or every scope of the same user); see Security considerations.

**Ordering guarantee**

On a server with events, the `put` record for a commit is assigned before the `ok` reply is sent, and the reply carries that version. A client therefore recognizes its own change in the stream by version, and never mistakes it for a remote edit.

**Plain writes**

A server with staged commit should still accept ordinary 9P writes. They apply as last-writer-wins when the fid is clunked and produce events like any other change.

## Profiles

A profile is a named set of extensions plus the behavior a client can expect. Servers state the profiles they meet; the reference implementation meets all three.

| Profile | Extensions | Typical server |
| --- | --- | --- |
| Read-only cache | index | package and image caches such as wanix-cache |
| Watchable | index (optional), events, path operations | a mutable file server that other tools watch |
| Sync | index, events, path operations, staged commit | a server holding user roots for synced folders |

### Sync, as a composition (non-normative)

A sync client keeps a local copy of a scope and needs nothing beyond the four extensions:

1. **Bootstrap:** `hello`, read the index with `accept zstd`, store every entry, then fetch content for `p` files not already held locally by hash.
2. **Follow:** open events `since <N>`. Apply `put`, `del`, `mv`, and `flags` to the local copy; a changed hash makes a local copy stale.
3. **Write:** remember the version a local edit started from. Publish with `commit` (or `commit-hash` first), and use conditional `rm` and `mv` for deletes and renames.
4. **Conflict:** on `conflict`, keep the server's copy at the path, rename the local copy to `name.sync-conflict-<YYYYMMDD-HHMMSS>-<device>.ext`, and commit it as a new file with base `0`. A delete that conflicts with an edit loses, so the edit stays.
5. **Offline:** queue changes with their base versions and replay them in order on reconnect.
6. **Reset:** on a `reset` record, re-read the index and reconcile.

Because the server assigns one version per path, this needs no version vectors, and every change reaches every connected client in one round trip. The first commit to arrive wins, which is deterministic and never loses the other side's work.

## Future extension: history (sketch)

A server that keeps old content and does not trim its log can expose past states with one more read-only extension, and no git-style checkout is needed: every seq already names a consistent state of the scope, so a past state can simply be served as a tree.

- **`.fs/at/<seq>/`** is a read-only view of the scope as it was right after change `<seq>`, with its own `.fs/index` at that seq. `.fs/at/<timestamp>/` (RFC 3339) resolves to the last seq at or before that time.
- **`history <path>` on ctl** lists a path's versions, newest first, as `<version> <mtime> <hash> <op> dev=<id>` lines.
- **Restore is an ordinary commit.** `cp /.fs/at/46990/Documents/Tax%202025.pdf /Documents/Tax%202025.pdf <base>` copies an old version over the current one with a base version, so it goes through conflict detection and reaches every client as a normal `put`. With content deduplicated by hash, the copy costs nothing.
- **Retention** is the server's policy (for example, every version for 30 days, then daily). `.fs/at/<seq>` answers `Enotfound` once a state is pruned.

Branches, merges, and per-client checkouts stay out of scope; the sketch only covers browsing and restoring the single line of history the server already orders. It needs nothing from the other extensions beyond what they define, so it can be added later without changing them.

## Security considerations

The protocol adds no authentication of its own; it relies on the transport and on 9P's per-attach identity, and adds a few concerns to handle.

- **Authentication.** Over WebSocket, authenticate on the HTTP upgrade (cookie or bearer token) and map that to the attach user. 9P `Tauth` is not used. Raw TCP transports should be limited to localhost or wrapped in TLS.
- **Scope.** Every `.fs/` file and command is limited to the attach root. Paths in ctl are resolved within the scope, and `..` never leaves it.
- **Hash probing.** `commit-hash` and `cp` reveal whether the server holds some content. A server must only consider content the attaching user can already read, so a user cannot learn about another user's files.
- **Metadata exposure.** The index exposes every name in the scope at once. A server must only serve indexes of scopes the user can fully read, or leave unreadable subtrees out.
- **Resource limits.** Servers should cap index size, the number of open event streams per user, stage space per user, and ctl command length, and return `denied` or a 9P error when a limit is hit.
- **Event retention.** The log reveals recent names, including of deleted files, to anyone who can read the scope; keep the retention window no longer than needed.

## Relation to mount-index

The index extension is a deliberate iteration on `/.h9index`, but the mount-index proposal stays unchanged until this is proven. If it is later folded in:

|  | `/.h9index` today | `.fs/index` |
| --- | --- | --- |
| Location | `/.h9index` at the root | `.fs/index`, alongside the other extensions |
| Names with spaces or non-UTF-8 | left out, directory marked `!unindexed` | percent-escaped, always listed |
| qid.vers of entries | 0 | the path's version, or 0 for read-only trees |
| Changes | regenerate the file | the events extension |
| Content identity | none | optional hash per file |
| Hints | none | `p` prefetch, `i` nested index |
| Encoding | plain text | plain, or zstd after an opt-in |

## Prior art

| System | What this borrows |
| --- | --- |
| Coda (CMU, from AFS) | disconnected operation: a log of local changes replayed with conflict detection |
| Plan 9 replica(1) | a database of paths plus a change log to bring a copy up to date |
| Upspin | `Watch(name, sequence)`, a change stream after a sequence number |
| Dropbox API v2 | snapshot with a cursor, deltas, and a long-poll to block; hash dedupe; resumable uploads |
| WebDAV sync-collection (RFC 6578), Nextcloud | sync tokens for deltas; `If-Match` compare-and-swap writes |
| Syncthing BEP | index and index updates keyed by sequence; conflict-copy naming |
| inotify, fanotify | event vocabulary for local watching |

These are from memory; links and checks against each system's documentation are still to add.

## Open questions

- [ ] Is one snapshot per scope fine at user-data scale (about 100 bytes a line, roughly 10 MB uncompressed for 100k files), with nested indexes only for large subtrees?
- [ ] Should events offer an index diff for a client slightly behind, or is `since N` always enough?
- [ ] Should ignore rules (temp files, `.DS_Store`) be part of the protocol, for example as a flag or a shared file, or left to clients?
- [ ] Is `hello` worth keeping, or should the device id come from the transport?
- [ ] Which hash algorithms are allowed besides BLAKE3, and is the hash ever required?
