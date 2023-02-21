import { useRouter, isReady } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import logo from "../../public/imgproof.png";
import Image from "next/image";
import Swal from "sweetalert2";

const index = () => {
	const [projectName, setProjectName] = useState("");
	const [eventName, setEventName] = useState("");
	let router = useRouter();

	let pinRef = useRef();

	const getData = async (id) => {
		try {
			const { data } = await axios.get(
				`${process.env.DOMAIN_NAME}/api/client/get-event/${id}`
			);
			console.log(data);
			if (data.success) {
				setProjectName(data.projectName);
				setEventName(data.eventName);
			}
		} catch (error) {
			console.log({ error });
		}
	};

	let id = router.query.id;
	useEffect(() => {
		if (id) {
			getData(id);
			sessionStorage.setItem("id", id);
		}
	}, [id]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(pinRef);
		if (pinRef.current.value.length == 6) {
			try {
				const { data } = await axios.get(
					`${process.env.DOMAIN_NAME}/api/client/get-images/${id}/${pinRef.current.value}`
				);
				console.log(data);
				sessionStorage.setItem("pin", pinRef.current.value);
				if (data.success) {
					console.log(data.completed);
					if (!data.event.completed) {
						Swal.fire({
							title: "Success",
							text: data.msg,
							icon: "success",
							button: "OK",
						});
						router.push({
							pathname: "/event",
						});
					} else {
						Swal.fire({
							title: "Error",
							text: "Event Completed",
							icon: "error",
							button: "OK",
						});
					}
				} else {
					Swal.fire({
						title: "Error",
						text: data.msg,
						icon: "error",
						button: "OK",
					});
				}
			} catch (error) {
				console.log({ error });
			}
		}
	};

	return (
		<div className="flex justify-center items-center h-screen w-screen">
			<div className="shadow-2xl p-10 rounded-xl bg-white md:p-20">
				<div className="flex justify-center items-center mb-5">
					<Image src={logo} alt="logo" height={60} width={200} />
				</div>
				<h1 className="font-semibold text-lg text-center my-2">
					{projectName}
				</h1>
				<h1 className="font-semibold text-lg text-center my-2">{eventName}</h1>
				<form className="flex flex-col mt-5" onSubmit={handleSubmit}>
					<h1 className="font-bold text-lg text-center my-2">
						Please Enter PIN
					</h1>
					<input
						type="text"
						required
						className="border-black-600 border-2 rounded mb-2 p-3 w-full outline-none md:w-96 text-center"
						placeholder="PIN"
						autoComplete="off"
						maxLength={6}
						minLength={6}
						ref={pinRef}
					/>

					<div className="text-right">
						<button
							type="submit"
							className="rounded text-white bg-black h-10 mt-2 w-full hover:bg-gray-400 cursor-pointer text-xl font-bold"
						>
							Login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default index;
