import m from 'mithril';
import './style.less';

const Home = {
  view: (vnode) => {
    return [
      m('a', { href: '/pizzacat', oncreate: m.route.link }, '🍕🐈'),
      m('a', { href: '/lasercat', oncreate: m.route.link }, '🚨🐈'),
    ];
  },
};

const makeRoute = pageId => ({
  [`/${pageId}`]: {
    onmatch: () => import(`./pages/${pageId}`)
      .then((module => module.default))
  }
});

const pages = ['lasercat', 'pizzacat'];

const routes = Object.assign(
  { '/': Home },
  ...pages.map(makeRoute)
);

m.route(document.body, '/', routes);
