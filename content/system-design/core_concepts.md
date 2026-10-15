# System Design: 10 Progressive Core Concepts

## 1. Domain Name System (DNS) & Anycast Routing
- **Hierarchical Resolution**: Root nameservers (`.`) → TLD servers (`.com`) → Authoritative nameservers (`example.com`).
- **Anycast BGP Routing**: Advertises the same public IP address from multiple geographically distributed datacenters, routing client packets to the nearest network hop.

## 2. Load Balancing (L4 vs L7)
- **Layer 4 (Transport / TCP / UDP)**: Routes packets based on IP address and port without inspecting application protocol payload (e.g., AWS NLB, Linux Virtual Server). Extreme throughput, zero SSL parsing.
- **Layer 7 (Application / HTTP / gRPC)**: Inspects HTTP headers, cookies, URL paths, and query parameters (e.g., Nginx, Envoy, AWS ALB). Supports path-based routing, header manipulation, and TLS termination.

## 3. Caching Strategies & Eviction Policies
- **Cache-Aside (Lazy Loading)**: Application queries cache first; on miss, reads database and writes back to cache. Tolerates cache node crashes.
- **Write-Through**: Application writes data to cache, and cache synchronously writes to database. Guarantees consistency at the cost of write latency.
- **Write-Back (Write-Behind)**: Writes directly to cache; asynchronous worker flushes batches to database. High write throughput, risk of data loss on cache crash.
- **Eviction Policies**: LRU (Least Recently Used), LFU (Least Frequently Used), ARC (Adaptive Replacement Cache).

## 4. Database Sharding & Partitioning
- **Vertical Partitioning**: Splitting distinct domain tables onto separate physical servers (e.g., Users DB vs Orders DB).
- **Horizontal Partitioning (Sharding)**: Splitting rows of the same table across multiple database nodes using a Shard Key.
- **Range-Based Sharding**: Partitions based on value range (e.g., IDs 1–1M on Node 1). Prone to uneven hotspots.
- **Hash-Based Sharding**: `node = hash(shard_key) % N`. Uniform distribution, but rehashing is costly when scaling cluster size.

## 5. Consistent Hashing & Virtual Nodes
- Maps nodes and keys onto a virtual 360-degree hash ring ($0$ to $2^{32} - 1$).
- A key is routed to the first node encountered moving clockwise.
- **Adding/Removing a Node**: Only reallocates $K/N$ keys on average, avoiding complete re-indexing.
- **Virtual Nodes (Vnodes)**: Assigns each physical server dozens of virtual tokens on the ring to prevent skew and hotspots.

## 6. CAP Theorem & PACELC
- **CAP**: Under Network Partition (P), a distributed system must choose between Consistency (C) and Availability (A).
- **PACELC Extension**: In a partition (P), choose A or C; Else (E), choose Latency (L) or Consistency (C). Example: DynamoDB is PA/EL; MongoDB is PC/EC.

## 7. Message Queues & Event-Driven Architecture
- **Decoupling & Load Leveling**: Buffers bursty traffic spikes so background workers process tasks at a steady rate.
- **Kafka vs RabbitMQ**:
  - RabbitMQ: AMQP broker, smart broker with push delivery, message deleted upon acknowledgement.
  - Kafka: Distributed append-only commit log, dumb broker with smart consumer pull, durable offset retention for replaying events.

## 8. Distributed Rate Limiting Algorithms
- **Token Bucket**: Tokens added at constant rate; each request consumes a token. Allows bursts up to bucket capacity.
- **Leaky Bucket**: Requests enter queue and leak out at a steady rate. Smooths out traffic spikes.
- **Sliding Window Counter**: Hybrid algorithm combining fixed window counters with weighted overlap to achieve zero race conditions and sub-millisecond memory footprint.

## 9. Replication & Consensus (Raft / Paxos)
- **Single-Leader Replication**: All writes go to Leader; asynchronous or synchronous replication to Read Replicas.
- **Consensus Protocols (Raft)**: Guarantees state machine replication across a quorum of $2F + 1$ nodes using leader election, log replication, and commit indices.

## 10. Distributed Unique ID Generation
- **UUID v4**: 128-bit random. Pros: Zero central coordination. Cons: Non-monotonic index fragmentation in B+ trees.
- **Twitter Snowflake**: 64-bit monotonically increasing IDs:
  - 1 bit unused
  - 41 bits timestamp (millisecond precision, 69-year lifespan)
  - 10 bits worker/datacenter ID
  - 12 bits sequence number (4,096 IDs per ms per worker)
