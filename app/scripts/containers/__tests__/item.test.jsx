import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import ConnectedItem, { Item } from '../item';

const store = configureMockStore()();

describe('ConnectedItem', () => {
  const connectedComponent = shallow(
    <Provider store={ store }>
      <ConnectedItem />
    </Provider>
  );

  it('exports a connected component that can be successfully rendered', () =>
    expect(connectedComponent.find(ConnectedItem)).toBeTruthy()
  );
});

describe('Item', () => {
  const addToFavourites = jest.fn();
  const removeFromFavourites = jest.fn();

  const props = customProps => ({
    addToFavourites,
    date: '2017-06-03T14:44:43-08:00',
    favourite: false,
    link: 'http://www.flickr.com/photos/thevixen/34702706110/',
    path: 'http://farm5.staticflickr.com/4266/34702706110_e722ea7bf8_m.jpg',
    removeFromFavourites,
    title: 'Make Them Go Away',
    ...customProps,
  });

  it('renders an unfavourited item', () => {
    const component = shallow(<Item { ...props() } />);

    expect(component.find('.item').node.props.className)
      .toBe('item ');
    expect(component.find('.item__button').text())
      .toBe('favourite');
    expect(component.find('.item__icon').node.props.src)
      .toBe('heart_empty.svg');
    expect(component.find('.item__icon').node.props.alt)
      .toBe('Add to favourites');
  });

  it('renders an favourited item', () => {
    const component = shallow(<Item { ...props({ favourite: true }) } />);

    expect(component.find('.item').node.props.className)
      .toBe('item item--favourite');
    expect(component.find('.item__button').text())
      .toBe('favourited!');
    expect(component.find('.item__icon').node.props.src)
      .toBe('heart_full.svg');
    expect(component.find('.item__icon').node.props.alt)
      .toBe('Remove from favourites');
  });

  it('calls the "addToFavourites" function when not favourited', () => {
    const component = shallow(<Item { ...props() } />);
    component.find('.item__button').simulate('click');

    expect(addToFavourites).toBeCalledWith(props().link);
  });

  it('calls the "removeFromFavourites" function when already favourited', () => {
    const component = shallow(<Item { ...props({ favourite: true }) } />);
    component.find('.item__button').simulate('click');

    expect(removeFromFavourites).toBeCalledWith(props().link);
  });
});
