import m from 'mithril';

const Giphy = {
  view: (vnode) => m('iframe.giphy-embed', {
    src: `https://giphy.com/embed/${vnode.attrs.id}`,
    width: 480,
    height: 270,
    frameBorder: 0,
  }),
};

export default Giphy;
