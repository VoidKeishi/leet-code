class Solution {
public:
    vector<string> uncommonFromSentences(string s1, string s2) {
        unordered_map<string,int> vocabulary;
        vector<string> ans;
        string word = "";
        for (int i=0;i<s1.length();i++){
            if (s1[i]!=' ') word+=s1[i];
            else {
                vocabulary[word]++;
                cout << word << " ";
                word="";
            }
        }
        vocabulary[word]++;
        word="";
        for (int i=0;i<s2.length();i++){
            if (s2[i]!=' ') word+=s2[i];
            else {
                vocabulary[word]++;
                cout << word << " ";
                word="";
            }
        }
        vocabulary[word]++;
        for (auto it=vocabulary.begin();it!=vocabulary.end();++it){
            if (it->second==1){
                ans.push_back(it->first);
            }
        }
        return ans;
    }
};