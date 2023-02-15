export const Routes = {
  // ** Main page
  Presentation: { path: "/" },
  // ** auth client routes
  Signin: { path: "/auth/sign-in" },
  Signup: { path: "/auth/sign-up" },
  ForgotPassword: { path: "/auth/forgot-password" },
  ResetPassword: { path: "/auth/reset-password/:token" },
  CreatePassword: { path: "/auth/create-password/:token" },
  Lock: { path: "/lock" },
  // ** Client role
  Home: { path: "/home" },
  Companies: { path: "/companies" },
  Transactions: { path: "/orders" },
  Settings: { path: "/settings" },
  Sequences: { path: "/sequences" },
  Steps: { path: "/steps" },
  // ** Catching errors client
  NotFound: { path: "/404" },
  ServerError: { path: "/500" },
  // ** Admin Auth
  SigninAdmin: { path: "/back/sign-in" },
  // ** Catching errors clients
  NotFoundAdmin: { path: "/back/404" },
  ServerErrorAdmin: { path: "/back/500" },
  // ** Admin role
  PresentationAdmin: { path: "/back/dashboard" },
  HomeAdmin: { path: "/back/dashboard" },
  Icons: { path: "/back/icons" },
  Offers: { path: "/back/offers" },
  Users: { path: "/back/users" },
  UserContent: { path: "/back/users/:id" },
  CRM: { path: "/back/crm" },
  Hubspot: { path: "/back/hubspot" },
  // ** Tracking order
  Track: { path: "/track/" },
};
