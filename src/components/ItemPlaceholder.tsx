import { Placeholder, ThemeProvider, Theme } from '@aws-amplify/ui-react';

const theme: Theme = {
  name: 'placeholder-theme',
  tokens: {
    components: {
      placeholder: {
        transitionDuration: { value: '1250ms' },
        startColor: { value: '#846cff' },
        endColor: { value: '#a46cff' },
        borderRadius: { value: '{radii.large}' },
        large: {
          height: { value: '{space.xxl}' },
        },
      },
    },
  },
};

export const ItemPlaceholder = ({ isLoaded }) => {
  return (
    <ThemeProvider
      theme={theme}
      colorMode='light'>
      <Placeholder
        size='large'
        isLoaded={isLoaded}
      />
    </ThemeProvider>
  );
};
