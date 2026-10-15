# CS Fundamentals: Operating Systems & Concurrency

## 1. Process vs Thread & Memory Layout
- **Process**: An isolated execution environment with its own virtual address space (Text, Data, BSS, Heap, Stack), file descriptors, and security tokens. Inter-process communication (IPC) requires pipes, sockets, or shared memory.
- **Thread**: The smallest schedulable unit of CPU execution. Multiple threads within the same process share the heap, data, and open file descriptors, but maintain independent call stacks and thread-local registers.
- **Context Switch Overhead**: Saving and loading CPU registers, program counter, stack pointer, and invalidating CPU caches (TLB - Translation Lookaside Buffer) when switching between distinct process address spaces.

## 2. Concurrency Primitives: Mutex, Semaphore & Spinlock
- **Mutex (Mutual Exclusion)**: Binary locking mechanism granting exclusive ownership to a single thread. Sleeping lock: puts waiting threads into sleep queue until awakened.
- **Semaphore**: Counting primitive initialized with integer $N$.
  - `wait() / P()`: Decrements count; blocks if count <= 0.
  - `signal() / V()`: Increments count; wakes blocked thread.
  - Useful for resource pools (e.g., connection pools of size 20).
- **Spinlock**: Busy-waits in a tight loop checking a CPU atomic flag (`test_and_set`). Efficient only when critical sections are shorter than the context switch duration.

## 3. Deadlock Conditions (Coffman Conditions)
Deadlock occurs if and only if all four conditions hold simultaneously:
1. **Mutual Exclusion**: Resources cannot be shared simultaneously.
2. **Hold and Wait**: A process holding resources requests additional resources.
3. **No Preemption**: Resources cannot be forcibly revoked from a process.
4. **Circular Wait**: A closed chain of processes exists where each holds a resource requested by the next.

**Resolution**: Break the Circular Wait condition by enforcing a strict global acquisition ordering on all lock IDs.

## 4. Virtual Memory & Page Replacement
- **Paging**: Dividing virtual address space into pages (4KB) and physical memory into frames.
- **Page Fault**: Hardware interrupt triggered by the MMU when a virtual address translation does not find a valid resident page table entry. Triggers OS disk swap read.
- **Thrashing**: State where CPU spends more time servicing page faults and disk I/O than executing instructions.
