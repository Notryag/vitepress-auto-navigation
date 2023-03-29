type FileItem = {
    text: string;
    link: string;
};
type NavItem = {
    text: string;
    items: FileItem[];
};
type SidebarItem = {
    text: string;
    items: FileItem[];
};
declare const genNav: () => {
    nav: NavItem[];
    sidebar: {
        [key: string]: SidebarItem[];
    };
};
export default genNav;
