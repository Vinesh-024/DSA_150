import React, { useState } from 'react';
import { Layers, Server, Database, ShieldAlert, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  scaleTarget: string;
  requirements: string[];
  architectureComponents: { name: string; role: string }[];
  bottlenecks: string[];
  dataModel: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'url-shortener',
    title: '1. URL Shortener (TinyURL)',
    scaleTarget: '100M URLs generated per month · 100:1 Read to Write ratio · 10B redirects / month',
    requirements: [
      'Given a long URL, generate a unique short 7-character alias.',
      'When user hits short URL, HTTP 301/302 redirect with < 50ms latency.',
      'High availability (99.99%) and low read latency are top priorities over strict consistency.'
    ],
    architectureComponents: [
      { name: 'API Gateway & Load Balancers', role: 'Round-robin traffic distribution with SSL termination.' },
      { name: 'Key Generation Service (KGS)', role: 'Pre-generates Base62 tokens (62^7 ≈ 3.5T keys) stored in token database to prevent collision.' },
      { name: 'Redis Distributed Cache', role: 'Caches the 20% most accessed URLs following the 80/20 rule, resolving 80% of reads.' },
      { name: 'NoSQL / Distributed Key-Value Store (Cassandra/DynamoDB)', role: 'Stores mapping of short_key -> long_url, user_id, created_at.' }
    ],
    bottlenecks: [
      'Hotspot keys: highly viral URLs cause severe cache server strain. Solution: local in-memory proxy cache.',
      'Write collision if multiple app nodes compute hashes simultaneously. Solution: Centralized Token Dispenser / KGS with range allocation.'
    ],
    dataModel: `Table: url_mapping
- short_key: VARCHAR(7) (PRIMARY KEY)
- long_url: VARCHAR(2048)
- user_id: VARCHAR(64)
- created_at: TIMESTAMP
- expires_at: TIMESTAMP`
  },
  {
    id: 'rate-limiter',
    title: '2. Distributed API Rate Limiter',
    scaleTarget: '500,000 requests / sec · Sub-millisecond decision latency · Minimal memory footprint',
    requirements: [
      'Limit client requests by IP or user ID (e.g. max 100 requests per minute).',
      'Return HTTP 429 Too Many Requests when quota exceeded.',
      'Accurate across distributed server clusters without cross-region race conditions.'
    ],
    architectureComponents: [
      { name: 'Client Edge Proxy / Envoy', role: 'Interprets request header, checks rate limit filter before forwarding to upstream services.' },
      { name: 'Redis with Lua Scripting', role: 'Executes atomic sliding window log or token bucket updates to prevent race conditions.' },
      { name: 'Token Bucket / Sliding Window Counter Algorithm', role: 'Tracks timestamps in Redis sorted sets (ZADD, ZREMRANGEBYSCORE, ZCARD).' }
    ],
    bottlenecks: [
      'Redis network roundtrip on every API request. Solution: Local node token batching (fetch 50 tokens at a time).',
      'Synchronization lag across multi-datacenter clusters. Solution: Eventual consistency with regional rate limits.'
    ],
    dataModel: `Redis Key Schema:
ratelimit:{client_id}:{minute_timestamp} -> counter (EXPIRE 120s)
Or ZSET: ratelimit:{client_id} -> members: [uuid], scores: [epoch_ms]`
  },
  {
    id: 'notification-service',
    title: '3. Scalable Notification System',
    scaleTarget: '10M notifications / day · Support Push (APNS/FCM), SMS (Twilio), and Email (SendGrid)',
    requirements: [
      'Reliable delivery of transactional and marketing notifications.',
      'User notification preference and rate-limiting controls.',
      'Idempotent delivery (prevent duplicate spam notifications).'
    ],
    architectureComponents: [
      { name: 'Notification API Servers', role: 'Authenticates requests and writes payloads to distributed message broker.' },
      { name: 'Apache Kafka / RabbitMQ Priority Queues', role: 'Decouples ingestion from third-party vendor delays (separate queues for SMS, Push, Email).' },
      { name: 'Notification Workers', role: 'Consumes jobs, pulls user template, checks rate limits, and sends to external vendor API.' },
      { name: 'Idempotency Cache (Redis)', role: 'Tracks deduplication hashes (hash(user_id + notification_type + date_bucket)).' }
    ],
    bottlenecks: [
      'Third-party provider rate limits and transient vendor outages. Solution: Exponential backoff retries with dead-letter queue (DLQ).',
      'Sudden mass notification campaigns (broadcast push). Solution: Separate high-priority transactional queue from bulk marketing queues.'
    ],
    dataModel: `Table: notifications
- id: UUID (PRIMARY KEY)
- user_id: UUID
- channel: ENUM('PUSH', 'SMS', 'EMAIL')
- status: ENUM('QUEUED', 'SENT', 'FAILED')
- idempotency_key: VARCHAR(128) UNIQUE
- created_at: TIMESTAMP`
  }
];

