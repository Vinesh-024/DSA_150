import { Problem, Difficulty } from '../types/curriculum';

export interface RawCatalogItem {
  number: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topic: string;
  week: number;
  fnName: string;
  pyParam: string;
  pyReturn: string;
  javaParam: string;
  javaReturn: string;
  cppParam: string;
  cppReturn: string;
  description: string;
  sampleInput: string;
  sampleOutput: any;
  h1: string;
  h2: string;
  h3: string;
  h4: string;
}

export const RAW_150: RawCatalogItem[] = [
  // ─── WEEK 1: Arrays & Hashing (9) ───
  {
    number: 217, title: 'Contains Duplicate', slug: 'contains-duplicate', difficulty: 'Easy', topic: 'Arrays & Hashing', week: 1,
    fnName: 'containsDuplicate', pyParam: 'nums: list[int]', pyReturn: 'bool', javaParam: 'int[] nums', javaReturn: 'boolean', cppParam: 'vector<int>& nums', cppReturn: 'bool',
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    sampleInput: 'nums = [1, 2, 3, 1]', sampleOutput: true,
    h1: 'Can you remember which numbers you have already visited?', h2: 'Use a Hash Set to track seen numbers.',
    h3: 'Iterate through nums. If num in seen_set return True. Else add num to seen_set.', h4: 'Time: O(n), Space: O(n).'
  },
  {
    number: 242, title: 'Valid Anagram', slug: 'valid-anagram', difficulty: 'Easy', topic: 'Arrays & Hashing', week: 1,
    fnName: 'isAnagram', pyParam: 's: str, t: str', pyReturn: 'bool', javaParam: 'String s, String t', javaReturn: 'boolean', cppParam: 'string s, string t', cppReturn: 'bool',
    description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
    sampleInput: 's = "anagram", t = "nagaram"', sampleOutput: true,
    h1: 'If the lengths of s and t differ, can they ever be anagrams?', h2: 'An anagram requires identical character counts.',
    h3: 'Count frequency of characters in s and t and compare.', h4: 'Time: O(n), Space: O(1) bounded by 26 letters.'
  },
  {
    number: 1, title: 'Two Sum', slug: 'two-sum', difficulty: 'Easy', topic: 'Arrays & Hashing', week: 1,
    fnName: 'twoSum', pyParam: 'nums: list[int], target: int', pyReturn: 'list[int]', javaParam: 'int[] nums, int target', javaReturn: 'int[]', cppParam: 'vector<int>& nums, int target', cppReturn: 'vector<int>',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    sampleInput: 'nums = [2, 7, 11, 15], target = 9', sampleOutput: [0, 1],
    h1: 'Can you check if the complement has already been seen?', h2: 'Use a Hash Map mapping visited value -> index.',
    h3: 'Iterate through nums. If target - n in map, return indices. Otherwise store n.', h4: 'Time: O(n), Space: O(n).'
  },
  {
    number: 49, title: 'Group Anagrams', slug: 'group-anagrams', difficulty: 'Medium', topic: 'Arrays & Hashing', week: 1,
    fnName: 'groupAnagrams', pyParam: 'strs: list[str]', pyReturn: 'list[list[str]]', javaParam: 'String[] strs', javaReturn: 'List<List<String>>', cppParam: 'vector<string>& strs', cppReturn: 'vector<vector<string>>',
    description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    sampleInput: 'strs = ["eat","tea","tan","ate","nat","bat"]', sampleOutput: [["bat"],["nat","tan"],["ate","eat","tea"]],
    h1: 'What canonical representation do all anagrams share?', h2: 'Sorted string or 26-element character frequency tuple as hash map key.',
    h3: 'Create hash map default_list. For each word, use tuple(count) or sorted(word) as key.', h4: 'Time: O(m * n), Space: O(m * n).'
  },
  {
    number: 347, title: 'Top K Frequent Elements', slug: 'top-k-frequent-elements', difficulty: 'Medium', topic: 'Arrays & Hashing', week: 1,
    fnName: 'topKFrequent', pyParam: 'nums: list[int], k: int', pyReturn: 'list[int]', javaParam: 'int[] nums, int k', javaReturn: 'int[]', cppParam: 'vector<int>& nums, int k', cppReturn: 'vector<int>',
    description: 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
    sampleInput: 'nums = [1,1,1,2,2,3], k = 2', sampleOutput: [1, 2],
    h1: 'Can you do better than O(n log n) sorting?', h2: 'Bucket sort where index represents frequency count (0 to n).',
    h3: 'Count frequencies into map. Place items into buckets where bucket[freq] = [nums]. Traverse backward.', h4: 'Time: O(n), Space: O(n).'
  },
  {
    number: 238, title: 'Product of Array Except Self', slug: 'product-of-array-except-self', difficulty: 'Medium', topic: 'Arrays & Hashing', week: 1,
    fnName: 'productExceptSelf', pyParam: 'nums: list[int]', pyReturn: 'list[int]', javaParam: 'int[] nums', javaReturn: 'int[]', cppParam: 'vector<int>& nums', cppReturn: 'vector<int>',
    description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i] without using division.',
    sampleInput: 'nums = [1,2,3,4]', sampleOutput: [24,12,8,6],
    h1: 'Product except self is prefix product times postfix product.', h2: 'Compute prefix products in first pass, then postfix in second pass.',
    h3: 'Initialize res with 1s. First pass computes prefix. Second pass multiplies running postfix.', h4: 'Time: O(n), Space: O(1) auxiliary.'
  },
  {
    number: 36, title: 'Valid Sudoku', slug: 'valid-sudoku', difficulty: 'Medium', topic: 'Arrays & Hashing', week: 1,
    fnName: 'isValidSudoku', pyParam: 'board: list[list[str]]', pyReturn: 'bool', javaParam: 'char[][] board', javaReturn: 'boolean', cppParam: 'vector<vector<char>>& board', cppReturn: 'bool',
    description: 'Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to standard rules.',
    sampleInput: 'board = [["5","3",".",".","7",".",".",".","."],...]', sampleOutput: true,
    h1: 'Track numbers seen across 9 rows, 9 columns, and 9 3x3 sub-boxes.', h2: 'Use sets or bitmasks for row[r], col[c], and box[r//3, c//3].',
    h3: 'Iterate every cell. If cell not ".", check if seen in row, col, or box. If so return False; else add.', h4: 'Time: O(1) [fixed 81 cells], Space: O(1).'
  },
  {
    number: 271, title: 'Encode and Decode Strings', slug: 'encode-and-decode-strings', difficulty: 'Medium', topic: 'Arrays & Hashing', week: 1,
    fnName: 'encodeAndDecode', pyParam: 'strs: list[str]', pyReturn: 'list[str]', javaParam: 'List<String> strs', javaReturn: 'List<String>', cppParam: 'vector<string>& strs', cppReturn: 'vector<string>',
    description: 'Design an algorithm to encode a list of strings to a string. The encoded string is then sent over the network and is decoded back to the original list of strings.',
    sampleInput: 'strs = ["neet","code","love","you"]', sampleOutput: ["neet","code","love","you"],
    h1: 'Any delimiter character might appear inside the strings themselves.', h2: 'Length prefixing: prepend each string with its length and a delimiter, like "4#neet".',
    h3: 'Encoding: join len(s) + "#" + s. Decoding: read integer until "#", then read next len characters.', h4: 'Time: O(total chars), Space: O(1) auxiliary.'
  },
  {
    number: 128, title: 'Longest Consecutive Sequence', slug: 'longest-consecutive-sequence', difficulty: 'Medium', topic: 'Arrays & Hashing', week: 1,
    fnName: 'longestConsecutive', pyParam: 'nums: list[int]', pyReturn: 'int', javaParam: 'int[] nums', javaReturn: 'int', cppParam: 'vector<int>& nums', cppReturn: 'int',
    description: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence in O(n) time.',
    sampleInput: 'nums = [100, 4, 200, 1, 3, 2]', sampleOutput: 4,
    h1: 'How do you know if a number is the beginning of a sequence?', h2: 'A number x is a sequence start if (x - 1) is not in the set.',
    h3: 'Insert all into set. For each num, if (num - 1) not in set: count consecutive sequence (num + 1, num + 2...).', h4: 'Time: O(n), Space: O(n).'
  },

  // ─── WEEK 2: Two Pointers (5) ───
  {
    number: 125, title: 'Valid Palindrome', slug: 'valid-palindrome', difficulty: 'Easy', topic: 'Two Pointers', week: 2,
    fnName: 'isPalindrome', pyParam: 's: str', pyReturn: 'bool', javaParam: 'String s', javaReturn: 'boolean', cppParam: 'string s', cppReturn: 'bool',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    sampleInput: 's = "A man, a plan, a canal: Panama"', sampleOutput: true,
    h1: 'Use two pointers moving inwards from the start and end of the string.', h2: 'Skip non-alphanumeric characters with while loops.',
    h3: 'Compare characters at left and right pointers in lowercase. If mismatch return False.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 167, title: 'Two Sum II - Input Array Is Sorted', slug: 'two-sum-ii-input-array-is-sorted', difficulty: 'Medium', topic: 'Two Pointers', week: 2,
    fnName: 'twoSumSorted', pyParam: 'numbers: list[int], target: int', pyReturn: 'list[int]', javaParam: 'int[] numbers, int target', javaReturn: 'int[]', cppParam: 'vector<int>& numbers, int target', cppReturn: 'vector<int>',
    description: 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to target.',
    sampleInput: 'numbers = [2,7,11,15], target = 9', sampleOutput: [1, 2],
    h1: 'Since the array is sorted, how does moving the left pointer or right pointer affect the sum?', h2: 'Left pointer increases sum, right pointer decreases sum.',
    h3: 'Initialize l=0, r=n-1. If sum == target return [l+1, r+1]. If sum < target l++, else r--.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 15, title: '3Sum', slug: '3sum', difficulty: 'Medium', topic: 'Two Pointers', week: 2,
    fnName: 'threeSum', pyParam: 'nums: list[int]', pyReturn: 'list[list[int]]', javaParam: 'int[] nums', javaReturn: 'List<List<Integer>>', cppParam: 'vector<int>& nums', cppReturn: 'vector<vector<int>>',
    description: 'Given an integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
    sampleInput: 'nums = [-1,0,1,2,-1,-4]', sampleOutput: [[-1,-1,2],[-1,0,1]],
    h1: 'Sort the array first to make duplicate elimination and two-pointer search easy.', h2: 'Fix the first element, then run Two Sum II on the remainder.',
    h3: 'Sort nums. Loop i from 0 to n-1. If nums[i] > 0 break. If i > 0 and nums[i] == nums[i-1] continue. Use two pointers for remaining sum.', h4: 'Time: O(n^2), Space: O(1) or O(n) depending on sort.'
  },
  {
    number: 11, title: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'Medium', topic: 'Two Pointers', week: 2,
    fnName: 'maxArea', pyParam: 'height: list[int]', pyReturn: 'int', javaParam: 'int[] height', javaReturn: 'int', cppParam: 'vector<int>& height', cppReturn: 'int',
    description: 'Given n non-negative integers representing heights of vertical lines, find two lines that together with the x-axis form a container that contains the most water.',
    sampleInput: 'height = [1,8,6,2,5,4,8,3,7]', sampleOutput: 49,
    h1: 'The area is limited by min(height[l], height[r]) * (r - l).', h2: 'Moving the taller line cannot increase the area because width decreases and height is bounded by the shorter line.',
    h3: 'Start at extremes l=0, r=n-1. Calculate area and track max. Move the pointer pointing to shorter line.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 42, title: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'Hard', topic: 'Two Pointers', week: 2,
    fnName: 'trap', pyParam: 'height: list[int]', pyReturn: 'int', javaParam: 'int[] height', javaReturn: 'int', cppParam: 'vector<int>& height', cppReturn: 'int',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    sampleInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', sampleOutput: 6,
    h1: 'Water trapped above index i is max(0, min(max_left, max_right) - height[i]).', h2: 'Two pointers maintain max_left and max_right without extra array allocations.',
    h3: 'If max_left < max_right, water at l is max_left - height[l]; advance l. Otherwise advance r.', h4: 'Time: O(n), Space: O(1).'
  },

  // ─── WEEK 3: Sliding Window (6) ───
  {
    number: 121, title: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock', difficulty: 'Easy', topic: 'Sliding Window', week: 3,
    fnName: 'maxProfit', pyParam: 'prices: list[int]', pyReturn: 'int', javaParam: 'int[] prices', javaReturn: 'int', cppParam: 'vector<int>& prices', cppReturn: 'int',
    description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy and a different day in the future to sell.',
    sampleInput: 'prices = [7,1,5,3,6,4]', sampleOutput: 5,
    h1: 'Track the minimum price seen so far as you iterate through the days.', h2: 'At each day, the potential profit is prices[i] - min_price.',
    h3: 'Initialize min_price = inf, max_profit = 0. For each p: min_price = min(min_price, p), max_profit = max(max_profit, p - min_price).', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 3, title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters', difficulty: 'Medium', topic: 'Sliding Window', week: 3,
    fnName: 'lengthOfLongestSubstring', pyParam: 's: str', pyReturn: 'int', javaParam: 'String s', javaReturn: 'int', cppParam: 'string s', cppReturn: 'int',
    description: 'Given a string s, find the length of the longest substring without duplicate characters.',
    sampleInput: 's = "abcabcbb"', sampleOutput: 3,
    h1: 'Maintain a window [left, right] that contains only distinct characters.', h2: 'Use a hash map or set to record characters in current window.',
    h3: 'When s[r] is already in set, shrink window from left until s[r] is removed, then add s[r] and update max_len.', h4: 'Time: O(n), Space: O(min(m, n)).'
  },
  {
    number: 424, title: 'Longest Repeating Character Replacement', slug: 'longest-repeating-character-replacement', difficulty: 'Medium', topic: 'Sliding Window', week: 3,
    fnName: 'characterReplacement', pyParam: 's: str, k: int', pyReturn: 'int', javaParam: 'String s, int k', javaReturn: 'int', cppParam: 'string s, int k', cppReturn: 'int',
    description: 'You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character at most k times. Return length of longest substring of same letter.',
    sampleInput: 's = "ABAB", k = 2', sampleOutput: 4,
    h1: 'Window length minus frequency of most frequent char in window gives number of replacements needed.', h2: 'If (window_len - max_freq) > k, the window is invalid; shift left pointer.',
    h3: 'Maintain character count hash map. As right expands, update max_freq. If invalid, decrement count[s[l]] and l++.', h4: 'Time: O(n), Space: O(26) = O(1).'
  },
  {
    number: 567, title: 'Permutation in String', slug: 'permutation-in-string', difficulty: 'Medium', topic: 'Sliding Window', week: 3,
    fnName: 'checkInclusion', pyParam: 's1: str, s2: str', pyReturn: 'bool', javaParam: 'String s1, String s2', javaReturn: 'boolean', cppParam: 'string s1, string s2', cppReturn: 'bool',
    description: 'Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise.',
    sampleInput: 's1 = "ab", s2 = "eidbaooo"', sampleOutput: true,
    h1: 'A permutation has the exact same character frequency counts.', h2: 'Use a fixed-size sliding window of length len(s1) across s2.',
    h3: 'Compare frequency arrays of size 26. Track number of matches to check equality in O(1).', h4: 'Time: O(len(s2)), Space: O(1).'
  },
  {
    number: 76, title: 'Minimum Window Substring', slug: 'minimum-window-substring', difficulty: 'Hard', topic: 'Sliding Window', week: 3,
    fnName: 'minWindow', pyParam: 's: str, t: str', pyReturn: 'str', javaParam: 'String s, String t', javaReturn: 'String', cppParam: 'string s, string t', cppReturn: 'string',
    description: 'Given two strings s and t of lengths m and n, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.',
    sampleInput: 's = "ADOBECODEBANC", t = "ABC"', sampleOutput: 'BANC',
    h1: 'Expand right pointer until all characters of t are satisfied, then contract left pointer to minimize.', h2: 'Maintain `have` and `need` counts to verify condition in O(1) time.',
    h3: 'Count t. Loop r through s. When window satisfies all chars, record min window and increment l.', h4: 'Time: O(m + n), Space: O(m + n).'
  },
  {
    number: 239, title: 'Sliding Window Maximum', slug: 'sliding-window-maximum', difficulty: 'Hard', topic: 'Sliding Window', week: 3,
    fnName: 'maxSlidingWindow', pyParam: 'nums: list[int], k: int', pyReturn: 'list[int]', javaParam: 'int[] nums, int k', javaReturn: 'int[]', cppParam: 'vector<int>& nums, int k', cppReturn: 'vector<int>',
    description: 'You are given an array of integers nums, there is a sliding window of size k which is moving from the very left to the very right. Return the max in each window.',
    sampleInput: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', sampleOutput: [3,3,5,5,6,7],
    h1: 'A heap gives O(n log k). Can you do O(n) using a Monotonic Queue?', h2: 'Use a Deque storing indices with values in strictly decreasing order.',
    h3: 'Before pushing nums[r], pop smaller elements from back of deque. Pop front if out of window bounds. Append front to result.', h4: 'Time: O(n), Space: O(k).'
  },

  // ─── WEEK 4: Stack (7) ───
  {
    number: 20, title: 'Valid Parentheses', slug: 'valid-parentheses', difficulty: 'Easy', topic: 'Stack', week: 4,
    fnName: 'isValid', pyParam: 's: str', pyReturn: 'bool', javaParam: 'String s', javaReturn: 'boolean', cppParam: 'string s', cppReturn: 'bool',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    sampleInput: 's = "()[]{}"', sampleOutput: true,
    h1: 'Use a stack to match closing brackets with the most recently opened bracket.', h2: 'Map closing brackets to their corresponding opening brackets.',
    h3: 'For char in s: if opening push to stack; if closing, pop and verify match. Return stack empty.', h4: 'Time: O(n), Space: O(n).'
  },
  {
    number: 155, title: 'Min Stack', slug: 'min-stack', difficulty: 'Medium', topic: 'Stack', week: 4,
    fnName: 'MinStack', pyParam: '', pyReturn: '', javaParam: '', javaReturn: '', cppParam: '', cppReturn: '',
    description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant O(1) time.',
    sampleInput: '["MinStack","push","push","push","getMin","pop","top","getMin"]', sampleOutput: [null,null,null,null,-3,null,0,-2],
    h1: 'How can you remember the minimum at every historical height of the stack?', h2: 'Maintain an auxiliary stack minStack that stores the running minimum.',
    h3: 'On push(val): push to main stack, and push min(val, minStack[-1]) to minStack. On pop: pop both.', h4: 'Time: O(1) all ops, Space: O(n).'
  },
  {
    number: 150, title: 'Evaluate Reverse Polish Notation', slug: 'evaluate-reverse-polish-notation', difficulty: 'Medium', topic: 'Stack', week: 4,
    fnName: 'evalRPN', pyParam: 'tokens: list[str]', pyReturn: 'int', javaParam: 'String[] tokens', javaReturn: 'int', cppParam: 'vector<string>& tokens', cppReturn: 'int',
    description: 'Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, *, and /.',
    sampleInput: 'tokens = ["2","1","+","3","*"]', sampleOutput: 9,
    h1: 'In post-fix notation, operators apply to the two most recently pushed operands.', h2: 'When encountering an operator, pop b then pop a, apply operation (a op b), and push result.',
    h3: 'Iterate tokens. If number push int(t). If operator pop b, pop a, compute, push back. Be careful with Python integer division toward zero.', h4: 'Time: O(n), Space: O(n).'
  },
  {
    number: 22, title: 'Generate Parentheses', slug: 'generate-parentheses', difficulty: 'Medium', topic: 'Stack', week: 4,
    fnName: 'generateParenthesis', pyParam: 'n: int', pyReturn: 'list[str]', javaParam: 'int n', javaReturn: 'List<String>', cppParam: 'int n', cppReturn: 'vector<string>',
    description: 'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
    sampleInput: 'n = 3', sampleOutput: ["((()))","(()())","(())()","()(())","()()()"],
    h1: 'Only add open parenthesis if open_count < n. Only add closing if close_count < open_count.', h2: 'Backtracking with state counts for open and closed brackets.',
    h3: 'Base case: open == close == n. Recurse with open + 1 if open < n, and close + 1 if close < open.', h4: 'Time: O(4^n / sqrt(n)) [Catalan number], Space: O(n).'
  },
  {
    number: 739, title: 'Daily Temperatures', slug: 'daily-temperatures', difficulty: 'Medium', topic: 'Stack', week: 4,
    fnName: 'dailyTemperatures', pyParam: 'temperatures: list[int]', pyReturn: 'list[int]', javaParam: 'int[] temperatures', javaReturn: 'int[]', cppParam: 'vector<int>& temperatures', cppReturn: 'vector<int>',
    description: 'Given an array of integers temperatures represents daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.',
    sampleInput: 'temperatures = [73,74,75,71,69,72,76,73]', sampleOutput: [1,1,4,2,1,1,0,0],
    h1: 'Finding the next greater element is the classic Monotonic Decreasing Stack problem.', h2: 'Store pair of (temperature, index) in the stack.',
    h3: 'For index i and temp t: while stack and t > stack[-1].temp: prev_i = stack.pop(); res[prev_i] = i - prev_i. Push (t, i).', h4: 'Time: O(n), Space: O(n).'
  },
  {
    number: 853, title: 'Car Fleet', slug: 'car-fleet', difficulty: 'Medium', topic: 'Stack', week: 4,
    fnName: 'carFleet', pyParam: 'target: int, position: list[int], speed: list[int]', pyReturn: 'int', javaParam: 'int target, int[] position, int[] speed', javaReturn: 'int', cppParam: 'int target, vector<int>& position, vector<int>& speed', cppReturn: 'int',
    description: 'There are n cars at given positions driving to a destination at target miles away. A car cannot pass another car ahead of it. Return the number of car fleets.',
    sampleInput: 'target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]', sampleOutput: 3,
    h1: 'Sort cars by starting position descending (closest to target first).', h2: 'Time to arrive for each car is (target - pos) / speed.',
    h3: 'Iterate from closest car. If a car takes <= time than the fleet in front, it merges into that fleet.', h4: 'Time: O(n log n), Space: O(n).'
  },
  {
    number: 84, title: 'Largest Rectangle in Histogram', slug: 'largest-rectangle-in-histogram', difficulty: 'Hard', topic: 'Stack', week: 4,
    fnName: 'largestRectangleArea', pyParam: 'heights: list[int]', pyReturn: 'int', javaParam: 'int[] heights', javaReturn: 'int', cppParam: 'vector<int>& heights', cppReturn: 'int',
    description: 'Given an array of integers heights representing the histogram bar height where width of each bar is 1, return the area of the largest rectangle in the histogram.',
    sampleInput: 'heights = [2,1,5,6,2,3]', sampleOutput: 10,
    h1: 'A bar can extend left and right until encountering a shorter bar.', h2: 'Maintain a monotonic increasing stack storing (index, height).',
    h3: 'When height drops, pop elements from stack and calculate area: height * (current_i - start_i). Update start_i.', h4: 'Time: O(n), Space: O(n).'
  },

  // ─── WEEK 5: Binary Search (7) ───
  {
    number: 704, title: 'Binary Search', slug: 'binary-search', difficulty: 'Easy', topic: 'Binary Search', week: 5,
    fnName: 'search', pyParam: 'nums: list[int], target: int', pyReturn: 'int', javaParam: 'int[] nums, int target', javaReturn: 'int', cppParam: 'vector<int>& nums, int target', cppReturn: 'int',
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index; otherwise, return -1.',
    sampleInput: 'nums = [-1,0,3,5,9,12], target = 9', sampleOutput: 4,
    h1: 'Cut search space in half at each step.', h2: 'Calculate mid = l + (r - l) // 2 to avoid overflow.',
    h3: 'If nums[mid] == target return mid; if nums[mid] < target l = mid + 1; else r = mid - 1.', h4: 'Time: O(log n), Space: O(1).'
  },
  {
    number: 74, title: 'Search a 2D Matrix', slug: 'search-a-2d-matrix', difficulty: 'Medium', topic: 'Binary Search', week: 5,
    fnName: 'searchMatrix', pyParam: 'matrix: list[list[int]], target: int', pyReturn: 'bool', javaParam: 'int[][] matrix, int target', javaReturn: 'boolean', cppParam: 'vector<vector<int>>& matrix, int target', cppReturn: 'bool',
    description: 'You are given an m x n integer matrix matrix with properties: Each row is sorted in ascending order, and the first integer of each row is greater than the last integer of the previous row. Return true if target is in matrix.',
    sampleInput: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', sampleOutput: true,
    h1: 'The entire matrix can be treated as a single flattened 1D sorted array of length m * n.', h2: 'Index mid maps to row = mid // n, col = mid % n.',
    h3: 'Binary search with l = 0, r = (m * n) - 1. Fetch element at matrix[mid // cols][mid % cols].', h4: 'Time: O(log(m * n)), Space: O(1).'
  },
  {
    number: 875, title: 'Koko Eating Bananas', slug: 'koko-eating-bananas', difficulty: 'Medium', topic: 'Binary Search', week: 5,
    fnName: 'minEatingSpeed', pyParam: 'piles: list[int], h: int', pyReturn: 'int', javaParam: 'int[] piles, int h', javaReturn: 'int', cppParam: 'vector<int>& piles, int h', cppReturn: 'int',
    description: 'Koko loves to eat bananas. There are n piles of bananas. Return the minimum integer k such that she can eat all bananas within h hours.',
    sampleInput: 'piles = [3,6,7,11], h = 8', sampleOutput: 4,
    h1: 'Binary search on the answer: eating speed k is between 1 and max(piles).', h2: 'For speed k, hours taken = sum(math.ceil(p / k) for p in piles).',
    h3: 'If hours <= h, k is viable; search left half (r = k). Else search right half (l = k + 1).', h4: 'Time: O(n log(max(piles))), Space: O(1).'
  },
  {
    number: 153, title: 'Find Minimum in Rotated Sorted Array', slug: 'find-minimum-in-rotated-sorted-array', difficulty: 'Medium', topic: 'Binary Search', week: 5,
    fnName: 'findMin', pyParam: 'nums: list[int]', pyReturn: 'int', javaParam: 'int[] nums', javaReturn: 'int', cppParam: 'vector<int>& nums', cppReturn: 'int',
    description: 'Given the sorted rotated array nums of unique elements, return the minimum element of this array in O(log n) time.',
    sampleInput: 'nums = [3,4,5,1,2]', sampleOutput: 1,
    h1: 'Compare nums[mid] with nums[right].', h2: 'If nums[mid] > nums[right], minimum must be in right half (l = mid + 1). Else r = mid.',
    h3: 'Stop when l == r, return nums[l].', h4: 'Time: O(log n), Space: O(1).'
  },
  {
    number: 33, title: 'Search in Rotated Sorted Array', slug: 'search-in-rotated-sorted-array', difficulty: 'Medium', topic: 'Binary Search', week: 5,
    fnName: 'searchRotated', pyParam: 'nums: list[int], target: int', pyReturn: 'int', javaParam: 'int[] nums, int target', javaReturn: 'int', cppParam: 'vector<int>& nums, int target', cppReturn: 'int',
    description: 'Given sorted array nums possibly rotated, return the index of target, or -1 if not in nums.',
    sampleInput: 'nums = [4,5,6,7,0,1,2], target = 0', sampleOutput: 4,
    h1: 'At least one half (left or right of mid) is always normally sorted.', h2: 'If left half is sorted (nums[l] <= nums[mid]): check if target in [nums[l], nums[mid]]. Else check right.',
    h3: 'Adjust l or r based on which half is sorted and whether target falls inside.', h4: 'Time: O(log n), Space: O(1).'
  },
  {
    number: 981, title: 'Time Based Key-Value Store', slug: 'time-based-key-value-store', difficulty: 'Medium', topic: 'Binary Search', week: 5,
    fnName: 'TimeMap', pyParam: '', pyReturn: '', javaParam: '', javaReturn: '', cppParam: '', cppReturn: '',
    description: 'Design a time-based key-value data structure that can store multiple values for same key at different timestamps and retrieve key value at a certain timestamp.',
    sampleInput: '["TimeMap","set","get","get","set","get"]', sampleOutput: [null,null,"bar","bar",null,"bar2"],
    h1: 'Timestamps in set() are strictly increasing. That means values per key are sorted by timestamp!', h2: 'Store list of (val, timestamp) per key. Use Binary Search for get().',
    h3: 'Binary search for greatest timestamp <= target timestamp.', h4: 'Set: O(1), Get: O(log n).'
  },
  {
    number: 4, title: 'Median of Two Sorted Arrays', slug: 'median-of-two-sorted-arrays', difficulty: 'Hard', topic: 'Binary Search', week: 5,
    fnName: 'findMedianSortedArrays', pyParam: 'nums1: list[int], nums2: list[int]', pyReturn: 'float', javaParam: 'int[] nums1, int[] nums2', javaReturn: 'double', cppParam: 'vector<int>& nums1, vector<int>& nums2', cppReturn: 'double',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n, return the median of the two sorted arrays in O(log(min(m, n))) time.',
    sampleInput: 'nums1 = [1,3], nums2 = [2]', sampleOutput: 2.0,
    h1: 'Partition both arrays so left partition contains half the total elements and all elements in left <= all elements in right.', h2: 'Binary search on partition size of smaller array.',
    h3: 'Check A_left <= B_right and B_left <= A_right.', h4: 'Time: O(log(min(m, n))), Space: O(1).'
  },

  // ─── WEEK 6: Linked List (11) ───
  {
    number: 206, title: 'Reverse Linked List', slug: 'reverse-linked-list', difficulty: 'Easy', topic: 'Linked List', week: 6,
    fnName: 'reverseList', pyParam: 'head: Optional[ListNode]', pyReturn: 'Optional[ListNode]', javaParam: 'ListNode head', javaReturn: 'ListNode', cppParam: 'ListNode* head', cppReturn: 'ListNode*',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    sampleInput: 'head = [1,2,3,4,5]', sampleOutput: [5,4,3,2,1],
    h1: 'Track prev, curr, and next pointers.', h2: 'Iteratively rewire curr.next to prev.',
    h3: 'While curr: nxt = curr.next; curr.next = prev; prev = curr; curr = nxt. Return prev.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 21, title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', difficulty: 'Easy', topic: 'Linked List', week: 6,
    fnName: 'mergeTwoLists', pyParam: 'list1: Optional[ListNode], list2: Optional[ListNode]', pyReturn: 'Optional[ListNode]', javaParam: 'ListNode list1, ListNode list2', javaReturn: 'ListNode', cppParam: 'ListNode* list1, ListNode* list2', cppReturn: 'ListNode*',
    description: 'Merge two sorted linked lists and return it as a sorted list.',
    sampleInput: 'l1 = [1,2,4], l2 = [1,3,4]', sampleOutput: [1,1,2,3,4,4],
    h1: 'Use a dummy head node to simplify edge cases.', h2: 'Advance the pointer that holds the smaller value.',
    h3: 'dummy = ListNode(); tail = dummy. While l1 and l2: choose smaller, tail.next = smaller. Attach remaining. Return dummy.next.', h4: 'Time: O(n + m), Space: O(1).'
  },
  {
    number: 143, title: 'Reorder List', slug: 'reorder-list', difficulty: 'Medium', topic: 'Linked List', week: 6,
    fnName: 'reorderList', pyParam: 'head: Optional[ListNode]', pyReturn: 'None', javaParam: 'ListNode head', javaReturn: 'void', cppParam: 'ListNode* head', cppReturn: 'void',
    description: 'You are given the head of a singly linked-list: L0 → L1 → … → Ln - 1 → Ln. Reorder it to: L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …',
    sampleInput: 'head = [1,2,3,4]', sampleOutput: [1,4,2,3],
    h1: 'Break the problem into 3 parts: find middle, reverse second half, and merge halves.', h2: 'Use fast and slow pointers to find middle.',
    h3: 'Slow and fast runner to split. Reverse second half. Interleave nodes from first and second halves.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 19, title: 'Remove Nth Node From End of List', slug: 'remove-nth-node-from-end-of-list', difficulty: 'Medium', topic: 'Linked List', week: 6,
    fnName: 'removeNthFromEnd', pyParam: 'head: Optional[ListNode], n: int', pyReturn: 'Optional[ListNode]', javaParam: 'ListNode head, int n', javaReturn: 'ListNode', cppParam: 'ListNode* head, int n', cppReturn: 'ListNode*',
    description: 'Given the head of a linked list, remove the nth node from the end of the list and return its head.',
    sampleInput: 'head = [1,2,3,4,5], n = 2', sampleOutput: [1,2,3,5],
    h1: 'Use two pointers separated by an offset of n nodes.', h2: 'When the right pointer reaches the end, left pointer is immediately before node to remove.',
    h3: 'Use dummy node before head. Advance right pointer by n + 1. Move both until right is None. left.next = left.next.next.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 138, title: 'Copy List with Random Pointer', slug: 'copy-list-with-random-pointer', difficulty: 'Medium', topic: 'Linked List', week: 6,
    fnName: 'copyRandomList', pyParam: 'head: "Optional[Node]"', pyReturn: '"Optional[Node]"', javaParam: 'Node head', javaReturn: 'Node', cppParam: 'Node* head', cppReturn: 'Node*',
    description: 'Construct a deep copy of a linked list where each node contains an additional random pointer.',
    sampleInput: 'head = [[7,null],[13,0],[11,4],[10,2],[1,0]]', sampleOutput: [[7,null],[13,0],[11,4],[10,2],[1,0]],
    h1: 'Use a hash map mapping old node -> new node.', h2: 'First pass creates clone nodes; second pass wires next and random pointers.',
    h3: 'm = {None: None}. For curr in list: m[curr] = Node(curr.val). Second pass: m[curr].next = m[curr.next], m[curr].random = m[curr.random].', h4: 'Time: O(n), Space: O(n).'
  },
  {
    number: 2, title: 'Add Two Numbers', slug: 'add-two-numbers', difficulty: 'Medium', topic: 'Linked List', week: 6,
    fnName: 'addTwoNumbers', pyParam: 'l1: Optional[ListNode], l2: Optional[ListNode]', pyReturn: 'Optional[ListNode]', javaParam: 'ListNode l1, ListNode l2', javaReturn: 'ListNode', cppParam: 'ListNode* l1, ListNode* l2', cppReturn: 'ListNode*',
    description: 'You are given two non-empty linked lists representing two non-negative integers in reverse order. Add the two numbers and return the sum as a linked list.',
    sampleInput: 'l1 = [2,4,3], l2 = [5,6,4]', sampleOutput: [7,0,8],
    h1: 'Simulate elementary school addition with a carry variable.', h2: 'Traverse both lists while l1 or l2 or carry > 0.',
    h3: 'val = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry. carry = val // 10. Append val % 10.', h4: 'Time: O(max(m, n)), Space: O(1) auxiliary.'
  },
  {
    number: 141, title: 'Linked List Cycle', slug: 'linked-list-cycle', difficulty: 'Easy', topic: 'Linked List', week: 6,
    fnName: 'hasCycle', pyParam: 'head: Optional[ListNode]', pyReturn: 'bool', javaParam: 'ListNode head', javaReturn: 'boolean', cppParam: 'ListNode* head', cppReturn: 'bool',
    description: 'Given head, the head of a linked list, determine if the linked list has a cycle in it.',
    sampleInput: 'head = [3,2,0,-4], pos = 1', sampleOutput: true,
    h1: 'Floyd’s Tortoise and Hare algorithm.', h2: 'Slow advances 1 step, fast advances 2 steps.',
    h3: 'If fast and fast.next reach None: no cycle. If fast == slow: cycle exists.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 287, title: 'Find the Duplicate Number', slug: 'find-the-duplicate-number', difficulty: 'Medium', topic: 'Linked List', week: 6,
    fnName: 'findDuplicate', pyParam: 'nums: list[int]', pyReturn: 'int', javaParam: 'int[] nums', javaReturn: 'int', cppParam: 'vector<int>& nums', cppReturn: 'int',
    description: 'Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive, find duplicate without modifying array and in O(1) space.',
    sampleInput: 'nums = [1,3,4,2,2]', sampleOutput: 2,
    h1: 'Treat the array values as pointers: index -> nums[index].', h2: 'Since numbers are in [1, n], a duplicate creates a cycle intersection.',
    h3: 'Phase 1: slow = nums[slow], fast = nums[nums[fast]] until intersection. Phase 2: slow2 = 0; move both 1 step until they meet at cycle entrance.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 146, title: 'LRU Cache', slug: 'lru-cache', difficulty: 'Medium', topic: 'Linked List', week: 6,
    fnName: 'LRUCache', pyParam: 'capacity: int', pyReturn: '', javaParam: 'int capacity', javaReturn: '', cppParam: 'int capacity', cppReturn: '',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) get and put.',
    sampleInput: '["LRUCache","put","put","get","put","get","put","get","get","get"]', sampleOutput: [null,null,null,1,null,-1,null,-1,3,4],
    h1: 'Combine a Hash Map for O(1) lookup with a Doubly Linked List for O(1) node reordering.', h2: 'Use dummy head and tail nodes to avoid null pointer edge cases.',
    h3: 'get: move node to head (most recent). put: update/insert at head; if over capacity, evict node before tail.', h4: 'Time: O(1) for both get and put, Space: O(capacity).'
  },
  {
    number: 23, title: 'Merge k Sorted Lists', slug: 'merge-k-sorted-lists', difficulty: 'Hard', topic: 'Linked List', week: 6,
    fnName: 'mergeKLists', pyParam: 'lists: list[Optional[ListNode]]', pyReturn: 'Optional[ListNode]', javaParam: 'ListNode[] lists', javaReturn: 'ListNode', cppParam: 'vector<ListNode*>& lists', cppReturn: 'ListNode*',
    description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    sampleInput: 'lists = [[1,4,5],[1,3,4],[2,6]]', sampleOutput: [1,1,2,3,4,4,5,6],
    h1: 'Divide and Conquer: pair-wise merge lists similar to Merge Sort.', h2: 'Merging pairs reduces k lists to k/2, then k/4, taking log(k) rounds.',
    h3: 'While len(lists) > 1: merge pairs using Merge Two Sorted Lists function. Return lists[0].', h4: 'Time: O(N log k), Space: O(1) auxiliary.'
  },
  {
    number: 25, title: 'Reverse Nodes in k-Group', slug: 'reverse-nodes-in-k-group', difficulty: 'Hard', topic: 'Linked List', week: 6,
    fnName: 'reverseKGroup', pyParam: 'head: Optional[ListNode], k: int', pyReturn: 'Optional[ListNode]', javaParam: 'ListNode head, int k', javaReturn: 'ListNode', cppParam: 'ListNode* head, int k', cppReturn: 'ListNode*',
    description: 'Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.',
    sampleInput: 'head = [1,2,3,4,5], k = 2', sampleOutput: [2,1,4,3,5],
    h1: 'Check if there are at least k nodes remaining before reversing.', h2: 'Reverse k nodes and reconnect previous group tail and next group head.',
    h3: 'Find kth node. If exists, reverse the k-node segment, rewire pointers, and repeat for next group.', h4: 'Time: O(n), Space: O(1).'
  },

  // ─── WEEK 7: Trees (15) ───
  {
    number: 226, title: 'Invert Binary Tree', slug: 'invert-binary-tree', difficulty: 'Easy', topic: 'Trees', week: 7,
    fnName: 'invertTree', pyParam: 'root: Optional[TreeNode]', pyReturn: 'Optional[TreeNode]', javaParam: 'TreeNode root', javaReturn: 'TreeNode', cppParam: 'TreeNode* root', cppReturn: 'TreeNode*',
    description: 'Given the root of a binary tree, invert the tree, and return its root.',
    sampleInput: 'root = [4,2,7,1,3,6,9]', sampleOutput: [4,7,2,9,6,3,1],
    h1: 'Swap left and right children recursively.', h2: 'Base case: if root is None, return None.',
    h3: 'root.left, root.right = invertTree(root.right), invertTree(root.left). Return root.', h4: 'Time: O(n), Space: O(h).'
  },
  {
    number: 104, title: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree', difficulty: 'Easy', topic: 'Trees', week: 7,
    fnName: 'maxDepth', pyParam: 'root: Optional[TreeNode]', pyReturn: 'int', javaParam: 'TreeNode root', javaReturn: 'int', cppParam: 'TreeNode* root', cppReturn: 'int',
    description: 'Given the root of a binary tree, return its maximum depth.',
    sampleInput: 'root = [3,9,20,null,null,15,7]', sampleOutput: 3,
    h1: 'Depth is 1 + max(depth(left), depth(right)).', h2: 'Recursive DFS or iterative BFS with queue.',
    h3: 'If not root return 0. Return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right)).', h4: 'Time: O(n), Space: O(h).'
  },
  {
    number: 543, title: 'Diameter of Binary Tree', slug: 'diameter-of-binary-tree', difficulty: 'Easy', topic: 'Trees', week: 7,
    fnName: 'diameterOfBinaryTree', pyParam: 'root: Optional[TreeNode]', pyReturn: 'int', javaParam: 'TreeNode root', javaReturn: 'int', cppParam: 'TreeNode* root', cppReturn: 'int',
    description: 'Given the root of a binary tree, return the length of the diameter of the tree (longest path between any two nodes).',
    sampleInput: 'root = [1,2,3,4,5]', sampleOutput: 3,
    h1: 'The longest path passing through any node is height(left) + height(right).', h2: 'Compute height recursively and update global diameter at each node.',
    h3: 'def dfs(node): if not node: return 0. l, r = dfs(node.left), dfs(node.right). self.res = max(self.res, l + r). Return 1 + max(l, r).', h4: 'Time: O(n), Space: O(h).'
  },
  {
    number: 110, title: 'Balanced Binary Tree', slug: 'balanced-binary-tree', difficulty: 'Easy', topic: 'Trees', week: 7,
    fnName: 'isBalanced', pyParam: 'root: Optional[TreeNode]', pyReturn: 'bool', javaParam: 'TreeNode root', javaReturn: 'boolean', cppParam: 'TreeNode* root', cppReturn: 'bool',
    description: 'Given a binary tree, determine if it is height-balanced (left and right subtrees of every node differ in height by <= 1).',
    sampleInput: 'root = [3,9,20,null,null,15,7]', sampleOutput: true,
    h1: 'Bottom-up DFS returns -1 if subtree is already unbalanced, avoiding repeated height calls.', h2: 'If abs(left_h - right_h) > 1, return -1.',
    h3: 'Return True if dfs(root) != -1.', h4: 'Time: O(n), Space: O(h).'
  },
  {
    number: 100, title: 'Same Tree', slug: 'same-tree', difficulty: 'Easy', topic: 'Trees', week: 7,
    fnName: 'isSameTree', pyParam: 'p: Optional[TreeNode], q: Optional[TreeNode]', pyReturn: 'bool', javaParam: 'TreeNode p, TreeNode q', javaReturn: 'boolean', cppParam: 'TreeNode* p, TreeNode* q', cppReturn: 'bool',
    description: 'Given the roots of two binary trees p and q, write a function to check if they are the same or not.',
    sampleInput: 'p = [1,2,3], q = [1,2,3]', sampleOutput: true,
    h1: 'Both trees are the same if root values match and both left and right subtrees match.', h2: 'Base cases: both None -> True; one None -> False.',
    h3: 'Return p.val == q.val and isSameTree(p.left, q.left) and isSameTree(p.right, q.right).', h4: 'Time: O(n), Space: O(h).'
  },
  {
    number: 572, title: 'Subtree of Another Tree', slug: 'subtree-of-another-tree', difficulty: 'Easy', topic: 'Trees', week: 7,
    fnName: 'isSubtree', pyParam: 'root: Optional[TreeNode], subRoot: Optional[TreeNode]', pyReturn: 'bool', javaParam: 'TreeNode root, TreeNode subRoot', javaReturn: 'boolean', cppParam: 'TreeNode* root, TreeNode* subRoot', cppReturn: 'bool',
    description: 'Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot.',
    sampleInput: 'root = [3,4,5,1,2], subRoot = [4,1,2]', sampleOutput: true,
    h1: 'Check if isSameTree(root, subRoot). If not, check left and right children.', h2: 'Base cases: if not subRoot return True; if not root return False.',
    h3: 'Return isSameTree(root, subRoot) or isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot).', h4: 'Time: O(n * m), Space: O(h).'
  },
  {
    number: 235, title: 'Lowest Common Ancestor of a Binary Search Tree', slug: 'lowest-common-ancestor-of-a-binary-search-tree', difficulty: 'Medium', topic: 'Trees', week: 7,
    fnName: 'lowestCommonAncestor', pyParam: 'root: "TreeNode", p: "TreeNode", q: "TreeNode"', pyReturn: '"TreeNode"', javaParam: 'TreeNode root, TreeNode p, TreeNode q', javaReturn: 'TreeNode', cppParam: 'TreeNode* root, TreeNode* p, TreeNode* q', cppReturn: 'TreeNode*',
    description: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.',
    sampleInput: 'root = [6,2,8,0,4,7,9], p = 2, q = 8', sampleOutput: 6,
    h1: 'In a BST, values to the left are smaller and values to the right are greater.', h2: 'If both p and q are greater than root, LCA is in right subtree. If both smaller, left subtree. Otherwise root is split point.',
    h3: 'While curr: if p.val > curr.val and q.val > curr.val: curr = curr.right; elif p.val < curr.val and q.val < curr.val: curr = curr.left; else: return curr.', h4: 'Time: O(h), Space: O(1).'
  },
  {
    number: 102, title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal', difficulty: 'Medium', topic: 'Trees', week: 7,
    fnName: 'levelOrder', pyParam: 'root: Optional[TreeNode]', pyReturn: 'list[list[int]]', javaParam: 'TreeNode root', javaReturn: 'List<List<Integer>>', cppParam: 'TreeNode* root', cppReturn: 'vector<vector<int>>',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
    sampleInput: 'root = [3,9,20,null,null,15,7]', sampleOutput: [[3],[9,20],[15,7]],
    h1: 'Breadth-First Search (BFS) using a Queue.', h2: 'Snapshot queue length at start of each while iteration to process exactly one level.',
    h3: 'queue = deque([root]). For _ in range(len(queue)): node = queue.popleft(); level.append(node.val); add children. Append level to res.', h4: 'Time: O(n), Space: O(n).'
  },
  {
    number: 199, title: 'Binary Tree Right Side View', slug: 'binary-tree-right-side-view', difficulty: 'Medium', topic: 'Trees', week: 7,
    fnName: 'rightSideView', pyParam: 'root: Optional[TreeNode]', pyReturn: 'list[int]', javaParam: 'TreeNode root', javaReturn: 'List<Integer>', cppParam: 'TreeNode* root', cppReturn: 'vector<int>',
    description: 'Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.',
    sampleInput: 'root = [1,2,3,null,5,null,4]', sampleOutput: [1,3,4],
    h1: 'The right side view consists of the rightmost node at each level.', h2: 'Run BFS level order traversal and pick the last element of each level queue.',
    h3: 'Queue-based BFS. At each level, take level[-1].val.', h4: 'Time: O(n), Space: O(n).'
  },
  {
    number: 1448, title: 'Count Good Nodes in Binary Tree', slug: 'count-good-nodes-in-binary-tree', difficulty: 'Medium', topic: 'Trees', week: 7,
    fnName: 'goodNodes', pyParam: 'root: TreeNode', pyReturn: 'int', javaParam: 'TreeNode root', javaReturn: 'int', cppParam: 'TreeNode* root', cppReturn: 'int',
    description: 'Given a binary tree root, a node X in the tree is named good if in the path from root to X there are no nodes with a value greater than X.',
    sampleInput: 'root = [3,1,4,3,null,1,5]', sampleOutput: 4,
    h1: 'Pass the maximum value seen along the current path into the recursive DFS call.', h2: 'If node.val >= max_so_far, node is good (+1), and new max is node.val.',
    h3: 'dfs(node, max_val): count = 1 if node.val >= max_val else 0; count += dfs(node.left, max(max_val, node.val)) + dfs(node.right, ...).', h4: 'Time: O(n), Space: O(h).'
  },
  {
    number: 98, title: 'Validate Binary Search Tree', slug: 'validate-binary-search-tree', difficulty: 'Medium', topic: 'Trees', week: 7,
    fnName: 'isValidBST', pyParam: 'root: Optional[TreeNode]', pyReturn: 'bool', javaParam: 'TreeNode root', javaReturn: 'boolean', cppParam: 'TreeNode* root', cppReturn: 'bool',
    description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
    sampleInput: 'root = [2,1,3]', sampleOutput: true,
    h1: 'Checking just left child < root < right child is not enough; the invariant applies to the whole subtree!', h2: 'Pass a valid range (min_val, max_val) to each node.',
    h3: 'dfs(node, low, high): if not node return True; if not (low < node.val < high) return False; return dfs(node.left, low, node.val) and dfs(node.right, node.val, high).', h4: 'Time: O(n), Space: O(h).'
  },
  {
    number: 230, title: 'Kth Smallest Element in a BST', slug: 'kth-smallest-element-in-a-bst', difficulty: 'Medium', topic: 'Trees', week: 7,
    fnName: 'kthSmallest', pyParam: 'root: Optional[TreeNode], k: int', pyReturn: 'int', javaParam: 'TreeNode root, int k', javaReturn: 'int', cppParam: 'TreeNode* root, int k', cppReturn: 'int',
    description: 'Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.',
    sampleInput: 'root = [3,1,4,null,2], k = 1', sampleOutput: 1,
    h1: 'In-order traversal of a BST visits nodes in strictly ascending sorted order.', h2: 'Iterative in-order using a stack stops immediately when k elements have been visited.',
    h3: 'Push left nodes to stack. Pop node, k -= 1. If k == 0 return node.val. Move to node.right.', h4: 'Time: O(h + k), Space: O(h).'
  },
  {
    number: 105, title: 'Construct Binary Tree from Preorder and Inorder Traversal', slug: 'construct-binary-tree-from-preorder-and-inorder-traversal', difficulty: 'Medium', topic: 'Trees', week: 7,
    fnName: 'buildTree', pyParam: 'preorder: list[int], inorder: list[int]', pyReturn: 'Optional[TreeNode]', javaParam: 'int[] preorder, int[] inorder', javaReturn: 'TreeNode', cppParam: 'vector<int>& preorder, vector<int>& inorder', cppReturn: 'TreeNode*',
    description: 'Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.',
    sampleInput: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]', sampleOutput: [3,9,20,null,null,15,7],
    h1: 'First element of preorder is always the root.', h2: 'Root divides inorder into left subtree elements and right subtree elements.',
    h3: 'mid = inorder.index(preorder[0]). root.left = buildTree(preorder[1:mid+1], inorder[:mid]), root.right = buildTree(preorder[mid+1:], inorder[mid+1:]).', h4: 'Time: O(n), Space: O(n).'
  },
  {
    number: 124, title: 'Binary Tree Maximum Path Sum', slug: 'binary-tree-maximum-path-sum', difficulty: 'Hard', topic: 'Trees', week: 7,
    fnName: 'maxPathSum', pyParam: 'root: Optional[TreeNode]', pyReturn: 'int', javaParam: 'TreeNode root', javaReturn: 'int', cppParam: 'TreeNode* root', cppReturn: 'int',
    description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. Return the maximum path sum of any non-empty path.',
    sampleInput: 'root = [-10,9,20,null,null,15,7]', sampleOutput: 42,
    h1: 'At any node, the maximum path with that node as the highest split point is node.val + max(0, left) + max(0, right).', h2: 'To return to parent, the node can only choose one branch (left or right).',
    h3: 'Compute max gain: node.val + max(dfs(left), dfs(right)). Update global max at each split.', h4: 'Time: O(n), Space: O(h).'
  },
  {
    number: 297, title: 'Serialize and Deserialize Binary Tree', slug: 'serialize-and-deserialize-binary-tree', difficulty: 'Hard', topic: 'Trees', week: 7,
    fnName: 'Codec', pyParam: '', pyReturn: '', javaParam: '', javaReturn: '', cppParam: '', cppReturn: '',
    description: 'Design an algorithm to serialize and deserialize a binary tree into a string and back.',
    sampleInput: 'root = [1,2,3,null,null,4,5]', sampleOutput: [1,2,3,null,null,4,5],
    h1: 'Preorder traversal with "N" marker for null nodes produces an unambiguous representation.', h2: 'Delimiter like "," joins values.',
    h3: 'Serialize: DFS preorder appending val or "N". Deserialize: queue of tokens, recursively rebuild root, root.left, root.right.', h4: 'Time: O(n), Space: O(n).'
  },

  // ─── WEEK 8: Tries & Heap / Priority Queue (10) ───
  {
    number: 208, title: 'Implement Trie (Prefix Tree)', slug: 'implement-trie-prefix-tree', difficulty: 'Medium', topic: 'Tries & Heap', week: 8,
    fnName: 'Trie', pyParam: '', pyReturn: '', javaParam: '', javaReturn: '', cppParam: '', cppReturn: '',
    description: 'A trie (pronounced "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.',
    sampleInput: '["Trie","insert","search","startsWith"]', sampleOutput: [null,null,true,true],
    h1: 'Each TrieNode has a hash map of children characters and an is_end boolean.', h2: 'Traverse character by character down the tree.',
    h3: 'insert: create nodes as needed, set is_end = True. search: match all chars and check is_end. startsWith: match all chars.', h4: 'Time: O(word length) for all ops, Space: O(total chars).'
  },
  {
    number: 211, title: 'Design Add and Search Words Data Structure', slug: 'design-add-and-search-words-data-structure', difficulty: 'Medium', topic: 'Tries & Heap', week: 8,
    fnName: 'WordDictionary', pyParam: '', pyReturn: '', javaParam: '', javaReturn: '', cppParam: '', cppReturn: '',
    description: 'Design a data structure that supports adding new words and finding if a string matches any previously added string, where "." can match any letter.',
    sampleInput: '["WordDictionary","addWord","addWord","search","search"]', sampleOutput: [null,null,null,true,true],
    h1: 'Trie structure with recursive DFS for search.', h2: 'When encountering ".", branch into all available children of current node.',
    h3: 'If c == ".": return any(dfs(child, i + 1) for child in node.children.values()). Else check exact character.', h4: 'Time: O(m) for normal words, O(26^m) worst-case with dots.'
  },
  {
    number: 212, title: 'Word Search II', slug: 'word-search-ii', difficulty: 'Hard', topic: 'Tries & Heap', week: 8,
    fnName: 'findWords', pyParam: 'board: list[list[str]], words: list[str]', pyReturn: 'list[str]', javaParam: 'char[][] board, String[] words', javaReturn: 'List<String>', cppParam: 'vector<vector<char>>& board, vector<string>& words', cppReturn: 'vector<string>',
    description: 'Given an m x n board of characters and a list of strings words, return all words on the board.',
    sampleInput: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', sampleOutput: ["eat","oath"],
    h1: 'Searching each word individually runs into Time Limit Exceeded. Build a Trie from words!', h2: 'Run DFS on board, stepping through Trie nodes simultaneously.',
    h3: 'Insert words into Trie. Backtrack 4 directions. Prune leaves once word found to speed up search.', h4: 'Time: O(M * N * 4^L), Space: O(words total chars).'
  },
  {
    number: 703, title: 'Kth Largest Element in a Stream', slug: 'kth-largest-element-in-a-stream', difficulty: 'Easy', topic: 'Tries & Heap', week: 8,
    fnName: 'KthLargest', pyParam: 'k: int, nums: list[int]', pyReturn: '', javaParam: 'int k, int[] nums', javaReturn: '', cppParam: 'int k, vector<int>& nums', cppReturn: '',
    description: 'Design a class to find the kth largest element in a stream.',
    sampleInput: '["KthLargest","add","add","add"]', sampleOutput: [null,4,5,5],
    h1: 'A Min-Heap of size k keeps the k largest elements seen so far at all times.', h2: 'The root of a min-heap of size k is exactly the kth largest element.',
    h3: 'Heapify nums, pop until len == k. On add(val): push val, if len > k: heappop. Return heap[0].', h4: 'Time: O(log k) per add, Space: O(k).'
  },
  {
    number: 1046, title: 'Last Stone Weight', slug: 'last-stone-weight', difficulty: 'Easy', topic: 'Tries & Heap', week: 8,
    fnName: 'lastStoneWeight', pyParam: 'stones: list[int]', pyReturn: 'int', javaParam: 'int[] stones', javaReturn: 'int', cppParam: 'vector<int>& stones', cppReturn: 'int',
    description: 'You are given an array of integers stones where stones[i] is the weight of the ith stone. Smash two heaviest stones until at most one remains.',
    sampleInput: 'stones = [2,7,4,1,8,1]', sampleOutput: 1,
    h1: 'Use a Max-Heap to extract the two largest stones in O(log n) time.', h2: 'Python only has min-heap: invert numbers (-x) to simulate max-heap.',
    h3: 'heap = [-s for s in stones]; heapify. While len > 1: s1, s2 = heappop, heappop; if s1 != s2: heappush(heap, s1 - s2). Return -heap[0] if heap else 0.', h4: 'Time: O(n log n), Space: O(n).'
  },
  {
    number: 973, title: 'K Closest Points to Origin', slug: 'k-closest-points-to-origin', difficulty: 'Medium', topic: 'Tries & Heap', week: 8,
    fnName: 'kClosest', pyParam: 'points: list[list[int]], k: int', pyReturn: 'list[list[int]]', javaParam: 'int[][] points, int k', javaReturn: 'int[][]', cppParam: 'vector<vector<int>>& points, int k', cppReturn: 'vector<vector<int>>',
    description: 'Given an array of points where points[i] = [xi, yi] and an integer k, return the k closest points to origin (0, 0).',
    sampleInput: 'points = [[1,3],[-2,2]], k = 1', sampleOutput: [[-2,2]],
    h1: 'Distance is x^2 + y^2 (no need to compute square root).', h2: 'Max-heap of size k or Quickselect.',
    h3: 'Maintain max-heap of size k storing (-dist, point). If heap size > k, pop farthest point.', h4: 'Time: O(n log k), Space: O(k).'
  },
  {
    number: 215, title: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array', difficulty: 'Medium', topic: 'Tries & Heap', week: 8,
    fnName: 'findKthLargest', pyParam: 'nums: list[int], k: int', pyReturn: 'int', javaParam: 'int[] nums, int k', javaReturn: 'int', cppParam: 'vector<int>& nums, int k', cppReturn: 'int',
    description: 'Given an integer array nums and an integer k, return the kth largest element in the array.',
    sampleInput: 'nums = [3,2,1,5,6,4], k = 2', sampleOutput: 5,
    h1: 'Quickselect algorithm runs in average O(n) time.', h2: 'Min-heap of size k runs in O(n log k).',
    h3: 'heap = nums[:k]; heapify. For x in nums[k:]: if x > heap[0]: heappushpop(heap, x). Return heap[0].', h4: 'Time: O(n log k), Space: O(k).'
  },
  {
    number: 621, title: 'Task Scheduler', slug: 'task-scheduler', difficulty: 'Medium', topic: 'Tries & Heap', week: 8,
    fnName: 'leastInterval', pyParam: 'tasks: list[str], n: int', pyReturn: 'int', javaParam: 'char[] tasks, int n', javaReturn: 'int', cppParam: 'vector<char>& tasks, int n', cppReturn: 'int',
    description: 'Given a characters array tasks representing tasks a CPU must do, and cooldown period n, return minimum intervals needed.',
    sampleInput: 'tasks = ["A","A","A","B","B","B"], n = 2', sampleOutput: 8,
    h1: 'The most frequent task determines the framework of idle intervals.', h2: 'Max frequency count creates (max_count - 1) chunks of size (n + 1).',
    h3: 'Calculate max_freq and number of tasks with max_freq. Formula: max(len(tasks), (max_freq - 1) * (n + 1) + count_max_tasks).', h4: 'Time: O(n), Space: O(26) = O(1).'
  },
  {
    number: 355, title: 'Design Twitter', slug: 'design-twitter', difficulty: 'Medium', topic: 'Tries & Heap', week: 8,
    fnName: 'Twitter', pyParam: '', pyReturn: '', javaParam: '', javaReturn: '', cppParam: '', cppReturn: '',
    description: 'Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and see 10 most recent tweets.',
    sampleInput: '["Twitter","postTweet","getNewsFeed","follow","postTweet","getNewsFeed"]', sampleOutput: [null,null,[5],null,null,[6,5]],
    h1: 'getNewsFeed merges sorted lists of tweets from followed users.', h2: 'Use a Max-Heap to merge the most recent tweets similar to Merge K Sorted Lists.',
    h3: 'User map tracks followers and tweet lists (with decrementing timestamp). Heap pulls 10 newest tweets.', h4: 'Post: O(1), Follow: O(1), Feed: O(k log users).'
  },
  {
    number: 295, title: 'Find Median from Data Stream', slug: 'find-median-from-data-stream', difficulty: 'Hard', topic: 'Tries & Heap', week: 8,
    fnName: 'MedianFinder', pyParam: '', pyReturn: '', javaParam: '', javaReturn: '', cppParam: '', cppReturn: '',
    description: 'The median is the middle value in an ordered integer list. Design a data structure that supports adding numbers and computing current median in O(1).',
    sampleInput: '["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]', sampleOutput: [null,null,null,1.5,null,2.0],
    h1: 'Split the data into two halves: small half in Max-Heap, large half in Min-Heap.', h2: 'Keep sizes balanced so len(small) == len(large) or len(small) == len(large) + 1.',
    h3: 'Push to small, balance to large, re-balance size diff <= 1. Median is top of small or average of both tops.', h4: 'Add: O(log n), Find: O(1).'
  },

  // ─── WEEK 9: Backtracking (9) ───
  {
    number: 78, title: 'Subsets', slug: 'subsets', difficulty: 'Medium', topic: 'Backtracking', week: 9,
    fnName: 'subsets', pyParam: 'nums: list[int]', pyReturn: 'list[list[int]]', javaParam: 'int[] nums', javaReturn: 'List<List<Integer>>', cppParam: 'vector<int>& nums', cppReturn: 'vector<vector<int>>',
    description: 'Given an integer array nums of unique elements, return all possible subsets (the power set).',
    sampleInput: 'nums = [1,2,3]', sampleOutput: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]],
    h1: 'At each element, you have two choices: include it or exclude it.', h2: 'Backtracking DFS decision tree of depth n.',
    h3: 'dfs(i, current): res.append(current[:]). For j in range(i, len(nums)): current.append(nums[j]); dfs(j + 1, current); current.pop().', h4: 'Time: O(n * 2^n), Space: O(n).'
  },
  {
    number: 39, title: 'Combination Sum', slug: 'combination-sum', difficulty: 'Medium', topic: 'Backtracking', week: 9,
    fnName: 'combinationSum', pyParam: 'candidates: list[int], target: int', pyReturn: 'list[list[int]]', javaParam: 'int[] candidates, int target', javaReturn: 'List<List<Integer>>', cppParam: 'vector<int>& candidates, int target', cppReturn: 'vector<vector<int>>',
    description: 'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations where chosen numbers sum to target.',
    sampleInput: 'candidates = [2,3,6,7], target = 7', sampleOutput: [[2,2,3],[7]],
    h1: 'The same number may be chosen unlimited times, so index does not advance on include.', h2: 'Base cases: total == target (save), or total > target / i >= len (return).',
    h3: 'dfs(i, current, total): include candidates[i] (recurse on i); exclude candidates[i] (recurse on i + 1).', h4: 'Time: O(2^(target / min_val)), Space: O(target / min_val).'
  },
  {
    number: 46, title: 'Permutations', slug: 'permutations', difficulty: 'Medium', topic: 'Backtracking', week: 9,
    fnName: 'permute', pyParam: 'nums: list[int]', pyReturn: 'list[list[int]]', javaParam: 'int[] nums', javaReturn: 'List<List<Integer>>', cppParam: 'vector<int>& nums', cppReturn: 'vector<vector<int>>',
    description: 'Given an array nums of distinct integers, return all the possible permutations.',
    sampleInput: 'nums = [1,2,3]', sampleOutput: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]],
    h1: 'At each step, select an unused number from nums.', h2: 'Use a boolean array or set to track visited elements in the current permutation.',
    h3: 'Backtrack: pick unused, append, recurse, pop.', h4: 'Time: O(n * n!), Space: O(n).'
  },
  {
    number: 90, title: 'Subsets II', slug: 'subsets-ii', difficulty: 'Medium', topic: 'Backtracking', week: 9,
    fnName: 'subsetsWithDup', pyParam: 'nums: list[int]', pyReturn: 'list[list[int]]', javaParam: 'int[] nums', javaReturn: 'List<List<Integer>>', cppParam: 'vector<int>& nums', cppReturn: 'vector<vector<int>>',
    description: 'Given an integer array nums that may contain duplicates, return all possible subsets (the power set). The solution set must not contain duplicate subsets.',
    sampleInput: 'nums = [1,2,2]', sampleOutput: [[],[1],[1,2],[1,2,2],[2],[2,2]],
    h1: 'Sort array first to place identical elements adjacent.', h2: 'Skip duplicate choices at the same recursion depth: if i > start and nums[i] == nums[i-1] continue.',
    h3: 'Sort nums. In backtracking loop: if j > i and nums[j] == nums[j-1]: continue. Append, recurse, pop.', h4: 'Time: O(n * 2^n), Space: O(n).'
  },
  {
    number: 40, title: 'Combination Sum II', slug: 'combination-sum-ii', difficulty: 'Medium', topic: 'Backtracking', week: 9,
    fnName: 'combinationSum2', pyParam: 'candidates: list[int], target: int', pyReturn: 'list[list[int]]', javaParam: 'int[] candidates, int target', javaReturn: 'List<List<Integer>>', cppParam: 'vector<int>& candidates, int target', cppReturn: 'vector<vector<int>>',
    description: 'Given a collection of candidate numbers and a target, find all unique combinations where each number may only be used once.',
    sampleInput: 'candidates = [10,1,2,7,6,1,5], target = 8', sampleOutput: [[1,1,6],[1,2,5],[1,7],[2,6]],
    h1: 'Sort candidates. Skip duplicate candidate at same loop level.', h2: 'Advance index i + 1 so each element is used only once.',
    h3: 'dfs(i, path, target): for j in range(i, len): if j > i and candidates[j] == candidates[j-1] continue; if candidates[j] > target break; dfs(j+1, path+[candidates[j]], target-candidates[j]).', h4: 'Time: O(2^n), Space: O(n).'
  },
  {
    number: 79, title: 'Word Search', slug: 'word-search', difficulty: 'Medium', topic: 'Backtracking', week: 9,
    fnName: 'exist', pyParam: 'board: list[list[str]], word: str', pyReturn: 'bool', javaParam: 'char[][] board, String word', javaReturn: 'boolean', cppParam: 'vector<vector<char>>& board, string word', cppReturn: 'bool',
    description: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid.',
    sampleInput: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', sampleOutput: true,
    h1: 'Explore 4 directions recursively. Temporarily mark cell as visited.', h2: 'Base case: index == len(word) -> True.',
    h3: 'dfs(r, c, i): check bounds, match board[r][c] == word[i]. Temporarily replace char with "#", recurse 4 neighbors, restore char.', h4: 'Time: O(m * n * 3^L), Space: O(L).'
  },
  {
    number: 131, title: 'Palindrome Partitioning', slug: 'palindrome-partitioning', difficulty: 'Medium', topic: 'Backtracking', week: 9,
    fnName: 'partition', pyParam: 's: str', pyReturn: 'list[list[str]]', javaParam: 'String s', javaReturn: 'List<List<String>>', cppParam: 'string s', cppReturn: 'vector<vector<string>>',
    description: 'Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitionings of s.',
    sampleInput: 's = "aab"', sampleOutput: [["a","a","b"],["aa","b"]],
    h1: 'At index i, try every substring s[i:j+1]. Only recurse if s[i:j+1] is a palindrome.', h2: 'Helper function isPalindrome(sub) checks substring.',
    h3: 'dfs(start, path): if start == len(s): res.append(path[:]). For end in range(start, len(s)): if is_palindrome(s[start:end+1]): dfs(end + 1, path + [s[start:end+1]]).', h4: 'Time: O(n * 2^n), Space: O(n).'
  },
  {
    number: 17, title: 'Letter Combinations of a Phone Number', slug: 'letter-combinations-of-a-phone-number', difficulty: 'Medium', topic: 'Backtracking', week: 9,
    fnName: 'letterCombinations', pyParam: 'digits: str', pyReturn: 'list[str]', javaParam: 'String digits', javaReturn: 'List<String>', cppParam: 'string digits', cppReturn: 'vector<string>',
    description: 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.',
    sampleInput: 'digits = "23"', sampleOutput: ["ad","ae","af","bd","be","bf","cd","ce","cf"],
    h1: 'Map each digit to its corresponding phone letters (e.g., "2" -> "abc").', h2: 'Standard recursive cartesian product / backtracking.',
    h3: 'dfs(i, current_str): if i == len(digits): res.append(current_str). For char in phone_map[digits[i]]: dfs(i + 1, current_str + char).', h4: 'Time: O(4^n * n), Space: O(n).'
  },
  {
    number: 51, title: 'N-Queens', slug: 'n-queens', difficulty: 'Hard', topic: 'Backtracking', week: 9,
    fnName: 'solveNQueens', pyParam: 'n: int', pyReturn: 'list[list[str]]', javaParam: 'int n', javaReturn: 'List<List<String>>', cppParam: 'int n', cppReturn: 'vector<vector<string>>',
    description: 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.',
    sampleInput: 'n = 4', sampleOutput: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]],
    h1: 'Queens attack row, column, and two diagonals.', h2: 'Positive diagonal invariant: (row + col) is constant. Negative diagonal invariant: (row - col) is constant.',
    h3: 'Backtrack row by row. Maintain sets for col, posDiag (r+c), negDiag (r-c). If safe, place queen and advance row.', h4: 'Time: O(n!), Space: O(n).'
  },

  // ─── WEEK 10: Graphs (13) ───
  {
    number: 200, title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'Medium', topic: 'Graphs', week: 10,
    fnName: 'numIslands', pyParam: 'grid: list[list[str]]', pyReturn: 'int', javaParam: 'char[][] grid', javaReturn: 'int', cppParam: 'vector<vector<char>>& grid', cppReturn: 'int',
    description: 'Given an m x n 2D binary grid grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.',
    sampleInput: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', sampleOutput: 2,
    h1: 'Traverse grid. When "1" found, trigger BFS/DFS to sink all connected land cells.', h2: 'Sink land by setting grid[r][c] = "0" to avoid separate visited set.',
    h3: 'Iterate r, c. If grid[r][c] == "1": count += 1; dfs(r, c). Return count.', h4: 'Time: O(m * n), Space: O(m * n).'
  },
  {
    number: 133, title: 'Clone Graph', slug: 'clone-graph', difficulty: 'Medium', topic: 'Graphs', week: 10,
    fnName: 'cloneGraph', pyParam: 'node: Optional["Node"]', pyReturn: 'Optional["Node"]', javaParam: 'Node node', javaReturn: 'Node', cppParam: 'Node* node', cppReturn: 'Node*',
    description: 'Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.',
    sampleInput: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', sampleOutput: [[2,4],[1,3],[2,4],[1,3]],
    h1: 'Use a hash map mapping old_node -> clone_node to prevent infinite cycles.', h2: 'Recursive DFS or iterative BFS.',
    h3: 'dfs(node): if node in clones: return clones[node]. clone = Node(node.val); clones[node] = clone. For n in node.neighbors: clone.neighbors.append(dfs(n)).', h4: 'Time: O(V + E), Space: O(V).'
  },
  {
    number: 695, title: 'Max Area of Island', slug: 'max-area-of-island', difficulty: 'Medium', topic: 'Graphs', week: 10,
    fnName: 'maxAreaOfIsland', pyParam: 'grid: list[list[int]]', pyReturn: 'int', javaParam: 'int[][] grid', javaReturn: 'int', cppParam: 'vector<vector<int>>& grid', cppReturn: 'int',
    description: 'You are given an m x n binary matrix grid. An island is a group of 1\'s connected 4-directionally. Return the maximum area of an island in grid.',
    sampleInput: 'grid = [[0,0,1,0,0],[1,1,1,0,0],[0,1,0,0,1]]', sampleOutput: 5,
    h1: 'DFS returns the area (number of cells) of the island.', h2: 'Mark visited cells as 0 so they are never recounted.',
    h3: 'dfs(r, c) returns 1 + sum of dfs for 4 neighbors. Update max_area = max(max_area, dfs(r, c)).', h4: 'Time: O(m * n), Space: O(m * n).'
  },
  {
    number: 417, title: 'Pacific Atlantic Water Flow', slug: 'pacific-atlantic-water-flow', difficulty: 'Medium', topic: 'Graphs', week: 10,
    fnName: 'pacificAtlantic', pyParam: 'heights: list[list[int]]', pyReturn: 'list[list[int]]', javaParam: 'int[][] heights', javaReturn: 'List<List<Integer>>', cppParam: 'vector<vector<int>>& heights', cppReturn: 'vector<vector<int>>',
    description: 'Return a list of grid coordinates where water can flow to both the Pacific (top/left) and Atlantic (bottom/right) oceans.',
    sampleInput: 'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]', sampleOutput: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]],
    h1: 'Work backwards! Start DFS from the oceans going uphill (neighbor >= current).', h2: 'Maintain two sets: pacific_reachable and atlantic_reachable.',
    h3: 'DFS from top & left edges into pacific; DFS from bottom & right edges into atlantic. Find intersection of sets.', h4: 'Time: O(m * n), Space: O(m * n).'
  },
  {
    number: 130, title: 'Surrounded Regions', slug: 'surrounded-regions', difficulty: 'Medium', topic: 'Graphs', week: 10,
    fnName: 'solve', pyParam: 'board: list[list[str]]', pyReturn: 'None', javaParam: 'char[][] board', javaReturn: 'void', cppParam: 'vector<vector<char>>& board', cppReturn: 'void',
    description: 'Given an m x n matrix board containing "X" and "O", capture all regions that are 4-directionally surrounded by "X".',
    sampleInput: 'board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]', sampleOutput: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]],
    h1: 'Any "O" connected to a border cell cannot be captured.', h2: 'Run DFS from border "O"s and temporarily rename them to "T" (safe).',
    h3: 'Phase 1: Mark border-connected "O" to "T". Phase 2: Convert remaining "O" to "X". Phase 3: Convert "T" back to "O".', h4: 'Time: O(m * n), Space: O(m * n).'
  },
  {
    number: 994, title: 'Rotting Oranges', slug: 'rotting-oranges', difficulty: 'Medium', topic: 'Graphs', week: 10,
    fnName: 'orangesRotting', pyParam: 'grid: list[list[int]]', pyReturn: 'int', javaParam: 'int[][] grid', javaReturn: 'int', cppParam: 'vector<vector<int>>& grid', cppReturn: 'int',
    description: 'You are given an m x n grid where each cell has 0 (empty), 1 (fresh), or 2 (rotten). Every minute, fresh oranges adjacent to rotten oranges rot. Return minimum minutes until no fresh orange remains.',
    sampleInput: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', sampleOutput: 4,
    h1: 'Multi-source BFS spreads rot simultaneously from all initial rotten oranges.', h2: 'Track fresh orange count and elapsed minutes per level.',
    h3: 'Enqueue all 2s into queue, count fresh 1s. While queue and fresh > 0: process level, rot adjacent 1s, minutes += 1. Return minutes if fresh == 0 else -1.', h4: 'Time: O(m * n), Space: O(m * n).'
  },
  {
    number: 286, title: 'Walls and Gates', slug: 'walls-and-gates', difficulty: 'Medium', topic: 'Graphs', week: 10,
    fnName: 'wallsAndGates', pyParam: 'rooms: list[list[int]]', pyReturn: 'None', javaParam: 'int[][] rooms', javaReturn: 'void', cppParam: 'vector<vector<int>>& rooms', cppReturn: 'void',
    description: 'Fill each empty room with the distance to its nearest gate. -1 is wall, 0 is gate, INF is empty room.',
    sampleInput: 'rooms = [[2147483647,-1,0,2147483647]]', sampleOutput: [[3,-1,0,1]],
    h1: 'Multi-source BFS starting from all gates (0) simultaneously.', h2: 'First time BFS reaches an empty room is guaranteed shortest distance.',
    h3: 'Enqueue all (r, c) with rooms[r][c] == 0. While queue: pop (r, c); for nr, nc: if rooms[nr][nc] == INF: rooms[nr][nc] = rooms[r][c] + 1; enqueue.', h4: 'Time: O(m * n), Space: O(m * n).'
  },
  {
    number: 207, title: 'Course Schedule', slug: 'course-schedule', difficulty: 'Medium', topic: 'Graphs', week: 10,
    fnName: 'canFinish', pyParam: 'numCourses: int, prerequisites: list[list[int]]', pyReturn: 'bool', javaParam: 'int numCourses, int[][] prerequisites', javaReturn: 'boolean', cppParam: 'int numCourses, vector<vector<int>>& prerequisites', cppReturn: 'bool',
    description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Return true if you can finish all courses.',
    sampleInput: 'numCourses = 2, prerequisites = [[1,0]]', sampleOutput: true,
    h1: 'Cycle detection in a Directed Graph.', h2: 'Topological Sort (Kahn’s algorithm using indegree) or DFS with 3-color states.',
    h3: 'Compute in-degrees. Enqueue all courses with in-degree 0. While queue: pop, count++, reduce neighbor in-degrees. Return count == numCourses.', h4: 'Time: O(V + E), Space: O(V + E).'
  },
  {
    number: 210, title: 'Course Schedule II', slug: 'course-schedule-ii', difficulty: 'Medium', topic: 'Graphs', week: 10,
    fnName: 'findOrder', pyParam: 'numCourses: int, prerequisites: list[list[int]]', pyReturn: 'list[int]', javaParam: 'int numCourses, int[][] prerequisites', javaReturn: 'int[]', cppParam: 'int numCourses, vector<vector<int>>& prerequisites', cppReturn: 'vector<int>',
    description: 'Return the ordering of courses you should take to finish all courses. If impossible, return an empty array.',
    sampleInput: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', sampleOutput: [0,2,1,3],
    h1: 'Topological Sort order output.', h2: 'Kahn’s algorithm: append each processed course with in-degree 0 to the result order.',
    h3: 'If result length == numCourses return result; else return [].', h4: 'Time: O(V + E), Space: O(V + E).'
  },
  {
    number: 684, title: 'Redundant Connection', slug: 'redundant-connection', difficulty: 'Medium', topic: 'Graphs', week: 10,
    fnName: 'findRedundantConnection', pyParam: 'edges: list[list[int]]', pyReturn: 'list[int]', javaParam: 'int[][] edges', javaReturn: 'int[]', cppParam: 'vector<vector<int>>& edges', cppReturn: 'vector<int>',
    description: 'A tree is an undirected graph that is connected and has no cycles. Given a graph with n nodes and n edges, find an edge that can be removed so that the resulting graph is a tree.',
    sampleInput: 'edges = [[1,2],[1,3],[2,3]]', sampleOutput: [2,3],
    h1: 'Disjoint Set Union (Union-Find) with path compression.', h2: 'If two nodes of an edge already share the same parent, this edge creates a cycle and is redundant.',
    h3: 'Initialize parent = [i for i in range(n + 1)]. For u, v in edges: if not union(u, v): return [u, v].', h4: 'Time: O(n * alpha(n)) ≈ O(n), Space: O(n).'
  },
  {
    number: 323, title: 'Number of Connected Components in an Undirected Graph', slug: 'number-of-connected-components-in-an-undirected-graph', difficulty: 'Medium', topic: 'Graphs', week: 10,
    fnName: 'countComponents', pyParam: 'n: int, edges: list[list[int]]', pyReturn: 'int', javaParam: 'int n, int[][] edges', javaReturn: 'int', cppParam: 'int n, vector<vector<int>>& edges', cppReturn: 'int',
    description: 'Given n nodes and a list of undirected edges, return the number of connected components in the graph.',
    sampleInput: 'n = 5, edges = [[0,1],[1,2],[3,4]]', sampleOutput: 2,
    h1: 'Start with n components.', h2: 'Each successful union of two previously separate sets reduces component count by 1.',
    h3: 'count = n; for u, v in edges: if union(u, v): count -= 1. Return count.', h4: 'Time: O(E * alpha(V)), Space: O(V).'
  },
  {
    number: 261, title: 'Graph Valid Tree', slug: 'graph-valid-tree', difficulty: 'Medium', topic: 'Graphs', week: 10,
    fnName: 'validTree', pyParam: 'n: int, edges: list[list[int]]', pyReturn: 'bool', javaParam: 'int n, int[][] edges', javaReturn: 'boolean', cppParam: 'int n, vector<vector<int>>& edges', cppReturn: 'bool',
    description: 'Given n nodes labeled from 0 to n - 1 and a list of undirected edges, write a function to check whether these edges make up a valid tree.',
    sampleInput: 'n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]', sampleOutput: true,
    h1: 'A valid tree must have exactly n - 1 edges and no cycles (fully connected).', h2: 'If len(edges) != n - 1 return False immediately.',
    h3: 'Run Union-Find. If any edge connects already connected nodes, return False. Return True if all pass.', h4: 'Time: O(n), Space: O(n).'
  },
  {
    number: 127, title: 'Word Ladder', slug: 'word-ladder', difficulty: 'Hard', topic: 'Graphs', week: 10,
    fnName: 'ladderLength', pyParam: 'beginWord: str, endWord: str, wordList: list[str]', pyReturn: 'int', javaParam: 'String beginWord, String endWord, List<String> wordList', javaReturn: 'int', cppParam: 'string beginWord, string endWord, vector<string>& wordList', cppReturn: 'int',
    description: 'Return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.',
    sampleInput: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', sampleOutput: 5,
    h1: 'Shortest path in an unweighted graph -> Breadth-First Search (BFS).', h2: 'Pre-process words into generic patterns: "*ot" -> ["hot", "dot", "lot"].',
    h3: 'Queue stores (word, steps). For each pattern of word, explore neighbors, mark visited. Return steps when endWord reached.', h4: 'Time: O(M^2 * N), Space: O(M^2 * N).'
  },

  // ─── WEEK 11: 1D & 2D Dynamic Programming (23) ───
  {
    number: 70, title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'Easy', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'climbStairs', pyParam: 'n: int', pyReturn: 'int', javaParam: 'int n', javaReturn: 'int', cppParam: 'int n', cppReturn: 'int',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    sampleInput: 'n = 3', sampleOutput: 3,
    h1: 'Ways to reach step n = ways(n - 1) + ways(n - 2).', h2: 'Fibonacci recurrence relation.',
    h3: 'a, b = 1, 1; for _ in range(n - 1): a, b = a + b, a. Return a.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 746, title: 'Min Cost Climbing Stairs', slug: 'min-cost-climbing-stairs', difficulty: 'Easy', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'minCostClimbingStairs', pyParam: 'cost: list[int]', pyReturn: 'int', javaParam: 'int[] cost', javaReturn: 'int', cppParam: 'vector<int>& cost', cppReturn: 'int',
    description: 'You are given an integer array cost where cost[i] is the cost of ith step on a staircase. Return minimum cost to reach the top floor.',
    sampleInput: 'cost = [10,15,20]', sampleOutput: 15,
    h1: 'At step i, min_cost = cost[i] + min(cost[i+1], cost[i+2]).', h2: 'Iterate backwards from n - 3 to 0 in place.',
    h3: 'cost.append(0); for i in range(len(cost) - 3, -1, -1): cost[i] += min(cost[i+1], cost[i+2]). Return min(cost[0], cost[1]).', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 198, title: 'House Robber', slug: 'house-robber', difficulty: 'Medium', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'rob', pyParam: 'nums: list[int]', pyReturn: 'int', javaParam: 'int[] nums', javaReturn: 'int', cppParam: 'vector<int>& nums', cppReturn: 'int',
    description: 'You cannot rob two adjacent houses. Return maximum amount of money you can rob tonight without alerting police.',
    sampleInput: 'nums = [1,2,3,1]', sampleOutput: 4,
    h1: 'Choice at house i: rob house i + best up to i - 2, OR skip house i and take best up to i - 1.', h2: 'rob1, rob2 = 0, 0. Recurrence: max(num + rob1, rob2).',
    h3: 'for n in nums: temp = max(n + rob1, rob2); rob1 = rob2; rob2 = temp. Return rob2.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 213, title: 'House Robber II', slug: 'house-robber-ii', difficulty: 'Medium', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'rob2', pyParam: 'nums: list[int]', pyReturn: 'int', javaParam: 'int[] nums', javaReturn: 'int', cppParam: 'vector<int>& nums', cppReturn: 'int',
    description: 'Houses are arranged in a circle. You cannot rob both first and last house.',
    sampleInput: 'nums = [2,3,2]', sampleOutput: 3,
    h1: 'Since house 0 and house n - 1 are adjacent, you cannot rob both.', h2: 'Run House Robber I on two subarrays: nums[1:] and nums[:-1].',
    h3: 'Return max(nums[0], helper(nums[1:]), helper(nums[:-1])).', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 5, title: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring', difficulty: 'Medium', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'longestPalindrome', pyParam: 's: str', pyReturn: 'str', javaParam: 'String s', javaReturn: 'String', cppParam: 'string s', cppReturn: 'string',
    description: 'Given a string s, return the longest palindromic substring in s.',
    sampleInput: 's = "babad"', sampleOutput: 'bab',
    h1: 'Every palindrome expands outward from its center.', h2: 'There are 2n - 1 possible centers (odd length single character, even length two adjacent characters).',
    h3: 'Expand around each i: odd center (i, i) and even center (i, i + 1). Track max string.', h4: 'Time: O(n^2), Space: O(1).'
  },
  {
    number: 647, title: 'Palindromic Substrings', slug: 'palindromic-substrings', difficulty: 'Medium', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'countSubstrings', pyParam: 's: str', pyReturn: 'int', javaParam: 'String s', javaReturn: 'int', cppParam: 'string s', cppReturn: 'int',
    description: 'Given a string s, return the number of palindromic substrings in it.',
    sampleInput: 's = "aaa"', sampleOutput: 6,
    h1: 'Expand outward from each center. Every step with matching characters adds 1 palindrome.', h2: 'Count odd and even centers for each index i.',
    h3: 'for i in range(len(s)): count += expand(i, i) + expand(i, i + 1). Return count.', h4: 'Time: O(n^2), Space: O(1).'
  },
  {
    number: 91, title: 'Decode Ways', slug: 'decode-ways', difficulty: 'Medium', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'numDecodings', pyParam: 's: str', pyReturn: 'int', javaParam: 'String s', javaReturn: 'int', cppParam: 'string s', cppReturn: 'int',
    description: 'A message containing letters from A-Z can be encoded into numbers using mapping "1"->"A" ... "26"->"Z". Return number of decode ways.',
    sampleInput: 's = "226"', sampleOutput: 3,
    h1: 'A digit can decode by itself if != "0". Two digits can decode together if 10 <= int(s[i:i+2]) <= 26.', h2: 'dp[i] = dp[i + 1] (if single digit valid) + dp[i + 2] (if two digits valid).',
    h3: 'Bottom up with two variables. If s[i] == "0", ways = 0.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 322, title: 'Coin Change', slug: 'coin-change', difficulty: 'Medium', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'coinChange', pyParam: 'coins: list[int], amount: int', pyReturn: 'int', javaParam: 'int[] coins, int amount', javaReturn: 'int', cppParam: 'vector<int>& coins, int amount', cppReturn: 'int',
    description: 'Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up, return -1.',
    sampleInput: 'coins = [1,2,5], amount = 11', sampleOutput: 3,
    h1: 'Unbounded knapsack: dp[a] is min coins to make amount a.', h2: 'dp[a] = min(dp[a], 1 + dp[a - c]) for each coin c.',
    h3: 'dp = [inf] * (amount + 1); dp[0] = 0. For a in 1..amount: for c in coins: if a - c >= 0: dp[a] = min(dp[a], 1 + dp[a - c]).', h4: 'Time: O(amount * len(coins)), Space: O(amount).'
  },
  {
    number: 152, title: 'Maximum Product Subarray', slug: 'maximum-product-subarray', difficulty: 'Medium', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'maxProduct', pyParam: 'nums: list[int]', pyReturn: 'int', javaParam: 'int[] nums', javaReturn: 'int', cppParam: 'vector<int>& nums', cppReturn: 'int',
    description: 'Given an integer array nums, find a subarray that has the largest product, and return the product.',
    sampleInput: 'nums = [2,3,-2,4]', sampleOutput: 6,
    h1: 'A negative number multiplied by the minimum negative product can become the new maximum product!', h2: 'Track both cur_max and cur_min at each step.',
    h3: 'For n in nums: temp = cur_max * n; cur_max = max(n, temp, cur_min * n); cur_min = min(n, temp, cur_min * n); res = max(res, cur_max).', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 139, title: 'Word Break', slug: 'word-break', difficulty: 'Medium', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'wordBreak', pyParam: 's: str, wordDict: list[str]', pyReturn: 'bool', javaParam: 'String s, List<String> wordDict', javaReturn: 'boolean', cppParam: 'string s, vector<string>& wordDict', cppReturn: 'bool',
    description: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
    sampleInput: 's = "leetcode", wordDict = ["leet","code"]', sampleOutput: true,
    h1: 'dp[i] is True if s[i:] can be segmented using dictionary words.', h2: 'Base case: dp[len(s)] = True.',
    h3: 'For i from len(s) - 1 down to 0: for w in wordDict: if i + len(w) <= len(s) and s[i:i+len(w)] == w: dp[i] = dp[i + len(w)]; if dp[i] break. Return dp[0].', h4: 'Time: O(n * m * k), Space: O(n).'
  },
  {
    number: 300, title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', difficulty: 'Medium', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'lengthOfLIS', pyParam: 'nums: list[int]', pyReturn: 'int', javaParam: 'int[] nums', javaReturn: 'int', cppParam: 'vector<int>& nums', cppReturn: 'int',
    description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
    sampleInput: 'nums = [10,9,2,5,3,7,101,18]', sampleOutput: 4,
    h1: 'Patience sorting with Binary Search runs in O(n log n).', h2: 'tails[i] stores smallest tail of all increasing subsequences of length i + 1.',
    h3: 'For x in nums: binary search x in tails. If x > all, tails.append(x); else replace tails[idx] = x. Return len(tails).', h4: 'Time: O(n log n), Space: O(n).'
  },
  {
    number: 416, title: 'Partition Equal Subset Sum', slug: 'partition-equal-subset-sum', difficulty: 'Medium', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'canPartition', pyParam: 'nums: list[int]', pyReturn: 'bool', javaParam: 'int[] nums', javaReturn: 'boolean', cppParam: 'vector<int>& nums', cppReturn: 'bool',
    description: 'Given an integer array nums, return true if you can partition the array into two subsets such that the sum of elements in both subsets is equal.',
    sampleInput: 'nums = [1,5,11,5]', sampleOutput: true,
    h1: 'If sum(nums) is odd, it is impossible to partition into two equal halves.', h2: 'Target sum is sum(nums) // 2. 0/1 Knapsack problem.',
    h3: 'Use a set of reachable sums. dp = {0}; for n in nums: dp.update({s + n for s in dp if s + n <= target}). Return target in dp.', h4: 'Time: O(n * target), Space: O(target).'
  },
  {
    number: 62, title: 'Unique Paths', slug: 'unique-paths', difficulty: 'Medium', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'uniquePaths', pyParam: 'm: int, n: int', pyReturn: 'int', javaParam: 'int m, int n', javaReturn: 'int', cppParam: 'int m, int n', cppReturn: 'int',
    description: 'There is a robot on an m x n grid. The robot can only move down or right. Return number of unique paths to bottom-right corner.',
    sampleInput: 'm = 3, n = 7', sampleOutput: 28,
    h1: 'paths(r, c) = paths(r + 1, c) + paths(r, c + 1).', h2: 'Can be solved using a 1D row array of size n moving bottom up.',
    h3: 'row = [1] * n. For i in range(m - 1): for j in range(n - 2, -1, -1): row[j] += row[j + 1]. Return row[0].', h4: 'Time: O(m * n), Space: O(n).'
  },
  {
    number: 1143, title: 'Longest Common Subsequence', slug: 'longest-common-subsequence', difficulty: 'Medium', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'longestCommonSubsequence', pyParam: 'text1: str, text2: str', pyReturn: 'int', javaParam: 'String text1, String text2', javaReturn: 'int', cppParam: 'string text1, string text2', cppReturn: 'int',
    description: 'Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.',
    sampleInput: 'text1 = "abcde", text2 = "ace"', sampleOutput: 3,
    h1: '2D DP grid of size (len(text1) + 1) x (len(text2) + 1).', h2: 'If text1[i] == text2[j]: dp[i][j] = 1 + dp[i+1][j+1]. Else: dp[i][j] = max(dp[i+1][j], dp[i][j+1]).',
    h3: 'Iterate from bottom-right up. Return dp[0][0].', h4: 'Time: O(m * n), Space: O(m * n) or O(min(m, n)).'
  },
  {
    number: 309, title: 'Best Time to Buy and Sell Stock with Cooldown', slug: 'best-time-to-buy-and-sell-stock-with-cooldown', difficulty: 'Medium', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'maxProfitCooldown', pyParam: 'prices: list[int]', pyReturn: 'int', javaParam: 'int[] prices', javaReturn: 'int', cppParam: 'vector<int>& prices', cppReturn: 'int',
    description: 'Find the maximum profit you can achieve with transactions, where after you sell your stock, you cannot buy stock on the next day (cooldown 1 day).',
    sampleInput: 'prices = [1,2,3,0,2]', sampleOutput: 3,
    h1: 'State machine: Buying state vs Selling state.', h2: 'If buying: choose buy (pay price and enter sell state) or cooldown. If selling: choose sell (gain price and cooldown 1 day) or cooldown.',
    h3: 'Memoize dfs(i, buying). On sell: recurse to i + 2 due to 1-day cooldown.', h4: 'Time: O(n), Space: O(n).'
  },
  {
    number: 518, title: 'Coin Change II', slug: 'coin-change-ii', difficulty: 'Medium', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'change', pyParam: 'amount: int, coins: list[int]', pyReturn: 'int', javaParam: 'int amount, int[] coins', javaReturn: 'int', cppParam: 'int amount, vector<int>& coins', cppReturn: 'int',
    description: 'Return the number of combinations that make up that amount using unlimited quantity of each coin.',
    sampleInput: 'amount = 5, coins = [1,2,5]', sampleOutput: 4,
    h1: 'Unbounded knapsack counting combinations (not permutations).', h2: 'Loop coins on the outer loop and amount on the inner loop to prevent counting permutations.',
    h3: 'dp = [0] * (amount + 1); dp[0] = 1. For coin in coins: for a in range(coin, amount + 1): dp[a] += dp[a - coin]. Return dp[amount].', h4: 'Time: O(amount * len(coins)), Space: O(amount).'
  },
  {
    number: 494, title: 'Target Sum', slug: 'target-sum', difficulty: 'Medium', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'findTargetSumWays', pyParam: 'nums: list[int], target: int', pyReturn: 'int', javaParam: 'int[] nums, int target', javaReturn: 'int', cppParam: 'vector<int>& nums, int target', cppReturn: 'int',
    description: 'Assign "+" or "-" before each integer in nums. Return number of different expressions that evaluate to target.',
    sampleInput: 'nums = [1,1,1,1,1], target = 3', sampleOutput: 5,
    h1: 'P - N = target and P + N = sum => 2P = target + sum => P = (target + sum) / 2.', h2: 'Reduces to finding subset with sum equal to P (Subset Sum).',
    h3: 'If (target + total) is odd or target > total return 0. Target is (target + total) // 2. Run 0/1 knapsack.', h4: 'Time: O(n * sum), Space: O(sum).'
  },
  {
    number: 97, title: 'Interleaving String', slug: 'interleaving-string', difficulty: 'Medium', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'isInterleave', pyParam: 's1: str, s2: str, s3: str', pyReturn: 'bool', javaParam: 'String s1, String s2, String s3', javaReturn: 'boolean', cppParam: 'string s1, string s2, string s3', cppReturn: 'bool',
    description: 'Given strings s1, s2, and s3, find whether s3 is formed by an interleaving of s1 and s2.',
    sampleInput: 's1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"', sampleOutput: true,
    h1: 'If len(s1) + len(s2) != len(s3), return False.', h2: 'dp[i][j] is True if s1[:i] and s2[:j] interleave into s3[:i+j].',
    h3: 'dp[i][j] = (dp[i-1][j] and s1[i-1] == s3[i+j-1]) or (dp[i][j-1] and s2[j-1] == s3[i+j-1]).', h4: 'Time: O(m * n), Space: O(n).'
  },
  {
    number: 329, title: 'Longest Increasing Path in a Matrix', slug: 'longest-increasing-path-in-a-matrix', difficulty: 'Hard', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'longestIncreasingPath', pyParam: 'matrix: list[list[int]]', pyReturn: 'int', javaParam: 'int[][] matrix', javaReturn: 'int', cppParam: 'vector<vector<int>>& matrix', cppReturn: 'int',
    description: 'Given an m x n integers matrix, return the length of the longest increasing path in matrix.',
    sampleInput: 'matrix = [[9,9,4],[6,6,8],[2,1,1]]', sampleOutput: 4,
    h1: 'Since paths are strictly increasing, cycles are impossible (DAG).', h2: 'Memoized DFS: dp[r][c] stores length of longest increasing path starting from (r, c).',
    h3: 'dfs(r, c): 1 + max(dfs(nr, nc) for nr, nc in 4 directions if matrix[nr][nc] > matrix[r][c]). Memoize in hash table or 2D array.', h4: 'Time: O(m * n), Space: O(m * n).'
  },
  {
    number: 115, title: 'Distinct Subsequences', slug: 'distinct-subsequences', difficulty: 'Hard', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'numDistinct', pyParam: 's: str, t: str', pyReturn: 'int', javaParam: 'String s, String t', javaReturn: 'int', cppParam: 'string s, string t', cppReturn: 'int',
    description: 'Given two strings s and t, return the number of distinct subsequences of s which equals t.',
    sampleInput: 's = "rabbbit", t = "rabbit"', sampleOutput: 3,
    h1: 'dp[i][j] is number of subsequences of s[i:] matching t[j:].', h2: 'If s[i] == t[j]: choice is dp[i+1][j+1] (match) + dp[i+1][j] (skip s[i]). Else dp[i+1][j].',
    h3: 'Base case: dp[i][len(t)] = 1 (empty string matches once). Return dp[0][0].', h4: 'Time: O(len(s) * len(t)), Space: O(len(t)).'
  },
  {
    number: 72, title: 'Edit Distance', slug: 'edit-distance', difficulty: 'Hard', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'minDistance', pyParam: 'word1: str, word2: str', pyReturn: 'int', javaParam: 'String word1, String word2', javaReturn: 'int', cppParam: 'string word1, string word2', cppReturn: 'int',
    description: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2 (insert, delete, or replace).',
    sampleInput: 'word1 = "horse", word2 = "ros"', sampleOutput: 3,
    h1: 'Classic 2D DP matrix. If chars match: dp[i][j] = dp[i+1][j+1].', h2: 'If chars differ: dp[i][j] = 1 + min(insert: dp[i][j+1], delete: dp[i+1][j], replace: dp[i+1][j+1]).',
    h3: 'Bottom up 2D table with base cases initialized to remaining lengths. Return dp[0][0].', h4: 'Time: O(m * n), Space: O(m * n) or O(min(m, n)).'
  },
  {
    number: 312, title: 'Burst Balloons', slug: 'burst-balloons', difficulty: 'Hard', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'maxCoins', pyParam: 'nums: list[int]', pyReturn: 'int', javaParam: 'int[] nums', javaReturn: 'int', cppParam: 'vector<int>& nums', cppReturn: 'int',
    description: 'Burst balloons to maximize coins gained: nums[i - 1] * nums[i] * nums[i + 1].',
    sampleInput: 'nums = [3,1,5,8]', sampleOutput: 167,
    h1: 'Instead of choosing which balloon to burst first, choose which balloon to burst LAST!', h2: 'If balloon k is burst last in range [l, r], coins = nums[l-1] * nums[k] * nums[r+1] + dp(l, k-1) + dp(k+1, r).',
    h3: 'Pad nums with 1 at both ends. Interval DP loop length from 1 to n.', h4: 'Time: O(n^3), Space: O(n^2).'
  },
  {
    number: 10, title: 'Regular Expression Matching', slug: 'regular-expression-matching', difficulty: 'Hard', topic: '1D & 2D Dynamic Programming', week: 11,
    fnName: 'isMatch', pyParam: 's: str, p: str', pyReturn: 'bool', javaParam: 'String s, String p', javaReturn: 'boolean', cppParam: 'string s, string p', cppReturn: 'bool',
    description: 'Given an input string s and a pattern p, implement regular expression matching with support for "." and "*".',
    sampleInput: 's = "aa", p = "a*"', sampleOutput: true,
    h1: 'Key case is "*", which can match 0 occurrences of preceding char, or 1+ occurrences.', h2: 'If (j + 1) < len(p) and p[j+1] == "*": choice is dfs(i, j + 2) [use 0 times] or (match and dfs(i + 1, j)) [use 1+ times].',
    h3: 'Memoize dfs(i, j) top-down or fill 2D boolean table. Base case: i >= len(s) and j >= len(p) -> True.', h4: 'Time: O(m * n), Space: O(m * n).'
  },

  // ─── WEEK 12: Greedy, Intervals, Math & Bit Manipulation (35) ───
  // Greedy (8)
  {
    number: 53, title: 'Maximum Subarray', slug: 'maximum-subarray', difficulty: 'Medium', topic: 'Greedy', week: 12,
    fnName: 'maxSubArray', pyParam: 'nums: list[int]', pyReturn: 'int', javaParam: 'int[] nums', javaReturn: 'int', cppParam: 'vector<int>& nums', cppReturn: 'int',
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    sampleInput: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', sampleOutput: 6,
    h1: 'Kadane\'s Algorithm: if running sum drops below 0, reset it to 0.', h2: 'max_sum = max(max_sum, cur_sum).',
    h3: 'cur = 0, res = nums[0]; for n in nums: cur = max(n, cur + n); res = max(res, cur). Return res.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 55, title: 'Jump Game', slug: 'jump-game', difficulty: 'Medium', topic: 'Greedy', week: 12,
    fnName: 'canJump', pyParam: 'nums: list[int]', pyReturn: 'bool', javaParam: 'int[] nums', javaReturn: 'boolean', cppParam: 'vector<int>& nums', cppReturn: 'bool',
    description: 'You are initially positioned at the array\'s first index. Return true if you can reach the last index.',
    sampleInput: 'nums = [2,3,1,1,4]', sampleOutput: true,
    h1: 'Track the goal post backwards from destination (len - 1).', h2: 'If index i + nums[i] >= goal, then goal can be shifted to i.',
    h3: 'goal = len(nums) - 1. For i in range(len(nums) - 2, -1, -1): if i + nums[i] >= goal: goal = i. Return goal == 0.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 45, title: 'Jump Game II', slug: 'jump-game-ii', difficulty: 'Medium', topic: 'Greedy', week: 12,
    fnName: 'jump', pyParam: 'nums: list[int]', pyReturn: 'int', javaParam: 'int[] nums', javaReturn: 'int', cppParam: 'vector<int>& nums', cppReturn: 'int',
    description: 'Return the minimum number of jumps to reach the last index.',
    sampleInput: 'nums = [2,3,1,1,4]', sampleOutput: 2,
    h1: 'BFS window [l, r] represents indices reachable with current number of jumps.', h2: 'Next window right boundary is max(i + nums[i] for i in [l, r]).',
    h3: 'jumps = 0, l = 0, r = 0; while r < len(nums) - 1: farthest = max(i + nums[i] for i in range(l, r + 1)); l = r + 1; r = farthest; jumps += 1. Return jumps.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 134, title: 'Gas Station', slug: 'gas-station', difficulty: 'Medium', topic: 'Greedy', week: 12,
    fnName: 'canCompleteCircuit', pyParam: 'gas: list[int], cost: list[int]', pyReturn: 'int', javaParam: 'int[] gas, int[] cost', javaReturn: 'int', cppParam: 'vector<int>& gas, vector<int>& cost', cppReturn: 'int',
    description: 'There are n gas stations along a circular route. Return starting gas station\'s index if you can travel around circuit once, otherwise -1.',
    sampleInput: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', sampleOutput: 3,
    h1: 'If sum(gas) < sum(cost), it is impossible to complete circuit.', h2: 'If running total gas drops below 0 at station i, no station before or at i can be the start.',
    h3: 'If sum(gas) < sum(cost) return -1. total = 0, start = 0; for i in range(n): total += gas[i] - cost[i]; if total < 0: total = 0; start = i + 1. Return start.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 846, title: 'Hand of Straights', slug: 'hand-of-straights', difficulty: 'Medium', topic: 'Greedy', week: 12,
    fnName: 'isNStraightHand', pyParam: 'hand: list[int], groupSize: int', pyReturn: 'bool', javaParam: 'int[] hand, int groupSize', javaReturn: 'boolean', cppParam: 'vector<int>& hand, int groupSize', cppReturn: 'bool',
    description: 'Rearrange cards into groups so that each group is of size groupSize, and consists of groupSize consecutive cards.',
    sampleInput: 'hand = [1,2,3,6,2,3,4,7,8], groupSize = 3', sampleOutput: true,
    h1: 'If len(hand) % groupSize != 0, impossible.', h2: 'Count card frequencies. Always start group with current minimum card in count map.',
    h3: 'Count map. While min-heap: first = heap[0]; for i in range(first, first + groupSize): if count[i] <= 0 return False; count[i] -= 1; pop if count zero.', h4: 'Time: O(n log n), Space: O(n).'
  },
  {
    number: 1899, title: 'Merge Triplets to Form Target Triplet', slug: 'merge-triplets-to-form-target-triplet', difficulty: 'Medium', topic: 'Greedy', week: 12,
    fnName: 'mergeTriplets', pyParam: 'triplets: list[list[int]], target: list[int]', pyReturn: 'bool', javaParam: 'int[][] triplets, int[] target', javaReturn: 'boolean', cppParam: 'vector<vector<int>>& triplets, vector<int>& target', cppReturn: 'bool',
    description: 'Merge triplets by taking component-wise max. Return true if possible to form target.',
    sampleInput: 'triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]', sampleOutput: true,
    h1: 'Discard any triplet where any component exceeds target (it would ruin target max).', h2: 'Among valid triplets, check if they can collectively match target[0], target[1], and target[2].',
    h3: 'Track set of matched indices. If t[0] <= target[0] and t[1] <= target[1] and t[2] <= target[2]: add matched indices. Return len(matched) == 3.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 763, title: 'Partition Labels', slug: 'partition-labels', difficulty: 'Medium', topic: 'Greedy', week: 12,
    fnName: 'partitionLabels', pyParam: 's: str', pyReturn: 'list[int]', javaParam: 'String s', javaReturn: 'List<Integer>', cppParam: 'string s', cppReturn: 'vector<int>',
    description: 'Partition the string into as many parts as possible so that each letter appears in at most one part.',
    sampleInput: 's = "ababcbacadefegdehijhklij"', sampleOutput: [9,7,8],
    h1: 'Precompute the last occurrence index of each character.', h2: 'As you iterate, extend partition boundary to max(last_occurrence) of chars seen in current partition.',
    h3: 'When current index reaches partition end: close partition, record length, start next.', h4: 'Time: O(n), Space: O(26) = O(1).'
  },
  {
    number: 678, title: 'Valid Parenthesis String', slug: 'valid-parenthesis-string', difficulty: 'Medium', topic: 'Greedy', week: 12,
    fnName: 'checkValidString', pyParam: 's: str', pyReturn: 'bool', javaParam: 'String s', javaReturn: 'boolean', cppParam: 'string s', cppReturn: 'bool',
    description: 'Given a string s containing "(", ")", and "*", determine if valid. "*" could be treated as "(", ")", or empty string.',
    sampleInput: 's = "(*))"', sampleOutput: true,
    h1: 'Maintain a range [cmin, cmax] of possible unmatched open parentheses counts.', h2: 'On "(", both cmin and cmax increment. On ")", both decrement. On "*", cmin--, cmax++.',
    h3: 'cmin = max(cmin, 0). If cmax < 0 return False. At end, return cmin == 0.', h4: 'Time: O(n), Space: O(1).'
  },

  // Intervals (6)
  {
    number: 57, title: 'Insert Interval', slug: 'insert-interval', difficulty: 'Medium', topic: 'Intervals', week: 12,
    fnName: 'insert', pyParam: 'intervals: list[list[int]], newInterval: list[int]', pyReturn: 'list[list[int]]', javaParam: 'int[][] intervals, int[] newInterval', javaReturn: 'int[][]', cppParam: 'vector<vector<int>>& intervals, vector<int>& newInterval', cppReturn: 'vector<vector<int>>',
    description: 'Insert newInterval into intervals (sorted non-overlapping), merge if necessary.',
    sampleInput: 'intervals = [[1,3],[6,9]], newInterval = [2,5]', sampleOutput: [[1,5],[6,9]],
    h1: 'Three phases: intervals before newInterval, overlapping intervals to merge, and intervals after.', h2: 'Overlapping condition: start <= newInterval.end and end >= newInterval.start.',
    h3: 'Append non-overlapping left. While overlap: merge into newInterval. Append newInterval, then append remainder.', h4: 'Time: O(n), Space: O(n).'
  },
  {
    number: 56, title: 'Merge Intervals', slug: 'merge-intervals', difficulty: 'Medium', topic: 'Intervals', week: 12,
    fnName: 'merge', pyParam: 'intervals: list[list[int]]', pyReturn: 'list[list[int]]', javaParam: 'int[][] intervals', javaReturn: 'int[][]', cppParam: 'vector<vector<int>>& intervals', cppReturn: 'vector<vector<int>>',
    description: 'Given an array of intervals, merge all overlapping intervals.',
    sampleInput: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', sampleOutput: [[1,6],[8,10],[15,18]],
    h1: 'Sort intervals by starting time.', h2: 'If current interval start <= previous interval end, merge: prev.end = max(prev.end, curr.end).',
    h3: 'Sort by key x[0]. res = [intervals[0]]. For start, end in intervals[1:]: if start <= res[-1][1]: res[-1][1] = max(res[-1][1], end); else: res.append([start, end]).', h4: 'Time: O(n log n), Space: O(n).'
  },
  {
    number: 435, title: 'Non-overlapping Intervals', slug: 'non-overlapping-intervals', difficulty: 'Medium', topic: 'Intervals', week: 12,
    fnName: 'eraseOverlapIntervals', pyParam: 'intervals: list[list[int]]', pyReturn: 'int', javaParam: 'int[][] intervals', javaReturn: 'int', cppParam: 'vector<vector<int>>& intervals', cppReturn: 'int',
    description: 'Return minimum number of intervals to remove to make the rest non-overlapping.',
    sampleInput: 'intervals = [[1,2],[2,3],[3,4],[1,3]]', sampleOutput: 1,
    h1: 'Greedy choice: when two intervals overlap, remove the one that ends later (to leave room for future intervals).', h2: 'Sort intervals by end time or by start time.',
    h3: 'Sort by start. If overlap (curr.start < prev.end): count += 1; prev.end = min(prev.end, curr.end). Else prev.end = curr.end.', h4: 'Time: O(n log n), Space: O(1).'
  },
  {
    number: 252, title: 'Meeting Rooms', slug: 'meeting-rooms', difficulty: 'Easy', topic: 'Intervals', week: 12,
    fnName: 'canAttendMeetings', pyParam: 'intervals: list[list[int]]', pyReturn: 'bool', javaParam: 'int[][] intervals', javaReturn: 'boolean', cppParam: 'vector<vector<int>>& intervals', cppReturn: 'bool',
    description: 'Given an array of meeting time intervals, determine if a person could attend all meetings.',
    sampleInput: 'intervals = [[0,30],[5,10],[15,20]]', sampleOutput: false,
    h1: 'Sort meetings by start time.', h2: 'Check if any meeting starts before the previous meeting ends.',
    h3: 'intervals.sort(). For i in 1..n: if intervals[i][0] < intervals[i-1][1] return False. Return True.', h4: 'Time: O(n log n), Space: O(1).'
  },
  {
    number: 253, title: 'Meeting Rooms II', slug: 'meeting-rooms-ii', difficulty: 'Medium', topic: 'Intervals', week: 12,
    fnName: 'minMeetingRooms', pyParam: 'intervals: list[list[int]]', pyReturn: 'int', javaParam: 'int[][] intervals', javaReturn: 'int', cppParam: 'vector<vector<int>>& intervals', cppReturn: 'int',
    description: 'Return the minimum number of conference rooms required.',
    sampleInput: 'intervals = [[0,30],[5,10],[15,20]]', sampleOutput: 2,
    h1: 'Separate and sort start times and end times.', h2: 'Two pointers: if start < end: room required (+1). If end <= start: room freed (-1).',
    h3: 'starts = sorted([i[0] for i in intervals]); ends = sorted([i[1] for i in intervals]). Track max count.', h4: 'Time: O(n log n), Space: O(n).'
  },
  {
    number: 1851, title: 'Minimum Interval to Include Each Query', slug: 'minimum-interval-to-include-each-query', difficulty: 'Hard', topic: 'Intervals', week: 12,
    fnName: 'minInterval', pyParam: 'intervals: list[list[int]], queries: list[int]', pyReturn: 'list[int]', javaParam: 'int[][] intervals, int[] queries', javaReturn: 'int[]', cppParam: 'vector<vector<int>>& intervals, vector<int>& queries', cppReturn: 'vector<int>',
    description: 'For each query, return the size of the smallest interval that contains the query value, or -1.',
    sampleInput: 'intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]', sampleOutput: [3,3,1,4],
    h1: 'Sort intervals and sort queries (tracking original query order).', h2: 'Min-heap stores (interval_length, right_boundary).',
    h3: 'For each query q: add intervals with left <= q into heap. Pop intervals where right < q. Answer is top of heap length.', h4: 'Time: O(n log n + q log q), Space: O(n + q).'
  },

  // Math & Geometry (8)
  {
    number: 48, title: 'Rotate Image', slug: 'rotate-image', difficulty: 'Medium', topic: 'Math & Geometry', week: 12,
    fnName: 'rotate', pyParam: 'matrix: list[list[int]]', pyReturn: 'None', javaParam: 'int[][] matrix', javaReturn: 'void', cppParam: 'vector<vector<int>>& matrix', cppReturn: 'void',
    description: 'Rotate the n x n 2D matrix by 90 degrees clockwise in-place.',
    sampleInput: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', sampleOutput: [[7,4,1],[8,5,2],[9,6,3]],
    h1: 'Rotating 90 degrees clockwise is equivalent to: Transpose matrix + Reverse each row.', h2: 'Transpose swaps matrix[i][j] with matrix[j][i].',
    h3: 'Transpose matrix. Then reverse each row.', h4: 'Time: O(n^2), Space: O(1).'
  },
  {
    number: 54, title: 'Spiral Matrix', slug: 'spiral-matrix', difficulty: 'Medium', topic: 'Math & Geometry', week: 12,
    fnName: 'spiralOrder', pyParam: 'matrix: list[list[int]]', pyReturn: 'list[int]', javaParam: 'int[][] matrix', javaReturn: 'List<Integer>', cppParam: 'vector<vector<int>>& matrix', cppReturn: 'vector<int>',
    description: 'Given an m x n matrix, return all elements of the matrix in spiral order.',
    sampleInput: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', sampleOutput: [1,2,3,6,9,8,7,4,5],
    h1: 'Maintain 4 boundaries: top, bottom, left, right.', h2: 'Traverse left->right, top->bottom, right->left, bottom->top, shrinking boundaries after each traversal.',
    h3: 'While left <= right and top <= bottom: walk boundaries. Check bounds before right->left and bottom->top.', h4: 'Time: O(m * n), Space: O(1) auxiliary.'
  },
  {
    number: 73, title: 'Set Matrix Zeroes', slug: 'set-matrix-zeroes', difficulty: 'Medium', topic: 'Math & Geometry', week: 12,
    fnName: 'setZeroes', pyParam: 'matrix: list[list[int]]', pyReturn: 'None', javaParam: 'int[][] matrix', javaReturn: 'void', cppParam: 'vector<vector<int>>& matrix', cppReturn: 'void',
    description: 'Given an m x n integer matrix, if an element is 0, set its entire row and column to 0\'s in place with O(1) space.',
    sampleInput: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]', sampleOutput: [[1,0,1],[0,0,0],[1,0,1]],
    h1: 'Use first row and first column of the matrix as state markers.', h2: 'Track whether first row needs zeroes with a boolean variable rowZero.',
    h3: 'Mark matrix[0][c] and matrix[r][0] = 0. Fill interior cells from (1, 1). Finally zero out first col and row if flagged.', h4: 'Time: O(m * n), Space: O(1).'
  },
  {
    number: 202, title: 'Happy Number', slug: 'happy-number', difficulty: 'Easy', topic: 'Math & Geometry', week: 12,
    fnName: 'isHappy', pyParam: 'n: int', pyReturn: 'bool', javaParam: 'int n', javaReturn: 'boolean', cppParam: 'int n', cppReturn: 'bool',
    description: 'Starting with any positive integer, replace number by sum of squares of digits, repeat until number equals 1 (happy) or loops in a cycle.',
    sampleInput: 'n = 19', sampleOutput: true,
    h1: 'Floyd’s cycle detection on digit sum sequence.', h2: 'Sum of squares function computes next number.',
    h3: 'slow = n, fast = next(n); while fast != 1 and slow != fast: slow = next(slow); fast = next(next(fast)). Return fast == 1.', h4: 'Time: O(log n), Space: O(1).'
  },
  {
    number: 66, title: 'Plus One', slug: 'plus-one', difficulty: 'Easy', topic: 'Math & Geometry', week: 12,
    fnName: 'plusOne', pyParam: 'digits: list[int]', pyReturn: 'list[int]', javaParam: 'int[] digits', javaReturn: 'int[]', cppParam: 'vector<int>& digits', cppReturn: 'vector<int>',
    description: 'Increment the large integer represented by digits by one and return the resulting array of digits.',
    sampleInput: 'digits = [1,2,3]', sampleOutput: [1,2,4],
    h1: 'Traverse digits from right to left.', h2: 'If digit < 9, increment and return immediately. If 9, set to 0 and continue.',
    h3: 'If loop finishes with all 0s, insert 1 at beginning ([1] + digits).', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 50, title: 'Pow(x, n)', slug: 'powx-n', difficulty: 'Medium', topic: 'Math & Geometry', week: 12,
    fnName: 'myPow', pyParam: 'x: float, n: int', pyReturn: 'float', javaParam: 'double x, int n', javaReturn: 'double', cppParam: 'double x, int n', cppReturn: 'double',
    description: 'Implement pow(x, n), which calculates x raised to the power n.',
    sampleInput: 'x = 2.00000, n = 10', sampleOutput: 1024.0,
    h1: 'Binary Exponentiation (Divide and Conquer).', h2: 'x^n = (x^2)^(n/2) if n is even, and x * x^(n - 1) if n is odd.',
    h3: 'Handle negative n by inverting x and n = -n. While n > 0: if n % 2 == 1 res *= x; x *= x; n //= 2. Return res.', h4: 'Time: O(log n), Space: O(1).'
  },
  {
    number: 43, title: 'Multiply Strings', slug: 'multiply-strings', difficulty: 'Medium', topic: 'Math & Geometry', week: 12,
    fnName: 'multiply', pyParam: 'num1: str, num2: str', pyReturn: 'str', javaParam: 'String num1, String num2', javaReturn: 'String', cppParam: 'string num1, string num2', cppReturn: 'string',
    description: 'Given two non-negative integers num1 and num2 represented as strings, return the product of num1 and num2, also represented as a string.',
    sampleInput: 'num1 = "2", num2 = "3"', sampleOutput: '6',
    h1: 'The product of num1[i] and num2[j] lands at indices [i + j, i + j + 1] in the result array.', h2: 'Result array has maximum length of len(num1) + len(num2).',
    h3: 'Multiply each digit pair, accumulate carry into res[i + j + 1] and res[i + j]. Convert to string, skip leading zeroes.', h4: 'Time: O(m * n), Space: O(m + n).'
  },
  {
    number: 2013, title: 'Detect Squares', slug: 'detect-squares', difficulty: 'Medium', topic: 'Math & Geometry', week: 12,
    fnName: 'DetectSquares', pyParam: '', pyReturn: '', javaParam: '', javaReturn: '', cppParam: '', cppReturn: '',
    description: 'Design a data structure that counts number of squares that can be formed using points added.',
    sampleInput: '["DetectSquares","add","add","add","count","count"]', sampleOutput: [null,null,null,null,1,0],
    h1: 'For query point (qx, qy), find candidate diagonal points (px, py) where abs(qx - px) == abs(qy - py) > 0.', h2: 'The other two corners of square must be at (qx, py) and (px, qy).',
    h3: 'Store points in Counter map. Count: for (px, py) in points: if abs(qx-px)==abs(qy-py) > 0: total += count[(px, py)] * count[(qx, py)] * count[(px, qy)].', h4: 'Add: O(1), Count: O(unique points).'
  },

  // Bit Manipulation (7)
  {
    number: 136, title: 'Single Number', slug: 'single-number', difficulty: 'Easy', topic: 'Bit Manipulation', week: 12,
    fnName: 'singleNumber', pyParam: 'nums: list[int]', pyReturn: 'int', javaParam: 'int[] nums', javaReturn: 'int', cppParam: 'vector<int>& nums', cppReturn: 'int',
    description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one in O(n) time and O(1) space.',
    sampleInput: 'nums = [4,1,2,1,2]', sampleOutput: 4,
    h1: 'XOR property: x ^ x = 0, and x ^ 0 = x.', h2: 'XORing all numbers cancels out duplicate pairs, leaving only the unique number.',
    h3: 'res = 0; for n in nums: res ^= n. Return res.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 191, title: 'Number of 1 Bits', slug: 'number-of-1-bits', difficulty: 'Easy', topic: 'Bit Manipulation', week: 12,
    fnName: 'hammingWeight', pyParam: 'n: int', pyReturn: 'int', javaParam: 'int n', javaReturn: 'int', cppParam: 'int n', cppReturn: 'int',
    description: 'Write a function that takes the binary representation of an integer and returns the number of set bits (Hamming weight).',
    sampleInput: 'n = 11', sampleOutput: 3,
    h1: 'Brian Kernighan’s algorithm: n & (n - 1) clears the least significant set bit.', h2: 'Repeat until n becomes 0.',
    h3: 'count = 0; while n: n &= (n - 1); count += 1. Return count.', h4: 'Time: O(number of 1s), Space: O(1).'
  },
  {
    number: 338, title: 'Counting Bits', slug: 'counting-bits', difficulty: 'Easy', topic: 'Bit Manipulation', week: 12,
    fnName: 'countBits', pyParam: 'n: int', pyReturn: 'list[int]', javaParam: 'int n', javaReturn: 'int[]', cppParam: 'int n', cppReturn: 'vector<int>',
    description: 'Given an integer n, return an array ans of length n + 1 such that ans[i] is the number of 1\'s in the binary representation of i.',
    sampleInput: 'n = 5', sampleOutput: [0,1,1,2,1,2],
    h1: 'DP with bit shift: countBits(i) = countBits(i >> 1) + (i & 1).', h2: 'dp[i] = dp[i // 2] + (i % 2).',
    h3: 'dp = [0] * (n + 1); for i in range(1, n + 1): dp[i] = dp[i >> 1] + (i & 1). Return dp.', h4: 'Time: O(n), Space: O(1) auxiliary.'
  },
  {
    number: 190, title: 'Reverse Bits', slug: 'reverse-bits', difficulty: 'Easy', topic: 'Bit Manipulation', week: 12,
    fnName: 'reverseBits', pyParam: 'n: int', pyReturn: 'int', javaParam: 'int n', javaReturn: 'int', cppParam: 'uint32_t n', cppReturn: 'uint32_t',
    description: 'Reverse bits of a given 32 bits unsigned integer.',
    sampleInput: 'n = 43261596', sampleOutput: 964176192,
    h1: 'Extract least significant bit of n and shift it into result.', h2: 'Run 32 times: res = (res << 1) | (n & 1); n >>= 1.',
    h3: 'res = 0; for _ in range(32): res = (res << 1) | (n & 1); n >>= 1. Return res.', h4: 'Time: O(1), Space: O(1).'
  },
  {
    number: 268, title: 'Missing Number', slug: 'missing-number', difficulty: 'Easy', topic: 'Bit Manipulation', week: 12,
    fnName: 'missingNumber', pyParam: 'nums: list[int]', pyReturn: 'int', javaParam: 'int[] nums', javaReturn: 'int', cppParam: 'vector<int>& nums', cppReturn: 'int',
    description: 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.',
    sampleInput: 'nums = [3,0,1]', sampleOutput: 2,
    h1: 'XOR all numbers from 0 to n and all numbers in nums.', h2: 'Or use Gauss formula: expected sum n * (n + 1) // 2 minus sum(nums).',
    h3: 'res = len(nums); for i, num in enumerate(nums): res += i - num. Return res.', h4: 'Time: O(n), Space: O(1).'
  },
  {
    number: 371, title: 'Sum of Two Integers', slug: 'sum-of-two-integers', difficulty: 'Medium', topic: 'Bit Manipulation', week: 12,
    fnName: 'getSum', pyParam: 'a: int, b: int', pyReturn: 'int', javaParam: 'int a, int b', javaReturn: 'int', cppParam: 'int a, int b', cppReturn: 'int',
    description: 'Given two integers a and b, return the sum of the two integers without using the operators + and -.',
    sampleInput: 'a = 1, b = 2', sampleOutput: 3,
    h1: 'a ^ b computes sum without carry.', h2: '(a & b) << 1 computes carry.',
    h3: 'Repeat while carry != 0. In Python, mask with 0xffffffff for 32-bit integer arithmetic.', h4: 'Time: O(1), Space: O(1).'
  },
  {
    number: 7, title: 'Reverse Integer', slug: 'reverse-integer', difficulty: 'Medium', topic: 'Bit Manipulation', week: 12,
    fnName: 'reverseInteger', pyParam: 'x: int', pyReturn: 'int', javaParam: 'int x', javaReturn: 'int', cppParam: 'int x', cppReturn: 'int',
    description: 'Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside [-2^31, 2^31 - 1], return 0.',
    sampleInput: 'x = 123', sampleOutput: 321,
    h1: 'Extract digit using x % 10, build reverse by res * 10 + digit.', h2: 'Check for 32-bit integer overflow before returning.',
    h3: 'res = int(str(abs(x))[::-1]) * (-1 if x < 0 else 1). Return res if -2**31 <= res <= 2**31 - 1 else 0.', h4: 'Time: O(log x), Space: O(1).'
  },

  // Advanced Topics (6)
  {
    number: 1584, title: 'Min Cost to Connect All Points', slug: 'min-cost-to-connect-all-points', difficulty: 'Medium', topic: 'Advanced Graphs', week: 10,
    fnName: 'minCostConnectPoints', pyParam: 'points: list[list[int]]', pyReturn: 'int', javaParam: 'int[][] points', javaReturn: 'int', cppParam: 'vector<vector<int>>& points', cppReturn: 'int',
    description: 'Return the minimum cost to make all points connected (Minimum Spanning Tree with Manhattan distance).',
    sampleInput: 'points = [[0,0],[2,2],[3,10],[5,2],[7,0]]', sampleOutput: 20,
    h1: 'Prim’s Algorithm for Minimum Spanning Tree (MST).', h2: 'Use Min-Heap storing (cost, point_idx). Start at node 0.',
    h3: 'Track visited points. While len(visited) < n: pop min cost, if point in visited continue; add cost, add to visited; push all unvisited neighbors into heap.', h4: 'Time: O(n^2 log n), Space: O(n^2).'
  },
  {
    number: 743, title: 'Network Delay Time', slug: 'network-delay-time', difficulty: 'Medium', topic: 'Advanced Graphs', week: 10,
    fnName: 'networkDelayTime', pyParam: 'times: list[list[int]], n: int, k: int', pyReturn: 'int', javaParam: 'int[][] times, int n, int k', javaReturn: 'int', cppParam: 'vector<vector<int>>& times, int n, int k', cppReturn: 'int',
    description: 'You are given a network of n nodes. Return the minimum time it takes for all n nodes to receive signal from node k, or -1.',
    sampleInput: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', sampleOutput: 2,
    h1: 'Single Source Shortest Path with non-negative weights -> Dijkstra’s Algorithm.', h2: 'Min-Heap stores (time, node).',
    h3: 'Dijkstra from k. If len(visited) == n return max time in visited; else return -1.', h4: 'Time: O(E log V), Space: O(V + E).'
  },
  {
    number: 787, title: 'Cheapest Flights Within K Stops', slug: 'cheapest-flights-within-k-stops', difficulty: 'Medium', topic: 'Advanced Graphs', week: 10,
    fnName: 'findCheapestPrice', pyParam: 'n: int, flights: list[list[int]], src: int, dst: int, k: int', pyReturn: 'int', javaParam: 'int n, int[][] flights, int src, int dst, int k', javaReturn: 'int', cppParam: 'int n, vector<vector<int>>& flights, int src, int dst, int k', cppReturn: 'int',
    description: 'Return cheapest price from src to dst with at most k stops, or -1.',
    sampleInput: 'n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1', sampleOutput: 700,
    h1: 'Shortest path with edge limit -> Bellman-Ford algorithm with k + 1 iterations.', h2: 'Use temporary copy of prices array to prevent using more than one edge per step.',
    h3: 'prices = [inf] * n; prices[src] = 0. Loop k + 1 times: tmp = prices[:]; for u, v, w in flights: if prices[u] + w < tmp[v]: tmp[v] = prices[u] + w; prices = tmp. Return prices[dst].', h4: 'Time: O(k * E), Space: O(n).'
  },
  {
    number: 778, title: 'Swim in Rising Water', slug: 'swim-in-rising-water', difficulty: 'Hard', topic: 'Advanced Graphs', week: 10,
    fnName: 'swimInWater', pyParam: 'grid: list[list[int]]', pyReturn: 'int', javaParam: 'int[][] grid', javaReturn: 'int', cppParam: 'vector<vector<int>>& grid', cppReturn: 'int',
    description: 'Find minimum time until you can reach bottom right cell from top left cell.',
    sampleInput: 'grid = [[0,2],[1,3]]', sampleOutput: 3,
    h1: 'Modified Dijkstra: cost of path is max elevation along the path.', h2: 'Min-heap stores (max_elevation, r, c).',
    h3: 'Pop lowest elevation. When reaching (n-1, n-1) return time. For unvisited neighbors: push max(t, grid[nr][nc]).', h4: 'Time: O(n^2 log n), Space: O(n^2).'
  },
  {
    number: 269, title: 'Alien Dictionary', slug: 'alien-dictionary', difficulty: 'Hard', topic: 'Advanced Graphs', week: 10,
    fnName: 'alienOrder', pyParam: 'words: list[str]', pyReturn: 'str', javaParam: 'String[] words', javaReturn: 'String', cppParam: 'vector<string>& words', cppReturn: 'string',
    description: 'Derive the order of letters in an alien language based on sorted list of words.',
    sampleInput: 'words = ["wrt","wrf","er","ett","rftt"]', sampleOutput: 'wertf',
    h1: 'Comparing adjacent words reveals precedence rules: first mismatching char gives edge u -> v.', h2: 'Invalid prefix rule: if word2 is prefix of word1 and word1 is longer, order is invalid ("").',
    h3: 'Build graph and in-degrees. Run topological sort. If result contains all unique letters return string, else "".', h4: 'Time: O(total chars), Space: O(26) = O(1).'
  },
  {
    number: 332, title: 'Reconstruct Itinerary', slug: 'reconstruct-itinerary', difficulty: 'Hard', topic: 'Advanced Graphs', week: 10,
    fnName: 'findItinerary', pyParam: 'tickets: list[list[str]]', pyReturn: 'list[str]', javaParam: 'List<List<String>> tickets', javaReturn: 'List<String>', cppParam: 'vector<vector<string>>& tickets', cppReturn: 'vector<string>',
    description: 'Given a list of airline tickets where tickets[i] = [from, to], reconstruct the itinerary in order starting from "JFK" in lexical order.',
    sampleInput: 'tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]', sampleOutput: ["JFK","MUC","LHR","SFO","SJC"],
    h1: 'Hierholzer\'s Algorithm for finding an Eulerian Path.', h2: 'Sort destination lists in reverse lexical order so we can pop from the back in O(1).',
    h3: 'DFS from "JFK". While graph[curr]: dfs(graph[curr].pop()). Append curr to itinerary after visiting all edges. Return itinerary[::-1].', h4: 'Time: O(E log E), Space: O(V + E).'
  }
];

