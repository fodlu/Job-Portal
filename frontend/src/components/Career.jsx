import { useEffect, useMemo, useState } from "react";
import { careerPageStyles as s } from "../assets/dummyStyles";
import axios from "axios";

const Career = () => {
	const [companies, setCompanies] = useState([]);

	// Fetch companies
	useEffect(() => {
		const fetchCompanies = async () => {
			try {
				const res = await axios.get("http://localhost:5000/api/company");
				setCompanies(res.data.companies || []);
			} catch (error) {
				console.log("Error fetching companies: ", error);
			}
		};
		fetchCompanies();
	}, []);

	const duplicatedCompanies = useMemo(() => (companies.length ? [...companies, ...companies] : []), [companies]);

	// Reversed list for the bottom marquee row
    // const reversedDuplicatedCompanies = useMemo(
    //     () => [...duplicatedCompanies].reverse(),
    //     [duplicatedCompanies]
    // );

	// fallback Image
	const placeholder = (name) =>
		`https://via.placeholder.com/560x320?text=${encodeURIComponent(
			(name || "Co").split(" ")[0].slice(0, 2).toUpperCase(),
		)}`;

	// helper function to detect an internal link
	const isExternal = (url) => /^https?:\/\//i.test(url);

	return (
		<div className={s.pageContainer}>
			<div className={s.contentWrapper}>
				<div className={s.header}>
					<h1 className={s.headerTitle}>
						Join Our <span className={s.headerHighlight}>Featured</span>{" "}
						Companies
					</h1>
					<p className={s.headerSubtitle}>
						Discover career opportunities with industry leaders who are actively
						hiring. Your next big role awaits!
					</p>
				</div>

				<div className={s.rowContainer}>
					<div className={s.scrollRowRightToLeft}>
						{duplicatedCompanies.map((company, index) => {
							const href = company.website || "#";
							return (
								<div key={`row1-${index}`} className={s.companyItem}>
									<div className={s.companyInner}>
										<a
											href={href}
											target={isExternal(href) ? "_blank" : undefined}
											rel={
												isExternal(href) ? "noopener noreferrer" : undefined
											}>
											<img
												src={company.logo}
												alt='logo'
												className={s.logoImage}
												onError={(e) => {
													if (
														e.error.currentTarget.src !==
														placeholder(company.name)
													) {
														e.currentTarget.src = placeholder(company.name);
													}
												}}
											/>
										</a>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div className={s.rowContainerLast}>
					<div className={s.scrollRowLeftToRight}>
						{duplicatedCompanies
							.slice()
							.reverse()
							.map((company, index) => {
								const href = company.website || "#";
								return (
									<div
										key={`rows-${index}`}
										className={s.companyItemWithPadding}>
										<a
											href={href}
											target={isExternal(href) ? "_blank" : ""}
											rel={isExternal(href) ? "noopener noreferrer" : undefined}
											className={s.logoLink}>
											<img
												src={company.logo}
												alt='logo'
												className={s.logoImage}
												onError={(e) => {
													if (
														e.currentTarget.src !== placeholder(company.name)
													) {
														e.currentTarget.src = placeholder(company.name);
													}
												}}
											/>
										</a>
									</div>
								);
							})}
					</div>
				</div>
			</div>

			<style>{s.globalStyles}</style>
		</div>
	);
};

export default Career;
