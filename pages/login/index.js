import { useRouter } from "next/router";
import React, { useEffect } from "react";

const index = () => {
	let router = useRouter();
	let id;
	useEffect(() => {
		if (router.query.id) {
			id = router.query.id;
		} else {
			id = sessionStorage.getItem("id");
		}
		if (id) {
			router.push(`/login/${id}`);
			sessionStorage.setItem("id", id);
		}
	}, [id]);
};

export default index;
