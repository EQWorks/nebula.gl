module.exports = {
  env: {
    es5: {
      presets: [
        [
          '@babel/env',
          {
            modules: 'commonjs',
            exclude: ['babel-plugin-transform-classes']
          }
        ],
        '@babel/react',
        '@babel/flow'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        'version-inline'
      ]
    },
    es6: {
      presets: [
        [
          '@babel/preset-env',
          {
            exclude: ['babel-plugin-transform-classes']
          }
        ],
        '@babel/react',
        '@babel/flow'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        'version-inline'
      ]
    },
    test: {
      presets: ['@babel/env', '@babel/react', '@babel/flow'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        'version-inline'
      ]
    }
  }
};
