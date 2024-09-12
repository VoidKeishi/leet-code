class Solution {
public:
    int live_count(int health, int pow){
        if (health%pow==0) return health/pow;
        return health/pow + 1;
    }
    long long minDamage(int power, vector<int>& damage, vector<int>& health) {
        for (size_t i = 0; i < damage.size(); ++i){
            health[i] = live_count(health[i],power);
        }
        vector<pair<int, int>> damageHealthPairs;
        for (size_t i = 0; i < damage.size(); ++i) {
            damageHealthPairs.emplace_back(damage[i], health[i]);
        }
        sort(damageHealthPairs.begin(), damageHealthPairs.end(), [](const pair<int, int>& a, const pair<int, int>& b) {
        return a.first*b.second > b.first*a.second;
        });
        long long int dps = 0;
        for (size_t i = 0; i < damage.size(); ++i) {
            damage[i] = damageHealthPairs[i].first;
            dps+=damage[i];
            health[i] = damageHealthPairs[i].second;
        }
        long long int ans=0;
        for (int i=0;i<damage.size();i++){
            ans+=dps*health[i];
            dps-=damage[i];
        }
        return ans;
    }
};