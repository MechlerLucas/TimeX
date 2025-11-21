const routes = {
  Welcome: "/",
  Home: "/home",
  CreateTask: "/create-task",
  About: "/about",
};

export function createPageUrl(pageName) {
  return routes[pageName] || "/";
}
