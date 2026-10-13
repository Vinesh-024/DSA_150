import { TestCase } from '../types/curriculum';

export interface HarnessConfig {
  language: 'java' | 'python' | 'cpp' | 'c';
  code: string;
  functionName: string;
  testCases: Array<{
    input?: string;
    parsedInput?: any[];
    expected?: any;
    description?: string;
    isHidden?: boolean;
  }>;
}

/**
 * Serializes a JavaScript value to a valid Java literal representation.
 */
function toJavaLiteral(val: any): string {
  if (val === null || val === undefined) return 'null';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') {
    return Number.isInteger(val) ? String(val) : `${val}d`;
  }
  if (typeof val === 'string') {
    return JSON.stringify(val);
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return 'new int[]{}';
    if (typeof val[0] === 'number') {
      return `new int[]{${val.map(toJavaLiteral).join(', ')}}`;
    }
    if (typeof val[0] === 'string') {
      return `new String[]{${val.map(toJavaLiteral).join(', ')}}`;
    }
    if (Array.isArray(val[0])) {
      if (val[0].length === 0 || typeof val[0][0] === 'number') {
        return `new int[][]{${val.map(toJavaLiteral).join(', ')}}`;
      }
      return `new char[][]{${val.map(row => `new char[]{${row.map((c: string) => `'${c}'`).join(', ')}}`).join(', ')}}`;
    }
  }
  return JSON.stringify(val);
}

/**
 * Serializes a JavaScript value to a valid C++ literal representation.
 */
function toCppLiteral(val: any): string {
  if (val === null || val === undefined) return 'nullptr';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') return JSON.stringify(val);
  if (Array.isArray(val)) {
    return `{${val.map(toCppLiteral).join(', ')}}`;
  }
  return JSON.stringify(val);
}

/**
 * Serializes a JavaScript value to a valid C literal representation.
 */
function toCLiteral(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') return JSON.stringify(val);
  if (Array.isArray(val)) {
    return `{${val.map(toCLiteral).join(', ')}}`;
  }
  return JSON.stringify(val);
}

/**
 * Builds Java harness for Piston / Judge0.
 */
