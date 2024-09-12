class Solution {
public:
    int countConsistentStrings(string allowed, vector<string>& words) {
        set<char> allow;
        for (int i=0;i<allowed.length();i++){
            allow.insert(allowed[i]);
        }
        int count=0;
        int flag=1;
        for (size_t i=0;i<words.size();i++){
            flag=1;
            for (int j=0;j<words[i].length();j++){
                if (allow.find(words[i][j])==allow.end()){
                    flag=0;
                    break;
                }
            }
            count+=flag;
        }
        return count;
    }
};