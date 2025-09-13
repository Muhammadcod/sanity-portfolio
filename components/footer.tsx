export const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="py-8 border-t px-6">
			<div className="container mx-auto">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="mb-4 md:mb-0">
						<p className="text-muted-foreground">
							© {currentYear} Muhbi. All rights reserved.
						</p>
					</div>

					<div className="flex items-center">
						<p className="text-muted-foreground flex items-center">
							Built with
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};
