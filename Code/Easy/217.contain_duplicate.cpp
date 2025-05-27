class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> exist;
        for (size_t i=0;i<nums.size();i++){
            if (exist.find(nums[i])!=exist.end()){
                return true;
            }
            exist.insert(nums[i]);
        }
        return false;
    }
};