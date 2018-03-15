import m from 'mithril';
import Giphy from '../components/giphy';
import './pizzacat.less';
/*
import { map, o, compose, identity, toUpper, toLower, trim, toString, unfold, ifElse, equals, F, add, inc, unnest, aperture, intersperse, unfold } from 'ramda';

const transform = compose(x => parseInt(x, 10), o(toUpper, toLower), trim, toString);
const u = ifElse(equals(100), F, x => [x, add(inc(9, 1), x)]);
const generate = compose(unnest, aperture(2), intersperse(5), unfold(u))             
const numbers = compose(sum, map(transform), generate);

const uselesslyComplexCreatedNumbers = numbers(10);
*/

export default {
  view: () => m('.pizzacat', m(Giphy, { id: 'Wg45QRjBZkube' }))
};
