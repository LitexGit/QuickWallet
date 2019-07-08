import React from 'react';
import { storiesOf } from '@storybook/react-native';

import AlertMessage from './AlertMessage';

storiesOf('AlertMessage')
    .add('Default', () => (
        <AlertMessage
            title="ALERT ALERT"
        />
    ))
    .add('Hidden', () => (
        <AlertMessage
            show={false}
            title="ALERT ALERT"
        />
    ))
    .add('Custom Style', () => (
        <AlertMessage
            style={{ backgroundColor: 'red' }}
            title="ALERT ALERT"
        />
    ));