export const SystemDesignView: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy>(CASE_STUDIES[0]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 space-y-2">
        <h2 className="text-xl font-bold text-[#252A27] font-serif">
          System Design & Distributed Systems Curriculum
        </h2>
        <p className="text-xs text-[#565E59]">
          Real-world architectural breakdowns: requirements, capacity estimations, component topologies, and failure modes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Cases Sidebar (4 cols) */}
        <div className="md:col-span-4 bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold text-[#565E59] uppercase tracking-wider px-2 py-1">
            System Design Practice Cases
          </div>
          <div className="space-y-1.5">
            {CASE_STUDIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className={`w-full text-left p-3.5 rounded-xl transition-all ${
                  selectedCase.id === c.id
                    ? 'bg-[#526B58] text-white shadow-xs'
                    : 'bg-[#F6F3EC] text-[#252A27] hover:bg-[#E7E1D6]'
                }`}
              >
                <div className="text-xs font-bold line-clamp-1">
                  {c.title}
                </div>
                <div className={`text-[10px] mt-1 font-mono line-clamp-1 ${selectedCase.id === c.id ? 'text-[#A8B9A0]' : 'text-[#8A928B]'}`}>
                  {c.scaleTarget}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Case Study Details (8 cols) */}
        <div className="md:col-span-8 bg-[#FFFCF6] border border-[#E7E1D6] rounded-2xl p-6 space-y-6">
          <div className="space-y-2 border-b border-[#E7E1D6] pb-4">
            <h3 className="text-xl font-bold text-[#252A27] font-serif">
              {selectedCase.title}
            </h3>
            <div className="p-3 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl text-xs font-mono text-[#526B58]">
              <strong>Target Scale: </strong>{selectedCase.scaleTarget}
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#252A27] uppercase tracking-wider">
              Core Functional & Non-Functional Requirements
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-[#565E59]">
              {selectedCase.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Architecture Topology */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-[#252A27] uppercase tracking-wider">
              High-Level Component Architecture
            </div>
            <div className="space-y-2">
              {selectedCase.architectureComponents.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#F6F3EC] border border-[#E7E1D6] rounded-xl text-xs space-y-0.5"
                >
                  <div className="font-bold text-[#252A27] flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-[#526B58]" />
                    <span>{comp.name}</span>
                  </div>
                  <div className="text-[#565E59] pl-5">{comp.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Model */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#252A27] uppercase tracking-wider">
              Data Storage & Schema Design
            </div>
            <pre className="p-3.5 bg-[#1A1E1B] text-[#E2E8F0] rounded-xl text-xs font-mono leading-relaxed overflow-x-auto">
              {selectedCase.dataModel}
            </pre>
          </div>

          {/* Bottlenecks & Failure Modes */}
          <div className="p-4 bg-[#C98F79]/10 border border-[#C98F79]/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C98F79] uppercase tracking-wider font-mono">
              <ShieldAlert className="w-4 h-4" />
              <span>Bottlenecks & Single Points of Failure</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-[#565E59]">
              {selectedCase.bottlenecks.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
