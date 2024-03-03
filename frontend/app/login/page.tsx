"use client";

import TextLoader from "@/components/ui/TextLoader";
import useRedirect from "@/hooks/useRedirect";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInputs {
	username: string;
	password: string;
}

type AuthResponse = {
	hasError: boolean;
	errorMessage: string;
};

export default function Login() {
	useRedirect({ redirectIfFound: true });

	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<IFormInputs>();
	const onSubmit: SubmitHandler<IFormInputs> = async (formData, event) => {
		try {
			event?.preventDefault();
			setIsLoading(true);
			setMessage("");

			const res = await fetch(`/api/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data: AuthResponse = await res.json();
			if (data.hasError) throw new Error(data.errorMessage);

			setIsLoading(false);
			router.push("/dashboard");
		} catch (error: any) {
			setIsLoading(false);
			setMessage(error.message);
		}
	};

	return (
		<div className="bg-secondary min-h-screen p-10 pt-32">
			<form
				className="drop-shadow-lg bg-white max-w-[500px] m-auto border-2 border-black p-5 rounded-lg"
				onSubmit={handleSubmit(onSubmit)}
				onChange={() => setMessage("")}
			>
				<h2 className="text-2xl font-bold pb-5">Admin Login</h2>
				<div className="pb-3">
					<label className="block mb-1 font-bold" htmlFor="name">
						Username
					</label>
					<input
						placeholder="Username"
						id="username"
						className="border-2 border-black p-2 w-full rounded-lg"
						{...register("username", { required: true })}
					/>
					{errors.username && (
						<p className="text-red-500 italic font-bold">
							Username is required
						</p>
					)}
				</div>

				<div className="pb-3">
					<label className="block mb-1 font-bold" htmlFor="social">
						Password
					</label>
					<input
						placeholder="Password"
						id="password"
						className="border-2 border-black p-2 w-full rounded-lg"
						type="password"
						{...register("password", { required: true })}
					/>
					{errors.password && (
						<p className="text-red-500 italic font-bold">
							Password is required
						</p>
					)}
				</div>

				{message && (
					<p className="pb-3 text-red-500 italic font-bold">
						{message}{" "}
					</p>
				)}
				<button
					className="text-lg font-bold bg-black rounded-lg p-2 text-white"
					type="submit"
				>
					{!isLoading && "Login"}
					{isLoading && <TextLoader loadingText="Loading" />}
				</button>
			</form>
		</div>
	);
}
