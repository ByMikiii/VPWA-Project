import { boot } from 'quasar/wrappers';

export default boot(({ router }) => {
  router.afterEach((to) => {
    const appName = 'Chatty';
    const routeTitle = to.meta?.title as string | undefined;
    document.title = routeTitle ? `${routeTitle} | ${appName}` : appName;
  });
});
