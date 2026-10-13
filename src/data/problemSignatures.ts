import { ProblemDefinition } from '../types/curriculum';

export interface ParamMeta {
  name: string;
  javaType: string;
  cppType: string;
  cType: string;
  pyType: string;
}

export interface ReturnMeta {
  javaType: string;
  cppType: string;
  cType: string;
  pyType: string;
}

export interface SignatureMeta {
  functionName: string;
  params: ParamMeta[];
  returnType: ReturnMeta;
}

// Specific canonical LeetCode signatures for NeetCode 150 problems
const CANONICAL_SIGNATURES: Record<number, SignatureMeta> = {
  // Week 1: Arrays & Hashing
  217: {
    functionName: 'containsDuplicate',
    params: [{ name: 'nums', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* nums, int numsSize', pyType: 'List[int]' }],
    returnType: { javaType: 'boolean', cppType: 'bool', cType: 'bool', pyType: 'bool' }
  },
  242: {
    functionName: 'isAnagram',
    params: [
      { name: 's', javaType: 'String', cppType: 'string', cType: 'char*', pyType: 'str' },
      { name: 't', javaType: 'String', cppType: 'string', cType: 'char*', pyType: 'str' }
    ],
    returnType: { javaType: 'boolean', cppType: 'bool', cType: 'bool', pyType: 'bool' }
  },
  1: {
    functionName: 'twoSum',
    params: [
      { name: 'nums', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* nums, int numsSize', pyType: 'List[int]' },
      { name: 'target', javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
    ],
    returnType: { javaType: 'int[]', cppType: 'vector<int>', cType: 'int*', pyType: 'List[int]' }
  },
  49: {
    functionName: 'groupAnagrams',
    params: [
      { name: 'strs', javaType: 'String[]', cppType: 'vector<string>&', cType: 'char** strs, int strsSize', pyType: 'List[str]' }
    ],
    returnType: { javaType: 'List<List<String>>', cppType: 'vector<vector<string>>', cType: 'char***', pyType: 'List[List[str]]' }
  },
  347: {
    functionName: 'topKFrequent',
    params: [
      { name: 'nums', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* nums, int numsSize', pyType: 'List[int]' },
      { name: 'k', javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
    ],
    returnType: { javaType: 'int[]', cppType: 'vector<int>', cType: 'int*', pyType: 'List[int]' }
  },
  238: {
    functionName: 'productExceptSelf',
    params: [{ name: 'nums', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* nums, int numsSize', pyType: 'List[int]' }],
    returnType: { javaType: 'int[]', cppType: 'vector<int>', cType: 'int*', pyType: 'List[int]' }
  },
  36: {
    functionName: 'isValidSudoku',
    params: [{ name: 'board', javaType: 'char[][]', cppType: 'vector<vector<char>>&', cType: 'char** board, int boardSize, int* boardColSize', pyType: 'List[List[str]]' }],
    returnType: { javaType: 'boolean', cppType: 'bool', cType: 'bool', pyType: 'bool' }
  },
  271: {
    functionName: 'encode',
    params: [{ name: 'strs', javaType: 'List<String>', cppType: 'vector<string>&', cType: 'char** strs, int strsSize', pyType: 'List[str]' }],
    returnType: { javaType: 'String', cppType: 'string', cType: 'char*', pyType: 'str' }
  },
  128: {
    functionName: 'longestConsecutive',
    params: [{ name: 'nums', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* nums, int numsSize', pyType: 'List[int]' }],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  // Two Pointers
  125: {
    functionName: 'isPalindrome',
    params: [{ name: 's', javaType: 'String', cppType: 'string', cType: 'char*', pyType: 'str' }],
    returnType: { javaType: 'boolean', cppType: 'bool', cType: 'bool', pyType: 'bool' }
  },
  167: {
    functionName: 'twoSum',
    params: [
      { name: 'numbers', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* numbers, int numbersSize', pyType: 'List[int]' },
      { name: 'target', javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
    ],
    returnType: { javaType: 'int[]', cppType: 'vector<int>', cType: 'int*', pyType: 'List[int]' }
  },
  15: {
    functionName: 'threeSum',
    params: [{ name: 'nums', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* nums, int numsSize', pyType: 'List[int]' }],
    returnType: { javaType: 'List<List<Integer>>', cppType: 'vector<vector<int>>', cType: 'int**', pyType: 'List[List[int]]' }
  },
  11: {
    functionName: 'maxArea',
    params: [{ name: 'height', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* height, int heightSize', pyType: 'List[int]' }],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  42: {
    functionName: 'trap',
    params: [{ name: 'height', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* height, int heightSize', pyType: 'List[int]' }],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  // Sliding Window
  121: {
    functionName: 'maxProfit',
    params: [{ name: 'prices', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* prices, int pricesSize', pyType: 'List[int]' }],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  3: {
    functionName: 'lengthOfLongestSubstring',
    params: [{ name: 's', javaType: 'String', cppType: 'string', cType: 'char*', pyType: 'str' }],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  424: {
    functionName: 'characterReplacement',
    params: [
      { name: 's', javaType: 'String', cppType: 'string', cType: 'char*', pyType: 'str' },
      { name: 'k', javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
    ],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  76: {
    functionName: 'minWindow',
    params: [
      { name: 's', javaType: 'String', cppType: 'string', cType: 'char*', pyType: 'str' },
      { name: 't', javaType: 'String', cppType: 'string', cType: 'char*', pyType: 'str' }
    ],
    returnType: { javaType: 'String', cppType: 'string', cType: 'char*', pyType: 'str' }
  },
  // Stack
  20: {
    functionName: 'isValid',
    params: [{ name: 's', javaType: 'String', cppType: 'string', cType: 'char*', pyType: 'str' }],
    returnType: { javaType: 'boolean', cppType: 'bool', cType: 'bool', pyType: 'bool' }
  },
  150: {
    functionName: 'evalRPN',
    params: [{ name: 'tokens', javaType: 'String[]', cppType: 'vector<string>&', cType: 'char** tokens, int tokensSize', pyType: 'List[str]' }],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  22: {
    functionName: 'generateParenthesis',
    params: [{ name: 'n', javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }],
    returnType: { javaType: 'List<String>', cppType: 'vector<string>', cType: 'char**', pyType: 'List[str]' }
  },
  739: {
    functionName: 'dailyTemperatures',
    params: [{ name: 'temperatures', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* temperatures, int temperaturesSize', pyType: 'List[int]' }],
    returnType: { javaType: 'int[]', cppType: 'vector<int>', cType: 'int*', pyType: 'List[int]' }
  },
  84: {
    functionName: 'largestRectangleArea',
    params: [{ name: 'heights', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* heights, int heightsSize', pyType: 'List[int]' }],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  // Binary Search
  704: {
    functionName: 'search',
    params: [
      { name: 'nums', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* nums, int numsSize', pyType: 'List[int]' },
      { name: 'target', javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
    ],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  74: {
    functionName: 'searchMatrix',
    params: [
      { name: 'matrix', javaType: 'int[][]', cppType: 'vector<vector<int>>&', cType: 'int** matrix, int matrixSize, int* matrixColSize', pyType: 'List[List[int]]' },
      { name: 'target', javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
    ],
    returnType: { javaType: 'boolean', cppType: 'bool', cType: 'bool', pyType: 'bool' }
  },
  875: {
    functionName: 'minEatingSpeed',
    params: [
      { name: 'piles', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* piles, int pilesSize', pyType: 'List[int]' },
      { name: 'h', javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
    ],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  153: {
    functionName: 'findMin',
    params: [{ name: 'nums', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* nums, int numsSize', pyType: 'List[int]' }],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  33: {
    functionName: 'search',
    params: [
      { name: 'nums', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* nums, int numsSize', pyType: 'List[int]' },
      { name: 'target', javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
    ],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  // 1-D DP
  70: {
    functionName: 'climbStairs',
    params: [{ name: 'n', javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  322: {
    functionName: 'coinChange',
    params: [
      { name: 'coins', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* coins, int coinsSize', pyType: 'List[int]' },
      { name: 'amount', javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
    ],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  198: {
    functionName: 'rob',
    params: [{ name: 'nums', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* nums, int numsSize', pyType: 'List[int]' }],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  300: {
    functionName: 'lengthOfLIS',
    params: [{ name: 'nums', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* nums, int numsSize', pyType: 'List[int]' }],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  // Bit manipulation
  136: {
    functionName: 'singleNumber',
    params: [{ name: 'nums', javaType: 'int[]', cppType: 'vector<int>&', cType: 'int* nums, int numsSize', pyType: 'List[int]' }],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  },
  191: {
    functionName: 'hammingWeight',
    params: [{ name: 'n', javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }],
    returnType: { javaType: 'int', cppType: 'int', cType: 'int', pyType: 'int' }
  }
};

/**
 * Infer parameter and return types dynamically from sample test cases.
 */
function inferType(val: any): { java: string; cpp: string; c: string; py: string } {
  if (val === null || val === undefined) {
    return { java: 'void', cpp: 'void', c: 'void', py: 'None' };
  }
  if (typeof val === 'boolean') {
    return { java: 'boolean', cpp: 'bool', c: 'bool', py: 'bool' };
  }
  if (typeof val === 'number') {
    if (Number.isInteger(val)) {
      return { java: 'int', cpp: 'int', c: 'int', py: 'int' };
    }
    return { java: 'double', cpp: 'double', c: 'double', py: 'float' };
  }
  if (typeof val === 'string') {
    return { java: 'String', cpp: 'string', c: 'char*', py: 'str' };
  }
  if (Array.isArray(val)) {
    if (val.length === 0 || typeof val[0] === 'number') {
      return { java: 'int[]', cpp: 'vector<int>', c: 'int*', py: 'List[int]' };
    }
    if (typeof val[0] === 'string') {
      return { java: 'List<String>', cpp: 'vector<string>', c: 'char**', py: 'List[str]' };
    }
    if (Array.isArray(val[0])) {
      if (val[0].length === 0 || typeof val[0][0] === 'number') {
        return { java: 'List<List<Integer>>', cpp: 'vector<vector<int>>', c: 'int**', py: 'List[List[int]]' };
      }
      return { java: 'List<List<String>>', cpp: 'vector<vector<string>>', c: 'char***', py: 'List[List[str]]' };
    }
  }
  return { java: 'int', cpp: 'int', c: 'int', py: 'int' };
}

/**
 * Extract parameter names from sample testcase input string (e.g., 'nums = [1,2,3], target = 4')
 */
function extractParamNames(inputStr?: string, count: number = 1): string[] {
  if (!inputStr) {
    return Array.from({ length: count }, (_, i) => `arg${i + 1}`);
  }
  const matches = [...inputStr.matchAll(/([a-zA-Z0-9_]+)\s*=/g)].map(m => m[1]);
  if (matches.length >= count) {
    return matches.slice(0, count);
  }
  // Fill remaining
  const result = [...matches];
  while (result.length < count) {
    result.push(`arg${result.length + 1}`);
  }
  return result;
}

/**
 * Builds authentic LeetCode starter code for all 4 languages.
 */
export function buildStarterTemplates(rawProblem: {
  number: number;
  defaultFunctionName: string;
  sampleTestCases?: Array<{ input?: string; parsedInput?: any[]; expected?: any }>;
}): { java: string; cpp: string; c: string; python: string } {
  const num = rawProblem.number;
  const fn = rawProblem.defaultFunctionName;

  // Check canonical first
  if (CANONICAL_SIGNATURES[num]) {
    const meta = CANONICAL_SIGNATURES[num];
    const javaParams = meta.params.map(p => `${p.javaType} ${p.name}`).join(', ');
    const cppParams = meta.params.map(p => `${p.cppType} ${p.name}`).join(', ');
    const cParams = meta.params.map(p => (p.cType.includes(' ') ? p.cType : `${p.cType} ${p.name}`)).join(', ');
    const pyParams = meta.params.map(p => `${p.name}: ${p.pyType}`).join(', ');

    return {
      java: `class Solution {\n    public ${meta.returnType.javaType} ${fn}(${javaParams}) {\n        \n    }\n}\n`,
      cpp: `class Solution {\npublic:\n    ${meta.returnType.cppType} ${fn}(${cppParams}) {\n        \n    }\n};\n`,
      c: `${meta.returnType.cType} ${fn}(${cParams}) {\n    \n}\n`,
      python: `class Solution:\n    def ${fn}(self, ${pyParams}) -> ${meta.returnType.pyType}:\n        pass\n`
    };
  }

  // Infer from sample test cases
  const sample = rawProblem.sampleTestCases?.[0];
  const parsedArgs = sample?.parsedInput || [];
  const paramCount = Math.max(parsedArgs.length, 1);
  const paramNames = extractParamNames(sample?.input, paramCount);
  const retMeta = inferType(sample?.expected);

  const javaParamList: string[] = [];
  const cppParamList: string[] = [];
  const cParamList: string[] = [];
  const pyParamList: string[] = [];

  for (let i = 0; i < paramCount; i++) {
    const argVal = parsedArgs[i];
    const argName = paramNames[i] || `arg${i + 1}`;
    const argMeta = inferType(argVal);

    if (argMeta.java === 'int[]') {
      javaParamList.push(`int[] ${argName}`);
      cppParamList.push(`vector<int>& ${argName}`);
      cParamList.push(`int* ${argName}, int ${argName}Size`);
      pyParamList.push(`${argName}: List[int]`);
    } else if (argMeta.java === 'String') {
      javaParamList.push(`String ${argName}`);
      cppParamList.push(`string ${argName}`);
      cParamList.push(`char* ${argName}`);
      pyParamList.push(`${argName}: str`);
    } else if (argMeta.java === 'int') {
      javaParamList.push(`int ${argName}`);
      cppParamList.push(`int ${argName}`);
      cParamList.push(`int ${argName}`);
      pyParamList.push(`${argName}: int`);
    } else if (argMeta.java === 'boolean') {
      javaParamList.push(`boolean ${argName}`);
      cppParamList.push(`bool ${argName}`);
      cParamList.push(`bool ${argName}`);
      pyParamList.push(`${argName}: bool`);
    } else {
      javaParamList.push(`${argMeta.java} ${argName}`);
      cppParamList.push(`${argMeta.cpp}& ${argName}`);
      cParamList.push(`${argMeta.c} ${argName}`);
      pyParamList.push(`${argName}: ${argMeta.py}`);
    }
  }

  return {
    java: `class Solution {\n    public ${retMeta.java} ${fn}(${javaParamList.join(', ')}) {\n        \n    }\n}\n`,
    cpp: `class Solution {\npublic:\n    ${retMeta.cpp} ${fn}(${cppParamList.join(', ')}) {\n        \n    }\n};\n`,
    c: `${retMeta.c} ${fn}(${cParamList.join(', ')}) {\n    \n}\n`,
    python: `class Solution:\n    def ${fn}(self, ${pyParamList.join(', ')}) -> ${retMeta.py}:\n        pass\n`
  };
}

/**
 * Converts a curriculum raw problem to strongly-typed ProblemDefinition
 */
export function toProblemDefinition(rawProblem: any): ProblemDefinition {
  const starterTemplates = buildStarterTemplates(rawProblem);
  const testCases = (rawProblem.sampleTestCases || []).concat(rawProblem.hiddenTestCases || []).map((tc: any) => ({
    input: tc.parsedInput || [],
    expected: tc.expected
  }));

  return {
    id: typeof rawProblem.number === 'number' ? rawProblem.number : parseInt(String(rawProblem.id).replace(/\D/g, ''), 10) || 1,
    title: rawProblem.title,
    slug: rawProblem.slug,
    difficulty: rawProblem.difficulty,
    category: rawProblem.topic,
    starterTemplates,
    testCases
  };
}
