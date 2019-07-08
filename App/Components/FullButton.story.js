import React from 'react';
import { storiesOf } from '@storybook/react-native';

import FullButton from './FullButton';

storiesOf('FullButton')
    .add('Default', () => (
        <FullButton
            text="A simple button"
        />
    ))
    .add('Custom Style', () => (
        <FullButton
            styles={{ backgroundColor: 'blue' }}
            text="Style Me Up!"
        />
    ));
