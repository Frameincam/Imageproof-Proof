import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import { Carousel } from "react-bootstrap";
import { FiShare2 } from "react-icons/fi";
import axios from "axios";

const carousel = () => {
	const [eventId, setEventId] = useState("");
	const [projectId, setProjectId] = useState("");
	const [images, setImages] = useState([]);
	const [selectedImage, setSelectedImage] = useState("");
	const [index, setIndex] = useState(0);
	const [image, setImage] = useState("");
	const [selectedImages, setSelectedImages] = useState([]);
	const [selected, setSelected] = useState(false);
	const [selection, setSelection] = useState(false);
	let router = useRouter();
	let p = router.query;
	let img = p.image;
	console.log({ p });

	useEffect(() => {
		if (img) {
			setEventId(router.query.eventId);
			setProjectId(router.query.projectId);
			setImages(router.query.images);
			setImage(router.query.image);
			setIndex(router.query.index);
			if (router.query.selectedImages) {
				setSelectedImages(router.query.selectedImages);
				setSelected(selectedImages.includes(router.query.image));
			}
			setSelection(router.query.selection);
			let pics = router.query.images;
			// if (pics) {
			// 	let i = pics.indexOf(router.query.image);
			// 	setIndex(i);
			// }
			let img = router.query.image;

			setSelectedImage(
				`${process.env.DOMAIN_NAME}/api/photographer/get-images/${router.query.eventId}/${img}`
			);
		}
	}, [img, selected]);

	console.log({ selectedImage }, { index });

	const handleBack = async () => {
		try {
			const { data } = await axios.put(
				`${process.env.DOMAIN_NAME}/api/client/select-images/${eventId}`,
				selectedImages
			);
			console.log(data);
			if (data.success) {
				// swal({
				// 	title: "Success",
				// 	text: data.msg,
				// 	icon: "success",
				// 	button: "OK",
				// });
				router.push({
					pathname: "/event",
					query: { eventId: eventId, projectId: projectId, selectedImages },
				});
				// setSelectedImages(data.event.selectedImages);
				// setSelectedImagesLen(data.event.selectedImages.length);
				// let ud = JSON.stringify(data.event);
				// localStorage.setItem("user", ud);
				// setModalIsOpen(false);
				// setFinalModal(false);
				// setFinalShow(true);
			} else {
				swal({
					title: "Error",
					text: data.msg,
					icon: "error",
					button: "OK",
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleSelect = (id) => {
		if (!selection) {
			console.log("warning");
			// swal({
			// 	title: "Warning",
			// 	text: "Ask access from photographer",
			// 	icon: "warning",
			// 	button: "OK",
			// });
		} else {
			setSelectedImages((selectedImages) => [...selectedImages, id]);
			// setSelected(selImgs.includes(id));

			// console.log(selectedImages.length);

			// setSelectIcon(true);
		}
	};
	const handleUnselect = (id) => {
		if (!selection) {
			console.log("warning");
			// swal({
			// 	title: "Warning",
			// 	text: "Ask access from photographer",
			// 	icon: "warning",
			// 	button: "OK",
			// });
		} else {
			console.log(id);
			console.log(selectedImages);
			let imgId = selectedImages.indexOf(id);
			console.log(imgId);
			if (imgId !== -1) {
				let images = selectedImages.filter((iId) => iId !== id);

				console.log(images, "if");
				setSelectedImages(images);
			}
			console.log(imgId);
		}
	};

	return (
		<>
			<div className="h-screen flex justify-center items-center text-gray-900 relative">
				<button
					className="rounded-full bg-red-600 p-3 text-white absolute top-5 right-5 z-50 shadow-xl hover:bg-red-400 hover:text-white"
					onClick={handleBack}
				>
					<RxCross2 size={20} className="text-xl font-bold " />
				</button>
				<Carousel defaultActiveIndex={index} indicators={false} interval={null}>
					{images.map((item) => {
						let image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/${eventId}/${item}`;
						let img = encodeURI(image);
						// console.log(encodeURI(image));
						let selected = selectedImages.includes(item);
						return (
							<Carousel.Item>
								<div className="text-center h-screen w-screen flex flex-col items-center justify-center">
									<button className="rounded-full bg-gray-100 p-3 text-gray-800 absolute top-5 left-5 z-50 shadow-xl hover:bg-gray-700 hover:text-white">
										<FiShare2 size={30} className="text-xl font-bold " />
									</button>
									<Image
										src={image}
										width={500}
										height={500}
										alt="/"
										className="rounded-xl  z-0"
									/>
									{selected ? (
										<button
											className=" bg-green-500 p-3 rounded-full shadow-2xl absolute bottom-8"
											onClick={(e) => handleUnselect(item)}
										>
											<TiTick size={40} color="white" />
										</button>
									) : (
										<button
											className=" bg-gray-100 p-3 rounded-full shadow-2xl absolute bottom-8"
											onClick={(e) => handleSelect(item)}
										>
											<TiTick size={40} />
										</button>
									)}
								</div>
							</Carousel.Item>
						);
					})}
				</Carousel>
			</div>
		</>
	);
};

export default carousel;
