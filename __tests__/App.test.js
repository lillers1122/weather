import 'react-native';
import React from 'react';
import Expo from 'expo';
import App from '../App';
import Attribution from '../components/Attribution';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<App />).toJSON();
  expect(rendered).toBeTruthy();
});

it('renders App correctly', () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders the ActivityIndicator component', () => {
  const ActivityIndicator = require('ActivityIndicator');
  const tree = renderer
    .create(<ActivityIndicator animating={true} color="#999999"
    hidesWhenStopped={true} size="large" />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