export function generateJavaHarness(code: string, functionName: string, testCases: any[]): string {
  let cleanedCode = code.replace(/^\s*package\s+[^;]+;/gm, '');
  // Make sure Solution is not declared 'public class' because Main is the public class in Main.java
  cleanedCode = cleanedCode.replace(/\bpublic\s+class\s+Solution\b/g, 'class Solution');

  const caseRunners = testCases.map((tc, idx) => {
    const args = Array.isArray(tc.parsedInput) ? tc.parsedInput : [tc.parsedInput];
    const javaArgs = args.map(toJavaLiteral).join(', ');
    const expectedLiteral = toJavaLiteral(tc.expected);

    return `
        // Test case ${idx + 1}
        try {
            long t0 = System.nanoTime();
            Object actual = sol.${functionName}(${javaArgs});
            long ms = Math.max(0, (System.nanoTime() - t0) / 1000000);
            boolean passed = deepEquals(actual, ${expectedLiteral});
            if (passed) passedCount++;
            String actStr = toJson(actual);
            String expStr = toJson(${expectedLiteral});
            results.add(String.format("{\\\"index\\\":%d,\\\"passed\\\":%b,\\\"actual\\\":%s,\\\"expected\\\":%s,\\\"runtimeMs\\\":%d}",
                ${idx + 1}, passed, escapeJson(actStr), escapeJson(expStr), ms));
        } catch (Throwable t) {
            results.add(String.format("{\\\"index\\\":%d,\\\"passed\\\":false,\\\"actual\\\":%s,\\\"expected\\\":%s,\\\"runtimeMs\\\":0}",
                ${idx + 1}, escapeJson("Runtime Exception: " + t.toString()), escapeJson(toJson(${expectedLiteral}))));
        }
    `;
  }).join('\n');

  return `
import java.util.*;
import java.io.*;
import java.lang.*;
import java.math.*;

${cleanedCode}

public class Main {
    private static String escapeJson(String s) {
        if (s == null) return "\\"null\\"";
        StringBuilder sb = new StringBuilder();
        sb.append('"');
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '"') sb.append("\\\\\\\"");
            else if (c == '\\\\') sb.append("\\\\\\\\");
            else if (c == '\\n') sb.append("\\\\n");
            else if (c == '\\r') sb.append("\\\\r");
            else if (c == '\\t') sb.append("\\\\t");
            else sb.append(c);
        }
        sb.append('"');
        return sb.toString();
    }

    private static String toJson(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof Boolean || obj instanceof Number) return String.valueOf(obj);
        if (obj instanceof String) return String.valueOf(obj);
        if (obj instanceof int[]) return Arrays.toString((int[]) obj);
        if (obj instanceof long[]) return Arrays.toString((long[]) obj);
        if (obj instanceof double[]) return Arrays.toString((double[]) obj);
        if (obj instanceof boolean[]) return Arrays.toString((boolean[]) obj);
        if (obj instanceof Object[]) {
            StringBuilder sb = new StringBuilder("[");
            Object[] arr = (Object[]) obj;
            for (int i = 0; i < arr.length; i++) {
                if (i > 0) sb.append(", ");
                sb.append(toJson(arr[i]));
            }
            sb.append("]");
            return sb.toString();
        }
        if (obj instanceof Collection) {
            StringBuilder sb = new StringBuilder("[");
            int i = 0;
            for (Object item : (Collection<?>) obj) {
                if (i++ > 0) sb.append(", ");
                sb.append(toJson(item));
            }
            sb.append("]");
            return sb.toString();
        }
        return obj.toString();
    }

    private static boolean deepEquals(Object a, Object b) {
        if (a == b) return true;
        if (a == null || b == null) return false;
        if (a.equals(b)) return true;
        if (a instanceof int[] && b instanceof int[]) return Arrays.equals((int[]) a, (int[]) b);
        if (a instanceof Object[] && b instanceof Object[]) return Arrays.deepEquals((Object[]) a, (Object[]) b);
        if (a instanceof Number && b instanceof Number) {
            return Math.abs(((Number) a).doubleValue() - ((Number) b).doubleValue()) < 1e-5;
        }
        return toJson(a).equals(toJson(b));
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        int passedCount = 0;
        int totalCases = ${testCases.length};
        List<String> results = new ArrayList<>();
        long totalStart = System.currentTimeMillis();

        ${caseRunners}

        long totalMs = Math.max(1, System.currentTimeMillis() - totalStart);
        String verdict = (passedCount == totalCases) ? "Accepted" : "Wrong Answer";

        System.out.println(String.format(
            "{\\\"verdict\\\":\\\"%s\\\",\\\"passedCases\\\":%d,\\\"totalCases\\\":%d,\\\"runtimeMs\\\":%d,\\\"memoryMb\\\":14.2,\\\"caseResults\\\":[%s]}",
            verdict, passedCount, totalCases, totalMs, String.join(",", results)
        ));
    }
}
`;
}

/**
 * Builds Python harness for Piston / Judge0.
 */
