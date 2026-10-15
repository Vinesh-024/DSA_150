# TEST PLAN — COZY CODE CORNER

## 1. Test Strategy Overview
The testing architecture ensures that every architectural boundary—from local IndexedDB storage, state transitions, spaced retention calculations, to code execution adapters—is verified deterministically.

## 2. Test Tiers
1. **Catalog Integrity Tests**:
   - Verify all 150 problems contain valid IDs, non-empty starter codes for Python/Java/C++, canonical sample test cases, and all 4 hint levels.
2. **State & Spaced Retention Tests**:
   - Verify Day 3, 7, and 30 due date calculations.
   - Verify Redo rule: marking Redo resets state back to Day 3.
3. **Execution Sandbox Tests**:
   - Test Python execution with passing solutions, syntax errors, infinite loops (timeout trigger), and wrong answers.
   - Verify Judge0 adapter fallback behavior when remote instance is offline.
4. **UI & Accessibility Tests**:
   - Responsive layout checks across mobile, tablet, and widescreen.
   - Contrast ratio compliance on design tokens (Warm Linen, Forest Green, Muted Clay).
   - Keyboard navigation in editor and modal dialogs.
