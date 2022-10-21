import { HomePage } from "../pages/Home";
import { UserPage } from "../pages/User";
import { PrivacyPage } from "../pages/Privacy";
import { TermsPage } from "../pages/Terms";
import { HOME_ROUTE, USER_ROUTE, PRIVACY_ROUTE, TERMS_ROUTE } from "./Routes";
export interface Page {
  key: string;
  route: string;
  component: JSX.Element;
  showInMenu: boolean;
  icon?: string;
  label?: string;
}

export const pages: Page[] = [
  {
    key: "home",
    route: HOME_ROUTE,
    component: <HomePage />,
    showInMenu: true,
    icon: "",
    label: "Home",
  },
  {
    key: "user",
    route: USER_ROUTE,
    component: <UserPage />,
    showInMenu: false,
  },
  {
    key: "privacy",
    route: PRIVACY_ROUTE,
    component: <PrivacyPage />,
    showInMenu: false,
  },
  {
    key: "terms",
    route: TERMS_ROUTE,
    component: <TermsPage />,
    showInMenu: false,
  },
];
