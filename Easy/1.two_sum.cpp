#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++)
        {
            int complement = target - nums[i];
            if (map.find(complement) != map.end())
            {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};
int main() {
    Solution solution;
    vector<int> nums = {2,7,11,15};
    int target = 9;
    vector<int> result = solution.twoSum(nums, target);
    for (int i : result) {
        cout << i << " ";
    }
    return 0;
}