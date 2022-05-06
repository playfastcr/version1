import path from 'path';

export const aliasConfiguration = {
  '@initializer': path.resolve(__dirname, './src/initializers'),
  '@context': path.resolve(__dirname, './src/context'),
  '@service': path.resolve(__dirname, './src/services'),
  '@hooks': path.resolve(__dirname, './src/hooks'),
  '@component': path.resolve(__dirname, './src/components'),
  '@playfast/app': path.resolve(__dirname, './src/modules'),
  '@playfast/theme': path.resolve(__dirname, './src/themes'),
  '@playfast/assets': path.resolve(__dirname, './src/assets'),
};
