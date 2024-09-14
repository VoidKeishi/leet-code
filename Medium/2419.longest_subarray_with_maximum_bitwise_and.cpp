class Solution {
public:
    int longestSubarray(vector<int>& nums) {
        int max_num=0;
        for(size_t i=0;i<nums.size();i++){
            max_num=max(max_num,nums[i]);
        }
        int count=0;
        int ans=0;
        for(size_t i=0;i<nums.size();i++){
            if (nums[i]==max_num) count++;
            else count=0;
            ans=max(ans,count);
        }
        return ans;
    }
};