# CS Fundamentals: Computer Networks & Protocols

## 1. The OSI & TCP/IP Model Layers
- **Application Layer (Layer 7)**: HTTP/1.1, HTTP/2, HTTP/3 (QUIC), WebSocket, gRPC (HTTP/2 framing with Protobuf), DNS, TLS.
- **Transport Layer (Layer 4)**: 
  - **TCP**: Connection-oriented, 3-way handshake (SYN, SYN-ACK, ACK), reliable delivery via sequence numbers, selective ACKs (SACK), flow control (sliding window), and congestion control (Slow Start, Congestion Avoidance, Fast Retransmit/Recovery).
  - **UDP**: Connectionless, minimal overhead, unverified delivery, low latency (used for DNS queries, VoIP, gaming, WebRTC media, and HTTP/3 QUIC basis).
- **Network Layer (Layer 3)**: IP addressing (IPv4 vs IPv6), subnetting, CIDR, packet routing via BGP, OSPF, and ICMP.
- **Data Link Layer (Layer 2)**: MAC addressing, Ethernet framing, ARP resolution, VLANs, and MTU (Maximum Transmission Unit, typically 1500 bytes).

---

## 2. TCP 3-Way Handshake & 4-Way Teardown
```text
Client                              Server
  |                                   |
  | -------- SYN (seq = x) ---------> |
  | <---- SYN-ACK (seq=y, ack=x+1) -- |
  | -------- ACK (ack = y+1) -------> |
  |                                   |
  |  [ESTABLISHED: Full Duplex Flow]  |
  |                                   |
  | -------- FIN (seq = u) ---------> |
  | <------- ACK (ack = u+1) -------- |
  | <------- FIN (seq = v) ---------- |
  | -------- ACK (ack = v+1) -------> |
  |  [TIME_WAIT (2*MSL)]              |
  v                                   v
```
- **TIME_WAIT state**: Prevents delayed duplicate packets from a previous connection from being misattributed to a new connection on the same ephemeral port tuple `(src_ip, src_port, dst_ip, dst_port)`.

---

## 3. HTTP/1.1 vs HTTP/2 vs HTTP/3
| Feature | HTTP/1.1 | HTTP/2 | HTTP/3 |
| :--- | :--- | :--- | :--- |
| **Transport** | TCP | TCP | UDP (QUIC) |
| **Framing** | Plain text ASCII | Binary frames | Binary frames |
| **Multiplexing** | Pipelining (Head-of-Line blocking) | True stream multiplexing over 1 TCP socket | Independent streams (Zero TCP-level HOL blocking) |
| **Header Compression** | None (Repeated headers) | HPACK (Static + dynamic Huffman tables) | QPACK (Out-of-order decompression) |
| **Handshake Latency** | 1-RTT TCP + 1-2 RTT TLS 1.3 | 1-RTT TCP + 1-RTT TLS 1.3 | 0-RTT or 1-RTT Connection Establishment |
| **Connection Migration** | Breaks on IP change | Breaks on IP change | Resilient via 64-bit Connection IDs |

---

## 4. Modern TLS 1.3 Security Architecture
- Removed obsolete ciphers (RC4, 3DES, CBC mode ciphers) and insecure key exchange (RSA key transport without forward secrecy).
- Mandates **Ephemeral Diffie-Hellman (ECDHE)** for Perfect Forward Secrecy (PFS): compromising the server's private key does not compromise past recorded encrypted sessions.
- Handshake reduced from 2 Round Trips to **1 Round Trip** (or 0-RTT for resumed sessions).

---

## 5. WebSockets vs Server-Sent Events (SSE) vs Long Polling
- **Long Polling**: Emulates push via repeating HTTP requests held open until the server has new data. High overhead (full HTTP headers on every payload).
- **Server-Sent Events (SSE)**: Unidirectional streaming (Server -> Client) over a single persistent HTTP connection. Uses `Content-Type: text/event-stream`. Auto-reconnection and event IDs built-in. Ideal for LLM token streaming and stock tickers.
- **WebSockets (`ws://`, `wss://`)**: Bidirectional, full-duplex TCP socket upgraded from HTTP/1.1. Minimal 2 to 10-byte framing overhead. Ideal for collaborative real-time canvases, multi-user coding rooms, and low-latency gaming.
