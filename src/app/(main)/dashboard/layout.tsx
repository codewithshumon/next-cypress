interface LayoutProps {
  children: React.ReactNode;
  params: any;
}

const Layout: React.FC<LayoutProps> = ({ children, params }) => {
  return <main className="flex overflow-hidden">Layout</main>;
};

export default Layout;
