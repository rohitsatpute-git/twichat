#include <bits/stdc++.h>
using namespace std;

#define ROHIT ios_base::sync_with_stdio(false); cin.tie(NULL); cout.tie(NULL)
#define ll long long int 
#define pb push_back
#define ppb pop_back
#define lb lower_bound
#define up upper_bound
#define fo(i,a,b) for(ll i=a; i<=b; i++)
#define all(v) (v).begin(),(v).end()
#define allr(v) (v).rbegin(),(v).rend()
#define sort0(v) sort(all(v))
#define ff first
#define ss second
#define vll vector<ll>
#define vvll vector<vector<ll>>
#define pll pair<ll,ll>
#define py {cout<<"YES"<<endl; return;}
#define pn {cout<<"NO"<<endl; return;}
#define c(v,s) count(v.begin(),v.end(),s)
#define s(v) accumulate(v.begin(),v.end(),(ll)0)
#define debug(x) cerr<<#x<<" "; _print(x); cerr<<endl;

void _print(ll t) {cerr<<t;}
void _print(int t) {cerr<<t;}
void _print(string t) {cerr<<t;}
void _print(char t) {cerr<<t;}
void _print(double t) {cerr<<t;}

template <class T, class V> void _print(pair <T, V> p);
template <class T> void _print(vector <T> v);
template <class T> void _print(set <T> v);
template <class T, class V> void _print(map <T, V> v);
template <class T> void _print(multiset <T> v);
template <class T, class V> void _print(pair <T, V> p) {cerr << "{"; _print(p.ff); cerr << ","; _print(p.ss); cerr << "}";}
template <class T> void _print(vector <T> v) {cerr << "[ "; for (T i : v) {_print(i); cerr << " ";} cerr << "]";}
template <class T> void _print(set <T> v) {cerr << "[ "; for (T i : v) {_print(i); cerr << " ";} cerr << "]";}
template <class T> void _print(multiset <T> v) {cerr << "[ "; for (T i : v) {_print(i); cerr << " ";} cerr << "]";}
template <class T, class V> void _print(map <T, V> v) {cerr << "[ "; for (auto i : v) {_print(i); cerr << " ";} cerr << "]";}

ll mod=1000000007;
ll mod2=998244353;
ll ceil_div(ll a, ll b) {return a % b == 0 ? a / b : a / b + 1;}
ll findgcd(vector<ll> v){ long long int res=v[0]; for(int i=1; i<v.size(); i++){ res=__gcd(v[i],res); if(res==1) return 1; } return res;}
ll lcm(ll a,ll b) {return (a/__gcd(a,b))*b;}
bool isprime(ll n){ if(n<=1) return false; if(n<=3) return true; if(n%2==0 || n%3==0) return false; for(ll i=5; i*i<=n; i+=6){ if(n%i==0 || n%(i+2)==0) return false; } return true;}
unsigned ll power(ll x,ll y,ll p){unsigned ll res=1; x=x%p; while (y>0){ if(y&1) res=(res*x)%p;  y=y>>1;   x=(x*x)%p;  } return res%mod;}
ll p(ll x,ll y){ll res=1;while (y>0){  if(y&1) res=(res*x); y=y>>1;  x=(x*x);} return res;}
ll modInverse(unsigned ll n,ll p){ return power(n,p-2,p);}
ll ncr(ll n,ll r,ll p){ if(n<0 || r>n) return 0; else if(r==0 || r==n) return 1; ll fac[n+1]; fac[0]=1; for(int i=1; i<=n; i++) fac[i]=(fac[i-1]*i)%p; return (fac[n]*modInverse(fac[r],p)%p*modInverse(fac[n-r],p)%p)%p;}
ll factorial(ll n,ll p){ ll cnt=1; for(int i=1; i<=n; i++) { cnt*=i; cnt%=p;} return cnt%mod;}
bool sortbysec(const pair<ll,ll>& a,const pair<ll,ll>& b) {return a.second<b.second;}
void computeLPSArray(string pat, ll M, ll lps[]){ll len = 0,i = 1;lps[0] = 0; while (i < M){if (pat[i] == pat[len]) len++,lps[i] = len,i++;else {if (len != 0) len = lps[len - 1];else lps[i] = len,i++;}}}
ll KMPSearch(string pat, string txt){ll M =pat.length();ll N =txt.length();ll lps[M];ll j=0;computeLPSArray(pat,M,lps);ll i=0,res=0,next_i=0;while (i<N){if(pat[j]==txt[i])j++,i++;if(j==M)j=lps[j-1],res++;else if(i<N && pat[j]!=txt[i]){if(j!=0) j=lps[j-1];else i=i+1;}}return res;}

ll constructST(vll& v,ll l,ll r,ll u,vll& st){
    if(l==r) return st[u]=v[l];
    ll mid=(l+r)/2;
    return st[u]=constructST(v,l,mid,2*u+1,st)+constructST(v,mid+1,r,2*u+2,st);
}

ll getsum(ll u,ll curl,ll curr,ll reql,ll reqr,vll& st){
    if(reql<=curl && reqr>=curr) return st[u];
    if(curr<reql || curl>reqr) return 0;
    ll mid=(curl+curr)/2;
    return getsum(2*u+1,curl,mid,reql,reqr,st)+getsum(2*u+2,mid+1,curr,reql,reqr,st);
}



//------------------------------------------------------------------------------------------//



void solve(){


ll n; cin>>n;
ll l=-mod2,h=mod2;
while(l<=h){
   int mid=(l+h)/2;
   if(n-mid*mod2<0) l=mid+1;
   else h=mid-1;
}
cout<<n-l*mod2<<endl;




}



int main(){
    ROHIT;
    ll t=1;
    cin>>t;
    for(int i=1; i<=t; i++){
        // cout<<"Case #"<<i<<": ";
        solve();
    }
    
    return 0;
}
