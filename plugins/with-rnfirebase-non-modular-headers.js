const { withPodfile } = require('@expo/config-plugins');

// Allows RNFirebase pods to include React headers when use_frameworks is enabled.
const MARKER = 'RNFB_ALLOW_NON_MODULAR_INCLUDES';
const SNIPPET = `
  # ${MARKER}
  installer.pods_project.targets.each do |target|
    if target.name.start_with?('RNFB')
      target.build_configurations.each do |config|
        config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
      end
    end
  end
`;

module.exports = function withRnfirebaseNonModularHeaders(config) {
  return withPodfile(config, (config) => {
    const podfile = config.modResults.contents;

    if (podfile.includes(MARKER)) {
      return config;
    }

    const postInstallPattern = /post_install do \|installer\|\n/;

    if (postInstallPattern.test(podfile)) {
      config.modResults.contents = podfile.replace(
        postInstallPattern,
        (match) => `${match}${SNIPPET}\n`
      );
    } else {
      config.modResults.contents = `${podfile}\npost_install do |installer|\n${SNIPPET}end\n`;
    }

    return config;
  });
};
