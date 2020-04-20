Package.describe({
  name: 'epotek:google-maps',
  summary: 'Google Maps Javascript API, without blaze',
  version: '2.0.2',
  git: 'https://github.com/e-Potek/meteor-google-maps.git',
});

Package.onUse((api) => {
  api.versionsFrom('1.8');
  api.use(['reactive-var']);
  api.addFiles(['google-maps.js'], 'client');
  api.export('GoogleMaps', 'client');
});

Package.onTest((api) => {
  api.use('tinytest');
  api.use('epotek:google-maps');
  api.addFiles('google-maps-tests.js');
});
