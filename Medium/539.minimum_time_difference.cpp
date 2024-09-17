class Solution {
public:
    int convert(string time){
        int converted = (time[0] - '0') * 600 +
                        (time[1] - '0') * 60 +
                        (time[3] - '0') * 10 +
                        (time[4] - '0');
        return converted;
    }
    int findMinDifference(vector<string>& timePoints) {
        vector<int> converted;
        for (size_t i=0;i<timePoints.size();i++){
            converted.push_back(convert(timePoints[i]));
        }
        sort(converted.begin(), converted.end(), std::greater<int>());
        int min_diff=converted.back()+(1440-converted[0]);
        for (size_t i=1;i<converted.size();i++){
            min_diff=min(min_diff,converted[i-1]-converted[i]);
        }
        return min_diff;
    }
};