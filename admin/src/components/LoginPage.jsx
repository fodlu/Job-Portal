import { useEffect, useState } from "react";
import { loginPageStyles as s } from "../assets/dummyStyles";
import { useNavigate } from "react-router-dom";
import {
	AlertCircle,
	CheckCircle,
	Eye,
	EyeOff,
	Lock,
	LogIn,
	X,
} from "lucide-react";
import axios from "axios";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [toast, setToast] = useState({
		visible: false,
		message: "",
		type: "success",
	});

	const navigate = useNavigate();

	useEffect(() => {
		if (toast.visible) {
			const timer = setTimeout(() => {
				setToast({ visible: false, message: "", type: "success" });

				return () => clearTimeout(timer);
			}, 3000);
		}
	}, [toast]);

	// to submit the data and login
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email || !password) {
			setToast({
				visible: true,
				message: "Please fill all the fields",
				type: "error",
			});
			return;
		}

		try {
			const res = await axios.post("http://localhost:5000/api/auth/login", {
				email,
				password,
			});

			if (res.data.user.role !== "admin") {
				setToast({
					visible: true,
					message: "You are not authorized to access this page",
					type: "error",
				});
				return;
			}
			localStorage.setItem("token", res.data.token);
			localStorage.setItem("user", JSON.stringify(res.data.user));
			setToast({
				visible: true,
				message: "Login successful",
				type: "success",
			});
			setTimeout(() => navigate("/"), 1500);
		} catch {
			setToast({
				visible: true,
				message: "Something went wrong, Invalid email and password",
				type: "error",
			});
		}
	};

	const closeToast = () => {
		setToast({
			visible: false,
			message: "",
			type: "success",
		});
	};

	const toastIcon =
		toast.type === "success" ?
			<CheckCircle className={s.toastIconSuccess} size={20} />
		:	<AlertCircle className={s.toastBorderError} size={20} />;

	const toastBorderColor =
		toast.type === "success" ? s.toastBorderSuccess : s.toastBorderError;

	return (
		<div className={s.pageContainer}>
			{toast.visible && (
				<div className={`${s.toastContainer} ${toastBorderColor}`} role='alert'>
					{toastIcon}
					<p className={s.toastMessage}>{toast.message}</p>
					<button onClick={closeToast} className={s.toastCloseBtn}>
						<X size={18} />
					</button>
				</div>
			)}

			<div className={s.card}>
				<div className={s.header}>
					<h1 className={s.title}>Admin Panel</h1>
					<p className={s.subtitle}>Job Portal administration</p>
				</div>

				<form onSubmit={handleSubmit} className={s.form}>
					<div className={s.formGroup}>
						<label className={s.label} htmlFor='email'>
							Email Address
						</label>
						<div className={s.inputWrapper}>
							<div className={s.iconWrapper}>
								<Lock className={s.iconDefault} size={18} />
							</div>

							<input
								type='email'
								id='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className={`${s.inputBase} ${s.inputPr3}`}
								placeholder='admin@jobportal.com'
								required
							/>
						</div>
					</div>

					<div className={s.formGroup}>
						<label htmlFor='password' className={s.label}>
							Password
						</label>
						<div className={s.inputWrapper}>
							<div className={s.iconWrapper}>
								<Lock className={s.iconDefault} size={18} />
							</div>

							<input
								type={showPassword ? "text" : "password"}
								id='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className={`${s.inputBase} ${s.inputPr12}`}
								placeholder='●●●●●'
								required
							/>

							{/* toggle eye password */}
							<div className={s.eyeButtonWrapper}>
								<button
									type='button'
									onClick={() => setShowPassword((s) => !s)}
									className={s.eyeButton}>
									{showPassword ?
										<EyeOff size={18} />
									:	<Eye size={18} />}
								</button>
							</div>
						</div>
					</div>

					{/* submit */}
					<button type='submit' className={s.submitBtn}>
						<LogIn size={18} className={s.submitIcon} />
						Sign In
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
