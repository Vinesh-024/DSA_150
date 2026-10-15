# CS Fundamentals: DBMS, Storage Engines & Indexing

## 1. Storage Engines & B+ Tree Architecture
Relational database management systems (PostgreSQL, MySQL InnoDB) organize table records on disk in fixed-size blocks (pages, typically 8KB to 16KB).

### Why B+ Trees over Binary Trees or Hash Tables?
1. **Disk I/O Optimization**: A typical node has a fan-out of 100 to 1,000 children. A 3-to-4 level B+ Tree can index billions of rows with only 3 to 4 disk page reads.
2. **Range Scans**: All data rows are strictly located in leaf nodes, and leaf nodes form a doubly linked list. Queries like `WHERE age BETWEEN 20 AND 30` only require one logarithmic search to find the start node, followed by sequential traversal along the leaf chain.
3. **Hash Indexes**: Offer $O(1)$ point lookups (`WHERE id = 5`), but are completely incapable of range filtering, prefix searches, or ordering.

## 2. Clustered vs Secondary (Non-Clustered) Indexes
- **Clustered Index**:
  - Dictates the physical ordering of records on disk.
  - Exactly one clustered index per table (typically the Primary Key).
  - The leaf nodes contain the actual data rows.
- **Secondary Index**:
  - Independent auxiliary B+ Tree.
  - The leaf nodes store the indexed key along with a pointer to the clustered index key (or physical tuple ID).
  - Queries accessing columns not covered by the secondary index trigger a **Bookmark Lookup / Key Lookup** back into the clustered index.

## 3. ACID Guarantees & Transaction Isolation Levels
- **Atomicity**: All operations commit or all rollback (WAL / Write-Ahead Logging).
- **Consistency**: The database transitions from one valid invariant state to another.
- **Isolation**: Concurrent transactions do not produce race conditions.
- **Durability**: Committed data survives system crashes and power failures.

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
| :--- | :--- | :--- | :--- |
| **Read Uncommitted** | Yes | Yes | Yes |
| **Read Committed** (Default PG) | No | Yes | Yes |
| **Repeatable Read** (Default MySQL) | No | No | Yes (No in InnoDB MVCC) |
| **Serializable** | No | No | No |

## 4. Interview Essentials
- **Q**: What causes an index scan instead of an index seek?
  **A**: Non-SARGable clauses (e.g. `WHERE YEAR(created_at) = 2026` or leading wildcards `LIKE '%term'`) force the query optimizer to scan all index pages because functions strip index ordering.
- **Q**: Why does adding too many indexes degrade write throughput?
  **A**: Every `INSERT`, `UPDATE`, and `DELETE` must synchronously write to and rebalance every secondary index tree, causing heavy disk random I/O.
