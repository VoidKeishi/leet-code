class Solution {
public:
    string shortestPalindrome(string s) {
        // Find longest palindrome start at index 0 using prefix function
        string rev_s = s;
        reverse(rev_s.begin(), rev_s.end());
        string new_s = s + "#" + rev_s;
        vector<int> prefix(new_s.size(), 0);
        for (int i = 1; i < new_s.size(); ++i) {
            int j = prefix[i - 1];
            while (j > 0 && new_s[i] != new_s[j]) {
                j = prefix[j - 1];
            }
            if (new_s[i] == new_s[j]) {
                ++j;
            }
            prefix[i] = j;
        }
        // Add the missing part to the front of the string
        int last = prefix.back();
        string ans = s.substr(last,s.length()-1);
        reverse(ans.begin(),ans.end());
        ans+=s;
        return ans;
    }
};