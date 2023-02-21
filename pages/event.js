import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import Pagination from "../components/Pagination";
import { FiShare2 } from "react-icons/fi";
import { TiTick } from "react-icons/ti";
import { Carousel } from "react-bootstrap";
import { RxCross2 } from "react-icons/rx";
import { FacebookShareButton, WhatsappShareButton } from "react-share";
import { BsFacebook } from "react-icons/bs";
import { RiWhatsappFill } from "react-icons/ri";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

const event = () => {
	let router = useRouter();

	const [projectName, setProjectName] = useState("");
	const [eventName, setEventName] = useState("");
	const [images, setImages] = useState([]);
	const [selectedImages, setSelectedImages] = useState([]);
	const [selection, setSelection] = useState(false);
	const [selectTab, setSelectTab] = useState(false);
	const [eventId, setEventId] = useState("");
	const [projectId, setProjectId] = useState("");
	const [selectIcon, setSelectIcon] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState();
	const [carouselOpen, setCarouselOpen] = useState(false);
	const [finalButtonShow, setFinalButtonShow] = useState(false);
	const [finalModal, setFinalModal] = useState(false);
	const [mobileShare, setMobileShare] = useState(false);
	const [desktopShare, setDesktopShare] = useState(false);
	const [shareItems, setShareItems] = useState("");
	const [openShare, setOpenShare] = useState(false);
	const [eventDetails, setEventDetails] = useState([]);
	const [loading, setLoading] = useState(false);

	const [currentPage, setCurrentPage] = useState(1);
	const [selectedImagesPage, setSelectedImagesPage] = useState(1);
	const [PageSize, setPageSize] = useState(30);
	const [selectedImagesPageSize, setSelectedImagesPageSize] = useState(30);

	const currentTableData = useMemo(() => {
		console.log(images);
		const firstPageIndex = (currentPage - 1) * PageSize;
		const lastPageIndex = firstPageIndex + PageSize;
		return images.slice(firstPageIndex, lastPageIndex);
	}, [currentPage, images, PageSize]);

	const selectedTableData = useMemo(() => {
		const firstPageIndex = (selectedImagesPage - 1) * selectedImagesPageSize;
		const lastPageIndex = firstPageIndex + selectedImagesPageSize;
		return selectedImages.slice(firstPageIndex, lastPageIndex);
	}, [selectedImagesPage, selectedImages, selectedImagesPageSize]);

	const getData = async (id, pin) => {
		if (pin.length == 6) {
			try {
				const { data } = await axios.get(
					`${process.env.DOMAIN_NAME}/api/client/get-images/${id}/${pin}`
				);
				console.log(data);
				if (data.success) {
					console.log(data.event);
					setProjectName(data.event.projectName);
					setEventName(data.event.eventName);
					setImages(data.event.uploadedImages);
					setSelectedImages(data.event.selectedImages);
					setSelection(data.event.selection);
					setEventId(data.event._id);
					setProjectId(data.event.projectId);
					setEventDetails(data.event);
				}
			} catch (error) {
				console.log({ error });
			}
		}
	};

	useEffect(() => {
		let id = sessionStorage.getItem("id");
		let pin = sessionStorage.getItem("pin");
		console.log(pin);
		console.log(router.query.selectedImages);
		if (router.query.selectedImages) {
			setSelectedImages(router.query.selectedImages);
		}

		getData(id, pin);
		const handleContextmenu = (e) => {
			e.preventDefault();
		};
		document.addEventListener("contextmenu", handleContextmenu);
		return function cleanup() {
			document.removeEventListener("contextmenu", handleContextmenu);
		};
	}, []);

	// const handleImage = async (image, item, type) => {
	// 	// let index = selectedImages.indexOf(image)
	// 	console.log({ image });
	// 	if (type == "uploaded") {
	// 		let ind = images.indexOf(item);
	// 		console.log({ ind });
	// 		router.push({
	// 			pathname: "/carousel",
	// 			query: {
	// 				images: images,
	// 				selectedImages,
	// 				eventId,
	// 				projectId,
	// 				image: item,
	// 				index: ind,
	// 				selection,
	// 			},
	// 		});
	// 	} else if (type == "selected") {
	// 		let ind = selectedImages.indexOf(image);

	// 		router.push({
	// 			pathname: "/carousel",
	// 			query: {
	// 				images: selectedImages,
	// 				selectedImages,
	// 				eventId,
	// 				projectId,
	// 				image: item,
	// 				index: ind,
	// 				selection,
	// 			},
	// 		});
	// 	} else {
	// 		console.log("type not found");
	// 	}
	// };
	const handleSelect = (id) => {
		if (!selection) {
			console.log("warning");
			Swal.fire({
				title: "Warning",
				text: "Ask access from photographer",
				icon: "warning",
				button: "OK",
			});
		} else {
			setSelectedImages((selectedImages) => [...selectedImages, id]);

			setSelectIcon(true);
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
	const handleUploadImages = async () => {
		console.log(selectedImages);

		// console.log(userDetails._id);

		try {
			const { data } = await axios.put(
				`${process.env.DOMAIN_NAME}/api/client/select-images/${eventId}`,
				selectedImages
			);
			console.log(data);
			if (data.success) {
				Swal.fire({
					title: "Success",
					text: data.msg,
					icon: "success",
					button: "OK",
				});
				setSelectedImages(data.event.selectedImages);
				setFinalButtonShow(true);
				// setSelectedImagesLen(data.event.selectedImages.length);
				// let ud = JSON.stringify(data.event);
				// localStorage.setItem("user", ud);
				// setModalIsOpen(false);
				// setFinalModal(false);
				// setFinalShow(true);
			} else {
				Swal.fire({
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

	const handleImageSelected = (source) => {
		if (window.matchMedia("(min-width: 768px)").matches) {
			// window.scrollTo(2000, 0);
			window.scrollTo({
				top: 300,
				left: 100,
				behavior: "smooth",
			});
			let i = images.indexOf(source);
			console.log(i);
			setSelectedIndex(i);
			setCarouselOpen(true);
		} else {
			console.log("Hello");
		}
	};

	const handleCloseCarousel = () => {
		setCarouselOpen(false);
	};
	const handleFinalModalShow = () => {
		setFinalModal(true);
	};
	const handleFinalModalClose = () => {
		setFinalModal(false);
	};
	const handleFinalImages = async () => {
		setFinalModal(false);
		setLoading(true);
		try {
			const { data } = await axios.put(
				`${process.env.DOMAIN_NAME}/api/client/finalise-selection/${eventId}`,
				selectedImages
			);
			console.log(data);
			if (data.success) {
				Swal.fire({
					title: "Success",
					text: data.msg,
					icon: "success",
					button: "OK",
				});
				setLoading(false);

				setSelectedImages(data.event.selectedImages);
				setSelection(data.event.selection);
				setFinalModal(false);
				router.push({ pathname: "/login" });
				// router.push("/thankyou");
			} else {
				Swal.fire({
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
	const handleMobileShare = (item) => {
		console.log(item);
		console.log({ shareItems });
		setMobileShare(!mobileShare);
		setShareItems(item);
	};

	const handleShare = (item) => {
		setOpenShare(!openShare);
		setShareItems(item);
	};

	return (
		<div className="flex flex-col items-center h-screen min-w-screen p-3 md:p-10">
			<div className="bg-white rounded-xl shadow-lg p-3 md:p-10 w-screen text-center mb-5">
				<h1 className="text-gray-800 font-bold text-lg">{projectName}</h1>
				<h1 className="test-gray-800 font-semibold text-lg my-2">
					{eventName}
				</h1>
			</div>
			<div className="bg-white rounded-xl shadow-lg p-3 md:p-10 w-screen text-center">
				{!carouselOpen && (
					<div className="sticky top-0 bg-gray-100 rounded-md z-50 p-3">
						<div className="flex justify-center items-center gap-5 ">
							<button
								className={
									selectTab
										? "p-3 bg-gray-100 rounded-lg shadow-xl text-gray-500 font-bold  hover:bg-gray-700 hover:text-white"
										: "p-3 bg-gray-700 rounded-lg shadow-xl text-white font-bold  hover:bg-gray-300 hover:text-gray-700"
								}
								onClick={() => {
									setSelectTab(false);
								}}
							>
								Uploaded Images - {images.length}
							</button>
							<button
								className={
									!selectTab
										? "p-3 bg-gray-100 rounded-lg shadow-xl text-gray-500 font-bold  hover:bg-gray-700 hover:text-white"
										: "p-3 bg-gray-700 rounded-lg shadow-xl text-white font-bold hover:bg-gray-300 hover:text-gray-700"
								}
								onClick={() => {
									setSelectTab(true);
								}}
							>
								Selected Images - {selectedImages.length}
							</button>
						</div>
					</div>
				)}
				{carouselOpen && (
					<div className="h-screen flex justify-center items-center text-gray-900 relative mt-5">
						<button
							className="rounded-full bg-red-600 p-3 text-white absolute top-5 right-5 z-50 shadow-xl hover:bg-red-400 hover:text-white "
							onClick={handleCloseCarousel}
						>
							<RxCross2 size={20} className="text-xl font-bold " />
						</button>
						<Carousel
							defaultActiveIndex={selectedIndex}
							indicators={false}
							interval={null}
						>
							{images.map((item) => {
								let image;

								let createdDate = eventDetails.createdAt;
								console.log({ createdDate });
								let date = new Date("2023-01-17");
								console.log({ date });
								let cDate = new Date(createdDate);
								console.log({ cDate });
								console.log("comparision", date > cDate);
								if (date < cDate) {
									image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/${eventId}/${item}`;
								} else {
									image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/old/${eventId}/${item}`;
								}
								// let image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/${eventId}/${item}`;
								let img = encodeURI(image);
								// console.log(encodeURI(image));
								let selected = selectedImages.includes(item);
								return (
									<Carousel.Item>
										<div className="text-center h-screen w-screen flex flex-col items-center justify-center">
											<button
												className="rounded-full bg-gray-100 p-3 text-gray-800 absolute top-5 left-10 z-50 shadow-xl hover:bg-gray-700 hover:text-white"
												onClick={() => handleShare(item)}
											>
												<FiShare2 size={30} className="text-xl font-bold " />
											</button>
											{shareItems === item && openShare && (
												<div className="absolute top-5 left-32 z-50 bg-gray-100 shadow-xl p-3 rounded-xl">
													<div className="flex items-center justify-center gap-3">
														<div className="">
															<FacebookShareButton url={img}>
																<BsFacebook size={40} color="3B5998" />
															</FacebookShareButton>
														</div>
														<div className="">
															<WhatsappShareButton url={img}>
																<RiWhatsappFill
																	size={40}
																	color="rgb(78 197 91)"
																/>
															</WhatsappShareButton>
														</div>
													</div>
												</div>
											)}
											<div className="w-[500px] h-[500px] flex justify-center items-center">
												<img
													src={image}
													alt="Images"
													// objectFit="contain"
													className="rounded-xl  z-0 object-contain"
												/>
											</div>

											{/* <img src={image} /> */}

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
				)}
				{!selectTab && !carouselOpen && (
					<>
						<div className="flex flex-col justify-center items-center">
							{/* <div className="grid grid-flow-row auto-rows-max md:grid-cols-4 gap-2 mt-5 mx-auto"> */}
							<div className="grid md:grid-cols-4 gap-2 mt-5 mx-auto">
								{/* <div className="columns-2 md:columns-3 lg:columns-4"> */}
								{currentTableData.map((item) => {
									let image;

									let createdDate = eventDetails.createdAt;
									console.log({ createdDate });
									let date = new Date("2023-01-17");
									console.log({ date });
									let cDate = new Date(createdDate);
									console.log({ cDate });
									console.log("comparision", date > cDate);
									if (date < cDate) {
										image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/${eventId}/${item}`;
									} else {
										image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/old/${eventId}/${item}`;
									}
									let img = encodeURI(image);
									// console.log(encodeURI(image));
									let selected = selectedImages.includes(item);
									return (
										<div className="flex justify-center mb-2 relative shadow-xl rounded-xl">
											<button
												className="rounded-full bg-gray-100 p-3 text-gray-800 absolute top-5 left-5 z-30 shadow-xl hover:bg-gray-700 hover:text-white"
												onClick={() => handleMobileShare(item)}
											>
												<FiShare2 size={20} className="text-xl font-bold" />
											</button>
											{shareItems === item && mobileShare && (
												<div className="absolute top-5 left-20 z-50 bg-gray-100 shadow-xl p-2 rounded-xl">
													<div className="flex items-center justify-center gap-3">
														<div className="">
															<FacebookShareButton url={img}>
																<BsFacebook size={20} color="3B5998" />
															</FacebookShareButton>
														</div>
														<div className="">
															<WhatsappShareButton url={img}>
																<RiWhatsappFill
																	size={20}
																	color="rgb(78 197 91)"
																/>
															</WhatsappShareButton>
														</div>
													</div>
												</div>
											)}
											<div className="md:w-[300px] md:h-[300px]">
												<img
													src={image}
													alt="Images"
													className="rounded-xl  z-0 object-contain md:w-[90%] md:h-[90%] m-auto"
													// onClick={() => {
													// 	handleImage(image, item, "uploaded");
													// }}
													onClick={() => handleImageSelected(item)}
												/>
											</div>
											{selected ? (
												<button
													className="absolute bg-green-500 p-3 rounded-full bottom-5 shadow-2xl"
													onClick={(e) => handleUnselect(item)}
												>
													<TiTick size={20} color="white" />
												</button>
											) : (
												<button
													className="absolute bg-gray-100 p-3 rounded-full bottom-5 shadow-2xl"
													onClick={(e) => handleSelect(item)}
												>
													<TiTick size={20} />
												</button>
											)}
										</div>
									);
								})}
							</div>
							{images.length > 30 && (
								<div className="self-end rounded-xl shadow-xl p-2 border-gray-400 border-2 m-3">
									<p className="font-semibold text-md text-gray-800">
										Images per Page
									</p>

									<select
										onChange={(e) => {
											console.log(e.target.value);
											let ps = parseInt(e.target.value);
											console.log(ps);
											setPageSize(ps);
											setCurrentPage(1);
										}}
										className="border-2 p-1 rounded-lg cursor-pointer"
									>
										<option value="30">30</option>
										<option value="50">50</option>
										<option value="100">100</option>
									</select>
								</div>
							)}
							<Pagination
								className="pagination-bar"
								currentPage={currentPage}
								totalCount={images.length}
								pageSize={PageSize}
								onPageChange={(page) => setCurrentPage(page)}
							/>
							{selection && (
								<button
									className="p-3 bg-gray-700 rounded-lg shadow-xl text-white font-bold hover:bg-gray-300 hover:text-gray-700 w-60 mt-2"
									onClick={handleUploadImages}
								>
									Save
								</button>
							)}
						</div>
					</>
				)}
				{selectTab && !carouselOpen && (
					<div className="flex flex-col justify-center items-center">
						{finalButtonShow && (
							<button
								className="self-end bg-gray-800 text-white font-bold p-4 hover:bg-gray-300 rounded-xl shadow-xl hover:text-gray-800"
								onClick={handleFinalModalShow}
							>
								Finalize
							</button>
						)}
						<div className="grid grid-flow-row auto-rows-max md:grid-cols-4 gap-2 mt-5 mx-auto">
							{console.log({ selectedTableData })}
							{selectedTableData.map((item) => {
								let image;

								let createdDate = eventDetails.createdAt;
								console.log({ createdDate });
								let date = new Date("2023-01-17");
								console.log({ date });
								let cDate = new Date(createdDate);
								console.log({ cDate });
								console.log("comparision", date > cDate);
								if (date < cDate) {
									image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/${eventId}/${item}`;
								} else {
									image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/old/${eventId}/${item}`;
								}
								// let image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/${eventId}/${item}`;
								let img = encodeURI(image);
								// console.log(encodeURI(image));
								let selected = selectedImages.includes(item);
								return (
									<div className="flex justify-center  mb-2 relative shadow-xl rounded-xl">
										<button
											className="rounded-full bg-gray-100 p-3 text-gray-800 absolute top-5 left-5 z-40 shadow-xl hover:bg-gray-700 hover:text-white"
											onClick={() => handleMobileShare(item)}
										>
											<FiShare2 size={20} className="text-xl font-bold" />
										</button>
										{shareItems === item && mobileShare && (
											<div className="absolute top-5 left-20 z-50 bg-gray-100 shadow-xl p-2 rounded-xl">
												<div className="flex items-center justify-center gap-3">
													<div className="">
														<FacebookShareButton url={img}>
															<BsFacebook size={20} color="3B5998" />
														</FacebookShareButton>
													</div>
													<div className="">
														<WhatsappShareButton url={img}>
															<RiWhatsappFill
																size={20}
																color="rgb(78 197 91)"
															/>
														</WhatsappShareButton>
													</div>
												</div>
											</div>
										)}
										<div className="md:w-[300px] md:h-[300px]">
											<img
												src={image}
												alt="Images"
												className="rounded-xl  z-0 object-contain md:w-[90%] md:h-[90%] m-auto"
												// onClick={() => {
												// 	handleImage(image, item, "uploaded");
												// }}
												// onClick={() => handleImageSelected(item)}
											/>
										</div>
										{/* <img
											src={image}
											width={300}
											height={200}
											alt="/"
											className="rounded-xl  z-0 object-contain"

											// onClick={() => {
											// 	handleImageSelected(item);
											// }}
										/> */}
										{selected ? (
											<button
												className="absolute bg-green-500 p-3 rounded-full bottom-5 shadow-2xl"
												onClick={(e) => handleUnselect(item)}
											>
												<TiTick size={20} color="white" />
											</button>
										) : (
											<button
												className="absolute bg-gray-100 p-3 rounded-full bottom-5 shadow-2xl"
												onClick={(e) => handleSelect(item)}
											>
												<TiTick size={20} />
											</button>
										)}
									</div>
								);
							})}
						</div>
						{selectedImages.length > 30 && (
							<div className="self-end rounded-xl shadow-xl p-2 border-gray-400 border-2 m-3">
								<p className="font-semibold text-lg text-gray-800">
									Images per Page
								</p>

								<select
									onChange={(e) => {
										console.log(e.target.value);
										let ps = parseInt(e.target.value);
										console.log(ps);
										setSelectedImagesPageSize(ps);
										setSelectedImagesPage(1);
									}}
									className="border-2 p-1 rounded-lg cursor-pointer"
								>
									<option value="30">30</option>
									<option value="50">50</option>
									<option value="100">100</option>
								</select>
							</div>
						)}
						<Pagination
							className="pagination-bar"
							currentPage={selectedImagesPage}
							totalCount={selectedImages.length}
							pageSize={selectedImagesPageSize}
							onPageChange={(page) => setSelectedImagesPage(page)}
						/>
						{selection && (
							<button
								className="p-3 bg-gray-700 rounded-lg shadow-xl text-white font-bold hover:bg-gray-300 hover:text-gray-700 w-60 mt-2"
								onClick={handleUploadImages}
							>
								Save
							</button>
						)}
					</div>
				)}
				{finalModal && (
					<Modal
						show={finalModal}
						size="md"
						aria-labelledby="contained-modal-title-vcenter"
						centered
					>
						<Modal.Header closeButton>
							<Modal.Title id="contained-modal-title-vcenter">
								Finalize Images
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<p>Are you finalizing this event ?</p>
						</Modal.Body>
						<Modal.Footer>
							<button
								onClick={handleFinalModalClose}
								className="p-3 w-20 bg-white text-gray-900 border-2 border-gray-800 rounded-xl"
							>
								Close
							</button>
							<button
								className="p-3 w-20 bg-gray-900 text-white rounded-xl hover:bg-gray-400"
								onClick={handleFinalImages}
							>
								Yes
							</button>
						</Modal.Footer>
					</Modal>
				)}
				{loading && (
					<Modal
						show={loading}
						size="md"
						aria-labelledby="contained-modal-title-vcenter"
						centered
					>
						<Modal.Header closeButton>
							<Modal.Title id="contained-modal-title-vcenter">
								Finalize Images
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<p>Please wait ...</p>
						</Modal.Body>
					</Modal>
				)}
			</div>
		</div>
	);
};

export default event;