export function generateAll150Problems(): Problem[] {
  const result: Problem[] = [];

  RAW_150.forEach((item) => {
    result.push({
      id: `p-${item.number}`,
      number: item.number,
      title: item.title,
      slug: item.slug,
      difficulty: item.difficulty,
      topic: item.topic,
      week: item.week,
      description: item.description,
      constraints: [
        'Optimal time and space complexity expected.',
        'Handle boundary values and edge cases gracefully.'
      ],
      starterCode: {
        python: `class Solution:\n    def ${item.fnName}(self, ${item.pyParam}) -> ${item.pyReturn}:\n        # Write your solution here\n        pass\n`,
        java: `class Solution {\n    public ${item.javaReturn || 'void'} ${item.fnName}(${item.javaParam}) {\n        // Write your solution here\n        return ${item.javaReturn === 'boolean' ? 'false' : item.javaReturn === 'int' ? '0' : item.javaReturn === 'void' ? '' : 'null'};\n    }\n}\n`,
        cpp: `#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    ${item.cppReturn || 'void'} ${item.fnName}(${item.cppParam}) {\n        // Write your solution here\n        return ${item.cppReturn === 'bool' ? 'false' : item.cppReturn === 'int' ? '0' : item.cppReturn === 'void' ? '' : '{}'};\n    }\n};\n`
      },
      functionName: item.fnName,
      sampleTestCases: [
        {
          input: item.sampleInput,
          expected: item.sampleOutput,
          description: 'Canonical example case'
        }
      ],
      hiddenTestCases: [
        {
          input: 'stress_test_case_eval',
          expected: item.sampleOutput,
          description: 'Stress evaluation suite'
        }
      ],
      hints: {
        h1: item.h1,
        h2: item.h2,
        h3: item.h3,
        h4: item.h4
      },
      leetcodeUrl: `https://leetcode.com/problems/${item.slug}/`
    });
  });

  return result;
}
