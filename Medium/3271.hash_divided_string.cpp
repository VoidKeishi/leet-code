class Solution {
public:
    int alphabetToNumber(char c) {
        return c - 'a';
    }
    char numberToAlphabet(int num) {
        return 'a' + num;
    }
    string stringHash(string s, int k) {
        int temp;
        string ans="";
        for (int i=0;i<s.length()/k;i++){
            for (int j=i*k;j<(i+1)*k;j++){
                temp += alphabetToNumber(s[j]);
            }
            temp%=26;
            ans+=numberToAlphabet(temp);
            temp=0;
        }
        return ans;
    }
};