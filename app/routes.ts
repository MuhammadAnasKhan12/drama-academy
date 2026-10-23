import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("classes", "routes/classes.tsx"),
  route("holiday-camps", "routes/holiday-camps.tsx"),
  route("shows", "routes/shows.tsx"),
  route("gallery", "routes/gallery.tsx"),
  route("parents", "routes/parents.tsx"),
  route("book", "routes/book.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("safeguarding", "routes/safeguarding.tsx"),
  route("terms", "routes/terms.tsx"),
  route("cookies", "routes/cookies.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
