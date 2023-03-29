import type { DefaultTheme } from "vitepress/types/default-theme";
import type { Option } from "../types/custom";
export default function genNav(option?: Option): {
    nav: DefaultTheme.NavItem[];
    sidebar: DefaultTheme.Sidebar;
};
