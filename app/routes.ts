import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("classes", "routes/classes.tsx"),
  route("shows", "routes/shows.tsx"),
  route("gallery", "routes/gallery.tsx"),
  route("book", "routes/book.tsx"),
  route("book/confirmation", "routes/book.confirmation.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("safeguarding", "routes/safeguarding.tsx"),
  route("terms", "routes/terms.tsx"),
  route("cookies", "routes/cookies.tsx"),
  ...prefix("admin", [
    layout("routes/admin/layout.tsx", [
      index("routes/admin/dashboard.tsx"),
      route("bookings", "routes/admin/bookings.tsx"),
      route("registers", "routes/admin/registers.tsx"),
      route("clubs", "routes/admin/clubs.tsx"),
    ]),
  ]),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
