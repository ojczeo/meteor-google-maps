Package.describe({
  name: 'epotek:google-maps',
  summary: 'Google Maps Javascript API, without blaze',
  version: '2.0.0',
  git: 'https://github.com/e-Potek/meteor-google-maps.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.8');
  api.use(['reactive-var']);
  api.addFiles(['google-maps.js'], 'client');
  api.export('GoogleMaps', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('dburles:google-maps');
  api.addFiles('google-maps-tests.js');
});
