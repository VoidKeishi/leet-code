class NumArray {
public:
    vector<int> prefix;
    NumArray(vector<int>& nums) {
        int sum=0;
        for(int i=0;i<nums.size();i++){
            prefix.push_back(sum+=nums[i]);
        }
    }
    int sumRange(int left, int right) {
        if (left>0) return prefix[right]-prefix[left-1];
        return prefix[right];
    }
};