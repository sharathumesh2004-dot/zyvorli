// Zyvorli connection settings. These two values are public by design (safe in the browser).
// Never put a "secret" or "service_role" key in this file.
window.ZV_CONFIG = {
  url: 'https://qwgltlurswsdjygshcvl.supabase.co',
  key: 'sb_publishable_0UEjICPuM6whZNT3cgB06A_2SBOavwY',
  // OPTIONAL (calls on mobile data): a TURN relay helps calls connect on every network.
  // Free option: metered.ca Open Relay. Paste your credentials URL below, for example
  // turnApi: 'https://YOURAPP.metered.live/api/v1/turn/credentials?apiKey=YOURKEY'
  turnApi: '',
  // Legal contact shown on the Privacy Policy and Terms pages (fill these in before launch)
  grievanceName: '',
  grievanceEmail: '',
  businessName: '',
  businessAddress: ''
};
