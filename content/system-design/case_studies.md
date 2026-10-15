# System Design: 5 Production Case Studies

## 1. Rate Limiting Service at Scale (100k RPS)
### Requirements
- **Functional**: Limit requests per user/API-key according to tier (e.g. 100 req/min for free, 5000 req/min for enterprise). Return HTTP 429 Too Many Requests with `Retry-After` header when exceeded.
- **Non-Functional**: Low latency (<2ms overhead), high availability (fail-open vs fail-closed policy), distributed coordination.

### Architecture
- **Algorithm**: Redis Sorted Sets (`ZADD`, `ZREMRANGEBYSCORE`, `ZCARD`) for precise sliding windows, or Token Bucket via Redis Lua script for O(1) atomic token replenishment.
- **Atomic Lua Script**:
  ```lua
  local key = KEYS[1]
  local capacity = tonumber(ARGV[1])
  local refill_rate = tonumber(ARGV[2])
  local now = tonumber(ARGV[3])
  local requested = tonumber(ARGV[4])
  
  local data = redis.call("HMGET", key, "tokens", "last_update")
  local tokens = tonumber(data[1]) or capacity
  local last_update = tonumber(data[2]) or now
  
  -- Refill tokens
  local elapsed = math.max(0, now - last_update)
  tokens = math.min(capacity, tokens + elapsed * refill_rate)
  
  if tokens >= requested then
      tokens = tokens - requested
      redis.call("HMSET", key, "tokens", tokens, "last_update", now)
      return {1, tokens}
  else
      return {0, tokens}
  end
  ```
- **Resilience**: Client-side local token bucket cache for coarse filtering before hitting the centralized Redis cluster.

---

## 2. Distributed Unique ID Generator (Snowflake Architecture)
### Requirements
- 64-bit monotonically roughly time-ordered IDs, collision-free across multi-datacenter clusters, producing >100,000 IDs per second without database lock contention.

### 64-bit Bitwise Layout
```text
 1 bit  |  41 bits (Timestamp in ms)  | 10 bits (Worker ID) | 12 bits (Sequence)
 [Sign] | [Epoch offset: ~69 years]   | [1024 Nodes]        | [4096 IDs / ms / node]
```
- **Clock Drift Mitigation**: If `system_time < last_timestamp`, wait for clock to catch up or reject generation rather than producing backwards timestamps.

---

## 3. High-Throughput URL Shortener (TinyURL)
### Requirements
- Encode 100M new URLs per month; 10:1 Read to Write ratio.
- 7-character Base62 alphanumeric slugs (`[a-zA-Z0-9]`, $62^7 \approx 3.52 \text{ trillion}$ unique combinations).

### Architecture
- **Distributed Key Pre-Allocation**: Central ZooKeeper coordinator assigns contiguous token ranges (e.g. [1,000,000 to 2,000,000]) to individual web servers.
- **Base62 Encoding Function**: Convert 64-bit counter value into 7 characters without cryptographic collision or lock contention.
- **Cache Strategy**: Redis cluster with LRU eviction for the top 20% most accessed URLs, backed by Cassandra / DynamoDB key-value stores.

---

## 4. Real-time Notification Dispatcher
### Architecture
- Fan-out queueing using Kafka event streams partitioned by `user_id`.
- Worker consumer groups for APNs (Apple Push), FCM (Google Firebase Cloud Messaging), SMS (Twilio), and Email (SendGrid).
- Dead-letter queues (DLQ) with exponential backoff and jitter for transient provider downtime.

---

## 5. Global Video Streaming Metadata & Transcoding Pipeline (Netflix Scale)
### Architecture
- Master video uploaded to S3/Cloud Storage triggers event notifications to AWS Step Functions / Temporal orchestrator.
- Chunked parallel transcoding into multiple resolutions (4K, 1080p, 720p, 480p) and formats (H.264/AVC, H.265/HEVC, AV1) with dynamic bitrate ladders.
- Multi-CDN distribution (Cloudflare, Akamai, Fastly) with geo-DNS routing and origin shielding.
