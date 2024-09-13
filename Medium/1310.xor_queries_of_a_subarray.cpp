class Solution {
public:
    vector<int> xorQueries(vector<int>& arr, vector<vector<int>>& queries) {
        int result;
        int n=arr.size();
        int prefix[n];
        prefix[0]=arr[0];
        for (size_t i=1;i<arr.size();i++){
            prefix[i] = prefix[i-1]^arr[i];
        }
        vector<int> ans;
        for (size_t i=0;i<queries.size();i++){
            if (queries[i][0]>0){
                result=prefix[queries[i][1]]^prefix[queries[i][0]-1];
            }
            else result=prefix[queries[i][1]];
            ans.push_back(result);
        }
        return ans;
    }
};