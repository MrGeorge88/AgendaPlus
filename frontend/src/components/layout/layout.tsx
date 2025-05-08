import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import "./layout.css";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title={title} />
        <main>{children}</main>
      </div>
    </div>
  );
}