export function generatePythonHarness(code: string, functionName: string, testCases: any[]): string {
  const serializedCases = JSON.stringify(testCases);

  return `
import sys
import json
import time
import collections
import heapq
import math
from typing import List, Dict, Tuple, Set, Optional, Any

${code}

def main():
    test_cases = json.loads('''${serializedCases.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}''')
    
    sol = None
    if 'Solution' in globals():
        sol = globals()['Solution']()
    elif 'Solution' in locals():
        sol = locals()['Solution']()
    
    target_fn = None
    if sol and hasattr(sol, '${functionName}'):
        target_fn = getattr(sol, '${functionName}')
    elif '${functionName}' in globals():
        target_fn = globals()['${functionName}']
    elif '${functionName}' in locals():
        target_fn = locals()['${functionName}']
    
    if not target_fn:
        print(json.dumps({
            "verdict": "Compilation Error",
            "passedCases": 0,
            "totalCases": len(test_cases),
            "runtimeMs": 0,
            "memoryMb": 0,
            "caseResults": [],
            "error": "Method '${functionName}' not found in Solution."
        }))
        sys.exit(0)

    start_time = time.time()
    passed_count = 0
    case_results = []
    first_failed = None

    for idx, tc in enumerate(test_cases):
        args = tc.get('parsedInput', [])
        expected = tc.get('expected')
        t0 = time.time()
        try:
            actual = target_fn(*args)
            ms = round((time.time() - t0) * 1000, 2)
            passed = (actual == expected)
            if passed:
                passed_count += 1
            res_item = {
                "index": idx + 1,
                "input": tc.get('input', ''),
                "expected": json.dumps(expected),
                "actual": json.dumps(actual),
                "passed": passed,
                "isHidden": tc.get('isHidden', False),
                "description": tc.get('description', ''),
                "runtimeMs": ms
            }
            case_results.append(res_item)
            if not passed and not first_failed:
                first_failed = res_item
        except Exception as e:
            res_item = {
                "index": idx + 1,
                "input": tc.get('input', ''),
                "expected": json.dumps(expected),
                "actual": f"Runtime Exception: {str(e)}",
                "passed": False,
                "isHidden": tc.get('isHidden', False),
                "description": tc.get('description', ''),
                "runtimeMs": 0
            }
            case_results.append(res_item)
            if not first_failed:
                first_failed = res_item

    total_ms = max(1, round((time.time() - start_time) * 1000))
    verdict = "Accepted" if passed_count == len(test_cases) else "Wrong Answer"

    print(json.dumps({
        "verdict": verdict,
        "passedCases": passed_count,
        "totalCases": len(test_cases),
        "runtimeMs": total_ms,
        "memoryMb": 42.5,
        "caseResults": case_results,
        "failedCaseDetails": first_failed,
        "stdout": []
    }))

if __name__ == '__main__':
    main()
`;
}

/**
 * Builds C++ harness for Piston / Judge0.
 */
export function generateCppHarness(code: string, functionName: string, testCases: any[]): string {
  const caseRunners = testCases.map((tc, idx) => {
    const args = Array.isArray(tc.parsedInput) ? tc.parsedInput : [tc.parsedInput];
    const argDefs = args.map((a: any, aIdx: number) => {
      if (Array.isArray(a)) {
        if (a.length === 0 || typeof a[0] === 'number') {
          return `vector<int> arg_${idx}_${aIdx} = ${toCppLiteral(a)};`;
        }
        if (typeof a[0] === 'string') {
          return `vector<string> arg_${idx}_${aIdx} = ${toCppLiteral(a)};`;
        }
        return `auto arg_${idx}_${aIdx} = ${toCppLiteral(a)};`;
      }
      if (typeof a === 'string') {
        return `string arg_${idx}_${aIdx} = ${toCppLiteral(a)};`;
      }
      return `auto arg_${idx}_${aIdx} = ${toCppLiteral(a)};`;
    }).join('\n            ');

    const cppCallArgs = args.map((_: any, aIdx: number) => `arg_${idx}_${aIdx}`).join(', ');
    const expectedLiteral = toCppLiteral(tc.expected);

    return `
    {
        try {
            ${argDefs}
            auto actual = sol.${functionName}(${cppCallArgs});
            decltype(actual) expected = ${expectedLiteral};
            bool passed = (actual == expected);
            if (passed) passedCount++;
            if (!first) cout << ",";
            first = false;
            cout << "{\\"index\\":" << (${idx + 1}) << ",\\"passed\\":" << (passed ? "true" : "false")
                 << ",\\"actual\\":\\"" << to_string_json(actual) << "\\",\\"expected\\":\\""
                 << to_string_json(expected) << "\\",\\"runtimeMs\\":0}";
        } catch (const exception& e) {
            if (!first) cout << ",";
            first = false;
            cout << "{\\"index\\":" << (${idx + 1}) << ",\\"passed\\":false,\\"actual\\":\\"Exception\\",\\"expected\\":\\"true\\",\\"runtimeMs\\":0}";
        }
    }
    `;
  }).join('\n');

  return `
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <algorithm>
#include <climits>
#include <cmath>
#include <sstream>
#include <chrono>

using namespace std;

${code}

template<typename T>
string to_string_json(const T& val) {
    stringstream ss;
    ss << val;
    return ss.str();
}

inline string to_string_json(bool val) {
    return val ? "true" : "false";
}

template<typename T>
string to_string_json(const vector<T>& vec) {
    stringstream ss;
    ss << "[";
    for (size_t i = 0; i < vec.size(); ++i) {
        if (i > 0) ss << ", ";
        ss << to_string_json(vec[i]);
    }
    ss << "]";
    return ss.str();
}

int main() {
    Solution sol;
    int passedCount = 0;
    int totalCases = ${testCases.length};
    bool first = true;

    cout << "{\\"caseResults\\":[";
    ${caseRunners}
    cout << "],";

    string verdict = (passedCount == totalCases) ? "Accepted" : "Wrong Answer";
    cout << "\\"verdict\\":\\"" << verdict << "\\",\\"passedCases\\":" << passedCount
         << ",\\"totalCases\\":" << totalCases << ",\\"runtimeMs\\":1,\\"memoryMb\\":2.5}" << endl;

    return 0;
}
`;
}

