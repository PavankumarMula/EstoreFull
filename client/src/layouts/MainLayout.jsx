import Header from "../components/Header";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;