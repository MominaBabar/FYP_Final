/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
// import LibraryBooks from "@material-ui/icons/LibraryBooks";
// import BubbleChart from "@material-ui/icons/BubbleChart";
// import LocationOn from "@material-ui/icons/LocationOn";
// import Notifications from "@material-ui/icons/Notifications";
// import Unarchive from "@material-ui/icons/Unarchive";
// import Language from "@material-ui/icons/Language";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import UserTableList from "views/TableList/UserTableList.js";
import AdminTableList from "views/TableList/AdminTableList.js";
import MachineTableList from "views/TableList/MachineTableList.js";
// import Typography from "views/Typography/Typography.js";
// import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
// import NotificationsPage from "views/Notifications/Notifications.js";
// import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.js";
import Team from "views/Team/Team.js";
const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "User Profile",
   
    icon: Person,
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "User Information",
    
    icon: "content_paste",
    component: UserTableList,
    layout: "/admin"
  },
  {
    path: "/machinetable",
    name: "Machine Information",
   
    icon: "content_paste",
    component:MachineTableList,
    layout: "/admin"
  },
  {
    path: "/admintable",
    name: "Admin Information",
    
    icon: "admin_panel_settings",
    component: AdminTableList,
    layout: "/admin"
  },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
   
  //   icon: Notifications,
  //   component: NotificationsPage,
  //   layout: "/admin"
  // },
  {
    path: "/team",
    name: "Our Team",
    
    icon: "group_work",
    component:  Team,
    layout: "/admin"
  },
  {
    path: "/logout",
    name: "Logout",
    icon: "exit_to_app",
    component: Maps,
    layout: "/admin"
  },
];

export default dashboardRoutes;
