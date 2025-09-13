export const AnimatedBackground = () => {
	return (
		<div className="absolute inset-0 -z-10 overflow-hidden">
			<div className="relative w-full h-full">
				<div className="absolute top-1/4 -left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />

				<div className="absolute top-1/3 right-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-2xl animate-pulse delay-500" />
				<div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-2xl animate-pulse delay-700" />
			</div>
		</div>
	);
};
