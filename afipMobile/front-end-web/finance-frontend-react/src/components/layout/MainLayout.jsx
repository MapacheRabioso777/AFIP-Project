import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg max-w-full overflow-x-hidden flex">
            <nav>
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </nav>

            <div className="flex-1">
                <main>
                    <header>
                        <Header onMenuClick={() => setSidebarOpen(true)} />
                    </header>
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};



