# Append records to a JSON array written one record per line ("    {...},"), keeping the file's layout.
# Usage: python3 scripts/lib-append-json.py <file> <records.json>. Safe to rerun: a record whose id is already there is skipped.
import json, sys
path, recs = sys.argv[1], json.load(open(sys.argv[2]))
t = open(path).read()
have = set()
for line in t.splitlines():
    s = line.strip().rstrip(",")
    if s.startswith('{"id"'):
        try: have.add(json.loads(s)["id"])
        except Exception: pass
add = [r for r in recs if r["id"] not in have]
if add:
    i = t.rindex("}\n  ]")
    t = t[:i+1] + ",\n" + ",\n".join("    " + json.dumps(r, ensure_ascii=False) for r in add) + t[i+1:]
    open(path, "w").write(t)
json.load(open(path))
print(f"{path}: added {len(add)}")
