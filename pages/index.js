import { useRouter } from "next/router";
import React, { useEffect } from "react";

const index = () => {
	let router = useRouter();
	useEffect(() => {
		let token = sessionStorage.getItem("token");
		let id = sessionStorage.getItem("id");
		if (!id) {
			router.push(`/login/${id}`);
		}
	});
};

export default index;
