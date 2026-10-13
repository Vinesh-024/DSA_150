import { Problem, ProblemDefinition } from '../types/curriculum';
import { buildStarterTemplates, toProblemDefinition } from './problemSignatures';

export const PROBLEMS_RAW: Array<Omit<Problem, 'starterCode' | 'starterTemplates' | 'testCases' | 'sampleTestCases' | 'hiddenTestCases' | 'functionName'> & {
  slug: string;
  defaultFunctionName: string;
  starterJs?: string;
  starterPy?: string;
  sampleTestCases?: Problem['sampleTestCases'];
  hiddenTestCases?: Problem['hiddenTestCases'];
}> = [
  // WEEK 1: Arrays & Hashing (9) + Two Pointers (5) = 14
  {
    id: 'p-217',
    number: 217,
    title: 'Contains Duplicate',
    week: 1,
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    slug: 'contains-duplicate',
    leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/',
    solutionVideoUrl: 'https://youtu.be/3OamzN90kPg',
    defaultFunctionName: 'containsDuplicate',
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    sampleTestCases: [
      { input: 'nums = [1, 2, 3, 1]', parsedInput: [[1, 2, 3, 1]], expected: true, description: 'Repeated 1' },
      { input: 'nums = [1, 2, 3, 4]', parsedInput: [[1, 2, 3, 4]], expected: false, description: 'All distinct elements' },
      { input: 'nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]', parsedInput: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true, description: 'Multiple duplicates' }
    ],
    hiddenTestCases: [
      { input: 'nums = [99]', parsedInput: [[99]], expected: false, description: 'Single element boundary', isHidden: true },
      { input: 'nums = [0, 0]', parsedInput: [[0, 0]], expected: true, description: 'Two zeros', isHidden: true },
      { input: 'nums = [-5, -4, -3, -2, -1]', parsedInput: [[-5, -4, -3, -2, -1]], expected: false, description: 'Negative numbers all distinct', isHidden: true },
      { input: 'nums = [1000, 2000, 3000, 1000]', parsedInput: [[1000, 2000, 3000, 1000]], expected: true, description: 'Large duplicate values', isHidden: true }
    ]
  },
  {
    id: 'p-242',
    number: 242,
    title: 'Valid Anagram',
    week: 1,
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    slug: 'valid-anagram',
    leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/',
    solutionVideoUrl: 'https://youtu.be/9UtInBqnCgA',
    defaultFunctionName: 'isAnagram',
    description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase.',
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters.'],
    sampleTestCases: [
      { input: 's = "anagram", t = "nagaram"', parsedInput: ['anagram', 'nagaram'], expected: true },
      { input: 's = "rat", t = "car"', parsedInput: ['rat', 'car'], expected: false }
    ],
    hiddenTestCases: [
      { input: 's = "a", t = "a"', parsedInput: ['a', 'a'], expected: true, isHidden: true },
      { input: 's = "ab", t = "a"', parsedInput: ['ab', 'a'], expected: false, isHidden: true },
      { input: 's = "listen", t = "silent"', parsedInput: ['listen', 'silent'], expected: true, isHidden: true }
    ]
  },
  {
    id: 'p-1',
    number: 1,
    title: 'Two Sum',
    week: 1,
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    slug: 'two-sum',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    solutionVideoUrl: 'https://youtu.be/KLlXCFG5TnA',
    defaultFunctionName: 'twoSum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    sampleTestCases: [
      { input: 'nums = [2,7,11,15], target = 9', parsedInput: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: 'nums = [3,2,4], target = 6', parsedInput: [[3, 2, 4], 6], expected: [1, 2] },
      { input: 'nums = [3,3], target = 6', parsedInput: [[3, 3], 6], expected: [0, 1] }
    ],
    hiddenTestCases: [
      { input: 'nums = [-3,4,3,90], target = 0', parsedInput: [[-3, 4, 3, 90], 0], expected: [0, 2], isHidden: true },
      { input: 'nums = [1,5,10,25], target = 35', parsedInput: [[1, 5, 10, 25], 35], expected: [2, 3], isHidden: true }
    ]
  },
  {
    id: 'p-49',
    number: 49,
    title: 'Group Anagrams',
    week: 1,
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    slug: 'group-anagrams',
    leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/',
    solutionVideoUrl: 'https://youtu.be/vzdNOK2oB2E',
    defaultFunctionName: 'groupAnagrams',
    description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],
    sampleTestCases: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', parsedInput: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]] },
      { input: 'strs = [""]', parsedInput: [[""]], expected: [[""]] },
      { input: 'strs = ["a"]', parsedInput: [["a"]], expected: [["a"]] }
    ],
    hiddenTestCases: [
      { input: 'strs = ["a","b","a"]', parsedInput: [["a", "b", "a"]], expected: [["a", "a"], ["b"]], isHidden: true }
    ]
  },
  {
    id: 'p-347',
    number: 347,
    title: 'Top K Frequent Elements',
    week: 1,
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    slug: 'top-k-frequent-elements',
    leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/',
    solutionVideoUrl: 'https://youtu.be/YPTqKIgVk-v',
    defaultFunctionName: 'topKFrequent',
    description: 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in the range [1, the number of unique elements in the array].'],
    sampleTestCases: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', parsedInput: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
      { input: 'nums = [1], k = 1', parsedInput: [[1], 1], expected: [1] }
    ],
    hiddenTestCases: [
      { input: 'nums = [4,1,-1,2,-1,2,3], k = 2', parsedInput: [[4, 1, -1, 2, -1, 2, 3], 2], expected: [-1, 2], isHidden: true }
    ]
  },
  {
    id: 'p-238',
    number: 238,
    title: 'Product of Array Except Self',
    week: 1,
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    slug: 'product-of-array-except-self',
    leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/',
    solutionVideoUrl: 'https://youtu.be/bNvIQI2wAjk',
    defaultFunctionName: 'productExceptSelf',
    description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. Solve without using division in O(n) time.',
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30'],
    sampleTestCases: [
      { input: 'nums = [1,2,3,4]', parsedInput: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { input: 'nums = [-1,1,0,-3,3]', parsedInput: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] }
    ],
    hiddenTestCases: [
      { input: 'nums = [2,3]', parsedInput: [[2, 3]], expected: [3, 2], isHidden: true },
      { input: 'nums = [0,0]', parsedInput: [[0, 0]], expected: [0, 0], isHidden: true }
    ]
  },
  {
    id: 'p-36',
    number: 36,
    title: 'Valid Sudoku',
    week: 1,
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    slug: 'valid-sudoku',
    leetcodeUrl: 'https://leetcode.com/problems/valid-sudoku/',
    solutionVideoUrl: 'https://youtu.be/TjFXEUCMqI8',
    defaultFunctionName: 'isValidSudoku',
    description: 'Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the mention rules.',
    constraints: ['board.length == 9', 'board[i].length == 9', 'board[i][j] is a digit 1-9 or \'.\''],
    sampleTestCases: [
      {
        input: 'board = standard valid board',
        parsedInput: [[
          ["5","3",".",".","7",".",".",".","."],
          ["6",".",".","1","9","5",".",".","."],
          [".","9","8",".",".",".",".","6","."],
          ["8",".",".",".","6",".",".",".","3"],
          ["4",".",".","8",".","3",".",".","1"],
          ["7",".",".",".","2",".",".",".","6"],
          [".","6",".",".",".",".","2","8","."],
          [".",".",".","4","1","9",".",".","5"],
          [".",".",".",".","8",".",".","7","9"]
        ]],
        expected: true
      }
    ],
    hiddenTestCases: []
  },
  {
    id: 'p-271',
    number: 271,
    title: 'Encode and Decode Strings',
    week: 1,
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    slug: 'encode-and-decode-strings',
    leetcodeUrl: 'https://leetcode.com/problems/encode-and-decode-strings/',
    freeVersionUrl: 'https://neetcode.io/problems/string-encode-and-decode',
    solutionVideoUrl: 'https://youtu.be/B1k_sxOSgv8',
    defaultFunctionName: 'encode',
    description: 'Design an algorithm to encode a list of strings to a single string, and then decode the single string back to the original list of strings.',
    constraints: ['0 <= strs.length <= 200', '0 <= strs[i].length <= 200', 'strs[i] contains any possible characters.'],
    sampleTestCases: [
      { input: 'strs = ["neet","code","love","you"]', parsedInput: [["neet","code","love","you"]], expected: ["neet","code","love","you"] }
    ],
    hiddenTestCases: []
  },
  {
    id: 'p-128',
    number: 128,
    title: 'Longest Consecutive Sequence',
    week: 1,
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    slug: 'longest-consecutive-sequence',
    leetcodeUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/',
    solutionVideoUrl: 'https://youtu.be/P6RZZMu_maU',
    defaultFunctionName: 'longestConsecutive',
    description: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence in O(n) time.',
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    sampleTestCases: [
      { input: 'nums = [100,4,200,1,3,2]', parsedInput: [[100, 4, 200, 1, 3, 2]], expected: 4 },
      { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', parsedInput: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 }
    ],
    hiddenTestCases: [
      { input: 'nums = []', parsedInput: [[]], expected: 0, isHidden: true },
      { input: 'nums = [1]', parsedInput: [[1]], expected: 1, isHidden: true }
    ]
  },
  // Week 1: Two Pointers
  {
    id: 'p-125',
    number: 125,
    title: 'Valid Palindrome',
    week: 1,
    topic: 'Two Pointers',
    difficulty: 'Easy',
    slug: 'valid-palindrome',
    leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/',
    solutionVideoUrl: 'https://youtu.be/jJXJ16kPFWg',
    defaultFunctionName: 'isPalindrome',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    sampleTestCases: [
      { input: 's = "A man, a plan, a canal: Panama"', parsedInput: ['A man, a plan, a canal: Panama'], expected: true },
      { input: 's = "race a car"', parsedInput: ['race a car'], expected: false },
      { input: 's = " "', parsedInput: [' '], expected: true }
    ],
    hiddenTestCases: [
      { input: 's = "0P"', parsedInput: ['0P'], expected: false, isHidden: true },
      { input: 's = "a."', parsedInput: ['a.'], expected: true, isHidden: true }
    ]
  },
  {
    id: 'p-167',
    number: 167,
    title: 'Two Sum II (Input Array Is Sorted)',
    week: 1,
    topic: 'Two Pointers',
    difficulty: 'Medium',
    slug: 'two-sum-ii-input-array-is-sorted',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
    solutionVideoUrl: 'https://youtu.be/cQ1Oz4ckcMT0',
    defaultFunctionName: 'twoSum',
    description: 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number. Return the indices + 1.',
    constraints: ['2 <= numbers.length <= 3 * 10^4', '-1000 <= numbers[i] <= 1000', 'numbers is sorted in non-decreasing order.'],
    sampleTestCases: [
      { input: 'numbers = [2,7,11,15], target = 9', parsedInput: [[2, 7, 11, 15], 9], expected: [1, 2] },
      { input: 'numbers = [2,3,4], target = 6', parsedInput: [[2, 3, 4], 6], expected: [1, 3] },
      { input: 'numbers = [-1,0], target = -1', parsedInput: [[-1, 0], -1], expected: [1, 2] }
    ],
    hiddenTestCases: []
  },
  {
    id: 'p-15',
    number: 15,
    title: '3Sum',
    week: 1,
    topic: 'Two Pointers',
    difficulty: 'Medium',
    slug: '3sum',
    leetcodeUrl: 'https://leetcode.com/problems/3sum/',
    solutionVideoUrl: 'https://youtu.be/jzZsG8n2R9A',
    defaultFunctionName: 'threeSum',
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0 without duplicate triplets.',
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    sampleTestCases: [
      { input: 'nums = [-1,0,1,2,-1,-4]', parsedInput: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
      { input: 'nums = [0,1,1]', parsedInput: [[0, 1, 1]], expected: [] },
      { input: 'nums = [0,0,0]', parsedInput: [[0, 0, 0]], expected: [[0, 0, 0]] }
    ],
    hiddenTestCases: []
  },
  {
    id: 'p-11',
    number: 11,
    title: 'Container With Most Water',
    week: 1,
    topic: 'Two Pointers',
    difficulty: 'Medium',
    slug: 'container-with-most-water',
    leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
    solutionVideoUrl: 'https://youtu.be/UuiTKBwPgAo',
    defaultFunctionName: 'maxArea',
    description: 'Given n non-negative integers height where each represents a point at coordinate (i, height[i]). Find two lines that together with the x-axis form a container that contains the most water.',
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    sampleTestCases: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', parsedInput: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { input: 'height = [1,1]', parsedInput: [[1, 1]], expected: 1 }
    ],
    hiddenTestCases: []
  },
  {
    id: 'p-42',
    number: 42,
    title: 'Trapping Rain Water',
    week: 1,
    topic: 'Two Pointers',
    difficulty: 'Hard',
    slug: 'trapping-rain-water',
    leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/',
    solutionVideoUrl: 'https://youtu.be/ZI2z5830MT8',
    defaultFunctionName: 'trap',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    sampleTestCases: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', parsedInput: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { input: 'height = [4,2,0,3,2,5]', parsedInput: [[4, 2, 0, 3, 2, 5]], expected: 9 }
    ],
    hiddenTestCases: []
  },

  // WEEK 2: Sliding Window (6) + Stack (7) = 13
  {
    id: 'p-121',
    number: 121,
    title: 'Best Time to Buy And Sell Stock',
    week: 2,
    topic: 'Sliding Window',
    difficulty: 'Easy',
    slug: 'best-time-to-buy-and-sell-stock',
    leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    solutionVideoUrl: 'https://youtu.be/1pkOgXD63yU',
    defaultFunctionName: 'maxProfit',
    description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    sampleTestCases: [
      { input: 'prices = [7,1,5,3,6,4]', parsedInput: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { input: 'prices = [7,6,4,3,1]', parsedInput: [[7, 6, 4, 3, 1]], expected: 0 }
    ],
    hiddenTestCases: []
  },
  {
    id: 'p-3',
    number: 3,
    title: 'Longest Substring Without Repeating Characters',
    week: 2,
    topic: 'Sliding Window',
    difficulty: 'Medium',
    slug: 'longest-substring-without-repeating-characters',
    leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    solutionVideoUrl: 'https://youtu.be/wiGpQwVHdE0',
    defaultFunctionName: 'lengthOfLongestSubstring',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    sampleTestCases: [
      { input: 's = "abcabcbb"', parsedInput: ['abcabcbb'], expected: 3 },
      { input: 's = "bbbbb"', parsedInput: ['bbbbb'], expected: 1 },
      { input: 's = "pwwkew"', parsedInput: ['pwwkew'], expected: 3 }
    ],
    hiddenTestCases: []
  },
  {
    id: 'p-424',
    number: 424,
    title: 'Longest Repeating Character Replacement',
    week: 2,
    topic: 'Sliding Window',
    difficulty: 'Medium',
    slug: 'longest-repeating-character-replacement',
    leetcodeUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
    solutionVideoUrl: 'https://youtu.be/gqXU1UyA8pk',
    defaultFunctionName: 'characterReplacement',
    description: 'You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character at most k times. Return the length of the longest substring containing the same letter you can get.',
    constraints: ['1 <= s.length <= 10^5', 's consists of only uppercase English letters.', '0 <= k <= s.length'],
    sampleTestCases: [
      { input: 's = "ABAB", k = 2', parsedInput: ['ABAB', 2], expected: 4 },
      { input: 's = "AABABBA", k = 1', parsedInput: ['AABABBA', 1], expected: 4 }
    ],
    hiddenTestCases: []
  },
  {
    id: 'p-567',
    number: 567,
    title: 'Permutation In String',
    week: 2,
    topic: 'Sliding Window',
    difficulty: 'Medium',
    slug: 'permutation-in-string',
    leetcodeUrl: 'https://leetcode.com/problems/permutation-in-string/',
    solutionVideoUrl: 'https://youtu.be/UbyhOgBN834',
    defaultFunctionName: 'checkInclusion',
    description: 'Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise.',
    constraints: ['1 <= s1.length, s2.length <= 10^4', 's1 and s2 consist of lowercase English letters.'],
    sampleTestCases: [
      { input: 's1 = "ab", s2 = "eidbaooo"', parsedInput: ['ab', 'eidbaooo'], expected: true },
      { input: 's1 = "ab", s2 = "eidboaoo"', parsedInput: ['ab', 'eidboaoo'], expected: false }
    ],
    hiddenTestCases: []
  },
  {
    id: 'p-76',
    number: 76,
    title: 'Minimum Window Substring',
    week: 2,
    topic: 'Sliding Window',
    difficulty: 'Hard',
    slug: 'minimum-window-substring',
    leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/',
    solutionVideoUrl: 'https://youtu.be/jSto0O4AJbM',
    defaultFunctionName: 'minWindow',
    description: 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".',
    constraints: ['m == s.length', 'n == t.length', '1 <= m, n <= 10^5', 's and t consist of uppercase and lowercase English letters.'],
    sampleTestCases: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', parsedInput: ['ADOBECODEBANC', 'ABC'], expected: 'BANC' },
      { input: 's = "a", t = "a"', parsedInput: ['a', 'a'], expected: 'a' },
      { input: 's = "a", t = "aa"', parsedInput: ['a', 'aa'], expected: '' }
    ],
    hiddenTestCases: []
  },
  {
    id: 'p-239',
    number: 239,
    title: 'Sliding Window Maximum',
    week: 2,
    topic: 'Sliding Window',
    difficulty: 'Hard',
    slug: 'sliding-window-maximum',
    leetcodeUrl: 'https://leetcode.com/problems/sliding-window-maximum/',
    solutionVideoUrl: 'https://youtu.be/DfljaUwZsOk',
    defaultFunctionName: 'maxSlidingWindow',
    description: 'You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. Return the max sliding window array.',
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
    sampleTestCases: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', parsedInput: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
      { input: 'nums = [1], k = 1', parsedInput: [[1], 1], expected: [1] }
    ],
    hiddenTestCases: []
  },
  // Week 2: Stack
  {
    id: 'p-20',
    number: 20,
    title: 'Valid Parentheses',
    week: 2,
    topic: 'Stack',
    difficulty: 'Easy',
    slug: 'valid-parentheses',
    leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
    solutionVideoUrl: 'https://youtu.be/WTzjTskDFMg',
    defaultFunctionName: 'isValid',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \'()[]{}\'.'],
    sampleTestCases: [
      { input: 's = "()"', parsedInput: ['()'], expected: true },
      { input: 's = "()[]{}"', parsedInput: ['()[]{}'], expected: true },
      { input: 's = "(]"', parsedInput: ['(]'], expected: false }
    ],
    hiddenTestCases: []
  },
  {
    id: 'p-155',
    number: 155,
    title: 'Min Stack',
    week: 2,
    topic: 'Stack',
    difficulty: 'Medium',
    slug: 'min-stack',
    leetcodeUrl: 'https://leetcode.com/problems/min-stack/',
    solutionVideoUrl: 'https://youtu.be/qkLl7nAwDPo',
    defaultFunctionName: 'MinStack',
    description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1).',
    constraints: ['Methods pop, top and getMin operations will always be called on non-empty stacks.'],
    sampleTestCases: [],
    hiddenTestCases: []
  },
  {
    id: 'p-150',
    number: 150,
    title: 'Evaluate Reverse Polish Notation',
    week: 2,
    topic: 'Stack',
    difficulty: 'Medium',
    slug: 'evaluate-reverse-polish-notation',
    leetcodeUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
    solutionVideoUrl: 'https://youtu.be/iu48dQr8440',
    defaultFunctionName: 'evalRPN',
    description: 'You are given an array of strings tokens that represents an arithmetic expression in a Reverse Polish Notation. Evaluate the expression and return an integer.',
    constraints: ['1 <= tokens.length <= 10^4', 'tokens[i] is an operator (+, -, *, /) or an integer.'],
    sampleTestCases: [
      { input: 'tokens = ["2","1","+","3","*"]', parsedInput: [["2","1","+","3","*"]], expected: 9 },
      { input: 'tokens = ["4","13","5","/","+"]', parsedInput: [["4","13","5","/","+"]], expected: 6 }
    ],
    hiddenTestCases: []
  },
  {
    id: 'p-22',
    number: 22,
    title: 'Generate Parentheses',
    week: 2,
    topic: 'Stack',
    difficulty: 'Medium',
    slug: 'generate-parentheses',
    leetcodeUrl: 'https://leetcode.com/problems/generate-parentheses/',
    solutionVideoUrl: 'https://youtu.be/s9fokUqJ76A',
    defaultFunctionName: 'generateParenthesis',
    description: 'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
    constraints: ['1 <= n <= 8'],
    sampleTestCases: [
      { input: 'n = 3', parsedInput: [3], expected: ["((()))","(()())","(())()","()(())","()()()"] },
      { input: 'n = 1', parsedInput: [1], expected: ["()"] }
    ],
    hiddenTestCases: []
  },
  {
    id: 'p-739',
    number: 739,
    title: 'Daily Temperatures',
    week: 2,
    topic: 'Stack',
    difficulty: 'Medium',
    slug: 'daily-temperatures',
    leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/',
    solutionVideoUrl: 'https://youtu.be/cTBiBSnjO3c',
    defaultFunctionName: 'dailyTemperatures',
    description: 'Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.',
    constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    sampleTestCases: [
      { input: 'temperatures = [73,74,75,71,69,72,76,73]', parsedInput: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
      { input: 'temperatures = [30,40,50,60]', parsedInput: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] }
    ],
    hiddenTestCases: []
  },
  {
    id: 'p-853',
    number: 853,
    title: 'Car Fleet',
    week: 2,
    topic: 'Stack',
    difficulty: 'Medium',
    slug: 'car-fleet',
    leetcodeUrl: 'https://leetcode.com/problems/car-fleet/',
    solutionVideoUrl: 'https://youtu.be/Pr6T-3WoOKI',
    defaultFunctionName: 'carFleet',
    description: 'There are n cars at given miles away from the starting mile 0, traveling to target miles. Return the number of car fleets that will arrive at the destination.',
    constraints: ['n == position.length == speed.length', '1 <= n <= 10^5', '0 < target <= 10^6', '0 <= position[i] < target'],
    sampleTestCases: [
      { input: 'target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]', parsedInput: [12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]], expected: 3 }
    ],
    hiddenTestCases: []
  },
  {
    id: 'p-84',
    number: 84,
    title: 'Largest Rectangle In Histogram',
    week: 2,
    topic: 'Stack',
    difficulty: 'Hard',
    slug: 'largest-rectangle-in-histogram',
    leetcodeUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
    solutionVideoUrl: 'https://youtu.be/zx5Sw9130L0',
    defaultFunctionName: 'largestRectangleArea',
    description: 'Given an array of integers heights representing the histogram\'s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.',
    constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
    sampleTestCases: [
      { input: 'heights = [2,1,5,6,2,3]', parsedInput: [[2, 1, 5, 6, 2, 3]], expected: 10 },
      { input: 'heights = [2,4]', parsedInput: [[2, 4]], expected: 4 }
    ],
    hiddenTestCases: []
  },

  // WEEK 3: Binary Search (7) + Intervals (6) = 13
  { id: 'p-704', number: 704, title: 'Binary Search', week: 3, topic: 'Binary Search', difficulty: 'Easy', slug: 'binary-search', leetcodeUrl: 'https://leetcode.com/problems/binary-search/', solutionVideoUrl: 'https://youtu.be/s4D98a97B1U', defaultFunctionName: 'search', description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.', constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All the integers in nums are unique.'], sampleTestCases: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', parsedInput: [[-1,0,3,5,9,12], 9], expected: 4 }], hiddenTestCases: [] },
  { id: 'p-74', number: 74, title: 'Search a 2D Matrix', week: 3, topic: 'Binary Search', difficulty: 'Medium', slug: 'search-a-2d-matrix', leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix/', solutionVideoUrl: 'https://youtu.be/Ber2pi2C0j0', defaultFunctionName: 'searchMatrix', description: 'You are given an m x n integer matrix matrix with properties: Each row is sorted in non-decreasing order and first int of row is greater than last int of previous row. Return true if target is in matrix.', constraints: ['m == matrix.length', 'n == matrix[i].length'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-875', number: 875, title: 'Koko Eating Bananas', week: 3, topic: 'Binary Search', difficulty: 'Medium', slug: 'koko-eating-bananas', leetcodeUrl: 'https://leetcode.com/problems/koko-eating-bananas/', solutionVideoUrl: 'https://youtu.be/U2SozAs9RzA', defaultFunctionName: 'minEatingSpeed', description: 'Koko loves to eat bananas. There are n piles of bananas. Return the minimum integer k such that she can eat all the bananas within h hours.', constraints: ['1 <= piles.length <= 10^4', 'piles.length <= h <= 10^9'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-153', number: 153, title: 'Find Minimum In Rotated Sorted Array', week: 3, topic: 'Binary Search', difficulty: 'Medium', slug: 'find-minimum-in-rotated-sorted-array', leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', solutionVideoUrl: 'https://youtu.be/nIVW4P8b1VA', defaultFunctionName: 'findMin', description: 'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Notice that rotating an array [a[0], a[1], ...] once results in [a[n-1], a[0], ...]. Return the minimum element in O(log n).', constraints: ['n == nums.length', '1 <= n <= 5000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-33', number: 33, title: 'Search In Rotated Sorted Array', week: 3, topic: 'Binary Search', difficulty: 'Medium', slug: 'search-in-rotated-sorted-array', leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', solutionVideoUrl: 'https://youtu.be/U8XENwh8Oy8', defaultFunctionName: 'search', description: 'Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums in O(log n).', constraints: ['1 <= nums.length <= 5000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-981', number: 981, title: 'Time Based Key-Value Store', week: 3, topic: 'Binary Search', difficulty: 'Medium', slug: 'time-based-key-value-store', leetcodeUrl: 'https://leetcode.com/problems/time-based-key-value-store/', solutionVideoUrl: 'https://youtu.be/fu2cD_6E8Hw', defaultFunctionName: 'TimeMap', description: 'Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the key\'s value at a certain timestamp.', constraints: ['1 <= key.length, value.length <= 100'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-4', number: 4, title: 'Median of Two Sorted Arrays', week: 3, topic: 'Binary Search', difficulty: 'Hard', slug: 'median-of-two-sorted-arrays', leetcodeUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', solutionVideoUrl: 'https://youtu.be/q6IEA26hvPE', defaultFunctionName: 'findMedianSortedArrays', description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays in O(log (m+n)) runtime.', constraints: ['nums1.length == m', 'nums2.length == n', '0 <= m <= 1000', '0 <= n <= 1000'], sampleTestCases: [], hiddenTestCases: [] },
  // Week 3 Intervals
  { id: 'p-252', number: 252, title: 'Meeting Rooms', week: 3, topic: 'Intervals', difficulty: 'Easy', slug: 'meeting-rooms', leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms/', freeVersionUrl: 'https://neetcode.io/problems/meeting-schedule', solutionVideoUrl: 'https://youtu.be/PaJxqZt63dQ', defaultFunctionName: 'canAttendMeetings', description: 'Given an array of meeting time intervals where intervals[i] = [start_i, end_i], determine if a person could attend all meetings.', constraints: ['0 <= intervals.length <= 10^4'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-57', number: 57, title: 'Insert Interval', week: 3, topic: 'Intervals', difficulty: 'Medium', slug: 'insert-interval', leetcodeUrl: 'https://leetcode.com/problems/insert-interval/', solutionVideoUrl: 'https://youtu.be/A8NUOmlwOlM', defaultFunctionName: 'insert', description: 'You are given an array of non-overlapping intervals intervals where intervals[i] = [start_i, end_i] sorted in ascending order by start_i. Insert newInterval into intervals such that intervals is still sorted and non-overlapping.', constraints: ['0 <= intervals.length <= 10^4'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-56', number: 56, title: 'Merge Intervals', week: 3, topic: 'Intervals', difficulty: 'Medium', slug: 'merge-intervals', leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/', solutionVideoUrl: 'https://youtu.be/44H3cEC2fFM', defaultFunctionName: 'merge', description: 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.', constraints: ['1 <= intervals.length <= 10^4'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-435', number: 435, title: 'Non-overlapping Intervals', week: 3, topic: 'Intervals', difficulty: 'Medium', slug: 'non-overlapping-intervals', leetcodeUrl: 'https://leetcode.com/problems/non-overlapping-intervals/', solutionVideoUrl: 'https://youtu.be/nONCGxWoUfM', defaultFunctionName: 'eraseOverlapIntervals', description: 'Given an array of intervals intervals where intervals[i] = [start_i, end_i], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.', constraints: ['1 <= intervals.length <= 10^5'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-253', number: 253, title: 'Meeting Rooms II', week: 3, topic: 'Intervals', difficulty: 'Medium', slug: 'meeting-rooms-ii', leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms-ii/', freeVersionUrl: 'https://neetcode.io/problems/meeting-schedule-ii', solutionVideoUrl: 'https://youtu.be/FdzJmTCVyJU', defaultFunctionName: 'minMeetingRooms', description: 'Given an array of meeting time intervals intervals where intervals[i] = [start_i, end_i], find the minimum number of conference rooms required.', constraints: ['1 <= intervals.length <= 10^4'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-1851', number: 1851, title: 'Minimum Interval to Include Each Query', week: 3, topic: 'Intervals', difficulty: 'Hard', slug: 'minimum-interval-to-include-each-query', leetcodeUrl: 'https://leetcode.com/problems/minimum-interval-to-include-each-query/', solutionVideoUrl: 'https://youtu.be/5hQ5WWW5awQ', defaultFunctionName: 'minInterval', description: 'You are given a 2D integer array intervals and queries. The size of an interval is right - left + 1. Return an array containing the answer for each query.', constraints: ['1 <= intervals.length <= 10^5'], sampleTestCases: [], hiddenTestCases: [] },

  // WEEK 4: Linked List (11)
  { id: 'p-206', number: 206, title: 'Reverse Linked List', week: 4, topic: 'Linked List', difficulty: 'Easy', slug: 'reverse-linked-list', leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/', solutionVideoUrl: 'https://youtu.be/G0_I-ZF0S38', defaultFunctionName: 'reverseList', description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.', constraints: ['The number of nodes in the list is the range [0, 5000].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-21', number: 21, title: 'Merge Two Sorted Lists', week: 4, topic: 'Linked List', difficulty: 'Easy', slug: 'merge-two-sorted-lists', leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/', solutionVideoUrl: 'https://youtu.be/XIdigk956u0', defaultFunctionName: 'mergeTwoLists', description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.', constraints: ['The number of nodes in both lists is in the range [0, 50].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-141', number: 141, title: 'Linked List Cycle', week: 4, topic: 'Linked List', difficulty: 'Easy', slug: 'linked-list-cycle', leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/', solutionVideoUrl: 'https://youtu.be/gBTe7lFR3vc', defaultFunctionName: 'hasCycle', description: 'Given head, the head of a linked list, determine if the linked list has a cycle in it using Floyd\'s Tortoise and Hare algorithm.', constraints: ['The number of the nodes in the list is in the range [0, 10^4].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-143', number: 143, title: 'Reorder List', week: 4, topic: 'Linked List', difficulty: 'Medium', slug: 'reorder-list', leetcodeUrl: 'https://leetcode.com/problems/reorder-list/', solutionVideoUrl: 'https://youtu.be/S5bfdUTrKLM', defaultFunctionName: 'reorderList', description: 'You are given the head of a singly linked-list. Reorder the list to be: L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → ...', constraints: ['The number of nodes in the list is in the range [1, 5 * 10^4].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-19', number: 19, title: 'Remove Nth Node From End of List', week: 4, topic: 'Linked List', difficulty: 'Medium', slug: 'remove-nth-node-from-end-of-list', leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', solutionVideoUrl: 'https://youtu.be/XVuQxVej6y8', defaultFunctionName: 'removeNthFromEnd', description: 'Given the head of a linked list, remove the nth node from the end of the list and return its head.', constraints: ['The number of nodes in the list is sz.', '1 <= sz <= 30'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-138', number: 138, title: 'Copy List With Random Pointer', week: 4, topic: 'Linked List', difficulty: 'Medium', slug: 'copy-list-with-random-pointer', leetcodeUrl: 'https://leetcode.com/problems/copy-list-with-random-pointer/', solutionVideoUrl: 'https://youtu.be/5Y2EiZST97Y', defaultFunctionName: 'copyRandomList', description: 'Construct a deep copy of a linked list where each node contains an additional random pointer.', constraints: ['0 <= n <= 1000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-2', number: 2, title: 'Add Two Numbers', week: 4, topic: 'Linked List', difficulty: 'Medium', slug: 'add-two-numbers', leetcodeUrl: 'https://leetcode.com/problems/add-two-numbers/', solutionVideoUrl: 'https://youtu.be/wgFPrzTjm7s', defaultFunctionName: 'addTwoNumbers', description: 'You are given two non-empty linked lists representing two non-negative integers stored in reverse order. Add the two numbers and return the sum as a linked list.', constraints: ['The number of nodes in each linked list is in the range [1, 100].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-287', number: 287, title: 'Find The Duplicate Number', week: 4, topic: 'Linked List', difficulty: 'Medium', slug: 'find-the-duplicate-number', leetcodeUrl: 'https://leetcode.com/problems/find-the-duplicate-number/', solutionVideoUrl: 'https://youtu.be/wjYnzkAhcNk', defaultFunctionName: 'findDuplicate', description: 'Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive, find the duplicate number without modifying the array in O(1) extra space.', constraints: ['1 <= n <= 10^5'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-146', number: 146, title: 'LRU Cache', week: 4, topic: 'Linked List', difficulty: 'Medium', slug: 'lru-cache', leetcodeUrl: 'https://leetcode.com/problems/lru-cache/', solutionVideoUrl: 'https://youtu.be/7ABFKPK2hD4', defaultFunctionName: 'LRUCache', description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with get and put in O(1) average time.', constraints: ['1 <= capacity <= 3000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-23', number: 23, title: 'Merge k Sorted Lists', week: 4, topic: 'Linked List', difficulty: 'Hard', slug: 'merge-k-sorted-lists', leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/', solutionVideoUrl: 'https://youtu.be/q5a5OiGbT6Q', defaultFunctionName: 'mergeKLists', description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.', constraints: ['k == lists.length', '0 <= k <= 10^4'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-25', number: 25, title: 'Reverse Nodes in k-Group', week: 4, topic: 'Linked List', difficulty: 'Hard', slug: 'reverse-nodes-in-k-group', leetcodeUrl: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', solutionVideoUrl: 'https://youtu.be/1UOPsfP85V4', defaultFunctionName: 'reverseKGroup', description: 'Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.', constraints: ['The number of nodes in the list is n.', '1 <= k <= n <= 5000'], sampleTestCases: [], hiddenTestCases: [] },

  // WEEK 5: Trees (15)
  { id: 'p-226', number: 226, title: 'Invert Binary Tree', week: 5, topic: 'Trees', difficulty: 'Easy', slug: 'invert-binary-tree', leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/', solutionVideoUrl: 'https://youtu.be/OnSn2XEQ4MY', defaultFunctionName: 'invertTree', description: 'Given the root of a binary tree, invert the tree, and return its root.', constraints: ['The number of nodes in the tree is in the range [0, 100].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-104', number: 104, title: 'Maximum Depth of Binary Tree', week: 5, topic: 'Trees', difficulty: 'Easy', slug: 'maximum-depth-of-binary-tree', leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', solutionVideoUrl: 'https://youtu.be/hTM3phVI6YQ', defaultFunctionName: 'maxDepth', description: 'Given the root of a binary tree, return its maximum depth.', constraints: ['The number of nodes in the tree is in the range [0, 10^4].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-543', number: 543, title: 'Diameter of Binary Tree', week: 5, topic: 'Trees', difficulty: 'Easy', slug: 'diameter-of-binary-tree', leetcodeUrl: 'https://leetcode.com/problems/diameter-of-binary-tree/', solutionVideoUrl: 'https://youtu.be/bkxqA8Rfo04', defaultFunctionName: 'diameterOfBinaryTree', description: 'Given the root of a binary tree, return the length of the diameter of the tree. The diameter is the length of the longest path between any two nodes in a tree.', constraints: ['The number of nodes in the tree is in the range [1, 10^4].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-110', number: 110, title: 'Balanced Binary Tree', week: 5, topic: 'Trees', difficulty: 'Easy', slug: 'balanced-binary-tree', leetcodeUrl: 'https://leetcode.com/problems/balanced-binary-tree/', solutionVideoUrl: 'https://youtu.be/QfJsau0HSoy', defaultFunctionName: 'isBalanced', description: 'Given a binary tree, determine if it is height-balanced (a binary tree in which the left and right subtrees of every node differ in height by no more than 1).', constraints: ['The number of nodes in the tree is in the range [0, 5000].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-100', number: 100, title: 'Same Tree', week: 5, topic: 'Trees', difficulty: 'Easy', slug: 'same-tree', leetcodeUrl: 'https://leetcode.com/problems/same-tree/', solutionVideoUrl: 'https://youtu.be/vRbbcKXCxOw', defaultFunctionName: 'isSameTree', description: 'Given the roots of two binary trees p and q, write a function to check if they are the same or not.', constraints: ['The number of nodes in both trees is in the range [0, 100].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-572', number: 572, title: 'Subtree of Another Tree', week: 5, topic: 'Trees', difficulty: 'Easy', slug: 'subtree-of-another-tree', leetcodeUrl: 'https://leetcode.com/problems/subtree-of-another-tree/', solutionVideoUrl: 'https://youtu.be/E36O5SWp-LE', defaultFunctionName: 'isSubtree', description: 'Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot and false otherwise.', constraints: ['The number of nodes in the root tree is in the range [1, 2000].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-235', number: 235, title: 'Lowest Common Ancestor of a Binary Search Tree', week: 5, topic: 'Trees', difficulty: 'Medium', slug: 'lowest-common-ancestor-of-a-binary-search-tree', leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', solutionVideoUrl: 'https://youtu.be/gs2LMfuOR9k', defaultFunctionName: 'lowestCommonAncestor', description: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.', constraints: ['The number of nodes in the tree is in the range [2, 10^5].', 'All Node.val are unique.'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-102', number: 102, title: 'Binary Tree Level Order Traversal', week: 5, topic: 'Trees', difficulty: 'Medium', slug: 'binary-tree-level-order-traversal', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', solutionVideoUrl: 'https://youtu.be/6ZnyEApgFYg', defaultFunctionName: 'levelOrder', description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values. (i.e., from left to right, level by level).', constraints: ['The number of nodes in the tree is in the range [0, 2000].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-199', number: 199, title: 'Binary Tree Right Side View', week: 5, topic: 'Trees', difficulty: 'Medium', slug: 'binary-tree-right-side-view', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-right-side-view/', solutionVideoUrl: 'https://youtu.be/d4zLyf32Rq0', defaultFunctionName: 'rightSideView', description: 'Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.', constraints: ['The number of nodes in the tree is in the range [0, 100].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-1448', number: 1448, title: 'Count Good Nodes In Binary Tree', week: 5, topic: 'Trees', difficulty: 'Medium', slug: 'count-good-nodes-in-binary-tree', leetcodeUrl: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/', solutionVideoUrl: 'https://youtu.be/7cp5imvDzl4', defaultFunctionName: 'goodNodes', description: 'Given a binary tree root, a node X in the tree is named good if in the path from root to X there are no nodes with a value greater than X. Return number of good nodes.', constraints: ['The number of nodes in the binary tree is in the range [1, 10^5].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-98', number: 98, title: 'Validate Binary Search Tree', week: 5, topic: 'Trees', difficulty: 'Medium', slug: 'validate-binary-search-tree', leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/', solutionVideoUrl: 'https://youtu.be/s6ATEkipzow', defaultFunctionName: 'isValidBST', description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).', constraints: ['The number of nodes in the tree is in the range [1, 10^4].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-230', number: 230, title: 'Kth Smallest Element in a BST', week: 5, topic: 'Trees', difficulty: 'Medium', slug: 'kth-smallest-element-in-a-bst', leetcodeUrl: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', solutionVideoUrl: 'https://youtu.be/5LUXSvlkUrw', defaultFunctionName: 'kthSmallest', description: 'Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.', constraints: ['The number of nodes in the tree is n.', '1 <= k <= n <= 10^4'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-105', number: 105, title: 'Construct Binary Tree From Preorder And Inorder Traversal', week: 5, topic: 'Trees', difficulty: 'Medium', slug: 'construct-binary-tree-from-preorder-and-inorder-traversal', leetcodeUrl: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', solutionVideoUrl: 'https://youtu.be/ihj4IQGZ2uc', defaultFunctionName: 'buildTree', description: 'Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal, construct and return the binary tree.', constraints: ['1 <= preorder.length <= 3000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-124', number: 124, title: 'Binary Tree Maximum Path Sum', week: 5, topic: 'Trees', difficulty: 'Hard', slug: 'binary-tree-maximum-path-sum', leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', solutionVideoUrl: 'https://youtu.be/Hr5cWUld4vU', defaultFunctionName: 'maxPathSum', description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. Return the maximum path sum of any non-empty path.', constraints: ['The number of nodes in the tree is in the range [1, 3 * 10^4].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-297', number: 297, title: 'Serialize And Deserialize Binary Tree', week: 5, topic: 'Trees', difficulty: 'Hard', slug: 'serialize-and-deserialize-binary-tree', leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', solutionVideoUrl: 'https://youtu.be/u4JAi2JJhIg', defaultFunctionName: 'Codec', description: 'Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work.', constraints: ['The number of nodes in the tree is in the range [0, 10^4].'], sampleTestCases: [], hiddenTestCases: [] },

  // WEEK 6: Heap / Priority Queue (7) + Greedy (8) = 15
  { id: 'p-703', number: 703, title: 'Kth Largest Element In a Stream', week: 6, topic: 'Heap / Priority Queue', difficulty: 'Easy', slug: 'kth-largest-element-in-a-stream', leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', solutionVideoUrl: 'https://youtu.be/hOjcdrqMoQ8', defaultFunctionName: 'KthLargest', description: 'Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element.', constraints: ['1 <= k <= 10^4'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-1046', number: 1046, title: 'Last Stone Weight', week: 6, topic: 'Heap / Priority Queue', difficulty: 'Easy', slug: 'last-stone-weight', leetcodeUrl: 'https://leetcode.com/problems/last-stone-weight/', solutionVideoUrl: 'https://youtu.be/B-QCq79QNyw', defaultFunctionName: 'lastStoneWeight', description: 'You are given an array of integers stones where stones[i] is the weight of the ith stone. We play a game with the stones until at most one stone left. Return weight of last stone or 0.', constraints: ['1 <= stones.length <= 30'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-973', number: 973, title: 'K Closest Points to Origin', week: 6, topic: 'Heap / Priority Queue', difficulty: 'Medium', slug: 'k-closest-points-to-origin', leetcodeUrl: 'https://leetcode.com/problems/k-closest-points-to-origin/', solutionVideoUrl: 'https://youtu.be/rI2EBUEMfTk', defaultFunctionName: 'kClosest', description: 'Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin (0, 0).', constraints: ['1 <= k <= points.length <= 10^4'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-215', number: 215, title: 'Kth Largest Element In An Array', week: 6, topic: 'Heap / Priority Queue', difficulty: 'Medium', slug: 'kth-largest-element-in-an-array', leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', solutionVideoUrl: 'https://youtu.be/XEmy13g1LK0', defaultFunctionName: 'findKthLargest', description: 'Given an integer array nums and an integer k, return the kth largest element in the array. Can you solve it without sorting in O(n) average?', constraints: ['1 <= k <= nums.length <= 10^5'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-621', number: 621, title: 'Task Scheduler', week: 6, topic: 'Heap / Priority Queue', difficulty: 'Medium', slug: 'task-scheduler', leetcodeUrl: 'https://leetcode.com/problems/task-scheduler/', solutionVideoUrl: 'https://youtu.be/s8p8ukTyA2I', defaultFunctionName: 'leastInterval', description: 'You are given an array of CPU tasks, each represented by letters A to Z, and a cooling time, n. Return the least number of intervals to finish all tasks.', constraints: ['1 <= tasks.length <= 10^4', '0 <= n <= 100'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-355', number: 355, title: 'Design Twitter', week: 6, topic: 'Heap / Priority Queue', difficulty: 'Medium', slug: 'design-twitter', leetcodeUrl: 'https://leetcode.com/problems/design-twitter/', solutionVideoUrl: 'https://youtu.be/pNichitDD2E', defaultFunctionName: 'Twitter', description: 'Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and see the 10 most recent tweets in their news feed.', constraints: ['At most 3 * 10^4 calls will be made.'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-295', number: 295, title: 'Find Median From Data Stream', week: 6, topic: 'Heap / Priority Queue', difficulty: 'Hard', slug: 'find-median-from-data-stream', leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/', solutionVideoUrl: 'https://youtu.be/itmhHWaHupI', defaultFunctionName: 'MedianFinder', description: 'The median is the middle value in an ordered integer list. Implement the MedianFinder class with two heaps: max-heap for small half and min-heap for large half.', constraints: ['At most 5 * 10^4 calls will be made.'], sampleTestCases: [], hiddenTestCases: [] },
  // Week 6: Greedy
  { id: 'p-53', number: 53, title: 'Maximum Subarray', week: 6, topic: 'Greedy', difficulty: 'Medium', slug: 'maximum-subarray', leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/', solutionVideoUrl: 'https://youtu.be/5WZl3MMT0Eg', defaultFunctionName: 'maxSubArray', description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum (Kadane\'s algorithm).', constraints: ['1 <= nums.length <= 10^5'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-55', number: 55, title: 'Jump Game', week: 6, topic: 'Greedy', difficulty: 'Medium', slug: 'jump-game', leetcodeUrl: 'https://leetcode.com/problems/jump-game/', solutionVideoUrl: 'https://youtu.be/Yan0cv2cLy8', defaultFunctionName: 'canJump', description: 'You are given an integer array nums. You are initially positioned at the array\'s first index, and each element represents your maximum jump length. Return true if you can reach last index.', constraints: ['1 <= nums.length <= 10^4'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-45', number: 45, title: 'Jump Game II', week: 6, topic: 'Greedy', difficulty: 'Medium', slug: 'jump-game-ii', leetcodeUrl: 'https://leetcode.com/problems/jump-game-ii/', solutionVideoUrl: 'https://youtu.be/dJ7sWiOoK7g', defaultFunctionName: 'jump', description: 'Return the minimum number of jumps to reach nums[n - 1]. The test cases are generated such that you can reach nums[n - 1].', constraints: ['1 <= nums.length <= 10^4'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-134', number: 134, title: 'Gas Station', week: 6, topic: 'Greedy', difficulty: 'Medium', slug: 'gas-station', leetcodeUrl: 'https://leetcode.com/problems/gas-station/', solutionVideoUrl: 'https://youtu.be/lJwbPZGo05A', defaultFunctionName: 'canCompleteCircuit', description: 'There are n gas stations along a circular route. Return the starting gas station\'s index if you can travel around the circuit once in the clockwise direction, otherwise return -1.', constraints: ['n == gas.length == cost.length'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-846', number: 846, title: 'Hand of Straights', week: 6, topic: 'Greedy', difficulty: 'Medium', slug: 'hand-of-straights', leetcodeUrl: 'https://leetcode.com/problems/hand-of-straights/', solutionVideoUrl: 'https://youtu.be/amnrMCVd2YI', defaultFunctionName: 'isNStraightHand', description: 'Alice has some number of cards and she wants to rearrange the cards into groups so that each group is of size groupSize, and consists of groupSize consecutive cards.', constraints: ['1 <= hand.length <= 10^4'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-1899', number: 1899, title: 'Merge Triplets to Form Target Triplet', week: 6, topic: 'Greedy', difficulty: 'Medium', slug: 'merge-triplets-to-form-target-triplet', leetcodeUrl: 'https://leetcode.com/problems/merge-triplets-to-form-target-triplet/', solutionVideoUrl: 'https://youtu.be/kShk4DUzCGg', defaultFunctionName: 'mergeTriplets', description: 'Return true if it is possible to obtain the target triplet [x, y, z] as an element of triplets, or false otherwise.', constraints: ['1 <= triplets.length <= 10^5'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-763', number: 763, title: 'Partition Labels', week: 6, topic: 'Greedy', difficulty: 'Medium', slug: 'partition-labels', leetcodeUrl: 'https://leetcode.com/problems/partition-labels/', solutionVideoUrl: 'https://youtu.be/B7m8UmZE-vw', defaultFunctionName: 'partitionLabels', description: 'You are given a string s. We want to partition the string into as many parts as possible so that each letter appears in at most one part. Return a list of integers representing the size of these parts.', constraints: ['1 <= s.length <= 500'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-678', number: 678, title: 'Valid Parenthesis String', week: 6, topic: 'Greedy', difficulty: 'Medium', slug: 'valid-parenthesis-string', leetcodeUrl: 'https://leetcode.com/problems/valid-parenthesis-string/', solutionVideoUrl: 'https://youtu.be/QhPdNS143Rs', defaultFunctionName: 'checkValidString', description: 'Given a string s containing only three types of characters: \'(\', \')\' and \'*\', return true if s is valid. \'*\' could be treated as a single right parenthesis \')\' or a left parenthesis \'(\' or an empty string "".', constraints: ['1 <= s.length <= 100'], sampleTestCases: [], hiddenTestCases: [] },

  // WEEK 7: Backtracking (9) + Tries (3) = 12
  { id: 'p-78', number: 78, title: 'Subsets', week: 7, topic: 'Backtracking', difficulty: 'Medium', slug: 'subsets', leetcodeUrl: 'https://leetcode.com/problems/subsets/', solutionVideoUrl: 'https://youtu.be/REOH22Xwdlk', defaultFunctionName: 'subsets', description: 'Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.', constraints: ['1 <= nums.length <= 10'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-39', number: 39, title: 'Combination Sum', week: 7, topic: 'Backtracking', difficulty: 'Medium', slug: 'combination-sum', leetcodeUrl: 'https://leetcode.com/problems/combination-sum/', solutionVideoUrl: 'https://youtu.be/GBKI9VSKdGg', defaultFunctionName: 'combinationSum', description: 'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target.', constraints: ['1 <= candidates.length <= 30'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-46', number: 46, title: 'Permutations', week: 7, topic: 'Backtracking', difficulty: 'Medium', slug: 'permutations', leetcodeUrl: 'https://leetcode.com/problems/permutations/', solutionVideoUrl: 'https://youtu.be/s7AvT7cGdSo', defaultFunctionName: 'permute', description: 'Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.', constraints: ['1 <= nums.length <= 6'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-90', number: 90, title: 'Subsets II', week: 7, topic: 'Backtracking', difficulty: 'Medium', slug: 'subsets-ii', leetcodeUrl: 'https://leetcode.com/problems/subsets-ii/', solutionVideoUrl: 'https://youtu.be/Vn2v6ajA7U0', defaultFunctionName: 'subsetsWithDup', description: 'Given an integer array nums that may contain duplicates, return all possible subsets. The solution set must not contain duplicate subsets.', constraints: ['1 <= nums.length <= 10'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-40', number: 40, title: 'Combination Sum II', week: 7, topic: 'Backtracking', difficulty: 'Medium', slug: 'combination-sum-ii', leetcodeUrl: 'https://leetcode.com/problems/combination-sum-ii/', solutionVideoUrl: 'https://youtu.be/rSA3t6BDDwg', defaultFunctionName: 'combinationSum2', description: 'Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations in candidates where the candidate numbers sum to target. Each number may only be used once.', constraints: ['1 <= candidates.length <= 100'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-79', number: 79, title: 'Word Search', week: 7, topic: 'Backtracking', difficulty: 'Medium', slug: 'word-search', leetcodeUrl: 'https://leetcode.com/problems/word-search/', solutionVideoUrl: 'https://youtu.be/pfiQ_PS1gPw', defaultFunctionName: 'exist', description: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid.', constraints: ['m == board.length', 'n = board[i].length'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-131', number: 131, title: 'Palindrome Partitioning', week: 7, topic: 'Backtracking', difficulty: 'Medium', slug: 'palindrome-partitioning', leetcodeUrl: 'https://leetcode.com/problems/palindrome-partitioning/', solutionVideoUrl: 'https://youtu.be/3jvWodd7ht0', defaultFunctionName: 'partition', description: 'Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitionings of s.', constraints: ['1 <= s.length <= 16'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-17', number: 17, title: 'Letter Combinations of a Phone Number', week: 7, topic: 'Backtracking', difficulty: 'Medium', slug: 'letter-combinations-of-a-phone-number', leetcodeUrl: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', solutionVideoUrl: 'https://youtu.be/0snEunUacZY', defaultFunctionName: 'letterCombinations', description: 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.', constraints: ['0 <= digits.length <= 4'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-51', number: 51, title: 'N-Queens', week: 7, topic: 'Backtracking', difficulty: 'Hard', slug: 'n-queens', leetcodeUrl: 'https://leetcode.com/problems/n-queens/', solutionVideoUrl: 'https://youtu.be/Ph95IHmSX50', defaultFunctionName: 'solveNQueens', description: 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Return all distinct solutions.', constraints: ['1 <= n <= 9'], sampleTestCases: [], hiddenTestCases: [] },
  // Week 7: Tries
  { id: 'p-208', number: 208, title: 'Implement Trie (Prefix Tree)', week: 7, topic: 'Tries', difficulty: 'Medium', slug: 'implement-trie-prefix-tree', leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/', solutionVideoUrl: 'https://youtu.be/oobqoCJlHA0', defaultFunctionName: 'Trie', description: 'A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.', constraints: ['1 <= word.length, prefix.length <= 2000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-211', number: 211, title: 'Design Add And Search Words Data Structure', week: 7, topic: 'Tries', difficulty: 'Medium', slug: 'design-add-and-search-words-data-structure', leetcodeUrl: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', solutionVideoUrl: 'https://youtu.be/BTf05gs_8iU', defaultFunctionName: 'WordDictionary', description: 'Design a data structure that supports adding new words and finding if a string matches any previously added string, including \'.\' wildcard matching.', constraints: ['1 <= word.length <= 25'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-212', number: 212, title: 'Word Search II', week: 7, topic: 'Tries', difficulty: 'Hard', slug: 'word-search-ii', leetcodeUrl: 'https://leetcode.com/problems/word-search-ii/', solutionVideoUrl: 'https://youtu.be/asbcE9mZz_U', defaultFunctionName: 'findWords', description: 'Given an m x n board of characters and a list of strings words, return all words on the board using a Trie + DFS backtracking.', constraints: ['m == board.length', '1 <= words.length <= 3 * 10^4'], sampleTestCases: [], hiddenTestCases: [] },

  // WEEK 8: Graphs (13)
  { id: 'p-200', number: 200, title: 'Number of Islands', week: 8, topic: 'Graphs', difficulty: 'Medium', slug: 'number-of-islands', leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/', solutionVideoUrl: 'https://youtu.be/pV2kpPD66nE', defaultFunctionName: 'numIslands', description: 'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands.', constraints: ['m == grid.length', 'n == grid[i].length'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-133', number: 133, title: 'Clone Graph', week: 8, topic: 'Graphs', difficulty: 'Medium', slug: 'clone-graph', leetcodeUrl: 'https://leetcode.com/problems/clone-graph/', solutionVideoUrl: 'https://youtu.be/mQeF6bN8hMk', defaultFunctionName: 'cloneGraph', description: 'Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.', constraints: ['The number of nodes in the graph is in the range [0, 100].'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-695', number: 695, title: 'Max Area of Island', week: 8, topic: 'Graphs', difficulty: 'Medium', slug: 'max-area-of-island', leetcodeUrl: 'https://leetcode.com/problems/max-area-of-island/', solutionVideoUrl: 'https://youtu.be/iJGr1OtmH0c', defaultFunctionName: 'maxAreaOfIsland', description: 'You are given an m x n binary matrix grid. An island is a group of 1\'s connected 4-directionally. Return the maximum area of an island in grid. If there is no island, return 0.', constraints: ['m == grid.length', 'n == grid[i].length'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-417', number: 417, title: 'Pacific Atlantic Water Flow', week: 8, topic: 'Graphs', difficulty: 'Medium', slug: 'pacific-atlantic-water-flow', leetcodeUrl: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', solutionVideoUrl: 'https://youtu.be/s-VkcjHqkGI', defaultFunctionName: 'pacificAtlantic', description: 'Find the list of grid coordinates where water can flow to both the Pacific Ocean and Atlantic Ocean.', constraints: ['m == heights.length', 'n == heights[r].length'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-130', number: 130, title: 'Surrounded Regions', week: 8, topic: 'Graphs', difficulty: 'Medium', slug: 'surrounded-regions', leetcodeUrl: 'https://leetcode.com/problems/surrounded-regions/', solutionVideoUrl: 'https://youtu.be/9z2BunfoZ5Y', defaultFunctionName: 'solve', description: 'Given an m x n matrix board containing \'X\' and \'O\', capture all regions that are 4-directionally surrounded by \'X\'.', constraints: ['m == board.length', 'n == board[i].length'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-994', number: 994, title: 'Rotting Oranges', week: 8, topic: 'Graphs', difficulty: 'Medium', slug: 'rotting-oranges', leetcodeUrl: 'https://leetcode.com/problems/rotting-oranges/', solutionVideoUrl: 'https://youtu.be/y70486E75A8', defaultFunctionName: 'orangesRotting', description: 'You are given an m x n grid where each cell can have one of three values: 0 empty, 1 fresh orange, 2 rotten orange. Return the minimum number of minutes until no fresh orange remains.', constraints: ['m == grid.length', 'n == grid[i].length'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-286', number: 286, title: 'Walls And Gates', week: 8, topic: 'Graphs', difficulty: 'Medium', slug: 'walls-and-gates', leetcodeUrl: 'https://leetcode.com/problems/walls-and-gates/', freeVersionUrl: 'https://neetcode.io/problems/islands-and-treasure', solutionVideoUrl: 'https://youtu.be/e69C6xhiSQE', defaultFunctionName: 'wallsAndGates', description: 'You are given an m x n grid rooms initialized with: -1 wall, 0 gate, INF empty room. Fill each empty room with the distance to its nearest gate.', constraints: ['m == rooms.length', 'n == rooms[i].length'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-207', number: 207, title: 'Course Schedule', week: 8, topic: 'Graphs', difficulty: 'Medium', slug: 'course-schedule', leetcodeUrl: 'https://leetcode.com/problems/course-schedule/', solutionVideoUrl: 'https://youtu.be/EgI5nU9etnU', defaultFunctionName: 'canFinish', description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites. Return true if you can finish all courses.', constraints: ['1 <= numCourses <= 2000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-210', number: 210, title: 'Course Schedule II', week: 8, topic: 'Graphs', difficulty: 'Medium', slug: 'course-schedule-ii', leetcodeUrl: 'https://leetcode.com/problems/course-schedule-ii/', solutionVideoUrl: 'https://youtu.be/Akt3glAwyfY', defaultFunctionName: 'findOrder', description: 'Return the ordering of courses you should take to finish all courses (Topological Sort). If there are many valid answers, return any of them.', constraints: ['1 <= numCourses <= 2000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-684', number: 684, title: 'Redundant Connection', week: 8, topic: 'Graphs', difficulty: 'Medium', slug: 'redundant-connection', leetcodeUrl: 'https://leetcode.com/problems/redundant-connection/', solutionVideoUrl: 'https://youtu.be/FXWRE67PLL0', defaultFunctionName: 'findRedundantConnection', description: 'In this problem, a tree is an undirected graph that is connected and has no cycles. Return an edge that can be removed so that the resulting graph is a tree of n nodes (Union-Find).', constraints: ['n == edges.length', '3 <= n <= 1000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-323', number: 323, title: 'Number of Connected Components In An Undirected Graph', week: 8, topic: 'Graphs', difficulty: 'Medium', slug: 'number-of-connected-components-in-an-undirected-graph', leetcodeUrl: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', freeVersionUrl: 'https://neetcode.io/problems/count-connected-components', solutionVideoUrl: 'https://youtu.be/8f1XPm4WOUc', defaultFunctionName: 'countComponents', description: 'You have a graph of n nodes. You are given an integer n and an array edges. Return the number of connected components in the graph.', constraints: ['1 <= n <= 2000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-261', number: 261, title: 'Graph Valid Tree', week: 8, topic: 'Graphs', difficulty: 'Medium', slug: 'graph-valid-tree', leetcodeUrl: 'https://leetcode.com/problems/graph-valid-tree/', freeVersionUrl: 'https://neetcode.io/problems/valid-tree', solutionVideoUrl: 'https://youtu.be/bXsUuownnoQ', defaultFunctionName: 'validTree', description: 'Given n nodes labeled from 0 to n - 1 and a list of undirected edges, write a function to check whether these edges make up a valid tree (no cycles and connected).', constraints: ['1 <= n <= 2000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-127', number: 127, title: 'Word Ladder', week: 8, topic: 'Graphs', difficulty: 'Hard', slug: 'word-ladder', leetcodeUrl: 'https://leetcode.com/problems/word-ladder/', solutionVideoUrl: 'https://youtu.be/h9iTnkgv05E', defaultFunctionName: 'ladderLength', description: 'A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words. Return the number of words in the shortest transformation sequence.', constraints: ['1 <= beginWord.length <= 10'], sampleTestCases: [], hiddenTestCases: [] },

  // WEEK 9: Advanced Graphs (6) + Math & Geometry (8) = 14
  { id: 'p-1584', number: 1584, title: 'Min Cost to Connect All Points', week: 9, topic: 'Advanced Graphs', difficulty: 'Medium', slug: 'min-cost-to-connect-all-points', leetcodeUrl: 'https://leetcode.com/problems/min-cost-to-connect-all-points/', solutionVideoUrl: 'https://youtu.be/f7JOBJIC-NA', defaultFunctionName: 'minCostConnectPoints', description: 'You are given an array points representing integer coordinates of some points on a 2D-plane. Return the minimum cost to make all points connected (Prim / Kruskal MST).', constraints: ['1 <= points.length <= 1000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-743', number: 743, title: 'Network Delay Time', week: 9, topic: 'Advanced Graphs', difficulty: 'Medium', slug: 'network-delay-time', leetcodeUrl: 'https://leetcode.com/problems/network-delay-time/', solutionVideoUrl: 'https://youtu.be/EaphyqKU4PQ', defaultFunctionName: 'networkDelayTime', description: 'You are given a network of n nodes, labeled from 1 to n. Return the minimum time it takes for all the n nodes to receive the signal using Dijkstra\'s algorithm.', constraints: ['1 <= k <= n <= 100'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-787', number: 787, title: 'Cheapest Flights Within K Stops', week: 9, topic: 'Advanced Graphs', difficulty: 'Medium', slug: 'cheapest-flights-within-k-stops', leetcodeUrl: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', solutionVideoUrl: 'https://youtu.be/5eIK3zUdYmE', defaultFunctionName: 'findCheapestPrice', description: 'There are n cities connected by flights. Return the cheapest price from src to dst with at most k stops using Bellman-Ford or BFS.', constraints: ['1 <= n <= 100'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-332', number: 332, title: 'Reconstruct Itinerary', week: 9, topic: 'Advanced Graphs', difficulty: 'Hard', slug: 'reconstruct-itinerary', leetcodeUrl: 'https://leetcode.com/problems/reconstruct-itinerary/', solutionVideoUrl: 'https://youtu.be/ZyB_gQ8974U', defaultFunctionName: 'findItinerary', description: 'You are given a list of airline tickets. Reconstruct the itinerary in order and return it (Hierholzer\'s Eulerian path algorithm starting at "JFK").', constraints: ['1 <= tickets.length <= 300'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-778', number: 778, title: 'Swim In Rising Water', week: 9, topic: 'Advanced Graphs', difficulty: 'Hard', slug: 'swim-in-rising-water', leetcodeUrl: 'https://leetcode.com/problems/swim-in-rising-water/', solutionVideoUrl: 'https://youtu.be/amvrKlMLuGY', defaultFunctionName: 'swimInWater', description: 'You are given an n x n integer matrix grid. Return the least time until you can reach the bottom right square (n - 1, n - 1) using Dijkstra or Binary Search.', constraints: ['n == grid.length', '1 <= n <= 50'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-269', number: 269, title: 'Alien Dictionary', week: 9, topic: 'Advanced Graphs', difficulty: 'Hard', slug: 'alien-dictionary', leetcodeUrl: 'https://leetcode.com/problems/alien-dictionary/', freeVersionUrl: 'https://neetcode.io/problems/foreign-dictionary', solutionVideoUrl: 'https://youtu.be/6kTZYvNNyps', defaultFunctionName: 'alienOrder', description: 'There is a new alien language that uses the English alphabet. Return a string of the unique letters in the new alien language sorted in lexicographically increasing order.', constraints: ['1 <= words.length <= 100'], sampleTestCases: [], hiddenTestCases: [] },
  // Week 9: Math & Geometry
  { id: 'p-202', number: 202, title: 'Happy Number', week: 9, topic: 'Math & Geometry', difficulty: 'Easy', slug: 'happy-number', leetcodeUrl: 'https://leetcode.com/problems/happy-number/', solutionVideoUrl: 'https://youtu.be/ljz85bxOYJ0', defaultFunctionName: 'isHappy', description: 'A happy number is a number defined by the following process: Starting with any positive integer, replace the number by the sum of the squares of its digits.', constraints: ['1 <= n <= 2^31 - 1'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-66', number: 66, title: 'Plus One', week: 9, topic: 'Math & Geometry', difficulty: 'Easy', slug: 'plus-one', leetcodeUrl: 'https://leetcode.com/problems/plus-one/', solutionVideoUrl: 'https://youtu.be/jIaA8noiG10', defaultFunctionName: 'plusOne', description: 'You are given a large integer represented as an integer array digits. Increment the large integer by one and return the resulting array of digits.', constraints: ['1 <= digits.length <= 100'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-48', number: 48, title: 'Rotate Image', week: 9, topic: 'Math & Geometry', difficulty: 'Medium', slug: 'rotate-image', leetcodeUrl: 'https://leetcode.com/problems/rotate-image/', solutionVideoUrl: 'https://youtu.be/fMSJSS7eO1w', defaultFunctionName: 'rotate', description: 'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise) in-place.', constraints: ['matrix.length == n', 'matrix[i].length == n'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-54', number: 54, title: 'Spiral Matrix', week: 9, topic: 'Math & Geometry', difficulty: 'Medium', slug: 'spiral-matrix', leetcodeUrl: 'https://leetcode.com/problems/spiral-matrix/', solutionVideoUrl: 'https://youtu.be/BJnMZNwUk1M', defaultFunctionName: 'spiralOrder', description: 'Given an m x n matrix, return all elements of the matrix in spiral order.', constraints: ['m == matrix.length', 'n == matrix[i].length'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-73', number: 73, title: 'Set Matrix Zeroes', week: 9, topic: 'Math & Geometry', difficulty: 'Medium', slug: 'set-matrix-zeroes', leetcodeUrl: 'https://leetcode.com/problems/set-matrix-zeroes/', solutionVideoUrl: 'https://youtu.be/T41rL0L3Pnw', defaultFunctionName: 'setZeroes', description: 'Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0\'s in place with O(1) space.', constraints: ['m == matrix.length', 'n == matrix[0].length'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-50', number: 50, title: 'Pow(x, n)', week: 9, topic: 'Math & Geometry', difficulty: 'Medium', slug: 'powx-n', leetcodeUrl: 'https://leetcode.com/problems/powx-n/', solutionVideoUrl: 'https://youtu.be/g9YQyYi4IQQ', defaultFunctionName: 'myPow', description: 'Implement pow(x, n), which calculates x raised to the power n (i.e., x^n) in O(log n) time.', constraints: ['-100.0 < x < 100.0', '-2^31 <= n <= 2^31-1'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-43', number: 43, title: 'Multiply Strings', week: 9, topic: 'Math & Geometry', difficulty: 'Medium', slug: 'multiply-strings', leetcodeUrl: 'https://leetcode.com/problems/multiply-strings/', solutionVideoUrl: 'https://youtu.be/1uZbxir44kg', defaultFunctionName: 'multiply', description: 'Given two non-negative integers num1 and num2 represented as strings, return the product of num1 and num2, also represented as a string without using built-in BigInt.', constraints: ['1 <= num1.length, num2.length <= 200'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-2013', number: 2013, title: 'Detect Squares', week: 9, topic: 'Math & Geometry', difficulty: 'Medium', slug: 'detect-squares', leetcodeUrl: 'https://leetcode.com/problems/detect-squares/', solutionVideoUrl: 'https://youtu.be/bahempDXb4s', defaultFunctionName: 'DetectSquares', description: 'You are given a stream of points on the X-Y plane. Design an algorithm that counts the number of ways to choose three points such that the three points and a query point form an axis-aligned square.', constraints: ['At most 3000 calls to add and count.'], sampleTestCases: [], hiddenTestCases: [] },

  // WEEK 10: 1-D Dynamic Programming (12)
  { id: 'p-70', number: 70, title: 'Climbing Stairs', week: 10, topic: '1-D Dynamic Programming', difficulty: 'Easy', slug: 'climbing-stairs', leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/', solutionVideoUrl: 'https://youtu.be/Y0lT9Fck7q8', defaultFunctionName: 'climbStairs', description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?', constraints: ['1 <= n <= 45'], sampleTestCases: [{ input: 'n = 2', parsedInput: [2], expected: 2 }, { input: 'n = 3', parsedInput: [3], expected: 3 }], hiddenTestCases: [{ input: 'n = 5', parsedInput: [5], expected: 8, isHidden: true }] },
  { id: 'p-746', number: 746, title: 'Min Cost Climbing Stairs', week: 10, topic: '1-D Dynamic Programming', difficulty: 'Easy', slug: 'min-cost-climbing-stairs', leetcodeUrl: 'https://leetcode.com/problems/min-cost-climbing-stairs/', solutionVideoUrl: 'https://youtu.be/ktmzAZWkEZ0', defaultFunctionName: 'minCostClimbingStairs', description: 'You are given an integer array cost where cost[i] is the cost of ith step. Return the minimum cost to reach the top of the floor.', constraints: ['2 <= cost.length <= 1000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-198', number: 198, title: 'House Robber', week: 10, topic: '1-D Dynamic Programming', difficulty: 'Medium', slug: 'house-robber', leetcodeUrl: 'https://leetcode.com/problems/house-robber/', solutionVideoUrl: 'https://youtu.be/73r3KWiEvyk', defaultFunctionName: 'rob', description: 'You are a professional robber planning to rob houses along a street. Return the maximum amount of money you can rob tonight without alerting the police (cannot rob adjacent houses).', constraints: ['1 <= nums.length <= 100'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-213', number: 213, title: 'House Robber II', week: 10, topic: '1-D Dynamic Programming', difficulty: 'Medium', slug: 'house-robber-ii', leetcodeUrl: 'https://leetcode.com/problems/house-robber-ii/', solutionVideoUrl: 'https://youtu.be/rWAJCfYYOvM', defaultFunctionName: 'rob', description: 'All houses at this place are arranged in a circle. Return the maximum amount of money you can rob tonight without alerting the police.', constraints: ['1 <= nums.length <= 100'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-5', number: 5, title: 'Longest Palindromic Substring', week: 10, topic: '1-D Dynamic Programming', difficulty: 'Medium', slug: 'longest-palindromic-substring', leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/', solutionVideoUrl: 'https://youtu.be/XYQecbcd6_c', defaultFunctionName: 'longestPalindrome', description: 'Given a string s, return the longest palindromic substring in s.', constraints: ['1 <= s.length <= 1000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-647', number: 647, title: 'Palindromic Substrings', week: 10, topic: '1-D Dynamic Programming', difficulty: 'Medium', slug: 'palindromic-substrings', leetcodeUrl: 'https://leetcode.com/problems/palindromic-substrings/', solutionVideoUrl: 'https://youtu.be/4RACzI5-du8', defaultFunctionName: 'countSubstrings', description: 'Given a string s, return the number of palindromic substrings in it.', constraints: ['1 <= s.length <= 1000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-91', number: 91, title: 'Decode Ways', week: 10, topic: '1-D Dynamic Programming', difficulty: 'Medium', slug: 'decode-ways', leetcodeUrl: 'https://leetcode.com/problems/decode-ways/', solutionVideoUrl: 'https://youtu.be/6aEyTjOwlJU', defaultFunctionName: 'numDecodings', description: 'A message containing letters from A-Z can be encoded into numbers using \'A\' -> "1", ... \'Z\' -> "26". Given a string s containing only digits, return the number of ways to decode it.', constraints: ['1 <= s.length <= 100'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-322', number: 322, title: 'Coin Change', week: 10, topic: '1-D Dynamic Programming', difficulty: 'Medium', slug: 'coin-change', leetcodeUrl: 'https://leetcode.com/problems/coin-change/', solutionVideoUrl: 'https://youtu.be/H9bfqozjoqs', defaultFunctionName: 'coinChange', description: 'You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount.', constraints: ['1 <= coins.length <= 12', '0 <= amount <= 10^4'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-152', number: 152, title: 'Maximum Product Subarray', week: 10, topic: '1-D Dynamic Programming', difficulty: 'Medium', slug: 'maximum-product-subarray', leetcodeUrl: 'https://leetcode.com/problems/maximum-product-subarray/', solutionVideoUrl: 'https://youtu.be/lXVy6YWFcRM', defaultFunctionName: 'maxProduct', description: 'Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.', constraints: ['1 <= nums.length <= 2 * 10^4'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-139', number: 139, title: 'Word Break', week: 10, topic: '1-D Dynamic Programming', difficulty: 'Medium', slug: 'word-break', leetcodeUrl: 'https://leetcode.com/problems/word-break/', solutionVideoUrl: 'https://youtu.be/Sx9NNgInc3A', defaultFunctionName: 'wordBreak', description: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.', constraints: ['1 <= s.length <= 300'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-300', number: 300, title: 'Longest Increasing Subsequence', week: 10, topic: '1-D Dynamic Programming', difficulty: 'Medium', slug: 'longest-increasing-subsequence', leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/', solutionVideoUrl: 'https://youtu.be/cjWnW0hdF1Y', defaultFunctionName: 'lengthOfLIS', description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence in O(n log n) or O(n^2).', constraints: ['1 <= nums.length <= 2500'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-416', number: 416, title: 'Partition Equal Subset Sum', week: 10, topic: '1-D Dynamic Programming', difficulty: 'Medium', slug: 'partition-equal-subset-sum', leetcodeUrl: 'https://leetcode.com/problems/partition-equal-subset-sum/', solutionVideoUrl: 'https://youtu.be/Isv4gk-A_AQ', defaultFunctionName: 'canPartition', description: 'Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal (0/1 Knapsack).', constraints: ['1 <= nums.length <= 200'], sampleTestCases: [], hiddenTestCases: [] },

  // WEEK 11: 2-D Dynamic Programming (11)
  { id: 'p-62', number: 62, title: 'Unique Paths', week: 11, topic: '2-D Dynamic Programming', difficulty: 'Medium', slug: 'unique-paths', leetcodeUrl: 'https://leetcode.com/problems/unique-paths/', solutionVideoUrl: 'https://youtu.be/IlEsdxuD4lY', defaultFunctionName: 'uniquePaths', description: 'There is a robot on an m x n grid. The robot is initially located at top-left corner and tries to reach bottom-right corner. Return the number of possible unique paths.', constraints: ['1 <= m, n <= 100'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-1143', number: 1143, title: 'Longest Common Subsequence', week: 11, topic: '2-D Dynamic Programming', difficulty: 'Medium', slug: 'longest-common-subsequence', leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/', solutionVideoUrl: 'https://youtu.be/Ua0GhsJSlWM', defaultFunctionName: 'longestCommonSubsequence', description: 'Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.', constraints: ['1 <= text1.length, text2.length <= 1000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-309', number: 309, title: 'Best Time to Buy And Sell Stock With Cooldown', week: 11, topic: '2-D Dynamic Programming', difficulty: 'Medium', slug: 'best-time-to-buy-and-sell-stock-with-cooldown', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/', solutionVideoUrl: 'https://youtu.be/I7j0F7AHpb8', defaultFunctionName: 'maxProfit', description: 'You are given an array prices. Find the maximum profit you can achieve with a cooldown of one day after selling.', constraints: ['1 <= prices.length <= 5000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-518', number: 518, title: 'Coin Change II', week: 11, topic: '2-D Dynamic Programming', difficulty: 'Medium', slug: 'coin-change-ii', leetcodeUrl: 'https://leetcode.com/problems/coin-change-ii/', solutionVideoUrl: 'https://youtu.be/Mjy4hd2xgrs', defaultFunctionName: 'change', description: 'You are given an integer array coins representing coins of different denominations and an integer amount. Return the number of combinations that make up that amount.', constraints: ['1 <= coins.length <= 300', '0 <= amount <= 5000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-494', number: 494, title: 'Target Sum', week: 11, topic: '2-D Dynamic Programming', difficulty: 'Medium', slug: 'target-sum', leetcodeUrl: 'https://leetcode.com/problems/target-sum/', solutionVideoUrl: 'https://youtu.be/g0npyaQtAQM', defaultFunctionName: 'findTargetSumWays', description: 'You are given an integer array nums and an integer target. You want to build an expression out of nums by adding one of the symbols \'+\' and \'-\' before each integer. Return the number of different expressions.', constraints: ['1 <= nums.length <= 20'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-97', number: 97, title: 'Interleaving String', week: 11, topic: '2-D Dynamic Programming', difficulty: 'Medium', slug: 'interleaving-string', leetcodeUrl: 'https://leetcode.com/problems/interleaving-string/', solutionVideoUrl: 'https://youtu.be/3Rw3p9LrgvE', defaultFunctionName: 'isInterleave', description: 'Given strings s1, s2, and s3, find whether s3 is formed by an interleaving of s1 and s2.', constraints: ['0 <= s1.length, s2.length <= 100', '0 <= s3.length <= 200'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-72', number: 72, title: 'Edit Distance', week: 11, topic: '2-D Dynamic Programming', difficulty: 'Medium', slug: 'edit-distance', leetcodeUrl: 'https://leetcode.com/problems/edit-distance/', solutionVideoUrl: 'https://youtu.be/XYi2-LPrv4k', defaultFunctionName: 'minDistance', description: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2 (insert, delete, replace).', constraints: ['0 <= word1.length, word2.length <= 500'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-329', number: 329, title: 'Longest Increasing Path In a Matrix', week: 11, topic: '2-D Dynamic Programming', difficulty: 'Hard', slug: 'longest-increasing-path-in-a-matrix', leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-path-in-a-matrix/', solutionVideoUrl: 'https://youtu.be/wCc_nd-GiEc', defaultFunctionName: 'longestIncreasingPath', description: 'Given an m x n integers matrix, return the length of the longest increasing path in matrix using DFS + memoization.', constraints: ['m == matrix.length', 'n == matrix[i].length'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-115', number: 115, title: 'Distinct Subsequences', week: 11, topic: '2-D Dynamic Programming', difficulty: 'Hard', slug: 'distinct-subsequences', leetcodeUrl: 'https://leetcode.com/problems/distinct-subsequences/', solutionVideoUrl: 'https://youtu.be/-RDzMJ33nx8', defaultFunctionName: 'numDistinct', description: 'Given two strings s and t, return the number of distinct subsequences of s which equals t.', constraints: ['1 <= s.length, t.length <= 1000'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-312', number: 312, title: 'Burst Balloons', week: 11, topic: '2-D Dynamic Programming', difficulty: 'Hard', slug: 'burst-balloons', leetcodeUrl: 'https://leetcode.com/problems/burst-balloons/', solutionVideoUrl: 'https://youtu.be/VFskby7lUvY', defaultFunctionName: 'maxCoins', description: 'You are given n balloons, indexed from 0 to n - 1. Each balloon is painted with a number on it represented by an array nums. Burst balloons to maximize coins.', constraints: ['n == nums.length', '1 <= n <= 300'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-10', number: 10, title: 'Regular Expression Matching', week: 11, topic: '2-D Dynamic Programming', difficulty: 'Hard', slug: 'regular-expression-matching', leetcodeUrl: 'https://leetcode.com/problems/regular-expression-matching/', solutionVideoUrl: 'https://youtu.be/HAA8mgxlov8', defaultFunctionName: 'isMatch', description: 'Given an input string s and a pattern p, implement regular expression matching with support for \'.\' and \'*\' where \'*\' matches zero or more of the preceding element.', constraints: ['1 <= s.length <= 20', '1 <= p.length <= 20'], sampleTestCases: [], hiddenTestCases: [] },

  // WEEK 12: Bit Manipulation + Full Revision (7)
  { id: 'p-136', number: 136, title: 'Single Number', week: 12, topic: 'Bit Manipulation', difficulty: 'Easy', slug: 'single-number', leetcodeUrl: 'https://leetcode.com/problems/single-number/', solutionVideoUrl: 'https://youtu.be/qMPX1AOa83k', defaultFunctionName: 'singleNumber', description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one using XOR in O(n) time and O(1) space.', constraints: ['1 <= nums.length <= 3 * 10^4'], sampleTestCases: [{ input: 'nums = [2,2,1]', parsedInput: [[2, 2, 1]], expected: 1 }, { input: 'nums = [4,1,2,1,2]', parsedInput: [[4, 1, 2, 1, 2]], expected: 4 }], hiddenTestCases: [{ input: 'nums = [1]', parsedInput: [[1]], expected: 1, isHidden: true }] },
  { id: 'p-191', number: 191, title: 'Number of 1 Bits', week: 12, topic: 'Bit Manipulation', difficulty: 'Easy', slug: 'number-of-1-bits', leetcodeUrl: 'https://leetcode.com/problems/number-of-1-bits/', solutionVideoUrl: 'https://youtu.be/5Km3utixwZs', defaultFunctionName: 'hammingWeight', description: 'Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (Hamming weight).', constraints: ['1 <= n <= 2^31 - 1'], sampleTestCases: [{ input: 'n = 11', parsedInput: [11], expected: 3 }, { input: 'n = 128', parsedInput: [128], expected: 1 }], hiddenTestCases: [] },
  { id: 'p-338', number: 338, title: 'Counting Bits', week: 12, topic: 'Bit Manipulation', difficulty: 'Easy', slug: 'counting-bits', leetcodeUrl: 'https://leetcode.com/problems/counting-bits/', solutionVideoUrl: 'https://youtu.be/RyBM56RIWr8', defaultFunctionName: 'countBits', description: 'Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1\'s in the binary representation of i in O(n).', constraints: ['0 <= n <= 10^5'], sampleTestCases: [{ input: 'n = 2', parsedInput: [2], expected: [0, 1, 1] }, { input: 'n = 5', parsedInput: [5], expected: [0, 1, 1, 2, 1, 2] }], hiddenTestCases: [] },
  { id: 'p-190', number: 190, title: 'Reverse Bits', week: 12, topic: 'Bit Manipulation', difficulty: 'Easy', slug: 'reverse-bits', leetcodeUrl: 'https://leetcode.com/problems/reverse-bits/', solutionVideoUrl: 'https://youtu.be/UcoN6UjAI64', defaultFunctionName: 'reverseBits', description: 'Reverse bits of a given 32 bits unsigned integer.', constraints: ['The input must be a binary string of length 32 or unsigned integer.'], sampleTestCases: [], hiddenTestCases: [] },
  { id: 'p-268', number: 268, title: 'Missing Number', week: 12, topic: 'Bit Manipulation', difficulty: 'Easy', slug: 'missing-number', leetcodeUrl: 'https://leetcode.com/problems/missing-number/', solutionVideoUrl: 'https://youtu.be/WnPLSRLSANE', defaultFunctionName: 'missingNumber', description: 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.', constraints: ['n == nums.length', '1 <= n <= 10^4'], sampleTestCases: [{ input: 'nums = [3,0,1]', parsedInput: [[3, 0, 1]], expected: 2 }], hiddenTestCases: [] },
  { id: 'p-371', number: 371, title: 'Sum of Two Integers', week: 12, topic: 'Bit Manipulation', difficulty: 'Medium', slug: 'sum-of-two-integers', leetcodeUrl: 'https://leetcode.com/problems/sum-of-two-integers/', solutionVideoUrl: 'https://youtu.be/gVUrDV4tZfY', defaultFunctionName: 'getSum', description: 'Given two integers a and b, return the sum of the two integers without using the operators + and -.', constraints: ['-1000 <= a, b <= 1000'], sampleTestCases: [{ input: 'a = 1, b = 2', parsedInput: [1, 2], expected: 3 }, { input: 'a = 2, b = 3', parsedInput: [2, 3], expected: 5 }], hiddenTestCases: [] },
  { id: 'p-7', number: 7, title: 'Reverse Integer', week: 12, topic: 'Bit Manipulation', difficulty: 'Medium', slug: 'reverse-integer', leetcodeUrl: 'https://leetcode.com/problems/reverse-integer/', solutionVideoUrl: 'https://youtu.be/HAgLH58IgJQ', defaultFunctionName: 'reverse', description: 'Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.', constraints: ['-2^31 <= x <= 2^31 - 1'], sampleTestCases: [{ input: 'x = 123', parsedInput: [123], expected: 321 }, { input: 'x = -123', parsedInput: [-123], expected: -321 }, { input: 'x = 120', parsedInput: [120], expected: 21 }], hiddenTestCases: [] }
];

export const PROBLEMS: Problem[] = PROBLEMS_RAW.map(raw => {
  const fn = raw.defaultFunctionName;
  const templates = buildStarterTemplates(raw);

  const sampleCases = raw.sampleTestCases || [
    { input: 'Sample Test Case 1', parsedInput: [], expected: true, description: 'Default Sample' }
  ];
  const hiddenCases = raw.hiddenTestCases || [
    { input: 'Hidden Boundary Case 1', parsedInput: [], expected: true, description: 'Edge Test', isHidden: true },
    { input: 'Hidden Stress Case 2', parsedInput: [], expected: true, description: 'Scale Test', isHidden: true }
  ];

  const testCases = [...sampleCases, ...hiddenCases].map(tc => ({
    input: tc.parsedInput || [],
    expected: tc.expected
  }));

  return {
    id: raw.id,
    number: raw.number,
    title: raw.title,
    slug: raw.slug,
    week: raw.week,
    topic: raw.topic,
    difficulty: raw.difficulty,
    leetcodeUrl: raw.leetcodeUrl,
    freeVersionUrl: raw.freeVersionUrl,
    solutionVideoUrl: raw.solutionVideoUrl,
    description: raw.description,
    constraints: raw.constraints,
    functionName: fn,
    starterTemplates: templates,
    starterCode: templates,
    testCases,
    sampleTestCases: sampleCases,
    hiddenTestCases: hiddenCases
  };
});

export const PROBLEM_DEFINITIONS: ProblemDefinition[] = PROBLEMS_RAW.map(raw => toProblemDefinition(raw));
