export const SummaryBanner = ({ title, subtitle, stats, actionButton, balanceInfo }) => {
    return (
        <div className="bg-primary-500 rounded-2xl p-8 text-white shadow-primary-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">{title}</h2>
                    <p className="text-primary-100 mb-4 text-lg">{subtitle}</p>
                    {actionButton && (
                        <div className="flex flex-wrap gap-3">
                            {actionButton}
                        </div>
                    )}
                </div>
                {balanceInfo && (
                    <div className="hidden md:block">
                        <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-xl">
                            <p className="text-sm text-primary-100 mb-2 font-medium">{balanceInfo.label}</p>
                            <p className="text-4xl font-bold mb-2">{balanceInfo.value}</p>
                            {balanceInfo.status && (
                                <p className="text-sm text-primary-100 mt-1">{balanceInfo.status}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {stats && stats.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/30">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <p className="text-sm text-primary-100 mb-2 font-medium">{stat.label}</p>
                            <p className="text-3xl font-bold mb-1">{stat.value}</p>
                            {stat.subtitle && (
                                <p className="text-xs text-primary-200 mt-1">{stat.subtitle}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};