/**
 * Builds C harness for Piston / Judge0.
 */
export function generateCHarness(code: string, functionName: string, testCases: any[]): string {
  const caseRunners = testCases.map((tc, idx) => {
    const args = Array.isArray(tc.parsedInput) ? tc.parsedInput : [tc.parsedInput];
    // In C, array parameters usually have array, length
    const cCallArgs: string[] = [];
    args.forEach((a: any, aIdx: number) => {
      if (Array.isArray(a)) {
        cCallArgs.push(`c_arr_${idx}_${aIdx}`, String(a.length));
      } else {
        cCallArgs.push(toCLiteral(a));
      }
    });

    const arrayDefs = args.map((a: any, aIdx: number) => {
      if (Array.isArray(a)) {
        return `int c_arr_${idx}_${aIdx}[] = ${toCLiteral(a)};`;
      }
      return '';
    }).filter(Boolean).join('\n    ');

    const expectedLiteral = toCLiteral(tc.expected);

    return `
    {
        ${arrayDefs}
        int actual = (int)${functionName}(${cCallArgs.join(', ')});
        int expected = (int)${expectedLiteral};
        int passed = (actual == expected);
        if (passed) passedCount++;
        if (!first) printf(",");
        first = 0;
        printf("{\\"index\\":%d,\\"passed\\":%s,\\"actual\\":\\"%d\\",\\"expected\\":\\"%d\\",\\"runtimeMs\\":0}",
               ${idx + 1}, passed ? "true" : "false", actual, expected);
    }
    `;
  }).join('\n');

  return `
#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

${code}

int main() {
    int passedCount = 0;
    int totalCases = ${testCases.length};
    int first = 1;

    printf("{\\"caseResults\\":[");
    ${caseRunners}
    printf("],");

    const char* verdict = (passedCount == totalCases) ? "Accepted" : "Wrong Answer";
    printf("\\"verdict\\":\\"%s\\",\\"passedCases\\":%d,\\"totalCases\\":%d,\\"runtimeMs\\":1,\\"memoryMb\\":1.8}\\n",
           verdict, passedCount, totalCases);

    return 0;
}
`;
}

/**
 * Master dispatcher that generates the appropriate test harness by language.
 */
export function generateLanguageHarness(config: HarnessConfig): string {
  switch (config.language) {
    case 'java':
      return generateJavaHarness(config.code, config.functionName, config.testCases);
    case 'cpp':
      return generateCppHarness(config.code, config.functionName, config.testCases);
    case 'c':
      return generateCHarness(config.code, config.functionName, config.testCases);
    case 'python':
    default:
      return generatePythonHarness(config.code, config.functionName, config.testCases);
  }
}
