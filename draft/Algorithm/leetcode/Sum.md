# Sum 系列

[1. Two Sum](https://leetcode.com/problems/two-sum/)

- hash table (Map)
- notice: don't use the same element twice


```c++
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        map<int, int> hashmap;

        // 哈希表记录值和索引
        for (int i = 0; i < nums.size(); i++) {
            hashmap.insert(pair<int,int>(nums[i], i));
        }

        for (int i = 0; i < nums.size(); i++) {
            int diff = target - nums[i];

            map<int, int> ::iterator it;
            it = hashmap.find(diff);

            // 注意不能有重复的索引
            if (it != hashmap.end() && hashmap[diff] != i) {
                return vector{i, hashmap[diff]};
            }
        }

        return vector{0, 0};
    }
};
```
