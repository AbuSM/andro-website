import React from "react";
import "./App.css";

const Hero = () => {
	// Hero carousel images - Define first!
	const heroImages = ["/bg.jpg", "/contacts.png", "/photo/solar.jpg"];

	// Hero carousel texts for each slide
	const heroTexts = [
		<>
			Солнечная энергия
			<br />
			для вашего дома
			<br />и бизнеса
		</>,
		<>
			Переходите на
			<br />
			солнечную энергию
			<br />и экономьте до 80%
		</>,
		<>
			Установка панелей
			<br />
			под ключ с гарантией
			<br />и обслуживанием
		</>,
	];

	const [isSticky, setIsSticky] = React.useState(false);
	const [activeSection, setActiveSection] = React.useState("hero");
	const [showModal, setShowModal] = React.useState(false);
	const [menuOpen, setMenuOpen] = React.useState(false);
	const [burgerDark, setBurgerDark] = React.useState(false);
	const [showScrollTop, setShowScrollTop] = React.useState(false);
	const [currentHeroSlide, setCurrentHeroSlide] = React.useState(0);

	React.useEffect(() => {
		const track = document.querySelector(".portfolio-track");
		if (!track) return;

		let position = 0;
		const speed = 0.5; // slider speed

		const interval = setInterval(() => {
			position -= speed;
			if (Math.abs(position) >= track.scrollWidth / 2) {
				position = 0;
			}
			track.style.transform = `translateX(${position}px)`;
		}, 16);

		return () => clearInterval(interval);
	}, []);

	// Hero carousel auto-slide
	React.useEffect(() => {
		const interval = setInterval(() => {
			setCurrentHeroSlide((prev) => (prev + 1) % heroImages.length);
		}, 5000); // Change slide every 5 seconds

		return () => clearInterval(interval);
	}, [heroImages.length]);

	React.useEffect(() => {
		let lastScroll = 0;
		const handleScroll = () => {
			const current = window.scrollY;
			const heroInner = document.querySelector(".hero-inner");

			if (current < lastScroll && current > 120) {
				setIsSticky(true);
				if (heroInner) heroInner.classList.add("header-sticky");
			} else {
				setIsSticky(false);
				if (heroInner) heroInner.classList.remove("header-sticky");
			}
			lastScroll = current;

			// Show scroll to top button after scrolling 400px
			setShowScrollTop(current > 400);

			// Check if in white section for burger color
			const aboutEl = document.getElementById("about");
			const faqEl = document.getElementById("faq");

			if (aboutEl && faqEl) {
				const aboutTop = aboutEl.offsetTop;
				const faqBottom = faqEl.offsetTop + faqEl.offsetHeight;

				if (current >= aboutTop - 100 && current <= faqBottom) {
					setBurgerDark(true);
				} else {
					setBurgerDark(false);
				}
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	React.useEffect(() => {
		const sections = [
			"hero",
			"about",
			"services",
			"portfolio",
			"contacts",
			"faq",
		];
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				});
			},
			{
				threshold: [0.1, 0.3, 0.5],
				rootMargin: "-30% 0px -50% 0px",
			}
		);
		sections.forEach((id) => {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		});
		return () => observer.disconnect();
	}, []);

	const scrollToSection = (id) => {
		document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Form state and handlers
	const [fullName, setFullName] = React.useState("");
	const [phone, setPhone] = React.useState("");

	const handlePhoneChange = (e) => {
		let value = e.target.value.replace(/\D/g, "");

		// Remove country code if typed manually
		if (value.startsWith("992")) value = value.slice(3);

		// Limit digits
		value = value.slice(0, 9);

		const formatted =
			"+992 " +
			value.replace(/(\d{3})(\d{3})(\d{0,3})/, (_, p1, p2, p3) =>
				p3 ? `${p1} ${p2} ${p3}` : p2 ? `${p1} ${p2}` : p1
			);

		setPhone(formatted);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const botToken = "7674939275:AAGtBAn0gJa3bSQGAgdsaoCJsz5RvyMZvak";
		const chatId = "-1003382168225";

		const message = `
📩 Новая заявка с сайта ANDRO
———————————————
👤 ФИО: ${fullName}
📱 Телефон: ${phone}
✉️ Email: ${document.querySelector('input[type="email"]').value || "—"}
💬 Сообщение: ${document.querySelector("textarea").value || "—"}
    `;

		fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				chat_id: chatId,
				text: message,
				parse_mode: "HTML",
			}),
		});

		const onlyDigits = phone.replace(/\D/g, "");
		if (fullName.trim() === "" || onlyDigits.length !== 12) {
			alert("Пожалуйста, заполните ФИО и корректный номер телефона.");
			return;
		}

		setShowModal(true);
	};

	const portfolioPhotos = [
		"/portfolio/1.jpg",
		"/portfolio/2.jpg",
		"/portfolio/3.jpg",
		"/portfolio/4.jpg",
		"/portfolio/5.jpg",
		"/portfolio/6.jpg",
		"/portfolio/7.jpg",
		"/portfolio/8.jpg",
	];

	const faqData = [
		{
			q: "Как долго служат солнечные панели?",
			a: "Современные панели рассчитаны на срок службы 20–25 лет, сохраняют эффективность и нуждаются только в минимальном обслуживании.",
		},
		{
			q: "Работают ли панели зимой и в пасмурную погоду?",
			a: "Да. Они вырабатывают энергию даже при рассеянном свете — зимой производительность ниже, но система остаётся стабильной и полезной.",
		},
		{
			q: "Через сколько окупается установка?",
			a: "В среднем 3–5 лет, в зависимости от мощности, места установки и потребления энергии. После этого вы экономите практически бесплатно.",
		},
		{
			q: "Нужны ли разрешения и бумаги?",
			a: "Большинство домашних установок не требуют сложных согласований. При необходимости мы берём оформление документов на себя.",
		},
		{
			q: "Можно ли подключить систему к аккумуляторам?",
			a: "Да. Гибридные системы позволяют хранить энергию и обеспечивают автономность при отключениях электричества.",
		},
		{
			q: "Как часто нужно обслуживать панели?",
			a: "Достаточно профилактической чистки и диагностики 1–2 раза в год, чтобы поддерживать максимальную эффективность работы.",
		},
	];

	return (
		<>
			<section
				className="hero"
				id="hero"
				style={{ fontFamily: "'Manrope', sans-serif" }}
			>
				<div className="hero-overlay" />
				{/* Hero Carousel */}
				{heroImages.map((image, index) => (
					<img
						key={index}
						src={image}
						className={`hero-bg ${
							index === currentHeroSlide ? "active" : ""
						}`}
						alt={`Slide ${index + 1}`}
					/>
				))}
				<div className="hero-inner">
					{/* HEADER */}
					<header
						className={`hero-header ${isSticky ? "sticky" : ""}`}
					>
						{/* Лого */}
						<div className="hero-logo">
							<img src="/logo.svg" alt="АНДРО" />
						</div>

						{/* Меню */}
						<nav className="hero-nav">
							<ul>
								<li
									className={
										activeSection === "hero" ? "active" : ""
									}
									onClick={() => scrollToSection("hero")}
								>
									Главная
								</li>
								<li
									className={
										activeSection === "about"
											? "active"
											: ""
									}
									onClick={() => scrollToSection("about")}
								>
									О нас
								</li>
								<li
									className={
										activeSection === "services"
											? "active"
											: ""
									}
									onClick={() => scrollToSection("services")}
								>
									Сервисы
								</li>
								<li
									className={
										activeSection === "portfolio"
											? "active"
											: ""
									}
									onClick={() => scrollToSection("portfolio")}
								>
									Портфолио
								</li>
								<li
									className={
										activeSection === "contacts"
											? "active"
											: ""
									}
									onClick={() => scrollToSection("contacts")}
								>
									Контакты
								</li>
								<li
									className={
										activeSection === "faq" ? "active" : ""
									}
									onClick={() => scrollToSection("faq")}
								>
									Вопросы
								</li>
							</ul>
						</nav>

						{/* Соцсети */}
						<div className="hero-socials">
							<a
								href="https://www.instagram.com/andro.energy/"
								target="_blank"
								className="hero-social-circle"
							>
								<img src="/ig.svg" alt="Instagram" />
							</a>
							<a
								href="https://www.facebook.com/andro.energy/"
								target="_blank"
								className="hero-social-circle"
							>
								<img src="/fb.svg" alt="Facebook" />
							</a>
						</div>

						<div
							className={`burger ${burgerDark ? "dark" : ""}`}
							onClick={() => setMenuOpen(!menuOpen)}
						>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</header>
					<div className={`mobile-menu ${menuOpen ? "active" : ""}`}>
						{/* затемнение */}
						<div
							className="mobile-menu-overlay"
							onClick={() => setMenuOpen(false)}
						/>

						{/* панель меню */}
						<div className="mobile-menu-panel">
							<button
								className="mobile-menu-close"
								onClick={() => setMenuOpen(false)}
								aria-label="Закрыть меню"
								style={{
									position: "absolute",
									top: "20px",
									right: "20px",
									width: "36px",
									height: "36px",
									borderRadius: "50%",
									background: "#ffffff",
									border: "2px solid #E73B2F",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									fontSize: "26px",
									fontWeight: "bold",
									color: "#E73B2F",
									cursor: "pointer",
									zIndex: 999999,
								}}
							>
								×
							</button>

							<ul className="mobile-menu-list">
								<li
									onClick={() => {
										scrollToSection("hero");
										setMenuOpen(false);
									}}
								>
									Главная
								</li>
								<li
									onClick={() => {
										scrollToSection("about");
										setMenuOpen(false);
									}}
								>
									О нас
								</li>
								<li
									onClick={() => {
										scrollToSection("services");
										setMenuOpen(false);
									}}
								>
									Сервисы
								</li>
								<li
									onClick={() => {
										scrollToSection("portfolio");
										setMenuOpen(false);
									}}
								>
									Портфолио
								</li>
								<li
									onClick={() => {
										scrollToSection("contacts");
										setMenuOpen(false);
									}}
								>
									Контакты
								</li>
								<li
									onClick={() => {
										scrollToSection("faq");
										setMenuOpen(false);
									}}
								>
									Вопросы
								</li>
							</ul>
						</div>
					</div>

					{/* CONTENT */}
					<div className="hero-content">
						{/* ЛЕВАЯ ЧАСТЬ */}
						<div className="hero-left">
							<h1>{heroTexts[currentHeroSlide]}</h1>

							<div className="hero-buttons">
								<button
									className="hero-btn hero-btn--primary"
									onClick={() =>
										(window.location.href =
											"tel:+992000005477")
									}
								>
									Позвонить
								</button>
								<button
									className="hero-btn hero-btn--secondary"
									onClick={() =>
										(window.location.href =
											"https://wa.me/992000005477")
									}
								>
									Написать
								</button>
							</div>
						</div>

						{/* ПРАВАЯ ЧАСТЬ — ФОРМА */}
						<aside className="hero-form-card">
							<h2>Оставьте заявку</h2>
							<p>
								Мы подберём оптимальное решение под ваш объект
							</p>

							<form onSubmit={handleSubmit}>
								<input
									type="text"
									placeholder="ФИО *"
									value={fullName}
									onChange={(e) =>
										setFullName(e.target.value)
									}
									required
								/>

								<input
									type="tel"
									placeholder="+992 XXX XXX XXX *"
									value={phone}
									onChange={handlePhoneChange}
									required
								/>

								<input
									type="email"
									placeholder="Электронная почта"
								/>

								<textarea placeholder="Сообщение" />

								<button type="submit" className="hero-submit">
									Оставить заявку
								</button>
							</form>
						</aside>
					</div>
				</div>
			</section>

			{showModal && (
				<div className="custom-modal">
					<div className="custom-modal-content">
						<h3>Ваша заявка принята!</h3>
						<p>Наши операторы скоро с вами свяжутся.</p>
						<button onClick={() => setShowModal(false)}>ОК</button>
					</div>
				</div>
			)}

			{/* ABOUT SECTION */}
			<section className="about" id="about">
				<div className="about-container">
					<h3 className="about-label">О нас</h3>

					<p className="about-text">
						Andro Energy — компания, которая уже 5 лет помогает
						домам и бизнесам Таджикистана переходить на чистую
						солнечную энергию. Мы создаём современные, надёжные и
						доступные решения, делая экологичное будущее ближе для
						каждого.
					</p>

					<div className="about-icons">
						<div className="about-item">
							<div className="about-icon">
								<img src="/icons/1.svg" />
							</div>
							<h4>5 лет на рынке</h4>
							<p>
								Работаем на рынке солнечной энергетики
								Таджикистана.
							</p>
						</div>

						<div className="about-item">
							<div className="about-icon">
								<img src="/icons/2.svg" />
							</div>
							<h4>Профессиональная команда</h4>
							<p>
								Инженеры с практическим опытом и точными
								решениями.
							</p>
						</div>

						<div className="about-item">
							<div className="about-icon">
								<img src="/icons/3.svg" />
							</div>
							<h4>Гарантированное качество</h4>
							<p>
								Используем сертифицированные и надёжные панели.
							</p>
						</div>

						<div className="about-item">
							<div className="about-icon">
								<img src="/icons/4.svg" />
							</div>
							<h4>Проекты под ключ</h4>
							<p>
								Расчёт, монтаж и поддержка — всё в одном месте.
							</p>
						</div>

						<div className="about-item">
							<div className="about-icon">
								<img src="/icons/5.svg" />
							</div>
							<h4>Доступные технологии</h4>
							<p>
								Делаем солнечную энергию простой и эффективной.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* SERVICES SECTION */}
			<section className="services" id="services">
				<div className="services-container">
					<h3 className="services-title">Сервисы</h3>
					<p className="services-subtitle">
						Мы сопровождаем ваш проект на каждом этапе — от оценки
						объекта и проектирования до монтажа и постоянного
						мониторинга. Наша команда обеспечивает стабильную работу
						системы и высокую эффективность на долгие годы.
					</p>

					<div className="services-grid">
						<div className="service-item">
							<h4>01 — Проектирование</h4>
							<p>
								Мы детально оцениваем объект, изучаем
								освещённость, угол крыши и потребление энергии,
								чтобы подобрать оптимальную солнечную систему,
								полностью соответствующую вашим условиям.
							</p>
						</div>

						<div className="service-item">
							<h4>02 — Инженерия и дизайн</h4>
							<p>
								На основе собранных данных создаём
								индивидуальный проект, который сочетает
								эффективность, надёжность и аккуратную
								интеграцию в архитектуру вашего дома или
								бизнеса.
							</p>
						</div>

						<div className="service-item">
							<h4>03 — Монтаж и подключение</h4>
							<p>
								Наша команда выполняет установку профессионально
								и безопасно, используя проверенные методы и
								оборудование, чтобы система работала стабильно и
								достигала максимальной производительности.
							</p>
						</div>

						<div className="service-item">
							<h4>04 — Мониторинг и обслуживание</h4>
							<p>
								Мы отслеживаем работу системы, контролируем её
								продуктивность и при необходимости проводим
								обслуживание, обеспечивая долгий срок службы и
								стабильную эффективность.
							</p>
						</div>
					</div>

					<div className="services-images">
						<img src="/photo/s1.png" alt="service-img-1" />
						<img src="/photo/s2.png" alt="service-img-2" />
						<img src="/photo/s3.png" alt="service-img-3" />
						<img src="/photo/s4.png" alt="service-img-4" />
					</div>
				</div>
			</section>

			{/* PORTFOLIO SECTION */}
			<section className="portfolio" id="portfolio">
				<div className="portfolio-container">
					<h3 className="portfolio-title">Наши проекты</h3>

					<p className="portfolio-subtitle">
						Здесь представлены выполненные установки солнечных
						систем для домов и бизнеса по всему Таджикистану. Мы
						делимся реальными проектами, чтобы вы могли увидеть
						качество работы Andro Energy и результаты, которые
						получают наши клиенты.
					</p>

					<div className="portfolio-slider-wrapper">
						<div className="portfolio-track">
							{portfolioPhotos
								.concat(portfolioPhotos)
								.map((src, index) => (
									<div className="portfolio-card" key={index}>
										<img
											src={src}
											alt={`Проект ${index + 1}`}
										/>
									</div>
								))}
						</div>
					</div>

					<div className="portfolio-progress">
						<div className="portfolio-progress-bar" />
					</div>
				</div>
			</section>

			{/* CONTACTS SECTION */}
			<section className="contacts" id="contacts">
				<img src="/contacts.png" className="contacts-bg" alt="" />
				<div className="contacts-overlay"></div>

				<div className="contacts-inner">
					<h3 className="contacts-title">Свяжитесь с нами</h3>
					<p className="contacts-subtitle">
						Мы всегда готовы помочь вам с выбором, расчётом и
						консультацией. Оставьте заявку или напишите нам —
						команда Andro Energy ответит в ближайшее время.
					</p>

					<div className="contacts-main">
						{/* CONTACT FORM — копия HERO */}
						<div className="contacts-form-card">
							<h2>Оставьте заявку</h2>
							<p>
								Мы подберём оптимальное решение под ваш объект
							</p>

							<form onSubmit={handleSubmit}>
								<input
									type="text"
									placeholder="ФИО *"
									value={fullName}
									onChange={(e) =>
										setFullName(e.target.value)
									}
									required
								/>

								<input
									type="tel"
									placeholder="+992 XXX XXX XXX *"
									value={phone}
									onChange={handlePhoneChange}
									required
								/>

								<input
									type="email"
									placeholder="Электронная почта"
								/>
								<textarea placeholder="Сообщение" />

								<button type="submit" className="hero-submit">
									Оставить заявку
								</button>
							</form>
						</div>

						{/* REAL MAP IFRAME */}
						<div className="contacts-map">
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6460.8064820871095!2d68.76612731014563!3d38.54842470538629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b5d1f974ce742b%3A0x3d69ba1325d9a423!2z0JrQsNGA0LDQsdC-0LXQsg!5e0!3m2!1sru!2s!4v1766417661762!5m2!1sru!2s"
								allowFullScreen=""
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
							></iframe>
						</div>
					</div>

					<div className="contacts-bottom">
						<a
							href="https://instagram.com/andro.energy"
							target="_blank"
							className="hero-social-circle"
						>
							<img src="/ig.svg" alt="Instagram" />
						</a>
						<a
							href="https://facebook.com/andro.energy"
							target="_blank"
							className="hero-social-circle"
						>
							<img src="/fb.svg" alt="Facebook" />
						</a>
						<a
							href="https://t.me/androenergy"
							target="_blank"
							className="hero-social-circle"
						>
							<img src="/tg.svg" alt="Telegram" />
						</a>
						<a
							href="https://wa.me/992000005477"
							target="_blank"
							className="hero-social-circle"
						>
							<img src="/wa.svg" alt="WhatsApp" />
						</a>
						<a href="tel:+992000005477" className="contacts-phone">
							<img src="/call.svg" alt="" />
							<span>+992 000 005 477</span>
						</a>
					</div>
				</div>
			</section>

			{/* FAQ SECTION */}
			<section className="faq" id="faq">
				<h3 className="faq-title">FAQ</h3>
				<p className="faq-subtitle">
					Мы собрали самые частые вопросы о солнечных панелях, чтобы
					упростить вам выбор и снять все сомнения. Здесь вы найдёте
					быстрые, понятные ответы о сроке службы, установке, выгоде и
					обслуживании систем.
				</p>

				<div className="faq-list">
					{faqData.map((item, index) => (
						<div className="faq-item" key={index}>
							<div className="faq-question">
								<span>{item.q}</span>
								<button
									className="faq-toggle"
									onClick={() => {
										const answer = document.getElementById(
											`faq-answer-${index}`
										);
										answer.classList.toggle("open");
									}}
								>
									+
								</button>
							</div>

							<div
								className="faq-answer"
								id={`faq-answer-${index}`}
							>
								{item.a}
							</div>
						</div>
					))}
				</div>
			</section>
			{/* FIXED WHATSAPP BUTTON */}
			<a
				href="https://wa.me/992000005477"
				target="_blank"
				rel="noopener noreferrer"
				className="whatsapp-float"
				aria-label="Написать в WhatsApp"
			>
				<img src="/wa.svg" alt="WhatsApp" />
			</a>

			{/* SCROLL TO TOP BUTTON */}
			<button
				className={`scroll-to-top ${showScrollTop ? "visible" : ""}`}
				onClick={scrollToTop}
				aria-label="Вернуться наверх"
			>
				<svg viewBox="0 0 24 24">
					<path
						d="M12 19V5M5 12l7-7 7 7"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			{/* FOOTER */}
			<footer className="site-footer">
				<div className="footer-top">
					<div className="footer-logo">
						<img src="/logo.svg" alt="Andro Energy" />
					</div>

					<nav className="footer-nav">
						<ul>
							<li onClick={() => scrollToSection("hero")}>
								Главная
							</li>
							<li onClick={() => scrollToSection("about")}>
								О нас
							</li>
							<li onClick={() => scrollToSection("services")}>
								Сервисы
							</li>
							<li onClick={() => scrollToSection("portfolio")}>
								Портфолио
							</li>
							<li onClick={() => scrollToSection("contacts")}>
								Контакты
							</li>
							<li onClick={() => scrollToSection("faq")}>
								Вопросы
							</li>
						</ul>
					</nav>

					<div className="footer-socials">
						<a
							href="https://instagram.com/andro.energy"
							target="_blank"
							rel="noreferrer"
						>
							<img src="/ig.svg" alt="Instagram" />
						</a>
						<a
							href="https://facebook.com/andro.energy"
							target="_blank"
							rel="noreferrer"
						>
							<img src="/fb.svg" alt="Facebook" />
						</a>
						<a
							href="https://t.me/androenergy"
							target="_blank"
							rel="noreferrer"
						>
							<img src="/tg.svg" alt="Telegram" />
						</a>
						<a
							href="https://wa.me/992000005477"
							target="_blank"
							rel="noreferrer"
						>
							<img src="/wa.svg" alt="WhatsApp" />
						</a>
					</div>
				</div>

				<div className="footer-bottom">
					<span>Andro Energy © 2025</span>
					<span className="footer-slogan">
						Солнечная энергия. Надёжность. Будущее.
					</span>
				</div>
			</footer>
		</>
	);
};

export default Hero;
